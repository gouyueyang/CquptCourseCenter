/**
 * Created by swull on 2017/7/13.
 */
require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
require('es6-promise');
var doc = document,
	 BluMUI = require('../libs/blueMonUI.js'),
	 ajaxPading = require('../libs/ajaxExpand.mini.min'),
	 iframe = window.frames['myiframe'],
	 hash = parseHash(window.location.href),
	 host = courseCenter.host,
	 getMenu = host + 'getMenu',
	 queryInfoInReview = host + 'queryInfoInReview',
	 reviewCourseInfo = host + 'reviewCourseInfo',
	 classListZJ = host + 'classListZJ',
	 classId = hash.classId ,
	 reviewId = hash.reviewId,
	 userId = getCookie('userId'),
	downURL = host + 'fileDownLoad',
	 moduleURL = {
			'课程简介': '../classInfShow/kechengJianjie.html?classId=' + classId,
			'教学团队': '../classInfShow/teamShow.html?classId=' + classId,
			'电子教案': '../classInfShow/classMasterModule.html?classId=' + classId + '&moduleName=' + encodeURIComponent('电子教案'),
			'考试大纲': '../classInfShow/classMasterModule.html?classId=' + classId + '&moduleName=' + encodeURIComponent('考试大纲'),
			'考核方案': '../classInfShow/classMasterModule.html?classId=' + classId + '&moduleName=' + encodeURIComponent('考核方案'),
			'教学大纲': '../classInfShow/classMasterModule.html?classId=' + classId + '&moduleName=' + encodeURIComponent('教学大纲'),
			'导学方案': '../classInfShow/classMasterModule.html?classId=' + classId + '&moduleName=' + encodeURIComponent('导学方案'),
			'授课计划': '../classInfShow/classMasterModule.html?classId=' + classId,
			'实习计划': '../classInfShow/classMasterModule.html?classId=' + classId,
			'知识点体系': '../classInfShow/classMasterModule.html?classId=' + classId + '&moduleName=' + encodeURIComponent('知识体系'),
			'学习资源': '../classInfShow/ziYuan.html?classId=' + classId + '&moduleName=' + encodeURIComponent('视频')
	 };

ajaxPading.init({
	name:'queryInfoInReview',
	type:'post',
	dataType:'json',
	handleData:function (result) {
		return JSON.parse(result);
	},
	async:true
});

ajaxPading.init({
	name:'reviewCourseInfo',
	type:'post',
	dataType:'json',
	handleData:function (result) {
		return JSON.parse(result);
	},
	async:true
});
ajaxPading.init({
	name:'getMenu',
	type:'post',
	dataType:'json',
	handleData:function (result) {
		return JSON.parse(result);
	},
	async:true
});
function Download(item){
	var downLoadIframes = window.frames['downLoad'];
	console.log(item, downLoadIframes, downURL + '?name='+ encodeURI(item.originalName) +'&oName=' + item.filename + '&unifyCode=' + userId);
	downLoadIframes.location.href = downURL + '?name='+ encodeURI(item.originalName) +'&oName=' + item.filename + '&unifyCode=' + userId;
}
// 切换评审课程
function changeReview(item) {
	var name = item.name;
	console.log(name);
}
//

function  changeNav(value) {
	iframe.location.href = moduleURL[value];
}

//
function renderMenu(type) {
	ajaxPading.send({
		url:getMenu,
		data: {
			unifyCode: userId,
			module: type == 1 ? 12 : 13
		},
		onSuccess:function (result) {
			console.log(result);
			var meta = result.meta;
			if(meta.result == 100){
				var data = result.data,
					i,
					len = data.length,
					items = [];
				for( i = 0 ; i < len ; i++){
					items.push(data[i].cdmc);
				}
				var that = BluMUI.result.courseNav;
				that.setState({
					items:items
				})
			}else{
				alert(meta.msg);
			}
		}
	},'getMenu')
}
function getBaseInf() {
	ajaxPading.send({
		url:queryInfoInReview,
		data:{
			ID:reviewId,
			zjid:userId
		},
		onSuccess:function (result) {
			var meta = result.meta;
			if(meta.result == 100){
				var data = result.data,
					 startTime = data.kssj,
					 endTime = data.jssj,
					 files = data.files,
					 pc = data.wppc;
				BluMUI.create({
					pc:pc,
					sj: startTime + ' - ' +  endTime,
					fj:files,
					downLoad: Download
				},'Result',doc.getElementById('resultInf'));
			}else{
				alert(meta.msg);
			}
		}
	},'queryInfoInReview');
}
function getCourseInf() {
	ajaxPading.send({
		url:reviewCourseInfo,
		data:{
			expID:userId,
			reviewID:reviewId,
			courseNo:classId
		},
		onSuccess:function (result) {
			var meta = result.meta;
			if(meta.result == 100){
				changeNav('课程简介');
				var data = result.data,
					 courseName = data.courseName,
					 score = data.score,
					 courseType = data.kclx,
					 target = data.target,
					 len = target.length,
					 items = [],
					 i;
				for( i = 0 ; i < len ; i++){
					items.push({
						name:target[i].itemName,
						reviewDesc:target[i].standard || '暂无',
						totalScore:target[i].fullScore,
						curScore:target[i].pf,
						id:target[i].itemID,
						score:target[i].fullScore
					});
				}
				renderMenu(courseType);
				BluMUI.create({
					courseName:courseName,
					courseScore:score,
					pjdesc:data.pj,
					courseMoudule:items
				},'ReviewCourse',doc.getElementById('reviewCourse'));
			}else{
				alert(meta.msg);
			}
		}
	},'reviewCourseInfo')
}
getCourseInf();
getBaseInf();
BluMUI.create({
	id:'courseNav',
	items:[],
	index:0,
	callback:changeNav
},'NavListPercent',doc.getElementById('showAreaNav'));
// reviewCourse
selfAdaptionFrame('myiframe');


BluMUI.create({
	source:[
		{
			name:'课程简介',
			num:5
		},
		{
			name:'教学大纲',
			num:9
		},
		{
			name:'电子教案',
			num:11
		},
		{
			name:'学习资源',
			num:12
		},
		{
			name:'学习资源',
			num:12
		},
		{
			name:'学习资源',
			num:12
		},
	]
},'ResourceNum',doc.getElementById('resourceNum'));


