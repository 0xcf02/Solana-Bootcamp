# 🏦 Solana Bootcamp — SuperBank Boilerplate

Welcome! This repo is the **zero-friction starting point** for our 50-minute
live-coding session. By the end, you'll have a working Neobank dApp — "SuperBank" —
running on Solana **devnet**, built almost entirely by pasting one prompt into
an AI IDE.

No local Rust/Solana CLI install required. Everything runs inside a
**Devcontainer** that's pre-configured with all the tooling.

---

## 📋 Table of Contents

- [Step 1 — Requirements](#step-1--requirements)
- [Step 2 — Clone & Open in Devcontainer](#step-2--clone--open-in-devcontainer)
- [Step 3 — Choose Your IDE](#step-3--choose-your-ide)
- [Step 4 — The Prompt-Along 🚀](#step-4--the-prompt-along-)
- [Step 5 — Fallback (No Local Setup Works)](#step-5--fallback-if-your-local-environment-fails)
- [Troubleshooting](#-troubleshooting)
- [Bonus Material](#-bonus-material)

---

## Step 1 — Requirements

Before the session starts, make sure you have:

1. **Docker Desktop** installed and running.
   → [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. **VS Code**, **Cursor**, or **Windsurf** installed (any one is fine).
   → [VS Code](https://code.visualstudio.com/) · [Cursor](https://www.cursor.com/) · [Windsurf](https://windsurf.com/)
3. **Phantom Wallet** installed as a browser extension, switched to **Devnet**.
   → [Install Phantom](https://phantom.com/download)
   → Open Phantom → Settings → Developer Settings → Change Network → **Devnet**
4. Some **Devnet SOL** in your Phantom wallet (it's free, fake SOL for testing):
   → [Solana Faucet](https://faucet.solana.com/) — paste your wallet address and request SOL.

> 💡 You do **not** need to install Node.js, Rust, or the Solana CLI locally —
> the Devcontainer handles all of that for you.

---

## Step 2 — Clone & Open in Devcontainer

```bash
git clone https://github.com/0xcf02/Solana-Bootcamp.git
cd Solana-Bootcamp
code .
```

When VS Code opens, you should see a popup in the bottom-right corner:

> **"Folder contains a Dev Container configuration file. Reopen in Container?"**

Click **"Reopen in Container"**.

If you don't see the popup:

1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type `Dev Containers: Reopen in Container`
3. Press Enter

The first build takes **2–4 minutes** — it installs Node.js 20, Rust, the Solana
CLI, and runs `npm install` automatically. Grab a coffee ☕.

Once it's done, start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see the
**SuperBank** starter page with a "Select Wallet" button already working.
Connect your Phantom wallet to confirm everything is wired up correctly.

---

## Step 3 — Choose Your IDE

You have three equally valid options for the live-coding part. Pick whichever
you already have set up:

| Option | How it works |
|---|---|
| **Cursor** (recommended) | Open this same folder in Cursor. It automatically reads the `.cursorrules` file in the repo root, which tells the AI how to write Solana code correctly. |
| **Windsurf** | Same idea — open the folder in Windsurf and use its built-in AI chat (Cascade) to paste the prompt below. |
| **VS Code + Web AI** | Staying in VS Code inside the Devcontainer? Just paste the prompt from Step 4 into **Claude**, **ChatGPT**, or **GitHub Copilot Chat**, then paste the generated code into `src/app/page.tsx` and related files yourself. |

> The `.cursorrules` file is only read by Cursor/Windsurf-style tools. If
> you're copy-pasting into a web chat instead, that's fine — the master
> prompt already contains all the rules the AI needs.

---

## Step 4 — The Prompt-Along 🚀

This is the main event. With your Devcontainer running and your IDE's AI chat
open, paste the **entire prompt block below** in a single message. Don't wait
for it to ask follow-up questions — let it generate the full app in one pass.

````
Act as a Senior Fullstack Solana Developer. I have a Next.js project with Solana Wallet Adapter configured.
We need to build a single-page Neobank app on the devnet called "SuperBank".

Build the complete UI and integration in a single pass. Do not wait for confirmations. All codes and comments must be written in English.

Requirements:
1. UI/UX: Create a modern, clean dark theme. Prominently display the connected wallet address and the user's SOL balance.
2. Custom SPL Token: Include a section to create a custom token called "SuperReal" (Symbol: SREAL, 9 decimals) with a "Create Token" button. Display the Mint Address with a link to Solana Explorer (devnet) once created.
3. Mint Functionality: Add an input field for the amount and a "Mint" button to mint SREAL tokens to the connected wallet. Display the SREAL balance in the dashboard.
4. Transfer (Send): Create an interface with "Recipient Address", "Amount", and a "Send" button. The logic must handle the transfer and auto-create the recipient's Associated Token Account (ATA) if it does not exist using getOrCreateAssociatedTokenAccount logic via client-side transactions.
5. Notifications: After any successful on-chain action (Create, Mint, Send), trigger a toast notification containing the transaction signature linked to explorer.solana.com/?cluster=devnet.

Ensure you use @solana/web3.js and @solana/spl-token packages correctly. Use TailwindCSS for styling. Make the send/receive actions the primary focus of the UI.
````

**While the AI generates code**, keep an eye on:

- It should edit `src/app/page.tsx` (and may add small components under `src/components/`) — the wallet connection in `layout.tsx` is already done, so it shouldn't need to touch that.
- It should use the `@solana/web3.js` classic API (`Connection`, `Transaction`, `Keypair`) — not `@solana/kit`.
- Every action (Create Token, Mint, Send) should end with a **toast** containing a clickable Explorer link.

Once it finishes, save all files and check your browser at `localhost:3000` —
`npm run dev` hot-reloads automatically.

### 🧪 Test the golden path

1. Connect your Phantom wallet (Devnet).
2. Click **Create Token** → wait for confirmation toast → note the Mint Address.
3. Enter an amount and click **Mint** → check your SREAL balance updates.
4. Paste a friend's wallet address, enter an amount, click **Send** → confirm
   their ATA gets created and the transfer succeeds.
5. Click each toast's Explorer link to verify the transaction on
   [explorer.solana.com](https://explorer.solana.com/?cluster=devnet).

---

## Step 5 — Fallback (If Your Local Environment Fails)

Docker acting up, container build failing, or your machine just isn't
cooperating? **Don't lose time debugging during the session.**

1. Go to **[trynoah.ai](https://trynoah.ai)**
2. Paste the exact same master prompt from [Step 4](#step-4--the-prompt-along-)
3. Let it scaffold and run the app entirely in the browser — no local setup needed.

This keeps you building instead of debugging your machine. You can always
come back and get the Devcontainer working after the session.

---

## 🔧 Troubleshooting

**"Reopen in Container" popup never showed up**
→ `Ctrl+Shift+P` → `Dev Containers: Reopen in Container`

**Devcontainer build fails / hangs**
→ Make sure Docker Desktop is actually running (check the whale icon in your
system tray). Restart Docker Desktop and try again. If it still fails, use
the [fallback in Step 5](#step-5--fallback-if-your-local-environment-fails).

**"Module not found" when running `npm run dev`**
→ Run `npm install` manually inside the container terminal.

**Wallet won't connect / "Phantom not detected"**
→ Make sure the Phantom browser extension is installed and unlocked in the
same browser you're using to view `localhost:3000`.

**Transactions fail with "insufficient funds"**
→ Your wallet needs Devnet SOL. Get more from the
[Solana Faucet](https://faucet.solana.com/) (limited to a few SOL per request).

**AI generated code that uses `@solana/kit` instead of `@solana/web3.js`**
→ Remind it: *"Use the classic @solana/web3.js v1 syntax, not @solana/kit."*
This is already enforced by `.cursorrules` in Cursor/Windsurf, but web-based
chats sometimes need a nudge.

---

## 📚 Bonus Material

Want to go deeper after the bootcamp?

- **[`hackathon-playbook.md`](./hackathon-playbook.md)** — a full playbook for
  Solana/Web3 hackathons: ideation, team formation, and shipping fast.
- **[`scripts/`](./scripts)** — a standalone CLI with 12 guided TypeScript
  lessons (keypairs, transactions, PDAs, CPIs, Token-2022, Solana Actions,
  x402 micropayments) for a deeper dive into `@solana/kit`.

### Useful Links

- [Solana Docs](https://solana.com/docs)
- [Solana Explorer (Devnet)](https://explorer.solana.com/?cluster=devnet)
- [Solana Faucet](https://faucet.solana.com/)
- [Phantom Wallet](https://phantom.com/download)
- [@solana/web3.js Reference](https://solana-labs.github.io/solana-web3.js/)
- [Solana Wallet Adapter](https://github.com/anza-xyz/wallet-adapter)

---

**Good luck, and have fun building SuperBank! 🚀**
