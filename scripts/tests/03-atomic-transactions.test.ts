import { describe, it, expect, beforeAll } from "vitest";
import { waitForValidator, suppressConsole } from "./setup.js";

describe("03 - Atomic Transactions", () => {
  beforeAll(async () => {
    await waitForValidator();
  });

  it("runs without error", async () => {
    const { main } = await import("../src/03-atomic-transactions.js");
    await expect(suppressConsole(() => main())).resolves.not.toThrow();
  });
});
