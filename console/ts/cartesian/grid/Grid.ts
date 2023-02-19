import { Translation } from "../Translation";
import { GridLocation } from "./GridLocation";
import { GridNode } from "./GridNode";

export class Grid {
  container: HTMLElement;
  rows: number;
  columns: number;
  nodes: GridNode[][]; /* [row][column] */
  cursor: GridLocation;

  constructor(container: HTMLElement, initial: HTMLElement) {
    this.container = container;
    this.container.style.display = "grid";

    this.rows = 1;
    this.columns = 1;
    this.nodes = [[new GridNode(initial)]];
    this.cursor = new GridLocation();
  }

  current(): GridNode {
    return this.nodes[this.cursor.row][this.cursor.column];
  }

  *rowNodes(row = 0, minColumn = 0): Generator<GridNode> {
    const visited = new Set();
    for (const column in this.nodes[row]) {
      const node = this.nodes[row][column];
      if (!visited.has(node)) {
        /*
         * Only yield the node if it meets the minimum-column check, but
         * always consider it visited.
         */
        visited.add(node);
        if (+column >= minColumn) {
          yield node;
        }
      }
    }
  }

  *columnNodes(column = 0, minRow = 0): Generator<GridNode> {
    const visited = new Set();
    for (const row in this.nodes) {
      const node = this.nodes[row][column];
      if (!visited.has(node)) {
        /*
         * Only yield the node if it meets the minimum-row check, but
         * always consider it visited.
         */
        visited.add(node);
        if (+row >= minRow) {
          yield node;
        }
      }
    }
  }

  splitCurrent(
    container: HTMLElement,
    direction: Translation,
    size = 1
  ): boolean {
    const newNode = this.current().split(
      container,
      direction,
      this.nodes,
      size
    );
    return newNode != undefined;
  }

  moveCursor(direction: Translation, expand = false) {
    switch (direction) {
      case Translation.up:
        this.cursor.row -= 1;
        break;
      case Translation.down:
        this.cursor.row += 1;
        break;
      case Translation.left:
        this.cursor.column -= 1;
        break;
      case Translation.right:
        this.cursor.column += 1;
        break;
    }

    if (this.cursor.sanitize(this.rows, this.columns) && expand) {
      this.expand(direction);
    }
  }

  expand(direction: Translation) {
    const newRow = [];
    const visited = new Set();

    switch (direction) {
      case Translation.up:
        for (const node of this.nodes[0]) {
          /*
           * Only update node height's once.
           */
          if (!visited.has(node)) {
            node.height += 1;
            node.updateGridCoordinates();
            visited.add(node);
          }

          newRow.push(node);
        }
        this.nodes.unshift(newRow);
        this.rows += 1;

        /*
         * Update the row value (increase by one) for every node that's not the
         * first in the row.
         */
        visited.clear();
        for (let column = 0; column < this.columns; column++) {
          for (const node of this.columnNodes(column, 1)) {
            /*
             * Only update each node once.
             */
            if (!visited.has(node)) {
              node.location.row += 1;
              node.updateGridCoordinates();
              visited.add(node);
            }
          }
        }
        break;

      case Translation.down:
        for (const node of this.nodes[this.rows - 1]) {
          /*
           * Only update node height's once.
           */
          if (!visited.has(node)) {
            node.height += 1;
            node.updateGridCoordinates();
            visited.add(node);
          }

          newRow.push(node);
        }
        this.nodes.push(newRow);
        this.rows += 1;
        break;

      case Translation.left:
        for (const column of this.nodes) {
          const node = column[0];

          /*
           * Only update node width's once.
           */
          if (!visited.has(node)) {
            node.width += 1;
            node.updateGridCoordinates();
            visited.add(node);
          }

          column.unshift(node);
        }
        this.columns += 1;

        /*
         * Update the column value (increase by one) for every node that's not
         * the first in the column.
         */
        visited.clear();
        for (let row = 0; row < this.rows; row++) {
          for (const node of this.rowNodes(row, 1)) {
            /*
             * Only update each node once.
             */
            if (!visited.has(node)) {
              node.location.column += 1;
              node.updateGridCoordinates();
              visited.add(node);
            }
          }
        }
        break;

      case Translation.right:
        for (const column of this.nodes) {
          const node = column[this.columns - 1];

          /*
           * Only update node width's once.
           */
          if (!visited.has(node)) {
            node.width += 1;
            node.updateGridCoordinates();
            visited.add(node);
          }

          column.push(node);
        }
        this.columns += 1;
        break;
    }
  }

  contract(direction: Translation) {
    console.log(direction);

    this.cursor.sanitize(this.rows, this.columns);
  }
}
