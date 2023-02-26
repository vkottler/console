import assert from "assert";

import { App } from "../App";
import { ModKeyFlag } from "../control/Keybind";
import { GridLayoutManager } from "../grid/GridLayoutManager";

export class SampleApp extends App {
  layout: GridLayoutManager;

  constructor(root: Element) {
    super(root);
    this.layout = new GridLayoutManager(this.app);

    const initialElem = this.layout.createArea();
    assert(initialElem != undefined);

    initialElem.innerHTML = "Hello, world!";
    initialElem.style.backgroundColor = "orange";

    /* Arrow keys can expand and contract the grid. */
    const expand = this.layout.expandHandler.bind(this.layout);
    const contract = this.layout.contractHandler.bind(this.layout);
    for (const key of ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]) {
      this.keybinds.register(key, expand);
      this.keybinds.register(key, contract, [ModKeyFlag.ctrlKey]);
    }
  }

  dispatch() {
    return;
  }
}
