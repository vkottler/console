import { EMPTY, GridArea } from "./GridArea";
import { GridDimensions } from "./GridDimensions";

export const GRID_RESIZE = "gridResize";
export const ERROR_MESSAGE = "errorMessage";

export class GridElementManagerBase {
  container: HTMLElement;
  areas: Map<number, GridArea>;
  elements: Map<number, HTMLElement>;
  dimensions: GridDimensions;
  layout: string[][];
  cursor: number;
  nextAreaId: number;

  constructor(container: HTMLElement, initialElement: HTMLElement) {
    this.container = container;
    this.container.style.display = "grid";

    /*
     * Best effort to keep columns and rows the same size.
     */
    this.container.style.gridAutoRows = "1fr";
    this.container.style.gridAutoColumns = "1fr";

    this.areas = new Map<number, GridArea>();
    this.elements = new Map<number, HTMLElement>();

    this.dimensions = new GridDimensions();
    this.layout = [[EMPTY]];
    this.nextAreaId = 0;
    this.cursor = -1;
    this.createArea(initialElement);
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

  fireErrorMessage(message: string) {
    this.container.dispatchEvent(
      new CustomEvent<string>(ERROR_MESSAGE, { detail: message })
    );
  }

  protected updateContainer() {
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

  handleCursor(areaId: number) {
    if (areaId != this.cursor) {
      this.cursor = areaId;

      /*
       * Set a style for the highlighted element.
       */
      const elem = this.elements.get(this.cursor);
      if (elem != undefined) {
        elem.style.backgroundColor = "yellow";
      }
    }
  }

  areaName(areaId: number): string {
    return "area-" + areaId.toString();
  }

  #getNextAreaId(): number {
    const result = this.nextAreaId;
    this.nextAreaId++;
    return result;
  }

  createArea(element: HTMLElement, area?: GridArea, setCursor = true): boolean {
    if (area == undefined) {
      area = new GridArea();
      /* update this so it's in an unallocated location? */
    }

    if (!this.validate(area)) {
      return false;
    }

    const areaId = this.#getNextAreaId();
    this.areas.set(areaId, area);
    this.elements.set(areaId, element);

    const areaName = this.areaName(areaId);
    element.style.gridArea = areaName;
    this.container.appendChild(element);

    /*
     * Update the layout structure.
     */
    area.updateLayout(areaName, this.layout);
    this.updateContainer();

    /*
     * Set the new cursor.
     */
    if (setCursor) {
      this.handleCursor(areaId);
    }

    return true;
  }
}
