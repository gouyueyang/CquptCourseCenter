require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
require('es6-promise');
var BluMUI = require('../libs/classManageCheck/blueMonUI.js'),
	ajaxPading = require('../libs/ajaxExpand.mini.min'),
	unifyCode = getCookie('userId'),
	host = courseCenter.host,
	getCourseStatus = host + 'getCourseStatus',
	submitOperation = host + 'submitOperation',
	getCourseList = host + 'getCourseList',
	getMenu = host + 'getMenu',
	courseResCount = host + 'courseResCount',
	selectKc = host + 'selectKc',
	loginURL = 'https://ids.cqupt.edu.cn/authserver/login?service=' + host + 'classList',
	reviewType = '',
	courseType = '',
	courseNo = '',
	courseStatus = '',
	iframe = window.frames['content'],
	myIframe = document.getElementById('myIframe'),
	searchBtn = document.getElementById('search-btn'),
	searchInput = document.getElementById('search-input'),
	review = document.getElementById('review'),
	passBtn = document.getElementById('pass'),
	rejectBtn = document.getElementById('reject'),
	content = document.getElementById('content'),
	noData = document.getElementById('no-data'),
	types = {
		'系部中心主任待审': 2,
		'教学院长待审': 3,
		'编辑中': 1
	};
noData.style.cssText = 'display: none';
ajaxPading.init({
	type:'post',
	dataType:'json',
	name:'getMouduleInf',
	async:true
});
ajaxPading.init({
	name:'selectKc',
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
ajaxPading.init({
	name:'getCourseList',
	type:'post',
	async:true,
	dataType:'json'
});

function updateHeight() {
	if(window.frameElement) {
		window.frameElement.height = 55 + document.documentElement.offsetHeight;
		window.frameElement.width = 1200;
	}
}
// 返回指定模块的URL
function getModuleURL(type, courseNo) {
	switch (type) {
		case '课程简介':
			return '../classInfShow/kechengJianjie.html?classId=' + courseNo;
		case '教学团队':
			return '../classInfShow/teamShow.html?classId=' + courseNo;
		case '电子教案':
			return '../classInfShow/classMasterModule.html?classId=' + courseNo + '&moduleName='+ encodeURIComponent('电子教案');
		case '考试大纲':
			return '../classInfShow/classMasterModule.html?classId=' + courseNo + '&moduleName=' + encodeURIComponent('考试大纲');
		case '考核方案':
			return  '../classInfShow/classMasterModule.html?classId=' + courseNo + '&moduleName=' + encodeURIComponent('考核方案');
		case '教学大纲':
			return '../classInfShow/classMasterModule.html?classId=' + courseNo + '&moduleName=' + encodeURIComponent('教学大纲');
		case '导学方案':
			return '../classInfShow/classMasterModule.html?classId=' + courseNo + '&moduleName=' + encodeURIComponent('导学方案');
		case '授课计划':
			return '../classInfShow/classMasterModule.html?classId=' + courseNo;
		case '实习计划':
			return '../classInfShow/classMasterModule.html?classId=' + courseNo;
		case '知识点体系':
			return '../classInfShow/classMasterModule.html?classId=' + courseNo + '&moduleName=' + encodeURIComponent('知识体系');
		case '学习资源':
			return '../classInfShow/ziYuan.html?classId=' + courseNo + '&moduleName=' + encodeURIComponent('视频');
	}
}

// 获取该课程菜单的信息
function getMenuInf() {
	var type;
	if(courseType === 1 )
		type = 7;
	if(courseType === 2)
		type = 8;
	ajaxPading.send({
		data:{
			unifyCode:unifyCode,
			module: type
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
				selfAdaptionFrame('myIframe', updateHeight);
				BluMUI.result.classNavList.setState({
					index: 0,
					items: items
				});
				iframe.location.href = getModuleURL(items[0], courseNo);
			}else{
				console.log('服务器发生错误!');
			}
		}
	},'getMouduleInf');
}
// 获取该课程菜单的信息
function getResource() {
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
				BluMUI.result.resourceNum.setState({
					source: res
				});
			}else if(meta.result == 303 ){
				confirm(result.meta.msg);
				window.location.href=loginURL;
			}
		}
	},'getFileInfs');
}
// 初始化审核、驳回的信息,初始化导航信息
function initInf(selectName){
	// 获取课程信息
	ajaxPading.send({
		url: getCourseList,
		data: {
			unifyCode: unifyCode,
			courseState: [0, 0 ,1, 0, 0, 0],
			page: 1,
			count: 1000,
			subModule: 'audit',
			selectName: selectName || ''
		},
		onSuccess: function (result) {
			result = JSON.parse(result);
			var meta = result.meta;
			if (meta.result == 100) {
				var courses = result.data.courseList,
					items = [],
					len = courses.length,
					i;
				for (i = 0; i < len ; i++) {
					items[i] =  {
						name: courses[i].kcmc,
						id: courses[i].kcbh,
						type: courses[i].kclx,
						status: courses[i].dqzt
					}
				}
				if (len > 0) {
					content.style.cssText = 'display: block';
					noData.style.cssText = 'display: none';
					courseType = items[0].type;
					courseStatus = items[0].status || '编辑中';
					reviewType = types[items[0].status];
					courseNo = items[0].id;
					changePassText(courseStatus);
					getMenuInf();
					getResource();
				} else {
					noData.style.cssText = 'display: block';
					content.style.cssText = 'display: none';
				}
				BluMUI.result.List.setState({
					items: items,
					index: 0
				});
			}
			updateHeight();
		}
	}, 'getCourseList');
	// 获取该课程菜单的信息
}

