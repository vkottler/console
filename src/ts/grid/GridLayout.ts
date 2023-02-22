import { GridDimensions } from "./GridDimensions";
import { GridLocation } from "./GridLocation";

const EMPTY = ".";

export class GridLayout {
  dimensions: GridDimensions;
  cells: string[][];
  nextAreaId: number;

  constructor() {
    this.dimensions = new GridDimensions();
    this.cells = [[EMPTY]];
    this.nextAreaId = 0;
  }

  validLocation(location: GridLocation): boolean {
    let result = location.row >= 0 && location.row < this.dimensions.rows;
    result &&=
      location.column >= 0 && location.column < this.dimensions.columns;
    return result;
  }
}
