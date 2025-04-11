"use client";

import { MintedToken } from "../types/token";
import { useSendTokenForm } from "../hooks/useSendTokenForm";
import TextInput from "./ui/TextInput";
import SelectInput from "./ui/SelectInput";

export default function SendTokenForm({ mintedTokens }: { mintedTokens: MintedToken[] }) {
  const {
    recipient,
    setRecipient,
    selectedMint,
    setSelectedMint,
    amountToSend,
    setAmountToSend,
    txSig,
    error,
    isSending,
    availableTokens,
    handleSend,
  } = useSendTokenForm(mintedTokens);

  return (
    <div className="p-6 mt-8 max-w-md mx-auto bg-white dark:bg-zinc-900 rounded-xl shadow-lg space-y-5 border border-zinc-200 dark:border-zinc-700 transition-all">
      <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-300">Send Token</h2>

      <SelectInput
        options={availableTokens.map((token) => ({
          value: token.mint,
          label: `${token.name} (Bal: ${token.amount})`,
        }))}
        placeholder="Select Token"
        value={selectedMint}
        onChange={(e) => setSelectedMint(e.target.value)}
      />

      <TextInput
        placeholder="Recipient Wallet Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />

      <TextInput
        type="number"
        min={1}
        step={1}
        placeholder="Amount"
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
