// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import client from '../../../lib/client'

type Data = {
  StatusCode: number,
  message: string,
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method == 'POST') {
    await client.user.create({
      data: {
        ...req.body,
        point: 0
      },
    })
    res.json({
      StatusCode: 200,
      message: `user ${req.body.name} created successfully`
    })
  } else {
    res.json({
      StatusCode: 405,
      message: 'method not allowed',
      error: 'only POST method is allowed'
    })
  }
}
