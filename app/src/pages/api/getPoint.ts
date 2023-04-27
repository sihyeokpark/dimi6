// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import client from '../lib/client'

type Data = {
  StatusCode: number,
  point?: number,
  error?: string
}

interface iRequest extends NextApiRequest {
  query: {
    name: string
  }
}

export default async function handler(
  req: iRequest,
  res: NextApiResponse<Data>
) {
  if (req.method == 'GET') {
    const data = await client.user.findMany({
      where: {
        name: req.query.name
      }
    })
    if (data.length != 0) {
      res.json({
        StatusCode: 200,
        point: data[0].point
      })
    }
  } else {
    res.json({
      StatusCode: 405,
      error: 'only POST method is allowed',
    })
  }
}
