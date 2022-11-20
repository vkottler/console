export const app_elem = document.body.children.namedItem("app");

const overlay_elem = document.body.children.namedItem("overlay");
console.log(overlay_elem);

setInterval(() => {
  app_elem.innerHTML = new Date().getTime().toString();
}, 100);
