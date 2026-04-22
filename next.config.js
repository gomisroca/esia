/* eslint-disable import/no-duplicates */
/* eslint-disable simple-import-sort/imports */

import './src/env.js';
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
