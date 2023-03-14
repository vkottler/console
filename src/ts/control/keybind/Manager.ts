import assert from "assert";

import { ActionManager } from "../ActionManager";
import {
  Keybind,
  KeybindCallback,
  KeybindConfig,
  KeybindMap,
  ModKeyFlag,
  modKeyValue,
} from ".";

export type ActionKeybindMap = { [key: string]: KeybindConfig };

export class KeybindManager {
  keyup: KeybindMap;
  keydown: KeybindMap;
  actions: ActionManager;
  actionKeybindCallbacks: Map<string, KeybindCallback>;

  constructor(actions: ActionManager) {
    this.actions = actions;
    this.keyup = new Map<string, Map<number, Keybind>>();
    this.keydown = new Map<string, Map<number, Keybind>>();
    this.actionKeybindCallbacks = new Map<string, KeybindCallback>();
    document.addEventListener("keydown", this.handleKeydown.bind(this));
    document.addEventListener("keyup", this.handleKeyup.bind(this));
  }

  #getActionKeybindCallback(action: string): KeybindCallback {
    let result = this.actionKeybindCallbacks.get(action);

    if (result == undefined) {
      result = ((event: KeyboardEvent) => {
        assert(event);
        return this.actions.trigger(action);
      }).bind(this);
      this.actionKeybindCallbacks.set(action, result);
    }

    return result;
  }

  registerAction(
    action: string,
    key: string,
    mods?: Iterable<ModKeyFlag>,
    keydown = true
  ): boolean {
    return this.register(
      key,
      this.#getActionKeybindCallback(action),
      mods,
      keydown
    );
  }

  registerActionConfig(
    action: string,
    config: KeybindConfig,
    keydown = true
  ): boolean {
    return this.registerAction(action, config.key, config.mods, keydown);
  }

  registerConfigMap(config: ActionKeybindMap): boolean {
    let result = true;
    for (const action in config) {
      result &&= this.registerActionConfig(action, config[action]);
    }
    return result;
  }

  register(
    key: string,
    dispatch: KeybindCallback,
    mods?: Iterable<ModKeyFlag>,
    keydown = true
  ): boolean {
    const bind = new Keybind(key, dispatch, mods);

    let map = this.keyup;
    if (keydown) {
      map = this.keydown;
    }

    return bind.register(map);
  }

  registerConfig(
    config: KeybindConfig,
    dispatch: KeybindCallback,
    keydown = true
  ): boolean {
    return this.register(config.key, dispatch, config.mods, keydown);
  }

  handle(event: KeyboardEvent, map: KeybindMap) {
    const modsMap = map.get(event.key);

    if (modsMap != undefined) {
      const modvalue = modKeyValue(event);
      const keybind = modsMap.get(modvalue);

      /* Remove the keybind if it returns false. */
      if (keybind != undefined && !keybind.dispatch(event)) {
        modsMap.delete(modvalue);
      }
    }
  }

  handleKeyup(event: KeyboardEvent) {
    this.handle(event, this.keyup);
  }

  handleKeydown(event: KeyboardEvent) {
    this.handle(event, this.keydown);
  }
}
