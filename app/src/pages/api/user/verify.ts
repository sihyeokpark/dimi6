// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import base64url from 'base64url'
import crypto from 'crypto'

import client from '../../../lib/client'
import Jwt, { JwtStatusCode } from '../../../lib/jwt'

type ResponseDataType = {
  StatusCode: number,
  name?: string,
  error?: string,
}

interface iRequest extends NextApiRequest {
  query: {
    token: string
  }
}

export default async function handler(
  req: iRequest,
  res: NextApiResponse<ResponseDataType>
) {
  if (req.method == 'GET') {
    const token = req.query.token
    const tokenData = JSON.parse(base64url.decode(token.split('.')[1]))
    const verifyResult = Jwt.verify(token)
    if (verifyResult == JwtStatusCode.TokenExpired) {
      res.json({ StatusCode: 401, error: 'token expired', })
      return
    } else if (verifyResult === JwtStatusCode.TokenInvalid) {
      res.json({ StatusCode: 401, error: 'token invalid', })
      return
    } else {
      res.json({ StatusCode: 200, name: tokenData.name })
    }
  }
}
