import { SampleApp } from "../src/ts/apps/GridTesting";
import { Keybind, ModKeyFlag } from "../src/ts/control/Keybind";

function keybindCallback(event: KeyboardEvent): boolean {
  expect(event);
  return false;
}

describe("Testing the 'App' module.", () => {
  test("Basic application setup.", () => {
    const app = new SampleApp(document.body);

    /* We shouldn't be able to create another area. */
    expect(app.layout.createArea()).toBe(undefined);

    /*
     * Mock the application element's dimensions.
     */
    Object.defineProperty(app.app, "clientWidth", { value: 1024 });
    Object.defineProperty(app.app, "clientHeight", { value: 1024 });

    app.pollDimensions();
    app.dispatch();

    /* Register action. */
    expect(app.keybinds.registerAction("testAction", "key", undefined)).toBe(
      true
    );

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

    /* Keybind config. */
    expect(
      app.keybinds.registerConfig(
        { key: "Enter", mods: [ModKeyFlag.shiftKey] },
        keybindCallback
      )
    ).toBe(true);
    expect(
      app.keybinds.registerConfig(
        { key: "Enter", mods: [ModKeyFlag.shiftKey] },
        keybindCallback,
        false
      )
    ).toBe(true);

    /* Test keybinds. */
    const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];

    /* Expand grid in all directions. */
    for (const key of keys) {
      app.keybinds.handleKeydown(new KeyboardEvent("keydown", { key: key }));
    }

    /* Contract grid in all directions. */
    for (const key of keys) {
      app.keybinds.handleKeydown(
        new KeyboardEvent("keydown", { key: key, ctrlKey: true })
      );
      app.keybinds.handleKeydown(
        new KeyboardEvent("keydown", { key: key, ctrlKey: true })
      );
    }

    /* Expand grid in all directions. */
    for (const key of keys) {
      app.keybinds.handleKeydown(new KeyboardEvent("keydown", { key: key }));
    }

    /* Expand cursor in all directions. */
    for (const key of keys) {
      const keybind = new Keybind(key, undefined, [ModKeyFlag.shiftKey]);
      const event = keybind.createEvent();
      app.keybinds.handleKeydown(event);
      app.keybinds.handleKeydown(event);
    }

    /* Expand grid in all directions twice. */
    for (const key of keys) {
      app.keybinds.handleKeydown(new KeyboardEvent("keydown", { key: key }));
      app.keybinds.handleKeydown(new KeyboardEvent("keydown", { key: key }));
    }

    /* Expand cursor in all directions. */
    for (const key of keys) {
      app.keybinds.handleKeydown(
        new KeyboardEvent("keydown", { key: key, shiftKey: true })
      );
    }

    /* Contract cursor in all directions. */
    for (const key of keys) {
      app.keybinds.handleKeydown(
        new KeyboardEvent("keydown", { key: key, altKey: true })
      );
      app.keybinds.handleKeydown(
        new KeyboardEvent("keydown", { key: key, altKey: true })
      );
    }

    keys.push("Enter");
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
