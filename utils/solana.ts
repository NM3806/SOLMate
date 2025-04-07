import {
    Connection,
    PublicKey,
    Transaction,
    SystemProgram,
    Keypair
  } from "@solana/web3.js";
  
  import {
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    MINT_SIZE,
    createMintToInstruction,
    createInitializeMintInstruction,
    createAssociatedTokenAccountInstruction,
    getAssociatedTokenAddress,
  } from "@solana/spl-token";
  
  // Main function to create & mint a new SPL token
  export const createAndMintSPLToken = async ({
    connection,
    walletPublicKey,
    amount = 1,
    decimals = 0,
  }: {
    connection: Connection,
    walletPublicKey: PublicKey,
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
  
    // 4. Partial sign with mintKeypair
    transaction.feePayer = walletPublicKey;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction.partialSign(mintKeypair);
  
    // 5. Let Phantom sign the rest
    const provider = (window as any).solana as any; // type assertion for Phantom
    const signedTx = await provider.signTransaction(transaction);
  
    // 6. Send and confirm transaction
    const rawSig = await connection.sendRawTransaction(signedTx.serialize());
    await connection.confirmTransaction(rawSig, 'confirmed');
  
    return {
      mint: mintKeypair.publicKey,
      ata,
      signature: rawSig,
    };
  };
  