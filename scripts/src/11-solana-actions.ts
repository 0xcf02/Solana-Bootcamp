/**
 * Lesson 11 - Solana Actions (Blinks)
 *
 * Core concept: Solana Actions are HTTP APIs that return unsigned transactions.
 * Any URL can become a payment button (Blink). The server is a transaction
 * factory -- it never holds private keys. The wallet signs and sends.
 *
 * Uses @solana/web3.js 1.x + @solana/actions + express because the Actions
 * SDK expects legacy Transaction types.
 */

import express from "express";
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  createPostResponse,
  actionCorsMiddleware,
  type ActionGetResponse,
  type ActionPostRequest,
} from "@solana/actions";
import {
  banner,
  step,
  success,
  info,
  keyValue,
  divider,
  formatAddress,
} from "./helpers/display.js";

const PORT = parseInt(process.env.PORT ?? "8080", 10);
const BASE_URL = `http://localhost:${PORT}`;
const RPC_URL = process.env.RPC_URL ?? "http://127.0.0.1:8899";

export async function main(): Promise<void> {
  banner("Lesson 11: Solana Actions (Blinks)");

  info("Solana Actions turn any URL into a transaction endpoint.");
  info('A "Blink" is a shareable link that unfurls into a wallet interaction.');
  info("The server builds unsigned transactions; the wallet signs and sends.");
  divider();

  // ── Generate a recipient keypair for the tip jar ─────────────────────

  const tipJarKeypair = Keypair.generate();
  const tipJarAddress = tipJarKeypair.publicKey;

  info("Generated a tip jar recipient address for this demo.");
  keyValue("Tip Jar", formatAddress(tipJarAddress.toBase58()));
  divider();

  // ── Build the Express server ─────────────────────────────────────────

  const app = express();
  app.use(express.json());
  app.use(actionCorsMiddleware({}));

  // actions.json -- tells wallets/blink clients which routes are Actions
  app.get("/actions.json", (_req, res) => {
    res.json({
      rules: [{ pathPattern: "/api/actions/tip", apiPath: "/api/actions/tip" }],
    });
  });

  // GET /api/actions/tip -- return Action metadata (what the blink renders)
  app.get("/api/actions/tip", (_req, res) => {
    const response: ActionGetResponse = {
      type: "action",
      icon: "https://ucarecdn.com/7aa46c85-08a4-4bc7-9376-88ec48bb1f43/-/preview/880x864/-/quality/smart/-/format/auto/",
      title: "Tip Jar",
      description: "Send a tip to the bootcamp instructor!",
      label: "Send Tip",
      links: {
        actions: [
          {
            type: "transaction",
            label: "Tip 0.1 SOL",
            href: "/api/actions/tip?amount=0.1",
          },
          {
            type: "transaction",
            label: "Tip 0.5 SOL",
            href: "/api/actions/tip?amount=0.5",
          },
          {
            type: "transaction",
            label: "Tip 1 SOL",
            href: "/api/actions/tip?amount=1",
          },
        ],
      },
    };
    res.json(response);
  });

  // POST /api/actions/tip -- build an unsigned transfer transaction
  app.post("/api/actions/tip", async (req, res) => {
    try {
      const { account } = req.body as ActionPostRequest;
      const amount = parseFloat(req.query.amount as string) || 0.1;

      const connection = new Connection(RPC_URL);
      const sender = new PublicKey(account);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: sender,
          toPubkey: tipJarAddress,
          lamports: Math.round(amount * LAMPORTS_PER_SOL),
        }),
      );

      transaction.feePayer = sender;
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;

      const response = await createPostResponse({
        fields: {
          type: "transaction",
          transaction,
          message: `Sending ${amount} SOL tip!`,
        },
      });

      res.json(response);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      res.status(400).json({ error: message });
    }
  });

  // ── Start the server ─────────────────────────────────────────────────

  const server = await new Promise<ReturnType<typeof app.listen>>((resolve) => {
    const s = app.listen(PORT, () => resolve(s));
  });

  success(`Actions server running on ${BASE_URL}`);
  divider();

  // ── Step 1: Fetch actions.json ───────────────────────────────────────

  step(1, "GET /actions.json -- blink routing rules");
  info("Wallets and blink clients fetch this to discover Action endpoints.");

  const actionsJsonRes = await fetch(`${BASE_URL}/actions.json`);
  const actionsJson = await actionsJsonRes.json();

  success("Received actions.json");
  keyValue("Rules", JSON.stringify(actionsJson.rules, null, 2));
  info("pathPattern maps URL paths to their Action API handlers.");
  divider();

  // ── Step 2: Fetch Action metadata ────────────────────────────────────

  step(2, "GET /api/actions/tip -- Action metadata");
  info(
    "This is what a blink client renders: icon, title, description, buttons.",
  );

  const metadataRes = await fetch(`${BASE_URL}/api/actions/tip`);
  const metadata = (await metadataRes.json()) as ActionGetResponse;

  success("Received Action metadata");
  keyValue("Title", metadata.title);
  keyValue("Description", metadata.description);
  keyValue("Label", metadata.label);

  if (metadata.links?.actions) {
    info("Available actions (buttons the user sees):");
    for (const action of metadata.links.actions) {
      keyValue(`  Button`, `"${action.label}" -> ${action.href}`);
    }
  }

  info("The wallet renders these as clickable buttons in the blink UI.");
  divider();

  // ── Step 3: POST to build an unsigned transaction ────────────────────

  step(3, "POST /api/actions/tip?amount=0.1 -- build unsigned transaction");
  info(
    "The wallet sends the user's public key. The server returns a base64 transaction.",
  );

  const testWallet = Keypair.generate();

  const postRes = await fetch(`${BASE_URL}/api/actions/tip?amount=0.1`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ account: testWallet.publicKey.toBase58() }),
  });
  const postData = await postRes.json();

  success("Received unsigned transaction");
  keyValue("Message", postData.message ?? "(none)");

  if (postData.transaction) {
    const txPreview =
      postData.transaction.length > 80
        ? postData.transaction.slice(0, 80) + "..."
        : postData.transaction;
    keyValue("Transaction (base64)", txPreview);
    keyValue("Full length", `${postData.transaction.length} chars`);
  }

  divider();

  // ── Summary ──────────────────────────────────────────────────────────

  info("How the full flow works in production:");
  info("  1. User clicks a blink link (shared URL, embedded in a tweet, etc.)");
  info("  2. Wallet/client fetches GET /actions.json to discover the Action");
  info(
    "  3. Wallet/client fetches GET /api/actions/tip for metadata (icon, buttons)",
  );
  info(
    "  4. User picks a button -> wallet POSTs their pubkey to the Action URL",
  );
  info("  5. Server builds an unsigned transaction and returns it as base64");
  info("  6. Wallet deserializes, shows the user what it does, user signs");
  info("  7. Wallet sends the signed transaction to the network");
  divider();
  info("The server is a transaction factory. It NEVER holds private keys.");
  info("The wallet signs and sends. Separation of concerns at its best.");
  divider();

  // ── Clean shutdown ───────────────────────────────────────────────────

  await new Promise<void>((resolve) => server.close(() => resolve()));
  success("Server shut down. Lesson 11 complete!");
}

main().catch(console.error);
