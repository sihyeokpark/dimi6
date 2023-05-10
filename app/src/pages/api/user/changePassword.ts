// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'

import client from '../../../lib/client'

type ResponseDataType = {
  StatusCode: number,
  error?: string,
  message: string,
}

interface iRequest extends NextApiRequest {
  query: {
    name: string,
    currentPassword: string,
    newPassword: string,
  }
}

export default async function handler(
  req: iRequest,
  res: NextApiResponse<ResponseDataType>
) {
  if (req.method == 'POST') {
    const crytoPassword = crypto.createHash('sha256').update(req.query.currentPassword).digest('hex')
    // 프론트 단에서 #이 들어가면 그 이후에 구문이 무시됨.
    const data = await client.user.findMany({
      where: {
        name: req.query.name,
        password: crytoPassword
      }
    })
    if (data.length === 1) {
      await client.user.update({
        where: {
          name: req.query.name
        },
        data: {
          password: crypto.createHash('sha256').update(req.query.newPassword).digest('hex')
        }
      })
      res.json({
        StatusCode: 200,
        message: `user ${data[0].name} changed password successfully`,
      })
    } else {
      res.json({
        StatusCode: 401,
        message: 'Change password failed',
        error: 'Current password is not correct',
      })
    }
  }
}
