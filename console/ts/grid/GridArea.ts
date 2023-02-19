import assert from "assert";

import { Translation } from "../cartesian/Translation";
import { GridDimensions } from "./GridDimensions";

export const EMPTY = ".";
export const INIT_ID = -1;

export class GridLocation {
  row: number;
  column: number;

  constructor(row = 0, column = 0) {
    this.row = row;
    this.column = column;
  }
}

export function areaName(areaId: number): string {
  assert(areaId >= 0);
  return "area-" + areaId.toString();
}

export class GridArea {
  location: GridLocation;
  dimensions: GridDimensions;
  areaId: number;

  constructor(
    location?: GridLocation,
    height = 1,
    width = 1,
    areaId = INIT_ID
  ) {
    if (location == undefined) {
      location = new GridLocation();
    }
    this.location = location;
    this.dimensions = new GridDimensions(height, width);
    this.areaId = areaId;
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

  translate(direction: Translation, dimensions: GridDimensions): boolean {
    let valid = false;
    const result = new GridLocation(this.row, this.column);

    switch (direction) {
      /*
       * If we're on any row besides the first one, we can return the row
       * directly above us.
       */
      case Translation.up:
        if (this.row > 0) {
          result.row = this.row - 1;
        }
        valid = true;
        break;
      /*
       * Set the row to the row that appears below this area. Return the
       * new area if it's within bounds.
       */
      case Translation.down:
        result.row = this.row + this.height;
        if (result.row < dimensions.rows) {
          valid = true;
        }
        break;
      /*
       * If we're on any column besides the first one, we can return the column
       * directly to our left.
       */
      case Translation.left:
        if (this.column > 0) {
          result.column = this.column - 1;
        }
        valid = true;
        break;
      /*
       * Set the column to the column that appears to the right of this area.
       * Return the new area if it's within bounds.
       */
      case Translation.right:
        result.column = this.column + this.width;
        if (result.column < dimensions.columns) {
          valid = true;
        }
        break;
    }

    /*
     * Need to move this into the grid layout class?
    if (valid) {
      valid = this.validate(dimensions, layout, result);
      if (valid) {
        this.location = result;
      }
    }
    */

    return valid;
  }

  get row() {
    return this.location.row;
  }

  get column() {
    return this.location.column;
  }

  apply(element: HTMLElement) {
    element.style.gridArea =
      `${this.row + 1} / ${this.column + 1} / ` +
      `span ${this.height} / span ${this.width}`;
  }
}
