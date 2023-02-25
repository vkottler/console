import {
  Keybind,
  KeybindCallback,
  KeybindMap,
  ModKeyFlag,
  modKeyValue,
} from "./Keybind";

export class KeybindManager {
  keyup: KeybindMap;
  keydown: KeybindMap;

  constructor() {
    this.keyup = new Map<string, Map<number, Keybind>>();
    this.keydown = new Map<string, Map<number, Keybind>>();
    document.addEventListener("keydown", this.handleKeydown.bind(this));
    document.addEventListener("keyup", this.handleKeyup.bind(this));
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
