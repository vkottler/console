import {
  RectangleCorner,
  Offset,
  Translation,
  translate,
} from "./RectangleCorner";

class Dimensions {
  width: number;
  height: number;

  constructor(width = 0, height = 0) {
    this.width = width;
    this.height = height;
  }

  static from_element(elem: Element, square = false, scale = 1.0): Dimensions {
    let width = elem.clientWidth;
    let height = elem.clientHeight;

    if (square) {
      width = Math.min(width, height);
      height = Math.min(width, height);
    }

    width *= scale;
    height *= scale;

    return new Dimensions(width, height);
  }

  apply(elem: HTMLElement) {
    elem.style.width = `${this.width}px`;
    elem.style.height = `${this.height}px`;
  }
}

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
