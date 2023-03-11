import { Namespace } from "../Namespace";

export type ActionCallback = () => void;

export class ActionManager {
  actionMap: Map<string, ActionCallback>;
  names: Namespace;

  constructor() {
    this.actionMap = new Map<string, ActionCallback>();
    this.names = new Namespace();
  }

  register(action: string, callback: ActionCallback): boolean {
    let result = false;

    const name = this.names.name(action);

    if (!this.actionMap.has(name)) {
      this.actionMap.set(name, callback);
      result = true;
    }

    return result;
  }

  trigger(action: string): boolean {
    const callback = this.actionMap.get(this.names.name(action));
    if (callback != undefined) {
      callback();
    }
    return callback != undefined;
  }
}
