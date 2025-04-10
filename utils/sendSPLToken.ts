import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction,
         createTransferInstruction, TOKEN_PROGRAM_ID } from "@solana/spl-token";

export async function sendSPLToken({
    connection,
    sender,
    recipient,
    mint,
    amount,
    decimals,
} : {
    connection: Connection,
    sender: PublicKey,
    recipient: PublicKey,
    mint: PublicKey,
    amount: number,
    decimals: number
}) {
    const senderATA = await getAssociatedTokenAddress(mint, sender);
    const recipientATA = await getAssociatedTokenAddress(mint, recipient);
    
    const transaction = new Transaction();

    //create recipient's ATA if it doesn't exist
    const ataInfo = await connection.getAccountInfo(recipientATA);
    if (!ataInfo) {
        transaction.add(
            createAssociatedTokenAccountInstruction(
                sender,
                recipientATA,
                recipient,
                mint
            )
        );
    }

    //transfer tokens 
    const scaledAmount = amount * Math.pow(10, decimals);

    transaction.add(
        createTransferInstruction(
            senderATA,
            recipientATA,
            sender,
            scaledAmount,
            [],
            TOKEN_PROGRAM_ID,
        )
    );

    const latestBlockhash = await connection.getLatestBlockhash();

    transaction.recentBlockhash = latestBlockhash.blockhash;
    transaction.feePayer = sender;

    return transaction;
};