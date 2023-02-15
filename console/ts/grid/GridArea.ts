import assert from "assert";

export const EMPTY = ".";

export class GridArea {
  row: number;
  column: number;
  height: number;
  width: number;

  constructor(row = 1, column = 1, height = 1, width = 1) {
    this.row = row;
    this.column = column;
    this.height = height;
    this.width = width;
  }

  apply(element: HTMLElement) {
    element.style.gridArea =
      `${this.row} / ${this.column} / ` +
      `span ${this.height} / span ${this.width}`;
  }

  update_layout(name: string, layout: string[][]) {
    for (let row = this.row - 1; row < this.row + this.height; row++) {
      for (let col = this.column - 1; col < this.column + this.width; col++) {
        assert(layout[row][col] == EMPTY);
        layout[row][col] = name;
      }
    }
  }
}
