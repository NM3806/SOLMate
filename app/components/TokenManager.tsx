'use client';

import { useState } from "react";
import TokenForm from "./TokenForm";
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

  return (
    <>
      <TokenForm mintedTokens={mintedTokens} setMintedTokens={setMintedTokens} />
      <TokenList tokens={mintedTokens} />

      <SendTokenForm mintedTokens={mintedTokens}/>
    </>
  );
}
