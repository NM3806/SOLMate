'use client';

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

export default function UserBalance() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        const lamports = await connection.getBalance(publicKey);
        setBalance(lamports / 1e9);
      } else {
        setBalance(null);
      }
    };

    fetchBalance();
  }, [publicKey, connection]);

  if (!publicKey || balance === null) return null;

  return (
    <div className="rounded-lg px-3 py-1 text-sm font-medium bg-purple-100 text-green-500 border border-purple-300 shadow-sm dark:bg-zinc-800 dark:text-green-300 dark:border-zinc-600 transition-colors duration-300">
      {balance.toFixed(3)} SOL
    </div>
  );
}
