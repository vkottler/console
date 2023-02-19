import {
  isHorizontal,
  isVertical,
  Translation,
} from "../cartesian/Translation";
import { GridElementManagerAreas } from "./areas";
import { EMPTY } from "./GridArea";

function newRow(columns: number): string[] {
  const newRow = [];
  for (let col = 0; col < columns; col++) {
    newRow.push(EMPTY);
  }
  return newRow;
}

export class GridElementManager extends GridElementManagerAreas {
  expand(direction: Translation) {
    let sizeChanged = false;

    switch (direction) {
      case Translation.up:
        this.layout.unshift(newRow(this.columns));
        break;
      case Translation.down:
        this.layout.push(newRow(this.columns));
        break;
      case Translation.left:
        for (let row = 0; row < this.rows; row++) {
          this.layout[row].unshift(EMPTY);
        }
        break;
      case Translation.right:
        for (let row = 0; row < this.rows; row++) {
          this.layout[row].push(EMPTY);
        }
        break;
    }

    if (isVertical(direction)) {
      this.dimensions.rows += 1;
      sizeChanged = true;
    }
    if (isHorizontal(direction)) {
      this.dimensions.columns += 1;
      sizeChanged = true;
    }

    this.updateContainer();

    /*
     * Trigger an event for the size change.
     */
    if (sizeChanged) {
      this.fireGridResize();
    }
  }

  /**
   * Determine if a row is empty.
   */
  #isRowEmpty(row: number, remove = false) {
    for (let col = 0; col < this.columns; col++) {
      if (this.layout[row][col] != EMPTY) {
        return false;
      }
    }

    if (remove) {
      this.layout.splice(row, 1);
      this.dimensions.rows -= 1;
    }

    return true;
  }

  /**
   * Determine if a column is empty.
   */
  #isColumnEmpty(column: number, remove = false) {
    for (let row = 0; row < this.rows; row++) {
      if (this.layout[row][column] != EMPTY) {
        return false;
      }
    }

    if (remove) {
      for (let row = 0; row < this.rows; row++) {
        this.layout[row].splice(column, 1);
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
        result = this.#isRowEmpty(this.rows - 1, true);
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
        result = this.#isColumnEmpty(this.columns - 1, true);
        break;
      /*
       * Attempt to remove the furthest-left column.
       */
      case Translation.right:
        result = this.#isColumnEmpty(0, true);
        break;
    }

    if (result) {
      this.updateContainer();
      /*
       * Trigger an event for the size change.
       */
      this.fireGridResize();
    }

    return result;
  }
}
