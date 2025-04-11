import { Connection, PublicKey } from "@solana/web3.js";
import { getAccount, getMint, getAssociatedTokenAddress } from "@solana/spl-token";

export async function fetchUserTokens (connection: Connection, wallet: PublicKey) {
    const tokens = await connection.getParsedTokenAccountsByOwner(wallet, {
        programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
    });

    return tokens.value
        .map(({pubkey, account}) => {
            const info = account.data.parsed.info;
            return {
                mint: info.mint,
                amount: info.tokenAmount.uiAmount,
                decimals: info.tokenAmount.decimals,
            };
        }).filter(token => token.amount > 0);
}