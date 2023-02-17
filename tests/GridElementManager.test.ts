import { GridElementManager } from "../src/ts/grid/GridElementManager";
import { GridArea, EMPTY } from "../src/ts/grid/GridArea";
import { Translation } from "../src/ts/cartesian/Translation";

describe("Testing the 'GridElementManager' module.", () => {
  test("Basic interactions with a GridArea.", () => {
    const area = new GridArea();
    expect(area.validate(1, 1, [[EMPTY]])).toBe(true);
    expect(area.validate(1, 1, [["test"]])).toBe(false);
  });

  test("Basic interactions.", () => {
    const container = document.createElement("div");
    const elem = document.createElement("div");
    const grid = new GridElementManager(container, "test", elem);

    grid.expand(Translation.RIGHT);
    grid.expand(Translation.DOWN);

    expect(grid.layout).toStrictEqual([
      ["test", EMPTY],
      [EMPTY, EMPTY],
    ]);

    expect(grid.container.style.gridTemplateAreas).toBe("test .\n. .\n");
  });
});
