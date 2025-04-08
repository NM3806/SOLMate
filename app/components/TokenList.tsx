'use client';

export default function TokenList({
    tokens,
}: {
    tokens: { mint: string; amount: number; decimals: number }[];
}) {
    const displayAmount = (amount: number, decimals: number) =>
        (amount / Math.pow(10, decimals)).toFixed(decimals);

    return (
        <div className="p-4 mt-6 max-w-md mx-auto bg-white rounded-xl shadow">
            <h2 className="text-lg font-bold mb-2">Minted Tokens</h2>

            {tokens.length === 0 ? (
                <p className="text-sm text-gray-500">No tokens minted yet.</p>
            ) : (
                <ul className="space-y-2">
                    {tokens.map((token, i) => (
                        <li key={i} className="border p-2 rounded-lg">
                            <span className="block text-sm text-gray-700">
                                Mint: {token.mint}
                            </span>
                            <span className="text-xs text-gray-400">
                                Amount: {displayAmount(token.amount, token.decimals)}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
