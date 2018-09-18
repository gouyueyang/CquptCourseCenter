require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
require('es6-promise');
var BluMUI = require('../libs/blueMonUI.js'),
	ajaxPading = require('../libs/ajaxExpand.mini.min'),
	unifyCode = getCookie('userId'),
	host = courseCenter.host,
	getCourseStatus = host + 'getCourseStatus',
	submitOperation = host + 'submitOperation',
	getMenu = host + 'getMenu',
	courseResCount = host + 'courseResCount',
	courseType,
	hash = parseHash(window.location.href),
	courseNo  = hash.classId,
	type = hash.type || 12	,
	classId = courseNo,
	iframe = window.frames['content'],
	courseName = document.getElementById('courseName'),
	view = document.getElementById('view'),
	review = document.getElementById('review'),
	passBtn = document.getElementById('pass'),
	backBtn = document.getElementById('back'),
	rejectBtn = document.getElementById('reject'),
	moduleURL = {
		'课程简介':'../classInfShow/kechengJianjie.html?classId=' + classId,
		'教学团队': '../classInfShow/teamShow.html?classId=' + classId,
		'电子教案': '../classInfShow/classCheckModule.html?classId=' + classId + '&moduleName=电子教案',
		'考试大纲': '../classInfShow/classCheckModule.html?classId=' + classId + '&moduleName=考试大纲',
		'教学大纲': '../classInfShow/classCheckModule.html?classId=' + classId + '&moduleName=教学大纲',
		'导学方案': '../classInfShow/classCheckModule.html?classId=' + classId + '&moduleName=导学方案',
		'授课计划':'../classInfShow/classCheckModule.html?classId=' + classId,
		'知识点体系': '../classInfShow/classCheckModule.html?classId=' + classId + '&moduleName=知识体系',
		'学习资源': '../classInfShow/ziYuan.html?classId=' + classId + '&moduleName=视频'
	};
ajaxPading.init({
	type:'post',
	dataType:'json',
	name:'getMouduleInf',
	async:true
});
ajaxPading.init({
	name:'getClassName',
	type:'post',
	async:true,
	dataType:'json'
});
ajaxPading.init({
	name:'getFileInfs',
	type:'post',
	async:true,
	dataType:'json'
});

// 获取课程名称以及状态
ajaxPading.send({
	data:{
		courseNo:courseNo,
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
				courseType = 7;
			if(type === 2)
				courseType = 8;
			if( status ==  '编辑中' || status ==  '系部中心主任待审' || status ==  '教学院长待审'){
				courseName.innerHTML = data.courseName;
				initInf();
			}
			else{
				window.location.href = 'courseManagement.html?subModule=audit';
			}
		}else{
			window.location.href = 'error.html';
		}
	}
},'getClassName');

// 初始化审核、驳回的信息,初始化导航信息

function initInf(){
	ajaxPading.send({
		data:{
			unifyCode:unifyCode,
			module:courseType
		},
		url:getMenu,
		onSuccess:function(result){
			var result = JSON.parse(result),
				meta = result.meta;
			if(meta.result == 100 ){
				var data = result.data,
					i,
					len,
					items = [];
				for( i = 0 , len = data.length ; i < len ; i++){
					items.push(data[i].cdmc);
				}
				// console.log(data);
				selfAdaptionFrame('myIframe');
				BluMUI.create({
					id:'classNavList',
					items:items,
					extClass:'',
					callback:changeNav,
					index:0
				},'NavList',document.getElementById('class_nav'));
				iframe.location.href = moduleURL[items[0]];
			}else{
				console.log('服务器发生错误!');
			}
		}
	},'getMouduleInf');
	ajaxPading.send({
		url:courseResCount,
		data:{
			unifyCode:unifyCode,
			courseNo:courseNo,
			type:courseType
		},
		onSuccess:function(result){
			var result = JSON.parse(result),
				meta = result.meta,
				data = result.data,
				res = data.res;
			if(meta.result == 100 ){
				BluMUI.create({
					items:res
				},'FileNum',document.getElementById('totalInf'));
			}
		}
	},'getFileInfs')
}

// 点击导航
function  changeNav(value) {
	iframe.location.href = moduleURL[value];
}


// 提交

function sumbitCheck(result){
	var note = review.value;
		ajaxPading.send({
		data:{
			note:note,
			result:result,
			type:type,
			unifyCode:unifyCode,
			courseNo:courseNo
		},
		url:submitOperation,
		onSuccess:function (result) {
			var result = JSON.parse(result),
				meta = result.meta;
			if(meta.result == 100){
				window.location.href = 'courseManagement.html?subModule=audit';
			}else{
				alert(meta.msg);
			}
		}
	},'getMouduleInf');
}
// 通过

passBtn.onclick = function () {
	sumbitCheck('pass');
};
rejectBtn.onclick = function(){
	sumbitCheck('reject');
}
backBtn.onclick = function () {
	window.location.href = 'courseManagement.html?subModule=audit';
};

// 测试



