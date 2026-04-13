const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'mfe-angular.[contenthash].js',
    publicPath: 'http://localhost:3004/',
    clean: true,
  },
  devServer: {
    port: 3004,
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  resolve: {
    extensions: ['.js'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'mfeAngular',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/index.js',
      },
      shared: {},
    }),
    new HtmlWebpackPlugin({
      template: './src/standalone.html',
    }),
  ],
};
