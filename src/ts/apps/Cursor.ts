import { CursorInterface } from "../control/CursorInterface";
import { ElementArea } from "../grid/layout/ManagerBase";

export class Cursor extends CursorInterface {
  applyCursorStyle(area: ElementArea) {
    area.element.style.borderStyle = "solid";
    area.element.style.backgroundColor = "green";
  }

  removeCursorStyle(area: ElementArea) {
    area.element.style.borderStyle = "none";
    area.element.style.backgroundColor = "white";
  }
}
