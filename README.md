[Português (BR)](README.pt-BR.md)

# 🎓 Solana Bootcamp

**A [Superteam Brazil](https://www.superteam.com.br/pt) community project** 🇧🇷 — building the Solana ecosystem in Brazil.
Official site: [superteam.com.br](https://www.superteam.com.br/pt) · X/Twitter: [@SuperteamBR](https://x.com/SuperteamBR) · Wiki: [wiki.superteam.com.br](https://wiki.superteam.com.br/)

Welcome to the Solana Bootcamp! This repository has everything you need to start building decentralized applications (dApps) on the Solana blockchain.

## 📚 Table of Contents

**Quick Start:**
- [📋 Prerequisites](#-prerequisites)
- [📦 Installation](#-installation)

**Development:**
- [⚙️ Initial Setup](#️-initial-setup)
- [🚀 Running the Scripts](#-running-the-scripts)
- [📖 Core Concepts](#-solana-core-concepts)

**Your Project:**
- [🎯 Final Project: SuperBank Neobank](#-final-project-superbank-neobank)
- [🔗 Resources & Links](#-important-resources--links)
- [🏠 Homework Project: Neobank](#-homework-project-build-your-own-neobank)

**Support:**
- [🔧 Troubleshooting](#-troubleshooting)

---

## 📋 Prerequisites

Before you start, make sure you have:

- **Node.js 20+** (check with `node -v`)
- **npm or yarn** installed
- **Git** installed
- An account on **Solflare Wallet** or another wallet of your choice (Backpack, Phantom...).
- **Terminal:** native terminal on Linux/macOS; **WSL2 (Ubuntu)** on Windows (see Installation). Git Bash alone is **not** enough for Rust/Anchor.
- **Rust** (see Installation below)
- **Solana CLI** (see Installation below)
- **Anchor CLI** (see Installation below)
- **Surfpool CLI** *(Optional - recommended for a better local dev experience)*

> 💡 **Don't want to install anything locally?** Skip straight to [🎯 Final Project: SuperBank Neobank](#-final-project-superbank-neobank) — the repository ships with a **Dev Container** (Docker) with everything pre-installed (Rust, Solana CLI, and the SuperBank Next.js scaffold ready to run).

---

## 📦 Installation

> **Which OS are you on?**
>
> - 🐧 **Linux / macOS** → follow [Option A](#️-option-a-linux--macos)
> - 🪟 **Windows** → you have two choices:
>   - [Option B: WSL2](#-option-b-windows-via-wsl2-recommended) (**recommended** — full Unix toolchain, everything in this guide works)
>   - [Option C: Dev Container](#️-option-c-any-os--dev-container-docker) (no local setup at all, works on any OS)
>
> ⚠️ **Do NOT try to build Solana/Anchor programs natively on Windows**
> (PowerShell, CMD, or plain Git Bash). Rust/Anchor tooling on MSVC is
> unreliable for Solana development. Use WSL2 or Docker instead.

### 🅰️ Option A: Linux & macOS

Everything below runs as-is in your native terminal.

#### ⚡ Quick Install (Recommended)

The fastest way is to install everything with **a single command**. This official Solana installer sets up your whole environment in one go:

```bash
curl --proto '=https' --tlsv1.2 -sSfL https://solana-install.solana.workers.dev | bash
```

Wait for it to finish. You'll see something like:

```
Installed Versions:
Rust: rustc 1.91.1 (ed61e7d7e 2025-11-07)
Solana CLI: solana-cli 3.0.10 (src:96c3a851; feat:3604001754, client:Agave)
Anchor CLI: anchor-cli 0.32.1
Surfpool CLI: surfpool 0.12.0
Node.js: v24.10.0
Yarn: 1.22.1
```

**Verify everything installed correctly:**

```bash
rustc --version && solana --version && anchor --version && surfpool --version && node --version && yarn --version
```

> 💡 **If the quick installer fails**, install each tool individually:
>
> 1. **Rust:**
>    ```bash
>    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
>    . "$HOME/.cargo/env"
>    ```
> 2. **Solana CLI:**
>    ```bash
>    sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
>    export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"  # add to ~/.bashrc or ~/.zshrc
>    ```
> 3. **Anchor (via AVM):**
>    ```bash
>    cargo install --git https://github.com/solana-foundation/anchor avm --force
>    avm install latest && avm use latest
>    ```
> 4. **Surfpool (optional):**
>    ```bash
>    curl -sL https://run.surfpool.run/ | bash
>    ```

### 🅱️ Option B: Windows via WSL2 (Recommended)

WSL2 (**Windows Subsystem for Linux**) gives you a real Ubuntu environment inside Windows. All Solana, Rust, and Anchor tooling works perfectly there — this is the setup the Solana Foundation recommends for Windows users.

#### 1️⃣ Install WSL2 (one-time, in PowerShell **as Administrator**)

```powershell
wsl --install
```

That single command installs WSL2 + the default Ubuntu distro. **Reboot** when prompted, then open the new **Ubuntu** app from the Start menu and create your Linux username/password.

> 💡 On older Windows builds, enable it manually:
> ```powershell
> dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
> dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
> ```
> Then reboot and run `wsl --set-default-version 2`.
>
> Requirements: Windows 10 version 2004+ (build 19041+) or Windows 11.

#### 2️⃣ Install Node.js inside WSL

Ubuntu doesn't ship Node by default — use nvm:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc
nvm install --lts
node -v   # expect v20+
```

#### 3️⃣ Install the Solana toolchain

From here on, **everything works exactly like Option A** — run the same commands inside the Ubuntu terminal:

```bash
curl --proto '=https' --tlsv1.2 -sSfL https://solana-install.solana.workers.dev | bash
```

Verify:

```bash
rustc --version && solana --version && anchor --version && node --version
```

#### 4️⃣ Use your project from Windows

- **VS Code (recommended):** open a terminal in WSL and run `code .` — VS Code will install the **WSL extension** and open the project inside Linux.
- **Git in WSL:** clone the repo inside WSL (e.g. `~/projects/`), not on `/mnt/c/...`. Files on the Windows drive are ~10x slower for Rust builds.
- **Browsers, Phantom, etc.:** run as normal Windows apps — `http://localhost:3000` from WSL is reachable from your Windows browser.
- **Windows Terminal** (from the Microsoft Store) is the nicest way to run both PowerShell and Ubuntu tabs side by side.

### 🅾️ Option C: Any OS — Dev Container (Docker)

Don't want to install anything? The repo ships a **Dev Container** with Rust, Solana CLI, Anchor, and the SuperBank scaffold pre-installed:

1. Install **Docker Desktop** ([Windows](https://www.docker.com/products/docker-desktop/) — enable the *WSL2 backend* during install if asked, / [macOS](https://www.docker.com/products/docker-desktop/) / Linux).
2. Install **VS Code** + the **Dev Containers** extension.
3. Open this repo → command palette (`Ctrl/Cmd + Shift + P`) → **"Dev Containers: Reopen in Container"**.
4. Run `npm run dev` and open `http://localhost:3000`.

This is the zero-friction path for bootcamp day one — you can set up WSL2 or a native toolchain later.

---

### 5️⃣ Cloning the Repository and Installing Dependencies (All options)

```bash
# Clone this repository
git clone <repo-url>
cd solana-bootcamp

# Install Node.js dependencies
npm install
```

---

## ⚙️ Initial Setup

### Configure the Solana Cluster

Set which Solana cluster you want to use:

```bash
# For localhost (local validator)
solana config set --url localhost

# For Devnet (public testnet)
solana config set --url devnet

# For Mainnet (production - careful!)
solana config set --url mainnet-beta

# Check your configuration
solana config get
```

### Create or Import a Wallet

```bash
# Generate a new wallet (keypair)
solana-keygen new

# Or import an existing wallet
solana-keygen recover

# View your public address
solana address

# View your balance
solana balance
```

### Get Test SOL

**On Devnet (public testnet):**

```bash
# Airdrop 2 SOL to your wallet
solana airdrop 2 --url devnet

# Check the balance
solana balance --url devnet
```

> ⚠️ **Note:** Devnet caps airdrops at 5 SOL. If you hit the limit, use the [Solana Faucet](https://faucet.solana.com/).

**On Localhost (local validator):**

```bash
# The local validator already ships with unlimited SOL, no airdrop needed
```

---

## 🚀 Running the Scripts

The 12 TypeScript lessons live in the `scripts/` folder (a Node.js package separate from the SuperBank app).

### Step 1: Start the Local Validator

Open a **separate terminal** and run:

```bash
# Option A: Use Surfpool (recommended, if installed)
surfpool start

# Option B: Use solana-test-validator (traditional)
solana-test-validator
```

Leave this terminal running throughout the bootcamp.

### Step 2: Run the Scripts

In **another terminal**, enter the `scripts/` folder, install its dependencies (first time only), and run the scripts in order:

> **⚠️ Important:** the scripts live in `scripts/`, a Node.js package separate from the Next.js app at the repo root. `cd` into it before running any command below.

```bash
cd scripts
npm install   # first time only

# 01 - Hello Solana (basic concepts, keypairs, airdrop)
npx tsx src/01-hello-solana.ts

# 02 - Send SOL (build and send transactions)
npx tsx src/02-send-sol.ts

# 03 - Atomic Transactions (atomicity and rollback)
npx tsx src/03-atomic-transactions.ts

# 04 - Create Token (Manual) (create an SPL Token manually)
npx tsx src/04-create-token-manual.ts

# 05 - Create Token (Easy) (create an SPL Token with helpers)
npx tsx src/05-create-token-easy.ts

# 06 - Tokens and Transfers (ATAs and transfers)
npx tsx src/06-tokens-and-transfers.ts

# 07 - PDAs Explained (Program Derived Addresses)
npx tsx src/07-pdas-explained.ts

# 08 - CPIs in Action (Cross-Program Invocations)
npx tsx src/08-cpis-in-action.ts

# 09 - Priority Fees
npx tsx src/09-priority-fees.ts

# 10 - Token Extensions (Token-2022)
npx tsx src/10-token-extensions.ts

# 11 - Solana Actions (Blinks)
npx tsx src/11-solana-actions.ts

# 12 - x402 Micropayments
npx tsx src/12-x402-micropayments.ts
```

> 💡 **Tip:** from inside the `scripts/` folder, you can also use the npm shortcuts:
> ```bash
> npm run 01
> npm run 02
> # ... etc
> ```
> If you get "npm ERR! code ENOENT", make sure you're inside the `scripts/` folder, where this `package.json` lives.

---

## 📖 Solana Core Concepts

### 🔑 Keypairs and Wallets

A **keypair** is a cryptographic key pair: a public key (your address) and a private key (your secret). You use the private key to sign transactions.

```typescript
import { generateKeyPairSigner } from '@solana/web3.js';

const keyPair = await generateKeyPairSigner();
console.log('Public Key:', keyPair.address);
```

### 💰 Lamports and SOL

- **1 SOL = 1,000,000,000 lamports**
- On-chain balances are stored in lamports (the smaller unit)

### 🔄 Transactions

A **transaction** is a series of instructions executed atomically. If one instruction fails, the whole transaction is rolled back.

```typescript
import { createTransaction, pipe, transfer } from '@solana/web3.js';

const tx = await pipe(
  createTransaction(),
  (tx) => transfer(tx, { source, destination, amount })
);
```

### 🧩 PDA (Program Derived Address)

A **PDA** is an address deterministically derived from:
- A seed (text)
- A program ID
- A bump seed (number)

PDAs **have no private key** — they're controlled by Solana programs.

**Use case:** storing data tied to a program, creating token accounts, etc.

```typescript
import { findProgramAddress } from '@solana/web3.js';

const [pda, bump] = await findProgramAddress(
  [Buffer.from('seed-text')],
  programId
);
```

### 🪙 SPL Token

**SPL** = Solana Program Library. An SPL Token is a custom token created on Solana (similar to an ERC-20 on Ethereum).

**Components:**
- **Mint Account:** stores the token's metadata (supply, decimals, mint authority)
- **Token Account:** stores a user's token balance
- **Associated Token Account (ATA):** a token account tied to a wallet (created automatically)

```typescript
import { getOrCreateAssociatedTokenAccount, mintTo, transfer } from '@solana/spl-token';

// Create the ATA
const ata = await getOrCreateAssociatedTokenAccount(
  connection, payer, mint, owner
);

// Mint tokens
await mintTo(connection, payer, mint, ata.address, mintAuthority, 1000000000);

// Transfer tokens
await transfer(connection, payer, fromAta, toAta, owner, 500000000);
```

> ⚠️ **Heads up:** the examples above (`getOrCreateAssociatedTokenAccount`, `mintTo`, `transfer`) take a `payer` of type `Signer` — a full keypair, private key included. That works fine in Node.js scripts like the ones in this section. **It does not work like this in a browser app** using Wallet Adapter, which only ever exposes `publicKey` and `sendTransaction` (never the private key). See how to handle this correctly in [🎯 Final Project: SuperBank Neobank](#-final-project-superbank-neobank).

### 🔁 CPI (Cross-Program Invocation)

A **CPI** lets one Solana program call another program. Think of it like a smart contract calling another smart contract.

**Example:** your program calls the Token Program to transfer tokens.

```typescript
// Your program issues an instruction that calls another program
const transferInstruction = createTransferInstruction(
  fromTokenAccount,
  toTokenAccount,
  owner,
  amount,
  [],
  TOKEN_PROGRAM_ID
);
```

### 📜 Instructions

An **instruction** is a call into a Solana program. Each instruction specifies:
- Which program to execute
- Which accounts are affected
- What data to pass to the program

```typescript
// Example: a transfer instruction
const instruction = createTransferInstruction(
  source,        // Source account
  destination,   // Destination account
  owner,         // Who signs
  amount,        // Amount in lamports
  [],
  SYSTEM_PROGRAM_ID
);
```

### 🔐 Authorities

Every resource (mint, token account) has **authorities** that can perform specific actions:
- **Mint Authority:** can create new tokens
- **Freeze Authority:** can freeze token accounts
- **Owner:** owns the account

---

## 🎯 Final Project: SuperBank Neobank

Your final project is to **build SuperBank** — a complete neobank on Solana!

### Required Features:

✅ Wallet connection (Phantom/Backpack/Solflare)
✅ Display SOL balance
✅ Create a custom token, "SuperReal" (SREAL)
✅ Mint tokens
✅ Transfer tokens between wallets
✅ Transaction history
✅ Dashboard with balances and Explorer links
✅ Toast notifications

### Getting Started:

1. **Open the project in the Dev Container** (Docker/VS Code). The Next.js scaffold already ships with Solana Wallet Adapter configured for devnet — no manual setup needed. Once it's open, run:

   ```bash
   npm run dev
   ```

   Open `http://localhost:3000` in your browser. Wallet connection (Phantom/Backpack/Solflare) already works out of the box.

2. **Paste the prompt below into the AI tool of your choice** (Cursor, GitHub Copilot, Windsurf, Claude, or any code assistant you have available), with the project already open in your editor:

```
Act as a Senior Fullstack Solana Developer. I have a Next.js project with Solana Wallet Adapter configured.
We need to build a single-page Neobank app on the devnet called "SuperBank".

Build the complete UI and integration in a single pass. Do not wait for confirmations. All codes and comments must be written in English.

Requirements:
1. UI/UX: Create a modern, clean dark theme. Prominently display the connected wallet address and the user's SOL balance.
2. Custom SPL Token: Include a section to create a custom token called "SuperReal" (Symbol: SREAL, 9 decimals) with a "Create Token" button. Display the Mint Address with a link to Solana Explorer (devnet) once created.
3. Mint Functionality: Add an input field for the amount and a "Mint" button to mint SREAL tokens to the connected wallet. Display the SREAL balance in the dashboard.
4. Transfer (Send): Create an interface with "Recipient Address", "Amount", and a "Send" button.
CRITICAL INSTRUCTION: The @solana/wallet-adapter-react only exposes a `publicKey` and `sendTransaction`, not a full Signer object. Do NOT use `getOrCreateAssociatedTokenAccount` or `mintTo` directly, as they require a Signer.
Instead, you MUST manually construct the instructions:
- Use `getAssociatedTokenAddress` to find the ATA.
- Check if the recipient's ATA exists. If not, append `createAssociatedTokenAccountInstruction`.
- Append `createTransferInstruction`.
Build a single `Transaction` containing these instructions and send it via the wallet adapter's `sendTransaction`.
5. Notifications: After any successful on-chain action (Create, Mint, Send), trigger a toast notification containing the transaction signature linked to explorer.solana.com/?cluster=devnet.

Ensure you use @solana/web3.js and @solana/spl-token packages correctly. Use TailwindCSS for styling. Make the send/receive actions the primary focus of the UI.
```

3. **Follow the process:** Don't just copy/paste! Understand each step:
   - How wallet connection works
   - How to create SPL tokens
   - How to build transactions
   - How to display data in the UI

4. **Test it** locally or on devnet

---

## 🔗 Important Resources & Links

### 📘 Official Documentation

- **[Solana.com](https://solana.com)** - Solana's official site
- **[Solana Docs](https://solana.com/docs)** - Complete documentation
- **[Solana CLI Basics](https://solana-com-docs.vercel.app/docs/intro/installation/solana-cli-basics)** - CLI guide

### 🛠️ Tools & Frameworks

- **[Anchor Framework](https://www.anchor-lang.com/)** - Framework for building Solana programs
- **[Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)** - JavaScript library for Solana
- **[@solana/kit](https://github.com/solana-foundation/@solana/kit)** - Modern SDK (web3.js 2.0)

### 🚰 Faucets & Testnet

- **[Solana Faucet](https://faucet.solana.com/)** - Get test SOL
- **[Devnet Explorer](https://explorer.solana.com/?cluster=devnet)** - View transactions and accounts

### 💡 Tutorials & Examples

- **[Solana Developers](https://solana.com/developers/templates)** - Official templates
- **[Solana Skill](https://github.com/solana-foundation/solana-dev-skill)** - Development skill
- **[Solana Lesson Scripts](https://github.com/solanabr/solana-lesson-scripts)** - Class scripts (PT-BR)
- **[Solana Bootcamp](https://github.com/0xcf02/Solana-Bootcamp)** - This bootcamp repo
- **[Pirate Bootcamp](https://github.com/solana-developers/pirate-bootcamp)** - Pirate bootcamp
- **[Solana Claude](https://github.com/solanabr/solana-claude)** - AI assistants for Solana

### 🖥️ IDEs & Playgrounds

- **[trynoah.ai](https://trynoah.ai)** - AI dApp-building playground
- **[Quasar](https://quasar-lang.com/docs)** - Smart contract language
- **[GitHub Codespaces](https://ideal-spoon-695q5j7v44qr2rj94.github.dev/)** - Online dev environment

### 👛 Wallets

- **[Phantom Wallet](https://phantom.com/download)** - Download Phantom (recommended)
- **[Backpack](https://backpack.app/)** - Alternative wallet
- **[Solflare](https://solflare.com/)** - Alternative wallet

---

## 🏠 Homework Project: Build Your Own Neobank

After the bootcamp, you should build a full neobank! Here's the guide:

### ✅ Minimum Requirements:

**Part 1: Setup (Day 1)**
- [ ] Create a project with Anchor/Next.js/React
- [ ] Connect Phantom wallet
- [ ] Display SOL balance

**Part 2: Token (Day 2)**
- [ ] Create a custom SPL Token
- [ ] Display the mint address
- [ ] Build a UI to mint tokens

**Part 3: Transfers (Day 3)**
- [ ] Allow sending tokens to another address
- [ ] Validate addresses
- [ ] Auto-create ATAs

**Part 4: Dashboard (Day 4)**
- [ ] Display transaction history
- [ ] Links to Solana Explorer
- [ ] Toast notifications

**Part 5: Design (Day 5)**
- [ ] Modern dark theme UI
- [ ] Responsive layout
- [ ] Intuitive UX

### ✨ Methodology: VibeCoding

Use **vibecoding** to speed up development:

1. **Describe** what you want to build in natural language
2. **Use AI** (trynoah.ai) to generate the code
3. **Follow** each step and understand what's happening
4. **Test** locally on your machine or on devnet
5. **Refine** the code iteratively

### 📝 Development Checklist:

```bash
# Clone or start a new project
git init my-neobank
cd my-neobank

# Basic setup
npm init -y
npm install @solana/web3.js @solana/spl-token

# Create the structure
mkdir src
mkdir src/components
mkdir src/utils

# Start building!
# Use trynoah.ai with a prompt you customize
```

### 🏗️ Recommended Architecture:

```
my-neobank/
├── src/
│   ├── components/
│   │   ├── WalletConnect.tsx
│   │   ├── Dashboard.tsx
│   │   ├── SendTokens.tsx
│   │   └── History.tsx
│   ├── utils/
│   │   ├── solana.ts (connection)
│   │   ├── tokens.ts (token operations)
│   │   └── explorer.ts (explorer links)
│   └── App.tsx
├── package.json
└── README.md
```

### 💡 Important Tips:

1. **Always start simple:** functionality first, polish later.
2. **Test on devnet:** grab test SOL from the faucet before anything else.
3. **Read the errors:** if something breaks, read the full error message.
4. **Understand the code:** don't blindly copy/paste. Understand every line.
5. **Version with Git:** commit often. `git add .` → `git commit -m "feat: add X"`
6. **Use the Explorer:** whenever you make a transaction, check it on the [Solana Explorer](https://explorer.solana.com/?cluster=devnet).

---

## 🔧 Troubleshooting

### Error: "fetch failed ... ECONNREFUSED 127.0.0.1:8899"

Your local validator isn't running.

```bash
# Terminal 1: start the validator
surfpool start
# or
solana-test-validator

# Terminal 2: run your scripts (inside the scripts/ folder)
cd scripts
npx tsx src/01-hello-solana.ts
```

### Error: "airdrop request failed"

The airdrop hit its limit or the validator has no SOL.

```bash
# Reset the validator
solana-test-validator --reset

# Or use the Solana devnet faucet
solana airdrop 2 --url devnet
```

### Error: "Module not found"

```bash
# Install dependencies (at the root for the Next.js app, or inside scripts/ for the lessons)
npm install

# Make sure you're on Node.js 20+
node -v
```

### Error: "Port 8080 already in use"

Script 11 uses port 8080.

```bash
# Use a different port
# Linux/macOS/WSL2
PORT=3000 npx tsx src/11-solana-actions.ts

# Windows PowerShell (if NOT using WSL2/Dev Container)
$env:PORT=3000; npx tsx src/11-solana-actions.ts
```

---

## 💬 Contact & Questions

If you have questions during the bootcamp:
- Ask in the class chat
- Check the [Solana docs](https://solana.com/docs)
- Search [GitHub Issues](https://github.com/solana-foundation) on relevant projects
- Reach out to **Superteam Brazil**: [superteam.com.br](https://www.superteam.com.br/pt) · [@SuperteamBR](https://x.com/SuperteamBR) · [Wiki](https://wiki.superteam.com.br/)

---

## 📄 License

This project is licensed under the MIT License.

---

**Good luck with the bootcamp! 🚀 You're going to build amazing things on Solana!**

---

### 🗺️ Next Steps

1. ✅ Install the dependencies (Rust, Solana CLI, Anchor)
2. ✅ Configure your cluster (localhost or devnet)
3. ✅ Clone this repository and install dependencies
4. ✅ Run the first script (`cd scripts && npm run 01`)
5. ✅ Understand each concept as you run the scripts
6. ✅ Start the SuperBank project after the bootcamp
7. ✅ Build your own neobank! 🚀
