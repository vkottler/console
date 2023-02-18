import { EMPTY } from "./GridArea";
import {
  Translation,
  is_vertical,
  is_horizontal,
} from "../cartesian/Translation";
import { GridElementManagerAreas } from "./areas";

function new_row(columns: number): string[] {
  const new_row = [];
  for (let col = 0; col < columns; col++) {
    new_row.push(EMPTY);
  }
  return new_row;
}

export class GridElementManager extends GridElementManagerAreas {
  expand(direction: Translation) {
    switch (direction) {
      case Translation.UP:
        this.layout.unshift(new_row(this.columns));
        break;
      case Translation.DOWN:
        this.layout.push(new_row(this.columns));
        break;
      case Translation.LEFT:
        for (let row = 0; row < this.rows; row++) {
          this.layout[row].unshift(EMPTY);
        }
        break;
      case Translation.RIGHT:
        for (let row = 0; row < this.rows; row++) {
          this.layout[row].push(EMPTY);
        }
        break;
    }

    if (is_vertical(direction)) {
      this.rows += 1;
    }
    if (is_horizontal(direction)) {
      this.columns += 1;
    }

    this.update_container();
  }

  /**
   * Determine if a row is empty.
   */
  is_row_empty(row: number, remove = false) {
    for (let col = 0; col < this.columns; col++) {
      if (this.layout[row][col] != EMPTY) {
        return false;
      }
    }

    if (remove) {
      this.layout.splice(row, 1);
      this.rows -= 1;
    }

    return true;
  }

  /**
   * Determine if a column is empty.
   */
  is_column_empty(column: number, remove = false) {
    for (let row = 0; row < this.rows; row++) {
      if (this.layout[row][column] != EMPTY) {
        return false;
      }
    }

    if (remove) {
      for (let row = 0; row < this.rows; row++) {
        this.layout[row].splice(column, 1);
      }
      this.columns -= 1;
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
      case Translation.UP:
        result = this.is_row_empty(this.rows - 1, true);
        break;
      /*
       * Attempt to remove the top row.
       */
      case Translation.DOWN:
        result = this.is_row_empty(0, true);
        break;
      /*
       * Attempt to remove the furthest-right column.
       */
      case Translation.LEFT:
        result = this.is_column_empty(this.columns - 1, true);
        break;
      /*
       * Attempt to remove the furthest-left column.
       */
      case Translation.RIGHT:
        result = this.is_column_empty(0, true);
        break;
    }

    if (result) {
      this.update_container();
    }

    return result;
  }
}
