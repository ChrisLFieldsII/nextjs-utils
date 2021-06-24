import {
  HttpMethod,
  NextApiHandler,
  NextApiRequest,
  NextApiResponse,
} from './types';

interface IApiHandler {
  on(method: HttpMethod, handler: NextApiHandler): IApiHandler;
  execute(req: NextApiRequest, res: NextApiResponse): Promise<void>;
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

  execute = async (req: NextApiRequest, res: NextApiResponse) => {
    const handler = this.handlerMap.get(req.method as HttpMethod);

    if (!handler) {
      throw new Error(`HTTP Method ${req.method} not supported`);
    }

    await handler(req, res);
  };
}
