import { describe, it, expect, beforeAll } from "vitest";
import { waitForValidator, suppressConsole } from "./setup.js";

describe("05 - Create Token (Easy)", () => {
  beforeAll(async () => {
    await waitForValidator();
  });

  it("runs without error", async () => {
    const { main } = await import("../src/05-create-token-easy.js");
    await expect(suppressConsole(() => main())).resolves.not.toThrow();
  });
});
