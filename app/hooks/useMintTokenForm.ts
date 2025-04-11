import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import { createAndMintSPLToken } from "@/utils/solana";
import { MintedToken } from "../types/token";

export function useMintTokenForm(setMintedTokens: React.Dispatch<React.SetStateAction<MintedToken[]>>) {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [amount, setAmount] = useState("");
  const [decimals, setDecimals] = useState("0");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0 || !name || !symbol) {
      toast.error("All fields are required and amount must be positive");
      return;
    }

    try {
      setLoading(true);
      toast.loading("Minting token...");

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

      toast.success("Token minted successfully!");
    } catch (err: any) {
      toast.error(err.message || "Minting failed");
    } finally {
      toast.dismiss();
      setLoading(false);
    }
  };

  return {
    name, setName,
    symbol, setSymbol,
    amount, setAmount,
    decimals, setDecimals,
    loading,
    handleSubmit,
  };
}
