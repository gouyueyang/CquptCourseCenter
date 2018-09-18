require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
require('es6-promise');
var BluMUI = require('../libs/classInfReview/blueMonUI'),
	ajaxPading = require('../libs/ajaxExpand.mini.min'),
	classNameDom = document.getElementById('courseName'),
	iframe = window.frames['content'],
	hash = parseHash(window.location.href),
	items = [],
	courseType,
   unifyCode = getCookie('userId'),
	classId = hash.classId || '',
	userName = getCookie('userName'),
	host = courseCenter.host,
	getMenu =  host + 'getMenu',
	getCourseStatus = host +  'getCourseStatus',
	moduleURL = {
		'课程首页':'home.html?classId=' + classId + '&moduleName=' + encodeURIComponent('课程首页'),
		'教学团队':'team_show.html?classId=' + classId,
		'课程简介':'kechengJianjie.html?classId=' + classId,
		'电子教案':'classReviewModule.html?classId=' + classId + '&moduleName=' + encodeURIComponent('电子教案'),
		'考试大纲':'classReviewModule.html?classId=' + classId + '&moduleName=' + encodeURIComponent('考试大纲'),
		'教学大纲':'classReviewModule.html?classId=' + classId + '&moduleName=' + encodeURIComponent('教学大纲'),
		'考核方案':'classReviewModule.html?classId=' + classId + '&moduleName=' + encodeURIComponent('考核方案'),
		'导学方案':'classReviewModule.html?classId=' + classId + '&moduleName=' + encodeURIComponent('导学方案'),
		'授课计划':'classTeachPlan.html?classId=' + classId,
		'实习计划':'classTeachPlan.html?classId=' + classId,
		'知识点体系':'classReviewModule.html?classId=' + classId + '&moduleName=' + encodeURIComponent('知识体系'),
		'学习资源':'ziYuan.html?classId=' + classId + '&moduleName'+ encodeURIComponent('视频')
	};


document.getElementById('myIframe').addEventListener('load',function () {
	var toModuleName = parseHash(iframe.location.href).toModuleName || null;
	console.log(toModuleName);
	if(toModuleName){
		var that = BluMUI.result.contentNav,
			items = that.props.items,
			index,
			i,
			len;
		for( i = 0 , len = items.length ; i < len ; i++){
			if(items[i].name == toModuleName){
				index = i;
				break;
			}
		}
		that.setState({
			index:index
		})
	}
});


// 通过课程ID获取课程名称
ajaxPading.init({
	name:'getClassName',
	type:'post',
	dataType:'json'
});
ajaxPading.init({
	name:'getModule',
	type:'post',
	dataType:'json'
});
if(classId == ''){
	window.location.href = 'error3.html';
}else{
	ajaxPading.send({
		data:{
			courseNo:classId,
			unifyCode:unifyCode
		},
		url:getCourseStatus,
		onSuccess:function (result) {
			var result = JSON.parse(result),
				 data = result.data,
				 meta = result.meta;
			if(meta.result == 100) {
				var status = data.status,
					 type = parseInt(data.kclx);
				if(type === 1 )
					courseType = 5;
				if(type === 2)
					courseType = 6;
				classNameDom.innerHTML = data.courseName;
				initNav();
			}else{
				window.location.href = 'error3.html';
			}
		}
	},'getClassName');
}


function initNav(){
	ajaxPading.send({
		url:getMenu,
		data:{
			unifyCode:unifyCode,
			module:courseType
		},
		onSuccess:function (result) {
			var result = JSON.parse(result),
				data = result.data,
				i,
				len;
			console.log(result);
			for( i = 0 , len = data.length ; i < len ; i++ ){
				items.push({
					name:data[i].cdmc,
					callback:changeMoudule
				})
			}
			BluMUI.create({
				id:'contentNav',
				extClass:'',
				items:items,
				index:0
			},'List',document.getElementById('class_nav'));
			iframe.location.href = moduleURL[data[0].cdmc];
			selfAdaptionFrame('myIframe');
		}
	},'getModule');
}


if(classId == null ){
	window.document.body.innerHTML='该页面不存在!';
}


function changeMoudule (index,value) {
	iframe.location.href = moduleURL[value];
}




function selfAdaptionFrame(id) {
	var iframe = document.getElementById(id);
	var height;
	iframe.onload = function () {
		setTimeout(function () {
			try {
				height = iframe.contentWindow.document.documentElement.offsetHeight;
			} catch (e) {};
			try {
				height = iframe.contentDocument.documentElement.offsetHeight;
			} catch (e) {};
			iframe.height = height;
		}, 100);
	};
	window.onresize = function () {
		try {
			height = iframe.contentWindow.document.documentElement.offsetHeight;
		} catch (e) {};
		try {
			height = iframe.contentDocument.documentElement.offsetHeight;
		} catch (e) {};
		iframe.height = height;
	};
}
