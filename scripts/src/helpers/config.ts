import {
  airdropFactory,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  generateKeyPairSigner,
  lamports,
  sendAndConfirmTransactionFactory,
  type Rpc,
  type RpcSubscriptions,
  type SolanaRpcApi,
  type SolanaRpcSubscriptionsApi,
  type KeyPairSigner,
} from "@solana/kit";

export type Client = {
  rpc: Rpc<SolanaRpcApi>;
  rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>;
  sendAndConfirm: ReturnType<typeof sendAndConfirmTransactionFactory>;
  airdrop: ReturnType<typeof airdropFactory>;
};

const RPC_URL = process.env.RPC_URL ?? "http://127.0.0.1:8899";
const WS_URL =
  process.env.WS_URL ?? RPC_URL.replace("http", "ws").replace("8899", "8900");

export function createClient(): Client {
  const rpc = createSolanaRpc(RPC_URL);
  const rpcSubscriptions = createSolanaRpcSubscriptions(WS_URL);
  const sendAndConfirm = sendAndConfirmTransactionFactory({
    rpc,
    rpcSubscriptions,
  });
  const airdrop = airdropFactory({ rpc, rpcSubscriptions });

  return { rpc, rpcSubscriptions, sendAndConfirm, airdrop };
}

export async function fundAccount(
  client: Client,
  address: Parameters<Client["airdrop"]>[0]["recipientAddress"],
  amountSol: number = 2,
): Promise<void> {
  await client.airdrop({
    recipientAddress: address,
    lamports: lamports(BigInt(amountSol * 1_000_000_000)),
    commitment: "confirmed",
  });
}

export async function createFundedKeypair(
  client: Client,
  amountSol: number = 2,
): Promise<KeyPairSigner> {
  const keypair = await generateKeyPairSigner();
  await fundAccount(client, keypair.address, amountSol);
  return keypair;
}

export { generateKeyPairSigner, lamports } from "@solana/kit";
