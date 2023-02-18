import { Translation } from "./cartesian/Translation";

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

export abstract class App {
  app: HTMLElement;
  width: number;
  height: number;

  constructor(root: Element) {
    this.width = 0;
    this.height = 0;

    this.app = document.createElement("div");
    root.appendChild(this.app);
    this.app.style.height = "100%";

    this.register_events();
    this.init();
    this.poll_dimensions();
  }

  abstract init(): void | undefined;

  abstract dispatch(): void | undefined;

  register_events() {
    window.onresize = this.poll_dimensions.bind(this);

    document.addEventListener("keydown", this.handle_keydown.bind(this));
    document.addEventListener("keyup", this.handle_keyup.bind(this));
  }

  dimensions_update(width: number, height: number) {
    console.log(`new width:  ${width}`);
    console.log(`new height: ${height}`);
  }

  poll_dimensions() {
    if (
      this.width != this.app.clientWidth ||
      this.height != this.app.clientHeight
    ) {
      this.width = this.app.clientWidth;
      this.height = this.app.clientHeight;
      this.dimensions_update(this.width, this.height);
    }
  }

  handle_keyup(event: KeyboardEvent) {
    console.log(event);
  }

  abstract direction_keydown(
    event: KeyboardEvent,
    direction: Translation
  ): void | undefined;

  handle_keydown(event: KeyboardEvent) {
    const direction = event_direction(event);

    if (direction != undefined) {
      this.direction_keydown(event, direction);
    }
  }
}
