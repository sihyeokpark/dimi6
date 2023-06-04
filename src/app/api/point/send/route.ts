import { NextResponse } from 'next/server'
import base64url from 'base64url'

import Jwt, { JwtStatusCode } from '@/lib/jwt'
import adminMembers from '@/data/admin.json'
import client from '@/lib/client'

export async function POST(
  req: Request,
) {
  const body = await req.json()
  const token = body.from
  if (!token || token === 'null')  return NextResponse.json({ error: 'token is null' }, { status: 401 })

  const tokenData = JSON.parse(base64url.decode(token.split('.')[1]))
  const verifyResult = Jwt.verify(token)
  if (verifyResult === JwtStatusCode.TokenExpired) return NextResponse.json({ error: 'token expired', }, { status: 401 })
  else if (verifyResult === JwtStatusCode.TokenInvalid) return NextResponse.json({ error: 'token invalid', }, { status: 401 })

  const fromData = await client.user.findMany({
    where: { name: tokenData.name }
  })
  if (fromData.length === 0) return NextResponse.json({ error: 'no user' }, { status: 404 })

  if (adminMembers.indexOf(fromData[0].name as string) === -1) return NextResponse.json({ error: 'only admin can send point' }, { status: 403 })

  const toData = await client.user.findMany({
    where: { name: body.to }
  })

  if (toData.length !== 0) {
    await client.user.update({
      where: { name: body.to },
      data: { point: toData[0].point + parseInt(body.money)}
    })
    return NextResponse.json({ message: `${fromData[0].name} send ${body.money} point to ${body.to} sucessfully`}, { status: 200 })
  } else {
    return NextResponse.json({ error: 'can not find user' }, { status: 404 })
  }
}
