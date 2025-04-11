'use client';

export default function TokenList({
  tokens,
}: {
  tokens: { mint: string; amount: number; decimals: number }[];
}) {
  const displayAmount = (amount: number, decimals: number) =>
    (amount / Math.pow(10, decimals)).toFixed(decimals);

  return (
    <div className="p-6 mt-8 max-w-md mx-auto bg-white dark:bg-zinc-900 rounded-xl shadow-md transition-all">
      <h2 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-4 text-center">
        Minted Tokens
      </h2>

      {tokens.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          No tokens minted yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {tokens.map((token, i) => (
            <li
              key={i}
              className="border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg text-sm text-gray-800 dark:text-gray-100 break-words transition-all"
            >
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-200">Mint:</span>{' '}
                <span className="break-all">{token.mint}</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Amount: {displayAmount(token.amount, token.decimals)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
