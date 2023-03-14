import assert from "assert";

import { eventDirection, translationName } from "../cartesian/Translation";
import { ModKeyFlag } from "../control/keybind";
import { ActionKeybindMap } from "../control/keybind/Manager";
import { BaseSampleApp } from "./BaseSampleApp";

export class SampleApp extends BaseSampleApp {
  registerKeybinds() {
    const keybindConfig: ActionKeybindMap = {};

    /* Arrow keys can expand and contract the grid. */
    for (const key of ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]) {
      const direction = eventDirection(
        new KeyboardEvent("keydown", { key: key })
      );
      assert(direction != undefined);
      const directionSuffix = translationName(direction, true);

      keybindConfig[`expand${directionSuffix}`] = { key: key };

      keybindConfig[`contract${directionSuffix}`] = {
        key: key,
        mods: [ModKeyFlag.ctrlKey],
      };
      keybindConfig[`expandCursorArea${directionSuffix}`] = {
        key: key,
        mods: [ModKeyFlag.shiftKey],
      };
      keybindConfig[`contractCursorArea${directionSuffix}`] = {
        key: key,
        mods: [ModKeyFlag.altKey],
      };
      keybindConfig[`expandAndCreateArea${directionSuffix}`] = {
        key: key,
        mods: [ModKeyFlag.shiftKey, ModKeyFlag.ctrlKey],
      };
    }

    assert(this.keybinds.registerConfigMap(keybindConfig));
  }
}
