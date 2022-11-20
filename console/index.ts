export let app_elem = document.body.children.namedItem("app");

let overlay_elem = document.body.children.namedItem("overlay");

setInterval(() => {
  app_elem.innerHTML = new Date().getTime().toString();
}, 100);
