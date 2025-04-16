import {
  Connection,
  Keypair,
  MessageV0,
  PublicKey,
  Transaction,
  TransactionMessage,
  VersionedMessage,
  VersionedTransaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import bs58 from "bs58";

// Configuration - Replace these values as needed
const RPC_ENDPOINT = "https://api.mainnet-alpha.sonic.game";
// Replace with your Vault address for Kronus or Squads UI
const FEE_PAYER_PUBKEY = "22H68uiLZeu3Pvz2ZuDjoGXeJkbVK4VShJE3SR1zd4Cw";
// Replace with your recipient public key
const RECIPIENT_PUBKEY = new PublicKey(
  "JDXSdmTg22GdKgKH5QM2g2ftT1mpiQqLHuW9wLuvKBmU"
);

const connection = new Connection(RPC_ENDPOINT);

// Create a transfer instruction
const transferInstruction = SystemProgram.transfer({
  fromPubkey: new PublicKey(FEE_PAYER_PUBKEY),
  toPubkey: RECIPIENT_PUBKEY,
  lamports: 0.001 * LAMPORTS_PER_SOL, // Transfer 0.001 SOL
});

// Create a transaction message
const message = new TransactionMessage({
  payerKey: new PublicKey(FEE_PAYER_PUBKEY),
  recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
  instructions: [transferInstruction],
}).compileToV0Message();

// Create and serialize the versioned transaction
const tx = new VersionedTransaction(message);
const serializedTransaction = tx.serialize();
const base64Transaction = Buffer.from(serializedTransaction).toString("base64");

console.log("Base64 Transaction:", base64Transaction);

// Signer / FeePayer Account. For Kronus or Squads UI this should be a Vault address.
const feePayer = new PublicKey(FEE_PAYER_PUBKEY);

let txInstructions = TransactionMessage.decompile(tx.message).instructions;
const legacyMessage = new TransactionMessage({
  payerKey: feePayer,
  recentBlockhash:
    tx.message.recentBlockhash ||
    (await connection.getLatestBlockhash()).blockhash,
  instructions: [...txInstructions],
}).compileToLegacyMessage();

const bs58SerializedTransactionMessage = bs58.encode(legacyMessage.serialize());

console.log("===================");
console.log("Base58 Transaction:", bs58SerializedTransactionMessage);
console.log("===================");
console.log(
  `You may now propose this transaction to your Squad on vault pubkey: ${FEE_PAYER_PUBKEY}`
);
