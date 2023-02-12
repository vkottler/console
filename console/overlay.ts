import { RectangleCorner, Offset } from "./RectangleCorner";

export class AppOverlay {
  root: HTMLElement;
  elem: HTMLElement;
  location: RectangleCorner;
  offset: Offset;

  constructor(
    root: HTMLElement,
    location: RectangleCorner = RectangleCorner.BOTTOM_RIGHT
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
    this.elem.innerHTML = "test";
    this.elem.style.backgroundColor = "black";
    this.elem.style.color = "white";
    this.elem.style.opacity = "0.7";

    /*
     * Structural style.
     */
    this.elem.style.position = "absolute";
    this.elem.style.width = "20%";
    this.elem.style.aspectRatio = "1";

    this.location = location;
    this.offset = new Offset();
    this.poll_position();
  }

  poll_position(location?: RectangleCorner) {
    if (location != undefined) {
      this.location = location;
    }
    this.offset = Offset.corner(this.root, this.elem, this.location);
    this.offset.apply(this.elem);
  }
}
