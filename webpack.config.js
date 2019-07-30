var webpack = require('webpack');
var path = require('path');
const htmlPulgin = require('html-webpack-plugin');
var UglifyJsPlugin=require('uglifyjs-webpack-plugin');
module.exports = {
	mode: "development",
	entry: {
    //登陆界面：
    // home:'./js/src/home/home.js',
    //首页列表：
    // classList:'./js/src/classList/classList.js',
    //教学团队
    // teaching_team:'./js/src/teachingTeam/teachingTeam.js',
    //校外专家登陆
    // masterLogin:'./js/src/masterLogin/masterLogin.js',
    //校外专家个人设置
    // mySET:'./js/src/mySet/mySET.js',

    //课程信息展示
    // classInf:'./js/src/classInfShow/classInf.js',
    // classInfReview:'./js/src/classInfShow/classInfReview.js',      //预览
    // homeCourse:'./js/src/classInfShow/homeCourse.js',
    // classInfModule:'./js/src/classInfShow/classInfModule.js',
    // courseShow:'./js/src/classInfShow/courseShow.js',
		// team_show:'./js/src/classInfShow/team_show.js',     //??
    // courseJianjie:'./js/src/classInfShow/courseJianjie.js',
    // classTeachPlan:'./js/src/classInfShow/classTeachPlan.js',
    // classReviewModule:'./js/src/classInfShow/classReviewModule.js',    //审核
    // topicDis: './js/src/classInfShow/topicDis.js', // 话题讨论

    //消息中心
    // showReply:'./js/src/msgCenter/showReply.js',    //查看回复
    // showReport:'./js/src/msgCenter/showReport.js',   //查看举报
    showTopic:'./js/src/msgCenter/showTopic.js',        //回复和查看详情是展示话题信息
    //网评

    // //专家库管理
    // zjkgl: './js/src/wangping/zjkgl.js',
    // masterAddEditor: './js/src/wangping/masterAddEditor.js',
    // //分组管理
    // fzgl: './js/src/wangping/fzgl.js',
    // masterSortEditor: './js/src/wangping/masterSortEditor.js',
    // //评价指标管理
    // pjzbgl: './js/src/wangping/pjzbgl.js',
    // masterAddZbEditor: './js/src/wangping/masterAddZbEditor.js',
    // //专家分组管理
    // zjfzgl: './js/src/wangping/zjfzgl.js',
    // masterSortTeam: './js/src/wangping/masterSortTeam.js',
    // masterSortMasterEditor: './js/src/wangping/masterSortMasterEditor.js',
    // //网评管理
    // wpgl: './js/src/wangping/wpgl.js',
    // masterPublishWp: './js/src/wangping/masterPublishWp.js',
    // wpgl_fenpei: './js/src/wangping/wpgl_fenpei.js',
    // wpgl_jieguo: './js/src/wangping/wpgl-jieguo.js',
    // //课程分组管理
    // kcfzgl: './js/src/wangping/kcfzgl.js',
    // masterCourseSort: './js/src/wangping/masterCourseSort.js',

    // masterReview: './js/src/wangping/masterReview.js',
    // masterHistory: './js/src/wangping/masterHistory.js',
    // masterResult: './js/src/wangping/masterResult.js',

    //统计
    // tongJi:'./js/src/tongJi/tongJi.js',
    // tongJi_kczystj:'./js/src/tongJi/tongJi_kczystj.js',
    // tongJi_kczttj:'./js/src/tongJi/tongJi_kczttj.js',
    // tongJi_wpjgcx:'./js/src/tongJi/tongJi_wpjgcx.js',
    // tongJi_wpztcx:'./js/src/tongJi/tongJi_wpztcx.js',
    // tongJi_chart:'./js/src/tongJi/tongJi_chart.js',
    // tongJi_kcclwhfx:'./js/src/tongJi/tongJi_kcclwhfx.js',
    // tongJi_jskctj:'./js/src/tongJi/tongJi_jskctj.js',  ld

    //课程管理
    // courseManagement:'./js/src/courseManage/courseManagement.js',
    // classManageEditor:'./js/src/courseManage/classManageEditor.js',
    // classManageCheck:'./js/src/courseManage/classManageCheck.js',
    // classManageSpotCheck:'./js/src/courseManage/classManageSpotCheck.js',
  },
  	output: {
    // path:'./js/pages/home',
    // path:'/js/pages/classList',
    // path: path.resolve(__dirname, 'js/pages/classList'), // 必须使用绝对路径
    // path:'./js/pages/teachingTeam',
    // path:'./js/pages/masterLogin',
    // path:'./js/pages/mySet',
    // path:path.resolve(__dirname, 'js/pages/classInfShow'),      //课程信息展示
    path:path.resolve(__dirname,'js/pages/msgCenter'),     
		// path: './js/pages/wangping/',
    // path:'./js/pages/statistics/',      //统计 ld
    // path:'./js/pages/courseManage',        //课程管理

    filename: "[name].bundle.js",
    publicPath: 'http://localhost:8080/pages'
  },

	plugins: [
    // new webpack.optimize.UglifyJsPlugin({
		new UglifyJsPlugin({
			uglifyOptions: {
				compress: {//去除console
					warnings: false,
					drop_debugger: true,
					drop_console: false
				},
				output: {//解决文件过大的问题
					comments: false
				}
			}
    }),
    // new htmlPlugin({
    //   hash:true,
    //   cache:true,
    //   template:'./pages/classList.html'
    // })
  ],
	// optimization: {
	// 	minimizer: [
	// 		new UglifyJsPlugin({
	// 			test: /\.js(\?.*)?$/i,
	// 			uglifyOptions: {
	// 				compress: {//去除console
	// 					warnings: false,
	// 					drop_debugger: true,
	// 					drop_console: false
	// 				},
	// 				output: {//解决文件过大的问题
	// 					comments: false
	// 				}
	// 			}
	// 		})
	// 	]
	// },
  // 	module: {
		// loaders: [
  //     {
  //       test: /\.js$/,
  //       exclude: /node_modules/,
  //       loaders: ['babel-loader'],
  //
  //       // query:{
  //       //   presets:['es2015','react'],
  //       //   plugins: [
  //       //    ["import", {libraryName: "antd", style: "css"}] //按需加载
  //       //   ]
  //       // },
  //     },
  //     {
  //       test: /\.less$/,
  //       use: [
  //         require.resolve('style-loader'),
  //         {
  //           loader: require.resolve('css-loader')
  //         },
  //         {
  //           loader: require.resolve('less-loader'), // compiles Less to CSS
  //         },
  //       ],
  //     },
  //   ],
  //   	postLoaders: [
  //     {
  //       test: /\.js$/,
  //       loaders: ['es3ify-loader'],
  //     },
  //   ],
  // }
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loaders: ['babel-loader']
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
				      ]
			}
		],
	}
};
