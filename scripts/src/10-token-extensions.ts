/**
 * Lesson 10 - Token Extensions (Token-2022)
 *
 * Core concept: Token-2022 adds native extensions to SPL tokens. This lesson
 * demonstrates TransferFeeConfig — a protocol-level transfer fee (1% capped at
 * 9 tokens) enforced on-chain by the token program itself. There is no way to
 * bypass it; even a direct SPL transfer will fail without the fee path.
 *
 * Uses @solana/web3.js 1.x + @solana/spl-token because Token-2022 extension
 * helpers are not yet mature in @solana/kit.
 *
 * Note: Token-2022 also supports on-chain metadata (MetadataPointer +
 * TokenMetadata extensions), confidential transfers, transfer hooks, interest
 * bearing tokens, non-transferable tokens ("soulbound"), and more. Metadata is
 * intentionally omitted from this script to keep it stable across validator
 * versions — see the Solana Token Extensions guide for the metadata pattern.
 */

import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  ExtensionType,
  getMintLen,
  createInitializeTransferFeeConfigInstruction,
  createInitializeMintInstruction,
  createAssociatedTokenAccountIdempotent,
  mintTo,
  transferCheckedWithFee,
  getTransferFeeConfig,
  getMint,
  getAccount,
} from "@solana/spl-token";
import {
  banner,
  step,
  success,
  info,
  keyValue,
  formatAddress,
  divider,
} from "./helpers/display.js";

const DECIMALS = 9;
const FEE_BASIS_POINTS = 100; // 1%
const MAX_FEE = BigInt(9 * 10 ** DECIMALS); // 9 tokens

