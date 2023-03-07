import {
  allTranslations,
  Translation,
} from "../../src/ts/cartesian/Translation";
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
    expect(layout.expand(Translation.left, layoutContainer).success).toBe(true);
    expect(layout.expand(Translation.up, layoutContainer).success).toBe(true);

    expect(area.row).toBe(1);
    expect(area.column).toBe(1);

    expect(layout.expand(Translation.right, layoutContainer).success).toBe(
      true
    );
    expect(layout.expand(Translation.down, layoutContainer).success).toBe(true);

    expect(area.row).toBe(1);
    expect(area.column).toBe(1);
    expect(layout.width).toBe(3);
    expect(layout.height).toBe(3);
  });

  test("GridArea contracting.", () => {
    const layout = new GridLayout();
    const layoutContainer = document.createElement("div");

    /* We shouldn't be able to contract in any direction. */
    for (const translation of allTranslations()) {
      expect(layout.contract(translation)).toBe(false);
    }

    /* Expand and contract. */
    expect(layout.expand(Translation.right, layoutContainer).success).toBe(
      true
    );
    expect(layout.contract(Translation.left, layoutContainer)).toBe(true);

    /* Expand and contract. */
    expect(layout.expand(Translation.right, layoutContainer).success).toBe(
      true
    );
    expect(layout.contract(Translation.right, layoutContainer)).toBe(true);

    /* Ensure we're back to initial conditions. */
    expect(layout.width).toBe(1);
    expect(layout.height).toBe(1);

    /* Add an initial area. */
    const area = layout.createArea();
    expect(layout.validArea(area)).toBe(true);
    expect(layout.validArea(area, true)).toBe(true);
    expect(layout.validArea(area)).toBe(true);

    /* Expand in every direction. */
    for (const translation of allTranslations()) {
      expect(layout.expand(translation, layoutContainer).success).toBe(true);
    }
    expect(area.row).toBe(1);
    expect(area.column).toBe(1);

    /* Contract right. Removes the first column. */
    expect(layout.contract(Translation.right, layoutContainer)).toBe(true);
    expect(area.column).toBe(0);

    /* Expand left again. */
    expect(layout.expand(Translation.left).success).toBe(true);
    expect(area.column).toBe(1);
    expect(layout.width).toBe(3);

    /* Contract left. Removes the last column. */
    expect(layout.contract(Translation.left, layoutContainer)).toBe(true);
    expect(area.column).toBe(1);
    expect(layout.contract(Translation.left, layoutContainer)).toBe(false);

    /* Contract down. Removes the first row. */
    expect(layout.contract(Translation.down, layoutContainer)).toBe(true);
    expect(area.row).toBe(0);
    expect(layout.contract(Translation.down, layoutContainer)).toBe(false);

    /* Contract up. */
    expect(layout.contract(Translation.up, layoutContainer)).toBe(true);
  });
});
