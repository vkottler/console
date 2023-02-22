import { Translation } from "../../src/ts/cartesian/Translation";
import { GridArea } from "../../src/ts/grid/GridArea";
import { GridDimensions } from "../../src/ts/grid/GridDimensions";
import { GridLocation } from "../../src/ts/grid/GridLocation";

describe("Testing the 'GridArea' module.", () => {
  test("Basic interactions with grid areas", () => {
    const area = new GridArea();
    area.areaId = 0;
    expect(area.name).toBe("area-0");

    area.dimensions.rows = 2;
    area.dimensions.columns = 2;
    expect(area.width).toBe(2);
    expect(area.height).toBe(2);
    expect(area.row).toBe(0);
    expect(area.column).toBe(0);

    const bounds = new GridDimensions(3, 3);

    expect(area.translate(Translation.left, bounds)).toBe(undefined);
    expect(area.translate(Translation.up, bounds)).toBe(undefined);
    expect(area.translate(Translation.left)).toBe(undefined);
    expect(area.translate(Translation.up)).toBe(undefined);

    expect(area.translate(Translation.right, bounds)).toBeInstanceOf(
      GridLocation
    );
    expect(area.translate(Translation.down, bounds)).toBeInstanceOf(
      GridLocation
    );

    area.apply(document.createElement("div"));
  });

  test("Grid area expanding.", () => {
    const area = new GridArea();
    const bounds = new GridDimensions(3, 3);

    /* Move the area into the center. */
    area.translate(Translation.right, bounds);
    area.translate(Translation.down, bounds);
    expect(area.row).toBe(1);
    expect(area.column).toBe(1);
    expect(area.width).toBe(1);
    expect(area.height).toBe(1);

    /* Expand to take up the whole grid. */
    expect(area.expand(Translation.right, bounds)).toBe(true);
    expect(area.expand(Translation.down, bounds)).toBe(true);
    expect(area.expand(Translation.left, bounds)).toBe(true);
    expect(area.expand(Translation.up, bounds)).toBe(true);

    /* Verify the final result. */
    expect(area.row).toBe(0);
    expect(area.column).toBe(0);
    expect(area.width).toBe(3);
    expect(area.height).toBe(3);

    /* Ensure we can't expand anymore. */
    expect(area.expand(Translation.right, bounds)).toBe(false);
    expect(area.expand(Translation.down, bounds)).toBe(false);
    expect(area.expand(Translation.left, bounds)).toBe(false);
    expect(area.expand(Translation.up, bounds)).toBe(false);
  });

  test("Grid area contracting.", () => {
    const area = new GridArea();

    /* Expand. */
    expect(area.expand(Translation.right)).toBe(true);
    expect(area.expand(Translation.down)).toBe(true);

    /* Contract. */
    expect(area.contract(Translation.right)).toBe(true);
    expect(area.contract(Translation.down)).toBe(true);
    expect(area.width).toBe(1);
    expect(area.height).toBe(1);

    expect(area.contract(Translation.left)).toBe(false);
    expect(area.contract(Translation.up)).toBe(false);
  });

  test("Locations being inside grid areas.", () => {
    const area = new GridArea();

    expect(area.topLeft.row).toBe(0);
    expect(area.topLeft.column).toBe(0);

    expect(area.topRight.row).toBe(0);
    expect(area.topRight.column).toBe(1);

    expect(area.bottomLeft.row).toBe(1);
    expect(area.bottomLeft.column).toBe(0);

    expect(area.bottomRight.row).toBe(1);
    expect(area.bottomRight.column).toBe(1);

    const location = new GridLocation(0, 0);
    expect(area.inArea(location)).toBe(false);
    location.row++;
    expect(area.inArea(location)).toBe(false);
    location.column++;
    expect(area.inArea(location)).toBe(false);
    location.column--;
    expect(area.inArea(location)).toBe(false);

    /* Expand the area. */
    area.expand(Translation.right);
    area.expand(Translation.down);

    /* The only point in the area. */
    location.row = 1;
    location.column = 1;
    expect(area.inArea(location)).toBe(true);

    for (const corner of area.corners()) {
      expect(corner.row).toBeGreaterThanOrEqual(0);
      expect(corner.column).toBeGreaterThanOrEqual(0);
    }

    const locations = [];
    for (const location of area.locations()) {
      locations.push(location);
    }
  });

  test("Iterating over all locations.", () => {
    const area = new GridArea();

    let locations = [];
    for (const location of area.locations()) {
      locations.push(location);
    }

    expect(locations.length).toBe(4);

    area.expand(Translation.right);

    locations = [];
    for (const location of area.locations()) {
      locations.push(location);
    }

    expect(locations.length).toBe(6);

    area.expand(Translation.down);

    locations = [];
    for (const location of area.locations()) {
      locations.push(location);
    }

    expect(locations.length).toBe(9);
  });
});
