/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['react-big-calendar', 'jspdf', 'html2canvas'],
  experimental: {
    esmExternals: true,
    largePageDataBytes: 128 * 100000,
    scrollRestoration: false,
    disableOptimizedLoading: true,
    disablePostcssPresetEnv: true
  },
  images: {
    domains: ['jztbkimlcrfndooyhohg.supabase.co'],
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  env: {
    PORT: '3000',
    HOSTNAME: '0.0.0.0'
  },
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      poll: 800,
      aggregateTimeout: 300,
    };
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': './src'
    };
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      canvas: false,
      encoding: false
    };
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'static/fonts/'
        }
      }
    });
    return config
  }
}

module.exports = nextConfig