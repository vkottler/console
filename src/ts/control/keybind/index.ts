import assert from "assert";

export enum ModKeyFlag {
  altKey = 1,
  ctrlKey = 2,
  metaKey = 4,
  shiftKey = 8,
}

export function modKeyValue(event: KeyboardEvent): number {
  let result = 0;

  if (event.altKey) {
    result |= ModKeyFlag.altKey;
  }
  if (event.ctrlKey) {
    result |= ModKeyFlag.ctrlKey;
  }
  if (event.metaKey) {
    result |= ModKeyFlag.metaKey;
  }
  if (event.shiftKey) {
    result |= ModKeyFlag.shiftKey;
  }

  return result;
}

export type KeybindMap = Map<string, Map<number, Keybind>>;
export type KeybindCallback = (event: KeyboardEvent) => boolean;

export type KeybindConfig = { key: string; mods?: Iterable<ModKeyFlag> };

export function createEvent(
  config: KeybindConfig,
  kind = "keydown"
): KeyboardEvent {
  const options = {
    key: config.key,
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    metaKey: false,
  };

  let requiredMods = 0;
  if (config.mods != undefined) {
    for (const mod of config.mods) {
      requiredMods |= mod;
    }
  }

  if (requiredMods & ModKeyFlag.altKey) {
    options.altKey = true;
  }
  if (requiredMods & ModKeyFlag.ctrlKey) {
    options.ctrlKey = true;
  }
  if (requiredMods & ModKeyFlag.metaKey) {
    options.metaKey = true;
  }
  if (requiredMods & ModKeyFlag.shiftKey) {
    options.shiftKey = true;
  }

  return new KeyboardEvent(kind, options);
}

export class Keybind {
  config: KeybindConfig;
  requiredMods: number;
  dispatchCallback: KeybindCallback | undefined;

  constructor(
    key: string,
    dispatch?: KeybindCallback,
    mods?: Iterable<ModKeyFlag>
  ) {
    this.config = { key: key, mods: mods };

    this.dispatchCallback = undefined;
    if (dispatch != undefined) {
      this.assign(dispatch);
    }

    this.requiredMods = 0;

    if (mods != undefined) {
      for (const mod of mods) {
        this.requiredMods |= mod;
      }
    }
  }

  static fromConfig(
    config: KeybindConfig,
    dispatch?: KeybindCallback
  ): Keybind {
    return new Keybind(config.key, dispatch, config.mods);
  }

  get key(): string {
    return this.config.key;
  }

  assign(callback: KeybindCallback) {
    assert(this.dispatchCallback == undefined);
    this.dispatchCallback = callback;
  }

  dispatch(event: KeyboardEvent): boolean {
    let result = false;
    if (this.dispatchCallback != undefined) {
      result = this.dispatchCallback(event);
    }
    return result;
  }

  matches(event: KeyboardEvent): boolean {
    return this.matchesMods(event) && event.key == this.key;
  }

  matchesMods(event: KeyboardEvent): boolean {
    return modKeyValue(event) == this.requiredMods;
  }

  register(map: KeybindMap): boolean {
    if (!map.has(this.key)) {
      map.set(this.key, new Map<number, Keybind>());
    }

    const modsMap = map.get(this.key);

    if (modsMap != undefined && !modsMap.has(this.requiredMods)) {
      modsMap.set(this.requiredMods, this);
      return true;
    }

    return false;
  }

  createEvent(kind = "keydown"): KeyboardEvent {
    return createEvent(this.config, kind);
  }
}
