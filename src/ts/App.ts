export class App {
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
  }

  dispatch() {
    return;
  }

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

  handleKeydown(event: KeyboardEvent) {
    console.log(event);
  }
}
