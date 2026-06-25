import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@coinbase/agentkit', 'graphql-request', '@coinbase/x402', '@coinbase/cdp-sdk'],
};

export default nextConfig;
