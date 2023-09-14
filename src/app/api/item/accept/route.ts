import { NextResponse } from 'next/server'
import base64url from 'base64url'

import client from '@/lib/client'
import Jwt, { JwtStatusCode } from '@/lib/jwt'
import adminList from '@/data/admin.json'

export async function POST(
  req: Request,
) {
  const body = await req.json()

  const token = body.token
  const tokenData = JSON.parse(base64url.decode(token.split('.')[1]))
  const verifyResult = Jwt.verify(token)
  if (verifyResult === JwtStatusCode.TokenExpired) return NextResponse.json({ error: 'not authenticated', message: 'token expired'}, { status: 401})
  else if (verifyResult === JwtStatusCode.TokenInvalid) return NextResponse.json({ error: 'not authenticated', message: 'token invalid'}, { status: 401 })
  if (adminList.indexOf(tokenData.name) === -1) return NextResponse.json({ error: 'not authenticated', message: 'not admin'}, { status: 401 })

  console.log(body.userName, +body.itemId)

  const usedItem = await client.usedItem.findFirst({ where: { user: body.userName, itemId: +body.itemId } })
  if (!usedItem) return NextResponse.json({ error: 'No item' }, { status: 403})

  
  if (usedItem) {
    await client.usedItem.updateMany({ where: { user: body.userName, itemId: +body.itemId }, data: { isPending: false, isAccepted: body.isAccpeted } })
    if (!body.isAccepted) {
      const user = await client.user.findFirst({ where: { name: body.userName } })
      const nowInventory = await client.inventory.findFirst({ where: { id: user?.id, itemId: body.itemId } })
      // await client.inventory.updateMany({ where: { id: user?.id, itemId: body.itemId }, data: { itemCount: (nowInventory?.itemCount as number) + 1 } })
    }
  }
  

  return NextResponse.json({ message: 'success' }, { status: 200 })
}
