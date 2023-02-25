import { eventDirection } from "../cartesian/Translation";
import { GridDimensions } from "./GridDimensions";
import { GridLayout } from "./GridLayout";
import { GridLocation } from "./GridLocation";

export class GridLayoutManager {
  container: HTMLElement;
  layout: GridLayout;
  elements: Map<number, HTMLElement>;

  constructor(container: HTMLElement) {
    this.container = container;
    this.container.style.display = "grid";

    /* Best effort to keep columns and rows the same size. */
    this.container.style.gridAutoRows = "1fr";
    this.container.style.gridAutoColumns = "1fr";

    this.layout = new GridLayout();
    this.elements = new Map<number, HTMLElement>();

    /* Apply the initial, empty layout. */
    this.layout.apply(this.container);
  }

  createArea(
    location?: GridLocation,
    dimensions?: GridDimensions,
    kind = "div"
  ): HTMLElement | undefined {
    const element = document.createElement(kind);

    const area = this.layout.createArea(element, location, dimensions);

    if (this.layout.validArea(area, true)) {
      this.elements.set(area.areaId, element);

      /* Ensure the layout change gets applied. */
      this.container.appendChild(element);
      this.layout.apply(this.container);

      return element;
    }
  }

  expandHandler(event: KeyboardEvent): boolean {
    const direction = eventDirection(event);
    if (direction != undefined) {
      this.layout.expand(direction, this.container);
    }
    return direction != undefined;
  }
}
