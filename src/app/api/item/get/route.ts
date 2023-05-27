import type { NextApiRequest, NextApiResponse } from 'next'

import client from '../../../../lib/client'
import { Item } from '@prisma/client'

type Data = {
  item?: Item[], 
  error?: string
}

interface iRequest extends NextApiRequest {
  query: {
    token: string
  }
}

export default async function handler(
  req: iRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'GET') {
    const data = await client.item.findMany()
    if (data.length !== 0) {
      res.status(200).json({
        item: data,
      })
    }
  } else {
    res.status(405).json({
      error: 'only POST'
    })
  }
}
