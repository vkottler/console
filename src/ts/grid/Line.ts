import { Translation } from "../cartesian/Translation";
import { GridLocation } from "./Location";

export class GridLine {
  begin: GridLocation;
  end: GridLocation;

  constructor(begin: GridLocation, end: GridLocation) {
    this.begin = begin;
    this.end = end;
  }

  translate(direction: Translation): boolean {
    const newBegin = this.begin.translate(direction);
    const newEnd = this.end.translate(direction);
    let result = false;

    if (newBegin != undefined && newEnd != undefined) {
      this.begin = newBegin;
      this.end = newEnd;
      result = true;
    }

    return result;
  }

  isVertical(): boolean {
    return (
      this.begin.column == this.end.column && this.begin.row != this.end.row
    );
  }

  isHorizontal(): boolean {
    return (
      this.begin.row == this.end.row && this.begin.column != this.end.column
    );
  }

  *locations(): Generator<GridLocation> {
    /* Start at the begin point. */
    let newLocation = new GridLocation(this.begin.row, this.begin.column);
    let length = 0;

    /* Go right/down by default. */
    let direction = 1;

    if (this.isVertical()) {
      length = Math.abs(this.begin.row - this.end.row);

      /* Go up if the begin point is below of the end one. */
      if (this.begin.row > this.end.row) {
        direction = -1;
      }

      for (let idx = 0; idx < length; idx++) {
        yield newLocation;
        newLocation = new GridLocation(
          newLocation.row + direction,
          newLocation.column
        );
      }
      yield newLocation;
    } else if (this.isHorizontal()) {
      length = Math.abs(this.begin.column - this.end.column);

      /* Go left if the begin point is to the right of the end one. */
      if (this.begin.column > this.end.column) {
        direction = -1;
      }

      for (let idx = 0; idx < length; idx++) {
        yield newLocation;
        newLocation = new GridLocation(
          newLocation.row,
          newLocation.column + direction
        );
      }
      yield newLocation;
    }
  }
}
