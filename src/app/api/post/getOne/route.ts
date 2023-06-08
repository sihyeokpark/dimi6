import { NextResponse } from 'next/server'

import client from '@/lib/client'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id') as string
  const post = await client.post.findFirst({
    where: { id: +id }
  })
  return NextResponse.json(post, { status: 200 })
}
