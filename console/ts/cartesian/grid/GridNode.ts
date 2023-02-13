import { GridLocation } from "./GridLocation";
import { Translation } from "../Translation";

export class GridNode {
  location: GridLocation;
  width: number;
  height: number;

  constructor(width = 1, height = 1, location?: GridLocation) {
    if (location == undefined) {
      location = new GridLocation();
    }
    this.location = location;
    this.width = width;
    this.height = height;
  }

  update_grid(grid: GridNode[][]) {
    for (let row_idx = 0; row_idx < this.height; row_idx++) {
      const row = this.location.row + row_idx;
      for (let column_idx = 0; column_idx < this.width; column_idx++) {
        const column = this.location.column + column_idx;
        grid[row][column] = this;
      }
    }
  }

  split(
    direction: Translation,
    grid?: GridNode[][],
    size = 1
  ): GridNode | undefined {
    const new_node = new GridNode(size, size);
    let valid = false;

    switch (direction) {
      case Translation.UP:
        if (this.height > size) {
          this.height -= size;
          new_node.width = this.width;
          /*
           * set new node's location (and/or check our own?)
           */
          valid = true;
        }
        break;
      case Translation.DOWN:
        if (this.height > size) {
          this.height -= size;
          new_node.width = this.width;
          /*
           * set new node's location (and/or check our own?)
           */
          valid = true;
        }
        break;
      case Translation.LEFT:
        if (this.width > size) {
          this.width -= size;
          new_node.height = this.height;
          /*
           * set new node's location (and/or check our own?)
           */
          valid = true;
        }
        break;
      case Translation.RIGHT:
        if (this.width > size) {
          this.width -= size;
          new_node.height = this.height;
          /*
           * set new node's location (and/or check our own?)
           */
          valid = true;
        }
        break;
    }

    /*
     * Only return the new node if it's valid.
     */
    if (valid) {
      if (grid != undefined) {
        new_node.update_grid(grid);
      }
      return new_node;
    }
  }
}
