/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import('./src/env.js');
import { env } from './src/env.js';
/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: env.IMAGE_PROXY_HOSTNAME,
      },
    ],
  },
  output: 'standalone',
};

export default config;
