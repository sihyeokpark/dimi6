// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'

import client from '../../../lib/client'
import Jwt from '../../../lib/jwt'

type ResponseDataType = {
  StatusCode: number,
  error?: string,
  message: string,
  token?: string
}

interface iRequest extends NextApiRequest {
  query: {
    name: string,
    password: string
  }
}

export default async function handler(
  req: iRequest,
  res: NextApiResponse<ResponseDataType>
) {
  if (req.method == 'GET') {
    const crytoPassword = crypto.createHash('sha256').update(req.query.password).digest('hex')
    // 프론트 단에서 #이 들어가면 그 이후에 구문이 무시됨.
    if (!req.query || !req.query.name || !req.query.password) {
      res.json({ StatusCode: 401, message: 'login failed', error: '# is banned' })
      return
    }
    const data = await client.user.findMany({
      where: {
        name: req.query.name,
        password: crytoPassword
      }
    })
    if (data.length === 1) {
      const jwt = new Jwt(data[0].name as string)
      res.json({
        StatusCode: 200,
        message: `user ${data[0].name} login successfully`,
        token: jwt.getJwt(),
      })
    } else {
      res.json({
        StatusCode: 401,
        message: 'login failed',
        error: 'username or password is incorrect',
      })
    }
  }
}
