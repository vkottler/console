import {
  CursorUpdate,
  CursorUpdateHandler,
  ElementArea,
} from "../grid/layout/Manager";

export abstract class CursorInterface {
  handler: CursorUpdateHandler;

  constructor() {
    this.handler = ((event: CustomEvent<CursorUpdate>) => {
      const curr = event.detail.curr;
      const prev = event.detail.prev;
      if (curr != undefined) {
        this.applyCursorStyle(curr);
      }
      if (prev != undefined) {
        this.removeCursorStyle(prev);
      }
    }).bind(this);
  }

  abstract applyCursorStyle(area: ElementArea): void;
  abstract removeCursorStyle(area: ElementArea): void;
}
