import { GridElementManagerBase } from "./base";
import { GridArea } from "./GridArea";

export class GridElementManagerAreas extends GridElementManagerBase {
  updateArea(areaId: number, area: GridArea): boolean {
    if (!(areaId in this.areas) || !this.validate(area)) {
      return false;
    }

    /* update the area and grid styling */

    this.updateContainer();

    return true;
  }

  removeArea(areaId: number): boolean {
    if (!(areaId in this.areas)) {
      return false;
    }

    /* remove area and update grid styling */

    this.updateContainer();

    return true;
  }
}
