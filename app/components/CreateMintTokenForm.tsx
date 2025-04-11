"use client";

import { MintedToken } from "../types/token";
import { useMintTokenForm } from "../hooks/useMintTokenForm"; 
import TextInput from "./ui/TextInput";

export default function CreateMintTokenForm({
  mintedTokens,
  setMintedTokens,
}: {
  mintedTokens: MintedToken[];
  setMintedTokens: React.Dispatch<React.SetStateAction<MintedToken[]>>;
}) {
  const {
    name,
    setName,
    symbol,
    setSymbol,
    amount,
    setAmount,
    decimals,
    setDecimals,
    loading,
    handleSubmit,
  } = useMintTokenForm(setMintedTokens);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-md space-y-4 transition-all"
    >
      <h2 className="text-lg font-semibold text-purple-600 dark:text-purple-400 text-center">
        Create & Mint Token
      </h2>

      <TextInput
        placeholder="Token Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <TextInput
        placeholder="Token Symbol"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
      />

      <TextInput
        type="number"
        min={1}
        step={1}
        placeholder="Token Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <TextInput
        type="number"
        min={0}
        step={1}
        placeholder="Decimals (default 0)"
        value={decimals}
        onChange={(e) => setDecimals(e.target.value)}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : "Create & Mint"}
      </button>
    </form>
  );
}
