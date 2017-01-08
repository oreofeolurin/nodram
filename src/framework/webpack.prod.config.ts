import * as  path from 'path';

const webpack = require('webpack');
const clone = require('js.clone');
const webpackMerge = require('webpack-merge');
const V8LazyParseWebpackPlugin = require('v8-lazy-parse-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');
import webpackConfig, { root,  includeClientPackages } from './webpack.config';


const emptyJS = 'browser/app/helpers/empty.js';

export let commonPlugins = [
  new V8LazyParseWebpackPlugin(),

  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),

  // Loader options
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false
  }),

  new webpack.NormalModuleReplacementPlugin(
    /facade(\\|\/)async/,
    root('node_modules/@angular/core/src/facade/async.js')
  ),
  new webpack.NormalModuleReplacementPlugin(
    /facade(\\|\/)collection/,
    root('node_modules/@angular/core/src/facade/collection.js')
  ),
  new webpack.NormalModuleReplacementPlugin(
    /facade(\\|\/)errors/,
    root('node_modules/@angular/core/src/facade/errors.js')
  ),
  new webpack.NormalModuleReplacementPlugin(
    /facade(\\|\/)lang/,
    root('node_modules/@angular/core/src/facade/lang.js')
  ),
  new webpack.NormalModuleReplacementPlugin(
    /facade(\\|\/)math/,
    root('node_modules/@angular/core/src/facade/math.js')
  ),

];
export var commonConfig = {
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[chunkhash].js'
  },
};

// Client.
export let clientPlugins = [
  new BundleAnalyzerPlugin({
    analyzerMode: 'disabled', // change it to `server` to view bundle stats 
    reportFilename: 'report.html',
  //  generateStatsFile: true,
  //  statsFilename: 'stats.json',
  }),

  new CompressionPlugin({
    asset: "[path].gz[query]",
    algorithm: "gzip",
    test: /\.js$|\.css$|\.html$/,
    threshold: 10240,
    minRatio: 0.8
  }),

  new webpack.optimize.UglifyJsPlugin({
    // beautify: true,
    // mangle: false,
    output: {
      comments: false
    },
    compress: {
      warnings: false,
      conditionals: true,
      unused: true,
      comparisons: true,
      sequences: true,
      dead_code: true,
      evaluate: true,
      if_return: true,
      join_vars: true,
      negate_iife: false // we need this for lazy v8
    }
  }),

  new webpack.NormalModuleReplacementPlugin(
    /@angular(\\|\/)upgrade/,
    root(emptyJS)
  ),
  // problem with platformUniversalDynamic on the server/client
  new webpack.NormalModuleReplacementPlugin(
    /@angular(\\|\/)compiler/,
    root(emptyJS)
  ),
  new webpack.NormalModuleReplacementPlugin(
    /@angular(\\|\/)platform-browser-dynamic/,
    root(emptyJS)
  ),
  new webpack.NormalModuleReplacementPlugin(
    /dom(\\|\/)debug(\\|\/)ng_probe/,
    root(emptyJS)
  ),
  new webpack.NormalModuleReplacementPlugin(
    /dom(\\|\/)debug(\\|\/)by/,
    root(emptyJS)
  ),
  new webpack.NormalModuleReplacementPlugin(
    /src(\\|\/)debug(\\|\/)debug_node/,
    root(emptyJS)
  ),
  new webpack.NormalModuleReplacementPlugin(
    /src(\\|\/)debug(\\|\/)debug_renderer/,
    root(emptyJS)
  ),

  // Waiting for https://github.com/ampedandwired/html-webpack-plugin/issues/446
  // new webpack.optimize.AggressiveSplittingPlugin({
  //   minSize: 30000,
  //   maxSize: 250000
  // }),

];
export let clientConfig = {
  entry: './browser/app/browser.bootstrap.aot',
  output: {
    path: root("static/scripts"),
    filename : "main.bundle.js"
  },
  recordsOutputPath: root('webpack.records.json')
};

// Server.
export let serverPlugins = [

];
export let serverConfig = {
  entry: './server/main',
  output: {
    path : root("bin"),
    filename: 'server.js'
  },
};

export default [
  // Client
  webpackMerge(webpackConfig[0], clone(commonConfig), clientConfig, {plugins: webpackConfig[0].plugins.concat(commonPlugins, clientPlugins) }),

  // Server
  webpackMerge(webpackConfig[1], clone(commonConfig), serverConfig, {plugins: webpackConfig[1].plugins.concat(commonPlugins, serverPlugins) })
];
