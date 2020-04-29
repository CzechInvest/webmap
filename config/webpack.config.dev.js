const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const paths = require('./paths');

const publicPath = '/';


module.exports = {
  devtool: 'cheap-module-source-map',
  entry: [
    require.resolve('./polyfills'),
    require.resolve('react-dev-utils/webpackHotDevClient'),
    paths.appIndexJs,
  ],
  output: {
    path: paths.appBuild,
    pathinfo: true,
    filename: 'static/js/bundle.js',
    chunkFilename: 'static/js/[name].chunk.js',
    publicPath,  
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
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
                loader: 'svgo-loader',
                options: {
                  plugins: [
                    // {removeAttrs: {attrs: '(stroke-width)'}},
                  ]
                }
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
              cacheDirectory: true,
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
            exclude: [/\.js$/, /\.html$/, /\.json$/],
            loader: require.resolve('file-loader'),
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          }
        ],
      },

    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
    }),
    new MiniCssExtractPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  performance: {
    hints: false,
  },
};
