import { getDefaultConfig } from "connectkit";
import { createConfig } from "wagmi";

// export const BASE_URL = "http://87.237.52.168:3000";
export const BASE_URL = "http://localhost:3002";
// export const BASE_URL = "https://dispossessor.com/back";
export const SOCKET_URL = "http://localhost:3003";

export const config = createConfig(
  getDefaultConfig({
    appName: "eSTOKKYAM",
    walletConnectProjectId: import.meta.env
      .VITE_WALLET_CONNECT_PROJECT_ID as string,
  })
);
