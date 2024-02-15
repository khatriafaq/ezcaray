"use client";
import {
  getDefaultConfig,
  RainbowKitProvider,
  ConnectButton,
} from "@rainbow-me/rainbowkit";
import React, { ReactNode, useState } from "react";
import { mainnet, polygon, optimism, arbitrum, base, zora, goerli } from "viem/chains";
import {
  useAccount,
  useSendTransaction,
  WagmiConfig,
  WagmiProvider,
} from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const projectId = "55727967a0e4b5b82d166a5c2e179651";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const config = getDefaultConfig({
    appName: "MYGT",
    projectId: projectId,
    chains: [mainnet, polygon, optimism, arbitrum, base, zora, goerli],
    ssr: true, // If your dApp uses server side rendering (SSR)
  });
  const queryClient = new QueryClient();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [tokensToSend, setTokensToSend] = useState<string>("");
  const { sendTransaction } = useSendTransaction();
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
          <ConnectButton />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Providers;
