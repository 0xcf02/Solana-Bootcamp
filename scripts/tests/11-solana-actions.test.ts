import { describe, it, expect, beforeAll } from "vitest";
import { waitForValidator, suppressConsole } from "./setup.js";

describe("11 - Solana Actions", () => {
  beforeAll(async () => {
    await waitForValidator();
  });

  it("starts server, handles requests, and shuts down", async () => {
    const { main } = await import("../src/11-solana-actions.js");
    await expect(suppressConsole(() => main())).resolves.not.toThrow();
  });
});
