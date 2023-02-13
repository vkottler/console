import { RectangleCorner } from "./RectangleCorner";

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
