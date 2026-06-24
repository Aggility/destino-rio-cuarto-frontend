import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🔥 Clave para Docker liviano
  output: 'standalone',

  // 🧠 Reduce carga del server
  compress: true,

  // ⚡ Minificación rápida (menos CPU/RAM en build y runtime)
  swcMinify: true,

  // 🔒 Seguridad + menos headers innecesarios
  poweredByHeader: false,

  // 🧪 Opcional (podés dejarlo, no afecta RAM fuerte)
  reactStrictMode: true,

  // 🎨 Sass optimizado
  sassOptions: {
    includePaths: [
      path.resolve(process.cwd(), 'node_modules'),
      path.resolve(process.cwd(), 'src/styles'),
    ],
  },

  // 🖼️ Imágenes optimizadas
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn-destino.riocuarto.gob.ar',
      },
      {
        protocol: 'https',
        hostname: 'imagenes-prueba.riocuarto.gob.ar',
      },
    ],
    formats: ['image/avif', 'image/webp'],

    // ⚠️ Reducido (menos RAM en procesamiento de imágenes)
    deviceSizes: [640, 828, 1080, 1200, 1920],
    imageSizes: [32, 64, 128, 256, 384],
  },

  // 🚀 Reduce trabajo del server en runtime
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;