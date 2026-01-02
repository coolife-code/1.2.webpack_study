/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // 优化 Webpack 构建
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization?.splitChunks,
        chunks: 'all',
        maxInitialRequests: 20,
        minSize: 20000,
      },
    };

    // 添加自定义插件或 loader
    // config.plugins.push(new SomePlugin());

    return config;
  },
  
  // 构建优化
  output: 'standalone',
  
  // 图像优化
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // 环境变量配置
  env: {
    APP_NAME: 'Grok Chat App',
  },
  
  // 压缩配置
  compress: true,
  
  // 页面导出配置
  // 静态导出配置，仅在使用 `next export` 时生效
  // output: 'export',
};

module.exports = nextConfig;