import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/fein-landing",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
