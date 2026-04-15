/**
 * Lesson 08 - CPIs in Action
 *
 * Core concept: Programs call each other through Cross-Program Invocations (CPIs).
 * Every complex Solana operation is a chain of program calls. We can observe these
 * chains by parsing transaction logs for "invoke" and "success" markers.
 */

import {
  pipe,
  createTransactionMessage,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  appendTransactionMessageInstructions,
  signTransactionMessageWithSigners,
  getSignatureFromTransaction,
  address,
  generateKeyPairSigner,
} from "@solana/kit";
import { getCreateAccountInstruction } from "@solana-program/system";
import {
  getInitializeMintInstruction,
  getMintSize,
  TOKEN_PROGRAM_ADDRESS,
  getCreateAssociatedTokenIdempotentInstruction,
  getMintToInstruction,
  findAssociatedTokenPda,
} from "@solana-program/token";

import {
  createClient,
  createFundedKeypair,
  lamports,
} from "./helpers/config.js";
import {
  banner,
  step,
  success,
  info,
  keyValue,
  divider,
  formatAddress,
} from "./helpers/display.js";

const KNOWN_PROGRAMS: Record<string, string> = {
  "11111111111111111111111111111111": "System Program",
  TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA: "Token Program",
  ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL: "Associated Token Program",
};

function programLabel(id: string): string {
  return KNOWN_PROGRAMS[id] ?? formatAddress(id);
}

interface CpiEvent {
  kind: "invoke" | "success" | "consumed";
  programId: string;
  depth?: number;
  units?: string;
}

function parseLogs(logs: readonly string[]): CpiEvent[] {
  const events: CpiEvent[] = [];
  const invokeRe = /Program (\w+) invoke \[(\d+)\]/;
  const successRe = /Program (\w+) success/;
  const consumedRe = /Program (\w+) consumed (\d+)/;

  for (const line of logs) {
    const invokeMatch = line.match(invokeRe);
    if (invokeMatch) {
      events.push({
        kind: "invoke",
        programId: invokeMatch[1],
        depth: parseInt(invokeMatch[2], 10),
      });
      continue;
    }
    const successMatch = line.match(successRe);
    if (successMatch) {
      events.push({ kind: "success", programId: successMatch[1] });
      continue;
    }
    const consumedMatch = line.match(consumedRe);
    if (consumedMatch) {
      events.push({
        kind: "consumed",
        programId: consumedMatch[1],
        units: consumedMatch[2],
      });
    }
  }
  return events;
}

function displayCpiTree(events: CpiEvent[]): void {
  const depthStack: number[] = [];

  for (const event of events) {
    if (event.kind === "invoke") {
      const depth = event.depth ?? 1;
      depthStack.push(depth);
      const indent = "  ".repeat(depth);
      const connector = depth > 1 ? "└─ " : "";
      console.log(
        `${indent}${connector}${programLabel(event.programId)} invoke [${depth}]`,
      );
    } else if (event.kind === "success") {
      const depth = depthStack.pop() ?? 1;
      const indent = "  ".repeat(depth + 1);
      console.log(`${indent}└─ success`);
    }
  }
}

