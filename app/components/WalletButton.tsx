'use client';

import dynamic from 'next/dynamic';
import UserBalance from './UserBalance';

const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export default function WalletButton() {
  return (
    <div className="flex items-center justify-center gap-4 flex-wrap">
      <UserBalance />
      <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 !text-white !rounded-lg !px-5 !py-2 !transition-colors !duration-300 dark:!bg-purple-500 dark:hover:!bg-purple-600" />
    </div>
  );
}
