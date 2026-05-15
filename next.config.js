/** @type {import('next').NextConfig} */
const nextConfig = {
  // Stellar SDK uses Node.js native modules (sodium-native) for signing.
  // These must be excluded from the browser bundle — signing happens
  // in Freighter wallet extension, not in the browser JS bundle.
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        path: false,
        os: false,
      };

      // Exclude sodium-native (Node.js native addon) from browser bundle
      config.externals = [
        ...(config.externals || []),
        { "sodium-native": "sodium-native" },
      ];
    }

    // Suppress the sodium-native critical dependency warnings —
    // these are expected since we externalize it above
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      { module: /sodium-native/ },
      { module: /require-addon/ },
    ];

    return config;
  },
};

module.exports = nextConfig;
