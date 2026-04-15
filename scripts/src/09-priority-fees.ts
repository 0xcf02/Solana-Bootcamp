/**
 * Lesson 09 - Priority Fees & Compute Budget
 *
 * Core concept: Every Solana transaction has a compute budget measured in
 * Compute Units (CU). You can set explicit CU limits, estimate usage before
 * sending, and pay priority fees so validators process your transaction first.
 * Think of it like gas price bidding — higher fee-per-CU = faster inclusion.
 */

import {
  pipe,
  createTransactionMessage,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  appendTransactionMessageInstructions,
  signTransactionMessageWithSigners,
  getSignatureFromTransaction,
  getBase64EncodedWireTransaction,
} from "@solana/kit";
import { getTransferSolInstruction } from "@solana-program/system";
import { getAddMemoInstruction } from "@solana-program/memo";
import {
  getSetComputeUnitLimitInstruction,
  getSetComputeUnitPriceInstruction,
} from "@solana-program/compute-budget";

import {
  createClient,
  createFundedKeypair,
  generateKeyPairSigner,
  lamports,
} from "./helpers/config.js";
import {
  banner,
  step,
  success,
  info,
  keyValue,
  divider,
  formatSol,
  formatAddress,
} from "./helpers/display.js";

function extractCuFromLogs(logs: readonly string[]): number | null {
  for (const log of logs) {
    const match = log.match(/consumed (\d+) of (\d+) compute units/);
    if (match) {
      return parseInt(match[1], 10);
    }
  }
  return null;
}

function extractCuLimitFromLogs(logs: readonly string[]): number | null {
  for (const log of logs) {
    const match = log.match(/consumed (\d+) of (\d+) compute units/);
    if (match) {
      return parseInt(match[2], 10);
    }
  }
  return null;
}

