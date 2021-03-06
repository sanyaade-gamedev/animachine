var path = require('path')
var webpack = require('webpack')

module.exports = {
  context: __dirname,
  entry: [
    './src/index.jsx',
  ],
  output: {
    publicPath: '/',
    path: path.join( __dirname, '/dist'),
    filename: 'index.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      'animachine': path.join(__dirname, '../src/index.js'),
      'animachine-connect': path.join(__dirname, '../src/animachine-connect'),
      'react': path.join(__dirname, '../node_modules/react'),
    }
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        include: [
          path.join(__dirname, '../src'),
          __dirname
        ],
        loader: 'babel-loader',
      }, {
        test: /\.(html|css)/,
        include: __dirname,
        loader: 'file?name=[name].[ext]'
      }
    ]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      SKIP_AUTO_INIT_ANIMACHINE: true,
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ]
}
