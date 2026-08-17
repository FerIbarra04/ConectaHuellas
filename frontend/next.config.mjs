/** @type {import('next').NextConfig} */

const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },

  images: {
    unoptimized: true,
  },

  allowedDevOrigins: ["192.168.1.232"],
}

export default nextConfig