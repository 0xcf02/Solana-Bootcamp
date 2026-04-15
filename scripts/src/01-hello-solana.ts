/**
 * Lesson 01 - Hello Solana
 *
 * Core concept: Accounts are keypairs. Everything starts with an address.
 * A keypair gives you a public key (your address) and a private key (your signer).
 * Balances are measured in lamports: 1 SOL = 1,000,000,000 lamports.
 */

import {
  createClient,
  generateKeyPairSigner,
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
  banner("Lesson 01: Hello Solana");

  const { rpc, airdrop } = createClient();

  // ── Step 1: Generate two keypairs ──────────────────────────────────────

  step(1, "Generate two keypairs");
  info("A keypair is your identity on Solana. The public key is your address.");

  const keypairA = await generateKeyPairSigner();
  const keypairB = await generateKeyPairSigner();

  success("Generated Keypair A");
  keyValue("Address A", keypairA.address);

  success("Generated Keypair B");
  keyValue("Address B", keypairB.address);

  info("These addresses exist now, but they hold no SOL yet.");

  // ── Step 2: Check initial balances ─────────────────────────────────────

  step(2, "Check initial balances (both should be 0)");

  const { value: balanceA_before } = await rpc
    .getBalance(keypairA.address)
    .send();
  const { value: balanceB_before } = await rpc
    .getBalance(keypairB.address)
    .send();

  keyValue("Balance A", formatSol(balanceA_before));
  keyValue("Balance B", formatSol(balanceB_before));

  info(
    "New accounts start with 0 lamports. They need SOL to do anything on-chain.",
  );

  // ── Step 3: Airdrop 2 SOL to Keypair A ────────────────────────────────

  step(3, "Airdrop 2 SOL to Keypair A");
  info(
    "On devnet/localnet, you can request free SOL from the faucet (airdrop).",
  );

  await airdrop({
    recipientAddress: keypairA.address,
    lamports: lamports(2_000_000_000n),
    commitment: "confirmed",
  });

  success("Airdrop complete: 2 SOL sent to Keypair A");

  // ── Step 4: Check balances again ───────────────────────────────────────

  step(4, "Check balances after airdrop");

  const { value: balanceA_after } = await rpc
    .getBalance(keypairA.address)
    .send();
  const { value: balanceB_after } = await rpc
    .getBalance(keypairB.address)
    .send();

  keyValue("Balance A", formatSol(balanceA_after));
  keyValue("Balance B", formatSol(balanceB_after));

  success("Keypair A now has 2 SOL. Keypair B still has 0.");

  // ── Step 5: Lamports vs SOL ────────────────────────────────────────────

  step(5, "Understanding lamports vs SOL");

  divider();
  info("Solana uses lamports as its smallest unit of currency.");
  info("1 SOL = 1,000,000,000 lamports (1 billion)");
  info("Think of lamports like cents to dollars, but with 9 decimal places.");
  divider();

  keyValue("Balance A (lamports)", balanceA_after.toString());
  keyValue("Balance A (SOL)", formatSol(balanceA_after));
  keyValue("Formatted address A", formatAddress(keypairA.address.toString()));

  divider();
  info("Key takeaways:");
  info("  - A keypair = your identity (address + signing key)");
  info("  - New accounts start with 0 balance");
  info("  - Airdrop gives free SOL on devnet/localnet");
  info("  - 1 SOL = 1,000,000,000 lamports");
  info("  - All on-chain amounts are in lamports (u64 integers)");

  success("Lesson 01 complete!");
}

main().catch(console.error);
