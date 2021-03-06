const path = require('path');

const browserConfig = {
    target: 'web',
    entry: './src/index.js',
    output: {
        filename: 'agility-cms-app-sdk.browser.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'agilityAppSDK',
        libraryTarget: 'umd',
        libraryExport: 'default',
        umdNamedDefine: true,
        globalObject: 'typeof self !== \'undefined\' ? self : this'
    },
    module: {
        rules : [
        // JavaScript
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: ['babel-loader'],
        }
        ]
    },
    // Plugins
    plugins: []
}

const nodeConfig = {
  target: 'node',
  entry: './src/index.js',
  output: {
      filename: 'agility-cms-app-sdk.node.js',
      path: path.resolve(__dirname, 'dist'),
      library: 'agilityAppSDK',
      libraryTarget: 'umd',
      umdNamedDefine: true,
      globalObject: 'this'
  },
  optimization: {
      minimize: false
  },
  module: {
      rules : [
      // JavaScript
      {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
      }
      ]
  },
  // Plugins
  plugins: []
}

module.exports = [browserConfig, nodeConfig]