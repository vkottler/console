import { Translation } from "../../src/ts/cartesian/Translation";
import { GridDimensions } from "../../src/ts/grid/Dimensions";
import { GridLocation } from "../../src/ts/grid/Location";

describe("Testing the 'GridLocation' module.", () => {
  test("Basic interactions with grid locations.", () => {
    const bounds = new GridDimensions();
    bounds.rows = 3;
    bounds.columns = 3;
    const object = new GridDimensions(2, 2);

    const location = new GridLocation();

    /* Can't move up. */
    expect(location.translate(Translation.up, bounds, object)).toBe(undefined);

    /* Can't move left. */
    expect(location.translate(Translation.left, bounds, object)).toBe(
      undefined
    );

    /* Move right. */
    expect(
      location.translate(Translation.right, bounds, object, true)
    ).toBeInstanceOf(GridLocation);

    /* Move down. */
    expect(
      location.translate(Translation.down, bounds, object, true)
    ).toBeInstanceOf(GridLocation);

    /* Can't move right. */
    expect(location.translate(Translation.right, bounds, object)).toBe(
      undefined
    );

    /* Can't move down. */
    expect(location.translate(Translation.down, bounds, object)).toBe(
      undefined
    );

    /* Move left. */
    expect(
      location.translate(Translation.left, bounds, object, true)
    ).toBeInstanceOf(GridLocation);

    /* Move up. */
    expect(
      location.translate(Translation.up, bounds, object, true)
    ).toBeInstanceOf(GridLocation);

    /* Can't move up. */
    expect(location.translate(Translation.up, bounds, object)).toBe(undefined);

    /* Can't move left. */
    expect(location.translate(Translation.left, bounds, object)).toBe(
      undefined
    );

    /* Move right (don't update). */
    expect(
      location.translate(Translation.right, bounds, object)
    ).toBeInstanceOf(GridLocation);
  });
});
