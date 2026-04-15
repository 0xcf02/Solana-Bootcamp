/**
 * Lesson 06 - Tokens and Transfers
 *
 * Core concept: Tokens do NOT live in wallets. Each wallet needs a separate
 * Associated Token Account (ATA) per token mint. The ATA address is a PDA
 * derived deterministically from (wallet address + mint address).
 *
 * This lesson walks through the full flow:
 *   Wallet A creates a mint -> creates an ATA -> mints tokens -> transfers to Wallet B
 */

import {
  pipe,
  createTransactionMessage,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  appendTransactionMessageInstructions,
  signTransactionMessageWithSigners,
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
import {
  banner,
  step,
  success,
  info,
  keyValue,
  formatAddress,
  divider,
} from "./helpers/display.js";

export async function main(): Promise<void> {
  banner("Lesson 06: Tokens and Transfers");

  const client = createClient();
  const { rpc, sendAndConfirm } = client;

  info("Tokens on Solana do NOT live inside your wallet account.");
  info("Each token you hold lives in a separate Token Account (ATA).");
  info("This lesson makes that concrete.");

  // ── Step 1: Create a token mint ──────────────────────────────────────

  step(1, "Create a new token mint");

  const walletA = await createFundedKeypair(client);
  const mintKeypair = await generateKeyPairSigner();

  info(`Wallet A: ${formatAddress(walletA.address)}`);
  info(`Mint:     ${formatAddress(mintKeypair.address)}`);

  const mintSize = getMintSize();
  const mintRent = await rpc
    .getMinimumBalanceForRentExemption(BigInt(mintSize))
    .send();

  const DECIMALS = 9;

  const createAccountIx = getCreateAccountInstruction({
    payer: walletA,
    newAccount: mintKeypair,
    space: mintSize,
    lamports: mintRent,
    programAddress: TOKEN_PROGRAM_ADDRESS,
  });

  const initMintIx = getInitializeMintInstruction({
    mint: mintKeypair.address,
    decimals: DECIMALS,
    mintAuthority: walletA.address,
    freezeAuthority: walletA.address,
  });

  const { value: blockhash1 } = await rpc.getLatestBlockhash().send();
  const mintTx = pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayerSigner(walletA, m),
    (m) => setTransactionMessageLifetimeUsingBlockhash(blockhash1, m),
    (m) =>
      appendTransactionMessageInstructions([createAccountIx, initMintIx], m),
  );
  const signedMintTx = await signTransactionMessageWithSigners(mintTx);
  await sendAndConfirm(signedMintTx, { commitment: "confirmed" });

  success("Token mint created");
  keyValue("Mint address", mintKeypair.address);
  keyValue("Decimals", DECIMALS);

  // ── Step 2: Create ATA for Wallet A ──────────────────────────────────

  step(2, "Create an Associated Token Account (ATA) for Wallet A");

  info("An ATA is a PDA derived from two inputs:");
  info("  1. The wallet address (owner)");
  info("  2. The token mint address");
  info("This means the ATA address is deterministic and predictable.");

  const [ataA] = await findAssociatedTokenPda({
    mint: mintKeypair.address,
    owner: walletA.address,
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
  });

  info(
    `PDA derivation: findAssociatedTokenPda(mint, walletA) => ${formatAddress(ataA)}`,
  );

  const createAtaAIx = getCreateAssociatedTokenIdempotentInstruction({
    payer: walletA,
    owner: walletA.address,
    mint: mintKeypair.address,
    ata: ataA,
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
  });

  const { value: blockhash2 } = await rpc.getLatestBlockhash().send();
  const ataATx = pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayerSigner(walletA, m),
    (m) => setTransactionMessageLifetimeUsingBlockhash(blockhash2, m),
    (m) => appendTransactionMessageInstructions([createAtaAIx], m),
  );
  const signedAtaA = await signTransactionMessageWithSigners(ataATx);
  await sendAndConfirm(signedAtaA, { commitment: "confirmed" });

  success("ATA for Wallet A created");
  keyValue("ATA address", formatAddress(ataA));
  keyValue("Owner", formatAddress(walletA.address));
  keyValue("Mint", formatAddress(mintKeypair.address));

  // ── Step 3: Mint 100 tokens to Wallet A's ATA ───────────────────────

  step(3, "Mint 100 tokens to Wallet A");

  const MINT_AMOUNT = 100_000_000_000n; // 100 tokens * 10^9 decimals

  info(`Amount: 100 tokens = ${MINT_AMOUNT} base units (with 9 decimals)`);
  info("Only the mint authority can call MintTo.");

  const mintToIx = getMintToInstruction({
    mint: mintKeypair.address,
    token: ataA,
    mintAuthority: walletA,
    amount: MINT_AMOUNT,
  });

  const { value: blockhash3 } = await rpc.getLatestBlockhash().send();
  const mintToTx = pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayerSigner(walletA, m),
    (m) => setTransactionMessageLifetimeUsingBlockhash(blockhash3, m),
    (m) => appendTransactionMessageInstructions([mintToIx], m),
  );
  const signedMintTo = await signTransactionMessageWithSigners(mintToTx);
  await sendAndConfirm(signedMintTo, { commitment: "confirmed" });

  success("100 tokens minted to Wallet A");

  // ── Step 4: Show Wallet A's token balance ────────────────────────────

  step(4, "Show Wallet A token balance");

  const tokenAccountA = await fetchToken(rpc, ataA);

  keyValue("Wallet A ATA", formatAddress(ataA));
  keyValue("Balance", `${tokenAccountA.data.amount} base units`);
  keyValue("Human-readable", "100 tokens");

  info("Notice: the balance lives in the ATA, not in Wallet A itself.");
  info(
    "Wallet A (SOL account) and ATA-A (token account) are different accounts.",
  );

  // ── Step 5: Create Wallet B and its ATA ──────────────────────────────

  step(5, "Create Wallet B and its ATA for the same mint");

  const walletB = await createFundedKeypair(client);

  info(`Wallet B: ${formatAddress(walletB.address)}`);
  info("Wallet B needs its OWN ATA for this mint to receive tokens.");

  const [ataB] = await findAssociatedTokenPda({
    mint: mintKeypair.address,
    owner: walletB.address,
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
  });

  info(
    `PDA derivation: findAssociatedTokenPda(mint, walletB) => ${formatAddress(ataB)}`,
  );
  info("Different wallet -> different ATA address (same mint).");

  const createAtaBIx = getCreateAssociatedTokenIdempotentInstruction({
    payer: walletA,
    owner: walletB.address,
    mint: mintKeypair.address,
    ata: ataB,
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
  });

  const { value: blockhash4 } = await rpc.getLatestBlockhash().send();
  const ataBTx = pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayerSigner(walletA, m),
    (m) => setTransactionMessageLifetimeUsingBlockhash(blockhash4, m),
    (m) => appendTransactionMessageInstructions([createAtaBIx], m),
  );
  const signedAtaB = await signTransactionMessageWithSigners(ataBTx);
  await sendAndConfirm(signedAtaB, { commitment: "confirmed" });

  success("ATA for Wallet B created");
  keyValue("ATA address", formatAddress(ataB));
  keyValue("Owner", formatAddress(walletB.address));

  // ── Step 6: Transfer 25 tokens from Wallet A to Wallet B ─────────────

  step(6, "Transfer 25 tokens from Wallet A to Wallet B");

  const TRANSFER_AMOUNT = 25_000_000_000n; // 25 tokens

  info(`Transferring ${TRANSFER_AMOUNT} base units = 25 tokens`);
  info("Transfer goes from ATA-A to ATA-B. Wallet A must sign as authority.");

  const transferIx = getTransferInstruction({
    source: ataA,
    destination: ataB,
    authority: walletA,
    amount: TRANSFER_AMOUNT,
  });

  const { value: blockhash5 } = await rpc.getLatestBlockhash().send();
  const transferTx = pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayerSigner(walletA, m),
    (m) => setTransactionMessageLifetimeUsingBlockhash(blockhash5, m),
    (m) => appendTransactionMessageInstructions([transferIx], m),
  );
  const signedTransfer = await signTransactionMessageWithSigners(transferTx);
  await sendAndConfirm(signedTransfer, { commitment: "confirmed" });

  success("Transfer complete!");

  // ── Step 7: Show both balances ───────────────────────────────────────

  step(7, "Show final token balances for both wallets");

  const finalAccountA = await fetchToken(rpc, ataA);
  const finalAccountB = await fetchToken(rpc, ataB);

  divider();
  info("Wallet A:");
  keyValue("  Wallet address", formatAddress(walletA.address));
  keyValue("  ATA address", formatAddress(ataA));
  keyValue(
    "  Token balance",
    `${finalAccountA.data.amount} base units (75 tokens)`,
  );

  info("Wallet B:");
  keyValue("  Wallet address", formatAddress(walletB.address));
  keyValue("  ATA address", formatAddress(ataB));
  keyValue(
    "  Token balance",
    `${finalAccountB.data.amount} base units (25 tokens)`,
  );

  const mintAfter = await fetchMint(rpc, mintKeypair.address);
  info("Mint:");
  keyValue(
    "  Total supply",
    `${mintAfter.data.supply} base units (100 tokens)`,
  );
  divider();

  info("The account model visualized:");
  info("");
  info("  Wallet A (SOL)  ---owns--->  ATA-A (75 tokens)");
  info("        |                            |");
  info("        |                      [mint address]");
  info("        |                            |");
  info("  Wallet B (SOL)  ---owns--->  ATA-B (25 tokens)");
  info("");
  info("Each wallet has a SEPARATE token account per mint.");
  info('Tokens never "live" inside the wallet -- they live in ATAs.');

  divider();
  info("Key takeaways:");
  info("  - ATA = deterministic PDA from (wallet + mint + Token Program)");
  info("  - Each wallet needs its own ATA for each token it wants to hold");
  info("  - Transfers move tokens between ATAs, not between wallets");
  info("  - The wallet address is the authority (signer) for its ATA");
  info(
    "  - Total supply on the mint always equals the sum of all token accounts",
  );

  success("Lesson 06 complete!");
}

main().catch(console.error);
