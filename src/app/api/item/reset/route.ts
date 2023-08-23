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

  await client.usedItem.deleteMany({ where: { isPending: false }})


  return NextResponse.json({ message: 'success' }, { status: 200 })
}
