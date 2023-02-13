import { GridNode } from "../src/ts/cartesian/GridNode";
import { Translation } from "../src/ts/cartesian/Translation";

describe("Testing the 'GridNode' module.", () => {
  test("Basic traversal.", () => {
    const origin = new GridNode();

    /*
     * Move right, then down twice from the origin.
     */
    const right = origin.move_create(Translation.RIGHT);
    right.move_create(Translation.DOWN).move_create(Translation.DOWN);

    /*
     * Verify that the original node is now 3 units tall.
     */
    expect(origin.right.size).toBe(3);
  });
});
