/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com", "replicate.delivery"],
    formats: ["image/avif", "image/webp"]
  },
  serverExternalPackages: ["@paddle/paddle-node-sdk", "sharp", "bcryptjs"],
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react", "recharts"]
  },
  poweredByHeader: false,
  compress: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
