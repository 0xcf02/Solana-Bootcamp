import chalk from "chalk";
import boxen from "boxen";
import { highlight } from "cli-highlight";
import { marked } from "marked";
import { markedTerminal } from "marked-terminal";
import { type LessonMeta, localizedTitle } from "./lesson-catalog.js";
import type { LessonStep, ParsedLesson } from "./parser.js";
import { badge, isInteractive } from "./branding.js";
import { t } from "./i18n/index.js";

marked.use(markedTerminal() as any);

const ACCENT = "#00c2a8";
const MUTED = "#6b7280";

export function renderMarkdown(md: string): string {
  if (!md.trim()) return "";
  try {
    return marked.parse(md) as string;
  } catch {
    return md;
  }
}

export function codeBox(code: string, caption: string): string {
  const lang = "typescript";
  let body: string;
  if (isInteractive()) {
    try {
      body = highlight(code, { language: lang, ignoreIllegals: true });
    } catch {
      body = code;
    }
  } else {
    body = code;
  }

  return boxen(body, {
    title: isInteractive() ? chalk.hex(MUTED)(caption) : caption,
    titleAlignment: "left",
    borderStyle: "round",
    borderColor: ACCENT,
    padding: { top: 0, bottom: 0, left: 1, right: 1 },
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
  });
}

export function sectionBox(body: string, title: string): string {
  return boxen(body, {
    title: isInteractive() ? chalk.hex(ACCENT).bold(title) : title,
    titleAlignment: "left",
    borderStyle: "round",
    borderColor: ACCENT,
    padding: 1,
    margin: { top: 1, bottom: 0, left: 0, right: 0 },
  });
}

export function stepHeader(
  meta: LessonMeta,
  step: LessonStep,
  total: number,
): string {
  const title = localizedTitle(meta);
  if (!isInteractive()) {
    return `\n${badge()}  ${t("lesson.label")} ${pad2(meta.number)} · ${title}  [${t("step.label")} ${step.n} / ${total}]\n`;
  }
  const left = `${badge()}  ${chalk.bold(`${t("lesson.label")} ${pad2(meta.number)}`)} ${chalk.dim("·")} ${chalk.hex(ACCENT)(title)}`;
  const right = chalk.dim(`[${t("step.label")} ${step.n} / ${total}]`);
  return `\n${left}    ${right}\n`;
}

export function statusBar(meta: LessonMeta, rpcUrl: string): string {
  const text = `${t("lesson.label").toLowerCase()} ${pad2(meta.number)} · ${meta.slug} · ${rpcUrl}`;
  return isInteractive() ? chalk.dim(text) : text;
}

export function hotkeyHint(): string {
  const hint = t("hotkey.full");
  return isInteractive() ? chalk.dim(hint) : hint;
}

export function renderNarrative(lines: string[]): string {
  if (!lines.length) return "";
  const bullet = isInteractive() ? chalk.yellow("ℹ") : "ℹ";
  return lines.map((line) => `  ${bullet} ${line}`).join("\n");
}

export function renderStepBody(
  parsed: ParsedLesson,
  stepIndex: number,
  rpcUrl: string,
): string {
  const step = parsed.steps[stepIndex];
  const total = parsed.steps.length;

  const parts: string[] = [];
  parts.push(stepHeader(parsed.meta, step, total));

  const title = isInteractive()
    ? chalk.magenta.bold(`▸ ${t("step.label")} ${step.n}: `) + chalk.bold(step.title)
    : `▸ ${t("step.label")} ${step.n}: ${step.title}`;
  parts.push(title);

  const narrative = renderNarrative(step.narrative);
  if (narrative) parts.push("", narrative);

  if (step.code.trim()) {
    const caption = `src/${pad2(parsed.meta.number)}-${parsed.meta.slug}.ts · ${t("step.label")} ${step.n}`;
    parts.push("", codeBox(step.code, caption));
  }

  parts.push("", statusBar(parsed.meta, rpcUrl), hotkeyHint());
  return parts.join("\n");
}

export function renderOverview(parsed: ParsedLesson): string {
  const md =
    parsed.overview ||
    `${t("lesson.label")} ${pad2(parsed.meta.number)}: ${localizedTitle(parsed.meta)}`;
  const body = renderMarkdown(md).trim();
  return sectionBox(body, `${t("lesson.label")} ${pad2(parsed.meta.number)} · ${t("overview.label")}`);
}

export function clearScreen(): void {
  if (isInteractive()) {
    process.stdout.write("\x1Bc");
  }
}

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}
