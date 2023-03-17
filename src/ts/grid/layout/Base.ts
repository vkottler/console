import assert from "assert";

import {
  flip,
  isHorizontal,
  isVertical,
  Translation,
} from "../../cartesian/Translation";
import { AreaUpdateHandler, GridArea, INIT_ID } from "../Area";
import { GridDimensions } from "../Dimensions";
import { GridLocation } from "../Location";
import {
  apply,
  EMPTY,
  isColumnEmpty,
  isRowEmpty,
  validArea,
} from "./Interface";

function newRow(columns: number): string[] {
  const newRow = [];
  for (let col = 0; col < columns; col++) {
    newRow.push(EMPTY);
  }
  return newRow;
}

type CursorUpdateHandler = (prevCursor: number, currCursor: number) => void;

type ExpandResult = {
  success: boolean;
  newLocation: GridLocation;
  newDimensions: GridDimensions;
};

export class GridLayoutBase {
  dimensions: GridDimensions;
  cells: string[][];
  nextAreaId: number;
  byId: Map<number, GridArea>;
  cursor: number;
  cursorHandler: CursorUpdateHandler | undefined;

  constructor(cursorHandler?: CursorUpdateHandler) {
    this.dimensions = new GridDimensions();
    this.cells = [[EMPTY]];
    this.nextAreaId = 0;
    this.byId = new Map<number, GridArea>();
    this.cursor = INIT_ID;
    this.cursorHandler = cursorHandler;
  }

  get cursorArea(): GridArea | undefined {
    if (this.cursor != INIT_ID) {
      const result = this.byId.get(this.cursor);
      assert(result != undefined);
      return result;
    }
  }

  get width(): number {
    return this.dimensions.width;
  }

  get height(): number {
    return this.dimensions.height;
  }

  get isNormal(): boolean {
    return this.width == 1 && this.height == 1;
  }
  validLocation(location: GridLocation, dimensions?: GridDimensions): boolean {
    return location.inBounds(this.dimensions, dimensions);
  }

  updateCursor(value: number) {
    const prev = this.cursor;
    this.cursor = value;
    if (this.cursorHandler != undefined) {
      this.cursorHandler(prev, this.cursor);
    }
  }

  validArea(area: GridArea, assign = false, cursor = false): boolean {
    const result = validArea(this, area, assign);

    /*
     * Initialize the cursor if this area is valid and being assigned to the
     * grid.
     */
    if (result && assign) {
      this.byId.set(area.areaId, area);
      if (this.cursor == INIT_ID || cursor) {
        this.updateCursor(area.areaId);
      }
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
      this.byId.set(area.areaId, area);
    }
    if (element != undefined) {
      area.apply(element);
    }
  }

  *areas(
    minRow = 0,
    minColumn = 0,
    maxRow = -1,
    maxColumn = -1
  ): Generator<GridArea> {
    if (maxRow == -1) {
      maxRow = this.height;
    }

    if (maxColumn == -1) {
      maxColumn = this.width;
    }

    for (const area of this.byId.values()) {
      const bottomRight = area.bottomRight;
      if (
        area.row >= minRow &&
        area.column >= minColumn &&
        bottomRight.row <= maxRow &&
        bottomRight.column <= maxColumn
      ) {
        yield area;
      }
    }
  }

  createArea(
    element?: HTMLElement,
    location?: GridLocation,
    dimensions?: GridDimensions,
    handler?: AreaUpdateHandler
  ): GridArea {
    const area = new GridArea(location, dimensions, handler);
    assert(this.validLocation(area.location));
    this.assignId(area, element);
    return area;
  }

  /**
   * Determine if a row is empty.
   */
  #removeEmptyRow(row: number): boolean {
    let result = isRowEmpty(this, row);

    /* Don't remove the only row. */
    result &&= this.dimensions.rows > 1;

    if (result) {
      /*
       * Update area locations for any area beyond the removed row. These
       * areas need 1 subtracted to their row coordinate because the overall
       * grid has shrunk.
       */
      for (const area of this.areas(row)) {
        assert(area.translate(Translation.up));
      }

      this.cells.splice(row, 1);
      this.dimensions.rows -= 1;
    }

