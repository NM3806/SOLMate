'use client';

import WalletButton from './components/WalletButton';
import TokenManager from './components/TokenManager';

export default function Home() {
  return (
    <main className="min-h-screen flex lex-col lg:flex-row lg:items-start lg:justify-center gap-6 items-center justify-center px-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="bg-white dark:bg-zinc-900 shadow-md rounded-xl px-6 py-8 text-center transition-all duration-300">
          <h1 className="text-4xl font-bold tracking-tight text-purple-600 dark:text-purple-400 mb-2">
            SOLMate
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Your SPL Token Companion
          </p>
          <div className="mt-6">
            <WalletButton />
          </div>
        </div>

        <TokenManager />
      </div>
    </main>
  );
}
