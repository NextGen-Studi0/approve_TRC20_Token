import { z } from 'zod';

export const tronAddressSchema = z
  .string()
  .min(34, 'Địa chỉ TRON phải có 34 ký tự')
  .max(34, 'Địa chỉ TRON phải có 34 ký tự')
  .regex(/^T[1-9A-HJ-NP-Za-km-z]{33}$/u, 'Địa chỉ TRON không hợp lệ');

export const amountSchema = z
  .string()
  .min(1, 'Số lượng không được trống')
  .regex(/^\d+(\.\d{1,6})?$/u, 'Số lượng phải là số hợp lệ (tối đa 6 chữ số thập phân)');

export const decimalsSchema = z
  .number({ invalid_type_error: 'Decimals phải là số' })
  .int('Decimals phải là số nguyên')
  .min(0, 'Decimals không thể âm')
  .max(18, 'Decimals tối đa là 18');

export const rpcUrlSchema = z
  .string()
  .url('RPC URL không hợp lệ');

export const memoSchema = z.string().max(280, 'Memo tối đa 280 ký tự');
