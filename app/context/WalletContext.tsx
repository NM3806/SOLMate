'use client'

import { FC, ReactNode } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import '@solana/wallet-adapter-react-ui/styles.css'
import { clusterApiUrl } from '@solana/web3.js'

require('@solana/wallet-adapter-react-ui/styles.css')

export const WalletContextProvider: FC<{children: ReactNode}> = ({children}) => {
  const network = 'devnet';
  const endpoint = clusterApiUrl(network);
  const wallets =  [new PhantomWalletAdapter()];

  return (
    <ConnectionProvider endpoint = {endpoint}> {/* gives access to Solana devnet */}
      <WalletProvider wallets = {wallets} autoConnect> {/* manages wallet state (connect/disconnect) */}
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>

    </ConnectionProvider>
  );
};