const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  title: 'Eoneo SDK v2.0',
  base: '/',
  head: [
    ['script', { src: '/eoneo-pay.iife.js' }]
  ],
  chainWebpack(config) {
    config
      .plugin('copy')
      .use(CopyPlugin, [
        ['dist/eoneo-pay.iife.js'],
      ]);
  }
}