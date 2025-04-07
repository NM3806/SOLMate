"use client";

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { createAndMintSPLToken } from "@/utils/solana";
import TransactionStatus from "./TransactionStatus";

export default function TokenForm() {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const [amount, setAmount] = useState('');
    const [mintAddress, setMintAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!publicKey) {
            setError('Connect your wallet first!');
            return;
        }

        if (!amount || isNaN(Number(amount))) {
            setError('Please enter a valid amount.');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const result = await createAndMintSPLToken({
                connection,
                walletPublicKey: publicKey,
                amount: Number(amount),
                decimals: 0
            });


            setMintAddress(result.mint.toBase58());
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
                type="number"
                placeholder="Token Amount"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700"
            >
                {loading ? 'Processing...' : 'Create & Mint'}
            </button>

            <TransactionStatus status={
                loading ? 'loading' : error ? 'error' : mintAddress ? 'success' : 'idle'
            } message={error || (mintAddress && 'Minted successfully!')} />

            {mintAddress && (
                <p className="text-green-600 text-sm break-all">
                    Minted! Mint Address: {mintAddress}
                </p>
            )}

            {error && (
                <p className="text-red-500 text-sm">{error}</p>
            )}
        </form>
    );
}