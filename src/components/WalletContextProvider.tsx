"use client";

import { Buffer } from "buffer";
import { FC, ReactNode, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

import "@solana/wallet-adapter-react-ui/styles.css";

// @solana/web3.js relies on the Node Buffer global, which doesn't exist in the browser.
if (typeof window !== "undefined") {
  window.Buffer = window.Buffer || Buffer;
}

export const SOLANA_NETWORK = "devnet";

export const WalletContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const endpoint = useMemo(() => clusterApiUrl(SOLANA_NETWORK), []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      {/* Phantom, Backpack and Solflare all register via the Wallet Standard,
          so they're auto-detected here without any extra adapter packages. */}
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
