import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@coinbase/agentkit', 'graphql-request'],
};

export default nextConfig;
