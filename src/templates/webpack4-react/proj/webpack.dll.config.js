var path = require("path"),fs = require('fs'),webpack = require("webpack");

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin; //视图分析webpack情况
  
var vendors = [
　　'react',
    'react-dom',
    // 'immutable',
    // 'draft-js',
    'react-router',
    'react-redux',
    "moment",
    "redux",
    "whatwg-fetch",
    // path.resolve(__dirname, 'src/lib/addressData'),
    // path.resolve(__dirname, 'src/lib/echarts'),
    // "echarts",
    "core-js"
];

module.exports = {
　　entry: {
　　　　vendor: vendors
　　},
　　output: {
　　　　path: path.resolve(__dirname,'./../superboss-dingding-meeting-release/dll/pc'),
　　　　filename: '[name].dll.js',
　　　　library: "[name]_[hash]"
　　},
　　plugins: [
    new BundleAnalyzerPlugin({   //另外一种方式
        analyzerMode: 'server',
        analyzerHost: '127.0.0.1',
        analyzerPort: 8889,
        reportFilename: 'report.html',
        defaultSizes: 'parsed',
        openAnalyzer: true,
        generateStatsFile: false,
        statsFilename: 'stats.json',
        statsOptions: null,
        logLevel: 'info',
      }),
　　　　new webpack.DllPlugin({
　　　　　　path: path.resolve(__dirname, './../superboss-dingding-meeting-release/dll/pc', "manifest.json"),
　　　　　　name: "[name]_[hash]",
　　　　　　context: __dirname
　　　　})
　　]
};
