import { NextResponse } from 'next/server'
import base64url from 'base64url'

import client from '@/lib/client'

export async function POST(req: Request, res: Response) {
  const body = await req.json()

  const name = JSON.parse(base64url.decode(body.token.split('.')[1])).name

  await client.post.create({
    data: {
      title: body.title,
      content: body.content,
      date: new Date(),
      writer: name
    },
  })
  return NextResponse.json({ message: 'success' }, { status: 200 })
}
