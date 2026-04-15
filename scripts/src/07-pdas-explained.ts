/**
 * Lesson 07 - PDAs Explained
 *
 * Core concept: Program Derived Addresses (PDAs) are deterministic addresses
 * derived from seeds and a program ID. They have no private key, meaning only
 * the owning program can "sign" for them. PDAs are the backbone of on-chain
 * data storage and program-owned accounts in Solana.
 */

import {
  getProgramDerivedAddress,
  getAddressEncoder,
  getUtf8Encoder,
  address,
  generateKeyPairSigner,
} from "@solana/kit";
import {
  findAssociatedTokenPda,
  TOKEN_PROGRAM_ADDRESS,
} from "@solana-program/token";

import {
  banner,
  step,
  success,
  info,
  keyValue,
  divider,
  formatAddress,
} from "./helpers/display.js";

const ASSOCIATED_TOKEN_PROGRAM_ADDRESS = address(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
);

export async function main(): Promise<void> {
  banner("Lesson 07: PDAs Explained");

  info("PDAs are addresses derived from seeds + a program ID.");
  info('They live "off the Ed25519 curve" — no private key exists for them.');
  info("Only the program that owns a PDA can sign transactions for it.");

  // ── Step 1: Derive a simple PDA ──────────────────────────────────────

  step(1, "Derive a simple PDA from seeds");

  const fakeProgramId = address("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");
  const someUser = await generateKeyPairSigner();

  info('Seeds: ["vault", <user_pubkey>]');
  info(`Program: ${formatAddress(fakeProgramId)}`);

  const [vaultPda, vaultBump] = await getProgramDerivedAddress({
    programAddress: fakeProgramId,
    seeds: [
      getUtf8Encoder().encode("vault"),
      getAddressEncoder().encode(someUser.address),
    ],
  });

  success("PDA derived successfully");
  keyValue("PDA address", vaultPda);
  keyValue("Bump seed", vaultBump);

  info(
    `The bump (${vaultBump}) is the value that pushes the address off the curve.`,
  );
  info(
    "Solana tries bump=255 down to 0 until it finds an address that is NOT a valid public key.",
  );

  // ── Step 2: Deterministic proof ──────────────────────────────────────

  step(2, "Derive again with the same seeds — same result (deterministic)");

  const [vaultPda2, vaultBump2] = await getProgramDerivedAddress({
    programAddress: fakeProgramId,
    seeds: [
      getUtf8Encoder().encode("vault"),
      getAddressEncoder().encode(someUser.address),
    ],
  });

  keyValue("PDA (1st derivation)", formatAddress(vaultPda));
  keyValue("PDA (2nd derivation)", formatAddress(vaultPda2));
  keyValue("Bump (1st)", vaultBump);
  keyValue("Bump (2nd)", vaultBump2);

  if (vaultPda === vaultPda2 && vaultBump === vaultBump2) {
    success("Identical! PDAs are fully deterministic given the same inputs.");
  }

  info("This means anyone can re-derive a PDA if they know the seeds.");
  info("No need to store PDA addresses — just re-derive them on the fly.");

  // ── Step 3: Change one seed — completely different address ────────────

  step(3, "Change one seed byte — completely different address");

  const [differentPda, differentBump] = await getProgramDerivedAddress({
    programAddress: fakeProgramId,
    seeds: [
      getUtf8Encoder().encode("vault2"),
      getAddressEncoder().encode(someUser.address),
    ],
  });

  keyValue('Original PDA ("vault")', formatAddress(vaultPda));
  keyValue('Modified PDA ("vault2")', formatAddress(differentPda));
  keyValue("Original bump", vaultBump);
  keyValue("Modified bump", differentBump);

  success(
    "Completely different address! Even a tiny seed change produces a new PDA.",
  );
  info(
    "This is how programs namespace data: different seed prefixes = different account types.",
  );

  // ── Step 4: Real-world example — ATA derivation ──────────────────────

  step(
    4,
    "Real-world: Derive an Associated Token Account (ATA) address manually",
  );

  const owner = await generateKeyPairSigner();
  const mintAddress = address("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

  info("The ATA program derives token account addresses from 3 seeds:");
  info("  1. Owner address");
  info("  2. Token Program address");
  info("  3. Mint address");
  info(`Owner:  ${formatAddress(owner.address)}`);
  info(`Mint:   ${formatAddress(mintAddress)} (USDC)`);

  const [manualAta] = await getProgramDerivedAddress({
    programAddress: ASSOCIATED_TOKEN_PROGRAM_ADDRESS,
    seeds: [
      getAddressEncoder().encode(owner.address),
      getAddressEncoder().encode(TOKEN_PROGRAM_ADDRESS),
      getAddressEncoder().encode(mintAddress),
    ],
  });

  keyValue("Manual ATA derivation", manualAta);

  const [sdkAta] = await findAssociatedTokenPda({
    mint: mintAddress,
    owner: owner.address,
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
  });

  keyValue("SDK findAssociatedTokenPda", sdkAta);

  if (manualAta === sdkAta) {
    success("They match! The SDK helper does exactly the same derivation.");
  }

  info("Every wallet has a unique, deterministic ATA for each token mint.");
  info(
    "Anyone can derive it — no lookup table needed. That is the power of PDAs.",
  );

  // ── Recap ────────────────────────────────────────────────────────────

  divider();
  info("Key takeaways:");
  info("  - PDAs are derived from seeds + a program ID (no private key)");
  info("  - Same seeds + same program = same PDA every time (deterministic)");
  info(
    "  - Changing even one byte of a seed produces a totally different address",
  );
  info("  - The bump seed pushes the address off the Ed25519 curve");
  info(
    "  - Programs store the canonical bump to avoid re-searching (saves CU)",
  );
  info("  - ATAs are the most common PDA pattern: [owner, tokenProgram, mint]");
  info('  - PDAs let programs "own" accounts without needing a private key');

  success("Lesson 07 complete!");
}

main().catch(console.error);
