// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Genera el sitio como archivos estáticos en /out
  output: "export",

  // Si usás <Image /> de Next, desactiva la optimización en servidor
  images: {
    unoptimized: true,
  },

  // (opcionales)
  // reactStrictMode: true,
  // trailingSlash: false, // dejalo en false salvo que necesites URLs con /
};

export default nextConfig;
