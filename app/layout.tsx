import { Inter } from 'next/font/google';
import './globals.css';
import '@solana/wallet-adapter-react-ui/styles.css';
import { Toaster } from 'sonner';
import { WalletContextProvider } from './context/WalletContext';
import Footer from './components/Footer';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: {
    default: "SOLMate — Your SPL Token Companion",
    template: "%s | SOLMate",
  },
  description: "Create, mint, and send Solana SPL tokens with ease.",
  keywords: ["Solana", "SPL", "token", "wallet", "mint", "send", "crypto"],
  openGraph: {
    title: "SOLMate",
    description: "Your SPL Token Companion on Solana.",
    url: "https://solmate-nm3806.com",
    siteName: "SOLMate",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SOLMate UI",
      },
    ],
    type: "website",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#9945FF" />
      </head>
      <body
        className={`${inter.className} bg-white text-black dark:bg-black dark:text-white transition-colors duration-300 ease-in-out scroll-smooth`}
      >
        <WalletContextProvider>
          <main className="max-w-2xl mx-auto px-4 py-6">{children}</main>
          <Footer />
          <Toaster
            position="top-center"
            richColors
            closeButton
            toastOptions={{
              duration: 3000,
              classNames: {
                toast: '!bg-background !text-foreground !border',
                title: '!font-semibold',
                description: '!text-sm !opacity-90',
                actionButton: '!bg-purple-600 !text-white',
                closeButton: '!text-foreground/50',
              }
            }}
          />
        </WalletContextProvider>
      </body>
    </html>
  );
}
