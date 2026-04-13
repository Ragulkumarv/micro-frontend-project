const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');

module.exports = {
  entry: './src/bootstrap.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'shell.[contenthash].js',
    clean: true,
  },
  devServer: {
    port: 3000,
    hot: true,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      remotes: {
        mfeReact: 'mfeReact@http://localhost:3001/remoteEntry.js',
        mfeVue: 'mfeVue@http://localhost:3002/remoteEntry.js',
        mfeSvelte: 'mfeSvelte@http://localhost:3003/remoteEntry.js',
        mfeAngular: 'mfeAngular@http://localhost:3004/remoteEntry.js',
      },
      shared: {},
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
};
