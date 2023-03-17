import { Translation } from "../../cartesian/Translation";
import { areaId } from "../Area";
import { GridLayoutBase } from "./Base";
import { EMPTY } from "./Interface";

export class GridLayout extends GridLayoutBase {
  moveCursor(direction: Translation): boolean {
    const result = false;

    const currArea = this.cursorArea;
    if (currArea != undefined) {
      /*
       * Get the side corresponding to the provided direction and translate
       * it in that same direction.
       */
      const line = currArea.getSide(direction);

      if (direction == Translation.up || direction == Translation.left) {
        if (!line.translate(direction)) {
          return result;
        }
      }

      /*
       * Iterate over locations on the line, if there's an area there
       * that's different than the cursor area, update the cursor.
       */
      for (const location of line.locations()) {
        if (location.inBounds(this.dimensions)) {
          const cell = this.cells[location.row][location.column];

          if (cell != currArea.name && cell != EMPTY) {
            this.updateCursor(areaId(cell));
            return true;
          }
        }
      }
    }

    return result;
  }
}
