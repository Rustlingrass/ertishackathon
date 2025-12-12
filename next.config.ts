// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Локалка для dev
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/uploads/**',
      },

      // Прод (твой бэкенд на Google Cloud)
      {
        protocol: 'http',
        hostname: '34.51.240.162',
        port: '8000',
        pathname: '/uploads/**',
      },

      // Будущий домен
      {
        protocol: 'https',
        hostname: 'reports.jarqin.kz',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'reports.jarqin.kz',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;