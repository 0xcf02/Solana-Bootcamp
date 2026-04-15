import { describe, it, expect, beforeAll } from "vitest";
import { waitForValidator, suppressConsole } from "./setup.js";

describe("06 - Tokens and Transfers", () => {
  beforeAll(async () => {
    await waitForValidator();
  });

  it("runs without error", async () => {
    const { main } = await import("../src/06-tokens-and-transfers.js");
    await expect(suppressConsole(() => main())).resolves.not.toThrow();
  });
});
