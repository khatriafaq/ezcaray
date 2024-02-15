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

const projectId = "29ab18948d1248fd1133bbd91abcc8cf";

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
