import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { sendSPLToken } from "@/utils/sendSPLToken";
import { fetchUserTokens } from "@/utils/fetchUserTokens";
import { fetchTokenMetadata } from "@/utils/fetchTokenMetadata";
import { MintedToken } from "../types/token";
import { useToaster } from './useToaster';

export function useSendTokenForm(mintedTokens: MintedToken[]) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [recipient, setRecipient] = useState("");
  const [selectedMint, setSelectedMint] = useState("");
  const [amountToSend, setAmountToSend] = useState("");
  const [txSig, setTxSig] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [availableTokens, setAvailableTokens] = useState<MintedToken[]>([]);

  const { toastLoading, toastSuccess, toastError, toastDismiss } = useToaster();

  const handleSend = async () => {
    try {
      setError("");
      setTxSig("");
      setIsSending(true);
  
      if (!publicKey || !recipient || !selectedMint || !amountToSend) {
        const msg = "All fields are required";
        setError(msg);
        toastError(msg);
        setIsSending(false);
        return;
      }
  
      const recipientKey = new PublicKey(recipient);
      const mintKey = new PublicKey(selectedMint);
  
      const selectedToken = availableTokens.find((token) => token.mint === selectedMint);
      if (!selectedToken) {
        const msg = "Selected token not found in wallet";
        setError(msg);
        toastError(msg);
        setIsSending(false);
        return;
      }
  
      const toastId = toastLoading("Sending tokens...");
  
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
  
      toastDismiss();
      toastSuccess("Tokens sent successfully!");
    } catch (err: any) {
      const msg = err.message || "Transaction Failed";
      setError(msg);
      toastDismiss();
      toastError(msg);
    } finally {
      setIsSending(false);
      toastDismiss();
    }
  };
  

  useEffect(() => {
    if (!publicKey) return;

    (async () => {
      const usertokens = await fetchUserTokens(connection, publicKey);

      const merged = await Promise.all(
        usertokens.map(async (ut) => {
          const meta = mintedTokens.find((mt) => mt.mint === ut.mint);
          let name = meta?.name ?? "";
          let symbol = meta?.symbol ?? "";

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
            ata: "",
            signature: "",
          };
        })
      );

      setAvailableTokens(merged);
    })();
  }, [connection, publicKey]);

  return {
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
  };
}
