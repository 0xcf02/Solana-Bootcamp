/**
 * Lesson 03 - Atomic Transactions
 *
 * Core concept: If ANY instruction in a transaction fails, ALL instructions revert.
 * This is atomicity -- all-or-nothing execution.
 *
 * We demonstrate this with three scenarios:
 *   A) Happy path: 2 transfers in 1 tx, both succeed
 *   B) Atomic rollback: 2 transfers exceed balance, entire tx reverts
 *   C) Separate txs: same amounts but sent individually, first succeeds, second fails
 */

import {
  pipe,
  createTransactionMessage,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  appendTransactionMessageInstructions,
  signTransactionMessageWithSigners,
  getSignatureFromTransaction,
  type IInstruction,
} from "@solana/kit";
import { getTransferSolInstruction } from "@solana-program/system";

import {
  createClient,
  generateKeyPairSigner,
  createFundedKeypair,
  lamports,
  type Client,
} from "./helpers/config.js";
import {
  banner,
  step,
  success,
  fail,
  info,
  keyValue,
  formatSol,
  formatAddress,
  divider,
} from "./helpers/display.js";
import type { KeyPairSigner } from "@solana/kit";

async function getBalance(
  client: Client,
  address: KeyPairSigner["address"],
): Promise<bigint> {
  const { value } = await client.rpc.getBalance(address).send();
  return value;
}

async function buildSignSend(
  client: Client,
  payer: KeyPairSigner,
  instructions: IInstruction[],
): Promise<string> {
  const { value: latestBlockhash } = await client.rpc
    .getLatestBlockhash()
    .send();

  const transactionMessage = pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayerSigner(payer, m),
    (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
    (m) => appendTransactionMessageInstructions(instructions, m),
  );

  const signed = await signTransactionMessageWithSigners(transactionMessage);
  await client.sendAndConfirm(signed, { commitment: "confirmed" });
  return getSignatureFromTransaction(signed);
}

function showBalances(
  label: string,
  senderBal: bigint,
  aBal: bigint,
  bBal: bigint,
): void {
  info(label);
  keyValue("  Sender", formatSol(senderBal));
  keyValue("  Recipient A", formatSol(aBal));
  keyValue("  Recipient B", formatSol(bBal));
}

