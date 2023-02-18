import { GridArea, EMPTY } from "./GridArea";
import {
  Translation,
  is_vertical,
  is_horizontal,
} from "../cartesian/Translation";

function new_row(columns: number): string[] {
  const new_row = [];
  for (let col = 0; col < columns; col++) {
    new_row.push(EMPTY);
  }
  return new_row;
}

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
    this.container.style.gridAutoRows = "1fr";

    this.areas = new Map<string, GridArea>();
    this.elements = new Map<string, HTMLElement>();

    this.rows = 1;
    this.columns = 1;
    this.layout = [[EMPTY]];
    this.createArea(initial_name, initial_element);
  }

  validate(area: GridArea): boolean {
    return area.validate(this.rows, this.columns, this.layout);
  }

  #update_container() {
    /*
     * Update the container's grid-template rows.
     */
    let line = [];
    for (let row = 0; row < this.rows; row++) {
      line.push("auto");
    }
    //this.container.style.gridTemplateRows = line.join(" ");

    /*
     * Update the container's grid-template columns.
     */
    line = [];
    for (let column = 0; column < this.columns; column++) {
      line.push("auto");
    }
    //this.container.style.gridTemplateColumns = line.join(" ");

    /*
     * Update the container's grid-template areas;
     */
    let areas = "";
    for (let row = 0; row < this.rows; row++) {
      line = [];
      for (let column = 0; column < this.columns; column++) {
        line.push(this.layout[row][column]);
      }
      areas += '"' + line.join(" ") + '"';
      if (row < this.rows - 1) {
        areas += "\n";
      }
    }
    this.container.style.gridTemplateAreas = areas;
  }

  createArea(name: string, element: HTMLElement, area?: GridArea): boolean {
    if (area == undefined) {
      area = new GridArea();
      /* update this so it's in an unallocated location? */
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
    this.#update_container();

    return true;
  }

  updateArea(name: string, area: GridArea): boolean {
    if (!(name in this.areas) || !this.validate(area)) {
      return false;
    }

    /* update the area and grid styling */

    this.#update_container();

    return true;
  }

  removeArea(name: string): boolean {
    if (!(name in this.areas)) {
      return false;
    }

    /* remove area and update grid styling */

    this.#update_container();

    return true;
  }

  expand(direction: Translation) {
    switch (direction) {
      case Translation.UP:
        this.layout.unshift(new_row(this.columns));
        break;
      case Translation.DOWN:
        this.layout.push(new_row(this.columns));
        break;
      case Translation.LEFT:
        for (let row = 0; row < this.rows; row++) {
          this.layout[row].unshift(EMPTY);
        }
        break;
      case Translation.RIGHT:
        for (let row = 0; row < this.rows; row++) {
          this.layout[row].push(EMPTY);
        }
        break;
    }

    if (is_vertical(direction)) {
      this.rows += 1;
    }
    if (is_horizontal(direction)) {
      this.columns += 1;
    }

    this.#update_container();
  }

  contract(direction: Translation): boolean {
    console.log(direction);

    this.#update_container();

    return true;
  }
}
