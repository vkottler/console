import { RectangleCorner } from "./cartesian/RectangleCorner";
import { Offset } from "./cartesian/Offset";
import { Translation, translate } from "./cartesian/Translation";
import { Dimensions } from "./cartesian/Dimensions";

export class AppOverlay {
  root: HTMLElement;
  elem: HTMLElement;
  location: RectangleCorner;
  offset: Offset;
  scale: number;

  constructor(
    root: HTMLElement,
    location: RectangleCorner = RectangleCorner.BOTTOM_RIGHT,
    scale = 0.2
  ) {
    /*
     * Create the container element.
     */
    this.root = root;
    this.elem = document.createElement("div");
    this.root.appendChild(this.elem);

    /*
     * Cosmetic style.
     */
    this.elem.style.backgroundColor = "black";
    this.elem.style.color = "white";
    this.elem.style.opacity = "0.7";

    /*
     * Structural style.
     */
    this.elem.style.position = "absolute";
    this.scale = scale;

    /*
     * Positioning.
     */
    this.location = location;
    this.offset = new Offset();
    this.poll_position();
  }

  poll_position(location?: RectangleCorner) {
    /*
     * Update dimensions.
     */
    const dimensions = Dimensions.from_element(this.root, true, this.scale);
    dimensions.apply(this.elem);

    /*
     * Update location offset.
     */
    if (location != undefined) {
      this.location = location;
    }
    this.offset = Offset.corner(this.root, this.elem, this.location);
    this.offset.apply(this.elem);

    this.elem.innerHTML = `width: ${this.elem.clientWidth}, height: ${this.elem.clientHeight}`;
  }

  translate(translation: Translation) {
    this.poll_position(translate(this.location, translation));
  }
}
