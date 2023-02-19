import assert from "assert";

import {
  isHorizontal,
  isVertical,
  Translation,
} from "../cartesian/Translation";
import { EMPTY } from "./GridArea";
import { GridArea, GridLocation, INIT_ID } from "./GridArea";
import { GridDimensions } from "./GridDimensions";

function newRow(columns: number): string[] {
  const newRow = [];
  for (let col = 0; col < columns; col++) {
    newRow.push(EMPTY);
  }
  return newRow;
}

export class GridLayout {
  dimensions: GridDimensions;
  cells: string[][];
  cursor: number;
  nextAreaId: number;

  constructor() {
    this.dimensions = new GridDimensions();
    this.cells = [[EMPTY]];
    this.cursor = INIT_ID;
    this.nextAreaId = 0;
  }

  validLocation(location: GridLocation): boolean {
    let result = location.row >= 0 && location.row < this.dimensions.rows;
    result &&=
      location.column >= 0 && location.column < this.dimensions.columns;
    return result;
  }

  areaEmpty(area: GridArea, newLocation?: GridLocation): boolean {
    let row = area.row;
    let column = area.column;

    /*
     * Evaluate based on a prospective new location if one was provided.
     */
    if (newLocation != undefined) {
      row = newLocation.row;
      column = newLocation.column;
    }

    const height = area.height;
    const width = area.width;

    /*
     * Validate that the layout isn't occupied anywhere this area would appear,
     * or that the occupied cell belongs to this area already.
     */
    const name = area.name;
    for (let rowIdx = row; rowIdx < row + height; rowIdx++) {
      for (let columnIdx = column; columnIdx < column + width; columnIdx++) {
        const cellName = this.cells[rowIdx][columnIdx];
        if (cellName != EMPTY && cellName != name) {
          return false;
        }
      }
    }

    return true;
  }

  validArea(area: GridArea, newLocation?: GridLocation): boolean {
    let row = area.row;
    let column = area.column;

    /*
     * Evaluate based on a prospective new location if one was provided.
     */
    if (newLocation != undefined) {
      row = newLocation.row;
      column = newLocation.column;
    }

    /*
     * Validate the location.
     */
    let result = this.validLocation(area.location);

    const height = area.height;
    const width = area.width;

    /*
     * Validate the area's dimensions.
     */
    if (result) {
      result &&= row + height <= this.dimensions.rows;
      result &&= column + width <= this.dimensions.columns;
    }

    /*
     * Validate that this area is currently empty.
     */
    if (result) {
      result &&= this.areaEmpty(area, newLocation);
    }

    return result;
  }

  #getNextAreaId(): number {
    const result = this.nextAreaId;
    this.nextAreaId++;
    return result;
  }

  assignId(area: GridArea, element?: HTMLElement) {
    if (area.areaId == INIT_ID) {
      area.areaId = this.#getNextAreaId();
    }
    if (element != undefined) {
      element.style.gridArea = area.name;
    }
  }

  createArea(element?: HTMLElement): GridArea {
    const area = new GridArea();
    this.assignId(area, element);
    return area;
  }

  update(area: GridArea) {
    const name = area.name;
    for (let row = area.row; row < area.row + area.height; row++) {
      for (let col = area.column; col < area.column + area.width; col++) {
        const curr = this.cells[row][col];
        assert(curr == EMPTY || curr == name);
        this.cells[row][col] = name;
      }
    }
  }

  apply(element: HTMLElement) {
    /*
     * Update the container's grid-template rows.
     */
    let line = [];
    for (let row = 0; row < this.dimensions.rows; row++) {
      line.push("auto");
    }

    /*
     * Update the container's grid-template columns.
     */
    line = [];
    for (let column = 0; column < this.dimensions.columns; column++) {
      line.push("auto");
    }

    /*
     * Update the container's grid-template areas;
     */
    let areas = "";
    for (let row = 0; row < this.dimensions.rows; row++) {
      line = [];
      for (let column = 0; column < this.dimensions.columns; column++) {
        line.push(this.cells[row][column]);
      }
      areas += '"' + line.join(" ") + '"';
      if (row < this.dimensions.rows - 1) {
        areas += "\n";
      }
    }
    element.style.gridTemplateAreas = areas;
  }

  expand(direction: Translation): boolean {
    let result = false;

    switch (direction) {
      case Translation.up:
        this.cells.unshift(newRow(this.dimensions.columns));
        break;
      case Translation.down:
        this.cells.push(newRow(this.dimensions.columns));
        break;
      case Translation.left:
        for (let row = 0; row < this.dimensions.rows; row++) {
          this.cells[row].unshift(EMPTY);
        }
        break;
      case Translation.right:
        for (let row = 0; row < this.dimensions.rows; row++) {
          this.cells[row].push(EMPTY);
        }
        break;
    }

    if (isVertical(direction)) {
      this.dimensions.rows += 1;
      result = true;
    }
    if (isHorizontal(direction)) {
      this.dimensions.columns += 1;
      result = true;
    }

    return result;
  }

  /**
   * Determine if a row is empty.
   */
  #isRowEmpty(row: number, remove = false) {
    for (let col = 0; col < this.dimensions.columns; col++) {
      if (this.cells[row][col] != EMPTY) {
        return false;
      }
    }

    if (remove) {
      this.cells.splice(row, 1);
      this.dimensions.rows -= 1;
    }

    return true;
  }

  /**
   * Determine if a column is empty.
   */
  #isColumnEmpty(column: number, remove = false) {
    for (let row = 0; row < this.dimensions.rows; row++) {
      if (this.cells[row][column] != EMPTY) {
        return false;
      }
    }

    if (remove) {
      for (let row = 0; row < this.dimensions.rows; row++) {
        this.cells[row].splice(column, 1);
      }
      this.dimensions.columns -= 1;
    }

    return true;
  }

  /**
   * Attempt to make the grid smaller. If the row or column that would be
   * removed is either empty, or contains grid entities that can be made
   * smaller, the grid will contract and the function returns true.
   */
  contract(direction: Translation): boolean {
    let result = false;

    switch (direction) {
      /*
       * Attempt to remove the bottom row.
       */
      case Translation.up:
        result = this.#isRowEmpty(this.dimensions.rows - 1, true);
        break;
      /*
       * Attempt to remove the top row.
       */
      case Translation.down:
        result = this.#isRowEmpty(0, true);
        break;
      /*
       * Attempt to remove the furthest-right column.
       */
      case Translation.left:
        result = this.#isColumnEmpty(this.dimensions.columns - 1, true);
        break;
      /*
       * Attempt to remove the furthest-left column.
       */
      case Translation.right:
        result = this.#isColumnEmpty(0, true);
        break;
    }

    return result;
  }
}
