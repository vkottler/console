export enum RectangleCorner {
  topLeft = 0,
  topRight = 1,
  bottomLeft = 2,
  bottomRight = 3,
}

export function isTop(location: RectangleCorner): boolean {
  return location < 2;
}

export function isBottom(location: RectangleCorner): boolean {
  return location >= 2;
}

export function isLeft(location: RectangleCorner): boolean {
  return location % 2 == 0;
}

export function isRight(location: RectangleCorner): boolean {
  return location % 2 == 1;
}
