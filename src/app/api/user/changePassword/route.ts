import { NextResponse } from 'next/server'
import crypto from 'crypto'

import client from '@/lib/client'

export async function POST(req: Request) {
  const body = await req.json()
  const crytoPassword = crypto.createHash('sha256').update(body.currentPassword).digest('hex')
  // 프론트 단에서 #이 들어가면 그 이후에 구문이 무시됨.
  const data = await client.user.findMany({
    where: {
      name: body.name,
      password: crytoPassword
    }
  })
  if (data.length === 1) {
    await client.user.update({
      where: {
        name: body.name
      },
      data: {
        password: crypto.createHash('sha256').update(body.newPassword).digest('hex')
      }
    })
    NextResponse.json({
      message: `user ${data[0].name} changed password successfully`,
    }, { status: 200})
  } else {
    NextResponse.json({
      message: 'Change password failed',
      error: 'Current password is not correct',
    }, { status: 401})
  }
}
