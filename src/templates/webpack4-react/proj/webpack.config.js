const path = require('path');
const theme = require(path.join(__dirname, '/package.json')).theme;

const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //html
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //css压缩
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); //多线程压缩
const ExtendedDefinePlugin = require('extended-define-webpack-plugin'); //全局变量
const tsImportPluginFactory = require('ts-import-plugin');

const CleanWebpackPlugin = require('clean-webpack-plugin'); //清空
const CopyWebpackPlugin = require('copy-webpack-plugin'); //复制静态html
const webpack = require('webpack');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin; //视图分析webpack情况

const HappyPack = require('happypack'); //多线程运行


const devtool = {
  dev: 'cheap-eval-source-map',
  development: 'cheap-eval-source-map',
  production: 'source-map',
};
const publicPath = {
  dev: './',
  development: '/',
  production: './',
};

const minimize = {
  dev: false,
  development: false,
  production: true,
};
const stylus = {
  dev: ['style-loader', 'css-loader', 'stylus-loader'],
  development: ['style-loader', 'css-loader', 'stylus-loader'],
  production: [
    { loader: MiniCssExtractPlugin.loader },

    {
      loader: 'css-loader',
      options: {
        minimize: true, //压缩
        sourceMap: true,
      },
    },
    { loader: 'stylus-loader' },
  ],
};

/**
 * 公共插件
 */
const pluginsPublic = [

  new MiniCssExtractPlugin({
    //css添加hash
    // filename: '[id][hash].css',
    chunkFilename: "[name][hash].css",
    filename: "[name].css"
    // chunkFilename: '[id][hash].css',
    // chunkFilename: 'index.css',
  }),
  new HappyPack({
    //多线程运行 默认是电脑核数-1
    id: 'babel', //对于loaders id
    loaders: ['babel-loader'], //是用babel-loader解析
    threadPool: HappyPack.ThreadPool({ size: 4 }),
    verboseWhenProfiling: true, //显示信息
  }),
  new webpack.ContextReplacementPlugin(
    /moment[\\\/]locale$/,
    /^\.\/(en|ko|ja|zh-cn)$/
  )
];
/**
 * 公共打包插件
 */
const pluginsBuild = [
  new HtmlWebpackPlugin({
    template: `${__dirname}/html/index.html`, //源html
    inject: 'body', //注入到哪里
    filename: 'index.html', //输出后的名称
    hash: true, //为静态资源生成hash值
    showErrors: true,
    chunksSortMode: 'none',
    minify: {
      caseSensitive: false, //是否大小写敏感
      collapseBooleanAttributes: true, //是否简写boolean格式的属性如：disabled="disabled" 简写为disabled
      collapseWhitespace: true //是否去除空格
    },
  }),
  new ExtendedDefinePlugin({
    //全局变量
    __LOCAL__: false,
  }),
  new CleanWebpackPlugin(['pc'], {
    root: path.resolve(__dirname, '../superboss-dingding-meeting-release'),
  }),
  new CopyWebpackPlugin([
    { from: 'html', to: path.resolve(__dirname, '../superboss-dingding-meeting-release/pc') },
  ]),
  new webpack.HashedModuleIdsPlugin(),
  // new webpack.DllReferencePlugin({
  //   context: __dirname,
  //   manifest: require('../superboss-dingding-meeting-release/dll/pc/manifest.json')
  // }),
];

const plugins = {
  dev: [].concat(pluginsPublic, pluginsBuild),
  development: [].concat(
    // new BundleAnalyzerPlugin({   //另外一种方式
    //   analyzerMode: 'server',
    //   analyzerHost: '127.0.0.1',
    //   analyzerPort: 8889,
    //   reportFilename: 'report.html',
    //   defaultSizes: 'parsed',
    //   openAnalyzer: true,
    //   generateStatsFile: false,
    //   statsFilename: 'stats.json',
    //   statsOptions: null,
    //   logLevel: 'info',
    // }),
    new HtmlWebpackPlugin({
      template: `${__dirname}/html/start.html`, //源html
      inject: 'body', //注入到哪里
      filename: 'index.html', //输出后的名称
      hash: true, //为静态资源生成hash值
      showErrors: true,
      chunksSortMode: 'none'
    }),
    pluginsPublic,
    new ExtendedDefinePlugin({
      //全局变量
      __LOCAL__: true,
    }),

  ),

  production: [].concat(
    pluginsPublic,
    pluginsBuild,

    new UglifyJsPlugin({
      sourceMap: false,
      parallel: true,
      cache: true,
      uglifyOptions: {
        output: {
          comments: false,
          beautify: false,
        },
        compress: {
          drop_console: true,
          warnings: false,
          drop_debugger: true,
        },
      },
      exclude: /(node_modules|bower_components)/,
    }) //压缩，生成map
  ),
};



