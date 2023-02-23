import assert from "assert";

import {
  flip,
  isHorizontal,
  isVertical,
  Translation,
} from "../cartesian/Translation";
import { GridArea, INIT_ID } from "./GridArea";
import { GridDimensions } from "./GridDimensions";
import { GridLocation } from "./GridLocation";

const EMPTY = ".";

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
  nextAreaId: number;
  byId: Map<number, GridArea>;

  constructor() {
    this.dimensions = new GridDimensions();
    this.cells = [[EMPTY]];
    this.nextAreaId = 0;
    this.byId = new Map<number, GridArea>();
  }

  get width(): number {
    return this.dimensions.width;
  }

  get height(): number {
    return this.dimensions.height;
  }

  validLocation(location: GridLocation, dimensions?: GridDimensions): boolean {
    let result = location.row >= 0 && location.row < this.dimensions.rows;
    result &&=
      location.column >= 0 && location.column < this.dimensions.columns;

    if (result && dimensions != undefined) {
      result = location.row + dimensions.height <= this.dimensions.rows;
      result &&= location.column + dimensions.width <= this.dimensions.columns;
    }

    return result;
  }

  validArea(area: GridArea, assign = false): boolean {
    const name = area.name;

    if (this.validLocation(area.location, area.dimensions)) {
      for (let row = area.row; row < area.row + area.height; row++) {
        for (
          let column = area.column;
          column < area.column + area.width;
          column++
        ) {
          const cell = this.cells[row][column];
          if (cell != name && cell != EMPTY) {
            return false;
          }
        }
      }
    }

    /*
     * Update cells if this are was valid and we should assign it to this
     * position.
     */
    if (assign) {
      for (let row = area.row; row < area.row + area.height; row++) {
        for (
          let column = area.column;
          column < area.column + area.width;
          column++
        ) {
          this.cells[row][column] = name;
        }
      }
    }

    return true;
  }

  #getNextAreaId(): number {
    const result = this.nextAreaId;
    this.nextAreaId++;
    return result;
  }

  assignId(area: GridArea, element?: HTMLElement) {
    if (area.areaId == INIT_ID) {
      area.areaId = this.#getNextAreaId();
      this.byId.set(area.areaId, area);
    }
    if (element != undefined) {
      area.apply(element);
    }
  }

  *areas(): Generator<GridArea> {
    for (const area of this.byId.values()) {
      yield area;
    }
  }

  createArea(
    element?: HTMLElement,
    location?: GridLocation,
    dimensions?: GridDimensions
  ): GridArea {
    const area = new GridArea(location, dimensions);
    assert(this.validLocation(area.location));
    this.assignId(area, element);
    return area;
  }

  expand(direction: Translation, element?: HTMLElement): boolean {
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
    }
    if (isHorizontal(direction)) {
      this.dimensions.columns += 1;
    }

    /*
     * If the grid expanded up or to the left, it moves the origin in that
     * direction. Translate all areas in the opposite direction to reflect
     * their true positions.
     */
    if (direction == Translation.left || direction == Translation.up) {
      const flipped = flip(direction);
      for (const area of this.areas()) {
        area.translate(flipped);
      }
    }

    if (element != undefined) {
      this.apply(element);
    }

    return true;
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
}
