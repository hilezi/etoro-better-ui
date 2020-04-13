const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const globby = require('globby')
const webpackNodeExternals = require('webpack-node-externals')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const { BannerPlugin } = require('webpack')

const configration = {
  externals: [],
  stats: {
    warnings: false,
  },
  /** TODO: cheap-module-eval-source-map is no suit for production */
  devtool: 'cheap-module-eval-source-map',
  mode: 'development',
  entry: {
    etoro: path.resolve(__dirname, 'src/etoro'),
  },
  output: {
    filename: '[name].bundle.js',
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, 'src_dist'),
  },
  resolve: {
    mainFields: ['main'],
    extensions: ['.js', '.tsx', '.ts'],
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        exclude: [/node_modules/],
        loader: 'eslint-loader',
        test: /\.tsx?$/,
      },
      {
        exclude: /node_modules/,
        test: /\.tsx?/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, 'tsconfig.json'),
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new Dotenv({
      defaults: false,
      systemvars: true,
    }),
    new ForkTsCheckerWebpackPlugin({
      async: true,
      checkSyntacticErrors: true,
      eslint: true,
      formatter: 'codeframe',
      ignoreLintWarnings: true,
      memoryLimit: 4096,
      reportFiles: ['src/**/*.{ts,tsx}'],
      silent: false,
    }),
    new BannerPlugin({
      test: /etoro/,
      raw: false,
      banner: `
        // ==UserScript==
        // @name          Better etoro UI for Taiwan
        // @description   提供你更好的 etoro 新台幣介面增強懶人包
        // @version       0.3
        // @author        hilezir
        // @grant         GM_xmlhttpRequest
        // @grant         GM_addStyle
        // @match         https://*.etoro.com/*
        // @match         https://etoro.com/*
        // @run-at        document-idle
        // @noframes
        // @namespace     http://tampermonkey.net/
        // @connect       cdn.jsdelivr.net
        // @connect       bot.com.tw
        // ==/UserScript==

        window.GM_xmlhttpRequest({
          // url: 'https://127.0.0.1:3210/etoro.bundle.js', // 開發模式
          url: 'https://cdn.jsdelivr.net/gh/hilezir/etoro-better-ui@v0.3.0/src_dist/etoro.bundle.js',
          onload: event => {
            eval(event.responseText)
          },
        })
      `,
    }),
  ],
}

module.exports = configration
