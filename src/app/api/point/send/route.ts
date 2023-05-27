// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import base64url from 'base64url'

import Jwt, { JwtStatusCode } from '../../../../lib/jwt'
import adminMembers from '../../../../data/admin.json'
import client from '../../../../lib/client'

type Data = {
  message?: string
  error?: string
}

interface iRequest extends NextApiRequest {
  body: {
    from: string,
    to: string,
    money: string,
  }
}

export default async function handler(
  req: iRequest,
  res: NextApiResponse<Data>
) {
  if (req.method == 'POST') {
    const token = req.body.from
    if (!token || token === 'null') {
      res.status(401).json({ error: 'token is null', })
      return
    }
    const tokenData = JSON.parse(base64url.decode(token.split('.')[1]))
    const verifyResult = Jwt.verify(token)
    if (verifyResult === JwtStatusCode.TokenExpired) return res.status(401).json({ error: 'token expired', })
    else if (verifyResult === JwtStatusCode.TokenInvalid) return res.status(401).json({ error: 'token invalid', })

    const fromData = await client.user.findMany({
      where: { name: tokenData.name }
    })
    if (fromData.length === 0) return res.status(405).json({ error: 'only POST method is allowed' })

    if (adminMembers.indexOf(fromData[0].name as string) === -1) return res.status(401).json({ error: 'only admin can send point' })

    const toData = await client.user.findMany({
      where: { name: req.body.to }
    })

    if (toData.length !== 0) {
      await client.user.update({
        where: { name: req.body.to } as any, // TODO: fix this
        data: { point: toData[0].point + parseInt(req.body.money)}
      })
      return res.status(200).json({ message: `${fromData[0].name} send ${req.body.money} point to ${req.body.to} sucessfully`})
    } else {
      return res.status(401).json({ error: 'can not find user' })
    }
  }
}
