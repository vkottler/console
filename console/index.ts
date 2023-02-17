import { SampleApp } from "./ts/apps/Grids";

/*
 * Application entry-point.
 */
export function init(root_elem: Element) {
  const app = new SampleApp(root_elem);
  setInterval(app.dispatch.bind(app), 100);
}

/*
 * Initialize the application.
 */
const app_root = document.body.children.namedItem("app");
if (app_root) {
  init(app_root);
  console.log("Application initialized.");
}
