// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import base64url from 'base64url'

import Jwt, { JwtStatusCode } from '@/lib/jwt'
import client from '@/lib/client'

type Data = {
  StatusCode: number,
  message: string,
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
    if (verifyResult == JwtStatusCode.TokenExpired) return res.json({ StatusCode: 401, error: 'Not authenticated', message: 'Token expired'})
    else if (verifyResult === JwtStatusCode.TokenInvalid) return res.json({ StatusCode: 401, error: 'Not authenticated', message: 'Token invalid'})

    const fromData = await client.user.findMany({
      where: { name: tokenData.name }
    })
    if (fromData.length === 0) return res.json({ StatusCode: 405, error: 'only POST', message: 'only POST method is allowed' })

    const toData = await client.user.findMany({
      where: { name: req.query.to }
    })

    if (fromData[0].point >= parseInt(req.query.money) && toData.length !== 0) {
      await client.user.update({
        where: { name: tokenData.name } as any, // TODO: fix this
        data: { point: fromData[0].point - parseInt(req.query.money)}
      })
      await client.user.update({
        where: { name: req.query.to } as any, // TODO: fix this
        data: { point: toData[0].point + parseInt(req.query.money)}
      })
      return res.json({ StatusCode: 200,  message: `${fromData[0].name} give ${req.query.money} point to ${req.query.to} sucessfully`})
    } else {
      return res.json({ StatusCode: 401, error: 'Not enough point', message: 'Not enough point' })
    }
  }
}
