import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["nagalsky-budget-tracker.netlify.app"],
    },
  },
  env: {
    NODE_TLS_REJECT_UNAUTHORIZED: "0",
  },
};

export default nextConfig;
