import assert from "assert";

import {
  allTranslations,
  Translation,
  translationName,
} from "../cartesian/Translation";
import { ActionManager } from "../control/ActionManager";
import { AreaUpdateHandler, GridArea } from "./GridArea";
import { GridDimensions } from "./GridDimensions";
import { GridLayout } from "./GridLayout";
import { GridLocation } from "./GridLocation";

const GRID_RESIZE = "gridResize";
const ERROR_MESSAGE = "errorMessage";
const GRID_AREA_UPDATE = "gridAreaUpdate";

type GridResizeHandler = (event: CustomEvent<GridDimensions>) => void;
type GridErrorHandler = (event: CustomEvent<string>) => void;

export type ElementArea = {
  element: HTMLElement;
  area: GridArea;
};

export type GridAreaUpdateHandler = (event: CustomEvent<ElementArea>) => void;

export type CursorUpdate = {
  prev: ElementArea | undefined;
  curr: ElementArea | undefined;
};

const CURSOR_UPDATE = "cursorUpdate";

export type CursorUpdateHandler = (event: CustomEvent<CursorUpdate>) => void;

export class GridLayoutManager {
  container: HTMLElement;
  layout: GridLayout;
  elements: Map<number, HTMLElement>;
  areaUpdateHandler: AreaUpdateHandler;

  constructor(container: HTMLElement, cursorHandler?: CursorUpdateHandler) {
    this.container = container;
    this.container.style.display = "grid";

    /* Best effort to keep columns and rows the same size. */
    this.container.style.gridAutoRows = "1fr";
    this.container.style.gridAutoColumns = "1fr";

    this.layout = new GridLayout(this.#handleCursorUpdate.bind(this));
    this.elements = new Map<number, HTMLElement>();
    this.areaUpdateHandler = this.#handleAreaUpdate.bind(this);

    /* Apply the initial, empty layout. */
    this.layout.apply(this.container);

    /* Register a cursor handler if one was provided. */
    if (cursorHandler != undefined) {
      this.container.addEventListener(
        CURSOR_UPDATE,
        cursorHandler as EventListener
      );
    }
  }

  #handleAreaUpdate(area: GridArea) {
    const element = this.elements.get(area.areaId);
    if (element != undefined) {
      element.dispatchEvent(
        new CustomEvent<ElementArea>(GRID_AREA_UPDATE, {
          detail: { area: area, element: element },
        })
      );
    }
  }

  getElementArea(areaId: number): ElementArea | undefined {
    let result = undefined;

    const area = this.layout.byId.get(areaId);
    if (area != undefined) {
      const element = this.elements.get(areaId);
      assert(element != undefined);
      result = { element: element, area: area };
    }

    return result;
  }

  #handleCursorUpdate(prevCursor: number, currCursor: number) {
    this.getElementArea(currCursor);
    this.container.dispatchEvent(
      new CustomEvent<CursorUpdate>(CURSOR_UPDATE, {
        detail: {
          prev: this.getElementArea(prevCursor),
          curr: this.getElementArea(currCursor),
        },
      })
    );
  }

  createArea(
    location?: GridLocation,
    dimensions?: GridDimensions,
    handler?: GridAreaUpdateHandler,
    moveCursor = false,
    kind = "div"
  ): HTMLElement | undefined {
    const element = document.createElement(kind);

    const area = this.layout.createArea(
      element,
      location,
      dimensions,
      this.areaUpdateHandler
    );

    /* Set this early, in case we need it in the cursor-update handler. */
    this.elements.set(area.areaId, element);

    if (this.layout.validArea(area, true, moveCursor)) {
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
    } else {
      this.elements.delete(area.areaId);
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

  resizeCursorAreaHandler(
    direction: Translation | undefined,
    isExpand: boolean
  ): boolean {
    let resizeResult = false;

    if (direction != undefined) {
      if (isExpand) {
        resizeResult = this.layout.expandCursorArea(direction, this.container);
        if (!resizeResult) {
          this.#fireErrorMessage(
            `Couldn't expand cursor area ${translationName(direction)}.`
          );
        }
      } else {
        resizeResult = this.layout.contractCursorArea(
          direction,
          this.container
        );
        this.#fireErrorMessage(
          `Couldn't contract cursor area ${translationName(direction)}.`
        );
      }

      /* Detect if resizing an area triggered normalization. */
      if (resizeResult && this.layout.isNormal) {
        this.#fireGridResize();
      }
    }

    return direction != undefined;
  }

  expandHandler(
    direction: Translation | undefined,
    createArea: boolean,
    handler?: GridAreaUpdateHandler,
    moveCursor = false,
    kind = "div"
  ): boolean {
    if (direction != undefined) {
      /* Expanding the grid can't fail currently. */
      const expandResult = this.layout.expand(direction, this.container);

      if (expandResult.success) {
        this.#fireGridResize();

        /* Create a new area if requested. */
        if (createArea) {
          assert(
            this.createArea(
              expandResult.newLocation,
              expandResult.newDimensions,
              handler,
              moveCursor,
              kind
            ) != undefined
          );
        }
      }
    }
    return direction != undefined;
  }

  contractHandler(direction: Translation | undefined): boolean {
    if (direction != undefined) {
      if (this.layout.contract(direction, this.container)) {
        this.#fireGridResize();
      } else {
        this.#fireErrorMessage(
          `Couldn't contract grid ${translationName(direction)}.`
        );
      }
    }
    return direction != undefined;
  }

  registerActions(
    actions: ActionManager,
    gridAreaUpdateHandler: GridAreaUpdateHandler
  ): boolean {
    for (const direction of allTranslations()) {
      const suffix = translationName(direction, true);

      /* Expand. */
      assert(
        actions.register(
          `expand${suffix}`,
          (() => {
            return this.expandHandler(direction, false);
          }).bind(this)
        )
      );

      /* Contract. */
      assert(
        actions.register(
          `contract${suffix}`,
          (() => {
            return this.contractHandler(direction);
          }).bind(this)
        )
      );

      /* Expand cursor area. */
      assert(
        actions.register(
          `expandCursorArea${suffix}`,
          (() => {
            return this.resizeCursorAreaHandler(direction, true);
          }).bind(this)
        )
      );

      /* Contract cursor area. */
      assert(
        actions.register(
          `contractCursorArea${suffix}`,
          (() => {
            return this.resizeCursorAreaHandler(direction, false);
          }).bind(this)
        )
      );

      /* Expand and create handler. */
      assert(
        actions.register(
          `expandAndCreateArea${suffix}`,
          (() => {
            return this.expandHandler(
              direction,
              true,
              gridAreaUpdateHandler,
              true
            );
          }).bind(this)
        )
      );
    }

    return true;
  }
}
