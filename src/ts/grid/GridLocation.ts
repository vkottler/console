import { Translation } from "../cartesian/Translation";
import { GridDimensions } from "./GridDimensions";

export class GridLocation {
  row: number;
  column: number;

  constructor(row = 0, column = 0) {
    this.row = row;
    this.column = column;
  }

  copy(): GridLocation {
    return new GridLocation(this.row, this.column);
  }

  set(row: number, column: number): GridLocation {
    this.row = row;
    this.column = column;
    return this;
  }

  inBounds(bounds: GridDimensions, objectSize?: GridDimensions): boolean {
    let valid = this.row < bounds.rows && this.column < bounds.columns;

    /*
     * If we're checking an object with dimensions, add them to obtain the
     * maximum row and column.
     */
    if (objectSize != undefined && valid) {
      valid =
        this.row + objectSize.height <= bounds.rows &&
        this.column + objectSize.width <= bounds.columns;
    }

    return valid;
  }

  translate(
    translation: Translation,
    bounds?: GridDimensions,
    objectSize?: GridDimensions,
    update = false
  ): GridLocation | undefined {
    const result = new GridLocation(this.row, this.column);
    let valid = false;

    switch (translation) {
      case Translation.up:
        if (result.row > 0) {
          result.row--;
          valid = true;
        }
        break;
      case Translation.down:
        result.row++;
        valid = true;
        break;
      case Translation.left:
        if (result.column > 0) {
          result.column--;
          valid = true;
        }
        break;
      case Translation.right:
        result.column++;
        valid = true;
        break;
    }

    /* Consider bounds and the object's size if provided. */
    if (bounds != undefined && valid) {
      valid = result.inBounds(bounds, objectSize);
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
