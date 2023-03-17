import assert from "assert";

import { BaseSampleApp } from "./BaseSampleApp";

export class SampleApp extends BaseSampleApp {
  registerKeybinds() {
    assert(
      this.keybinds.registerConfigMap({
        expandAndCreateAreaUp: { key: "k" },
        expandAndCreateAreaDown: { key: "j" },
        expandAndCreateAreaLeft: { key: "h" },
        expandAndCreateAreaRight: { key: "l" },

        moveCursorUp: { key: "ArrowUp" },
        moveCursorDown: { key: "ArrowDown" },
        moveCursorLeft: { key: "ArrowLeft" },
        moveCursorRight: { key: "ArrowRight" },
      })
    );
  }
}
