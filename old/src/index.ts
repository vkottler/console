import { SampleApp } from "./ts/apps/Grids";

/*
 * Application entry-point.
 */
function init(rootElem: Element) {
  const app = new SampleApp(rootElem);
  setInterval(app.dispatch.bind(app), 100);
}

/*
 * Initialize the application.
 */
const appRoot = document.body.children.namedItem("app");
if (appRoot) {
  init(appRoot);
  console.log("Application initialized.");
}
