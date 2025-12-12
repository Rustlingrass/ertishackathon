import type { NextConfig } from "next";

const nextConfig = {
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
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
      },
      {
        // The protocol of the image URL
        protocol: 'http', 
        // The hostname (IP address) from the error message
        hostname: '34.51.240.162', 
        // OPTIONAL: Specify the port (8000 in your case) if it's non-standard (e.g., not 80 for http)
        port: '8000', 
        // OPTIONAL: Specify the path to restrict which images can be loaded (e.g., '/uploads/**')
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
