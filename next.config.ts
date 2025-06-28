import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
};

export default withBotId(nextConfig);
