import type { NextConfig } from "next";
import path from "path";
import dotenv from "dotenv";

const nodeEnvMap = {
  "production": "prod",
  "development": "dev",
  "test": "test"
};

dotenv.config({path: `../.env.${nodeEnvMap[process.env.NODE_ENV!]}`})

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
