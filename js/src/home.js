require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
require('es6-promise');
var BluMUI = require('../libs/home/blueMonUI.js');
BluMUI.create({
	id:"Carouse",
	extClass:"Carousel_test",
	index:0,// 轮播图的初始索引
	width:1180,// 轮播图显示宽度
	time:1000,// 轮播动画时间
	easing:'ease',
	setIntervalTime:8000,// 自动轮播时间(ms)
	items:[// 轮播内容(这个之后通过ajax接入数据)
		{
			src:"#",//点击后打开新窗口进入地址
			img:"imgs/home/1-font.png" // 轮播图图片路径
		},
		{
			src:"#",
			img:"imgs/home/2-font.png"
		},
		{
			src:"#",
			img:"imgs/home/3-font.png"
		}
	]
},'Carousel',document.getElementById('carousel'));