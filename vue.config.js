module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/vue-pincode-input/'
    : '',
  outputDir: 'docs',
  productionSourceMap: false,
};
