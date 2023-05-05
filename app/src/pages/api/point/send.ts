// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import base64url from 'base64url'

import Jwt, { JwtStatusCode } from '../../../lib/jwt'
import client from '../../../lib/client'

type Data = {
  StatusCode: number,
  message?: string
  error?: string
}

interface iRequest extends NextApiRequest {
  query: {
    from: string,
    to: string,
    money: string,
  }
}

export default async function handler(
  req: iRequest,
  res: NextApiResponse<Data>
) {
  if (req.method == 'GET') {
    const token = req.query.from
    const tokenData = JSON.parse(base64url.decode(token.split('.')[1]))
    const verifyResult = Jwt.verify(token)
    if (verifyResult == JwtStatusCode.TokenExpired) {
      res.json({ StatusCode: 401, error: 'token expired', })
      return
    } else if (verifyResult === JwtStatusCode.TokenInvalid) {
      res.json({ StatusCode: 401, error: 'token invalid', })
      return
    }

    const fromData = await client.user.findMany({
      where: { name: tokenData.name }
    })
    if (fromData.length === 0) {
      res.json({ StatusCode: 405, error: 'only POST method is allowed' })
      return
    }

    const toData = await client.user.findMany({
      where: { name: req.query.to }
    })

    if (toData.length !== 0) {
      await client.user.update({
        where: { name: req.query.to } as any, // TODO: fix this
        data: { point: toData[0].point + parseInt(req.query.money)}
      })
      res.json({ StatusCode: 200,  message: `${fromData[0].name} send ${req.query.money} point to ${req.query.to} sucessfully`})
    } else {
      res.json({ StatusCode: 401, error: 'can not find user' })
      return
    }
  }
}
