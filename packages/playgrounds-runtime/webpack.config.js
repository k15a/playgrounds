/* eslint-env node */

const path = require('path')

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve('build'),
    filename: 'runtime.js',
  },
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve('src'),
        use: 'babel-loader',
      },
    ],
  },
}

module.exports = config
