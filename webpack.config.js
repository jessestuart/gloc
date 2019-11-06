const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')

const JSconfig = {
  mode: 'production',
  name: 'JS',
  entry: {
    background: './src/background.ts',
    inject: './src/inject.tsx',
    options: './src/options.ts',
    popup: './src/popup.ts',
  },
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist/src/'),
    filename: '[name].js',
  },
  resolveLoader: {
    modules: ['node_modules'],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        use: 'babel-loader',
        test: /\.js$/,
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      uglifyOptions: {
        compress: false,
        ecma: 6,
        mangle: true,
      },
      sourceMap: true,
    }),
  ],
}

const HTMLconfig = {
  name: 'HTML',
  mode: 'production',
  entry: {
    index: './index.html',
    options: './options.html',
  },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: '[name].html',
  },
  resolveLoader: {
    modules: ['node_modules'],
  },
  module: {
    rules: [
      {
        use: [
          {
            loader: 'html-loader',
          },
        ],
        test: /\.html$/,
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              emitFile: false,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: './index.html',
      inject: 'body',
      hash: true,
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        html5: true,
        removeComments: true,
        removeEmptyAttributes: true,
        minifyCSS: true,
      },
    }),
    new HtmlWebpackPlugin({
      template: './options.html',
      filename: './options.html',
      inject: 'body',
      hash: true,
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        html5: true,
        removeComments: true,
        removeEmptyAttributes: true,
        minifyCSS: true,
      },
    }),
    new CopyWebpackPlugin([
      {
        from: 'img',
        to: 'img',
      },
      {
        from: 'manifest.json',
        to: 'manifest.json',
      },
      {
        from: '_locales',
        to: '_locales',
      },
    ]),
  ],
}

module.exports = [JSconfig, HTMLconfig]
