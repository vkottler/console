export class GridDimensions {
  rows: number;
  columns: number;

  constructor(rows = 1, columns = 1) {
    this.rows = rows;
    this.columns = columns;
  }

  copy(): GridDimensions {
    return new GridDimensions(this.rows, this.columns);
  }

  get width(): number {
    return this.columns;
  }

  get height(): number {
    return this.rows;
  }

  get square(): boolean {
    return this.rows == this.columns;
  }
}
