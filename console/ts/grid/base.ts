import { GridArea } from "./GridArea";
import { GridDimensions } from "./GridDimensions";
import { GridLayout } from "./GridLayout";

export const GRID_RESIZE = "gridResize";
export const ERROR_MESSAGE = "errorMessage";

export class GridElementManagerBase {
  container: HTMLElement;
  areas: Map<number, GridArea>;
  elements: Map<number, HTMLElement>;
  layout: GridLayout;

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

    this.layout = new GridLayout();

    this.createArea(initialElement);
    this.fireGridResize();
  }

  get dimensions(): GridDimensions {
    return this.layout.dimensions;
  }

  get rows(): number {
    return this.dimensions.rows;
  }

  get columns(): number {
    return this.dimensions.columns;
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
    this.layout.apply(this.container);
  }

  handleCursor(areaId: number) {
    if (areaId != this.layout.cursor) {
      this.layout.cursor = areaId;

      /*
       * Set a style for the highlighted element.
       */
      const elem = this.elements.get(this.layout.cursor);
      if (elem != undefined) {
        elem.style.backgroundColor = "yellow";
      }
    }
  }

  createArea(element: HTMLElement, area?: GridArea, setCursor = true): boolean {
    if (area == undefined) {
      area = this.layout.createArea(element);
    } else {
      this.layout.assignId(area, element);
    }

    if (!this.layout.validArea(area)) {
      this.fireErrorMessage("New area is invalid.");
      return false;
    }

    this.areas.set(area.areaId, area);
    this.elements.set(area.areaId, element);
    this.container.appendChild(element);

    /*
     * Update the layout structure.
     */
    this.layout.update(area);
    this.updateContainer();

    /*
     * Set the new cursor.
     */
    if (setCursor) {
      this.handleCursor(area.areaId);
    }

    return true;
  }
}
