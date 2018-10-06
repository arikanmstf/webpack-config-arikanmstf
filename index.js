// Webpack Config by: @arikanmstf
// webpack version : 4.15.1

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const packageObject = require('./package.json');

const JS_JSX_PATTERN = /\.js?$/;
const ASSET_PATTERN = /\.(jpe?g|png|gif|svg|ttf|otf|eot|woff(2)?)(\?v=\d+)?$/;
const DEV_SERVER_PORT = 8080;

const PROJECT_NAME = packageObject.name;
const VERSION = (packageObject.version);
const DESCRIPTION = (packageObject.description);
const PACKAGE_NAME = `${PROJECT_NAME} - ${VERSION}`;

const distPath = path.resolve(__dirname, '../../dist');
const appPath = path.resolve(__dirname, '../../src/app');
const sourcePath = path.resolve(__dirname, '../../src');
const nodePath = path.resolve(__dirname, '../../node_modules');
const staticPath = path.resolve(__dirname, '../../static');

const HtmlWebpack = new HtmlWebpackPlugin({
  template: path.resolve(__dirname, '../../src/app/web/index.ejs'),
  inject: 'body',
  hash: true,
  filename: `index.html`,
  description: DESCRIPTION,
});

const definePlugin = new webpack.DefinePlugin({
  IS_MOCK: JSON.stringify(false),
});

const copyPlugin = new CopyWebpackPlugin([{
  from: staticPath,
  to: 'static',
}]);

const plugins = [HtmlWebpack, definePlugin, copyPlugin];
const rules = [
  {
    test: JS_JSX_PATTERN,
    include: [appPath, path.join(__dirname, '../../node_modules/react-native-storage')],
    loader: 'babel-loader',
    query: {
      cacheDirectory: true,
    },
  },
  {
    test: ASSET_PATTERN,
    loader: 'file-loader',
    options: {
      name: `assets/[name]-[hash].[ext]`,
    },
  },
  {
    test: JS_JSX_PATTERN,
    include: [sourcePath],
    enforce: 'pre',
    loader: 'eslint-loader',
    options: {
      failOnWarning: false,
      failOnError: false,
      quiet: false,
    },
  },
];

module.exports = {
  entry: [
    'babel-polyfill',
    path.resolve(__dirname, `${appPath}/web/index.js`),
  ],
  output: {
    path: distPath,
    filename: `${PACKAGE_NAME}.js`,
  },
  module: {
    rules,
  },
  resolve: {
    extensions: ['.js'],
    modules: [
      appPath,
      nodePath,
    ],
  },
  devServer: {
    port: DEV_SERVER_PORT,
    historyApiFallback: true,
    contentBase: './',
  },
  plugins,
};
