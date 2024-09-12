// Talos 线上构建会注入 PUBLIC_URL 环境变量
// const { PUBLIC_URL = '/' } = process.env

/**
 * @see https://cli.vuejs.org/zh/config/
 */
module.exports = {
  // publicPath: PUBLIC_URL, // Talos 发布必备，特定 CDN 地址
  outputDir: 'build', // Talos CI 仅识别并打包 build 目录
  lintOnSave: process.env.NODE_ENV !== 'production', // 加快生产构建速度
  // productionSourceMap: process.env.GENERATE_SOURCEMAP === 'true', // .env.* 中配置
  // css: {
  //   sourceMap: process.env.GENERATE_CSS_SOURCEMAP === 'true',
  // },
  
  // pluginOptions: {
  //   stylelint: {
  //     // http://git.sankuai.com/projects/HFE/repos/vue-cli-plugin-stylelint/browse
  //     // lintOnSave: process.env.NODE_ENV !== 'production', // boolean | 'error',
  //     lintOnSave: false,
  //   },
  // },
  // chainWebpack: config => {
  //   config.resolve.extensions
  //     .merge(['.ts', '.tsx']);
  //   config.module
  //     .rule('ts')
  //     .test(/\.ts$/)
  //     .use('ts-loader')
  //     .loader('ts-loader')
  //     .tap(options => {
  //       options.appendTsSuffixTo = [/\.vue$/];
  //       return options;
  //     });
  // },
  configureWebpack: {
    // devtool: 'source-map'
    devServer: {
      port: 8080,
      hot: true,
    },
    entry: './src/main.js',
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        }
        
      ],
    },
  }
}
