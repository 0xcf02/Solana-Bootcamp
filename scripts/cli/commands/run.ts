import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { findLesson } from "../lesson-catalog.js";
import { t } from "../i18n/index.js";

/**
 * Spawn a lesson script via the bundled `tsx` runtime.
 * RPC_URL is forwarded so users can target devnet/localnet without editing code.
 */
export function runLesson(n: number, rpcUrl: string): Promise<number> {
  return new Promise((resolve) => {
    const meta = findLesson(n);
    if (!meta) {
      console.error(t("run.noLesson", { n }));
      resolve(1);
      return;
    }

    // Resolve the tsx CLI binary from this package's node_modules.
    const require = createRequire(import.meta.url);
    let tsxBin: string;
    try {
      const tsxPkgPath = require.resolve("tsx/package.json");
      const tsxDir = path.dirname(tsxPkgPath);
      tsxBin = path.join(tsxDir, "dist", "cli.mjs");
    } catch (err) {
      console.error(t("run.noTsx"));
      console.error(err);
      resolve(1);
      return;
    }

    const child = spawn(process.execPath, [tsxBin, meta.file], {
      stdio: "inherit",
      env: { ...process.env, RPC_URL: rpcUrl },
    });

    child.on("exit", (code) => resolve(code ?? 0));
    child.on("error", (err) => {
      console.error(err);
      resolve(1);
    });
  });
}
