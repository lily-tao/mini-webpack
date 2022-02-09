/*
 * @Description: Description
 * @Author: lily
 * @Date: 2022-02-09 17:26:26
 */
const config = require('./webpack.config.js');
const webpack = require('./lib/mini-webpack.js');

new webpack(config).run();