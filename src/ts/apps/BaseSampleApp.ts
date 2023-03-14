import assert from "assert";

import { App } from "../App";
import {
  GridAreaUpdateHandler,
  GridLayoutManager,
} from "../grid/GridLayoutManager";
import { sampleGridUpdateHandler, sampleLayoutManager } from "./Staging";

export abstract class BaseSampleApp extends App {
  layout: GridLayoutManager;
  gridAreaUpdateHandler: GridAreaUpdateHandler;

  constructor(root: Element) {
    super(root);
    this.layout = sampleLayoutManager(this.app);
    this.gridAreaUpdateHandler = sampleGridUpdateHandler;

    /* Handle updates to the initial element. */
    const initialElem = this.layout.createArea(
      undefined,
      undefined,
      this.gridAreaUpdateHandler
    );
    assert(initialElem != undefined);

    assert(
      this.layout.registerActions(this.actions, this.gridAreaUpdateHandler)
    );
    this.registerKeybinds();
  }

  abstract registerKeybinds(): void;
}
