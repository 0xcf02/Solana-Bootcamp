import { describe, it, expect, beforeAll } from "vitest";
import { waitForValidator, suppressConsole } from "./setup.js";

describe("07 - PDAs Explained", () => {
  beforeAll(async () => {
    await waitForValidator();
  });

  it("runs without error", async () => {
    const { main } = await import("../src/07-pdas-explained.js");
    await expect(suppressConsole(() => main())).resolves.not.toThrow();
  });
});
