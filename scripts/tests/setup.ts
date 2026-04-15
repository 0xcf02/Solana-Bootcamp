/**
 * Shared test utilities for lesson-scripts integration tests.
 */

const VALIDATOR_URL = "http://127.0.0.1:8899";
const POLL_INTERVAL_MS = 500;
const MAX_WAIT_MS = 30_000;

/**
 * Polls the local validator health endpoint until it responds,
 * or throws after MAX_WAIT_MS.
 */
export async function waitForValidator(): Promise<void> {
  const start = Date.now();

  while (Date.now() - start < MAX_WAIT_MS) {
    try {
      const res = await fetch(`${VALIDATOR_URL}/health`);
      if (res.ok) return;
    } catch {
      // Validator not ready yet
    }
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }

  throw new Error(
    `Local validator at ${VALIDATOR_URL} did not become healthy within ${MAX_WAIT_MS}ms`,
  );
}

/**
 * Suppresses console output during a callback. Returns captured stdout lines.
 */
export async function suppressConsole<T>(fn: () => Promise<T>): Promise<T> {
  const originalLog = console.log;
  const originalInfo = console.info;
  const originalWarn = console.warn;
  const originalError = console.error;

  console.log = () => {};
  console.info = () => {};
  console.warn = () => {};
  console.error = () => {};

  try {
    return await fn();
  } finally {
    console.log = originalLog;
    console.info = originalInfo;
    console.warn = originalWarn;
    console.error = originalError;
  }
}