export async function main(): Promise<void> {
  banner("Lesson 10: Token Extensions (Token-2022)");

  info("Token-2022 extends the original Token Program with native extensions.");
  info("Extensions are configured at mint creation and enforced on-chain.");
  info("This lesson creates a mint with the TransferFeeConfig extension.");

  // ── Step 1: Connect to local validator ──────────────────────────────

  step(1, "Connect to local validator");

  const rpcUrl = process.env.RPC_URL ?? "http://127.0.0.1:8899";
  const connection = new Connection(rpcUrl, "confirmed");
  const version = await connection.getVersion();

  success("Connected to local validator");
  keyValue("RPC URL", rpcUrl);
  keyValue("Version", version["solana-core"]);

  // ── Step 2: Generate payer and airdrop SOL ──────────────────────────

  step(2, "Generate payer keypair and airdrop SOL");

  const payer = Keypair.generate();

  info("Requesting 5 SOL airdrop for transaction fees and rent...");
  const airdropSig = await connection.requestAirdrop(
    payer.publicKey,
    5 * LAMPORTS_PER_SOL,
  );
  await connection.confirmTransaction(airdropSig, "confirmed");

  const balance = await connection.getBalance(payer.publicKey);

  success("Airdrop confirmed");
  keyValue("Payer", formatAddress(payer.publicKey.toBase58()));
  keyValue("Balance", `${balance / LAMPORTS_PER_SOL} SOL`);

  // ── Step 3: Create mint with TransferFeeConfig ───────────────────────

  step(3, "Create mint with TransferFeeConfig extension");

  info("Token-2022 extensions must be initialized BEFORE the mint itself.");
  info("The instruction order is critical:");
  info(
    "  1. SystemProgram.createAccount (allocate space for mint + extensions)",
  );
  info("  2. InitializeTransferFeeConfig (before mint init!)");
  info("  3. InitializeMint (now the mint knows about its extensions)");

  const mintKeypair = Keypair.generate();

  // Pre-calculate account size for a mint with TransferFeeConfig.
  // getMintLen accounts for the base mint + fixed-size extension TLV entries.
  const mintLen = getMintLen([ExtensionType.TransferFeeConfig]);
  const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);

  keyValue("Mint + extensions size", `${mintLen} bytes`);
  keyValue("Rent-exempt minimum", `${lamports} lamports`);

  const createAccountIx = SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: mintKeypair.publicKey,
    space: mintLen,
    lamports,
    programId: TOKEN_2022_PROGRAM_ID,
  });

  // TransferFeeConfig: 1% fee, max 9 tokens
  const initTransferFeeIx = createInitializeTransferFeeConfigInstruction(
    mintKeypair.publicKey,
    payer.publicKey, // transfer fee config authority
    payer.publicKey, // withdraw withheld authority
    FEE_BASIS_POINTS,
    MAX_FEE,
    TOKEN_2022_PROGRAM_ID,
  );

  // Initialize the mint itself (AFTER extension configs)
  const initMintIx = createInitializeMintInstruction(
    mintKeypair.publicKey,
    DECIMALS,
    payer.publicKey, // mint authority
    payer.publicKey, // freeze authority
    TOKEN_2022_PROGRAM_ID,
  );

  const tx = new Transaction().add(
    createAccountIx,
    initTransferFeeIx,
    initMintIx,
  );
  await sendAndConfirmTransaction(connection, tx, [payer, mintKeypair]);

  success("Mint created with TransferFeeConfig extension");
  keyValue("Mint address", mintKeypair.publicKey.toBase58());
  keyValue("Transfer fee", `${FEE_BASIS_POINTS} basis points (1%)`);
  keyValue("Max fee", `${Number(MAX_FEE) / 10 ** DECIMALS} tokens`);

  // ── Step 4: Verify on-chain mint state ──────────────────────────────

  step(4, "Verify on-chain mint state and extension config");

  const mintInfo = await getMint(
    connection,
    mintKeypair.publicKey,
    "confirmed",
    TOKEN_2022_PROGRAM_ID,
  );

  const feeConfig = getTransferFeeConfig(mintInfo);

  keyValue("Decimals", mintInfo.decimals);
  keyValue("Supply", mintInfo.supply.toString());

  if (feeConfig) {
    keyValue(
      "Newer fee (basis points)",
      feeConfig.newerTransferFee.transferFeeBasisPoints.toString(),
    );
    keyValue(
      "Newer max fee",
      `${Number(feeConfig.newerTransferFee.maximumFee) / 10 ** DECIMALS} tokens`,
    );
  }

  success("Transfer fee config verified on-chain");

  // ── Step 5: Create sender ATA and mint tokens ───────────────────────

  step(5, "Create sender token account and mint 1000 tokens");

  info("Associated Token Accounts (ATAs) work the same with Token-2022.");
  info("Just pass TOKEN_2022_PROGRAM_ID instead of the classic Token Program.");

  const senderAta = await createAssociatedTokenAccountIdempotent(
    connection,
    payer,
    mintKeypair.publicKey,
    payer.publicKey,
    {},
    TOKEN_2022_PROGRAM_ID,
  );

  const mintAmount = BigInt(1000 * 10 ** DECIMALS);
  await mintTo(
    connection,
    payer,
    mintKeypair.publicKey,
    senderAta,
    payer, // mint authority
    mintAmount,
    [],
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  const senderAccount = await getAccount(
    connection,
    senderAta,
    "confirmed",
    TOKEN_2022_PROGRAM_ID,
  );

  success("Tokens minted to sender");
  keyValue("Sender ATA", formatAddress(senderAta.toBase58()));
  keyValue("Minted", `${Number(senderAccount.amount) / 10 ** DECIMALS} tokens`);

  // ── Step 6: Create recipient and their ATA ──────────────────────────

  step(6, "Create recipient keypair and token account");

  const recipient = Keypair.generate();

  const recipientAta = await createAssociatedTokenAccountIdempotent(
    connection,
    payer,
    mintKeypair.publicKey,
    recipient.publicKey,
    {},
    TOKEN_2022_PROGRAM_ID,
  );

  success("Recipient token account created");
  keyValue("Recipient", formatAddress(recipient.publicKey.toBase58()));
  keyValue("Recipient ATA", formatAddress(recipientAta.toBase58()));

  // ── Step 7: Transfer tokens with fee ────────────────────────────────

  step(7, "Transfer 100 tokens using transferCheckedWithFee");

  info("transferCheckedWithFee enforces the mint's transfer fee on-chain.");
  info(
    "The fee is withheld in the recipient's token account, not taken from the sender.",
  );
  info(
    "The sender sends the full amount; the recipient receives amount minus fee.",
  );

  const transferAmount = BigInt(100 * 10 ** DECIMALS);

  // Calculate expected fee: 1% of transfer amount, capped at maxFee
  const calculatedFee =
    (transferAmount * BigInt(FEE_BASIS_POINTS)) / BigInt(10_000);
  const actualFee = calculatedFee > MAX_FEE ? MAX_FEE : calculatedFee;

  keyValue(
    "Transfer amount",
    `${Number(transferAmount) / 10 ** DECIMALS} tokens`,
  );
  keyValue(
    "Calculated fee (1%)",
    `${Number(calculatedFee) / 10 ** DECIMALS} tokens`,
  );
  keyValue(
    "Actual fee (after cap)",
    `${Number(actualFee) / 10 ** DECIMALS} tokens`,
  );

  await transferCheckedWithFee(
    connection,
    payer,
    senderAta,
    mintKeypair.publicKey,
    recipientAta,
    payer, // owner of source account
    transferAmount,
    DECIMALS,
    actualFee,
    [],
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  success("Transfer completed with fee enforcement");

  // ── Step 8: Display final balances and fee withheld ─────────────────

  step(8, "Inspect final balances and withheld fees");

  const senderFinal = await getAccount(
    connection,
    senderAta,
    "confirmed",
    TOKEN_2022_PROGRAM_ID,
  );

  const recipientFinal = await getAccount(
    connection,
    recipientAta,
    "confirmed",
    TOKEN_2022_PROGRAM_ID,
  );

  const senderBalance = Number(senderFinal.amount) / 10 ** DECIMALS;
  const recipientBalance = Number(recipientFinal.amount) / 10 ** DECIMALS;

  divider();
  info("Transfer results:");
  keyValue("Sender balance", `${senderBalance} tokens (was 1000)`);
  keyValue("Recipient balance", `${recipientBalance} tokens`);
  keyValue(
    "Fee withheld",
    `${Number(actualFee) / 10 ** DECIMALS} tokens (held in recipient ATA)`,
  );
  keyValue(
    "Recipient received",
    `${(Number(transferAmount) - Number(actualFee)) / 10 ** DECIMALS} tokens`,
  );

  info("The withheld fee stays in the recipient's ATA until the");
  info("withdraw-withheld authority harvests it.");

  divider();
  info("Key takeaways:");
  info("  - Token-2022 extensions are configured at mint creation time");
  info("  - Extension init instructions MUST come BEFORE initializeMint");
  info("  - TransferFee is enforced on-chain — no way to bypass it");
  info("  - Fees are withheld in recipient accounts, not deducted from sender");
  info("  - A withdraw-withheld authority can later harvest accumulated fees");
  info(
    "  - Other extensions: MetadataPointer, ConfidentialTransfer, TransferHook,",
  );
  info(
    "    InterestBearingConfig, NonTransferable, PermanentDelegate, and more",
  );

  success("Lesson 10 complete!");
}

main().catch(console.error);
