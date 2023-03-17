import { GridLine } from "../../src/ts/grid/Line";
import { GridLocation } from "../../src/ts/grid/Location";

describe("Testing the 'Line' module.", () => {
  test("Test basic interactions with grid lines.", () => {
    let line = new GridLine(new GridLocation(1, 1), new GridLocation(3, 1));

    expect(line.isVertical()).toBe(true);

    let locations = [];
    for (const onLine of line.locations()) {
      locations.push(onLine);
    }

    expect(locations.length).toBe(3);

    expect(locations[0].row).toBe(1);
    expect(locations[0].column).toBe(1);

    expect(locations[1].row).toBe(2);
    expect(locations[1].column).toBe(1);

    expect(locations[2].row).toBe(3);
    expect(locations[2].column).toBe(1);

    line = new GridLine(new GridLocation(1, 1), new GridLocation(1, 3));

    expect(line.isHorizontal()).toBe(true);

    locations = [];
    for (const onLine of line.locations()) {
      locations.push(onLine);
    }

    expect(locations.length).toBe(3);

    expect(locations[0].row).toBe(1);
    expect(locations[0].column).toBe(1);

    expect(locations[1].row).toBe(1);
    expect(locations[1].column).toBe(2);

    expect(locations[2].row).toBe(1);
    expect(locations[2].column).toBe(3);

    line = new GridLine(new GridLocation(3, 1), new GridLocation(1, 1));

    locations = [];
    for (const onLine of line.locations()) {
      locations.push(onLine);
    }

    expect(locations[0].row).toBe(3);
    expect(locations[0].column).toBe(1);

    expect(locations[1].row).toBe(2);
    expect(locations[1].column).toBe(1);

    expect(locations[2].row).toBe(1);
    expect(locations[2].column).toBe(1);

    line = new GridLine(new GridLocation(1, 3), new GridLocation(1, 1));

    locations = [];
    for (const onLine of line.locations()) {
      locations.push(onLine);
    }

    expect(locations[0].row).toBe(1);
    expect(locations[0].column).toBe(3);

    expect(locations[1].row).toBe(1);
    expect(locations[1].column).toBe(2);

    expect(locations[2].row).toBe(1);
    expect(locations[2].column).toBe(1);
  });
});
