import { Translation } from "../Translation";
import { GridLocation } from "./GridLocation";

export class GridNode {
  container: HTMLElement;
  width: number;
  height: number;
  location: GridLocation;

  constructor(
    container: HTMLElement,
    width = 1,
    height = 1,
    location?: GridLocation
  ) {
    this.container = container;

    if (location == undefined) {
      location = new GridLocation();
    }
    this.location = location;

    this.width = width;
    this.height = height;

    this.updateGridCoordinates();
  }

  updateGridCoordinates() {
    this.container.style.gridArea = `${this.location.row} / ${this.location.column} / span ${this.height} / span ${this.width}`;

    /*
    this.container.style.gridRowStart = this.location.row.toString();
    this.container.style.gridColumnStart = this.location.column.toString();
    this.container.style.gridRowEnd = (
      this.location.row + this.height
    ).toString();
    this.container.style.gridColumnEnd = (
      this.location.column + this.width
    ).toString();
    */

    /*
     * Debugging.
     */
    this.container.innerHTML =
      `${this.width}x${this.height} ` +
      `(${this.location.row}, ${this.location.column})`;
  }

  updateGrid(grid: GridNode[][]) {
    /*
     * Update the grid structure with a reference to this node for every
     * coordinate it appears in.
     */
    for (let rowIdx = 0; rowIdx < this.height; rowIdx++) {
      const row = this.location.row + rowIdx;
      for (let columnIdx = 0; columnIdx < this.width; columnIdx++) {
        const column = this.location.column + columnIdx;
        grid[row][column] = this;
      }
    }
  }

  split(
    container: HTMLElement,
    direction: Translation,
    grid?: GridNode[][],
    size = 1
  ): GridNode | undefined {
    const newNode = new GridNode(
      container,
      size,
      size,
      new GridLocation(this.location.row, this.location.column)
    );
    let valid = false;

    switch (direction) {
      case Translation.up:
        if (this.height > size) {
          this.height -= size;
          newNode.width = this.width;

          /*
           * Our location shifts down by 'size' rows.
           */
          this.location.row += size;

          valid = true;
        }
        break;
      case Translation.down:
        if (this.height > size) {
          this.height -= size;
          newNode.width = this.width;

          /*
           * Shift the new node's location by 'size' rows.
           */
          newNode.location.row += size;

          valid = true;
        }
        break;
      case Translation.left:
        if (this.width > size) {
          this.width -= size;
          newNode.height = this.height;

          /*
           * Our location shifts right by 'size' columns.
           */
          this.location.column += size;

          valid = true;
        }
        break;
      case Translation.right:
        if (this.width > size) {
          this.width -= size;
          newNode.height = this.height;

          /*
           * The new node's location shifts right by 'size' columns.
           */
          newNode.location.column += size;

          valid = true;
        }
        break;
    }

    /*
     * Only return the new node if it's valid.
     */
    if (valid) {
      this.updateGridCoordinates();
      newNode.updateGridCoordinates();
      if (grid != undefined) {
        newNode.updateGrid(grid);
      }
      return newNode;
    }
  }
}
