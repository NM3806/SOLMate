'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'

interface WalletContextType {
  publicKey: PublicKey | null
  balance: number
  connected: boolean
  connection: Connection
  wallet: any
  error: string | null
  setError: (error: string | null) => void
}

const WalletContext = createContext<WalletContextType | null>(null)

export function WalletContextProvider({ children }: { children: React.ReactNode }) {
  const { publicKey, connected, wallet } = useWallet()
  const [balance, setBalance] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const connection = new Connection('https://api.devnet.solana.com')

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        try {
          const balance = await connection.getBalance(publicKey)
          setBalance(balance / LAMPORTS_PER_SOL)
          setError(null)
        } catch (err) {
          console.error('Error fetching balance:', err)
          setError('Failed to fetch balance. Please try again.')
        }
      }
    }

    fetchBalance()
    const interval = setInterval(fetchBalance, 10000)

    return () => clearInterval(interval)
  }, [publicKey, connection])

  return (
    <WalletContext.Provider value={{ publicKey, balance, connected, connection, wallet, error, setError }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWalletContext() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWalletContext must be used within a WalletContextProvider')
  }
  return context
}