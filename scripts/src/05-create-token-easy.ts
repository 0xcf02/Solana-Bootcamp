/**
 * Lesson 05 - Create a Token (Easy) + Full Token Lifecycle
 *
 * Core concept: The manual steps from Lesson 04 can be wrapped in a helper.
 * Then we go further: create associated token accounts, mint tokens, and
 * transfer them -- the full lifecycle of a token.
 *
 * Lesson 04 was ~40 lines of instruction building. The helper below is 1 call.
 */

import {
  pipe,
  createTransactionMessage,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  appendTransactionMessageInstructions,
  signTransactionMessageWithSigners,
  unwrapOption,
  type KeyPairSigner,
  type Address,
} from "@solana/kit";
import { getCreateAccountInstruction } from "@solana-program/system";
import {
  getInitializeMintInstruction,
  getMintSize,
  TOKEN_PROGRAM_ADDRESS,
  fetchMint,
  findAssociatedTokenPda,
  getCreateAssociatedTokenIdempotentInstruction,
  getMintToInstruction,
  getTransferInstruction,
  fetchToken,
} from "@solana-program/token";
import {
  createClient,
  createFundedKeypair,
  generateKeyPairSigner,
} from "./helpers/config.js";
import type { Client } from "./helpers/config.js";
import {
  banner,
  step,
  success,
  info,
  keyValue,
  formatAddress,
  divider,
} from "./helpers/display.js";

// ── Helper: createMintEasy ─────────────────────────────────────────────
// Wraps the 6-step process from Lesson 04 into a single function call.

async function createMintEasy(
  client: Client,
  payer: KeyPairSigner,
  decimals: number,
  mintAuthority: Address,
  freezeAuthority: Address | null = null,
): Promise<KeyPairSigner> {
  const { rpc, sendAndConfirm } = client;

  const mintKeypair = await generateKeyPairSigner();
  const mintSize = getMintSize();
  const mintRent = await rpc
    .getMinimumBalanceForRentExemption(BigInt(mintSize))
    .send();

  const createAccountIx = getCreateAccountInstruction({
    payer,
    newAccount: mintKeypair,
    space: mintSize,
    lamports: mintRent,
    programAddress: TOKEN_PROGRAM_ADDRESS,
  });

  const initMintIx = getInitializeMintInstruction({
    mint: mintKeypair.address,
    decimals,
    mintAuthority,
    freezeAuthority: freezeAuthority ?? mintAuthority,
  });

  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

  const tx = pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayerSigner(payer, m),
    (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
    (m) =>
      appendTransactionMessageInstructions([createAccountIx, initMintIx], m),
  );

  const signed = await signTransactionMessageWithSigners(tx);
  await sendAndConfirm(signed, { commitment: "confirmed" });

  return mintKeypair;
}

