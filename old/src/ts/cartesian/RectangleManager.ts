export class Table {
  rows: number;
  columns: number;

  constructor(rows = 1, columns = 1) {
    this.rows = rows;
    this.columns = columns;
  }

  addRow() {
    this.rows += 1;
  }

  addColumn() {
    this.columns += 1;
  }
}

export class TableIndex {
  row: number;
  column: number;

  constructor(row = 0, column = 0) {
    this.row = row;
    this.column = column;
  }

  /*
  translate() {

  }
  */
}

export class VirtualRectangle {
  width: number;
  height: number;
  location: TableIndex;

  constructor(width = 1, height = 1, location?: TableIndex) {
    this.width = width;
    this.height = height;
    if (location == undefined) {
      location = new TableIndex();
    }
    this.location = location;
  }
}

export class RectangleManager {
  container: HTMLElement;
  active: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.container.style.display = "grid";

    this.active = document.createElement("div");
    this.container.appendChild(this.active);
  }

  splitVertically() {
    console.log("vertical split");
  }

  splitHorizontally() {
    console.log("horizontal split");
  }
}
