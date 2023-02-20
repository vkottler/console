import { App } from "../src/ts/App";

describe("Testing the 'App' module.", () => {
  test("Basic application setup.", () => {
    const app = new App(document.body);

    /*
     * Mock the application element's dimensions.
     */
    Object.defineProperty(app.app, "clientWidth", { value: 1024 });
    Object.defineProperty(app.app, "clientHeight", { value: 1024 });

    app.pollDimensions();
    app.dispatch();

    let event = new KeyboardEvent("keyup");
    app.handleKeyup(event);
    event = new KeyboardEvent("keydown");
    app.handleKeydown(event);
  });
});
