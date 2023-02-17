import { AppOverlay } from "./AppOverlay";
import { Translation } from "./cartesian/Translation";

export abstract class App {
  root: Element;
  app: HTMLElement;
  overlay: AppOverlay;
  width: number;
  height: number;

  constructor(root: Element) {
    this.root = root;
    this.width = 0;
    this.height = 0;

    this.app = document.createElement("div");
    this.root.appendChild(this.app);
    this.app.style.height = "100%";

    this.overlay = new AppOverlay(this.app);

    this.register_events();
    this.init();
    this.poll_dimensions();
  }

  abstract init(): void | undefined;

  dispatch() {
    this.app.children[1].innerHTML = `time: ${new Date().getTime().toString()}`;
  }

  register_events() {
    window.onresize = this.poll_dimensions.bind(this);

    document.addEventListener("keydown", this.handle_keydown.bind(this));
    document.addEventListener("keyup", this.handle_keyup.bind(this));
  }

  poll_dimensions() {
    if (
      this.width != this.root.clientWidth ||
      this.height != this.root.clientHeight
    ) {
      this.width = this.root.clientWidth;
      this.height = this.root.clientHeight;
      console.log(`new width:  ${this.width}`);
      console.log(`new height: ${this.height}`);

      this.overlay.poll_position();
    }
  }

  handle_keyup(event: KeyboardEvent) {
    console.log(event);
  }

  handle_keydown(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowLeft":
        this.overlay.translate(Translation.LEFT);
        break;
      case "ArrowRight":
        this.overlay.translate(Translation.RIGHT);
        break;
      case "ArrowUp":
        this.overlay.translate(Translation.UP);
        break;
      case "ArrowDown":
        this.overlay.translate(Translation.DOWN);
        break;
    }
  }
}
