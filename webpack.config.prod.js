const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  devServer: {
    port: 3000,
    historyApiFallback: true,
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    publicPath: "/",
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
      reactRemote1: 'reactRemote1@https://remote-1-prashu.vercel.app/',
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
