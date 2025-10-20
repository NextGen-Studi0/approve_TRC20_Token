import { useCallback, useMemo, useState } from 'react';
import Head from 'next/head';

import { ApproveForm } from '../components/ApproveForm';
import { ApproveSummary } from '../components/ApproveSummary';
import { createInitialFormState, validateForm } from '../lib/approve';
import type { ApproveFormState } from '../types/approve';
import { useApprovePayload } from '../hooks/useApprovePayload';

export default function ApprovePage() {
  const [form, setForm] = useState<ApproveFormState>(createInitialFormState);
  const [errors, setErrors] = useState<Partial<Record<keyof ApproveFormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const { payload, qrValue } = useApprovePayload(form);

  const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors]);

  const updateForm = useCallback(
    (next: ApproveFormState, field?: keyof ApproveFormState) => {
      setForm(next);
      if (field) {
        setErrors((prev) => {
          if (!prev[field]) {
            return prev;
          }
          const { [field]: _removed, ...rest } = prev;
          if (field === 'network' && prev.customRpcUrl) {
            const { customRpcUrl: _customRemoved, ...restWithoutCustom } = rest;
            return restWithoutCustom;
          }
          return rest;
        });
      }
    },
    []
  );

  const submit = useCallback(async () => {
    const validation = validateForm(form);

    if (!validation.success) {
      const formErrors: Partial<Record<keyof ApproveFormState, string>> = {};
      validation.error.issues.forEach((issue) => {
        const key = issue.path[0];
        if (typeof key === 'string') {
          formErrors[key as keyof ApproveFormState] = issue.message;
        }
      });
      setErrors(formErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      await fetch('/api/log-approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to log approve payload', error);
    } finally {
      setSubmitting(false);
    }
  }, [form, payload]);

  return (
    <>
      <Head>
        <title>Approve TRC-20 | QR Generator</title>
      </Head>
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-12">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">Approve TRC-20 Token</h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">
            Tạo QR code approve TRC-20 để merchant hiển thị cho khách hàng. Công cụ này sinh payload JSON
            sẵn sàng cho ví Web3 trên mạng TRON và hỗ trợ chế độ demo phục vụ quay video.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
          <ApproveForm form={form} onChange={updateForm} onSubmit={submit} submitting={submitting} errors={errors} />
          <ApproveSummary form={form} payload={payload} qrValue={qrValue} />
        </section>

        <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Hướng dẫn tiếp theo</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
            <li>
              Import payload JSON trong ứng dụng demo để hiển thị luồng approve cho merchant và người dùng.
            </li>
            <li>
              Kết nối ví TronLink/MetaMask (cấu hình TRON) để gọi hàm <code>approve</code> dựa trên dữ liệu từ QR.
            </li>
            <li>
              Với chế độ demo, bạn có thể bật banner hướng dẫn riêng cho quay video mà không cần cảnh báo bảo mật.
            </li>
          </ul>
        </section>

        {hasErrors && (
          <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Vui lòng kiểm tra lại thông tin nhập. Một số trường chưa hợp lệ và được đánh dấu màu đỏ bên trên.
          </section>
        )}
      </main>
    </>
  );
}
