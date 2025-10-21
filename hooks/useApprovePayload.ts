import { useMemo } from 'react';

import { buildApprovePayload } from '../lib/approve';
import type { ApproveFormState, ApprovePayload } from '../types/approve';

export function useApprovePayload(form: ApproveFormState): {
  payload: ApprovePayload;
  qrValue: string;
} {
  return useMemo(() => {
    const payload = buildApprovePayload(form);
    const qrValue = JSON.stringify(payload, null, 2);

    return { payload, qrValue };
  }, [form]);
}
