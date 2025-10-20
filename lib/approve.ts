import { z } from 'zod';

import { amountSchema, decimalsSchema, memoSchema, rpcUrlSchema, tronAddressSchema } from './validation';
import type { ApproveFormState, ApproveNetwork, ApprovePayload } from '../types/approve';

const approveFormSchema = z
  .object({
    tokenAddress: tronAddressSchema,
    spenderAddress: tronAddressSchema,
    amount: amountSchema,
    decimals: decimalsSchema,
    memo: memoSchema.optional().or(z.literal('')),
    network: z.enum(['shasta', 'mainnet', 'custom']),
    customRpcUrl: z.string().optional(),
    demoMode: z.boolean(),
    unlimited: z.boolean()
  })
  .superRefine((data, ctx) => {
    if (data.network === 'custom') {
      if (!data.customRpcUrl) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Vui lòng nhập RPC URL khi chọn mạng tuỳ chỉnh',
          path: ['customRpcUrl']
        });
      } else {
        const parsed = rpcUrlSchema.safeParse(data.customRpcUrl);
        if (!parsed.success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: parsed.error.issues[0]?.message ?? 'RPC URL không hợp lệ',
            path: ['customRpcUrl']
          });
        }
      }
    }

    if (!data.unlimited) {
      const numeric = Number(data.amount);
      if (!Number.isFinite(numeric) || numeric <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Số lượng phải lớn hơn 0',
          path: ['amount']
        });
      }
    }
  });

export function createInitialFormState(): ApproveFormState {
  const defaultRpc = process.env.NEXT_PUBLIC_DEFAULT_TRON_RPC ?? '';
  return {
    tokenAddress: '',
    spenderAddress: '',
    amount: '1',
    decimals: 6,
    memo: '',
    network: 'shasta',
    customRpcUrl: defaultRpc,
    demoMode: false,
    unlimited: false
  };
}

export function validateForm(state: ApproveFormState) {
  return approveFormSchema.safeParse(state);
}

export function toTronSunAmount(amount: string, decimals: number, unlimited: boolean): string {
  if (unlimited) {
    return '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
  }

  const [integer, fractional = ''] = amount.split('.');
  const paddedFraction = (fractional + '0'.repeat(decimals)).slice(0, decimals);
  const normalized = `${integer}${paddedFraction}`.replace(/^0+/u, '');

  return normalized.length === 0 ? '0' : normalized;
}

export function buildApprovePayload(state: ApproveFormState): ApprovePayload {
  const amount = toTronSunAmount(state.amount, state.decimals, state.unlimited);
  const payload: ApprovePayload = {
    version: 1,
    network: {
      id: state.network,
      ...(state.network === 'custom' && state.customRpcUrl ? { rpcUrl: state.customRpcUrl } : {})
    },
    contract: {
      tokenAddress: state.tokenAddress,
      decimals: state.decimals
    },
    approval: {
      spender: state.spenderAddress,
      amount,
      unlimited: state.unlimited,
      ...(state.memo ? { memo: state.memo } : {})
    },
    meta: {
      demoMode: state.demoMode,
      createdAt: new Date().toISOString()
    }
  };

  return payload;
}

export function formatForDisplay(state: ApproveFormState): {
  amountLabel: string;
  networkLabel: string;
} {
  const amountLabel = state.unlimited
    ? 'Unlimited approval'
    : `${state.amount} (${toTronSunAmount(state.amount, state.decimals, false)} sun)`;

  const networkLabel: Record<ApproveNetwork, string> = {
    shasta: 'Shasta Testnet',
    mainnet: 'TRON Mainnet',
    custom: 'Tùy chỉnh'
  };

  return {
    amountLabel,
    networkLabel: networkLabel[state.network]
  };
}
