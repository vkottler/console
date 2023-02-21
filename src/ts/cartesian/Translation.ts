import { RectangleCorner } from "./RectangleCorner";

export enum Translation {
  up,
  down,
  left,
  right,
}

export function translationName(translation: Translation) {
  switch (translation) {
    case Translation.up:
      return "up";
    case Translation.down:
      return "down";
    case Translation.left:
      return "left";
    case Translation.right:
      return "right";
  }
}

export function isVertical(direction: Translation): boolean {
  return direction == Translation.up || direction == Translation.down;
}

export function isHorizontal(direction: Translation): boolean {
  return direction == Translation.left || direction == Translation.right;
}

export function translate(
  location: RectangleCorner,
  translation: Translation
): RectangleCorner {
  switch (translation) {
    case Translation.up:
      location &= 1;
      break;
    case Translation.down:
      location |= 2;
      break;
    case Translation.left:
      location &= 2;
      break;
    case Translation.right:
      location |= 1;
      break;
  }

  return location;
}
