"use client";

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { createAndMintSPLToken } from "@/utils/solana";
import TransactionStatus from "./TransactionStatus";

interface MintedToken {
    name: string;
    symbol: string;
    amount: number;
    decimals: number;
    mint: string;
    ata: string;
    signature: string;
}

export default function TokenForm() {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [amount, setAmount] = useState('');
    const [decimals, setDecimals] = useState('0');
    const [mintedTokens, setMintedTokens] = useState<MintedToken[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!publicKey) {
            setError('Connect your wallet first!');
            return;
        }

        if (!amount || isNaN(Number(amount)) || !name || !symbol) {
            setError('Please fill in fields correctly.');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const result = await createAndMintSPLToken({
                connection,
                walletPublicKey: publicKey,
                name,
                symbol,
                amount: Number(amount),
                decimals: Number(decimals)
            });


            setMintedTokens(prev => [
                ...prev, {
                    name,
                    symbol,
                    amount: Number(amount),
                    decimals: Number(decimals),
                    mint: result.mint.toBase58(),
                    ata: result.ata.toBase58(),
                    signature: result.signature
                }
            ]);
        } catch (err: any) {
            console.error(err);
            setError('Failed to create/mint token.');
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

            {mintedTokens.map((token, i) => (
                <div key={i} className="p-2 border border-green-400 bg-green-50 rounded-lg text-sm space-y-1">
                    <p>
                        <strong>{token.name}</strong> (${token.symbol})
                    </p>
                    <p>Amount: {token.amount} | Decimals: {token.decimals}</p>
                    <p>Mint Address: <span className="break-all">{token.mint}</span></p>
                    <p>ATA: <span className="break-all">{token.ata}</span></p>
                    <p>Signature: <span className="break-all">{token.signature}</span></p>
                </div>
            ))};
        </form>
    );
}