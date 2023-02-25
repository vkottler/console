import { SampleApp } from "../src/ts/apps/GridTesting";
import { Keybind, ModKeyFlag } from "../src/ts/control/Keybind";

function keybindCallback(event: KeyboardEvent): boolean {
  expect(event);
  return false;
}

describe("Testing the 'App' module.", () => {
  test("Basic application setup.", () => {
    const app = new SampleApp(document.body);

    /*
     * Mock the application element's dimensions.
     */
    Object.defineProperty(app.app, "clientWidth", { value: 1024 });
    Object.defineProperty(app.app, "clientHeight", { value: 1024 });

    app.pollDimensions();
    app.dispatch();

    /* Keydown. */
    expect(app.keybinds.register("Enter", keybindCallback)).toBe(true);
    expect(app.keybinds.register("Enter", keybindCallback)).toBe(false);
    expect(
      app.keybinds.register("Enter", keybindCallback, [ModKeyFlag.altKey])
    ).toBe(true);

    /* Keyup. */
    expect(
      app.keybinds.register("Enter", keybindCallback, undefined, false)
    ).toBe(true);

    /* Test keybinds. */
    const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Enter"];
    for (const key of keys) {
      const options = {
        key: key,
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      };
      app.keybinds.handleKeyup(new KeyboardEvent("keyup", options));
      app.keybinds.handleKeydown(new KeyboardEvent("keydown", options));

      options.ctrlKey = true;
      app.keybinds.handleKeydown(new KeyboardEvent("keydown", options));

      options.shiftKey = true;
      app.keybinds.handleKeydown(new KeyboardEvent("keydown", options));

      options.altKey = true;
      app.keybinds.handleKeydown(new KeyboardEvent("keydown", options));

      options.metaKey = true;
      app.keybinds.handleKeydown(new KeyboardEvent("keydown", options));
    }
  });

  test("Test keybinds.", () => {
    const bind = new Keybind("Enter", keybindCallback);
    expect(bind.matches(new KeyboardEvent("keyup", { key: "Enter" }))).toBe(
      true
    );
  });
});
