'use client'

import dynamic from "next/dynamic";

const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false}
);

export default function WalletButton() {
  return (
    <div className="flex justify-center mt-4">
      <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 !text-white !rounded-xl !px-4 !py-2" />
    </div>
  );
};
