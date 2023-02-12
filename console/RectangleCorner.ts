export enum RectangleCorner {
  TOP_LEFT = 0,
  TOP_RIGHT = 1,
  BOTTOM_LEFT = 2,
  BOTTOM_RIGHT = 3,
}

export function is_top(location: RectangleCorner): boolean {
  return location < 2;
}

export function is_bottom(location: RectangleCorner): boolean {
  return location >= 2;
}

export function is_left(location: RectangleCorner): boolean {
  return location % 2 == 0;
}

export function is_right(location: RectangleCorner): boolean {
  return location % 2 == 1;
}

export enum Translation {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export function translate(
  location: RectangleCorner,
  translation: Translation
): RectangleCorner {
  switch (translation) {
    case Translation.UP:
      location &= 1;
      break;
    case Translation.DOWN:
      location |= 2;
      break;
    case Translation.LEFT:
      location &= 2;
      break;
    case Translation.RIGHT:
      location |= 1;
      break;
  }

  return location;
}

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
