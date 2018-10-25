var webpack = require('webpack');
module.exports = {
  entry: {
    //首页列表：
    // classList:'./js/src/classList/classList.js',
    //教学团队
    // teaching_team:'./js/src/teachingTeam/teachingTeam.js',

    //个人设置
    // mySET:'./js/src/mySet/mySET.js',

    //网评
    // masterSortEditor: './js/src/wangping/masterSortEditor.js',
    // zjkgl:'./js/src/wangping/zjkgl.js',
    
    masterAddEditor:'./js/src/wangping/masterAddEditor.js',
    //  pjzbgl:'./js/src/wangping/pjzbgl.js',
    //  masterAddZbEditor: './js/src/wangping/masterAddZbEditor.js',
     zjfzgl:'./js/src/wangping/zjfzgl.js',
     masterSortTeam:'./js/src/wangping/masterSortTeam.js',

    // pjzbgl: './js/src/wangping/pjzbgl.js',
    // masterAddZbEditor: './js/src/wangping/masterAddZbEditor.js',
    // zjfzgl: './js/src/wangping/zjfzgl.js',
    // masterSortMasterEditor:'./js/src/wangping/masterSortMasterEditor.js',
    // masterSortTeam: './js/src/wangping/masterSortTeam.js',
    // wpgl: './js/src/wangping/wpgl.js',
    // masterPublishWp: './js/src/wangping/masterPublishWp.js',
    // wpgl_fenpei:'./js/src/wangping/wpgl_fenpei.js'
    // kcfzgl: './js/src/wangping/kcfzgl.js',
    // materCourseSort: './js/src/wangping/materCourseSort.js',

    masterReview:'./js/src/wangping/masterReview.js',
    // masterHistory:'./js/src/wangping/masterHistory.js',
    // masterResult:'./js/src/wangping/masterResult.js',

    //统计
    // tongJi_kczystj:'./js/src/tongJi/tongJi_kczystj.js',
    // tongJi_kczttj:'./js/src/tongJi/tongJi_kczttj.js',
    // tongJi_chart:'./js/src/tongJi/tongJi_chart.js',
    // tongJi_kcclwhfx:'./js/src/tongJi/tongJi_kcclwhfx.js',
    // tongJi_jskctj:'./js/src/tongJi/tongJi_jskctj.js',
  },
  output: {
    // path:'./js/pages/classList',
    // path:'./js/pages/teachingTeam',
    // path:'./js/pages/mySet',
    path: './js/pages/wangping/',
    // path:'./js/pages/statistics/',
    filename: "[name].bundle.js",
    publicPath: 'http://localhost:8080/pages'
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {//去除console
    	  warnings: false,
    	  drop_debugger: true,
    	  drop_console:false
      },
      output:{//解决文件过大的问题
    	  comments:false
      }
    }),
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
