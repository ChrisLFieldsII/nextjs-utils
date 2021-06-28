import type { NextMiddleware } from 'next-api-middleware';
import type { NextApiRequest, NextApiResponse } from 'next';

export interface GetVerifyApiKeyMw {
  apiKey: string;
}

export function getVerifyApiKeyMw({
  apiKey,
}: GetVerifyApiKeyMw): NextMiddleware {
  return async function (req: NextApiRequest, res: NextApiResponse, next) {
    if (req.headers.api_key === apiKey) {
      await next();
    } else {
      res.status(401).end();
    }
  };
}
