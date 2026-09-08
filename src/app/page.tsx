"use client";

import dynamic from "next/dynamic";

// WalletMultiButton touches `window`, so it must be rendered client-side only.
const WalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-3xl font-bold">SuperBank 🏦</h1>
      <p className="max-w-md text-neutral-400">
        Wallet connection is already wired up on devnet. Paste the master
        prompt from the README into your AI IDE to build the rest of the
        Neobank dashboard.
      </p>
      <WalletMultiButton />
    </main>
  );
}
