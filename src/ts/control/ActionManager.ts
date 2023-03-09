export type ActionCallback = () => void;

export class ActionManager {
  actionMap: Map<string, ActionCallback>;

  constructor() {
    this.actionMap = new Map<string, ActionCallback>();
  }

  register(action: string, callback: ActionCallback): boolean {
    let result = false;

    if (!this.actionMap.has(action)) {
      this.actionMap.set(action, callback);
      result = true;
    }

    return result;
  }

  trigger(action: string): boolean {
    const callback = this.actionMap.get(action);
    if (callback != undefined) {
      callback();
    }
    return callback != undefined;
  }
}
