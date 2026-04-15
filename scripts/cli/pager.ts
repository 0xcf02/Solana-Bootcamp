import readline from "node:readline";

export type PagerAction = "next" | "back" | "quit" | "run";

/**
 * Wait for a single keystroke and translate it into a pager action.
 * Requires a TTY; callers should fall back to non-interactive rendering
 * when stdin is not a TTY.
 */
export function readKey(): Promise<PagerAction> {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    if (!stdin.isTTY) {
      // Fall back to line-based prompt.
      const rl = readline.createInterface({
        input: stdin,
        output: process.stdout,
      });
      rl.question("", (answer) => {
        rl.close();
        resolve(mapAnswer(answer.trim().toLowerCase()));
      });
      return;
    }

    readline.emitKeypressEvents(stdin);
    const wasRaw = stdin.isRaw;
    stdin.setRawMode(true);
    stdin.resume();

    const onKey = (_str: string, key: readline.Key) => {
      const action = mapKey(key);
      if (!action) return;
      stdin.off("keypress", onKey);
      stdin.setRawMode(wasRaw);
      stdin.pause();
      resolve(action);
    };

    stdin.on("keypress", onKey);
  });
}

function mapKey(key: readline.Key): PagerAction | null {
  if (!key) return null;
  // Ctrl+C always exits.
  if (key.ctrl && key.name === "c") return "quit";
  switch (key.name) {
    case "return":
    case "enter":
    case "space":
    case "right":
    case "down":
      return "next";
    case "left":
    case "up":
    case "b":
    case "backspace":
      return "back";
    case "q":
    case "escape":
      return "quit";
    case "r":
      return "run";
    default:
      return null;
  }
}

function mapAnswer(answer: string): PagerAction {
  if (answer === "q" || answer === "quit") return "quit";
  if (answer === "b" || answer === "back") return "back";
  if (answer === "r" || answer === "run") return "run";
  return "next";
}