// 改变通过按钮text

function changePassText(status) {
	if (status === '编辑中') {
		passBtn.innerText = '提交/审核';
	} else {
		passBtn.innerText = '审核';
	}
}
// 点击导航
function  changeNav(value) {
	iframe.location.href = getModuleURL(value, courseNo);
}

// 切换课程

function  changeCourse(item) {
	courseNo = item.id;
	courseType = item.type;
	reviewType = types[item.status];
	changePassText(item.status);
	getMenuInf();
	getResource();
	updateHeight();
}

// 搜素课程

function  searchCourse(name) {
	initInf(name);
}


// 提交

function sumbitCheck(result){
	var note = review.value;
		ajaxPading.send({
		data:{
			note:note,
			result:result,
			type:reviewType,
			unifyCode:unifyCode,
			courseNo:courseNo
		},
		url:submitOperation,
		onSuccess:function (result) {
			var result = JSON.parse(result),
				meta = result.meta;
			if(meta.result == 100){
				alert('审核成功!');
				window.location.reload();
			}else if(meta.result == 303 ){
				confirm(result.meta.msg);
				window.location.href=loginURL;
			}else{
				alert(meta.msg);
			}
		}
	},'getMouduleInf');
}
initInf();

// 通过


passBtn.onclick = function () {
	sumbitCheck('pass');
};
rejectBtn.onclick = function(){
	sumbitCheck('reject');
};
searchBtn.onclick = function (e) {
	searchCourse(searchInput.value);
};
searchInput.onkeypress = function (e) {
	if (e.charCode === 13) {
		searchCourse(searchInput.value);
	}
};
console.log(myIframe, iframe);
BluMUI.create({
	id: 'List',
	callback: changeCourse
},'List',document.getElementById('rightContent'));

BluMUI.create({
	id: 'resourceNum',
	source: []
},'ResourceNum',document.getElementById('ResourceNum'));

BluMUI.create({
	id:'classNavList',
	items:[],
	extClass:'',
	callback:changeNav,
	index:0
},'NavList',document.getElementById('class_nav'));
(function (){
	window.onload = function () {
		setTimeout(function () {
			updateHeight();
		},0);
	};
	window.onresize = function () {
		setTimeout(function () {
			updateHeight();
		},0);
	};
})();

