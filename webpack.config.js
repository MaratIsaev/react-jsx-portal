const path = require('path')
const CopyPlugin = require("copy-webpack-plugin")

module.exports = {
  output: {
    clean: true,
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: {
      type: 'umd',
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: './src/index.d.ts', to: '.' },
      ],
    }),
  ],
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
    },
    uuid: {
      root: 'uuid',
      commonjs2: 'uuid',
      commonjs: 'uuid',
      amd: 'uuid',
    },
  },
  optimization: {
    usedExports: false,
  },
}
