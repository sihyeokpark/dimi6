// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import client from '../../../../lib/client'

type Data = {
  message: string,
  error?: string
}

interface iRequest extends NextApiRequest {
  body: {
    name: string,
    password: string,
    email: string
  }
}

export default async function handler(
  req: iRequest,
  res: NextApiResponse<Data>
) {
  if (req.method == 'POST') {
    await client.user.create({
      data: {
        ...req.body,
        point: 0
      },
    })
    res.status(200).json({
      message: `user ${req.body.name} created successfully`
    })
  } else {
    res.status(405).json({
      message: 'method not allowed',
      error: 'only POST method is allowed'
    })
  }
}
