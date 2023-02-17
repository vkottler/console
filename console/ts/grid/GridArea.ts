import assert from "assert";

export const EMPTY = ".";

export class GridArea {
  row: number;
  column: number;
  height: number;
  width: number;

  constructor(row = 0, column = 0, height = 1, width = 1) {
    this.row = row;
    this.column = column;
    this.height = height;
    this.width = width;
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
