import chalk from "chalk";
import { LESSONS, localizedTitle, localizedConcepts } from "../lesson-catalog.js";
import { isInteractive } from "../branding.js";
import { pad2 } from "../renderer.js";
import { t } from "../i18n/index.js";

export function runList(): void {
  const color = isInteractive();
  const accent = (s: string) => (color ? chalk.hex("#00c2a8")(s) : s);
  const dim = (s: string) => (color ? chalk.dim(s) : s);
  const bold = (s: string) => (color ? chalk.bold(s) : s);

  console.log();
  console.log(bold(`  ${t("list.header")}`));
  console.log();

  const header = `  ${accent(t("list.col.number"))}    ${accent(t("list.col.lesson"))}                                ${accent(t("list.col.sdk"))}    ${accent(t("list.col.time"))}`;
  console.log(header);
  console.log(dim("  " + "\u2500".repeat(68)));

  for (const lesson of LESSONS) {
    const num = accent(pad2(lesson.number));
    const title = bold(localizedTitle(lesson).padEnd(36));
    const sdk = dim(lesson.sdk.padEnd(6));
    const time = dim(lesson.demoTime);
    console.log(`  ${num}   ${title} ${sdk} ${time}`);
    console.log(`       ${dim(localizedConcepts(lesson))}`);
  }
  console.log();
  console.log(
    dim(`  ${t("list.hint.tutorial")}`) +
      accent("solana-lessons tutorial <n>") +
      dim(t("list.hint.execute")) +
      accent("solana-lessons run <n>"),
  );
  console.log();
}
