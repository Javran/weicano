const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'weicano.user.js',
    path: path.resolve(__dirname, 'dist'),
  },
}
