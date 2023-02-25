import assert from "assert";

import { App } from "../App";
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

    const handler = this.layout.expandHandler.bind(this.layout);
    for (const key of ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]) {
      this.keybinds.register(key, handler);
    }
  }

  dispatch() {
    return;
  }
}
