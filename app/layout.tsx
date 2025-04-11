import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '@solana/wallet-adapter-react-ui/styles.css'
import { Toaster } from 'sonner';
import { WalletContextProvider } from './context/WalletContext'

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
      <body className={`${inter.className} bg-black text-white`}>

        <WalletContextProvider>
          {children}
          <Toaster position='top-center' richColors/>
        </WalletContextProvider>
      </body>
    </html>
  )
}