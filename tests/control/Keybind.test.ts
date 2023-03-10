import { createEvent, Keybind, ModKeyFlag } from "../../src/ts/control/Keybind";

describe("Testing the 'Keybind' module.", () => {
  test("Basic keybind interactions.", () => {
    expect(createEvent({ key: "key" }).shiftKey).toBe(false);

    let keybind = Keybind.fromConfig({
      key: "Enter",
      mods: [ModKeyFlag.altKey],
    });
    expect(keybind.createEvent("keyup").altKey).toBe(true);

    keybind = Keybind.fromConfig({
      key: "Enter",
      mods: [ModKeyFlag.ctrlKey],
    });
    expect(keybind.createEvent().ctrlKey).toBe(true);

    keybind = Keybind.fromConfig({
      key: "Enter",
      mods: [ModKeyFlag.metaKey],
    });
    expect(keybind.createEvent().metaKey).toBe(true);

    keybind = Keybind.fromConfig({
      key: "Enter",
      mods: [ModKeyFlag.shiftKey],
    });
    expect(keybind.createEvent().shiftKey).toBe(true);
  });
});
