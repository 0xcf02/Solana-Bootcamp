import { describe, it, expect, beforeAll } from "vitest";
import { waitForValidator, suppressConsole } from "./setup.js";

describe("09 - Priority Fees", () => {
  beforeAll(async () => {
    await waitForValidator();
  });

  it("runs without error", async () => {
    const { main } = await import("../src/09-priority-fees.js");
    await expect(suppressConsole(() => main())).resolves.not.toThrow();
  });
});
