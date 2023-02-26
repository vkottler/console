import assert from "assert";

import {
  flip,
  isHorizontal,
  isVertical,
  Translation,
} from "../cartesian/Translation";
import { AreaUpdateHandler, GridArea, INIT_ID } from "./GridArea";
import { GridDimensions } from "./GridDimensions";
import {
  apply,
  EMPTY,
  isColumnEmpty,
  isRowEmpty,
  validArea,
} from "./GridLayoutInterface";
import { GridLocation } from "./GridLocation";

function newRow(columns: number): string[] {
  const newRow = [];
  for (let col = 0; col < columns; col++) {
    newRow.push(EMPTY);
  }
  return newRow;
}

export class GridLayout {
  dimensions: GridDimensions;
  cells: string[][];
  nextAreaId: number;
  byId: Map<number, GridArea>;

  constructor() {
    this.dimensions = new GridDimensions();
    this.cells = [[EMPTY]];
    this.nextAreaId = 0;
    this.byId = new Map<number, GridArea>();
  }

  get width(): number {
    return this.dimensions.width;
  }

  get height(): number {
    return this.dimensions.height;
  }

  validLocation(location: GridLocation, dimensions?: GridDimensions): boolean {
    return location.inBounds(this.dimensions, dimensions);
  }

  validArea(area: GridArea, assign = false): boolean {
    return validArea(this, area, assign);
  }

  #getNextAreaId(): number {
    const result = this.nextAreaId;
    this.nextAreaId++;
    return result;
  }

  assignId(area: GridArea, element?: HTMLElement) {
    if (area.areaId == INIT_ID) {
      area.areaId = this.#getNextAreaId();
      this.byId.set(area.areaId, area);
    }
    if (element != undefined) {
      area.apply(element);
    }
  }

  *areas(
    minRow = 0,
    minColumn = 0,
    maxRow = -1,
    maxColumn = -1
  ): Generator<GridArea> {
    if (maxRow == -1) {
      maxRow = this.height;
    }

    if (maxColumn == -1) {
      maxColumn = this.width;
    }

    for (const area of this.byId.values()) {
      const bottomRight = area.bottomRight;
      if (
        area.row >= minRow &&
        area.column >= minColumn &&
        bottomRight.row <= maxRow &&
        bottomRight.column <= maxColumn
      ) {
        yield area;
      }
    }
  }

  createArea(
    element?: HTMLElement,
    location?: GridLocation,
    dimensions?: GridDimensions,
    handler?: AreaUpdateHandler
  ): GridArea {
    const area = new GridArea(location, dimensions, handler);
    assert(this.validLocation(area.location));
    this.assignId(area, element);
    return area;
  }

  /**
   * Determine if a row is empty.
   */
  #removeEmptyRow(row: number): boolean {
    let result = isRowEmpty(this, row);

    /* Don't remove the only row. */
    result &&= this.dimensions.rows > 1;

    if (result) {
      /*
       * Update area locations for any area beyond the removed row. These
       * areas need 1 subtracted to their row coordinate because the overall
       * grid has shrunk.
       */
      for (const area of this.areas(row)) {
        assert(area.translate(Translation.up));
      }

      this.cells.splice(row, 1);
      this.dimensions.rows -= 1;
    }

    return result;
  }

  /**
   * Determine if a column is empty.
   */
  #removeEmptyColumn(column: number): boolean {
    let result = isColumnEmpty(this, column);

    /* Don't remove the only column. */
    result &&= this.dimensions.columns > 1;

    if (result) {
      /*
       * Update area locations for any area beyond the removed column. These
       * areas need 1 subtracted to their column coordinate because the overall
       * grid has shrunk.
       */
      for (const area of this.areas(0, column)) {
        assert(area.translate(Translation.left));
      }

      /* Remove an element in the underlying grid cells. */
      for (let row = 0; row < this.dimensions.rows; row++) {
        this.cells[row].splice(column, 1);
      }
      this.dimensions.columns -= 1;
    }

    return result;
  }

  contract(direction: Translation, element?: HTMLElement): boolean {
    let result = false;

    switch (direction) {
      /* Attempt to remove the bottom row. */
      case Translation.up:
        result = this.#removeEmptyRow(this.dimensions.rows - 1);
        break;
      /* Attempt to remove the top row. */
      case Translation.down:
        result = this.#removeEmptyRow(0);
        break;
      /* Attempt to remove the furthest-right column. */
      case Translation.left:
        result = this.#removeEmptyColumn(this.dimensions.columns - 1);
        break;
      /* Attempt to remove the furthest-left column. */
      case Translation.right:
        result = this.#removeEmptyColumn(0);
        break;
    }

    if (result && element != undefined) {
      this.apply(element);
    }

    return result;
  }

  expand(direction: Translation, element?: HTMLElement): boolean {
    switch (direction) {
      case Translation.up:
        this.cells.unshift(newRow(this.dimensions.columns));
        break;
      case Translation.down:
        this.cells.push(newRow(this.dimensions.columns));
        break;
      case Translation.left:
        for (let row = 0; row < this.dimensions.rows; row++) {
          this.cells[row].unshift(EMPTY);
        }
        break;
      case Translation.right:
        for (let row = 0; row < this.dimensions.rows; row++) {
          this.cells[row].push(EMPTY);
        }
        break;
    }

    if (isVertical(direction)) {
      this.dimensions.rows++;
    }
    if (isHorizontal(direction)) {
      this.dimensions.columns++;
    }

    /*
     * If the grid expanded up or to the left, it moves the origin in that
     * direction. Translate all areas in the opposite direction to reflect
     * their true positions.
     */
    if (direction == Translation.left || direction == Translation.up) {
      const flipped = flip(direction);
      for (const area of this.areas()) {
        area.translate(flipped);
      }
    }

    if (element != undefined) {
      this.apply(element);
    }

    return true;
  }

  apply(element: HTMLElement) {
    apply(this, element);
  }
}
