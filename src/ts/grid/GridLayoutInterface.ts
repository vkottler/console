import { GridArea } from "./GridArea";
import { GridDimensions } from "./GridDimensions";
import { GridLocation } from "./GridLocation";

export const EMPTY = ".";

interface LayoutInterface {
  dimensions: GridDimensions;
  cells: string[][];
  validLocation: (
    location: GridLocation,
    dimensions?: GridDimensions
  ) => boolean;
}

/**
 * A grid area is valid if:
 * - It fits withing the layout's dimensions
 * - It occupies only cells that belong to it or are empty
 */
export function validArea(
  layout: LayoutInterface,
  area: GridArea,
  assign: boolean
): boolean {
  const name = area.name;

  if (layout.validLocation(area.location, area.dimensions)) {
    for (let row = area.row; row < area.row + area.height; row++) {
      for (
        let column = area.column;
        column < area.column + area.width;
        column++
      ) {
        const cell = layout.cells[row][column];
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
    const name = area.name;
    for (let row = area.row; row < area.row + area.height; row++) {
      for (
        let column = area.column;
        column < area.column + area.width;
        column++
      ) {
        layout.cells[row][column] = name;
      }
    }
  }

  return true;
}

/**
 * Determine if a row is empty.
 */
export function isRowEmpty(layout: LayoutInterface, row: number): boolean {
  for (let col = 0; col < layout.dimensions.columns; col++) {
    if (layout.cells[row][col] != EMPTY) {
      return false;
    }
  }
  return true;
}

/**
 * Determine if a column is empty.
 */
export function isColumnEmpty(
  layout: LayoutInterface,
  column: number
): boolean {
  for (let row = 0; row < layout.dimensions.rows; row++) {
    if (layout.cells[row][column] != EMPTY) {
      return false;
    }
  }
  return true;
}

export function apply(layout: LayoutInterface, element: HTMLElement) {
  /*
   * Update the container's grid-template rows.
   */
  let line = [];
  for (let row = 0; row < layout.dimensions.rows; row++) {
    line.push("auto");
  }

  /*
   * Update the container's grid-template columns.
   */
  line = [];
  for (let column = 0; column < layout.dimensions.columns; column++) {
    line.push("auto");
  }

  /*
   * Update the container's grid-template areas;
   */
  let areas = "";
  for (let row = 0; row < layout.dimensions.rows; row++) {
    line = [];
    for (let column = 0; column < layout.dimensions.columns; column++) {
      line.push(layout.cells[row][column]);
    }
    areas += '"' + line.join(" ") + '"';
    if (row < layout.dimensions.rows - 1) {
      areas += "\n";
    }
  }
  element.style.gridTemplateAreas = areas;
  element.style.display = "grid";
}
