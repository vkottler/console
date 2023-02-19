import { isBottom, isRight, RectangleCorner } from "./RectangleCorner";

export class Offset {
  left: number;
  top: number;

  constructor(left = 0, top = 0) {
    this.left = left;
    this.top = top;
  }

  static corner(
    elem: Element,
    toFit?: Element,
    location: RectangleCorner = RectangleCorner.topLeft
  ): Offset {
    const result = new Offset();

    if (isRight(location)) {
      let left = elem.clientWidth;
      if (toFit != undefined) {
        left -= toFit.clientWidth;
      }
      result.left += left;
    }
    if (isBottom(location)) {
      let top = elem.clientHeight;
      if (toFit != undefined) {
        top -= toFit.clientHeight;
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
