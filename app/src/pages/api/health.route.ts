import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@server/prisma';

type SuccessResponse = {
  invoiceCount: number;
};

type ErrorResponse = {
  message: string;
};

type ResponseData = SuccessResponse | ErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const apiKey = req.query.apiKey as string | undefined;
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const invoiceCount = await prisma.invoice.count();
  return res.status(200).json({ invoiceCount });
}
