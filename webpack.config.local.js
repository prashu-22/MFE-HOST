const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devServer: {
    port: 3000,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  output: {
    publicPath: 'auto',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
plugins: [
  new ModuleFederationPlugin({
    name: 'hostApp', // Unique name of the host
    remotes: {
      reactRemote1: 'reactRemote1@http://localhost:3001/remoteEntry.js',
      reactRemote2: 'reactRemote2@http://localhost:3002/remoteEntry.js',
      // nextRemote: 'nextRemote@http://localhost:3003/_next/static/chunks/remoteEntry.js',
    },
    shared: {
      react: { singleton: true, eager: true },
      'react-dom': { singleton: true, eager: true },
    },
  }),
  new HtmlWebpackPlugin({
    template: './public/index.html',
  }),
],

};
