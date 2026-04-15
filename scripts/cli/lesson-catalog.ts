import { fileURLToPath } from "node:url";
import path from "node:path";
import { statSync } from "node:fs";
import { t, type LocaleKey } from "./i18n/index.js";

export type LessonMeta = {
  number: number;
  slug: string;
  title: string;
  concepts: string;
  sdk: "Kit" | "1.x";
  demoTime: string;
  file: string;
};

// Resolve the shipped src/ directory relative to this module.
// At build time this file lives in dist/cli/, and src/ ships alongside dist/
// (package.json "files" includes both). At dev time (tsx cli/index.ts), it
// lives in cli/ and src/ is a sibling. Walk up one level either way.
const here = path.dirname(fileURLToPath(import.meta.url));
const candidates = [
  path.resolve(here, "..", "..", "src"), // dist/cli -> repo/src
  path.resolve(here, "..", "src"), // cli -> repo/src
];

export function lessonSourceDir(): string {
  for (const c of candidates) {
    try {
      if (statSync(c).isDirectory()) return c;
    } catch {
      // try next
    }
  }
  return candidates[0];
}

function srcFile(name: string): string {
  return path.join(lessonSourceDir(), name);
}

export const LESSONS: LessonMeta[] = [
  {
    number: 1,
    slug: "hello-solana",
    title: "Hello Solana",
    concepts: "Keypairs, balances, airdrop, lamports",
    sdk: "Kit",
    demoTime: "~2 min",
    file: srcFile("01-hello-solana.ts"),
  },
  {
    number: 2,
    slug: "send-sol",
    title: "Send SOL",
    concepts: "Build tx with transfer + memo, pipe() pattern",
    sdk: "Kit",
    demoTime: "~3 min",
    file: srcFile("02-send-sol.ts"),
  },
  {
    number: 3,
    slug: "atomic-transactions",
    title: "Atomic Transactions",
    concepts: "Atomicity: multi-instruction failure rollback",
    sdk: "Kit",
    demoTime: "~5 min",
    file: srcFile("03-atomic-transactions.ts"),
  },
  {
    number: 4,
    slug: "create-token-manual",
    title: "Create Token (Manual)",
    concepts: "Create token step by step (raw instructions)",
    sdk: "Kit",
    demoTime: "~5 min",
    file: srcFile("04-create-token-manual.ts"),
  },
  {
    number: 5,
    slug: "create-token-easy",
    title: "Create Token (Easy)",
    concepts: "High-level helper, full token lifecycle",
    sdk: "Kit",
    demoTime: "~3 min",
    file: srcFile("05-create-token-easy.ts"),
  },
  {
    number: 6,
    slug: "tokens-and-transfers",
    title: "Tokens and Transfers",
    concepts: "ATA creation, mint tokens, SPL transfer deep dive",
    sdk: "Kit",
    demoTime: "~5 min",
    file: srcFile("06-tokens-and-transfers.ts"),
  },
  {
    number: 7,
    slug: "pdas-explained",
    title: "PDAs Explained",
    concepts: "PDA derivation, ATA-as-PDA proof",
    sdk: "Kit",
    demoTime: "~3 min",
    file: srcFile("07-pdas-explained.ts"),
  },
  {
    number: 8,
    slug: "cpis-in-action",
    title: "CPIs in Action",
    concepts: "CPI chain from transaction logs",
    sdk: "Kit",
    demoTime: "~4 min",
    file: srcFile("08-cpis-in-action.ts"),
  },
  {
    number: 9,
    slug: "priority-fees",
    title: "Priority Fees",
    concepts: "Compute budget, CU estimation, priority fees",
    sdk: "Kit",
    demoTime: "~4 min",
    file: srcFile("09-priority-fees.ts"),
  },
  {
    number: 10,
    slug: "token-extensions",
    title: "Token Extensions (Token-2022)",
    concepts: "Transfer fees + on-chain metadata",
    sdk: "1.x",
    demoTime: "~5 min",
    file: srcFile("10-token-extensions.ts"),
  },
  {
    number: 11,
    slug: "solana-actions",
    title: "Solana Actions (Blinks)",
    concepts: "Express server serving a tip jar Action",
    sdk: "1.x",
    demoTime: "~5 min",
    file: srcFile("11-solana-actions.ts"),
  },
  {
    number: 12,
    slug: "x402-micropayments",
    title: "x402 Micropayments",
    concepts: "Pay-per-API-call with HTTP 402",
    sdk: "1.x",
    demoTime: "~3 min",
    file: srcFile("12-x402-micropayments.ts"),
  },
];

export function findLesson(n: number): LessonMeta | undefined {
  return LESSONS.find((l) => l.number === n);
}

export function localizedTitle(lesson: LessonMeta): string {
  return t(`lesson.${lesson.number}.title` as LocaleKey);
}

export function localizedConcepts(lesson: LessonMeta): string {
  return t(`lesson.${lesson.number}.concepts` as LocaleKey);
}
