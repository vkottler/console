import { GridArea, EMPTY } from "./GridArea";
import { Translation } from "../cartesian/Translation";

export class GridElementManager {
  container: HTMLElement;
  areas: Map<string, GridArea>;
  elements: Map<string, HTMLElement>;
  rows: number;
  columns: number;
  layout: string[][];

  constructor(
    container: HTMLElement,
    initial_name: string,
    initial_element: HTMLElement
  ) {
    this.container = container;
    this.container.style.display = "grid";

    this.areas = new Map<string, GridArea>();
    this.elements = new Map<string, HTMLElement>();

    this.rows = 1;
    this.columns = 1;
    this.layout = [[EMPTY]];
    this.createArea(initial_name, initial_element);
  }

  validate(area: GridArea): boolean {
    /*
     * Validate location.
     */
    let result = 1 <= area.row && area.row < this.rows;
    result &&= 1 < area.column && area.column < this.columns;

    /*
     * Validate size.
     */
    result &&= area.row + area.height <= this.rows + 1;
    result &&= area.column + area.width <= this.columns + 1;

    if (!result) {
      return false;
    }

    /*
     * Validate that the layout isn't occupied anywhere this area would appear.
     */
    for (let row = area.row - 1; row < area.row + area.height; row++) {
      for (
        let column = area.column - 1;
        column < area.column + area.height;
        column++
      ) {
        if (this.layout[row][column] != EMPTY) {
          return false;
        }
      }
    }

    return true;
  }

  createArea(name: string, element: HTMLElement, area?: GridArea): boolean {
    if (area == undefined) {
      area = new GridArea();
    }

    if (name in this.areas || !this.validate(area)) {
      return false;
    }

    this.areas.set(name, area);
    this.elements.set(name, element);

    element.style.gridArea = name;
    this.container.appendChild(element);

    /*
     * Update the layout structure.
     */
    area.update_layout(name, this.layout);

    /*
     * Update the container's grid-template rows.
     */
    let line = [];
    for (let row = 0; row < this.rows; row++) {
      line.push("auto");
    }
    this.container.style.gridTemplateRows = line.join(" ");

    /*
     * Update the container's grid-template columns.
     */
    line = [];
    for (let column = 0; column < this.columns; column++) {
      line.push("auto");
    }
    this.container.style.gridTemplateColumns = line.join(" ");

    /*
     * Update the container's grid-template areas;
     */
    let areas = "";
    for (let row = 0; row < this.rows; row++) {
      line = [];
      for (let column = 0; column < this.columns; column++) {
        line.push(this.layout[row][column]);
      }
      areas += line.join(" ") + "\n";
    }
    this.container.style.gridTemplateAreas = areas;

    return true;
  }

  updateArea(name: string, area: GridArea): boolean {
    if (!(name in this.areas) || !this.validate(area)) {
      return false;
    }

    /* update the area and grid styling */

    return true;
  }

  removeArea(name: string): boolean {
    if (!(name in this.areas)) {
      return false;
    }

    /* remove area and update grid styling */

    return true;
  }

  expand(direction: Translation) {
    console.log(direction);
  }

  contract(direction: Translation): boolean {
    console.log(direction);
    return true;
  }
}
