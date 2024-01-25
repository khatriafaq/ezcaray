'use client'
import Header from '@/components/common/Header';
import './globals.css';
import type { Metadata } from 'next';
import Footer from '@/components/common/Footer';
import { Source_Sans_3, Space_Grotesk } from 'next/font/google';
import CountdownClock from '@/components/CountdownClock';
import Providers from './providers';
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
  connectorsForWallets,
} from '@rainbow-me/rainbowkit';
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets'
import {
  injectedWallet,
  rainbowWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';

import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
bscTestnet,
bsc,
} from 'wagmi/chains'; 
import { publicProvider } from 'wagmi/providers/public';
import {ConnectButton} from '@rainbow-me/rainbowkit'

const projectId = "da2ffc3f8eb0b295ff1ec21d73e08f8a";

const { chains, publicClient } = configureChains(
  [bsc],
  [publicProvider()]
);
const { wallets } = getDefaultWallets({
  appName: "Virtual X",
  projectId,
  chains,
});

const VirtualXInfo = {
  appName: "Virtual X",
};
const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Recommended",
    wallets: [
      injectedWallet({ chains }),
      rainbowWallet({ projectId, chains }),
      walletConnectWallet({ projectId, chains }),
    ],
  },
]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});
const space = Space_Grotesk({
  subsets: ['latin'],
  display: 'auto'
});

const btnFont = Source_Sans_3({
  subsets: ['latin'],
  display: 'auto',
  variable: '--font-source-sans-3'
})


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${space.className} overflow-x-hidden ${btnFont.variable}`} style={{ paddingLeft: "2%" }}>
      <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider
            chains={chains}
            appInfo={VirtualXInfo}
            modalSize="compact"
          >
            <Header />
          </RainbowKitProvider>

        </WagmiConfig>
      
      
      <div style={{position : "relative", top: "-20px"}}><CountdownClock /></div>
      
        
          {children}
        
       

       
      {/* {children} */}
        <div className="dekstop_styling ">
          <Footer />
        </div>

      </body>
    </html>
  );
}
