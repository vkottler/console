import { App } from "../App";
import { Translation, translationName } from "../cartesian/Translation";
import { GRID_RESIZE } from "../grid/base";
import { GridDimensions } from "../grid/GridDimensions";
import { GridElementManager } from "../grid/GridElementManager";

export class SampleApp extends App {
  grid: GridElementManager;
  overlayContent: HTMLElement;

  constructor(root: Element) {
    /*
     * An overlay for debugging.
     */
    const overlayContainer = document.createElement("div");
    /* structural */
    overlayContainer.style.position = "absolute";
    overlayContainer.style.left = "5%";
    overlayContainer.style.top = "5%";
    overlayContainer.style.width = "10%";
    overlayContainer.style.height = "10%";
    overlayContainer.style.display = "flex";
    overlayContainer.style.justifyContent = "center";
    overlayContainer.style.alignItems = "center";

    /* cosmetic */
    overlayContainer.style.backgroundColor = "blue";
    overlayContainer.style.opacity = "0.7";

    const overlayContent = document.createElement("div");
    /* structural */
    overlayContent.style.textAlign = "center";

    /* cosmetic */
    overlayContent.style.color = "white";
    overlayContent.style.opacity = "1";

    root.appendChild(overlayContainer);
    overlayContainer.appendChild(overlayContent);

    super(root);
    this.overlayContent = overlayContent;

    /*
     * Add a handler for the grid-resize event.
     */
    this.app.addEventListener(
      GRID_RESIZE,
      ((event: CustomEvent<GridDimensions>) => {
        const dimensions = event.detail;
        this.overlayContent.innerHTML =
          `rows: ${dimensions.rows}<br>` + `columns: ${dimensions.columns}`;
      }).bind(this) as EventListener
    );

    /*
     * Grid.
     */
    const initial = document.createElement("div");
    initial.innerHTML = "Hello, world!";
    initial.style.backgroundColor = "orange";
    this.grid = new GridElementManager(this.app, "test", initial);
  }

  init() {
    this.app.style.backgroundColor = "grey";
  }

  dispatch() {
    return;
  }

  directionKeydown(event: KeyboardEvent, direction: Translation) {
    if (event.ctrlKey) {
      if (!this.grid.contract(direction)) {
        console.log(`Couldn't contract: '${translationName(direction)}'.`);
      }
    } else {
      this.grid.expand(direction);
    }
  }
}
