import { RectangleCorner, is_right, is_bottom } from "./RectangleCorner";

export class Offset {
  left: number;
  top: number;

  constructor(left = 0, top = 0) {
    this.left = left;
    this.top = top;
  }

  static corner(
    elem: Element,
    to_fit?: Element,
    location: RectangleCorner = RectangleCorner.TOP_LEFT
  ): Offset {
    const result = new Offset();

    if (is_right(location)) {
      let left = elem.clientWidth;
      if (to_fit != undefined) {
        left -= to_fit.clientWidth;
      }
      result.left += left;
    }
    if (is_bottom(location)) {
      let top = elem.clientHeight;
      if (to_fit != undefined) {
        top -= to_fit.clientHeight;
      }
      result.top += top;
    }

    return result;
  }

  apply(elem: HTMLElement) {
    elem.style.left = `${this.left}px`;
    elem.style.top = `${this.top}px`;
  }
}
