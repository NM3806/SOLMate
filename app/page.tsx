'use client';

import WalletButton from './components/WalletButton';
import TokenForm from './components/TokenForm';
import TokenList from './components/TokenList';

export default function Home() {
  return (
    <main className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center">Solana Token Minter</h1>

        <WalletButton />

        <TokenForm />

        <TokenList />
      </div>
    </main>
  );
}
