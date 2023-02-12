import { AppOverlay } from "./overlay";
import { test_elem } from "./test";
import { render } from "preact";

export class App {
  root: Element;
  app: HTMLElement;
  overlay: AppOverlay;
  width: number;
  height: number;

  constructor(root: Element) {
    this.root = root;
    this.width = 0;
    this.height = 0;
    this.poll_dimensions();
    this.register_events();

    this.app = document.createElement("div");
    this.root.appendChild(this.app);
    this.app.style.height = "100%";
    this.app.style.backgroundColor = "red";

    this.overlay = new AppOverlay(this.app);

    /* Time display. */
    let new_elem = document.createElement("div");
    new_elem.style.backgroundColor = "green";
    this.app.appendChild(new_elem);

    /* Test that we can render the imported JSX element. */
    new_elem = document.createElement("div");
    new_elem.style.backgroundColor = "yellow";
    this.app.appendChild(new_elem);
    render(test_elem, new_elem);
  }

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
    }
  }

  handle_keyup(event: KeyboardEvent) {
    console.log("keyup");
    console.log(event);
  }

  handle_keydown(event: KeyboardEvent) {
    console.log("keydown");
    console.log(event);
  }
}
