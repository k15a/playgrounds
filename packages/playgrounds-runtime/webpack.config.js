/* eslint-env node */

const path = require('path')

const config = ({ production } = {}) => ({
  mode: production ? 'production' : 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve('build'),
    filename: 'runtime.js',
  },
  devtool: production ? 'source-map' : 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve('src'),
        use: 'babel-loader',
      },
    ],
  },
})

module.exports = config
