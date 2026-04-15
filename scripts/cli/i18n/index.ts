import en, { type LocaleKey, type LocaleStrings } from "./en.js";
import ptBR from "./pt-BR.js";

export type { LocaleKey, LocaleStrings };
export type SupportedLocale = "en" | "pt-BR";

const locales: Record<SupportedLocale, LocaleStrings> = {
  en,
  "pt-BR": ptBR,
};

let current: LocaleStrings = en;

export function setLocale(locale: SupportedLocale): void {
  current = locales[locale] ?? en;
}

export function t(
  key: LocaleKey,
  vars?: Record<string, string | number>,
): string {
  const raw: string = current[key] ?? en[key] ?? key;
  if (!vars) return raw;
  return raw.replace(/\{(\w+)\}/g, (_, k: string) =>
    vars[k] !== undefined ? String(vars[k]) : `{${k}}`,
  );
}

export function detectLocale(flagValue?: string): SupportedLocale {
  if (flagValue) {
    const normalized = flagValue.toLowerCase().replaceAll("_", "-");
    if (normalized === "pt-br" || normalized === "pt") return "pt-BR";
    return "en";
  }

  const envLang =
    process.env.LC_ALL ??
    process.env.LC_MESSAGES ??
    process.env.LANG ??
    process.env.LANGUAGE ??
    "";
  if (envLang.toLowerCase().startsWith("pt")) return "pt-BR";
  return "en";
}