export async function main(): Promise<void> {
  banner("Lesson 05: Create a Token (Easy) + Full Lifecycle");

  const client = createClient();
  const { rpc, sendAndConfirm } = client;

  // ── Step 1: Create a mint with one helper call ───────────────────────

  step(1, "Create a mint with createMintEasy()");

  info("Lesson 04 needed ~40 lines to build 2 instructions, sign, and send.");
  info("Now we wrap all of that into one function call:");

  const walletSigner = await createFundedKeypair(client);
  const mintKeypair = await createMintEasy(
    client,
    walletSigner,
    9,
    walletSigner.address,
  );

  success("Mint created in a single call!");
  keyValue("Mint address", mintKeypair.address);

  const mintAccount = await fetchMint(rpc, mintKeypair.address);
  keyValue("Decimals", mintAccount.data.decimals);
  keyValue("Supply", `${mintAccount.data.supply} base units (0 tokens)`);

  divider();
  info("Side-by-side comparison:");
  info(
    "  Manual (Lesson 04): getMintSize -> getMinimumBalanceForRentExemption",
  );
  info(
    "                      -> getCreateAccountInstruction -> getInitializeMintInstruction",
  );
  info("                      -> pipe -> sign -> send -> confirm");
  info("  Easy   (this file): createMintEasy(client, payer, 9, authority)");
  divider();

  // ── Step 2: Create an Associated Token Account ───────────────────────

  step(2, "Create an Associated Token Account (ATA) for the wallet");

  info("Tokens do not live in your wallet. They live in a Token Account.");
  info("An ATA is a deterministic Token Account derived from (wallet + mint).");

  const [ata] = await findAssociatedTokenPda({
    mint: mintKeypair.address,
    owner: walletSigner.address,
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
  });

  const createAtaIx = getCreateAssociatedTokenIdempotentInstruction({
    payer: walletSigner,
    owner: walletSigner.address,
    mint: mintKeypair.address,
    ata,
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
  });

  const { value: blockhash2 } = await rpc.getLatestBlockhash().send();
  const ataTx = pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayerSigner(walletSigner, m),
    (m) => setTransactionMessageLifetimeUsingBlockhash(blockhash2, m),
    (m) => appendTransactionMessageInstructions([createAtaIx], m),
  );
  const signedAta = await signTransactionMessageWithSigners(ataTx);
  await sendAndConfirm(signedAta, { commitment: "confirmed" });

  success("ATA created");
  keyValue("ATA address", formatAddress(ata));
  keyValue("Owner", formatAddress(walletSigner.address));
  keyValue("Mint", formatAddress(mintKeypair.address));

  info(
    '"Idempotent" means calling it again is safe -- it just succeeds without error.',
  );

  // ── Step 3: Mint 100 tokens ──────────────────────────────────────────

  step(3, "Mint 100 tokens to the ATA");

  const MINT_AMOUNT = 100_000_000_000n; // 100 tokens with 9 decimals

  info(`Minting ${MINT_AMOUNT} base units = 100 tokens (9 decimals)`);

  const mintToIx = getMintToInstruction({
    mint: mintKeypair.address,
    token: ata,
    mintAuthority: walletSigner,
    amount: MINT_AMOUNT,
  });

  const { value: blockhash3 } = await rpc.getLatestBlockhash().send();
  const mintTx = pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayerSigner(walletSigner, m),
    (m) => setTransactionMessageLifetimeUsingBlockhash(blockhash3, m),
    (m) => appendTransactionMessageInstructions([mintToIx], m),
  );
  const signedMint = await signTransactionMessageWithSigners(mintTx);
  await sendAndConfirm(signedMint, { commitment: "confirmed" });

  const tokenAccountAfterMint = await fetchToken(rpc, ata);
  success("Tokens minted!");
  keyValue("Token balance", `${tokenAccountAfterMint.data.amount} base units`);
  keyValue("Human-readable", "100 tokens");

  // ── Step 4: Transfer 25 tokens to a new wallet ───────────────────────

  step(4, "Transfer 25 tokens to a second wallet");

  const recipientSigner = await createFundedKeypair(client);
  info(`Recipient: ${formatAddress(recipientSigner.address)}`);

  // Create recipient ATA
  const [recipientAta] = await findAssociatedTokenPda({
    mint: mintKeypair.address,
    owner: recipientSigner.address,
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
  });

  const createRecipientAtaIx = getCreateAssociatedTokenIdempotentInstruction({
    payer: walletSigner,
    owner: recipientSigner.address,
    mint: mintKeypair.address,
    ata: recipientAta,
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
  });

  const TRANSFER_AMOUNT = 25_000_000_000n; // 25 tokens

  const transferIx = getTransferInstruction({
    source: ata,
    destination: recipientAta,
    authority: walletSigner,
    amount: TRANSFER_AMOUNT,
  });

  info("We can create the ATA and transfer in a single transaction!");

  const { value: blockhash4 } = await rpc.getLatestBlockhash().send();
  const transferTx = pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayerSigner(walletSigner, m),
    (m) => setTransactionMessageLifetimeUsingBlockhash(blockhash4, m),
    (m) =>
      appendTransactionMessageInstructions(
        [createRecipientAtaIx, transferIx],
        m,
      ),
  );
  const signedTransfer = await signTransactionMessageWithSigners(transferTx);
  await sendAndConfirm(signedTransfer, { commitment: "confirmed" });

  success("Transfer complete!");

  // ── Step 5: Show final balances ──────────────────────────────────────

  step(5, "Show final token balances");

  const senderAccount = await fetchToken(rpc, ata);
  const recipientAccount = await fetchToken(rpc, recipientAta);

  divider();
  info("Sender (Wallet A):");
  keyValue("  ATA", formatAddress(ata));
  keyValue("  Balance", `${senderAccount.data.amount} base units (75 tokens)`);

  info("Recipient (Wallet B):");
  keyValue("  ATA", formatAddress(recipientAta));
  keyValue(
    "  Balance",
    `${recipientAccount.data.amount} base units (25 tokens)`,
  );
  divider();

  info("Key takeaways:");
  info("  - High-level helpers wrap the same instructions from Lesson 04");
  info(
    "  - ATAs are deterministic: same (wallet + mint) always gives same address",
  );
  info('  - "Idempotent" creation is safe to call multiple times');
  info(
    "  - Multiple instructions (create ATA + transfer) can be batched in one tx",
  );
  info(
    "  - The full token lifecycle: create mint -> create ATA -> mint -> transfer",
  );

  success("Lesson 05 complete!");
}

main().catch(console.error);
