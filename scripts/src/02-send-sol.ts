/**
 * Lesson 02 - Send SOL
 *
 * Core concept: Transactions contain instructions. Instructions tell programs what to do.
 * We build a versioned transaction using the pipe pattern, add a SOL transfer
 * and a memo instruction, sign it, and send it to the network.
 */

import {
  pipe,
  createTransactionMessage,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  appendTransactionMessageInstructions,
  signTransactionMessageWithSigners,
  getSignatureFromTransaction,
} from "@solana/kit";
import { getTransferSolInstruction } from "@solana-program/system";
import { getAddMemoInstruction } from "@solana-program/memo";

import {
  createClient,
  generateKeyPairSigner,
  createFundedKeypair,
  lamports,
} from "./helpers/config.js";
import {
  banner,
  step,
  success,
  info,
  keyValue,
  formatSol,
  formatAddress,
  divider,
} from "./helpers/display.js";

export async function main(): Promise<void> {
  banner("Lesson 02: Send SOL");

  const client = createClient();
  const { rpc, sendAndConfirm } = client;

  // ── Step 1: Create sender and recipient ────────────────────────────────

  step(1, "Create sender (funded) and recipient keypairs");

  const sender = await createFundedKeypair(client, 2);
  const recipient = await generateKeyPairSigner();

  success("Sender created and funded with 2 SOL");
  keyValue("Sender", formatAddress(sender.address.toString()));

  success("Recipient created (unfunded)");
  keyValue("Recipient", formatAddress(recipient.address.toString()));

  // ── Step 2: Check balances before ──────────────────────────────────────

  step(2, "Check balances before transfer");

  const { value: senderBefore } = await rpc.getBalance(sender.address).send();
  const { value: recipientBefore } = await rpc
    .getBalance(recipient.address)
    .send();

  keyValue("Sender balance", formatSol(senderBefore));
  keyValue("Recipient balance", formatSol(recipientBefore));

  // ── Step 3: Build the transaction ──────────────────────────────────────

  step(3, "Build a versioned transaction with pipe()");

  info("A transaction is a bundle of instructions sent atomically.");
  info("We are adding two instructions:");
  info("  1. Transfer 0.5 SOL (System Program)");
  info("  2. Add a memo message (Memo Program)");

  const transferAmount = lamports(500_000_000n); // 0.5 SOL

  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

  const transactionMessage = pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayerSigner(sender, m),
    (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
    (m) =>
      appendTransactionMessageInstructions(
        [
          getTransferSolInstruction({
            source: sender,
            destination: recipient.address,
            amount: transferAmount,
          }),
          getAddMemoInstruction({
            memo: "Hello from Solana bootcamp! This memo is stored on-chain.",
          }),
        ],
        m,
      ),
  );

  success("Transaction message built with 2 instructions");
  info(
    "pipe() chains builder functions: create -> feePayer -> blockhash -> instructions",
  );

  // ── Step 4: Sign and send ──────────────────────────────────────────────

  step(4, "Sign and send the transaction");

  info("The sender signs with their private key to authorize the transfer.");

  const signedTransaction =
    await signTransactionMessageWithSigners(transactionMessage);

  await sendAndConfirm(signedTransaction, { commitment: "confirmed" });

  const signature = getSignatureFromTransaction(signedTransaction);

  success("Transaction confirmed!");
  keyValue("Signature", signature);

  // ── Step 5: Check balances after ───────────────────────────────────────

  step(5, "Check balances after transfer");

  const { value: senderAfter } = await rpc.getBalance(sender.address).send();
  const { value: recipientAfter } = await rpc
    .getBalance(recipient.address)
    .send();

  keyValue("Sender balance", formatSol(senderAfter));
  keyValue("Recipient balance", formatSol(recipientAfter));

  const fee = (senderBefore as bigint) - (senderAfter as bigint) - 500_000_000n;
  info(`Transaction fee: ${fee} lamports`);
  info("The sender paid both the 0.5 SOL transfer AND the transaction fee.");

  // ── Recap ──────────────────────────────────────────────────────────────

  divider();
  info("Key takeaways:");
  info("  - Transactions bundle one or more instructions");
  info("  - Each instruction targets a specific program (System, Memo, etc.)");
  info("  - pipe() builds the transaction message step by step");
  info("  - The fee payer signs and pays the network fee");
  info("  - Memos are on-chain messages stored in the transaction log");
  info("  - Transactions need a recent blockhash for replay protection");

  success("Lesson 02 complete!");
}

main().catch(console.error);
