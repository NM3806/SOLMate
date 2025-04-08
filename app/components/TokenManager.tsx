"use client";

import { useState } from "react";
import TokenForm from "./TokenForm";
import TokenList from "./TokenList";

export default function TokenManager() {
    const [mintedTokens, setMintedTokens] = useState([]);

    return (
        <>
            <TokenForm mintedTokens={mintedTokens} setMintedTokens={setMintedTokens}/>
            <TokenList tokens={mintedTokens}/>
        </>
    );
}