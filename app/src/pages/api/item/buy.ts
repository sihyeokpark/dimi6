import type { NextApiRequest, NextApiResponse } from 'next'
import base64url from 'base64url'

import client from '../../../lib/client'
import Jwt, { JwtStatusCode } from '../../../lib/jwt'
import { Item, User } from '@prisma/client'

type Data = {
  error?: string,
  money?: number,
  message?: string
}

interface iRequest extends NextApiRequest {
  body: {
    token: string,
    itemId: number
  }
}

export default async function handler(
  req: iRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    const item: Item | null = await client.item.findFirst({ where: { id: req.body.itemId } })
    if (!item) return res.status(401).json({ error: 'Item not found' })

    const token: string = req.body.token
    const tokenData = JSON.parse(base64url.decode(token.split('.')[1]))
    const verifyResult = Jwt.verify(token)
    if (verifyResult === JwtStatusCode.TokenExpired) return res.status(401).json({ error: 'not authenticated', message: 'token expired'})
    else if (verifyResult === JwtStatusCode.TokenInvalid) return res.status(401).json({ error: 'not authenticated', message: 'token invalid'})


    const user: User | null = await client.user.findFirst({ where: { name: tokenData.name } })
    if (!item.price || (!user?.point && (user?.point !== 0))) return res.status(401).json({ error: 'unknown user or item' })

    console.log(item.price, user.point)
    if (user.point < item.price) return res.status(401).json({ error: 'not enough point', message: 'not enough point' })

    await client.user.update({ where: { name: tokenData.name }, data: { point: user.point - item.price } })

    const itemInInventory = await client.inventory.findFirst({ where: { id: user.id, itemId: item.id } })
    if (itemInInventory) await client.inventory.updateMany({ where: { id: user.id, itemId: item.id }, data: { itemCount: itemInInventory.itemCount + 1 } })
    else await client.inventory.create({ data: { id: user.id, itemId: item.id, itemCount: 1 } })

    return res.status(200).json({ money: user.point - item.price })
  } else {
    return res.status(405).json({ error: 'only POST' })
  }
}
