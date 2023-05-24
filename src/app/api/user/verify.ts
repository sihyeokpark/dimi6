import type { NextApiRequest, NextApiResponse } from 'next'
import base64url from 'base64url'

import Jwt, { JwtStatusCode } from '../../../lib/jwt'

type ResponseDataType = {
  name?: string,
  error?: string,
}

interface iRequest extends NextApiRequest {
  body: {
    token: string
  }
}

export default async function handler(
  req: iRequest,
  res: NextApiResponse<ResponseDataType>
) {
  if (req.method == 'POST') {
    const token = req.body.token
    if (!token || token === 'null') {
      res.status(401).json({ error: 'token invalid', })
      return
    }
    const tokenData = JSON.parse(base64url.decode(token.split('.')[1]))
    const verifyResult = Jwt.verify(token)
    if (verifyResult == JwtStatusCode.TokenExpired) {
      res.status(401).json({ error: 'token expired', })
      return
    } else if (verifyResult === JwtStatusCode.TokenInvalid) {
      res.status(401).json({ error: 'token invalid', })
      return
    } else {
      res.status(200).json({ name: tokenData.name })
    }
  }
}
