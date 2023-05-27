import { NextResponse } from 'next/server'

import client from '../../../../lib/client'

export async function GET(
  req: Request
) {
  const data = await client.item.findMany()
  if (data.length !== 0) {
    return NextResponse.json({
      item: data,
    }, { status: 200 })
  } else {
    return NextResponse.json({ message: 'No items found' }, { status: 404})
  }
}
