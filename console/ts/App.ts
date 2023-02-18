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

  handle_keydown(event: KeyboardEvent) {
    console.log(event);
  }
}
