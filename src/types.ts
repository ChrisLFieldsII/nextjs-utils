import type { NextApiRequest, NextApiResponse } from 'next';

export type HttpMethod = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';

/**
 * @typeParam B - Body
 * @typeParam Q - Query
 */
export interface INextApiRequest<
  B = Record<string, any>,
  Q = Record<string, string>,
> extends Omit<NextApiRequest, 'query' | 'method'> {
  // Omit to be redefined for preferred typing
  body: B;
  query: Q;
  method: HttpMethod;
}

/**
 * @typeParam B - Body
 * @typeParam Q - Query
 */
export type NextApiHandler<
  B = Record<string, any>,
  Q = Record<string, string>,
> = (req: INextApiRequest<B, Q>, res: NextApiResponse) => Promise<void>;

export { NextApiResponse, NextApiRequest };
