const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
require('dotenv').config();

module.exports = {
  title: 'EoneoPay JavaScript SDK v2',
  base: '/',
  head: [
    ['script', { src: '/eoneo-pay.iife.js' }],
    ['script', { src: '/cookie.js' }],
  ],
  themeConfig: {
    sidebar: 'auto'
  },
  configureWebpack: (config) => {
    return { plugins: [
      new webpack.EnvironmentPlugin({ ...process.env })
    ]}
  },
  chainWebpack(config) {
    config
      .plugin('copy')
      .use(CopyPlugin, [
        ['dist/eoneo-pay.iife.js'],
      ]);

    // config.module
    //   .rule('sass')
    //   .test(/\.sass$/)
    //   .use('sass-loader')
    //     .loader('sass-loader')
    //     .end()
  }
}
