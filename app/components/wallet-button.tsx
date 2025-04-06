'use client'

import { useWalletContext } from '../context/wallet-context'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export function WalletButton() {
  const { publicKey, balance, connected } = useWalletContext()

  return (
    <div className="flex items-center gap-3">
      {connected && (
        <div className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg text-sm">
          <span>Balance: {balance.toFixed(4)} SOL</span>
        </div>
      )}
      <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 !text-white !rounded-lg !font-medium" />
    </div>
  )
}
