import { QRCodeSVG } from 'qrcode.react';

import { formatForDisplay } from '../lib/approve';
import type { ApproveFormState, ApprovePayload } from '../types/approve';

interface ApproveSummaryProps {
  form: ApproveFormState;
  payload: ApprovePayload;
  qrValue: string;
}

export function ApproveSummary({ form, payload, qrValue }: ApproveSummaryProps) {
  const { amountLabel, networkLabel } = formatForDisplay(form);

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-inner">
      <section>
        <h2 className="text-lg font-semibold text-slate-800">Thông tin QR</h2>
        <p className="mt-1 text-sm text-slate-600">
          Dùng QR code này cho màn hình merchant. Người dùng sẽ quét bằng ứng dụng ví hỗ trợ TRON để
          ký giao dịch approve.
        </p>
        <div className="mt-4 flex flex-col items-center gap-4">
          <QRCodeSVG value={qrValue} size={220} includeMargin />
          <code className="w-full overflow-auto rounded-md bg-slate-900 p-3 text-xs text-emerald-200">
            {qrValue}
          </code>
        </div>
      </section>

      <section className="grid gap-2">
        <h3 className="text-base font-semibold text-slate-800">Tóm tắt</h3>
        <dl className="grid gap-3 text-sm text-slate-700">
          <div>
            <dt className="font-semibold">Mạng</dt>
            <dd>{networkLabel}</dd>
          </div>
          {form.network === 'custom' && payload.network.rpcUrl && (
            <div>
              <dt className="font-semibold">RPC</dt>
              <dd>{payload.network.rpcUrl}</dd>
            </div>
          )}
          <div>
            <dt className="font-semibold">Token</dt>
            <dd>{payload.contract.tokenAddress}</dd>
          </div>
          <div>
            <dt className="font-semibold">Spender</dt>
            <dd>{payload.approval.spender}</dd>
          </div>
          <div>
            <dt className="font-semibold">Số lượng</dt>
            <dd>{amountLabel}</dd>
          </div>
          {payload.approval.memo && (
            <div>
              <dt className="font-semibold">Memo</dt>
              <dd>{payload.approval.memo}</dd>
            </div>
          )}
          <div>
            <dt className="font-semibold">Demo mode</dt>
            <dd>{payload.meta.demoMode ? 'Bật' : 'Tắt'}</dd>
          </div>
          <div>
            <dt className="font-semibold">Thời gian tạo</dt>
            <dd>{new Date(payload.meta.createdAt).toLocaleString()}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
