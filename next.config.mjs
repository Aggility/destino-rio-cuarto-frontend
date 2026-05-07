import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración de Sass robusta
  sassOptions: {
    includePaths: [
      path.resolve(process.cwd(), 'node_modules'),
      path.resolve(process.cwd(), 'src/styles')
    ],
  },

  images: {
    // Permitir imágenes externas para demos (Unsplash)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn-destino.riocuarto.gob.ar',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'imagenes-prueba.riocuarto.gob.ar',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  reactStrictMode: true,
  poweredByHeader: false,
  
  // Habilitar salida standalone para Docker/Dokploy
  output: 'standalone',
};

export default nextConfig;
