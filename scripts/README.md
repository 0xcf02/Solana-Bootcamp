[Portugu\u00EAs (BR)](README.pt-BR.md)

[![npm version](https://img.shields.io/npm/v/@stbr/solana-lessons)](https://www.npmjs.com/package/@stbr/solana-lessons)
[![license](https://img.shields.io/npm/l/@stbr/solana-lessons)](LICENSE)

# Solana Bootcamp Lesson Scripts

12 self-contained TypeScript scripts that teach Solana development to web2 developers. Each script is a runnable lesson that demonstrates a core concept, prints color-coded output to the terminal, and takes 2-5 minutes to walk through.

Scripts 01-09 use **@solana/kit** (web3.js 2.0). Scripts 10-12 use **@solana/web3.js 1.x** where Kit-native helpers are not yet mature (Token-2022 extensions, Actions SDK, x402).

## Install via npm

Run the interactive tutor without cloning anything:

```bash
# No install — just try it
npx @stbr/solana-lessons

# Or install globally and use the short command
npm install -g @stbr/solana-lessons
solana-lessons
```

Commands:

```bash
solana-lessons                 # Interactive menu: pick a lesson
solana-lessons list            # Print the lesson index
solana-lessons tutorial 1      # Paginated walkthrough of lesson 01
solana-lessons show 1          # Non-interactive dump (pipe into less)
solana-lessons run 1           # Execute the real lesson script
solana-lessons 1               # Shortcut: tutorial 1
```

The tutor narrates each lesson step-by-step with syntax-highlighted code. At the end it offers to execute the real script against `$RPC_URL` (defaults to `http://127.0.0.1:8899`). Override with `--rpc <url>` or the `RPC_URL` environment variable.

## Prerequisites

| Requirement | Version | Check |
|---|---|---|
| Node.js | 20+ | `node -v` |
| Solana CLI | 2.x | `solana --version` |
| solana-test-validator | (ships with CLI) | `solana-test-validator --version` |

## Quick Start

```bash
# Clone and enter the directory
cd lesson-scripts

# Install dependencies
npm install

# Start a local validator in a separate terminal
solana-test-validator

# Run the first lesson
npx tsx src/01-hello-solana.ts
```

## Script Guide

| # | Script | Concepts | SDK | Demo Time |
|---|---|---|---|---|
| 01 | `hello-solana` | Keypairs, balances, airdrop, lamports | Kit | ~2 min |
| 02 | `send-sol` | Build tx with transfer + memo, `pipe()` pattern | Kit | ~3 min |
| 03 | `atomic-transactions` | Atomicity demo: multi-instruction failure rollback | Kit | ~5 min |
| 04 | `create-token-manual` | Create token step by step (raw instructions) | Kit | ~5 min |
| 05 | `create-token-easy` | Create token with high-level helper, full lifecycle | Kit | ~3 min |
| 06 | `tokens-and-transfers` | ATA creation, mint tokens, SPL transfer deep dive | Kit | ~5 min |
| 07 | `pdas-explained` | PDA derivation, ATA-as-PDA proof | Kit | ~3 min |
| 08 | `cpis-in-action` | CPI chain from transaction logs | Kit | ~4 min |
| 09 | `priority-fees` | Compute budget, CU estimation, priority fees | Kit | ~4 min |
| 10 | `token-extensions` | Token-2022: transfer fees + on-chain metadata | 1.x | ~5 min |
| 11 | `solana-actions` | Blinks: Express server serving a tip jar Action | 1.x | ~5 min |
| 12 | `x402-micropayments` | x402: pay-per-API-call with HTTP 402 | 1.x | ~3 min |

## Running Scripts

Each script can be run directly with `tsx` or through the npm shortcut:

```bash
# Direct
npx tsx src/01-hello-solana.ts

# npm shortcut
npm run 01
```

All scripts target `http://127.0.0.1:8899` (local validator) by default. Override with environment variables:

```bash
RPC_URL=https://api.devnet.solana.com npx tsx src/01-hello-solana.ts
```

## Script Details

### 01 - Hello Solana

Generates keypairs, checks balances, airdrops SOL, and explains the lamports/SOL relationship. The simplest possible Solana interaction.

**Key concepts:** `generateKeyPairSigner()`, `getBalance`, airdrop, 1 SOL = 1,000,000,000 lamports.

```
╔══════════════════════════╗
║  Lesson 01: Hello Solana  ║
╚══════════════════════════╝

▸ Step 1: Generate two keypairs
  ✔ Generated Keypair A
  Address A: 7xKb...9fGh
  ✔ Generated Keypair B
  Address B: 3mNp...2qRs
```

### 02 - Send SOL

Builds a transaction with a SOL transfer and memo instruction using the Kit `pipe()` pattern. Demonstrates transaction composition.

**Key concepts:** `pipe()`, `createTransaction`, `appendTransactionMessageInstruction`, transfer + memo in one tx.

### 03 - Atomic Transactions

Builds a multi-instruction transaction where one instruction intentionally fails, proving that all instructions roll back atomically. Shows the difference between success and failure paths.

**Key concepts:** Atomicity, transaction simulation, error handling, partial failure = full rollback.

### 04 - Create Token (Manual)

Creates an SPL token using raw instructions: allocate account, initialize mint, create ATA, mint tokens. Every step is explicit so you see what high-level helpers abstract away.

**Key concepts:** `SystemProgram.createAccount`, `initializeMint`, mint authority, decimals, raw instruction building.

### 05 - Create Token (Easy)

Same result as 04 but using high-level helper functions. Compares the two approaches and demonstrates the full token lifecycle: create, mint, check supply.

**Key concepts:** Helper abstraction vs raw instructions, token lifecycle, supply verification.

### 06 - Tokens and Transfers

Creates Associated Token Accounts (ATAs), mints tokens, and transfers SPL tokens between wallets. Deep dive into the token account model.

**Key concepts:** ATAs, `getOrCreateAssociatedTokenAccount`, `mintTo`, `transfer`, token account vs mint account.

### 07 - PDAs Explained

Derives Program Derived Addresses and proves that ATAs are themselves PDAs. Shows how seeds + program ID deterministically produce addresses with no private key.

**Key concepts:** `findProgramAddress`, seeds, bump seed, ATAs as PDAs, deterministic derivation.

### 08 - CPIs in Action

Executes a transaction that triggers Cross-Program Invocations and parses the transaction logs to show the call chain between programs.

**Key concepts:** CPI, inner instructions, program log parsing, instruction depth.

### 09 - Priority Fees

Estimates compute unit usage via simulation, sets compute unit limits and priority fees, and compares transaction landing with and without priority fees.

**Key concepts:** `ComputeBudgetProgram`, `setComputeUnitLimit`, `setComputeUnitPrice`, simulation, CU estimation.

### 10 - Token Extensions (Token-2022)

Creates a Token-2022 mint with two extensions enabled simultaneously: TransferFeeConfig (1% protocol fee with a 9-token cap) and MetadataPointer with on-chain metadata. No Metaplex needed.

**Key concepts:** `TOKEN_2022_PROGRAM_ID`, `ExtensionType`, `getMintLen`, transfer fees, on-chain metadata, `createInitializeTransferFeeConfigInstruction`.

### 11 - Solana Actions (Blinks)

Starts an Express server that implements the Solana Actions spec: GET returns action metadata, POST accepts a wallet address and returns an unsigned transfer transaction. The server is a transaction factory -- it never holds private keys.

**Key concepts:** Actions/Blinks, `actions.json`, GET/POST endpoints, `createPostResponse`, CORS middleware. Runs on port 8080.

### 12 - x402 Micropayments

Demonstrates the x402 protocol for pay-per-API-call using HTTP 402 responses. A server demands payment via a 402 status code, and the client pays with SOL to unlock the resource.

**Key concepts:** HTTP 402 Payment Required, micropayments, pay-per-call APIs, x402 protocol flow.

## SDK Notes

| Scripts | SDK | Why |
|---|---|---|
| 01-09 | `@solana/kit` (web3.js 2.0) | Modern, tree-shakable, type-safe. Uses `pipe()` for transaction building, factory functions for RPC/airdrop/sendAndConfirm. |
| 10-12 | `@solana/web3.js` 1.x | Token-2022 extension helpers (`@solana/spl-token`), the Actions SDK (`@solana/actions`), and x402 tooling expect legacy `Transaction`/`Connection` types. These scripts will migrate to Kit once the ecosystem catches up. |

Both SDKs coexist in `package.json` without conflict. Imports are explicit per script so there is no ambiguity.

## Project Structure

```
lesson-scripts/
  package.json           # Dependencies + npm run shortcuts (01-12)
  tsconfig.json          # ESNext, NodeNext, strict mode
  src/
    helpers/
      config.ts          # RPC client, airdrop, sendAndConfirm factories (@solana/kit)
      display.ts         # Console formatting: banner(), step(), success(), colors
    01-hello-solana.ts
    02-send-sol.ts
    03-atomic-transactions.ts
    04-create-token-manual.ts
    05-create-token-easy.ts
    06-tokens-and-transfers.ts
    07-pdas-explained.ts
    08-cpis-in-action.ts
    09-priority-fees.ts
    10-token-extensions.ts
    11-solana-actions.ts
    12-x402-micropayments.ts
```

## Development

```bash
# Type-check all scripts
npm run typecheck

# Run tests
npm test
```

## Troubleshooting

### Validator not running

```
Error: fetch failed ... ECONNREFUSED 127.0.0.1:8899
```

Start the local validator:

```bash
solana-test-validator
```

Wait for "Ledger location: ..." before running scripts.

### Airdrop fails

```
Error: airdrop request failed
```

The local validator may have run out of SOL or the airdrop rate limit was hit. Reset the validator:

```bash
solana-test-validator --reset
```

On devnet, airdrop is rate-limited. Wait a few seconds and retry, or use `solana airdrop 2 <address> --url devnet` from the CLI.

### Port 8080 already in use (Script 11)

Script 11 starts an Express server on port 8080. If the port is taken:

```bash
# Find and kill the process using port 8080
lsof -ti:8080 | xargs kill -9

# Or set a different port
PORT=3000 npx tsx src/11-solana-actions.ts
```

### Module resolution errors

Make sure you installed dependencies:

```bash
npm install
```

If TypeScript complains about module resolution, verify you are using Node.js 20+ (`node -v`). The project uses `"module": "NodeNext"` which requires Node 20+.

### Transaction simulation fails

Some scripts intentionally simulate failing transactions (e.g., 03 - Atomic Transactions). Read the console output -- failures marked with a red X are expected and demonstrate error handling.
