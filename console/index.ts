import { test_elem } from "./test";
import { render } from "preact";

/*
 * Application entry-point.
 */
export function init(root_elem: Element) {
  /* Create an element for the timer. */
  const time_elem = document.createElement("div");
  root_elem.appendChild(time_elem);

  /* Update the timer at 10 Hz. */
  setInterval(() => {
    time_elem.innerHTML = new Date().getTime().toString();
  }, 100);

  /* Test that we can render the imported JSX element. */
  const new_elem = document.createElement("div");
  root_elem.appendChild(new_elem);
  render(test_elem, new_elem);
}

/*
 * Initialize the application.
 */
const app_root = document.body.children.namedItem("app");
if (app_root) {
  init(app_root);
  console.log("Application initialized.");
}
