export type ApproveNetwork = 'shasta' | 'mainnet' | 'custom';

export interface ApproveFormState {
  tokenAddress: string;
  spenderAddress: string;
  amount: string;
  decimals: number;
  memo: string;
  network: ApproveNetwork;
  customRpcUrl: string;
  demoMode: boolean;
  unlimited: boolean;
}

export interface ApprovePayload {
  version: number;
  network: {
    id: ApproveNetwork;
    rpcUrl?: string;
  };
  contract: {
    tokenAddress: string;
    decimals: number;
  };
  approval: {
    spender: string;
    amount: string;
    unlimited: boolean;
    memo?: string;
  };
  meta: {
    demoMode: boolean;
    createdAt: string;
  };
}
