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
      "at": ${Date.now()+180}
    }`)
    this.signature = base64url(crypto.createHmac('sha256', process.env.JWT_SECRET as string).update(this.header + '.' + this.payload).digest('hex'))
  }

  getJwt() {
    return this.header + '.' + this.payload + '.' + this.signature
  }
}