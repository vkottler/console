import { App } from "../App";
import { Translation, translation_name } from "../cartesian/Translation";
import { GRID_RESIZE } from "../grid/base";
import { GridDimensions } from "../grid/GridDimensions";
import { GridElementManager } from "../grid/GridElementManager";

export class SampleApp extends App {
  grid: GridElementManager;
  overlay_content: HTMLElement;

  constructor(root: Element) {
    /*
     * An overlay for debugging.
     */
    const overlay_container = document.createElement("div");
    /* structural */
    overlay_container.style.position = "absolute";
    overlay_container.style.left = "5%";
    overlay_container.style.top = "5%";
    overlay_container.style.width = "10%";
    overlay_container.style.height = "10%";
    overlay_container.style.display = "flex";
    overlay_container.style.justifyContent = "center";
    overlay_container.style.alignItems = "center";

    /* cosmetic */
    overlay_container.style.backgroundColor = "blue";
    overlay_container.style.opacity = "0.7";

    const overlay_content = document.createElement("div");
    /* structural */
    overlay_content.style.textAlign = "center";

    /* cosmetic */
    overlay_content.style.color = "white";
    overlay_content.style.opacity = "1";

    root.appendChild(overlay_container);
    overlay_container.appendChild(overlay_content);

    super(root);
    this.overlay_content = overlay_content;

    /*
     * Add a handler for the grid-resize event.
     */
    this.app.addEventListener(
      GRID_RESIZE,
      ((event: CustomEvent<GridDimensions>) => {
        const dimensions = event.detail;
        this.overlay_content.innerHTML =
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

  direction_keydown(event: KeyboardEvent, direction: Translation) {
    if (event.ctrlKey) {
      if (!this.grid.contract(direction)) {
        console.log(`Couldn't contract: '${translation_name(direction)}'.`);
      }
    } else {
      this.grid.expand(direction);
    }
  }
}
