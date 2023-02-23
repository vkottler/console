import { Translation } from "../../src/ts/cartesian/Translation";
import { GridLayout } from "../../src/ts/grid/GridLayout";
import { GridLocation } from "../../src/ts/grid/GridLocation";

describe("Testing the 'GridLayout' module.", () => {
  test("Test valid locations.", () => {
    const layout = new GridLayout();
    const location = new GridLocation();

    expect(layout.validLocation(location)).toBe(true);
    expect(layout.validLocation(location.set(1, 0))).toBe(false);
    expect(layout.validLocation(location.set(0, 1))).toBe(false);
    expect(layout.validLocation(location.set(1, 1))).toBe(false);
  });

  test("Basic area interactions.", () => {
    const layoutContainer = document.createElement("div");
    const layout = new GridLayout();

    const area = layout.createArea(document.createElement("div"));

    expect(layout.validArea(area)).toBe(true);
    expect(layout.validArea(area, true)).toBe(true);

    /* Another new area shouldn't be valid. */
    expect(
      layout.validArea(layout.createArea(document.createElement("div")))
    ).toBe(false);

    /* Expand the layout. */
    expect(layout.expand(Translation.left, layoutContainer)).toBe(true);
    expect(layout.expand(Translation.up, layoutContainer)).toBe(true);

    expect(area.row).toBe(1);
    expect(area.column).toBe(1);

    expect(layout.expand(Translation.right, layoutContainer)).toBe(true);
    expect(layout.expand(Translation.down, layoutContainer)).toBe(true);

    expect(area.row).toBe(1);
    expect(area.column).toBe(1);
    expect(layout.width).toBe(3);
    expect(layout.height).toBe(3);
  });
});
