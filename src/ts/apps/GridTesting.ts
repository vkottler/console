import assert from "assert";

import { App } from "../App";
import { ModKeyFlag } from "../control/Keybind";
import { GridDimensions } from "../grid/GridDimensions";
import {
  CursorUpdate,
  ElementArea,
  GridLayoutManager,
} from "../grid/GridLayoutManager";

export class SampleApp extends App {
  layout: GridLayoutManager;

  constructor(root: Element) {
    super(root);

    this.layout = new GridLayoutManager(
      this.app,
      ((event: CustomEvent<CursorUpdate>) => {
        const curr = event.detail.curr;
        const prev = event.detail.prev;
        if (curr != undefined) {
          curr.element.style.borderStyle = "solid";
          curr.element.style.backgroundColor = "green";
        }
        if (prev != undefined) {
          prev.element.style.borderStyle = "none";
          prev.element.style.backgroundColor = "white";
        }
      }).bind(this)
    );

    const gridAreaUpdateHandler = (event: CustomEvent<ElementArea>) => {
      const area = event.detail.area;

      const parts = [];
      parts.push(`name: ${area.name}`);
      parts.push(`row: ${area.row}`);
      parts.push(`column: ${area.column}`);
      parts.push(`height: ${area.height}`);
      parts.push(`width: ${area.width}`);

      event.detail.element.innerHTML = parts.join(", ");
    };

    /* Handle updates to the initial element. */
    const initialElem = this.layout.createArea(
      undefined,
      undefined,
      gridAreaUpdateHandler
    );
    assert(initialElem != undefined);

    const statusElem = document.createElement("div");
    const errorElem = document.createElement("div");
    initialElem.appendChild(statusElem);
    initialElem.appendChild(errorElem);

    /* Arrow keys can expand and contract the grid. */
    const expand = this.layout.expandHandler.bind(this.layout);
    const contract = this.layout.contractHandler.bind(this.layout);
    const expandArea = this.layout.expandCursorAreaHandler.bind(this.layout);
    const contractArea = this.layout.contractCursorAreaHandler.bind(
      this.layout
    );

    /* Expand and create handler. */
    const layout = this.layout;
    const expandCreateArea = ((event: KeyboardEvent): boolean => {
      return layout.expandCreateHandler(event, gridAreaUpdateHandler, true);
    }).bind(this.layout);

    for (const key of ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]) {
      this.keybinds.register(key, expand);
      this.keybinds.register(key, contract, [ModKeyFlag.ctrlKey]);
      this.keybinds.register(key, expandArea, [ModKeyFlag.shiftKey]);
      this.keybinds.register(key, contractArea, [ModKeyFlag.altKey]);
      this.keybinds.register(key, expandCreateArea, [
        ModKeyFlag.shiftKey,
        ModKeyFlag.ctrlKey,
      ]);
    }

    /* Basic resize handler: show info about size. */
    this.layout.registerResizeHandler((event: CustomEvent<GridDimensions>) => {
      const dimensions = event.detail;
      statusElem.innerHTML =
        `rows: ${dimensions.rows}<br>` + `columns: ${dimensions.columns}`;
    });

    /* Basic error handler: show info about error. */
    this.layout.registerErrorHandler((event: CustomEvent<string>) => {
      errorElem.innerHTML = `Error: ${event.detail}`;
    });
  }

  dispatch() {
    return;
  }
}
