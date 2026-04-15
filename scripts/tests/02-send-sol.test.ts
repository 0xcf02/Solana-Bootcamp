import { describe, it, expect, beforeAll } from "vitest";
import { waitForValidator, suppressConsole } from "./setup.js";

describe("02 - Send SOL", () => {
  beforeAll(async () => {
    await waitForValidator();
  });

  it("runs without error", async () => {
    const { main } = await import("../src/02-send-sol.js");
    await expect(suppressConsole(() => main())).resolves.not.toThrow();
  });
});
