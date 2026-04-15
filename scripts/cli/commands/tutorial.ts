import { confirm } from "@inquirer/prompts";
import { findLesson, localizedTitle } from "../lesson-catalog.js";
import { parseLesson } from "../parser.js";
import {
  clearScreen,
  renderOverview,
  renderStepBody,
  pad2,
} from "../renderer.js";
import { readKey } from "../pager.js";
import { isInteractive, renderSplash } from "../branding.js";
import { runLesson } from "./run.js";
import { t } from "../i18n/index.js";

export async function runTutorial(n: number, rpcUrl: string): Promise<void> {
  const meta = findLesson(n);
  if (!meta) {
    console.error(t("tutorial.noLesson", { n }));
    process.exitCode = 1;
    return;
  }

  const parsed = parseLesson(meta);

  // Page 0 = overview, pages 1..N = steps.
  const totalPages = 1 + parsed.steps.length;
  let page = 0;

  if (!isInteractive()) {
    // Non-interactive: just dump everything, same as `show`.
    console.log(renderOverview(parsed));
    for (let i = 0; i < parsed.steps.length; i++) {
      console.log(renderStepBody(parsed, i, rpcUrl));
    }
    return;
  }

  while (page < totalPages) {
    clearScreen();
    process.stdout.write(renderSplash());

    if (page === 0) {
      console.log(renderOverview(parsed));
      console.log(
        `\n  ${t("lesson.label")} ${pad2(meta.number)} · ${meta.slug} · ${t("tutorial.steps", { count: parsed.steps.length })}`,
      );
      console.log(`  ${t("hotkey.overview")}`);
    } else {
      console.log(renderStepBody(parsed, page - 1, rpcUrl));
    }

    const key = await readKey();
    if (key === "quit") {
      console.log(t("cli.goodbye"));
      return;
    }
    if (key === "back") {
      if (page > 0) page--;
      continue;
    }
    if (key === "run") {
      clearScreen();
      await runLesson(meta.number, rpcUrl);
      return;
    }
    // next (default)
    page++;
  }

  // Final prompt
  clearScreen();
  process.stdout.write(renderSplash());
  console.log(
    `\n  ${t("tutorial.complete", { lesson: pad2(meta.number), title: localizedTitle(meta) })}\n`,
  );

  const shouldRun = await confirm({
    message: t("tutorial.confirmRun", { rpc: rpcUrl }),
    default: true,
  });
  if (shouldRun) {
    await runLesson(meta.number, rpcUrl);
  }
}
