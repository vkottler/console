import { App } from "../App";
import { GridElementManager } from "../grid/GridElementManager";
import { Translation } from "../cartesian/Translation";

export class SampleApp extends App {
  grid: GridElementManager;

  constructor(root: Element) {
    super(root);

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

  handle_keydown(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowLeft":
        this.grid.expand(Translation.LEFT);
        break;
      case "ArrowRight":
        this.grid.expand(Translation.RIGHT);
        break;
      case "ArrowUp":
        this.grid.expand(Translation.UP);
        break;
      case "ArrowDown":
        this.grid.expand(Translation.DOWN);
        break;
    }
  }
}
