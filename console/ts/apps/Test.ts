import { render } from "preact";

import { App } from "../App";
//import { GridArea } from "../grid/GridArea";
import { AppOverlay } from "../AppOverlay";
import { Translation } from "../cartesian/Translation";
import { GridElementManager } from "../grid/GridElementManager";
import { testElem } from "../test";

export class SampleApp extends App {
  overlay: AppOverlay;

  constructor(root: Element) {
    super(root);
    this.overlay = new AppOverlay(this.app);
    this.overlay.pollPosition();
  }

  init() {
    this.app.style.backgroundColor = "red";

    /* Time display. */
    let newElem = document.createElement("div");
    newElem.style.backgroundColor = "green";
    this.app.appendChild(newElem);

    /* Test that we can render the imported JSX element. */
    newElem = document.createElement("div");
    newElem.style.backgroundColor = "yellow";
    this.app.appendChild(newElem);
    render(testElem, newElem);

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
    newElem = document.createElement("div");
    newElem.innerHTML = "Hello, world! (1)";
    newElem.style.backgroundColor = "yellow";

    const grid = new GridElementManager(container, "test1", newElem);

    grid.expand(Translation.down);
    grid.expand(Translation.right);

    /*
    newElem = document.createElement("div");
    newElem.innerHTML = "Hello, world! (2)";
    newElem.style.backgroundColor = "green";
    grid.createArea("test2", newElem, new GridArea(1, 1));
    */
  }

  directionKeydown(event: KeyboardEvent, direction: Translation) {
    this.overlay.translate(direction);
  }

  dimensionsUpdate(width: number, height: number) {
    super.dimensionsUpdate(width, height);
    this.overlay.pollPosition();
  }

  dispatch() {
    this.app.children[1].innerHTML = `time: ${new Date().getTime().toString()}`;
  }
}
