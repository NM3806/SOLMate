'use client';

import { useEffect, useState } from "react";
import TokenForm from "./CreateMintTokenForm";
import TokenList from "./TokenList";
import SendTokenForm from "./SendTokenForm";

interface MintedToken {
  name: string;
  symbol: string;
  amount: number;
  decimals: number;
  mint: string;
  ata: string;
  signature: string;
}

export default function TokenManager() {
  const [mintedTokens, setMintedTokens] = useState<MintedToken[]>([]);
  const [prevCount, setPrevCount] = useState(0);

  useEffect(() => {
    if (mintedTokens.length > prevCount) {
      const latest = mintedTokens[0];

      setPrevCount(mintedTokens.length);
    }
  })

  return (
    <>
      <TokenForm mintedTokens={mintedTokens} setMintedTokens={setMintedTokens} />
      <TokenList tokens={mintedTokens} />

      <SendTokenForm mintedTokens={mintedTokens}/>
    </>
  );
}
