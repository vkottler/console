import { Translation } from "../cartesian/Translation";
import { GridDimensions } from "./GridDimensions";

export class GridLocation {
  row: number;
  column: number;

  constructor(row = 0, column = 0) {
    this.row = row;
    this.column = column;
  }

  translate(
    translation: Translation,
    bounds?: GridDimensions,
    objectSize?: GridDimensions,
    update = false
  ): GridLocation | undefined {
    const result = new GridLocation(this.row, this.column);
    let valid = false;
    let toCompare = 0;

    switch (translation) {
      case Translation.up:
        if (result.row > 0) {
          result.row--;
          valid = true;
        }
        break;
      case Translation.down:
        result.row++;
        toCompare = result.row;

        if (objectSize != undefined) {
          toCompare += objectSize.height;
        }

        valid = true;
        if (bounds != undefined) {
          valid = toCompare <= bounds.rows;
        }
        break;
      case Translation.left:
        if (result.column > 0) {
          result.column--;
          valid = true;
        }
        break;
      case Translation.right:
        result.column++;
        toCompare = result.column;

        if (objectSize != undefined) {
          toCompare += objectSize.width;
        }

        valid = true;
        if (bounds != undefined) {
          valid = toCompare <= bounds.columns;
        }
        break;
    }

    if (valid) {
      if (update) {
        this.row = result.row;
        this.column = result.column;
        return this;
      }
      return result;
    }
  }
}
