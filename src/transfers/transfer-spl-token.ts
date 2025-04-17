import {
  Connection,
  MessageV0,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import bs58 from "bs58";
import {
  TOKEN_2022_PROGRAM_ID,
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";

// Configuration - Replace these values as needed
const RPC_ENDPOINT = "https://api.mainnet-alpha.sonic.game";
const FEE_PAYER_PUBKEY = "8jsqTz5BgzMEzZuPaQ2VygtUUjTPchTvVFx2Bd1Ld2fi"; // Replace with your Vault address for Kronus or Squads UI
const RECIPIENT_PUBKEY = new PublicKey(
  "6MT77QhWFm6KFtKkT3MuxSRvsAFD7tdeqXaUs8a1Te4C"
);

// SPL Token Configuration
const TOKEN_MINT = new PublicKey("mrujEYaN1oyQXDHeYNxBYpxWKVkQ2XsGxfznpifu4aL"); // Replace with your token's mint address

const connection = new Connection(RPC_ENDPOINT);

// Get the associated token account address for the source (vault)
const sourceTokenAccount = await getAssociatedTokenAddress(
  TOKEN_MINT,
  new PublicKey(FEE_PAYER_PUBKEY),
  // Need to allow the owner off-curve since
  // we are transferring from a Vault PDA
  true,
  TOKEN_2022_PROGRAM_ID
);

// Get the associated token account address for the recipient
const destinationTokenAccount = await getAssociatedTokenAddress(
  TOKEN_MINT,
  RECIPIENT_PUBKEY,
  true,
  TOKEN_2022_PROGRAM_ID
);

// Check if the destination token account exists
const destinationAccountInfo = await connection.getAccountInfo(
  destinationTokenAccount
);
const instructions = [];

// If the destination token account doesn't exist, create it
if (!destinationAccountInfo) {
  const createATAInstruction = createAssociatedTokenAccountInstruction(
    new PublicKey(FEE_PAYER_PUBKEY), // payer
    destinationTokenAccount, // ata
    RECIPIENT_PUBKEY, // owner
    TOKEN_MINT, // mint
    TOKEN_2022_PROGRAM_ID // Token program ID ($SONIC on Sonic Mainnet uses Token-2022 standard)
  );
  instructions.push(createATAInstruction);
}

// Create SPL Token Transfer instruction
const SPLTokenTransferInstruction = createTransferInstruction(
  sourceTokenAccount, // Source token account
  destinationTokenAccount, // Destination token account
  new PublicKey(FEE_PAYER_PUBKEY), // Owner of source token account
  0.1 * 10 ** 9, // Amount in token's smallest unit (e.g., 1 USDC = 1000000)
  [], // Additional signers
  TOKEN_2022_PROGRAM_ID // Token program ID ($SONIC on Sonic Mainnet uses Token-2022 standard)
);
instructions.push(SPLTokenTransferInstruction);

// Create a transaction message with all instructions
const message = new TransactionMessage({
  payerKey: new PublicKey(FEE_PAYER_PUBKEY),
  recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
  instructions,
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
