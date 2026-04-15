#!/usr/bin/env node
import { Command } from "commander";
import { select } from "@inquirer/prompts";
import { LESSONS, localizedTitle, localizedConcepts } from "./lesson-catalog.js";
import { runList } from "./commands/list.js";
import { runShow } from "./commands/show.js";
import { runTutorial } from "./commands/tutorial.js";
import { runLesson } from "./commands/run.js";
import { renderSplash, isInteractive } from "./branding.js";
import { pad2 } from "./renderer.js";
import { detectLocale, setLocale, t } from "./i18n/index.js";

setLocale(detectLocale());

const DEFAULT_RPC = process.env.RPC_URL ?? "http://127.0.0.1:8899";

function parseLessonNumber(raw: string): number {
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > 12) {
    throw new Error(t("cli.errorLessonRange", { n: raw }));
  }
  return n;
}

async function interactiveMenu(): Promise<void> {
  if (isInteractive()) {
    process.stdout.write(renderSplash());
  }
  const answer = await select({
    message: t("cli.pickLesson"),
    pageSize: 14,
    choices: LESSONS.map((l) => ({
      name: `${pad2(l.number)} · ${localizedTitle(l).padEnd(34)} ${l.demoTime}`,
      value: l.number,
      description: localizedConcepts(l),
    })),
  });
  await runTutorial(answer, DEFAULT_RPC);
}

const program = new Command();

program
  .name("solana-lessons")
  .description("Interactive Solana bootcamp · 12 lessons · Superteam Brazil")
  .version("1.0.0")
  .option("--rpc <url>", "RPC URL to target when running lessons", DEFAULT_RPC)
  .option("--lang <locale>", "Language: en, pt-BR");

program.hook("preAction", (thisCommand) => {
  const lang = thisCommand.opts().lang;
  if (lang) setLocale(detectLocale(lang));
});

program
  .command("list")
  .description("Print all lessons")
  .action(() => {
    runList();
  });

program
  .command("show <n>")
  .description("Dump a lesson (overview + all steps) to stdout")
  .action((n: string) => {
    const num = parseLessonNumber(n);
    runShow(num, program.opts().rpc ?? DEFAULT_RPC);
  });

program
  .command("tutorial <n>")
  .description("Interactive paginated walkthrough of a lesson")
  .action(async (n: string) => {
    const num = parseLessonNumber(n);
    await runTutorial(num, program.opts().rpc ?? DEFAULT_RPC);
  });

program
  .command("run <n>")
  .description("Execute the real lesson script against $RPC_URL")
  .action(async (n: string) => {
    const num = parseLessonNumber(n);
    const code = await runLesson(num, program.opts().rpc ?? DEFAULT_RPC);
    process.exit(code);
  });

// Default: if user passes a bare number like `solana-lessons 1`, treat it
// as `tutorial 1`. Otherwise launch the interactive menu.
program.action(async () => {
  const args = program.args;
  if (args.length === 0) {
    await interactiveMenu();
    return;
  }
  if (args.length === 1 && /^\d+$/.test(args[0])) {
    const num = parseLessonNumber(args[0]);
    await runTutorial(num, program.opts().rpc ?? DEFAULT_RPC);
    return;
  }
  program.help();
});

program.parseAsync(process.argv).catch((err) => {
  // Inquirer throws on Ctrl+C with a known error; exit cleanly.
  if (
    err &&
    typeof err === "object" &&
    "name" in err &&
    err.name === "ExitPromptError"
  ) {
    console.log(t("cli.goodbye"));
    process.exit(0);
  }
  console.error(err);
  process.exit(1);
});
