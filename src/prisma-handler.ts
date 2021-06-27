import { ApiError, getError, getListResponse } from '@chrisfieldsii/utils';
import cuid from 'cuid';
import { v4 as uuidv4 } from 'uuid';

import {
  NextApiResponse,
  HttpMethod,
  NextApiRequest,
  INextApiRequest,
} from './types';

function defaultTransformPostBody(body: any) {
  return body;
}

// TODO: could use api-handler
export async function prismaHandler({
  prismaClient,
  req,
  res,
  table,
  include,
  transformPostBody = defaultTransformPostBody,
  customPostHandler,
  idType = 'cuid',
}: {
  prismaClient: any;
  req: INextApiRequest;
  res: NextApiResponse;
  table: string;
  include?: any;
  transformPostBody?(body: any): any;
  customPostHandler?(): any;
  idType?: 'uuid' | 'cuid';
}) {
  const method = req.method.toUpperCase() as HttpMethod;

  const client = prismaClient[table];

  try {
    if (method === 'GET') {
      // get by id
      if (req.query.id) {
        const item = await client.findUnique({
          where: { id: req.query.id },
          include,
        });

        if (!item) {
          return res
            .status(400)
            .json(
              getError(new ApiError('USER_NO_EXIST', 'User does not exist')),
            );
        }

        return res.json(item);
      }

      // get array items
      const items = await client.findMany({ include });

      return res.json(getListResponse(items));
    } else if (method === 'POST') {
      if (customPostHandler) {
        return customPostHandler();
      }

      const body = req.body ?? {};
      const data = transformPostBody(body);

      const item = await client.create({
        data: {
          ...data,
          id: req.body?.id || idType === 'cuid' ? cuid() : uuidv4(),
        },
      });

      return res.status(201).json(item);
    } else if (method === 'DELETE') {
      const item = await client.delete({
        where: req.body,
      });

      return res.json(item);
    }
  } catch (error) {
    console.error('Error:prismaHandler::', error);
    return res.status(500).json(getError(error));
  }
}
