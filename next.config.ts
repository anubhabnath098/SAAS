import type { NextConfig } from "next";

const nextConfig = {
  experimental:{
      staleTimes:{
          dynamic:0,
      }
  }
};

export default nextConfig;
