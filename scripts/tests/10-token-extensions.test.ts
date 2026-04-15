import { describe, it, expect, beforeAll } from "vitest";
import { waitForValidator, suppressConsole } from "./setup.js";

describe("10 - Token Extensions", () => {
  beforeAll(async () => {
    await waitForValidator();
  });

  it("runs without error", async () => {
    const { main } = await import("../src/10-token-extensions.js");
    await expect(suppressConsole(() => main())).resolves.not.toThrow();
  });
});
