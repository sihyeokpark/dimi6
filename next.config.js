/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    appDir: true,
    serverComponents: true,
    outputStandalone: true,
  }
}

module.exports = nextConfig
