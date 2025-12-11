import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',        // важно указать порт
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '3001',
      },
      {
        protocol: 'https',               // или http, если без SSL
        hostname: 'reports.jarqin.kz',   // или IP
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
      }
    ],
  },
  experimental: {
    turbotrace: {
      memoryLimit: 4096,
    },
  },
};

export default nextConfig;
