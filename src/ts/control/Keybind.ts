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

export class Keybind {
  key: string;
  requiredMods: number;
  dispatch: KeybindCallback;

  constructor(
    key: string,
    dispatch: KeybindCallback,
    mods?: Iterable<ModKeyFlag>
  ) {
    this.key = key;
    this.dispatch = dispatch;
    this.requiredMods = 0;

    if (mods != undefined) {
      for (const mod of mods) {
        this.requiredMods |= mod;
      }
    }
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
}
