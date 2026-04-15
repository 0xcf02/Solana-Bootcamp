import { describe, it, expect, beforeAll } from "vitest";
import { waitForValidator, suppressConsole } from "./setup.js";

describe("04 - Create Token (Manual)", () => {
  beforeAll(async () => {
    await waitForValidator();
  });

  it("runs without error", async () => {
    const { main } = await import("../src/04-create-token-manual.js");
    await expect(suppressConsole(() => main())).resolves.not.toThrow();
  });
});
