import { NextResponse } from 'next/server'
import crypto from 'crypto'

import client from '../../../../lib/client'
import Jwt from '../../../../lib/jwt'

export async function POST(req: Request) {
  const body = await req.json()
  const crytoPassword = crypto.createHash('sha256').update(body.password).digest('hex')
  // 프론트 단에서 #이 들어가면 그 이후에 구문이 무시됨.
  if (!body || !body.name || !body.password) {
    return NextResponse.json({ message: 'login failed', error: '# is banned' }, { status: 401 })
  }
  const data = await client.user.findMany({
    where: {
      name: body.name,
      password: crytoPassword
    }
  })
  if (data.length === 1) {
    const jwt = new Jwt(data[0].name as string)
    return NextResponse.json({
      message: `user ${data[0].name} login successfully`,
      token: jwt.getJwt(),
    }, { status: 200 })
  }
}
