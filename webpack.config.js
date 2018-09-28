var webpack = require('webpack');
module.exports = {
  entry: {
    tongJi_wpjgcx: './js/src/tongJi/tongJi_wpjgcx.js',
    tongJi_wpztcx:'./js/src/tongJi/tongJi_wpztcx.js'
  },
  output: {
    path: './js/pages/statistics/',
    filename: "[name].bundle.js",
    publicPath: 'http://localhost:8080/pages'
  },

  plugins: [
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {//去除console
    // 	  warnings: false,
    // 	  drop_debugger: true,
    // 	  drop_console:false
    //   },
    //   output:{//解决文件过大的问题
    // 	  comments:false
    //   }
    // }),
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel-loader'],

        // query:{
        //   presets:['es2015','react'],
        //   plugins: [
        //    ["import", {libraryName: "antd", style: "css"}] //按需加载
        //   ]
        // },
      },
      {
        test: /\.less$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader')
          },
          {
            loader: require.resolve('less-loader'), // compiles Less to CSS 
          },
        ],
      },
    ],
    postLoaders: [
      {
        test: /\.js$/,
        loaders: ['es3ify-loader'],
      },
    ],
  },
};
