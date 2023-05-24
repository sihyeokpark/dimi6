import { NextResponse } from 'next/server'
import client from '../../../../lib/client'

export default async function POST(
  req: Request
) {
  await client.user.create({
    data: {
      ...(await req.json()),
      point: 0
    },
  })
  NextResponse.json({ message: `user ${(await req.json()).name} created successfully` }, { status: 200})
}