module.exports = (env, argv) => {
  const dev = env.dev;
  return {
    devServer: {
      // contentBase: path.join(__dirname, 'dist'), //开发服务运行时的文件根目录
      compress: true, //开发服务器是否启动gzip等压缩
      port: 8000, //端口
      historyApiFallback: true, //不会出现404页面，避免找不到
    },
    // devtool: devtool[dev], //cheap-eval-source-map  是一种比较快捷的map,没有映射列
    // devtool: minimize[dev] ? 'cheap-eval-source-map' : 'source-map',  //cheap-eval-source-map  是一种比较快捷的map,没有映射列 不压缩
    // devtool: 'source-map',  //cheap-eval-source-map  是一种比较快捷的map,没有映射列
    performance: {
      maxEntrypointSize: 250000, //入口文件大小，性能指示
      maxAssetSize: 250000, //生成的最大文件
      hints: 'warning', //依赖过大是否错误提示
      // assetFilter: function(assetFilename) {
      //   return assetFilename.endsWith('.js');
      // }
    },
    entry: {
      //入口
      index: './src/index.js',
    },
    output: {
      //出口
      path: path.resolve(__dirname, '../superboss-dingding-meeting-release/pc'), //出口路径
      // filename: 'index.js',     //出口文件名称
      // chunkFilename: '[id][chunkhash].js', //按需加载名称
      // chunkFilename: '[chunkhash].js',  //按需加载名称
      chunkFilename: "[name][hash].js",
      filename: "[name].js",
      // filename: 'bundle.js',
      // filename: '[name].[chunkhash].js',
      publicPath: publicPath[dev], //公共路径
    },
    resolve: {
      extensions: ['.js','.tsx', '.ts',  '.json'],
      mainFields: ['main', 'jsnext:main', 'browser'], //npm读取先后方式  jsnext:main 是采用es6模块写法
      alias: {
        //快捷入口
        api: path.resolve(__dirname, 'src/api'),
        actions: path.resolve(__dirname, 'src/actions'),
        components: path.resolve(__dirname, 'src/components/'),
        pages: path.resolve(__dirname, 'src/pages/'),
        stores: path.resolve(__dirname, 'src/stores/'),
        styles: path.resolve(__dirname, 'src/styles/'),
        lib: path.resolve(__dirname, 'src/lib/'),
        util: path.resolve(__dirname, 'src/lib/util/'),
        clickPoints: path.resolve(__dirname, 'src/lib/clickPoints'),
        server: path.resolve(__dirname, 'src/lib/server'),
        dingApi: path.resolve(__dirname, 'src/lib/dingApi.js'),
        images: path.resolve(__dirname, 'src/images'),
        react: path.resolve(__dirname, 'node_modules/react/'),
        'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
        'react-redux': path.resolve(
          __dirname,
          'node_modules/react-redux/lib/index.js'
        ),
        img: path.resolve(__dirname, 'src/images'),
        "@":  path.resolve(__dirname, 'src'),
      },
    },
    module: {
      noParse: /node_modules\/(moment|chart\.js)/, //不解析
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/, //排除
          include: [path.resolve(__dirname, 'src')], //包括
          // use: ['babel-loader?cacheDirectory'],
          loader: 'happypack/loader?id=babel',
        },
        {   //ts 文件直接生成js文件
          test: /\.(ts||tsx)?$/,
          use:[
            {
              loader: 'happypack/loader?id=babel',
            },
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                compilerOptions: {
                  module: 'es2015'
                },
                getCustomTransformers: () => ({
                  before: [tsImportPluginFactory({
                    libraryName: 'antd',
                    libraryDirectory: 'es',
                    style: true,
                  })]
                }),
              },
            }
          ]
        },
        {
          test: /\.css$/,
          // exclude: /(node_modules|bower_components)/,
          // include: [path.resolve(__dirname, 'src')],
          use: [
            { loader: MiniCssExtractPlugin.loader },


            {
              loader: 'css-loader',
              options: {
                minimize: minimize[dev], //压缩
                sourceMap: minimize[dev],
              },
            },
          ],
        },
        {
          test: /\.(html)$/,
          use: {

            loader: 'html-loader',
            options: {
              attrs: [':data-src'], //为了做图片懒加载，那些属性需要被，制定什么属性被该loader解析
              minimize:false,
            },
          },
        },
        {
          test: /\.(png|jpg|gif|jpeg|ttf)$/,
          exclude: /(node_modules|bower_components)/,
          include: [path.resolve(__dirname, 'src/images')],
          use: [
            {
              loader: 'url-loader?limit=8024', //limit 图片大小的衡量，进行base64处理
              options: {
                name: '[path][name].[ext]',
              },
            },
          ],
        },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'happypack/loader?id=babel',
            },
            {
              loader: '@svgr/webpack',
              options: {
                babel: false,
                icon: true,
              },
            },
          ],
        },
        {
          test: /\.styl/,
          exclude: /(node_modules|bower_components)/,
          include: [path.resolve(__dirname, 'src')],
          use: stylus[dev],
        },
        {
          test: /\.less/,
          use: [
            { loader: MiniCssExtractPlugin.loader },

            {
              loader: 'css-loader',
              options: {
                minimize: minimize[dev], //压缩
                sourceMap: minimize[dev],
              },
            },
            { 
              loader: 'less-loader', 
              options: { 
                // modifyVars: theme 
              } 
            },
          ],
        },
      ],
    },
    plugins: plugins[dev],
  };
};
