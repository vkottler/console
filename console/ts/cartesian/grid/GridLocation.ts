export class GridLocation {
  row: number;
  column: number;

  constructor(row = 0, column = 0) {
    this.row = row;
    this.column = column;
  }

  sanitize(rows: number, columns: number): boolean {
    /*
     * Return whether or not the cursor was invalid, indicating that
     * sanitization changed the cursor value.
     */
    let isValid = 0 <= this.row && this.row < rows;
    isValid &&= 0 <= this.column && this.column < columns;

    this.row = Math.min(rows - 1, this.row);
    this.row = Math.max(0, this.row);
    this.column = Math.min(columns - 1, this.column);
    this.column = Math.max(0, this.column);

    return !isValid;
  }
}
