import { describe, it, expect } from "vitest";
import { suppressConsole } from "./setup.js";

describe("12 - x402 Micropayments", () => {
  it("runs without error", async () => {
    const { main } = await import("../src/12-x402-micropayments.js");
    await expect(suppressConsole(() => main())).resolves.not.toThrow();
  });
});
