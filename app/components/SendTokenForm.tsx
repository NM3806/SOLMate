'use client';

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { sendSPLToken } from "@/utils/sendSPLToken";

interface MintedToken {
    name: string;
    symbol: string;
    amount: number;
    decimals: number;
    mint: string;
    ata: string;
    signature: string;
}

export default function SendTokenForm({ mintedTokens }: { mintedTokens: MintedToken[] }) {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const [recipient, setRecipient] = useState('');
    const [selectedMint, setSelectedMint] = useState('');
    const [amountToSend, setAmountToSend] = useState('');
    const [txSig, setTxSig] = useState('');
    const [error, setError] = useState('');

    const handleSend = async () => {
        try {
            setError('');
            if (!publicKey || !recipient || !selectedMint || !amountToSend) {
                setError("All fields are required");
                return;
            }

            const recipientKey = new PublicKey(recipient);
            const mintKey = new PublicKey(selectedMint);

            const selectedToken = mintedTokens.find(token => token.mint === selectedMint);
            if (!selectedToken) {
                setError("Selected token not found");
                return;
            }

            const tx = await sendSPLToken({
                connection,
                sender: publicKey,
                recipient: recipientKey,
                mint: mintKey,
                amount: Number(amountToSend),
                decimals: selectedToken.decimals
            });

            const signature = await sendTransaction(tx, connection);
            const latestBlockhash = await connection.getLatestBlockhash();
            await connection.confirmTransaction(
                {signature , ...latestBlockhash},
                "confirmed"
            );
            setTxSig(signature);

        } catch (err: any) {
            setError(err.message || "Transaction Failed");
        }
    };

    return (
        <div className="p-4 mt-8 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
            <h2 className="text-lg font-bold">Send Token</h2>

            <select
                className="w-full p-2 border rounded-lg"
                value={selectedMint}
                onChange={(e) => setSelectedMint(e.target.value)}
            >
                <option value="">Select Token</option>
                {mintedTokens.map((token) => (
                    <option key={token.mint} value={token.mint}>
                        {token.name} ({token.symbol})
                    </option>
                ))}
            </select>

            <input
                type="text"
                placeholder="Recipient Wallet Address"
                className="w-full p-2 border rounded-lg"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
            />
            <input
                type="number"
                placeholder="Amount"
                className="w-full p-2 border rounded-lg"
                value={amountToSend}
                onChange={(e) => setAmountToSend(e.target.value)}
            />
            <button
                onClick={handleSend}
                className="w-full bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700"
            >
                Send Tokens
            </button>

            {txSig && <p className="text-green-600 break-all">Tx Signature: {txSig}</p>}
            {error && <p className="text-red-600">{error}</p>}
        </div>
    );
}