export async function main(): Promise<void> {
  banner("Lesson 09: Priority Fees & Compute Budget");

  const client = createClient();
  const { rpc, sendAndConfirm } = client;

  info(
    "Every transaction gets a compute budget measured in Compute Units (CU).",
  );
  info(
    "Default: 200,000 CU per instruction, 1,400,000 CU max per transaction.",
  );
  info(
    "You can tune this for efficiency and pay priority fees for faster inclusion.",
  );

  const payer = await createFundedKeypair(client, 5);
  const recipient = await generateKeyPairSigner();

  keyValue("Payer", formatAddress(payer.address));
  keyValue("Recipient", formatAddress(recipient.address));

  // ── Step 1: Default transaction (no compute budget instructions) ─────

  step(1, "Send a basic transfer — observe default CU allocation");

  const { value: blockhash1 } = await rpc.getLatestBlockhash().send();

  const defaultTx = pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayerSigner(payer, m),
    (m) => setTransactionMessageLifetimeUsingBlockhash(blockhash1, m),
    (m) =>
      appendTransactionMessageInstructions(
        [
          getTransferSolInstruction({
            source: payer,
            destination: recipient.address,
            amount: lamports(100_000_000n),
          }),
          getAddMemoInstruction({
            memo: "Default compute budget test",
          }),
        ],
        m,
      ),
  );

  const signedDefault = await signTransactionMessageWithSigners(defaultTx);
  await sendAndConfirm(signedDefault, { commitment: "confirmed" });
  const defaultSig = getSignatureFromTransaction(signedDefault);

  const defaultTxResult = await rpc
    .getTransaction(defaultSig, {
      maxSupportedTransactionVersion: 0,
      commitment: "confirmed",
      encoding: "json",
    })
    .send();

  const defaultCuUsed = defaultTxResult?.meta?.logMessages
    ? extractCuFromLogs(defaultTxResult.meta.logMessages)
    : null;
  const defaultCuLimit = defaultTxResult?.meta?.logMessages
    ? extractCuLimitFromLogs(defaultTxResult.meta.logMessages)
    : null;

  success("Default transaction sent");
  keyValue("CU consumed", defaultCuUsed ?? "unknown");
  keyValue("CU limit (default)", defaultCuLimit ?? "unknown");
  info(
    "Without an explicit limit, each instruction gets 200,000 CU by default.",
  );
  info(
    `This transaction only used ~${defaultCuUsed ?? "?"} CU but was allocated ${defaultCuLimit ?? "?"} CU.`,
  );
  info(
    "Wasted CU allocation means you overpay and block space is used inefficiently.",
  );

  // ── Step 2: Set an explicit compute unit limit ───────────────────────

  step(2, "Set an explicit compute unit limit");

  const { value: blockhash2 } = await rpc.getLatestBlockhash().send();

  const explicitLimitTx = pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayerSigner(payer, m),
    (m) => setTransactionMessageLifetimeUsingBlockhash(blockhash2, m),
    (m) =>
      appendTransactionMessageInstructions(
        [
          getSetComputeUnitLimitInstruction({ units: 300_000 }),
          getTransferSolInstruction({
            source: payer,
            destination: recipient.address,
            amount: lamports(100_000_000n),
          }),
          getAddMemoInstruction({
            memo: "Explicit CU limit test",
          }),
        ],
        m,
      ),
  );

  const signedExplicit =
    await signTransactionMessageWithSigners(explicitLimitTx);
  await sendAndConfirm(signedExplicit, { commitment: "confirmed" });
  const explicitSig = getSignatureFromTransaction(signedExplicit);

  const explicitTxResult = await rpc
    .getTransaction(explicitSig, {
      maxSupportedTransactionVersion: 0,
      commitment: "confirmed",
      encoding: "json",
    })
    .send();

  const explicitCuUsed = explicitTxResult?.meta?.logMessages
    ? extractCuFromLogs(explicitTxResult.meta.logMessages)
    : null;
  const explicitCuLimit = explicitTxResult?.meta?.logMessages
    ? extractCuLimitFromLogs(explicitTxResult.meta.logMessages)
    : null;

  success("Transaction with explicit CU limit sent");
  keyValue("CU consumed", explicitCuUsed ?? "unknown");
  keyValue("CU limit (explicit)", explicitCuLimit ?? "unknown");
  info("setComputeUnitLimit replaces the default per-instruction allocation");
  info("with a single transaction-wide budget you control.");

  // ── Step 3: Estimate CU before sending ───────────────────────────────

  step(3, "Estimate CU usage via simulation before sending");

  info(
    "We can simulate the transaction to find out how many CU it actually needs.",
  );
  info(
    "This avoids both over-allocating (wasteful) and under-allocating (fails).",
  );

  const { value: blockhash3 } = await rpc.getLatestBlockhash().send();

  const estimateTx = pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayerSigner(payer, m),
    (m) => setTransactionMessageLifetimeUsingBlockhash(blockhash3, m),
    (m) =>
      appendTransactionMessageInstructions(
        [
          getTransferSolInstruction({
            source: payer,
            destination: recipient.address,
            amount: lamports(100_000_000n),
          }),
          getAddMemoInstruction({
            memo: "Estimating compute units before sending",
          }),
        ],
        m,
      ),
  );

  const signedEstimate = await signTransactionMessageWithSigners(estimateTx);

  const simulation = await rpc
    .simulateTransaction(getBase64EncodedWireTransaction(signedEstimate), {
      commitment: "confirmed",
      encoding: "base64",
    })
    .send();

  const simulatedCu = simulation.value.unitsConsumed;
  keyValue("Simulated CU consumed", simulatedCu ?? "unknown");

  if (simulatedCu) {
    const optimizedLimit = Math.ceil(Number(simulatedCu) * 1.1);
    keyValue("Recommended limit (+10% buffer)", optimizedLimit);
    info(
      `Simulation says we need ~${simulatedCu} CU. We add a 10% buffer = ${optimizedLimit} CU.`,
    );
    info("This is the best practice: simulate -> set tight limit -> send.");
  }

  // Send the simulated transaction
  await sendAndConfirm(signedEstimate, { commitment: "confirmed" });
  success("Simulation-informed transaction sent");

  // ── Step 4: Add priority fees ────────────────────────────────────────

  step(4, "Add priority fees to jump the queue");

  info("Priority fees are priced in micro-lamports per CU.");
  info(
    "Validators sort transactions by fee-per-CU — higher = processed first.",
  );
  info("This is like gas price bidding on Ethereum, but more granular.");

  const cuLimit = simulatedCu ? Math.ceil(Number(simulatedCu) * 1.1) : 50_000;
  const microLamportsPerCu = 10_000n;

  const { value: blockhash4 } = await rpc.getLatestBlockhash().send();

  const priorityTx = pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayerSigner(payer, m),
    (m) => setTransactionMessageLifetimeUsingBlockhash(blockhash4, m),
    (m) =>
      appendTransactionMessageInstructions(
        [
          getSetComputeUnitLimitInstruction({ units: cuLimit }),
          getSetComputeUnitPriceInstruction({
            microLamports: microLamportsPerCu,
          }),
          getTransferSolInstruction({
            source: payer,
            destination: recipient.address,
            amount: lamports(100_000_000n),
          }),
          getAddMemoInstruction({
            memo: "Priority fee transaction",
          }),
        ],
        m,
      ),
  );

  const signedPriority = await signTransactionMessageWithSigners(priorityTx);
  await sendAndConfirm(signedPriority, { commitment: "confirmed" });
  const prioritySig = getSignatureFromTransaction(signedPriority);

  success("Priority fee transaction confirmed");
  keyValue("CU limit set", cuLimit);
  keyValue("Priority fee", `${microLamportsPerCu} micro-lamports/CU`);

  const priorityFeeTotal = (BigInt(cuLimit) * microLamportsPerCu) / 1_000_000n;
  keyValue("Max priority fee cost", `${priorityFeeTotal} lamports`);

  info(
    `Formula: ${cuLimit} CU * ${microLamportsPerCu} micro-lamports / 1,000,000 = ${priorityFeeTotal} lamports`,
  );

  // ── Step 5: Compare all transactions ─────────────────────────────────

  step(5, "Compare: default vs. explicit CU vs. priority fees");

  const priorityTxResult = await rpc
    .getTransaction(prioritySig, {
      maxSupportedTransactionVersion: 0,
      commitment: "confirmed",
      encoding: "json",
    })
    .send();

  const priorityCuUsed = priorityTxResult?.meta?.logMessages
    ? extractCuFromLogs(priorityTxResult.meta.logMessages)
    : null;

  console.log("");
  console.log(
    "  ┌─────────────────────┬────────────┬────────────┬──────────────┐",
  );
  console.log(
    "  │ Transaction         │ CU Used    │ CU Limit   │ Priority Fee │",
  );
  console.log(
    "  ├─────────────────────┼────────────┼────────────┼──────────────┤",
  );
  console.log(
    `  │ Default             │ ${String(defaultCuUsed ?? "?").padEnd(10)} │ ${String(defaultCuLimit ?? "?").padEnd(10)} │ 0            │`,
  );
  console.log(
    `  │ Explicit limit      │ ${String(explicitCuUsed ?? "?").padEnd(10)} │ ${String(explicitCuLimit ?? "?").padEnd(10)} │ 0            │`,
  );
  console.log(
    `  │ Priority fees       │ ${String(priorityCuUsed ?? "?").padEnd(10)} │ ${String(cuLimit).padEnd(10)} │ ${String(microLamportsPerCu).padEnd(12)} │`,
  );
  console.log(
    "  └─────────────────────┴────────────┴────────────┴──────────────┘",
  );
  console.log("");

  const { value: payerFinal } = await rpc.getBalance(payer.address).send();
  keyValue("Payer remaining balance", formatSol(payerFinal));

  info(
    "The base fee (5000 lamports) is always charged regardless of priority fee.",
  );
  info("Priority fees are additional and proportional to your CU limit.");

  // ── Recap ────────────────────────────────────────────────────────────

  divider();
  info("Key takeaways:");
  info("  - Default CU limit is 200,000 per instruction (often wasteful)");
  info(
    "  - Always simulate first, then set a tight CU limit with a small buffer",
  );
  info("  - setComputeUnitLimit sets the max CU for the entire transaction");
  info(
    "  - setComputeUnitPrice sets the priority fee in micro-lamports per CU",
  );
  info(
    "  - Validators prioritize transactions by fee-per-CU (like gas price bidding)",
  );
  info("  - Priority fees = CU_limit * micro_lamports_per_CU / 1,000,000");
  info(
    "  - Tight CU limits + appropriate priority fees = cost-efficient fast txs",
  );
  info(
    "  - On mainnet, use getRecentPrioritizationFees RPC to gauge current market rates",
  );

  success("Lesson 09 complete!");
}

main().catch(console.error);
