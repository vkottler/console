export class GridDimensions {
  rows: number;
  columns: number;

  constructor(rows = 1, columns = 1) {
    this.rows = rows;
    this.columns = columns;
  }

  get width(): number {
    return this.columns;
  }

  get height(): number {
    return this.rows;
  }
}
