import { NextResponse } from 'next/server'

import client from '@/lib/client'

export async function GET(req: Request) {
  const posts = await client.post.findMany()
  return NextResponse.json(posts, { status: 200, headers: {
    'cache-control': 'public, s-maxage=1200, stale-while-revalidate=600',
  }, })
}
