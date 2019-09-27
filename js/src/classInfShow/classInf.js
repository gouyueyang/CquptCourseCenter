require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
require('es6-promise');
var BluMUI = require('../../libs/classInfShow/classInf.js'),
	ajaxPading = require('../../libs/ajaxExpand.mini.min'),
	classNameDom = document.getElementById('courseName'),
	// iframe = window.frames['content'],
	iframe = document.getElementById('myIframe'),
	hash = parseHash(window.location.href),
	items = [],
	courseType,
   unifyCode = getCookie('userId'),
	// classId = hash.classId || 'A1040040',  //测试使用（因为精简URL地址导致的）
	classId = window.location.href.split("/").pop(),    //部署到服务器上的时候用

	userName = getCookie('userName'),
	host = courseCenter.host,
	getMenu =  host + 'getMenu',
	getCourseStatus = host +  'getCourseStatus',
	urlPrefix = host + 'CquptCourseCenter/pages/classInfShow/',   //部署到服务器上的时候用
	// urlPrefix = 'localhost:8080/pages/classInfShow/',    //测试使用
	moduleURL = {
		'课程首页': urlPrefix+'home.html?classId=' + classId + '&moduleName='+ encodeURIComponent('课程首页'),
		'电子教案': urlPrefix+'classInfModule.html?classId=' + classId + '&moduleName=' + encodeURIComponent('电子教案'),
		'考试大纲': urlPrefix+'classInfModule.html?classId=' + classId + '&moduleName=' + encodeURIComponent('考试大纲'),
		'教学大纲': urlPrefix+'classInfModule.html?classId=' + classId + '&moduleName=' + encodeURIComponent('教学大纲'),
		'考核方案': urlPrefix+'classInfModule.html?classId=' + classId + '&moduleName=' + encodeURIComponent('考核方案'),
		'导学方案': urlPrefix+'classInfModule.html?classId=' + classId + '&moduleName='+ encodeURIComponent('导学方案'),
		'知识点体系': urlPrefix+'classInfModule.html?classId=' + classId + '&moduleName=' + encodeURIComponent('知识体系'),
		'学习资源': urlPrefix+'courseShow.html?classId=' + classId + '&moduleName='+ encodeURIComponent('视频')+'&place=2',
		'教学团队': urlPrefix+'team_show.html?classId=' + classId+'&place=2',
		'课程简介': urlPrefix+'courseJianjie.html?classId=' + classId+'&place=2',
		'授课计划': urlPrefix+'classTeachPlan.html?classId=' + classId,
		'实习计划': urlPrefix+'classTeachPlan.html?classId=' + classId,
		'话题讨论': urlPrefix + 'topicDis.html?classId=' + classId
	};


//添加load事件，addEventListener为添加事件
//当页面完全加载的时候就会触发
document.getElementById('myIframe').addEventListener('load',function () {
	// var toModuleName = parseHash(iframe.location.href).moduleName || null;
	var toModuleName = parseHash(iframe.src).moduleName || null;
	if(toModuleName){
		var that = BluMUI.result.contentNav,
			items = that.props.items,
			index,
			i,
			len;
		for( i = 0 , len = items.length ; i < len ; i++){
			if(items[i].name === toModuleName){
				index = i;
				break;
			}
		}
		that.setState({
			index:index // 保存当期tab
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
	window.location.href = '/CquptCourseCenter/pages/classInfShow/error3.html';
}else{
	ajaxPading.send({
		data:{
			courseNo:classId, // 课程编号
			unifyCode:unifyCode // 标示用户
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
					courseType = 2;
				if(type === 2)
					courseType = 3;
				classNameDom.innerHTML = data.courseName;
				initNav(unifyCode);
			}else{
				window.location.href = '/CquptCourseCenter/pages/classInfShow/error3.html';
			}
		}
	},'getClassName');
}


function initNav(unifyCode){
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
			for( i = 0 , len = data.length ; i < len ; i++ ){
				items.push(data[i].cdmc);
			}
			BluMUI.create({
				id:'contentNav',
				items:items, // 后端返回tabList
				index:0,
				callback: changeMoudule
			},'List',document.getElementById('class_nav'));
			iframe.src = moduleURL[data[0].cdmc];
			// iframe.location.href = moduleURL[data[0].cdmc];
			// iframe.location.href = host + moduleURL[data[0].cdmc];
			console.log('href' + moduleURL[data[0].cdmc]);
			selfAdaptionFrame('myIframe');
		}
	},'getModule');
}


if(classId == null ){
	window.document.body.innerHTML='该页面不存在!';
}


function changeMoudule (value) {
	// iframe.location.href = moduleURL[value];
	iframe.src = moduleURL[value];
	selfAdaptionFrame('myIframe');
	console.log('切换tab', moduleURL[value]);
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
			console.log(iframe.height);
		}, 2000);
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

