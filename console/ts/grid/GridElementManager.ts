import { Translation } from "../cartesian/Translation";
import { GridElementManagerAreas } from "./areas";

export class GridElementManager extends GridElementManagerAreas {
  expand(direction: Translation) {
    if (this.layout.expand(direction)) {
      this.updateContainer();

      /*
       * Trigger an event for the size change.
       */
      this.fireGridResize();
    }
  }

  /**
   * Attempt to make the grid smaller. If the row or column that would be
   * removed is either empty, or contains grid entities that can be made
   * smaller, the grid will contract and the function returns true.
   */
  contract(direction: Translation): boolean {
    const result = this.layout.contract(direction);

    if (result) {
      this.updateContainer();
      /*
       * Trigger an event for the size change.
       */
      this.fireGridResize();
    }

    return result;
  }
}
