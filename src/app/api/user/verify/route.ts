import { NextResponse } from 'next/server'

import base64url from 'base64url'

import Jwt, { JwtStatusCode } from '@/lib/jwt'

export async function POST(
  req: Request,
) {
  const body = await req.json()
  const token = body.token
  if (!token || token === 'null') {
    return NextResponse.json({ error: 'token invalid', }, { status: 401 })
  }
  const tokenData = JSON.parse(base64url.decode(token.split('.')[1]))
  const verifyResult = Jwt.verify(token)
  if (verifyResult == JwtStatusCode.TokenExpired) {
    return NextResponse.json({ error: 'token expired', }, { status: 401 })
  } else if (verifyResult === JwtStatusCode.TokenInvalid) {
    return NextResponse.json({ error: 'token invalid', }, { status: 401 })
  } else {
    return NextResponse.json({ name: tokenData.name }, { status: 200 })
  }
}
