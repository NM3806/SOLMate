import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '@solana/wallet-adapter-react-ui/styles.css'
import { WalletProvider } from './providers/wallet-provider'
import { ToastProvider } from './providers/toast-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SOLMate',
  description: 'Create and mint tokens on Solana blockchain',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`!bg-black ${inter.className}`}>
        <WalletProvider>
          <ToastProvider />
          {children}
        </WalletProvider>
      </body>
    </html>
  )
}