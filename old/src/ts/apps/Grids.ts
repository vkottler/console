import { App } from "../App";
import { Translation, translationName } from "../cartesian/Translation";
import { ERROR_MESSAGE, GRID_RESIZE } from "../grid/base";
import { GridDimensions } from "../grid/GridDimensions";
import { GridElementManager } from "../grid/GridElementManager";

export class SampleApp extends App {
  grid: GridElementManager;

  constructor(root: Element) {
    /*
     * An overlay for debugging.
     */
    const overlayContainer = document.createElement("div");
    /* structural */
    overlayContainer.style.position = "absolute";
    overlayContainer.style.left = "5%";
    overlayContainer.style.top = "5%";
    overlayContainer.style.width = "20%";
    overlayContainer.style.height = "20%";
    overlayContainer.style.display = "flex";
    overlayContainer.style.flexDirection = "column";
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

    const overlayMessage = document.createElement("div");
    /* structural */
    overlayMessage.style.textAlign = "center";

    /* cosmetic */
    overlayMessage.style.color = "white";
    overlayMessage.style.opacity = "1";

    root.appendChild(overlayContainer);
    overlayContainer.appendChild(overlayContent);
    overlayContainer.appendChild(overlayMessage);

    super(root);

    /*
     * Add a handler for the grid-resize event.
     */
    this.app.addEventListener(GRID_RESIZE, ((
      event: CustomEvent<GridDimensions>
    ) => {
      const dimensions = event.detail;
      overlayContent.innerHTML =
        `rows: ${dimensions.rows}<br>` + `columns: ${dimensions.columns}`;
    }) as EventListener);

    /*
     * Add a handler for error messages.
     */
    this.app.addEventListener(ERROR_MESSAGE, ((event: CustomEvent<string>) => {
      overlayMessage.innerHTML = "Error: " + event.detail;
    }) as EventListener);

    /*
     * Grid.
     */
    const initial = document.createElement("div");
    initial.innerHTML = "Hello, world!";
    initial.style.backgroundColor = "orange";
    this.grid = new GridElementManager(this.app, initial);
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
        this.grid.fireErrorMessage(
          `Couldn't contract: '${translationName(direction)}'.`
        );
      }
    } else {
      this.grid.expand(direction);
    }
  }
}
