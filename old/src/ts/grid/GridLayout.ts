import assert from "assert";

import {
  isHorizontal,
  isVertical,
  Translation,
} from "../cartesian/Translation";
import { EMPTY } from "./GridArea";
import { GridArea, GridLocation, INIT_ID } from "./GridArea";
import { GridDimensions } from "./GridDimensions";

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
  cursor: number;
  nextAreaId: number;

  constructor() {
    this.dimensions = new GridDimensions();
    this.cells = [[EMPTY]];
    this.cursor = INIT_ID;
    this.nextAreaId = 0;
  }

  /**
   * Determine if a row is empty.
   */
  #isRowEmpty(row: number, remove = false) {
    for (let col = 0; col < this.dimensions.columns; col++) {
      if (this.cells[row][col] != EMPTY) {
        return false;
      }
    }

    if (remove) {
      this.cells.splice(row, 1);
      this.dimensions.rows -= 1;
    }

    return true;
  }

  /**
   * Determine if a column is empty.
   */
  #isColumnEmpty(column: number, remove = false) {
    for (let row = 0; row < this.dimensions.rows; row++) {
      if (this.cells[row][column] != EMPTY) {
        return false;
      }
    }

    if (remove) {
      for (let row = 0; row < this.dimensions.rows; row++) {
        this.cells[row].splice(column, 1);
      }
      this.dimensions.columns -= 1;
    }

    return true;
  }

  /**
   * Attempt to make the grid smaller. If the row or column that would be
   * removed is either empty, or contains grid entities that can be made
   * smaller, the grid will contract and the function returns true.
   */
  contract(direction: Translation): boolean {
    let result = false;

    switch (direction) {
      /*
       * Attempt to remove the bottom row.
       */
      case Translation.up:
        result = this.#isRowEmpty(this.dimensions.rows - 1, true);
        break;
      /*
       * Attempt to remove the top row.
       */
      case Translation.down:
        result = this.#isRowEmpty(0, true);
        break;
      /*
       * Attempt to remove the furthest-right column.
       */
      case Translation.left:
        result = this.#isColumnEmpty(this.dimensions.columns - 1, true);
        break;
      /*
       * Attempt to remove the furthest-left column.
       */
      case Translation.right:
        result = this.#isColumnEmpty(0, true);
        break;
    }

    return result;
  }
}
