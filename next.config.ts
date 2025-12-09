import type {NextConfig} from 'next';
import { DuplicatesPlugin } from "webpack";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Add a rule to handle the replacement in the service worker
    config.module.rules.push({
      test: /firebase-messaging-sw\.js$/,
      loader: 'string-replace-loader',
      options: {
        search: 'REPLACE_WITH_YOUR_API_KEY',
        replace: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        flags: 'g'
      }
    });
    config.module.rules.push({
        test: /firebase-messaging-sw\.js$/,
        loader: 'string-replace-loader',
        options: {
          search: 'REPLACE_WITH_YOUR_AUTH_DOMAIN',
          replace: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          flags: 'g'
        }
    });
    config.module.rules.push({
        test: /firebase-messaging-sw\.js$/,
        loader: 'string-replace-loader',
        options: {
          search: 'REPLACE_WITH_YOUR_PROJECT_ID',
          replace: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          flags: 'g'
        }
    });
    config.module.rules.push({
        test: /firebase-messaging-sw\.js$/,
        loader: 'string-replace-loader',
        options: {
          search: 'REPLACE_WITH_YOUR_STORAGE_BUCKET',
          replace: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          flags: 'g'
        }
    });
    config.module.rules.push({
        test: /firebase-messaging-sw\.js$/,
        loader: 'string-replace-loader',
        options: {
          search: 'REPLACE_WITH_YOUR_MESSAGING_SENDER_ID',
          replace: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          flags: 'g'
        }
    });
    config.module.rules.push({
        test: /firebase-messaging-sw\.js$/,
        loader: 'string-replace-loader',
        options: {
          search: 'REPLACE_WITH_YOUR_APP_ID',
          replace: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
          flags: 'g'
        }
    });
    config.module.rules.push({
        test: /firebase-messaging-sw\.js$/,
        loader: 'string-replace-loader',
        options: {
          search: 'REPLACE_WITH_YOUR_MEASUREMENT_ID',
          replace: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
          flags: 'g'
        }
    });


    // Important: return the modified config
    return config
  },
};

export default nextConfig;
