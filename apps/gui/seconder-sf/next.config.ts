import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()
const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['@sec/gui-seconder'],
  turbopack: { },
  experimental: {
    ppr: 'incremental'
  }
}

export default withNextIntl(nextConfig)
