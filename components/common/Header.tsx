"use client";
import Image from "next/image";
import React, { useState } from "react";
import Logo from "../../public/images/Ezcaray-primary-logo.png";
import PrimaryBtn from "../ui/PrimaryBtn";
import { ConnectButton, darkTheme, Theme } from "@rainbow-me/rainbowkit";
import Data from "./config.json";

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

import {
  configureChains,
  createConfig,
  useAccount,
  useContractWrite,
  usePrepareSendTransaction,
  useSendTransaction,
  WagmiConfig,
} from "wagmi";
import { bscTestnet, bsc, polygonMumbai, goerli } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { parseEther } from "viem";

const projectId = "29ab18948d1248fd1133bbd91abcc8cf";

const { chains, publicClient } = configureChains([goerli], [publicProvider()]);
const { wallets } = getDefaultWallets({
  appName: "Ezcaray",
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
const Header = () => {
  const { contractAddress, ABI } = Data;
  const { address, isConnecting, isDisconnected } = useAccount();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const Address = address;
  const [tokensToSend, setTokensToSend] = useState<string>("");

  const { data, isLoading, isSuccess, sendTransaction } = useSendTransaction({
    to: Data.contractAddress,
    value: parseEther(tokensToSend),
  });

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
  });

  return (
    <div>
      <header className="main-container bg-dark flex justify-between items-center rounded-[38px] mt-10 py-[13px] px-[28px] relative z-20">
        {/* logo */}
        <div className="logo flex items-center">
          <Image
            src={Logo}
            alt="logo"
            className="w-20 md:w-[180px] rounded-full"
          />
          <p>
            <h1 className="text-brandColor pt-3d text-4xl m-5">MYGT</h1>
          </p>
        </div>

        {/* mobile menu button */}
        <div className="block lg:hidden">
          <button
            className="text-orange-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg
                className="rotate-90 transition-all w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex space-x-4">
          <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider
              chains={chains}
              appInfo={VirtualXInfo}
              modalSize="compact"
              theme={darkTheme({
                accentColor: "#EAB308",
                borderRadius: "large",
              })}
            >
              <div>
                <ConnectButton />
              </div>
            </RainbowKitProvider>
          </WagmiConfig>

          <PrimaryBtn download={true} text="Whitepaper" />
          <PrimaryBtn
            action={() => {
              sendTransaction();
              setTokensToSend("");
            }}
            text="Buy MYGT"
          />
          <input
            value={tokensToSend}
            type="number"
            style={{ WebkitAppearance: "none" }}
            className="font-SourceSans3 bg-brandColor border-[3px] border-brandColor button-small text-white rounded-xl px-4 py-2 hover:bg-dark active:border-b-[3px] active:border-lightPink"
            placeholder="ETH's To Invest"
            onChange={(e) => {
              setTokensToSend(e.target.value);
            }}
          />
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className={`w-full pt-6 pb-4 lg:hidden absolute left-0 -bottom-48 bg-dark transition-all rounded-[42px] fade-right`}
          >
            <div className="flex flex-col mx-auto gap-3 w-[200px]">
              <WagmiConfig config={wagmiConfig}>
                <RainbowKitProvider
                  chains={chains}
                  appInfo={VirtualXInfo}
                  modalSize="compact"
                  theme={darkTheme({
                    accentColor: "#EAB308",
                    borderRadius: "large",
                  })}
                >
                  <div>
                    <ConnectButton />
                  </div>
                </RainbowKitProvider>
              </WagmiConfig>
              <PrimaryBtn download={true} text="Whitepaper" />
              <PrimaryBtn download={true} text="Contact" />
              <PrimaryBtn
                action={() => {
                  sendTransaction();
                  setTokensToSend("");
                }}
                text="Buy MYGT"
              />
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;
