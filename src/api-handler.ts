import type { NextApiResponse } from 'next';

import { HttpMethod, INextApiRequest, NextApiHandler } from './types';

interface IApiHandler {
  on(method: HttpMethod, handler: NextApiHandler): IApiHandler;
  execute(req: INextApiRequest, res: NextApiResponse): Promise<void>;
}

/**
 * @desc Utility to specify callbacks for a HTTP method
 */
export class ApiHandler implements IApiHandler {
  private handlerMap: Map<HttpMethod, NextApiHandler>;

  constructor() {
    this.handlerMap = new Map();
  }

  on = (method: HttpMethod, handler: NextApiHandler) => {
    this.handlerMap.set(method, handler);

    return this;
  };

  execute = async (req: INextApiRequest, res: NextApiResponse) => {
    const handler = this.handlerMap.get(req.method);

    if (!handler) {
      throw new Error(`HTTP Method ${req.method} not supported`);
    }

    await handler(req, res);
  };
}
