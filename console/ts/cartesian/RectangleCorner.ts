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
