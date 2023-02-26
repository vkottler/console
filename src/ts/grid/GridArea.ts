import assert from "assert";

import {
  isBottom,
  isRight,
  RectangleCorner,
} from "../cartesian/RectangleCorner";
import {
  isHorizontal,
  isVertical,
  Translation,
} from "../cartesian/Translation";
import { GridDimensions } from "./GridDimensions";
import { GridLocation } from "./GridLocation";

export const EMPTY = ".";
export const INIT_ID = -1;

function areaName(areaId: number): string {
  assert(areaId >= 0);
  return "area-" + areaId.toString();
}

export type AreaUpdateHandler = (area: GridArea) => void;

export class GridArea {
  location: GridLocation;
  dimensions: GridDimensions;
  areaId: number;
  handler: AreaUpdateHandler | undefined;

  constructor(
    location?: GridLocation,
    dimensions?: GridDimensions,
    handler?: AreaUpdateHandler,
    areaId = INIT_ID
  ) {
    if (location == undefined) {
      location = new GridLocation();
    }
    if (dimensions == undefined) {
      dimensions = new GridDimensions();
    }
    this.location = location;
    this.dimensions = dimensions;
    this.handler = handler;
    this.areaId = areaId;
  }

  #signalHandler() {
    if (this.handler != undefined) {
      this.handler(this);
    }
  }

  cornerLocation(corner: RectangleCorner): GridLocation {
    const result = new GridLocation(this.row, this.column);

    /* Corners on the right need our width added. */
    if (isRight(corner)) {
      result.column += this.width;
    }

    /* Corners on the bottom need our height added. */
    if (isBottom(corner)) {
      result.row += this.height;
    }

    return result;
  }

  get topLeft(): GridLocation {
    return this.cornerLocation(RectangleCorner.topLeft);
  }

  get topRight(): GridLocation {
    return this.cornerLocation(RectangleCorner.topRight);
  }

  get bottomLeft(): GridLocation {
    return this.cornerLocation(RectangleCorner.bottomLeft);
  }

  get bottomRight(): GridLocation {
    return this.cornerLocation(RectangleCorner.bottomRight);
  }

  inArea(location: GridLocation): boolean {
    let result = location.row > this.row && location.column > this.column;

    if (result) {
      const bottomRight = this.bottomRight;
      result =
        location.row < bottomRight.row && location.column < bottomRight.column;
    }

    return result;
  }

  *corners(): Generator<GridLocation> {
    yield this.topLeft;
    yield this.topRight;
    yield this.bottomRight;
    yield this.bottomLeft;
  }

  *locations(): Generator<GridLocation> {
    const result = new GridLocation();

    const bottomRight = this.bottomRight;
    for (let row = this.row; row <= bottomRight.row; row++) {
      result.row = row;
      for (let column = this.column; column <= bottomRight.column; column++) {
        result.column = column;
        yield result;
      }
    }
  }

  translate(
    direction: Translation,
    bounds?: GridDimensions,
    update = true
  ): GridLocation | undefined {
    const result = this.location.translate(
      direction,
      bounds,
      this.dimensions,
      update
    );
    if (result != undefined) {
      this.#signalHandler();
    }
    return result;
  }

  contract(direction: Translation, update = true): boolean {
    if (isVertical(direction)) {
      /* Ensure height is greater than one. */
      if (this.height <= 1) {
        return false;
      }
      if (update) {
        this.dimensions.rows--;
      }
    }

    /* Ensure width is greater than one. */
    if (isHorizontal(direction)) {
      if (this.width <= 1) {
        return false;
      }
      if (update) {
        this.dimensions.columns--;
      }
    }

    /*
     * When contracting down or to the right, we also need to translate in that
     * direction.
     */
    if (direction == Translation.right || direction == Translation.down) {
      assert(this.translate(direction, undefined, update) != undefined);
    } else {
      this.#signalHandler();
    }

    return true;
  }

  expand(
    direction: Translation,
    bounds?: GridDimensions,
    update = true
  ): boolean {
    let result = true;
    let location = this.location;

    /*
     * When moving up or left, we need to move our location. Ensure that this
     * translation is possible.
     */
    if (direction == Translation.up || direction == Translation.left) {
      const newLoc = this.translate(direction, bounds, update);
      if (newLoc == undefined) {
        return false;
      }
      location = newLoc;
    }

    /* Check bounds if they were provided. */
    if (bounds != undefined) {
      if (isVertical(direction)) {
        if (location.row + this.height >= bounds.rows) {
          result = false;
        }
      }
      if (isHorizontal(direction)) {
        if (location.column + this.width >= bounds.columns) {
          result = false;
        }
      }
    }

    /*
     * Update dimensions if the expansion is valid and this instance should
     * be updated.
     */
    if (result && update) {
      if (isVertical(direction)) {
        this.dimensions.rows++;
      }
      if (isHorizontal(direction)) {
        this.dimensions.columns++;
      }
      this.#signalHandler();
    }

    return result;
  }

  get name(): string {
    return areaName(this.areaId);
  }

  get height(): number {
    return this.dimensions.height;
  }

  get width(): number {
    return this.dimensions.width;
  }

  get row() {
    return this.location.row;
  }

  get column() {
    return this.location.column;
  }

  apply(element: HTMLElement) {
    element.style.gridArea = this.name;
  }
}