export async function main(): Promise<void> {
  banner("Lesson 03: Atomic Transactions");

  const client = createClient();

  info("Atomicity means: if ANY instruction in a transaction fails,");
  info("ALL instructions revert. Nothing changes. All or nothing.");

  // ── Setup: create accounts ─────────────────────────────────────────────

  step(1, "Setup: create sender (funded with 2 SOL) and two recipients");

  const sender = await createFundedKeypair(client, 2);
  const recipientA = await generateKeyPairSigner();
  const recipientB = await generateKeyPairSigner();

  keyValue("Sender", formatAddress(sender.address.toString()));
  keyValue("Recipient A", formatAddress(recipientA.address.toString()));
  keyValue("Recipient B", formatAddress(recipientB.address.toString()));

  const senderInitial = await getBalance(client, sender.address);
  showBalances(
    "Initial balances:",
    senderInitial,
    await getBalance(client, recipientA.address),
    await getBalance(client, recipientB.address),
  );

  // ══════════════════════════════════════════════════════════════════════
  //  Scenario A: Happy Path -- both transfers succeed in one tx
  // ══════════════════════════════════════════════════════════════════════

  divider();
  step(2, "Scenario A: Happy path -- 2 transfers in 1 atomic transaction");

  info("Sending 0.1 SOL to A and 0.1 SOL to B in a single transaction.");

  const sig = await buildSignSend(client, sender, [
    getTransferSolInstruction({
      source: sender,
      destination: recipientA.address,
      amount: lamports(100_000_000n),
    }),
    getTransferSolInstruction({
      source: sender,
      destination: recipientB.address,
      amount: lamports(100_000_000n),
    }),
  ]);

  success(`Transaction confirmed: ${sig.slice(0, 20)}...`);

  const senderAfterA = await getBalance(client, sender.address);
  const recipAAfterA = await getBalance(client, recipientA.address);
  const recipBAfterA = await getBalance(client, recipientB.address);

  showBalances(
    "Balances after Scenario A:",
    senderAfterA,
    recipAAfterA,
    recipBAfterA,
  );
  success(
    "Both recipients received 0.1 SOL. The transaction was atomic -- both-or-neither.",
  );

  // ══════════════════════════════════════════════════════════════════════
  //  Scenario B: Atomic Rollback -- tx exceeds balance, ALL reverts
  // ══════════════════════════════════════════════════════════════════════

  divider();
  step(
    3,
    "Scenario B: Atomic rollback -- total exceeds balance, ENTIRE tx fails",
  );

  const senderBeforeB = await getBalance(client, sender.address);
  const recipABeforeB = await getBalance(client, recipientA.address);
  const recipBBeforeB = await getBalance(client, recipientB.address);

  info(`Sender has ${formatSol(senderBeforeB)}.`);
  info(
    "Attempting: 0.3 SOL to A + 0.3 SOL to B = 0.6 SOL total in ONE transaction.",
  );
  info("If sender cannot cover both, the ENTIRE transaction reverts.");

  // Drain sender to ~0.5 SOL to set up the failure condition
  const drainAmount = senderBeforeB - 500_000_000n - 5_000n; // leave ~0.5 SOL + small fee buffer
  if (drainAmount > 0n) {
    await buildSignSend(client, sender, [
      getTransferSolInstruction({
        source: sender,
        destination: recipientA.address,
        amount: lamports(drainAmount),
      }),
    ]);
    // Reset recipientA balance tracking
  }

  // Fund recipientA back to isolate the scenario (drain went to A, send it back)
  // Actually, let's just re-check balances after drain
  const senderPreB = await getBalance(client, sender.address);
  const recipAPreB = await getBalance(client, recipientA.address);
  const recipBPreB = await getBalance(client, recipientB.address);

  info(`Sender now has ${formatSol(senderPreB)} (drained to set up scenario).`);

  let scenarioBFailed = false;
  try {
    await buildSignSend(client, sender, [
      getTransferSolInstruction({
        source: sender,
        destination: recipientA.address,
        amount: lamports(300_000_000n),
      }),
      getTransferSolInstruction({
        source: sender,
        destination: recipientB.address,
        amount: lamports(300_000_000n),
      }),
    ]);
  } catch (error) {
    scenarioBFailed = true;
    fail(
      "Transaction FAILED (expected!) -- insufficient funds for both transfers.",
    );
    info(
      "Because this was ONE atomic transaction, NEITHER transfer went through.",
    );
  }

  if (!scenarioBFailed) {
    fail("Expected transaction to fail but it succeeded. Adjust drain amount.");
  }

  const senderAfterB = await getBalance(client, sender.address);
  const recipAAfterB = await getBalance(client, recipientA.address);
  const recipBAfterB = await getBalance(client, recipientB.address);

  showBalances(
    "Balances after Scenario B (should be UNCHANGED):",
    senderAfterB,
    recipAAfterB,
    recipBAfterB,
  );

  if (
    senderAfterB === senderPreB &&
    recipAAfterB === recipAPreB &&
    recipBAfterB === recipBPreB
  ) {
    success("Confirmed: ALL balances unchanged. Atomicity preserved!");
  } else {
    fail("Unexpected balance change detected.");
  }

  // ══════════════════════════════════════════════════════════════════════
  //  Scenario C: Separate Txs -- first succeeds, second fails
  // ══════════════════════════════════════════════════════════════════════

  divider();
  step(4, "Scenario C: Same amounts, but SEPARATE transactions");

  info(`Sender has ${formatSol(senderAfterB)}.`);
  info("Tx 1: Transfer 0.3 SOL to A (separate transaction)");
  info("Tx 2: Transfer 0.3 SOL to B (separate transaction)");
  info(
    "Unlike Scenario B, these are independent -- one can succeed while the other fails.",
  );

  const senderPreC = await getBalance(client, sender.address);
  const recipAPreC = await getBalance(client, recipientA.address);
  const recipBPreC = await getBalance(client, recipientB.address);

  // Transaction 1: should succeed
  let tx1Succeeded = false;
  try {
    await buildSignSend(client, sender, [
      getTransferSolInstruction({
        source: sender,
        destination: recipientA.address,
        amount: lamports(300_000_000n),
      }),
    ]);
    tx1Succeeded = true;
    success("Tx 1 SUCCEEDED: 0.3 SOL sent to Recipient A");
  } catch {
    fail("Tx 1 failed unexpectedly.");
  }

  // Transaction 2: should fail (not enough remaining)
  let tx2Succeeded = false;
  try {
    await buildSignSend(client, sender, [
      getTransferSolInstruction({
        source: sender,
        destination: recipientB.address,
        amount: lamports(300_000_000n),
      }),
    ]);
    tx2Succeeded = true;
    info("Tx 2 succeeded (sender had enough funds).");
  } catch {
    fail("Tx 2 FAILED: insufficient funds for second transfer.");
  }

  const senderAfterC = await getBalance(client, sender.address);
  const recipAAfterC = await getBalance(client, recipientA.address);
  const recipBAfterC = await getBalance(client, recipientB.address);

  showBalances(
    "Balances after Scenario C:",
    senderAfterC,
    recipAAfterC,
    recipBAfterC,
  );

  if (tx1Succeeded && !tx2Succeeded) {
    success("Tx 1 persisted but Tx 2 did not. Partial execution!");
  }

  // ══════════════════════════════════════════════════════════════════════
  //  Comparison
  // ══════════════════════════════════════════════════════════════════════

  divider();
  step(5, "Comparison: Atomic vs Separate");

  info("Scenario B (atomic):");
  info("  - 0.3 + 0.3 in ONE tx, total > balance");
  info("  - Result: BOTH failed. No balances changed.");

  info("Scenario C (separate):");
  info("  - 0.3 then 0.3 in TWO txs");
  info("  - Result: First succeeded, second failed. Partial state change!");

  divider();
  info("This is why atomicity matters:");
  info(
    "  - DeFi swaps: token A leaves AND token B arrives, or neither happens",
  );
  info(
    "  - NFT purchases: payment AND transfer happen together, or not at all",
  );
  info(
    "  - Multi-step operations: bundle related instructions in one transaction",
  );
  info("  - Separate txs risk partial execution and inconsistent state");

  success("Lesson 03 complete!");
}

main().catch(console.error);
