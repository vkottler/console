import assert from "assert";

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

export class GridArea {
  location: GridLocation;
  dimensions: GridDimensions;
  areaId: number;

  constructor(
    location?: GridLocation,
    dimensions?: GridDimensions,
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
    this.areaId = areaId;
  }

  translate(
    direction: Translation,
    bounds?: GridDimensions,
    update = true
  ): GridLocation | undefined {
    return this.location.translate(direction, bounds, this.dimensions, update);
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
}
