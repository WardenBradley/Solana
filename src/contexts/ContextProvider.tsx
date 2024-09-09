import { WalletAdapterNetwork, WalletError } from "@solana/wallet-adapter-base";
import {
  // @ts-ignore
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider as ReactUIWalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { Cluster, clusterApiUrl } from "@solana/web3.js";
import { FC, ReactNode, useCallback, useMemo } from "react";
// @ts-ignore
import { AutoConnectProvider, useAutoConnect } from "./AutoConnectProvider";
// @ts-ignore
import { notify } from "../utils/notifications";
// @ts-ignore
import {
  NetworkConfigurationProvider,
  useNetworkConfiguration,
  // @ts-ignore
} from "./NetworkConfigurationProvider";

// @ts-ignore
const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { autoConnect } = useAutoConnect();
  const { networkConfiguration } = useNetworkConfiguration();
  const network = networkConfiguration as WalletAdapterNetwork;
  // @ts-ignore
  const originalEndpoint = useMemo(() => clusterApiUrl(network, [network]));

  let endpoint;

  // @ts-ignore
  if (network == "mainnet-bete") {
    endpoint = "URL";
  } else if (network == "devnet") {
    endpoint = originalEndpoint;
  } else {
    endpoint = originalEndpoint;
  }

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new SolletWalletAdapter(),
      new SolletExtensionWalletAdapter(),
      new TorusWalletAdapter(),
    ],
    [network]
  );

  const onError = useCallback((error: WalletError) => {
    notify({
      type: "error",
      message: error.message ? `${error.name}: ${error.message}` : error.name,
    });
    console.error(error);
  }, []);

  return (
    // @ts-ignore
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        wallets={wallets}
        onError={onError}
        autoConnect={autoConnect}
      >
        <ReactUIWalletModalProvider>{children}</ReactUIWalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

// @ts-ignore
export const ConnectionProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <NetworkConfigurationProvider>
        <AutoConnectProvider>
          <WalletContextProvider>{children}</WalletContextProvider>
        </AutoConnectProvider>
      </NetworkConfigurationProvider>
    </>
  );
};
