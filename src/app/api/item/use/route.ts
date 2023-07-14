import { NextResponse } from 'next/server'
import base64url from 'base64url'

import client from '@/lib/client'
import Jwt, { JwtStatusCode } from '@/lib/jwt'

export async function POST(
  req: Request,
) {
  const body = await req.json()
  if (body.itemId !== 0) return NextResponse.json({ error: 'Item can\'t be used' }, { status: 404})

  const token = body.token
  const tokenData = JSON.parse(base64url.decode(token.split('.')[1]))
  const verifyResult = Jwt.verify(token)
  if (verifyResult === JwtStatusCode.TokenExpired) return NextResponse.json({ error: 'not authenticated', message: 'token expired'}, { status: 401})
  else if (verifyResult === JwtStatusCode.TokenInvalid) return NextResponse.json({ error: 'not authenticated', message: 'token invalid'}, { status: 401 })

  const user  = await client.user.findFirst({ where: { name: tokenData.name } })
  
  const usedItem = await client.usedItem.findFirst({ where: { user: user?.name as string, itemId: body.itemId } })
  if (usedItem) return NextResponse.json({ error: 'Item already used' }, { status: 403})
  
  if (!usedItem) {
    await client.usedItem.create({ data: { user: user?.name as string, itemId: body.itemId } })
    const inventory = await client.inventory.findFirst({ where: { id: user?.id as number, itemId: body.itemId } })
    await client.inventory.updateMany({ where: { id: user?.id as number, itemId: body.itemId }, data: { itemCount: (inventory?.itemCount as number) - 1 } })
  }
  

  return NextResponse.json({ message: 'success' }, { status: 200 })
}
