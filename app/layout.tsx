"use client";
import Header from "@/components/common/Header";
import "./globals.css";
import type { Metadata } from "next";
import Footer from "@/components/common/Footer";
import { Source_Sans_3, Space_Grotesk } from "next/font/google";
import CountdownClock from "@/components/CountdownClock";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { mainnet, polygon, optimism, arbitrum, base, zora } from "viem/chains";
import { useSendTransaction, WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const projectId = "55727967a0e4b5b82d166a5c2e179651";

const space = Space_Grotesk({
  subsets: ["latin"],
  display: "auto",
});

const btnFont = Source_Sans_3({
  subsets: ["latin"],
  display: "auto",
  variable: "--font-source-sans-3",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = getDefaultConfig({
    appName: "MYGT",
    projectId: projectId,
    chains: [mainnet, polygon, optimism, arbitrum, base, zora],
    ssr: true, // If your dApp uses server side rendering (SSR)
  });
  const queryClient = new QueryClient();

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="./favicon.ico" />
      </head>
      <body
        className={`${space.className} overflow-x-hidden ${btnFont.variable}`}
        style={{ paddingLeft: "2%" }}
      >
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <Header />
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
        <div style={{ position: "relative", top: "-20px" }}>
          <CountdownClock />
        </div>

        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>{children}</RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>

        {/* {children} */}
        <div className="dekstop_styling ">
          <Footer />
        </div>
      </body>
    </html>
  );
}
