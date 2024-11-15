/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['mui-color-input'],
  experimental: {
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
  },
    webpack: (config) => {
        config.externals = [...config.externals, { canvas: "canvas" }]; // required to make Konva & react-konva work
        return config;
      },
};

export default nextConfig;
