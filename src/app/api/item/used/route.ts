import { NextResponse } from 'next/server'

import client from '@/lib/client'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const itemId = +(searchParams.get('itemId') as string)

  const usedItems = await client.usedItem.findMany({ where: { itemId: itemId } })
  
  return NextResponse.json(usedItems, { status: 200 })
}
