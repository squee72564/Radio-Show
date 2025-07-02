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
  /* config options here */
};

export default nextConfig;
