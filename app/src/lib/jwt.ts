import crypto from 'crypto'
import base64url from 'base64url'

export default class Jwt {
  header: string
  payload: string
  signature: string

  constructor(name: string) {
    this.header = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' // { "alg": "HS256", "typ": "JWT" }
    this.payload = base64url(`{
      "name": "${name}",
      "at": ${Date.now()+3600000}
    }`) // 1시간 뒤 만료
    this.signature = base64url(crypto.createHmac('sha256', process.env.JWT_SECRET as string).update(this.header + '.' + this.payload).digest('hex'))
  }

  static verify(token: string) {
    const tokenData = JSON.parse(base64url.decode(token.split('.')[1]))
    const tokenSignature = token.split('.')[2]
    if (tokenData.at < Date.now()) {
      return JwtStatusCode.TokenExpired
    }
    if (tokenSignature != base64url(crypto.createHmac('sha256', process.env.JWT_SECRET as string).update(token.split('.')[0] + '.' + token.split('.')[1]).digest('hex'))) {
      return JwtStatusCode.TokenInvalid
    }
    return JwtStatusCode.OK
  }

  getJwt() {
    return this.header + '.' + this.payload + '.' + this.signature
  }
}

export enum JwtStatusCode {
  OK = 0,
  TokenExpired = 1,
  TokenInvalid = 2,
}