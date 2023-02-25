import { SampleApp } from "./ts/apps/GridTesting";

const APP_PERIOD_MS = 100;

/*
 * Application entry-point.
 */
function init(rootElem: Element) {
  const app = new SampleApp(rootElem);
  setInterval(app.dispatch.bind(app), APP_PERIOD_MS);
}

/*
 * Initialize the application.
 */
const appRoot = document.body.children.namedItem("app");
if (appRoot) {
  init(appRoot);
  console.log("Application initialized.");
}
