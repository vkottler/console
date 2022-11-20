/*
 * Application entry-point.
 */
export function init(root_elem: Element) {
  setInterval(() => {
    root_elem.innerHTML = new Date().getTime().toString();
  }, 100);

  console.log("Application initialized.");
}

/*
 * Initialize the application.
 */
const app_root = document.body.children.namedItem("app");
if (app_root) {
  init(app_root);
}
