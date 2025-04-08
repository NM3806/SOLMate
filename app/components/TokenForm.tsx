"use client";

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import TransactionStatus from "./TransactionStatus";
import { createAndMintSPLToken } from "@/utils/solana";


interface MintedToken {
    name: string;
    symbol: string;
    amount: number;
    decimals: number;
    mint: string;
    ata: string;
    signature: string;
}

export default function TokenForm({
    mintedTokens,
    setMintedTokens
}: {
    mintedTokens: MintedToken[],
    setMintedTokens: React.Dispatch<React.SetStateAction<MintedToken[]>>
}) {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [amount, setAmount] = useState('');
    const [decimals, setDecimals] = useState('0');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || isNaN(Number(amount)) || !name || !symbol) return;

        try {
            setLoading(true);
            setError(null);

            const rawToken = await createAndMintSPLToken({
                connection,
                walletPublicKey: publicKey!,
                name,
                symbol,
                amount: Number(amount),
                decimals: Number(decimals),
            });                     

            const token: MintedToken = {
                name,
                symbol,
                amount: Number(amount),
                decimals: Number(decimals),
                mint: rawToken.mint.toBase58(),
                ata: rawToken.ata.toBase58(),
                signature: rawToken.signature,
            };

            setMintedTokens((prev) => [token, ...prev]);
            
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }

    };

    return (
        <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto space-y-4 bg-white rounded-2xl shadow-md">
            <h2 className="text-xl font-bold text-center">Create & Mint Token</h2>

            <input
                type="text"
                placeholder="Token Name"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <input
                type="text"
                placeholder="Token Symbol"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
            />

            <input
                type="number"
                placeholder="Token Amount"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />

            <input
                type="number"
                placeholder="Decimals (default 0)"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={decimals}
                onChange={(e) => setDecimals(e.target.value)}
            />

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700"
            >
                {loading ? 'Processing...' : 'Create & Mint'}
            </button>

            <TransactionStatus status={
                loading ? 'loading' : error ? 'error' : mintedTokens.length > 0 ? 'success' : 'idle'
            } message={error || (mintedTokens.length > 0 ? 'Minted successfully!' : undefined)} />


        </form>
    );
}