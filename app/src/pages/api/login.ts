// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'

import client from '../lib/client'

type Data = {
  StatusCode: number,
  error?: string,
  message: string,
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method == 'GET') {
    const crytoPassword = crypto.createHash('sha256').digest('base64')
    console.log(crytoPassword)
    const data = await client.user.findMany({
      where: {
        name: req.query.password as string,
        password: crytoPassword
      }
    })
    if (data.length === 1) {
      res.json({
        StatusCode: 200,
        message: `user ${data[0].name} login successfully`,
        name: data[0].name || 'failed',
      })
    } else {
      res.json({
        StatusCode: 401,
        message: 'login failed',
        error: 'username or password is incorrect',
        name: 'failed'
      })
    }
  }
}
