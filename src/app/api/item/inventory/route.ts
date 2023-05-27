import { NextResponse } from 'next/server'
import base64url from 'base64url'

import client from '../../../../lib/client'
import Jwt, { JwtStatusCode } from '../../../../lib/jwt'

export async function POST(
  req: Request,
) {
  const token = (await req.json()).token
  const tokenData = JSON.parse(base64url.decode(token.split('.')[1]))
  const verifyResult = Jwt.verify(token)
  if (verifyResult === JwtStatusCode.TokenExpired) return NextResponse.json({ error: 'not authenticated', message: 'token expired'}, { status: 401})
  else if (verifyResult === JwtStatusCode.TokenInvalid) return NextResponse.json({ error: 'not authenticated', message: 'token invalid'}, { status: 401 })
  
  const user = await client.user.findFirst({ where: { name: tokenData.name } })
  if (!user?.point && (user?.point !== 0)) return NextResponse.json({ error: 'unknown user or item' }, { status: 401 })

  const itemInInventory = await client.inventory.findMany({ where: { id: user?.id } })
  return NextResponse.json({ item: itemInInventory}, { status: 200 })
}
