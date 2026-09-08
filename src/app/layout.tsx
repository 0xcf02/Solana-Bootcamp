import type { Metadata } from "next";
import { WalletContextProvider } from "@/components/WalletContextProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "SuperBank | Solana Bootcamp",
  description: "A Solana devnet neobank built live during the Solana Bootcamp.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <WalletContextProvider>{children}</WalletContextProvider>
      </body>
    </html>
  );
}