    return result;
  }

  /**
   * Determine if a column is empty.
   */
  #removeEmptyColumn(column: number): boolean {
    let result = isColumnEmpty(this, column);

    /* Don't remove the only column. */
    result &&= this.dimensions.columns > 1;

    if (result) {
      /*
       * Update area locations for any area beyond the removed column. These
       * areas need 1 subtracted to their column coordinate because the overall
       * grid has shrunk.
       */
      for (const area of this.areas(0, column)) {
        assert(area.translate(Translation.left));
      }

      /* Remove an element in the underlying grid cells. */
      for (let row = 0; row < this.dimensions.rows; row++) {
        this.cells[row].splice(column, 1);
      }
      this.dimensions.columns -= 1;
    }

    return result;
  }

  contract(
    direction: Translation,
    element?: HTMLElement,
    normalize = true
  ): boolean {
    let result = false;

    switch (direction) {
      /* Attempt to remove the bottom row. */
      case Translation.up:
        result = this.#removeEmptyRow(this.dimensions.rows - 1);
        break;
      /* Attempt to remove the top row. */
      case Translation.down:
        result = this.#removeEmptyRow(0);
        break;
      /* Attempt to remove the furthest-right column. */
      case Translation.left:
        result = this.#removeEmptyColumn(this.dimensions.columns - 1);
        break;
      /* Attempt to remove the furthest-left column. */
      case Translation.right:
        result = this.#removeEmptyColumn(0);
        break;
    }

    if (result) {
      /*
       * Check if this contraction caused the grid and cursor element to be
       * the same size.
       */
      if (normalize) {
        const area = this.cursorArea;
        if (area != undefined) {
          this.#normalize(area, element);
        }
      }

      if (element != undefined) {
        this.apply(element);
      }
    }

    return result;
  }

  #clearAreaCells(area: GridArea) {
    const name = area.name;
    for (let row = 0; row < area.height; row++) {
      for (let column = 0; column < area.width; column++) {
        const rowIdx = area.row + row;
        const columnIdx = area.column + column;
        assert(this.cells[rowIdx][columnIdx] == name);
        this.cells[rowIdx][columnIdx] = EMPTY;
      }
    }
  }

  contractArea(
    area: GridArea,
    direction: Translation,
    element?: HTMLElement
  ): boolean {
    /* Clear cells this area is occupying. */
    this.#clearAreaCells(area);

    /* Attempt contracting. */
    const result = area.contract(direction);

    /*
     * Regardless of successfully contracting, ensure this area occupy's the
     * correct gird cells.
     */
    assert(this.validArea(area, true));

    if (result && element != undefined) {
      this.apply(element);
    }

    return result;
  }

  contractCursorArea(direction: Translation, element?: HTMLElement): boolean {
    let result = false;
    const area = this.cursorArea;

    if (area != undefined) {
      result = this.contractArea(area, direction, element);
    }

    return result;
  }

  #normalize(auditArea: GridArea, element?: HTMLElement) {
    if (
      auditArea.width == this.dimensions.width &&
      auditArea.height == this.dimensions.height
    ) {
      /* Contract width. */
      let contractIterations = this.dimensions.width - 1;
      for (let idx = 0; idx < contractIterations; idx++) {
        assert(this.contractArea(auditArea, Translation.left, element));
        assert(this.contract(Translation.left, element, false));
      }

      /* Contract height. */
      contractIterations = this.dimensions.height - 1;
      for (let idx = 0; idx < contractIterations; idx++) {
        assert(this.contractArea(auditArea, Translation.up, element));
        assert(this.contract(Translation.up, element, false));
      }
    }
  }

  expandArea(
    area: GridArea,
    direction: Translation,
    element?: HTMLElement
  ): boolean {
    const newArea = area.copy();

    let result = newArea.expand(direction, this.dimensions, true, false);
    result &&= this.validArea(newArea, true);

    if (result) {
      newArea.signalHandler();

      if (element != undefined) {
        this.apply(element);
      }

      /*
       * If the area and grid have the same dimensions, we can re-size both
       * to have height and width 1.
       */
      this.#normalize(newArea, element);
    }

    return result;
  }

  expandCursorArea(direction: Translation, element?: HTMLElement): boolean {
    let result = false;
    const area = this.cursorArea;

    if (area != undefined) {
      result = this.expandArea(area, direction, element);
    }

    return result;
  }

  expand(direction: Translation, element?: HTMLElement): ExpandResult {
    const newLocation = new GridLocation();
    const newDimensions = new GridDimensions();

    const result = {
      success: true,
      newLocation: newLocation,
      newDimensions: newDimensions,
    };

    switch (direction) {
      case Translation.up:
        this.cells.unshift(newRow(this.dimensions.columns));
        break;
      case Translation.down:
        this.cells.push(newRow(this.dimensions.columns));
        newLocation.row = this.dimensions.rows;
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
        newLocation.column = this.dimensions.columns;
        break;
    }

    if (isVertical(direction)) {
      newDimensions.columns = this.dimensions.columns;
      this.dimensions.rows++;
    }
    if (isHorizontal(direction)) {
      newDimensions.rows = this.dimensions.rows;
      this.dimensions.columns++;
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

    return result;
  }

  apply(element: HTMLElement) {
    apply(this, element);
  }
}
