/*
 * @Description: Description
 * @Author: lily
 * @Date: 2022-02-09 17:26:12
 */
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
  },
};