import { NextResponse } from 'next/server'
import base64url from 'base64url'

import client from '@/lib/client'
import Jwt, { JwtStatusCode } from '@/lib/jwt'

export async function POST(
  req: Request,
) {
  const body = await req.json()
  const item = await client.item.findFirst({ where: { id: body.itemId } })
  if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404})

  const token = body.token
  const tokenData = JSON.parse(base64url.decode(token.split('.')[1]))
  const verifyResult = Jwt.verify(token)
  if (verifyResult === JwtStatusCode.TokenExpired) return NextResponse.json({ error: 'not authenticated', message: 'token expired'}, { status: 401})
  else if (verifyResult === JwtStatusCode.TokenInvalid) return NextResponse.json({ error: 'not authenticated', message: 'token invalid'}, { status: 401 })


  const user  = await client.user.findFirst({ where: { name: tokenData.name } })
  if (!item.price || (!user?.point && (user?.point !== 0))) return NextResponse.json({ error: 'unknown user or item' }, { status: 401})
  if (user.point < item.price) return NextResponse.json({ error: 'not enough point', message: 'not enough point' }, { status: 403 })

  await client.user.update({ where: { name: tokenData.name }, data: { point: user.point - item.price } })

  const itemInInventory = await client.inventory.findFirst({ where: { id: user.id, itemId: item.id } })
  if (itemInInventory) await client.inventory.updateMany({ where: { id: user.id, itemId: item.id }, data: { itemCount: itemInInventory.itemCount + 1 } })
  else await client.inventory.createMany({ data: { uid: (new Date()).getTime().toString(), id: user.id, itemId: item.id, itemCount: 1 }})

  return NextResponse.json({ money: user.point - item.price }, { status: 200 })
}
