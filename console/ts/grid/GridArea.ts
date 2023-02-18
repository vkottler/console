import assert from "assert";
import { Translation } from "../cartesian/Translation";

export const EMPTY = ".";

export class GridLocation {
  row: number;
  column: number;

  constructor(row = 0, column = 0) {
    this.row = row;
    this.column = column;
  }
}

export class GridArea {
  location: GridLocation;
  height: number;
  width: number;

  constructor(location?: GridLocation, height = 1, width = 1) {
    if (location == undefined) {
      location = new GridLocation();
    }
    this.location = location;
    this.height = height;
    this.width = width;
  }

  translate(
    direction: Translation,
    rows: number,
    columns: number
  ): GridLocation | undefined {
    const result = new GridLocation(this.row, this.column);

    switch (direction) {
      /*
       * If we're on any row besides the first one, we can return the row
       * directly above us.
       */
      case Translation.UP:
        if (this.row > 0) {
          result.row = this.row - 1;
        }
        return result;
      /*
       * Set the row to the row that appears below this area. Return the
       * new area if it's within bounds.
       */
      case Translation.DOWN:
        result.row = this.row + this.height;
        if (result.row < rows) {
          return result;
        }
        break;
      /*
       * If we're on any column besides the first one, we can return the column
       * directly to our left.
       */
      case Translation.LEFT:
        if (this.column > 0) {
          result.column = this.column - 1;
        }
        return result;
      /*
       * Set the column to the column that appears to the right of this area.
       * Return the new area if it's within bounds.
       */
      case Translation.RIGHT:
        result.column = this.column + this.width;
        if (result.column < columns) {
          return result;
        }
        break;
    }
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

  update_layout(name: string, layout: string[][]) {
    for (let row = this.row; row < this.row + this.height; row++) {
      for (let col = this.column; col < this.column + this.width; col++) {
        assert(layout[row][col] == EMPTY);
        layout[row][col] = name;
      }
    }
  }

  validate(rows: number, columns: number, layout?: string[][]) {
    /*
     * Validate location.
     */
    let result = 0 <= this.row && this.row < rows;
    result &&= 0 <= this.column && this.column < columns;

    /*
     * Validate size.
     */
    result &&= this.row + this.height <= rows;
    result &&= this.column + this.width <= columns;

    if (layout != undefined && result) {
      /*
       * Validate that the layout isn't occupied anywhere this area would appear.
       */
      for (let row = this.row; row < this.row + this.height; row++) {
        for (
          let column = this.column;
          column < this.column + this.height;
          column++
        ) {
          if (layout[row][column] != EMPTY) {
            return false;
          }
        }
      }
    }

    return result;
  }
}
