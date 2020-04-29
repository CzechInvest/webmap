const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const paths = require('./paths');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const publicPath = paths.servedPath;


const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';


module.exports = {

  bail: true,
  devtool: shouldUseSourceMap ? 'source-map' : false,

  entry: {
    cimap: [
      require.resolve('./polyfills'),
      paths.appIndexJs,
    ],
  },
  output: {

    path: paths.appBuild,
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    library: 'cimap',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    publicPath,
    devtoolModuleFilenameTemplate: info =>
      path
        .relative(paths.appSrc, info.absoluteResourcePath)
        .replace(/\\/g, '/'),
  },
  resolve: {
    extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx'],
    alias: {
      'react-native': 'react-native-web',
    },
    plugins: [
      new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
    ],
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(js|jsx)$/,
        enforce: 'pre',
        use: [
          {
            options: {
              formatter: eslintFormatter,
              eslintPath: require.resolve('eslint'),

            },
            loader: require.resolve('eslint-loader'),
          },
        ],
        include: paths.appSrc,
      },
      {
        oneOf: [
          {
            test: /icons[\\\/].*\.svg$/,
            use: [
              {
                loader: 'babel-loader'
              },
              {
                loader: 'svg-sprite-loader',
                options: {
                  runtimeGenerator: require.resolve('svg-sprite-loader/examples/custom-runtime-generator/svg-to-icon-component-runtime-generator.js'),
                  runtimeOptions: {
                    iconModule: './src/Icon.js'
                  }
                }
              },
              {
                loader: 'svgo-loader'
              }
            ]
          },
          {
            test: [/\.svg$/, /\.png$/, /\.jpe?g$/, /\.bmp$/, /\.gif$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 15000,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          {
            test: /\.(js|jsx)$/,
            include: paths.appSrc,
            loader: require.resolve('babel-loader'),
            options: {

              compact: true,
            },
          },
          {
            test: [/\.scss$/, /\.css$/],
            use: [
              require.resolve('style-loader'),
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                },
              },
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-flexbugs-fixes'),
                  ],
                },
              },
              {
                loader: require.resolve('sass-loader'),
              },
            ],
          },
          {
            loader: require.resolve('file-loader'),
            exclude: [/\.js$/, /\.html$/, /\.json$/],
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new MiniCssExtractPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
};
