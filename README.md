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

Before running the script, you'll need to configure a few things:

1. Open `src/serialize-transaction-to-base58.ts`
2. Update the following constants at the top of the file:
   ```typescript
   const RPC_ENDPOINT = "https://api.mainnet-alpha.sonic.game"; // Your Solana RPC endpoint
   const FEE_PAYER_PUBKEY = "YOUR_VAULT_PUBKEY"; // Your Squads vault address
   const RECIPIENT_PUBKEY = new PublicKey("RECIPIENT_ADDRESS"); // The address that will receive the SOL transfer
   ```

## Usage

The script demonstrates how to:

1. Create a new legacy transaction
2. Serialize it to Base64
3. Convert it to Base58 format for Squads

To run the script:

```bash
bun run src/serialize-transaction-to-base58.ts
```

## What the Script Does

1. **Creates a Legacy Transaction**: The script creates a legacy Solana transaction that transfers 0.001 SOL from your vault to the specified recipient address.
2. **Serializes to Base64**: The transaction is serialized to Base64 format.
3. **Converts to Base58**: The transaction is then converted to Base58 format, which is compatible with Squads.

The script uses the legacy `Transaction` type instead of the newer `VersionedTransaction` type, as this is more straightforward and directly compatible with Squads' requirements.

## Output

When you run the script, you'll see two important pieces of information:

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

1. Modify the `transferInstruction` in the script
2. You can add more instructions using `tx.add()` method
3. The script will automatically handle the serialization

## Troubleshooting

If you encounter issues:

1. Make sure your RPC endpoint is working
2. Verify your vault address is correct
3. Ensure your vault has enough SOL for the transaction
4. Check that you have the correct permissions on the vault

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.
