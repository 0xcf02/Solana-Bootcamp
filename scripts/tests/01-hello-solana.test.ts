import { describe, it, expect, beforeAll } from "vitest";
import { waitForValidator, suppressConsole } from "./setup.js";

describe("01 - Hello Solana", () => {
  beforeAll(async () => {
    await waitForValidator();
  });

  it("runs without error", async () => {
    const { main } = await import("../src/01-hello-solana.js");
    await expect(suppressConsole(() => main())).resolves.not.toThrow();
  });
});
