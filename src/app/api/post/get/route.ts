import { NextResponse } from 'next/server'

import client from '@/lib/client'
import JWT, { JwtStatusCode } from '@/lib/jwt'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token') as string
  if (JWT.verify(token) === JwtStatusCode.OK) {
    const posts = await client.post.findMany()
    return NextResponse.json(posts, { status: 200 })
  } else {
    return NextResponse.json({ status: 401 })
  }
}
