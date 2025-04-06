'use client'

import { WalletButton } from './components/wallet-button'
import { WalletContextProvider } from './context/wallet-context'
import { TokenCreationForm } from './components/token-creation-form'
import { TransactionStatus } from './components/transaction-status'

export default function Home() {
  return (
    <WalletContextProvider>
      <div className="min-h-screen bg-black text-gray-200">
        <header className="bg-gray-900 shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-purple-100">SOLMate</h1>
            <WalletButton />
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold text-amber-100 mb-4">
              Connect your wallet to get started
            </h2>
            <p className="text-gray-400 mb-6">
              Please connect your Phantom Solana wallet to create and mint tokens.
            </p>

            <TransactionStatus status='idle'/>
            <TokenCreationForm />

            <div className="flex justify-center">
              <WalletButton />
            </div>
          </div>
        </main>
      </div>
    </WalletContextProvider>
  )
}
