"use client";
import React, { ReactNode } from "react";
import {
  getDefaultWallets,
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";
import {
  injectedWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { bscTestnet, bsc } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const projectId = "da2ffc3f8eb0b295ff1ec21d73e08f8a";

const { chains, publicClient } = configureChains(
  [bsc, bscTestnet],
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
const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        appInfo={VirtualXInfo}
        modalSize="compact"
      >
        {children}
        <ConnectButton />
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default Providers;
