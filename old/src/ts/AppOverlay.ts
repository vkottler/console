import { Dimensions } from "./cartesian/Dimensions";
import { Grid } from "./cartesian/grid/Grid";
import { Offset } from "./cartesian/Offset";
import { RectangleCorner } from "./cartesian/RectangleCorner";
import { translate, Translation } from "./cartesian/Translation";

export class AppOverlay {
  root: HTMLElement;
  container: HTMLElement;
  content: HTMLElement;
  location: RectangleCorner;
  offset: Offset;
  scale: number;
  grid: Grid;

  constructor(
    root: HTMLElement,
    location: RectangleCorner = RectangleCorner.bottomRight,
    scale = 0.5
  ) {
    /*
     * Create the container element.
     */
    this.root = root;
    this.container = document.createElement("div");
    this.root.appendChild(this.container);

    /*
     * Create the content element.
     */
    this.content = document.createElement("div");
    this.container.appendChild(this.content);

    this.grid = new Grid(this.container, this.content);

    /*
     * Cosmetic style.
     */
    this.container.style.backgroundColor = "black";
    this.container.style.opacity = "0.8";

    this.content.style.opacity = "1";
    this.content.style.color = "white";
    this.content.style.backgroundColor = "orange";

    /*
     * Structural style.
     */
    this.container.style.position = "absolute";
    this.scale = scale;

    this.content.style.textAlign = "center";
    this.content.style.margin = "auto";

    /*
     * Positioning.
     */
    this.location = location;
    this.offset = new Offset();
    this.pollPosition();
  }

  pollPosition(location?: RectangleCorner) {
    /*
     * Update dimensions.
     */
    const dimensions = Dimensions.fromElement(this.root, true, this.scale);
    dimensions.apply(this.container);

    /*
     * Update location offset.
     */
    if (location != undefined) {
      this.location = location;
    }
    this.offset = Offset.corner(this.root, this.container, this.location);
    this.offset.apply(this.container);

    this.content.innerHTML =
      `width: ${this.container.clientWidth}, ` +
      `height: ${this.container.clientHeight}`;
  }

  translate(translation: Translation) {
    this.pollPosition(translate(this.location, translation));
  }
}
