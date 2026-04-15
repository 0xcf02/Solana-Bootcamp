import type { LocaleKey } from "./en.js";

const ptBR: Record<LocaleKey, string> = {
  // ── cli/index.ts ──────────────────────────────────────────
  "cli.pickLesson": "Escolha uma li\u00E7\u00E3o",
  "cli.goodbye": "\n  At\u00E9 mais \u{1F44B}",
  "cli.errorLessonRange":
    'N\u00FAmero da li\u00E7\u00E3o deve ser um inteiro de 1 a 12 (recebido: "{n}")',

  // ── cli/branding.ts ───────────────────────────────────────
  "splash.plain":
    "solana-lessons \u2014 Bootcamp Solana da Superteam Brasil",
  "splash.tagline":
    "  Bootcamp Solana \u00B7 12 li\u00E7\u00F5es \u00B7 powered by @SuperteamBR",

  // ── cli/renderer.ts ───────────────────────────────────────
  "step.label": "Passo",
  "lesson.label": "Li\u00E7\u00E3o",
  "overview.label": "Vis\u00E3o Geral",
  "hotkey.full":
    "\u21B5 pr\u00F3ximo \u00B7 \u2190 voltar \u00B7 q sair \u00B7 r executar",
  "hotkey.overview": "\u21B5 pr\u00F3ximo \u00B7 q sair",

  // ── cli/commands/list.ts ──────────────────────────────────
  "list.header": "Bootcamp Solana \u00B7 12 li\u00E7\u00F5es",
  "list.col.number": "#",
  "list.col.lesson": "Li\u00E7\u00E3o",
  "list.col.sdk": "SDK",
  "list.col.time": "Tempo",
  "list.hint.tutorial": "Iniciar tutorial: ",
  "list.hint.execute": "   \u00B7   Executar: ",

  // ── cli/commands/tutorial.ts ──────────────────────────────
  "tutorial.noLesson":
    "Li\u00E7\u00E3o {n} n\u00E3o encontrada. Execute `solana-lessons list` para ver as li\u00E7\u00F5es dispon\u00EDveis.",
  "tutorial.steps": "{count} passo(s)",
  "tutorial.complete":
    "\u2714 Li\u00E7\u00E3o {lesson} \u00B7 {title} \u2014 tutorial conclu\u00EDdo.",
  "tutorial.confirmRun": "Executar o script real agora em {rpc}?",

  // ── cli/commands/run.ts ───────────────────────────────────
  "run.noLesson": "Li\u00E7\u00E3o {n} n\u00E3o encontrada.",
  "run.noTsx":
    "N\u00E3o foi poss\u00EDvel localizar o runtime tsx. Tente reinstalar o pacote.",

  // ── Lesson titles ─────────────────────────────────────────
  "lesson.1.title": "Ol\u00E1 Solana",
  "lesson.2.title": "Enviar SOL",
  "lesson.3.title": "Transa\u00E7\u00F5es At\u00F4micas",
  "lesson.4.title": "Criar Token (Manual)",
  "lesson.5.title": "Criar Token (F\u00E1cil)",
  "lesson.6.title": "Tokens e Transfer\u00EAncias",
  "lesson.7.title": "PDAs Explicados",
  "lesson.8.title": "CPIs em A\u00E7\u00E3o",
  "lesson.9.title": "Taxas de Prioridade",
  "lesson.10.title": "Extens\u00F5es de Token (Token-2022)",
  "lesson.11.title": "Solana Actions (Blinks)",
  "lesson.12.title": "Micropagamentos x402",

  // ── Lesson concepts ───────────────────────────────────────
  "lesson.1.concepts": "Keypairs, saldos, airdrop, lamports",
  "lesson.2.concepts":
    "Construir tx com transfer + memo, padr\u00E3o pipe()",
  "lesson.3.concepts":
    "Atomicidade: rollback em falha multi-instru\u00E7\u00E3o",
  "lesson.4.concepts":
    "Criar token passo a passo (instru\u00E7\u00F5es brutas)",
  "lesson.5.concepts":
    "Helper de alto n\u00EDvel, ciclo de vida completo do token",
  "lesson.6.concepts":
    "Cria\u00E7\u00E3o de ATA, mintar tokens, transfer\u00EAncia SPL em detalhes",
  "lesson.7.concepts":
    "Deriva\u00E7\u00E3o de PDA, prova de ATA como PDA",
  "lesson.8.concepts":
    "Cadeia de CPI a partir dos logs de transa\u00E7\u00E3o",
  "lesson.9.concepts":
    "Compute budget, estima\u00E7\u00E3o de CU, taxas de prioridade",
  "lesson.10.concepts":
    "Taxas de transfer\u00EAncia + metadados on-chain",
  "lesson.11.concepts":
    "Servidor Express servindo uma Action de gorjeta",
  "lesson.12.concepts":
    "Pagamento por chamada de API com HTTP 402",
} as const;

export default ptBR;
