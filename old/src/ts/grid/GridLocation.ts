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
    objectSize?: GridDimensions
  ): GridLocation | undefined {
    const result = new GridLocation(this.row, this.column);
    let toCompare = 0;

    switch (translation) {
      case Translation.up:
        if (result.row > 0) {
          result.row--;
          return result;
        }
        break;
      case Translation.down:
        result.row++;
        toCompare = result.row;

        if (objectSize != undefined) {
          toCompare += objectSize.height;
        }

        if (bounds != undefined && toCompare < bounds.rows) {
          return result;
        }
        break;
      case Translation.left:
        if (result.column > 0) {
          result.column--;
          return result;
        }
        break;
      case Translation.right:
        result.column++;
        toCompare = result.column;

        if (objectSize != undefined) {
          toCompare += objectSize.width;
        }

        if (bounds != undefined && toCompare < bounds.columns) {
          return result;
        }
        break;
    }
  }
}
