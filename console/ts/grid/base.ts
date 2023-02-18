import { GridArea, EMPTY } from "./GridArea";
import { GridDimensions } from "./GridDimensions";

export const GRID_RESIZE = "gridResize";

export class GridElementManagerBase {
  container: HTMLElement;
  areas: Map<string, GridArea>;
  elements: Map<string, HTMLElement>;
  dimensions: GridDimensions;
  layout: string[][];
  cursor: string;

  constructor(
    container: HTMLElement,
    initial_name: string,
    initial_element: HTMLElement
  ) {
    this.container = container;
    this.container.style.display = "grid";

    /*
     * Best effort to keep columns and rows the same size.
     */
    this.container.style.gridAutoRows = "1fr";
    this.container.style.gridAutoColumns = "1fr";

    this.areas = new Map<string, GridArea>();
    this.elements = new Map<string, HTMLElement>();

    this.dimensions = new GridDimensions();
    this.layout = [[EMPTY]];
    this.cursor = "";
    this.createArea(initial_name, initial_element);
    this.fireGridResize();
  }

  get rows(): number {
    return this.dimensions.rows;
  }

  get columns(): number {
    return this.dimensions.columns;
  }

  validate(area: GridArea): boolean {
    return area.validate(this.rows, this.columns, this.layout);
  }

  protected fireGridResize() {
    this.container.dispatchEvent(
      new CustomEvent<GridDimensions>(GRID_RESIZE, { detail: this.dimensions })
    );
  }

  protected update_container() {
    /*
     * Update the container's grid-template rows.
     */
    let line = [];
    for (let row = 0; row < this.rows; row++) {
      line.push("auto");
    }

    /*
     * Update the container's grid-template columns.
     */
    line = [];
    for (let column = 0; column < this.columns; column++) {
      line.push("auto");
    }

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

  handle_cursor(name: string) {
    if (name != this.cursor) {
      this.cursor = name;
      console.log(name);

      /*
       * Set a style for the highlighted element.
       */
      const elem = this.elements.get(name);
      if (elem != undefined) {
        elem.style.backgroundColor = "yellow";
      }
    }
  }

  createArea(
    name: string,
    element: HTMLElement,
    area?: GridArea,
    set_cursor = true
  ): boolean {
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
    this.update_container();

    /*
     * Set the new cursor.
     */
    if (set_cursor) {
      this.handle_cursor(name);
    }

    return true;
  }
}
