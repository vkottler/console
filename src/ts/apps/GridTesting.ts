import assert from "assert";

import { App } from "../App";
import { ModKeyFlag } from "../control/Keybind";
import { GridArea } from "../grid/GridArea";
import { GridDimensions } from "../grid/GridDimensions";
import { GridLayoutManager } from "../grid/GridLayoutManager";

export class SampleApp extends App {
  layout: GridLayoutManager;

  constructor(root: Element) {
    super(root);
    this.layout = new GridLayoutManager(this.app);

    const gridUpdate = document.createElement("div");

    /* Handle updates to the initial element. */
    const initialElem = this.layout.createArea(
      undefined,
      undefined,
      (event: CustomEvent<GridArea>) => {
        const area = event.detail;

        const parts = [];
        parts.push(`row: ${area.row}`);
        parts.push(`column: ${area.column}`);
        parts.push(`width: ${area.width}`);
        parts.push(`height: ${area.width}`);

        gridUpdate.innerHTML = parts.join(", ");
      }
    );
    assert(initialElem != undefined);
    initialElem.style.backgroundColor = "orange";

    const statusElem = document.createElement("div");
    const errorElem = document.createElement("div");
    initialElem.appendChild(statusElem);
    initialElem.appendChild(errorElem);
    initialElem.appendChild(gridUpdate);

    /* Arrow keys can expand and contract the grid. */
    const expand = this.layout.expandHandler.bind(this.layout);
    const contract = this.layout.contractHandler.bind(this.layout);
    for (const key of ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]) {
      this.keybinds.register(key, expand);
      this.keybinds.register(key, contract, [ModKeyFlag.ctrlKey]);
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
