import { ChangeEvent } from 'react';

import type { ApproveFormState } from '../types/approve';

interface ApproveFormProps {
  form: ApproveFormState;
  onChange: (next: ApproveFormState, field?: keyof ApproveFormState) => void;
  onSubmit: () => void;
  submitting: boolean;
  errors: Partial<Record<keyof ApproveFormState, string>>;
}

function handleTextChange(
  key: keyof ApproveFormState,
  form: ApproveFormState,
  onChange: (next: ApproveFormState, field?: keyof ApproveFormState) => void
) {
  return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange({ ...form, [key]: event.target.value }, key);
  };
}

function handleNumberChange(
  key: keyof ApproveFormState,
  form: ApproveFormState,
  onChange: (next: ApproveFormState, field?: keyof ApproveFormState) => void
) {
  return (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(event.target.value, 10);
    onChange({ ...form, [key]: Number.isNaN(value) ? 0 : value }, key);
  };
}

export function ApproveForm({ form, onChange, onSubmit, submitting, errors }: ApproveFormProps) {
  return (
    <form
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700" htmlFor="tokenAddress">
            Địa chỉ token TRC-20
          </label>
          <input
            id="tokenAddress"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="VD: TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            value={form.tokenAddress}
            onChange={handleTextChange('tokenAddress', form, onChange)}
            required
            autoComplete="off"
          />
          {errors.tokenAddress && <p className="mt-1 text-sm text-red-600">{errors.tokenAddress}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700" htmlFor="spenderAddress">
            Địa chỉ spender
          </label>
          <input
            id="spenderAddress"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="VD: TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            value={form.spenderAddress}
            onChange={handleTextChange('spenderAddress', form, onChange)}
            required
            autoComplete="off"
          />
          {errors.spenderAddress && <p className="mt-1 text-sm text-red-600">{errors.spenderAddress}</p>}
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-slate-700" htmlFor="amount">
              Số lượng
            </label>
            <input
              id="amount"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              placeholder="VD: 10"
              value={form.amount}
              onChange={handleTextChange('amount', form, onChange)}
              disabled={form.unlimited}
            />
            {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700" htmlFor="decimals">
              Decimals
            </label>
            <input
              id="decimals"
              type="number"
              min={0}
              max={18}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              value={form.decimals}
              onChange={handleNumberChange('decimals', form, onChange)}
            />
            {errors.decimals && <p className="mt-1 text-sm text-red-600">{errors.decimals}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700" htmlFor="memo">
            Memo (tuỳ chọn)
          </label>
          <textarea
            id="memo"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            rows={3}
            value={form.memo}
            onChange={handleTextChange('memo', form, onChange)}
            placeholder="Ghi chú nội bộ, tối đa 280 ký tự"
          />
          {errors.memo && <p className="mt-1 text-sm text-red-600">{errors.memo}</p>}
        </div>

        <fieldset className="grid gap-2">
          <legend className="text-sm font-semibold text-slate-700">Mạng lưới</legend>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="radio"
              name="network"
              value="shasta"
              checked={form.network === 'shasta'}
              onChange={() => onChange({ ...form, network: 'shasta' }, 'network')}
            />
            Shasta Testnet
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="radio"
              name="network"
              value="mainnet"
              checked={form.network === 'mainnet'}
              onChange={() => onChange({ ...form, network: 'mainnet' }, 'network')}
            />
            TRON Mainnet
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="radio"
              name="network"
              value="custom"
              checked={form.network === 'custom'}
              onChange={() => onChange({ ...form, network: 'custom' }, 'network')}
            />
            RPC tuỳ chỉnh
          </label>
          {form.network === 'custom' && (
            <input
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              placeholder="https://api.trongrid.io"
              value={form.customRpcUrl}
              onChange={handleTextChange('customRpcUrl', form, onChange)}
            />
          )}
          {errors.customRpcUrl && <p className="mt-1 text-sm text-red-600">{errors.customRpcUrl}</p>}
        </fieldset>

        <div className="flex items-center justify-between gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.unlimited}
              onChange={(event) => onChange({ ...form, unlimited: event.target.checked }, 'unlimited')}
            />
            Cấp quyền unlimited
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.demoMode}
              onChange={(event) => onChange({ ...form, demoMode: event.target.checked }, 'demoMode')}
            />
            Demo mode
          </label>
        </div>

        <button
          type="submit"
          className="mt-2 inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? 'Đang tạo QR...' : 'Tạo QR approve'}
        </button>
      </div>
    </form>
  );
}
