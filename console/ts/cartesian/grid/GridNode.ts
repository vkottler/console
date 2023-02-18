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

    this.update_grid_coordinates();
  }

  update_grid_coordinates() {
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

  update_grid(grid: GridNode[][]) {
    /*
     * Update the grid structure with a reference to this node for every
     * coordinate it appears in.
     */
    for (let row_idx = 0; row_idx < this.height; row_idx++) {
      const row = this.location.row + row_idx;
      for (let column_idx = 0; column_idx < this.width; column_idx++) {
        const column = this.location.column + column_idx;
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
    const new_node = new GridNode(
      container,
      size,
      size,
      new GridLocation(this.location.row, this.location.column)
    );
    let valid = false;

    switch (direction) {
      case Translation.UP:
        if (this.height > size) {
          this.height -= size;
          new_node.width = this.width;

          /*
           * Our location shifts down by 'size' rows.
           */
          this.location.row += size;

          valid = true;
        }
        break;
      case Translation.DOWN:
        if (this.height > size) {
          this.height -= size;
          new_node.width = this.width;

          /*
           * Shift the new node's location by 'size' rows.
           */
          new_node.location.row += size;

          valid = true;
        }
        break;
      case Translation.LEFT:
        if (this.width > size) {
          this.width -= size;
          new_node.height = this.height;

          /*
           * Our location shifts right by 'size' columns.
           */
          this.location.column += size;

          valid = true;
        }
        break;
      case Translation.RIGHT:
        if (this.width > size) {
          this.width -= size;
          new_node.height = this.height;

          /*
           * The new node's location shifts right by 'size' columns.
           */
          new_node.location.column += size;

          valid = true;
        }
        break;
    }

    /*
     * Only return the new node if it's valid.
     */
    if (valid) {
      this.update_grid_coordinates();
      new_node.update_grid_coordinates();
      if (grid != undefined) {
        new_node.update_grid(grid);
      }
      return new_node;
    }
  }
}
