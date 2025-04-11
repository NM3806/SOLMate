'use client';

import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { sendSPLToken } from "@/utils/sendSPLToken";
import { fetchUserTokens } from "@/utils/fetchUserTokens";
import { fetchTokenMetadata } from "@/utils/fetchTokenMetadata";
import { toast } from 'sonner';

interface MintedToken {
  name: string;
  symbol: string;
  amount: number;
  decimals: number;
  mint: string;
  ata: string;
  signature: string;
}

interface UserToken {
  mint: string;
  amount: number;
  decimals: number;
}

export default function SendTokenForm({ mintedTokens }: { mintedTokens: MintedToken[] }) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [recipient, setRecipient] = useState('');
  const [selectedMint, setSelectedMint] = useState('');
  const [amountToSend, setAmountToSend] = useState('');
  const [txSig, setTxSig] = useState('');
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [availableTokens, setAvailableTokens] = useState<MintedToken[]>([]);

  const handleSend = async () => {
    try {
      setError('');
      setTxSig('');
      setIsSending(true);

      if (!publicKey || !recipient || !selectedMint || !amountToSend) {
        const msg = 'All fields are required';
        setError(msg);
        toast.error(msg);
        setIsSending(false);
        return;
      }

      const recipientKey = new PublicKey(recipient);
      const mintKey = new PublicKey(selectedMint);

      const selectedToken = availableTokens.find(token => token.mint === selectedMint);
      if (!selectedToken) {
        const msg = "Selected token not found in wallet";
        setError(msg);
        toast.error(msg);
        setIsSending(false);
        return;
      }

      const tx = await sendSPLToken({
        connection,
        sender: publicKey,
        recipient: recipientKey,
        mint: mintKey,
        amount: Number(amountToSend),
        decimals: selectedToken.decimals,
      });

      const signature = await sendTransaction(tx, connection);
      const latestBlockhash = await connection.getLatestBlockhash();
      await connection.confirmTransaction({ signature, ...latestBlockhash }, "confirmed");

      setTxSig(signature);
      toast.success("Tokens sent successfully!");
    } catch (err: any) {
      const msg = err.message || "Transaction Failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSending(false);
      toast.dismiss();
    }
  };

  useEffect(() => {
    if (!publicKey) return;

    (async () => {
      const usertokens = await fetchUserTokens(connection, publicKey);

      const merged = await Promise.all(usertokens.map(async (ut) => {
        const meta = mintedTokens.find(mt => mt.mint === ut.mint);
        let name = meta?.name ?? '';
        let symbol = meta?.symbol ?? '';

        if (!name || !symbol) {
          const fetchMeta = await fetchTokenMetadata(connection, ut.mint);
          name = fetchMeta.name;
          symbol = fetchMeta.symbol;
        }

        return {
          name,
          symbol,
          amount: ut.amount,
          decimals: ut.decimals,
          mint: ut.mint,
          ata: '',
          signature: '',
        };
      }));

      setAvailableTokens(merged);
    })();
  }, [connection, publicKey]);

  return (
    <div className="p-6 mt-8 max-w-md mx-auto bg-white dark:bg-zinc-900 rounded-xl shadow-lg space-y-5 border border-zinc-200 dark:border-zinc-700 transition-all">
      <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-300">Send Token</h2>

      <select
        className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 transition-colors"
        value={selectedMint}
        onChange={(e) => setSelectedMint(e.target.value)}
      >
        <option value="">Select Token</option>
        {[...availableTokens]
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((token) => (
            <option key={token.mint} value={token.mint}>
              {token.name} (Bal: {token.amount})
            </option>
          ))}
      </select>

      <input
        type="text"
        placeholder="Recipient Wallet Address"
        className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 transition-colors"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />

      <input
        type="number" min="1" step="1"
        placeholder="Amount"
        className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 transition-colors"
        value={amountToSend}
        onChange={(e) => setAmountToSend(e.target.value)}
      />

      <button
        onClick={handleSend}
        disabled={isSending}
        className={`w-full p-3 rounded-lg font-medium text-white transition-all ${
          isSending ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
        }`}
      >
        {isSending ? "Sending..." : "Send Tokens"}
      </button>

      {txSig && (
        <p className="text-green-600 dark:text-green-400 break-words text-sm">
          Tx Signature: {txSig}
        </p>
      )}
      {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}
    </div>
  );
}
