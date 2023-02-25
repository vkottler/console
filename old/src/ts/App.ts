import { Translation } from "./cartesian/Translation";

function eventDirection(event: KeyboardEvent): Translation | undefined {
  switch (event.key) {
    case "ArrowLeft":
      return Translation.left;
      break;
    case "ArrowRight":
      return Translation.right;
      break;
    case "ArrowUp":
      return Translation.up;
      break;
    case "ArrowDown":
      return Translation.down;
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

    this.registerEvents();
    this.pollDimensions();
    this.init();
  }

  abstract init(): void | undefined;

  abstract dispatch(): void | undefined;

  registerEvents() {
    window.onresize = this.pollDimensions.bind(this);

    document.addEventListener("keydown", this.handleKeydown.bind(this));
    document.addEventListener("keyup", this.handleKeyup.bind(this));
  }

  dimensionsUpdate(width: number, height: number) {
    console.log(`new width:  ${width}`);
    console.log(`new height: ${height}`);
  }

  pollDimensions() {
    if (
      this.width != this.app.clientWidth ||
      this.height != this.app.clientHeight
    ) {
      this.width = this.app.clientWidth;
      this.height = this.app.clientHeight;
      this.dimensionsUpdate(this.width, this.height);
    }
  }

  handleKeyup(event: KeyboardEvent) {
    console.log(event);
  }

  abstract directionKeydown(
    event: KeyboardEvent,
    direction: Translation
  ): void | undefined;

  handleKeydown(event: KeyboardEvent) {
    const direction = eventDirection(event);

    if (direction != undefined) {
      this.directionKeydown(event, direction);
    }
  }
}
