// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Si usás <Image />, mantené esto para evitar optimización en servidor
    unoptimized: true,
  },
  // Opcionales:
  // reactStrictMode: true,
  // trailingSlash: false,
};

export default nextConfig;
