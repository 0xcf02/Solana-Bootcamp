import { describe, it, expect, beforeAll } from "vitest";
import { waitForValidator, suppressConsole } from "./setup.js";

describe("08 - CPIs in Action", () => {
  beforeAll(async () => {
    await waitForValidator();
  });

  it("runs without error", async () => {
    const { main } = await import("../src/08-cpis-in-action.js");
    await expect(suppressConsole(() => main())).resolves.not.toThrow();
  });
});
