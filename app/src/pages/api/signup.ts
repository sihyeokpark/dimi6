// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import client from '../lib/client'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method == 'POST') {
    console.log(req.body)
    await client.user.create({
      data: {
        // ...req.body,
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        point: 0,
      },
    })
    res.json({
      name: 'true',
    })
  }
}
