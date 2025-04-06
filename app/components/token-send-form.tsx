"use client";

import { useState } from "react";
import { useWalletContext } from "../context/wallet-context";
import { getAssociatedTokenAddress, getAccount, createTransferInstruction } from "@solana/spl-token";
import { toast } from "react-hot-toast";
import { PublicKey } from "@solana/web3.js";
import { Transaction } from '@solana/web3.js'

export function TokenSendForm({mintAddress} : {mintAddress: string}) {
    const { publicKey, connection, wallet } = useWalletContext();
    const [recipent, setRecipent] = useState('');
    const [amount, setAmount] = useState(1);
    const [isSending, setIsSending] = useState(false);

    const handleSubmit = async (e : React.FormEvent) => {
        e.preventDefault();

        if (!publicKey || !wallet) {
            toast.error("please connect your wallet first");
            return;
        }

        if (!recipent || !amount) {
            toast.error('Please fill in all fields');
            return;
        }

        let recipentPubkey
        try {
            recipentPubkey = new PublicKey(recipent)
        } catch (error) {
            toast.error("Invalid recipient address");
            return;
        }

        const amountNumber = Number(amount);
        if (isNaN(amountNumber) || amountNumber <= 0) {
            toast.error("Invalid amount");
            return;
        }

        setIsSending(true);

        try {
            const mintPublicKey = new PublicKey(mintAddress);

            // Get the sender's associated token account 
            const senderTokenAccount = await getAssociatedTokenAddress(
                mintPublicKey,
                publicKey
            )
            
            // get the recipient's associated token account
            const recipentTokenAccount = await getAssociatedTokenAddress(
                mintPublicKey,
                recipentPubkey
            )

            const transaction = new Transaction().add(
                createTransferInstruction(
                    senderTokenAccount,
                    recipentTokenAccount,
                    publicKey,
                    amountNumber * Math.pow(10, 9)
                ,[])
            )

            const signature = await wallet.sendTransaction(transaction, connection, {
                signers: [publicKey],
            })

            await connection.confirmTransaction(signature, 'processed')

            toast.success(
                <div>
                  <p>Tokens sent successfully!</p>
                  <p className="text-xs mt-1 font-mono break-all">
                    Transaction: {signature}
                  </p>
                </div>
            ,{ duration: 10000 })

            //form reset
            setRecipent('');
            setAmount(1);

        } catch (error) {
            console.error('Error sending tokens',error);
            toast.error("Error sending tokens, try again");
        } finally {
            setIsSending(false);
        }
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Send Tokens
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="recipent" className="block text-sm font-medium text-gray-700 mb-1">
                        Recipient Address
                    </label>
                    <input id="recipent" type="text" value={recipent}
                        onChange={(e) => setRecipent(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-solana-purple focus:border-solana-purple"
                        placeholder="enter wallet address"
                    />
                </div>
                
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                        Amount to Send
                    </label>
                    <input id="amount" type="number" value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-solana-purple focus:border-solana-purple"
                        placeholder="enter amount"
                    />
                </div>

                <button
                    type="submit" disabled={isSending}
                    className="w-full bg-solana-green hover:bg-solana-green/90 text-white font-medium py-2.5 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSending ? 'Sending...' : 'Send Tokens'}
                </button>
            </form>
        </div>
    )
}