import { useBalance } from "wagmi";

import {
  Dv3TNT_TOKEN_ETH_ADDRESS,
  SEPOLIA_ETH_CHAIN_ID,
} from "@/constants/wallets";

import { useAccounts } from "./useAccounts";
import { usePollNativeTokenBalance } from "./usePollNativeTokenBalance";

export const useAccountBalance = () => {
  const { evmAddress, dydxAddress } = useAccounts() || {};

  const dv3tntBalanceQuery = useBalance({
    enabled: evmAddress !== undefined,
    address: evmAddress,
    chainId: SEPOLIA_ETH_CHAIN_ID,
    token: Dv3TNT_TOKEN_ETH_ADDRESS,
    watch: true,
  });

  const { formatted: dv3tntBalance } = dv3tntBalanceQuery.data || {};
  const wethDv3tntBalance = 0; // Todo: replace with actual data
  const dv4tntBalance = usePollNativeTokenBalance({ dydxAddress });

  return {
    dv3tntBalance,
    wethDv3tntBalance,
    dv4tntBalance,
  };
};
