import { ActionManager } from "./control/ActionManager";
import { KeybindManager } from "./control/keybind/Manager";

export class App {
  app: HTMLElement;
  width: number;
  height: number;
  actions: ActionManager;
  keybinds: KeybindManager;

  constructor(root: Element) {
    this.width = 0;
    this.height = 0;

    this.app = document.createElement("div");
    root.appendChild(this.app);
    this.app.style.height = "100%";

    this.actions = new ActionManager();
    this.keybinds = new KeybindManager(this.actions);

    window.onresize = this.pollDimensions.bind(this);
    this.pollDimensions();
  }

  dispatch() {
    return;
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
