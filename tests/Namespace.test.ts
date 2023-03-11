import { Namespace } from "../src/ts/Namespace";

describe("Test the 'Namespace' module.", () => {
  test("Basic interactions with namespaces.", () => {
    const namespace = new Namespace();

    const token = namespace.push("test");

    expect(namespace.name()).toBe("test");
    expect(namespace.name("test")).toBe("test.test");

    expect(namespace.pop(token)).toBe(true);
  });
});
