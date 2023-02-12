import {
  RectangleCorner,
  is_top,
  is_bottom,
  is_left,
  is_right,
  translate,
  Translation,
} from "../src/RectangleCorner";

describe("Testing the 'RectangleCorner' module.", () => {
  test("is_top", () => {
    expect(is_top(RectangleCorner.TOP_LEFT)).toBe(true);
    expect(is_top(RectangleCorner.TOP_RIGHT)).toBe(true);
    expect(is_top(RectangleCorner.BOTTOM_LEFT)).toBe(false);
    expect(is_top(RectangleCorner.BOTTOM_RIGHT)).toBe(false);
  });

  test("is_bottom", () => {
    expect(is_bottom(RectangleCorner.TOP_LEFT)).toBe(false);
    expect(is_bottom(RectangleCorner.TOP_RIGHT)).toBe(false);
    expect(is_bottom(RectangleCorner.BOTTOM_LEFT)).toBe(true);
    expect(is_bottom(RectangleCorner.BOTTOM_RIGHT)).toBe(true);
  });

  test("is_left", () => {
    expect(is_left(RectangleCorner.TOP_LEFT)).toBe(true);
    expect(is_left(RectangleCorner.TOP_RIGHT)).toBe(false);
    expect(is_left(RectangleCorner.BOTTOM_LEFT)).toBe(true);
    expect(is_left(RectangleCorner.BOTTOM_RIGHT)).toBe(false);
  });

  test("is_right", () => {
    expect(is_right(RectangleCorner.TOP_LEFT)).toBe(false);
    expect(is_right(RectangleCorner.TOP_RIGHT)).toBe(true);
    expect(is_right(RectangleCorner.BOTTOM_LEFT)).toBe(false);
    expect(is_right(RectangleCorner.BOTTOM_RIGHT)).toBe(true);
  });

  test("translate", () => {
    expect(translate(RectangleCorner.TOP_LEFT, Translation.UP)).toBe(
      RectangleCorner.TOP_LEFT
    );
    expect(translate(RectangleCorner.TOP_LEFT, Translation.DOWN)).toBe(
      RectangleCorner.BOTTOM_LEFT
    );
    expect(translate(RectangleCorner.TOP_LEFT, Translation.LEFT)).toBe(
      RectangleCorner.TOP_LEFT
    );
    expect(translate(RectangleCorner.TOP_LEFT, Translation.RIGHT)).toBe(
      RectangleCorner.TOP_RIGHT
    );

    expect(translate(RectangleCorner.TOP_RIGHT, Translation.UP)).toBe(
      RectangleCorner.TOP_RIGHT
    );
    expect(translate(RectangleCorner.TOP_RIGHT, Translation.DOWN)).toBe(
      RectangleCorner.BOTTOM_RIGHT
    );
    expect(translate(RectangleCorner.TOP_RIGHT, Translation.LEFT)).toBe(
      RectangleCorner.TOP_LEFT
    );
    expect(translate(RectangleCorner.TOP_RIGHT, Translation.RIGHT)).toBe(
      RectangleCorner.TOP_RIGHT
    );

    expect(translate(RectangleCorner.BOTTOM_LEFT, Translation.UP)).toBe(
      RectangleCorner.TOP_LEFT
    );
    expect(translate(RectangleCorner.BOTTOM_LEFT, Translation.DOWN)).toBe(
      RectangleCorner.BOTTOM_LEFT
    );
    expect(translate(RectangleCorner.BOTTOM_LEFT, Translation.LEFT)).toBe(
      RectangleCorner.BOTTOM_LEFT
    );
    expect(translate(RectangleCorner.BOTTOM_LEFT, Translation.RIGHT)).toBe(
      RectangleCorner.BOTTOM_RIGHT
    );

    expect(translate(RectangleCorner.BOTTOM_RIGHT, Translation.UP)).toBe(
      RectangleCorner.TOP_RIGHT
    );
    expect(translate(RectangleCorner.BOTTOM_RIGHT, Translation.DOWN)).toBe(
      RectangleCorner.BOTTOM_RIGHT
    );
    expect(translate(RectangleCorner.BOTTOM_RIGHT, Translation.LEFT)).toBe(
      RectangleCorner.BOTTOM_LEFT
    );
    expect(translate(RectangleCorner.BOTTOM_RIGHT, Translation.RIGHT)).toBe(
      RectangleCorner.BOTTOM_RIGHT
    );
  });
});
