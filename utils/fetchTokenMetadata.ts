import { PublicKey } from "@solana/web3.js";
import { Metaplex } from "@metaplex-foundation/js";

export const fetchTokenMetadata = async (connection: any, mintAddress: string) => {
    const metaplex = Metaplex.make(connection);

    try {
        const mint = new PublicKey(mintAddress);
        const metadata = await metaplex.nfts().findByMint({ mintAddress: mint });

        return {
            name: metadata.name,
            symbol: metadata.symbol
        };
    } catch (error) {
        console.warn(`No metadata found for ${mintAddress}`);
        return {
            name: "Unknown",
            symbol: mintAddress.slice(0, 4)
        };
    }
};
