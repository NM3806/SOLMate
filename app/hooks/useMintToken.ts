import { useState } from "react";
import { createAndMintSPLToken } from "@/utils/solana";
import { Connection, PublicKey } from "@solana/web3.js";

interface MintedToken {
    name: string;
    symbol: string;
    amount: number;
    decimals: number;
    mint: string;
    ata: string;
    signature: string;
}

export function useMintToken(connection: Connection, walletPublicKey: PublicKey | null) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [mintedTokens, setMintTokens] = useState<MintedToken[]>([]);

    const mintToken = async (name: string, symbol: string, amount: number, decimals: number) => {
        if (!walletPublicKey) {
            setError("Connect your wallet first!");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const result = await createAndMintSPLToken({
                connection,
                walletPublicKey,
                name,
                symbol,
                amount,
                decimals
            });

            const token = {
                name,
                symbol,
                amount,
                decimals,
                mint: result.mint.toBase58(),
                ata: result.ata.toBase58(),
                signature: result.signature,
            }

            setMintTokens((prev) => [...prev, token]);
            
        } catch (err) {
            console.error(err);
            setError("Failed to create/mint token.");
        } finally {
            setLoading(false);
        }
    };

    return { mintToken, mintedTokens, loading, error };
}