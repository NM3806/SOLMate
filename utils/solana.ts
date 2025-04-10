import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  Keypair
} from "@solana/web3.js";

import {
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  createMintToInstruction,
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";

import {
  createCreateMetadataAccountV3Instruction,
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
  DataV2
} from '@metaplex-foundation/mpl-token-metadata';

// Main function to create & mint a new SPL token
export const createAndMintSPLToken = async ({
  connection,
  walletPublicKey,
  name,
  symbol,
  amount = 1,
  decimals = 0,
}: {
  connection: Connection,
  walletPublicKey: PublicKey,
  name: string,
  symbol: string,
  amount: number,
  decimals?: number,
}) => {
  const mintKeypair = Keypair.generate();
  const lamports = await connection.getMinimumBalanceForRentExemption(MINT_SIZE);
  const transaction = new Transaction();


  // 1. Create mint account + initialize mint
  transaction.add(
    SystemProgram.createAccount({
      fromPubkey: walletPublicKey,
      newAccountPubkey: mintKeypair.publicKey,
      lamports,
      space: MINT_SIZE,
      programId: TOKEN_PROGRAM_ID,
    }),
    createInitializeMintInstruction(
      mintKeypair.publicKey,
      decimals,
      walletPublicKey, // mint authority
      walletPublicKey  // freeze authority
    )
  );

  // 2. Create Associated Token Account (ATA)
  const ata = await getAssociatedTokenAddress(
    mintKeypair.publicKey,
    walletPublicKey
  );

  transaction.add(
    createAssociatedTokenAccountInstruction(
      walletPublicKey, // payer
      ata,             // ata
      walletPublicKey, // owner
      mintKeypair.publicKey
    )
  );

  // 3. Mint tokens to ATA
  transaction.add(
    createMintToInstruction(
      mintKeypair.publicKey,
      ata,
      walletPublicKey,
      amount
    )
  );

  // 4. Add metadata instruction
  const metadataPDA = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mintKeypair.publicKey.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  )[0];

  const metadataData: DataV2 = {
    name,
    symbol,
    uri: "https://example.com", // dummy URI
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null,
  };

  const metadataIx = createCreateMetadataAccountV3Instruction({
    metadata: metadataPDA,
    mint: mintKeypair.publicKey,
    mintAuthority: walletPublicKey,
    payer: walletPublicKey,
    updateAuthority: walletPublicKey,
  }, {
    createMetadataAccountArgsV3: {
      data: metadataData,
      isMutable: true,
      collectionDetails: null
    }
  });

  transaction.add(metadataIx);


  // 5. Partial sign with mintKeypair
  transaction.feePayer = walletPublicKey;
  transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  transaction.partialSign(mintKeypair);

  // 6. Let Phantom sign the rest
  const provider = (window as any).solana as any; // type assertion for Phantom
  const signedTx = await provider.signTransaction(transaction);

  // 7. Send and confirm transaction
  const rawSig = await connection.sendRawTransaction(signedTx.serialize());
  await connection.confirmTransaction(rawSig, 'confirmed');

  return {
    mint: mintKeypair.publicKey,
    ata,
    signature: rawSig,
  };
};
