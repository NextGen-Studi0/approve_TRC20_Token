import type { NextApiRequest, NextApiResponse } from 'next';

import type { ApprovePayload } from '../../types/approve';

export type LogApproveResponse = {
  ok: true;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<LogApproveResponse>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
    return;
  }

  const payload = req.body as ApprovePayload;
  // eslint-disable-next-line no-console
  console.info('[approve-log]', JSON.stringify(payload));

  res.status(200).json({ ok: true });
}
