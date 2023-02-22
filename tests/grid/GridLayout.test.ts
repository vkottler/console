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
});
