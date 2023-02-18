import { render } from "preact";

import { App } from "../App";
//import { GridArea } from "../grid/GridArea";
import { AppOverlay } from "../AppOverlay";
import { Translation } from "../cartesian/Translation";
import { GridElementManager } from "../grid/GridElementManager";
import { test_elem } from "../test";

export class SampleApp extends App {
  overlay: AppOverlay;

  constructor(root: Element) {
    super(root);
    this.overlay = new AppOverlay(this.app);
    this.overlay.poll_position();
  }

  init() {
    this.app.style.backgroundColor = "red";

    /* Time display. */
    let new_elem = document.createElement("div");
    new_elem.style.backgroundColor = "green";
    this.app.appendChild(new_elem);

    /* Test that we can render the imported JSX element. */
    new_elem = document.createElement("div");
    new_elem.style.backgroundColor = "yellow";
    this.app.appendChild(new_elem);
    render(test_elem, new_elem);

    /*
     * Sample grid container.
     */
    const container = document.createElement("div");
    this.app.appendChild(container);
    container.style.backgroundColor = "blue";
    container.style.width = "50%";

    /*
     * Sample grid element.
     */
    new_elem = document.createElement("div");
    new_elem.innerHTML = "Hello, world! (1)";
    new_elem.style.backgroundColor = "yellow";

    const grid = new GridElementManager(container, "test1", new_elem);

    grid.expand(Translation.DOWN);
    grid.expand(Translation.RIGHT);

    /*
    new_elem = document.createElement("div");
    new_elem.innerHTML = "Hello, world! (2)";
    new_elem.style.backgroundColor = "green";
    grid.createArea("test2", new_elem, new GridArea(1, 1));
    */
  }

  direction_keydown(event: KeyboardEvent, direction: Translation) {
    this.overlay.translate(direction);
  }

  dimensions_update(width: number, height: number) {
    super.dimensions_update(width, height);
    this.overlay.poll_position();
  }

  dispatch() {
    this.app.children[1].innerHTML = `time: ${new Date().getTime().toString()}`;
  }
}
