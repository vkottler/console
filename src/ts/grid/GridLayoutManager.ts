import { eventDirection, translationName } from "../cartesian/Translation";
import { AreaUpdateHandler, GridArea } from "./GridArea";
import { GridDimensions } from "./GridDimensions";
import { GridLayout } from "./GridLayout";
import { GridLocation } from "./GridLocation";

const GRID_RESIZE = "gridResize";
const ERROR_MESSAGE = "errorMessage";
const GRID_AREA_UPDATE = "gridAreaUpdate";

type GridResizeHandler = (event: CustomEvent<GridDimensions>) => void;
type GridErrorHandler = (event: CustomEvent<string>) => void;
type GridAreaUpdateHandler = (event: CustomEvent<GridArea>) => void;

export class GridLayoutManager {
  container: HTMLElement;
  layout: GridLayout;
  elements: Map<number, HTMLElement>;
  areaUpdateHandler: AreaUpdateHandler;

  constructor(container: HTMLElement) {
    this.container = container;
    this.container.style.display = "grid";

    /* Best effort to keep columns and rows the same size. */
    this.container.style.gridAutoRows = "1fr";
    this.container.style.gridAutoColumns = "1fr";

    this.layout = new GridLayout();
    this.elements = new Map<number, HTMLElement>();
    this.areaUpdateHandler = this.#handleAreaUpdate.bind(this);

    /* Apply the initial, empty layout. */
    this.layout.apply(this.container);
  }

  #handleAreaUpdate(area: GridArea) {
    const element = this.elements.get(area.areaId);
    if (element != undefined) {
      element.dispatchEvent(
        new CustomEvent<GridArea>(GRID_AREA_UPDATE, { detail: area })
      );
    }
  }

  createArea(
    location?: GridLocation,
    dimensions?: GridDimensions,
    handler?: GridAreaUpdateHandler,
    kind = "div"
  ): HTMLElement | undefined {
    const element = document.createElement(kind);

    const area = this.layout.createArea(
      element,
      location,
      dimensions,
      this.areaUpdateHandler
    );

    if (this.layout.validArea(area, true)) {
      this.elements.set(area.areaId, element);

      /* Ensure the layout change gets applied. */
      this.container.appendChild(element);
      this.layout.apply(this.container);

      /* Register a handler if it was provided. */
      if (handler != undefined) {
        element.addEventListener(GRID_AREA_UPDATE, handler as EventListener);
      }

      /* Fire the update event manually. */
      this.#handleAreaUpdate(area);

      return element;
    }
  }

  #fireGridResize() {
    this.container.dispatchEvent(
      new CustomEvent<GridDimensions>(GRID_RESIZE, {
        detail: this.layout.dimensions,
      })
    );
  }

  registerResizeHandler(handler: GridResizeHandler) {
    this.container.addEventListener(GRID_RESIZE, handler as EventListener);

    /* Give the handler a chance to set some initial state. */
    this.#fireGridResize();
  }

  #fireErrorMessage(message: string) {
    this.container.dispatchEvent(
      new CustomEvent<string>(ERROR_MESSAGE, { detail: message })
    );
  }

  registerErrorHandler(handler: GridErrorHandler) {
    this.container.addEventListener(ERROR_MESSAGE, handler as EventListener);
  }

  resizeHandler(event: KeyboardEvent, isExpand: boolean): boolean {
    const direction = eventDirection(event);
    if (direction != undefined) {
      if (isExpand) {
        /* Expanding the grid can't fail currently. */
        if (this.layout.expand(direction, this.container)) {
          this.#fireGridResize();
        }
      } else {
        if (this.layout.contract(direction, this.container)) {
          this.#fireGridResize();
        } else {
          this.#fireErrorMessage(
            `Couldn't contract grid ${translationName(direction)}.`
          );
        }
      }
    }
    return direction != undefined;
  }

  expandHandler(event: KeyboardEvent): boolean {
    return this.resizeHandler(event, true);
  }

  contractHandler(event: KeyboardEvent): boolean {
    return this.resizeHandler(event, false);
  }
}
