/**
 * Lesson 04 - Create a Token (Manual)
 *
 * Core concept: Creating a token on Solana requires two separate instructions
 * bundled in one atomic transaction:
 *   1. Create a new account (allocate space, pay rent, assign to Token Program)
 *   2. Initialize that account as a mint (set decimals, authorities)
 *
 * This lesson builds every instruction by hand so you understand what the
 * high-level helpers abstract away.
 */

import {
  pipe,
  createTransactionMessage,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  appendTransactionMessageInstructions,
  signTransactionMessageWithSigners,
  unwrapOption,
} from "@solana/kit";
import { getCreateAccountInstruction } from "@solana-program/system";
import {
  getInitializeMintInstruction,
  getMintSize,
  TOKEN_PROGRAM_ADDRESS,
  fetchMint,
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
  banner("Lesson 04: Create a Token (Manual)");

  const client = createClient();
  const { rpc, sendAndConfirm } = client;

  info("We will create a brand-new SPL token mint from scratch.");
  info("This requires two instructions in a single atomic transaction.");

  // ── Step 1: Calculate mint account size and rent ─────────────────────

  step(1, "Calculate mint account size and rent exemption");

  info("Every account on Solana must hold enough lamports to be rent-exempt.");
  info("The Token Program defines a fixed size for mint accounts.");

  const mintSize = getMintSize();
  const mintRent = await rpc
    .getMinimumBalanceForRentExemption(BigInt(mintSize))
    .send();

  keyValue("Mint account size", `${mintSize} bytes`);
  keyValue("Rent-exempt minimum", `${mintRent} lamports`);

  info(
    "Rent exemption means the account stays alive forever without paying rent.",
  );

  // ── Step 2: Build the CreateAccount instruction ──────────────────────

  step(2, "Build CreateAccount instruction");

  info("This instruction does three things:");
  info("  1. Allocates space on-chain for the mint data");
  info("  2. Transfers lamports from payer to cover rent");
  info("  3. Assigns ownership of the new account to the Token Program");

  const walletSigner = await createFundedKeypair(client);
  const mintKeypair = await generateKeyPairSigner();

  const createAccountIx = getCreateAccountInstruction({
    payer: walletSigner,
    newAccount: mintKeypair,
    space: mintSize,
    lamports: mintRent,
    programAddress: TOKEN_PROGRAM_ADDRESS,
  });

  success("CreateAccount instruction built");
  keyValue("Payer", formatAddress(walletSigner.address));
  keyValue("New mint address", formatAddress(mintKeypair.address));
  keyValue(
    "Owner program",
    "Token Program (TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA)",
  );

  // ── Step 3: Build the InitializeMint instruction ─────────────────────

  step(3, "Build InitializeMint instruction");

  info("This instruction configures the account as a mint:");
  info("  - decimals: how many decimal places the token has (9 = like SOL)");
  info("  - mintAuthority: who can create new tokens");
  info("  - freezeAuthority: who can freeze token accounts (optional)");

  const DECIMALS = 9;

  const initMintIx = getInitializeMintInstruction({
    mint: mintKeypair.address,
    decimals: DECIMALS,
    mintAuthority: walletSigner.address,
    freezeAuthority: walletSigner.address,
  });

  success("InitializeMint instruction built");
  keyValue("Decimals", DECIMALS);
  keyValue("Mint authority", formatAddress(walletSigner.address));
  keyValue("Freeze authority", formatAddress(walletSigner.address));

  info(
    "With 9 decimals, 1 token = 1_000_000_000 base units (same as SOL/lamports).",
  );

  // ── Step 4: Combine both instructions in a single atomic transaction ─

  step(4, "Combine instructions into one atomic transaction");

  info(
    "Both instructions must succeed together. If either fails, the whole tx reverts.",
  );
  info(
    "Order matters: CreateAccount must come first (mint must exist before initialization).",
  );

  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

  const transactionMessage = pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayerSigner(walletSigner, m),
    (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
    (m) =>
      appendTransactionMessageInstructions([createAccountIx, initMintIx], m),
  );

  success("Transaction message built with 2 instructions");
  keyValue("Transaction version", 0);
  keyValue("Instructions", "1) CreateAccount  2) InitializeMint");

  // ── Step 5: Sign, send, and confirm ──────────────────────────────────

  step(5, "Sign, send, and confirm the transaction");

  info(
    "Two signers are required: the payer (pays rent + fees) and the mint keypair (new account).",
  );

  const signedTransaction =
    await signTransactionMessageWithSigners(transactionMessage);

  await sendAndConfirm(signedTransaction, { commitment: "confirmed" });

  success("Transaction confirmed on-chain!");
  keyValue("Mint address", mintKeypair.address);

  // ── Step 6: Fetch and display the mint account ───────────────────────

  step(6, "Fetch the mint account and inspect its fields");

  const mintAccount = await fetchMint(rpc, mintKeypair.address);

  divider();
  info("Mint account fields:");
  keyValue("Address", mintKeypair.address);
  keyValue("Decimals", mintAccount.data.decimals);
  keyValue("Supply", `${mintAccount.data.supply} base units`);

  const mintAuthority = unwrapOption(mintAccount.data.mintAuthority);
  keyValue(
    "Mint authority",
    mintAuthority ? formatAddress(mintAuthority) : "None (fixed supply)",
  );

  const freezeAuthority = unwrapOption(mintAccount.data.freezeAuthority);
  keyValue(
    "Freeze authority",
    freezeAuthority ? formatAddress(freezeAuthority) : "None (cannot freeze)",
  );

  divider();
  info("What each field means:");
  info("  - Decimals: token precision. 9 means 1 token = 10^9 smallest units");
  info("  - Supply: total tokens minted so far (starts at 0)");
  info("  - Mint authority: can mint new tokens. Set to None for fixed supply");
  info(
    "  - Freeze authority: can freeze/thaw token accounts. Optional safety feature",
  );

  divider();
  info("Key takeaways:");
  info("  - A token mint is just a special account owned by the Token Program");
  info("  - Creating it requires 2 instructions: allocate space + initialize");
  info("  - The payer covers rent exemption so the mint lives forever");
  info("  - Authorities control who can mint and freeze");
  info("  - Supply starts at 0 - minting happens in a separate instruction");

  success("Lesson 04 complete!");
}

main().catch(console.error);
