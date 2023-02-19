import { GridElementManagerBase } from "./base";
import { GridArea } from "./GridArea";

export class GridElementManagerAreas extends GridElementManagerBase {
  updateArea(name: string, area: GridArea): boolean {
    if (!(name in this.areas) || !this.validate(area)) {
      return false;
    }

    /* update the area and grid styling */

    this.updateContainer();

    return true;
  }

  removeArea(name: string): boolean {
    if (!(name in this.areas)) {
      return false;
    }

    /* remove area and update grid styling */

    this.updateContainer();

    return true;
  }
}
