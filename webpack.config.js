const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash:8].js',
    clean: true,
    publicPath: '/',
  },
  devServer: {
    port: 3000,
    hot: true,
    historyApiFallback: true,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.vue', '.svelte'],
    mainFields: ['svelte', 'browser', 'module', 'main'],
    conditionNames: ['svelte', 'browser', 'import'],
  },
  module: {
    rules: [
      // React JSX
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      // Vue SFCs
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      // Svelte
      {
        test: /\.svelte$/,
        use: {
          loader: 'svelte-loader',
          options: {
            emitCss: false,
          },
        },
      },
      // CSS
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new (require('vue-loader').VueLoaderPlugin)(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      favicon: false,
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'vendor-react',
          chunks: 'all',
        },
        vue: {
          test: /[\\/]node_modules[\\/]vue[\\/]/,
          name: 'vendor-vue',
          chunks: 'all',
        },
        svelte: {
          test: /[\\/]node_modules[\\/]svelte[\\/]/,
          name: 'vendor-svelte',
          chunks: 'all',
        },
      },
    },
  },
};
