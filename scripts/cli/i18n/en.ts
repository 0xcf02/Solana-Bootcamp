const en = {
  // ── cli/index.ts ──────────────────────────────────────────
  "cli.pickLesson": "Pick a lesson",
  "cli.goodbye": "\n  Goodbye \u{1F44B}",
  "cli.errorLessonRange":
    'Lesson number must be an integer 1-12 (got "{n}")',

  // ── cli/branding.ts ───────────────────────────────────────
  "splash.plain":
    "solana-lessons \u2014 Superteam Brazil Solana Bootcamp",
  "splash.tagline":
    "  Solana Bootcamp \u00B7 12 lessons \u00B7 powered by @SuperteamBR",

  // ── cli/renderer.ts ───────────────────────────────────────
  "step.label": "Step",
  "lesson.label": "Lesson",
  "overview.label": "Overview",
  "hotkey.full": "\u21B5 next \u00B7 \u2190 back \u00B7 q quit \u00B7 r run",
  "hotkey.overview": "\u21B5 next \u00B7 q quit",

  // ── cli/commands/list.ts ──────────────────────────────────
  "list.header": "Solana Bootcamp \u00B7 12 lessons",
  "list.col.number": "#",
  "list.col.lesson": "Lesson",
  "list.col.sdk": "SDK",
  "list.col.time": "Time",
  "list.hint.tutorial": "Run a tutorial: ",
  "list.hint.execute": "   \u00B7   Execute: ",

  // ── cli/commands/tutorial.ts ──────────────────────────────
  "tutorial.noLesson":
    "No lesson {n}. Run `solana-lessons list` to see available lessons.",
  "tutorial.steps": "{count} step(s)",
  "tutorial.complete":
    "\u2714 Lesson {lesson} \u00B7 {title} \u2014 walkthrough complete.",
  "tutorial.confirmRun": "Run the real script now against {rpc}?",

  // ── cli/commands/run.ts ───────────────────────────────────
  "run.noLesson": "No lesson {n}.",
  "run.noTsx":
    "Could not locate tsx runtime. Try reinstalling the package.",

  // ── Lesson titles ─────────────────────────────────────────
  "lesson.1.title": "Hello Solana",
  "lesson.2.title": "Send SOL",
  "lesson.3.title": "Atomic Transactions",
  "lesson.4.title": "Create Token (Manual)",
  "lesson.5.title": "Create Token (Easy)",
  "lesson.6.title": "Tokens and Transfers",
  "lesson.7.title": "PDAs Explained",
  "lesson.8.title": "CPIs in Action",
  "lesson.9.title": "Priority Fees",
  "lesson.10.title": "Token Extensions (Token-2022)",
  "lesson.11.title": "Solana Actions (Blinks)",
  "lesson.12.title": "x402 Micropayments",

  // ── Lesson concepts ───────────────────────────────────────
  "lesson.1.concepts": "Keypairs, balances, airdrop, lamports",
  "lesson.2.concepts":
    "Build tx with transfer + memo, pipe() pattern",
  "lesson.3.concepts":
    "Atomicity: multi-instruction failure rollback",
  "lesson.4.concepts":
    "Create token step by step (raw instructions)",
  "lesson.5.concepts":
    "High-level helper, full token lifecycle",
  "lesson.6.concepts":
    "ATA creation, mint tokens, SPL transfer deep dive",
  "lesson.7.concepts": "PDA derivation, ATA-as-PDA proof",
  "lesson.8.concepts": "CPI chain from transaction logs",
  "lesson.9.concepts":
    "Compute budget, CU estimation, priority fees",
  "lesson.10.concepts": "Transfer fees + on-chain metadata",
  "lesson.11.concepts":
    "Express server serving a tip jar Action",
  "lesson.12.concepts": "Pay-per-API-call with HTTP 402",
} as const;

export type LocaleKey = keyof typeof en;
export type LocaleStrings = Record<LocaleKey, string>;
export default en satisfies LocaleStrings;
