import {
  isBottom,
  isLeft,
  isRight,
  isTop,
  RectangleCorner,
} from "../../src/ts/cartesian/RectangleCorner";
import {
  isHorizontal,
  isVertical,
  translate,
  Translation,
  translationName,
} from "../../src/ts/cartesian/Translation";

describe("Testing the 'Translation' module.", () => {
  test("Basic interactions with translations.", () => {
    expect(translationName(Translation.up)).toMatch("up");
    expect(translationName(Translation.right)).toMatch("right");
    expect(translationName(Translation.down)).toMatch("down");
    expect(translationName(Translation.left)).toMatch("left");

    expect(isVertical(Translation.up)).toBe(true);
    expect(isVertical(Translation.down)).toBe(true);
    expect(isVertical(Translation.left)).toBe(false);
    expect(isVertical(Translation.right)).toBe(false);

    expect(isHorizontal(Translation.up)).toBe(false);
    expect(isHorizontal(Translation.down)).toBe(false);
    expect(isHorizontal(Translation.left)).toBe(true);
    expect(isHorizontal(Translation.right)).toBe(true);
  });

  test("Translating rectangle corners.", () => {
    expect(translate(RectangleCorner.topLeft, Translation.up)).toBe(
      RectangleCorner.topLeft
    );
    expect(translate(RectangleCorner.topRight, Translation.up)).toBe(
      RectangleCorner.topRight
    );
    expect(translate(RectangleCorner.bottomLeft, Translation.up)).toBe(
      RectangleCorner.topLeft
    );
    expect(translate(RectangleCorner.bottomRight, Translation.up)).toBe(
      RectangleCorner.topRight
    );

    expect(translate(RectangleCorner.topLeft, Translation.down)).toBe(
      RectangleCorner.bottomLeft
    );
    expect(translate(RectangleCorner.topRight, Translation.down)).toBe(
      RectangleCorner.bottomRight
    );
    expect(translate(RectangleCorner.bottomLeft, Translation.down)).toBe(
      RectangleCorner.bottomLeft
    );
    expect(translate(RectangleCorner.bottomRight, Translation.down)).toBe(
      RectangleCorner.bottomRight
    );

    expect(translate(RectangleCorner.topLeft, Translation.right)).toBe(
      RectangleCorner.topRight
    );
    expect(translate(RectangleCorner.topRight, Translation.right)).toBe(
      RectangleCorner.topRight
    );
    expect(translate(RectangleCorner.bottomLeft, Translation.right)).toBe(
      RectangleCorner.bottomRight
    );
    expect(translate(RectangleCorner.bottomRight, Translation.right)).toBe(
      RectangleCorner.bottomRight
    );

    expect(translate(RectangleCorner.topLeft, Translation.left)).toBe(
      RectangleCorner.topLeft
    );
    expect(translate(RectangleCorner.topRight, Translation.left)).toBe(
      RectangleCorner.topLeft
    );
    expect(translate(RectangleCorner.bottomLeft, Translation.left)).toBe(
      RectangleCorner.bottomLeft
    );
    expect(translate(RectangleCorner.bottomRight, Translation.left)).toBe(
      RectangleCorner.bottomLeft
    );

    expect(isTop(RectangleCorner.topLeft)).toBe(true);
    expect(isTop(RectangleCorner.topRight)).toBe(true);
    expect(isTop(RectangleCorner.bottomLeft)).toBe(false);
    expect(isTop(RectangleCorner.bottomRight)).toBe(false);

    expect(isBottom(RectangleCorner.topLeft)).toBe(false);
    expect(isBottom(RectangleCorner.topRight)).toBe(false);
    expect(isBottom(RectangleCorner.bottomLeft)).toBe(true);
    expect(isBottom(RectangleCorner.bottomRight)).toBe(true);

    expect(isLeft(RectangleCorner.topLeft)).toBe(true);
    expect(isLeft(RectangleCorner.topRight)).toBe(false);
    expect(isLeft(RectangleCorner.bottomLeft)).toBe(true);
    expect(isLeft(RectangleCorner.bottomRight)).toBe(false);

    expect(isRight(RectangleCorner.topLeft)).toBe(false);
    expect(isRight(RectangleCorner.topRight)).toBe(true);
    expect(isRight(RectangleCorner.bottomLeft)).toBe(false);
    expect(isRight(RectangleCorner.bottomRight)).toBe(true);
  });
});
