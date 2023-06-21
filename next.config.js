/** @type {import('next').NextConfig} */
const ContentSecurityPolicy = `
default-src 'self';
script-src 'self' ;
style-src 'self';
img-src * blob: data:;
media-src 'none';
connect-src *;
font-src 'self';
object-src 'none';
`

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ''),
  },
]

async function headers() {
  return [
    {
      source: '/(.*)',
      headers: securityHeaders,
    },
  ]
}

const nextConfig = {
  reactStrictMode: false,
  experimental: {
    appDir: true,
  },
  headers: headers
}

module.exports = nextConfig
