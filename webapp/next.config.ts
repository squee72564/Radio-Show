import type { NextConfig } from "next";
import dotenv from "dotenv";

const nodeEnvMap = {
  "production": "prod",
  "development": "dev",
  "test": "test"
};

const appEnv = (process.env.APP_ENV ?? "development") as keyof typeof nodeEnvMap;

dotenv.config({path: `../.env.${nodeEnvMap[appEnv]}`})

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
    incomingRequests: true
  }
};

export default nextConfig;