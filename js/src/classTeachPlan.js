require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
require('es6-promise');

var BluMUI = require('../libs/classTeachPlan/blueMonUI'),
	ajaxExpanding = require('../libs/ajaxExpand.mini.min'),
	host = courseCenter.host,
	searchJXBByCourseNo = host + 'searchJXBByCourseNo',
	hash = parseHash(window.location.href),
	unifyCode = getCookie('userId'),
	classId = hash.classId || '',
	teacherItems = {},
	teacherList = [],
	userName = getCookie('userName');
// 初始化ajax对象
ajaxExpanding.init({
	name:"getInf",
	dataType:'json',
	type:'post',
	async:true
});
ajaxExpanding.send({
	url:searchJXBByCourseNo,
	data:{
		unifyCode:unifyCode,
		courseNo:classId
	},
	onSuccess:function (result) {
		var result = JSON.parse(result),
			 data = result.data,
			 meta = result.meta;
		if(meta.result == 100){
			var i,
				 items = [],
				 len;
			for( i = 0 , len = data.length ;  i < len ; i++) {
				if(!teacherItems[data[i].XM]){
					teacherItems[data[i].XM] = [];
					teacherList.push(data[i].XM);
				}
				teacherItems[data[i].XM].push({
					jxb:data[i].JXB,
					xsbjzh:data[i].xsbjzh,
					sfrzh:data[i].sfnxz,
					url:data[i].url
				});
			}
			for( i = 0 , len = teacherList.length ; i < len ; i ++){
				items.push({
					name:teacherList[i],
					value:teacherList[i],
					callback:getDate
				})
			}
			BluMUI.create({
				id: 'fileList',
				extClass: '',
				items:items,
				index: 0
			}, 'List', document.getElementById('content_left'));
			BluMUI.create({
				id:'teachPlan',
				items:teacherItems[teacherList[0]]
			},'TeachPlan',document.getElementById('content_right'));
		}else if(meta.result == 101){
			window.location.href = 'error1.html';
		}else if(meta.result == 102){
			window.location.href = 'error2.html';
		}
	}
},'getInf');

function getDate(value,name){
	BluMUI.create({
		id:'teachPlan',
		items:teacherItems[name]
	},'TeachPlan',document.getElementById('content_right'));
}

