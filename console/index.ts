import { App } from "./ts/App";

/*
 * Application entry-point.
 */
export function init(root_elem: Element) {
  const app = new App(root_elem);
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
