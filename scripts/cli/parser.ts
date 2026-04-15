import { readFileSync } from "node:fs";
import type { LessonMeta } from "./lesson-catalog.js";

export type LessonStep = {
  n: number;
  title: string;
  narrative: string[];
  code: string;
};

export type ParsedLesson = {
  meta: LessonMeta;
  overview: string;
  steps: LessonStep[];
};

/**
 * Parse a lesson source file.
 *
 * Strategy:
 * 1. Extract the top-of-file JSDoc block as the overview.
 * 2. Locate every `step(N, "Title")` call in source order; these partition
 *    the file into per-step regions (step[i] through step[i+1] or EOF).
 * 3. Each region's narrative is the concatenation of all `info("...")`
 *    string arguments in that region.
 * 4. Each region's code is the full raw text of that region, de-indented.
 */
export function parseLesson(meta: LessonMeta): ParsedLesson {
  const source = readFileSync(meta.file, "utf8");

  return {
    meta,
    overview: extractOverview(source),
    steps: extractSteps(source),
  };
}

function extractOverview(source: string): string {
  const match = source.match(/^\s*\/\*\*([\s\S]*?)\*\//);
  if (!match) return "";
  const body = match[1]
    .split("\n")
    .map((line) => line.replace(/^\s*\*\s?/, "").replace(/^\s*\*$/, ""))
    .join("\n")
    .trim();
  return body;
}

type StepHit = {
  n: number;
  title: string;
  start: number; // char offset where the step() call begins
  bodyStart: number; // char offset just after the step() call
};

function extractSteps(source: string): LessonStep[] {
  // Match: step(N, "Title") or step(N, 'Title') or step(N, `Title`)
  // Title may span the next line (multiline argument). Be tolerant of a
  // trailing comma before the close paren.
  const rx = /\bstep\s*\(\s*(\d+)\s*,\s*(["'`])([\s\S]*?)\2\s*,?\s*\)/g;
  const hits: StepHit[] = [];
  let m: RegExpExecArray | null;
  while ((m = rx.exec(source)) !== null) {
    hits.push({
      n: Number(m[1]),
      title: m[3].replace(/\s+/g, " ").trim(),
      start: m.index,
      bodyStart: m.index + m[0].length,
    });
  }

  const steps: LessonStep[] = [];
  for (let i = 0; i < hits.length; i++) {
    const hit = hits[i];
    const end = i + 1 < hits.length ? hits[i + 1].start : source.length;
    // The step() call is followed by `;` and whitespace; skip past them
    // so the code block starts at the next meaningful token.
    let codeStart = hit.bodyStart;
    while (codeStart < end && /[;\s]/.test(source[codeStart])) codeStart++;
    const region = source.slice(codeStart, end);

    steps.push({
      n: hit.n,
      title: hit.title,
      narrative: extractInfoStrings(region),
      code: dedentAndTrim(region),
    });
  }

  return steps;
}

/**
 * Pull string arguments out of `info("...")` calls within a region.
 * Supports simple single-argument string literals (including concatenation
 * across lines via implicit continuation or `+`).
 */
function extractInfoStrings(region: string): string[] {
  // Match info( <ws> <quote> ... <quote> <ws> [,] <ws> )
  // Allows multiline calls and a trailing comma before the close paren.
  const rx = /\binfo\s*\(\s*(["'`])([\s\S]*?)\1\s*,?\s*\)/g;
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = rx.exec(region)) !== null) {
    out.push(m[2].replace(/\s+/g, " ").trim());
  }
  return out;
}

/**
 * De-indent a code region (strip common leading whitespace) and trim
 * trailing blank lines. Keeps the code readable inside a bordered box.
 */
function dedentAndTrim(code: string): string {
  // Drop leading/trailing blank lines
  const lines = code.replace(/^\n+/, "").replace(/\s+$/, "").split("\n");

  // Find minimum indent of non-blank lines
  let min = Infinity;
  for (const line of lines) {
    if (line.trim() === "") continue;
    const indent = line.match(/^(\s*)/)?.[1].length ?? 0;
    if (indent < min) min = indent;
  }
  if (!isFinite(min)) min = 0;

  return lines.map((line) => line.slice(min)).join("\n");
}
