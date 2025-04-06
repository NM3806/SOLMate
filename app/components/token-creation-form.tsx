"use client";

import { useState } from "react";
import { useWalletContext } from "../context/wallet-context";
import { TokenSendForm } from "./token-send-form";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { toast } from "react-hot-toast";
import { Keypair, Transaction } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";


export function TokenCreationForm() {
    const { publicKey, connection, wallet } = useWalletContext();
    const [tokenName, setTokenName] = useState('');
    const [tokenSymbol, setTokenSymbol] = useState('');
    const [decimals, setDecimals] = useState(9);
    const [mintAmount, setMintAmount] = useState(100);
    const [isCreating, setIsCreating] = useState(false);
    const [createdMintAddress, setCreatedMintAddress] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!publicKey || !wallet) {
            toast.error("please connect your wallet first");
            return;
        }

        if (!tokenName || !tokenSymbol) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsCreating(true);

        try {
            const signer = {
                publicKey: publicKey,
                signTransaction: wallet.signTransaction,
                signAllTransactions: wallet.signAllTransactions,
            };

            //create token mint
            const mint = await createMint(
                connection,
                signer, //payer
                publicKey, //mint authority
                publicKey, //freeze authority
                decimals
            )

            setCreatedMintAddress(mint.toBase58());

            // create token account
            const tokenAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                signer, //payer 
                mint,
                publicKey //owner
            )

            // minting tokens to the token account
            await mintTo(
                connection,
                signer, // payer/signer
                mint,
                tokenAccount.address, //token account address
                publicKey, //owner
                mintAmount * Math.pow(10, decimals) //mint amount
            )

            toast.success(
                <div>
                    <p>Token Created and Minted successfully!</p>
                    <p className="text-xs mt-1 font-mono break-all">Mint address: {mint.toBase58()}</p>
                    <p className="text-xs mt-1 font-mono break-all">Minted: {mintAmount} tokens to your wallet</p>
                </div>
                , { duration: 10000 })

            setTokenName('');
            setTokenSymbol('');
            setMintAmount(100);

        } catch (error) {
            console.error("Error creating token:", error);
            toast.error("Error creating token. Please try again.");
            setCreatedMintAddress(null);

        } finally {
            setIsCreating(false);
        }
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Token</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="tokenName"
                        className="block text-sm font-medium text-gray-700 mb-1">
                        Token Name
                    </label>
                    <input
                        id="tokenName" type="text" value={tokenName}
                        onChange={(e) => setTokenName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-solana-purple focus:border-solana-purple"
                    />
                </div>

                <div>
                    <label htmlFor="tokenSymbol"
                        className="block text-sm font-medium text-gray-700 mb-1">
                        Token Symbol
                    </label>
                    <input
                        id="tokenSymbol" type="text" value={tokenSymbol}
                        onChange={(e) => setTokenSymbol(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-solana-purple focus:border-solana-purple"
                        maxLength={10}
                    />
                </div>

                <div>
                    <label htmlFor="decimals"
                        className="block text-sm font-medium text-gray-700 mb-1">
                        Decimals
                    </label>
                    <input
                        id="decimals" type="number" value={decimals}
                        onChange={(e) => setDecimals(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-solana-purple focus:border-solana-purple"
                        min={0} max={18}
                    />
                </div>

                <div>
                    <label htmlFor="mintAmount"
                        className="block text-sm font-medium text-gray-700 mb-1">
                        Initial MInt Amount
                    </label>
                    <input
                        id="mintAmount" type="number" value={mintAmount}
                        onChange={(e) => setMintAmount(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-solana-purple focus:border-solana-purple"
                        min={1}
                    />
                </div>

                <button
                    type="submit" disabled={isCreating}
                    className="w-full bg-solana-purple hover:bg-solana-purple/90 cursor-pointer text-amber-100 font-medium py-2.5 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isCreating ? "Creating..." : "Create and Mint Token"}
                </button>
            </form>

            {createdMintAddress && (
                <>
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                            Created Token
                        </h3>
                        <p className="text-xs font-mono break-all text-gray-600">
                            {createdMintAddress}
                        </p>
                    </div>
                    <TokenSendForm mintAddress={createdMintAddress} />
                </>
            )}
        </div>
    );
}