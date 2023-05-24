import type { NextApiRequest, NextApiResponse } from 'next'
import base64url from 'base64url'

import client from '../../../lib/client'
import Jwt, { JwtStatusCode } from '../../../lib/jwt'
import { Inventory, Item, User } from '@prisma/client'

type Data = {
  error?: string,
  item?: Inventory[],
  message?: string
}

interface iRequest extends NextApiRequest {
  body: {
    token: string,
  }
}

export default async function handler(
  req: iRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    const token: string = req.body.token
    const tokenData = JSON.parse(base64url.decode(token.split('.')[1]))
    const verifyResult = Jwt.verify(token)
    if (verifyResult === JwtStatusCode.TokenExpired) return res.status(401).json({ error: 'not authenticated', message: 'token expired'})
    else if (verifyResult === JwtStatusCode.TokenInvalid) return res.status(401).json({ error: 'not authenticated', message: 'token invalid'})
    
    const user: User | null = await client.user.findFirst({ where: { name: tokenData.name } })
    if (!user?.point && (user?.point !== 0)) return res.status(401).json({ error: 'unknown user or item' })

    const itemInInventory: Inventory[] = await client.inventory.findMany({ where: { id: user.id } })
    return res.status(200).json({ item: itemInInventory})
  } else {
    return res.status(405).json({ error: 'only POST' })
  }
}
