// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import base64url from 'base64url'

import Jwt, { JwtStatusCode } from '../../../../lib/jwt'
import client from '../../../../lib/client'

type Data = {
  point?: number,
  error?: string,
  message: string
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
  if (req.method == 'GET') {
    const token = req.query.token
    const tokenData = JSON.parse(base64url.decode(token.split('.')[1]))
    const verifyResult = Jwt.verify(token)
    if (verifyResult == JwtStatusCode.TokenExpired) {
      res.status(401).json({ error: 'Token expired', message: 'Token expired'})
      return
    } else if (verifyResult === JwtStatusCode.TokenInvalid) {
      res.status(401).json({ error: 'Token invalid', message: 'Token invalid' })
      return
    }
    const data = await client.user.findMany({
      where: { name: tokenData.name }
    })
    if (data.length != 0) {
      res.status(200).json({
        point: data[0].point,
        message: 'Success'
      })
    }
  } else {
    res.status(405).json({
      error: 'Only POST',
      message: 'only POST method is allowed'
    })
  }
}
