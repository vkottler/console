import { App } from "../App";
import { GridElementManager } from "../grid/GridElementManager";
import { Translation, translation_name } from "../cartesian/Translation";

function event_direction(event: KeyboardEvent): Translation | undefined {
  switch (event.key) {
    case "ArrowLeft":
      return Translation.LEFT;
      break;
    case "ArrowRight":
      return Translation.RIGHT;
      break;
    case "ArrowUp":
      return Translation.UP;
      break;
    case "ArrowDown":
      return Translation.DOWN;
      break;
  }
}

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
