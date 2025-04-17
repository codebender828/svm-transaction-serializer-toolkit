# SVM Transaction Serialization Toolkit

This toolkit helps you serialize Solana or Sonic transactions into different formats (Base58 and Base64) that can be used with Squads Protocol or with Explorer Inspection.

It's particularly useful for creating transactions that can be proposed to Squads vaults via the UI or to Kronus UI.

## Prerequisites

- [Bun](https://bun.sh) installed (v1.1.18 or later)
- A Solana wallet with some SOL
- A Squads vault address

## Installation

```bash
bun install
```

## Configuration

The toolkit provides two examples for different types of transfers:

### 1. SOL Transfer (`src/serialize-transaction-to-base58.ts`)

Before running the SOL transfer example, configure:

```typescript
const RPC_ENDPOINT = "https://api.mainnet-alpha.sonic.game"; // Your Solana RPC endpoint
const FEE_PAYER_PUBKEY = "YOUR_VAULT_PUBKEY"; // Your Squads vault address
const RECIPIENT_PUBKEY = new PublicKey("RECIPIENT_ADDRESS"); // The address that will receive the SOL transfer
```

### 2. SPL Token Transfer (`src/transfers/transfer-spl-token.ts`)

Before running the SPL token transfer example, configure:

```typescript
const RPC_ENDPOINT = "https://api.mainnet-alpha.sonic.game"; // Your Solana RPC endpoint
const FEE_PAYER_PUBKEY = "YOUR_VAULT_PUBKEY"; // Your Squads / Kronus vault address
const RECIPIENT_PUBKEY = new PublicKey("RECIPIENT_ADDRESS"); // The address that will receive the tokens
const TOKEN_MINT = new PublicKey("YOUR_TOKEN_MINT_ADDRESS"); // The mint address of the token you want to transfer
```

## Usage

### SOL Transfer Example

To run the SOL transfer example:

```bash
bun run src/serialize-transaction-to-base58.ts
```

This will:

1. Create a transaction that transfers 0.001 SOL from your vault to the specified recipient
2. Serialize it to Base64
3. Convert it to Base58 format for Squads

### SPL Token Transfer Example

To run the SPL token transfer example:

```bash
bun run src/transfers/transfer-spl-token.ts
```

This will:

1. Create a transaction that transfers SPL tokens from your vault to the specified recipient
2. Automatically create an associated token account for the recipient if it doesn't exist
3. Serialize it to Base64
4. Convert it to Base58 format for Squads

Note: The SPL token example uses the Token-2022 program, which is used by $SONIC on Sonic Mainnet.

## Output

When you run either script, you'll see:

1. The Base64 transaction string
2. The Base58 transaction string
3. A reminder of which vault address to use when proposing the transaction

## Using the Output

1. Copy the Base58 transaction string
2. Go to your Squads interface
3. Use the "Propose Transaction" feature
4. Paste the Base58 transaction string
5. Select your vault (the one you configured in `FEE_PAYER_PUBKEY`)
6. Submit the proposal

## Customizing Transactions

To create different types of transactions:

1. Modify the transfer instructions in the respective script
2. You can add more instructions using the `instructions` array
3. The scripts will automatically handle the serialization

## Troubleshooting

If you encounter issues:

1. Make sure your RPC endpoint is working
2. Verify your vault address is correct
3. Ensure your vault has enough SOL for the transaction
4. Check that you have the correct permissions on the vault
5. For SPL token transfers, verify that:
   - The token mint address is correct
   - The source token account exists and has enough tokens
   - The fee payer has permission to transfer from the source account

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.
