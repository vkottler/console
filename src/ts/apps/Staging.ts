import { GridDimensions } from "../grid/Dimensions";
import { GridLayoutManager } from "../grid/layout/Manager";
import { ElementArea } from "../grid/layout/ManagerBase";
import { Cursor } from "./Cursor";

export function sampleGridUpdateHandler(event: CustomEvent<ElementArea>) {
  const area = event.detail.area;

  const parts = [];
  parts.push(`name: ${area.name}`);
  parts.push(`row: ${area.row}`);
  parts.push(`column: ${area.column}`);
  parts.push(`height: ${area.height}`);
  parts.push(`width: ${area.width}`);

  event.detail.element.innerHTML = parts.join(", ");
}

export function sampleResizeHandler(event: CustomEvent<GridDimensions>) {
  const dimensions = event.detail;
  console.log(`grid: ${dimensions.rows} rows, ${dimensions.columns} columns`);
}

export function sampleErrorHandler(event: CustomEvent<string>) {
  console.warn(`Error: ${event.detail}`);
}

export function sampleLayoutManager(root: HTMLElement): GridLayoutManager {
  const layout = new GridLayoutManager(root, new Cursor().handler);

  /* Basic resize handler: show info about size. */
  layout.registerResizeHandler(sampleResizeHandler);

  /* Basic error handler: show info about error. */
  layout.registerErrorHandler(sampleErrorHandler);

  return layout;
}
