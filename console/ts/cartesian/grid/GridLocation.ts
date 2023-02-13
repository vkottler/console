export class GridLocation {
  row: number;
  column: number;

  constructor(row = 0, column = 0) {
    this.row = row;
    this.column = column;
  }

  sanitize(rows: number, columns: number) {
    this.row = Math.min(rows - 1, this.row);
    this.row = Math.max(0, this.row);
    this.column = Math.min(columns - 1, this.column);
    this.column = Math.max(0, this.column);
  }
}