export async function main(): Promise<void> {
  banner("Lesson 08: CPIs in Action");

  const client = createClient();
  const { rpc, sendAndConfirm } = client;

  info(
    "When you call a Solana program, it can call other programs internally.",
  );
  info("These are Cross-Program Invocations (CPIs). Every complex operation");
  info(
    "is actually a chain of program calls, visible in the transaction logs.",
  );

  // ── Step 1: Create a mint (System + Token program calls) ─────────────

  step(1, "Create a mint — observe System and Token program interactions");

  const payer = await createFundedKeypair(client, 5);
  const mintKeypair = await generateKeyPairSigner();

  const mintSpace = getMintSize();
  const rentLamports = await rpc
    .getMinimumBalanceForRentExemption(BigInt(mintSpace))
    .send();

  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

  const createMintTx = pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayerSigner(payer, m),
    (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
    (m) =>
      appendTransactionMessageInstructions(
        [
          getCreateAccountInstruction({
            payer,
            newAccount: mintKeypair,
            lamports: lamports(rentLamports),
            space: mintSpace,
            programAddress: TOKEN_PROGRAM_ADDRESS,
          }),
          getInitializeMintInstruction({
            mint: mintKeypair.address,
            decimals: 9,
            mintAuthority: payer.address,
          }),
        ],
        m,
      ),
  );

  const signedMintTx = await signTransactionMessageWithSigners(createMintTx);
  await sendAndConfirm(signedMintTx, { commitment: "confirmed" });

  const mintSig = getSignatureFromTransaction(signedMintTx);
  success("Mint created");
  keyValue("Mint address", formatAddress(mintKeypair.address));
  keyValue("Signature", mintSig);

  // ── Step 2: Fetch transaction and extract logs ───────────────────────

  step(2, "Fetch transaction logs to see program invocations");

  const txResult = await rpc
    .getTransaction(mintSig, {
      maxSupportedTransactionVersion: 0,
      commitment: "confirmed",
      encoding: "json",
    })
    .send();

  if (!txResult?.meta?.logMessages) {
    info("Could not fetch transaction logs. Skipping log analysis.");
  } else {
    const logs = txResult.meta.logMessages;

    info("Raw log messages:");
    for (const log of logs) {
      console.log(`    ${log}`);
    }

    // ── Step 3: Parse invoke patterns ──────────────────────────────────

    step(3, "Parse CPI call tree from log messages");

    info('Looking for "Program <id> invoke [N]" and "Program <id> success"');
    info("The [N] tells us the call depth: [1] = top-level, [2] = CPI, etc.");

    const events = parseLogs(logs);
    console.log("");
    displayCpiTree(events);
    console.log("");

    success("Simple mint creation: two top-level calls, no nested CPIs");
    info(
      "System Program creates the account, Token Program initializes the mint.",
    );
  }

  // ── Step 4: More complex tx — ATA creation + mint tokens ─────────────

  step(4, "Build a more complex transaction: create ATA + mint tokens");

  info("The Associated Token Program internally calls the System Program");
  info("and Token Program — this produces nested CPIs we can observe.");

  const recipient = await generateKeyPairSigner();

  const [ata] = await findAssociatedTokenPda({
    mint: mintKeypair.address,
    owner: recipient.address,
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
  });

  keyValue("Recipient", formatAddress(recipient.address));
  keyValue("ATA", formatAddress(ata));

  const { value: latestBlockhash2 } = await rpc.getLatestBlockhash().send();

  const complexTx = pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayerSigner(payer, m),
    (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash2, m),
    (m) =>
      appendTransactionMessageInstructions(
        [
          getCreateAssociatedTokenIdempotentInstruction({
            payer,
            owner: recipient.address,
            mint: mintKeypair.address,
            ata,
            tokenProgram: TOKEN_PROGRAM_ADDRESS,
          }),
          getMintToInstruction({
            mint: mintKeypair.address,
            token: ata,
            mintAuthority: payer,
            amount: 1_000_000_000n,
          }),
        ],
        m,
      ),
  );

  const signedComplexTx = await signTransactionMessageWithSigners(complexTx);
  await sendAndConfirm(signedComplexTx, { commitment: "confirmed" });

  const complexSig = getSignatureFromTransaction(signedComplexTx);
  success("ATA created and tokens minted");
  keyValue("Signature", complexSig);

  // ── Step 5: Display the deeper CPI chain ─────────────────────────────

  step(5, "Inspect the deeper CPI chain");

  const complexTxResult = await rpc
    .getTransaction(complexSig, {
      maxSupportedTransactionVersion: 0,
      commitment: "confirmed",
      encoding: "json",
    })
    .send();

  if (!complexTxResult?.meta?.logMessages) {
    info("Could not fetch transaction logs.");
  } else {
    const logs = complexTxResult.meta.logMessages;

    info("Raw log messages:");
    for (const log of logs) {
      console.log(`    ${log}`);
    }

    console.log("");
    info("CPI call tree:");
    const events = parseLogs(logs);
    displayCpiTree(events);
    console.log("");

    success("Notice the nested calls!");
    info(
      "The Associated Token Program (depth [1]) calls System Program (depth [2])",
    );
    info(
      "to create the account, then calls Token Program (depth [2]) to initialize it.",
    );
    info("MintTo is a separate top-level Token Program call (depth [1]).");
  }

  // ── Recap ────────────────────────────────────────────────────────────

  divider();
  info("Key takeaways:");
  info("  - CPIs let programs call other programs within a single transaction");
  info("  - invoke [1] = top-level instruction, [2] = CPI, [3] = CPI from CPI");
  info("  - Maximum CPI depth is 4 levels");
  info("  - Creating an ATA involves nested CPIs to System + Token programs");
  info("  - Transaction logs reveal the full call chain for debugging");
  info("  - Each CPI consumes additional compute units from the caller budget");
  info("  - PDA-signed CPIs let program-owned accounts authorize operations");

  success("Lesson 08 complete!");
}

main().catch(console.error);
