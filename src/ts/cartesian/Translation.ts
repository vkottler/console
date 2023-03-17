import { RectangleCorner } from "./RectangleCorner";

export enum Translation {
  up,
  down,
  left,
  right,
}

export function* allTranslations(): Generator<Translation> {
  yield Translation.up;
  yield Translation.down;
  yield Translation.left;
  yield Translation.right;
}

export function flip(translation: Translation): Translation {
  switch (translation) {
    case Translation.up:
      return Translation.down;
    case Translation.down:
      return Translation.up;
    case Translation.left:
      return Translation.right;
    case Translation.right:
      return Translation.left;
  }
}

export function eventDirection(event: KeyboardEvent): Translation | undefined {
  switch (event.key) {
    case "ArrowLeft":
      return Translation.left;
    case "ArrowRight":
      return Translation.right;
    case "ArrowUp":
      return Translation.up;
    case "ArrowDown":
      return Translation.down;
  }
}

export function translationName(translation: Translation, capitalize = false) {
  let result = "";

  switch (translation) {
    case Translation.up:
      result = "up";
      break;
    case Translation.down:
      result = "down";
      break;
    case Translation.left:
      result = "left";
      break;
    case Translation.right:
      result = "right";
      break;
  }

  if (capitalize) {
    result = result[0].toUpperCase() + result.substr(1);
  }

  return result;
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

export function* sideCorners(
  direction: Translation
): Generator<RectangleCorner> {
  switch (direction) {
    case Translation.up:
      yield RectangleCorner.topLeft;
      yield RectangleCorner.topRight;
      break;
    case Translation.down:
      yield RectangleCorner.bottomLeft;
      yield RectangleCorner.bottomRight;
      break;
    case Translation.left:
      yield RectangleCorner.topLeft;
      yield RectangleCorner.bottomLeft;
      break;
    case Translation.right:
      yield RectangleCorner.topRight;
      yield RectangleCorner.bottomRight;
      break;
  }
}
