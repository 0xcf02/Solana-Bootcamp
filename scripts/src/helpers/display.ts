const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const MAGENTA = "\x1b[35m";

export function banner(title: string): void {
  const line = "═".repeat(title.length + 4);
  console.log(`\n${CYAN}${BOLD}╔${line}╗${RESET}`);
  console.log(`${CYAN}${BOLD}║  ${title}  ║${RESET}`);
  console.log(`${CYAN}${BOLD}╚${line}╝${RESET}\n`);
}

export function step(n: number, text: string): void {
  console.log(`\n${MAGENTA}${BOLD}▸ Step ${n}:${RESET} ${text}`);
}

export function success(msg: string): void {
  console.log(`  ${GREEN}✔${RESET} ${msg}`);
}

export function fail(msg: string): void {
  console.log(`  ${RED}✘${RESET} ${msg}`);
}

export function info(msg: string): void {
  console.log(`  ${YELLOW}ℹ${RESET} ${msg}`);
}

export function divider(): void {
  console.log(`\n${DIM}${"─".repeat(60)}${RESET}\n`);
}

export function keyValue(key: string, value: string | number | bigint): void {
  console.log(`  ${DIM}${key}:${RESET} ${BOLD}${value}${RESET}`);
}

export function formatSol(lamports: bigint): string {
  const sol = Number(lamports) / 1_000_000_000;
  return `${sol} SOL`;
}

export function formatAddress(address: string): string {
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
