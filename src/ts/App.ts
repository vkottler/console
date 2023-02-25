import { KeybindManager } from "./control/KeybindManager";

export abstract class App {
  app: HTMLElement;
  width: number;
  height: number;
  keybinds: KeybindManager;

  constructor(root: Element) {
    this.width = 0;
    this.height = 0;

    this.app = document.createElement("div");
    root.appendChild(this.app);
    this.app.style.height = "100%";

    this.keybinds = new KeybindManager();

    this.registerEvents();
    this.init();
    this.pollDimensions();
  }

  abstract init(): void | undefined;

  abstract dispatch(): void | undefined;

  registerEvents() {
    window.onresize = this.pollDimensions.bind(this);
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
}
