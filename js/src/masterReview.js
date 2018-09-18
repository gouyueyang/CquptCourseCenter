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
	 userId = getCookie('userId')	,// 专家ID
	 iframe = window.frames['myiframe'],
	 iframeDom = doc.getElementById('myiframe'),
	 revewBody = doc.getElementById('revewBody'),
	 noData = doc.getElementById('noData'),
	 host = courseCenter.host,
	 classListZJ = host + 'classListZJ',
	 curClassId = '',
	 curReviewID = '',
	 downURL = host + 'fileDownLoad',
	 getMenu = host + 'getMenu',
	 expReview = host + 'expReview',
	 courseResCount = host + 'courseResCount',
 	 reviewCourseInfo = host + 'reviewCourseInfo',
	 queryInfoInReview = host + 'queryInfoInReview',
	 expReviewList = host + 'expReviewList',
	 reviewBriefList = host + 'reviewBriefList';
ajaxPading.init({
	name:'initList',
	type:'post',
	dataType:'json',
	handleData:function (result) {
		return JSON.parse(result);
	},
	async:true
});


ajaxPading.init({
	name:'reviewBriefList',
	type:'post',
	dataType:'json',
	handleData:function (result) {
		return JSON.parse(result);
	},
	async:true
});
ajaxPading.init({
	name:"queryInfoInReview",
	type:'post',
	dataType:'json',
	handleData:function (result) {
		return JSON.parse(result);
	},
	async:true
});
ajaxPading.init({
	name:"reviewCourseInfo",
	type:'post',
	dataType:'json',
	handleData:function (result) {
		return JSON.parse(result);
	},
	async:true
});
ajaxPading.init({
	name:'courseResCount',
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

//

function  getNavURL(type,classId) {
	switch (type){
		case '课程简介':
			return '../classInfShow/kechengJianjie.html?classId=' + classId;
			break;
		case '教学团队':
			return '../classInfShow/teamShow.html?classId=' + classId;
			break;
		case '电子教案':
			return '../classInfShow/classMasterModule.html?classId=' + classId + '&moduleName='+ encodeURIComponent('电子教案');
			break;
		case '考试大纲':
			return '../classInfShow/classMasterModule.html?classId=' + classId + '&moduleName=' + encodeURIComponent('考试大纲');
			break;
		case '考核方案':
			return '../classInfShow/classMasterModule.html?classId=' + classId + '&moduleName=' + encodeURIComponent('考核方案');
		case '教学大纲':
			return '../classInfShow/classMasterModule.html?classId=' + classId + '&moduleName=' + encodeURIComponent('教学大纲');
			break;
		case '导学方案':
			return '../classInfShow/classMasterModule.html?classId=' + classId + '&moduleName=' + encodeURIComponent('导学方案');
			break;
		case '授课计划':
			return '../classInfShow/classMasterModule.html?classId=' + classId;
			break;
		case '实习计划':
			return '../classInfShow/classMasterModule.html?classId=' + classId;
			break;
		case '知识点体系':
			return '../classInfShow/classMasterModule.html?classId=' + classId + '&moduleName=' + encodeURIComponent('知识体系');
			break;
		case '学习资源':
			return '../classInfShow/ziYuan.html?classId=' + classId + '&moduleName=' + encodeURIComponent('视频');
			break;

	}
	moduleURL = {
		}
}

// 提交或者保存

function  submit(data,type) {
	data.expID = userId;
	data.reviewID =curReviewID;
	data.courseNo = curClassId;
	ajaxPading.send({
		url:expReview,
		data:data,
		onSuccess:function (result) {
			var meta = result.meta;
			if(meta.result == 100){
				if(type === 1){
					alert('保存成功!');

				}else{
					alert('提交成功!');
					var that = BluMUI.result.drop;
					that.setState({
						reviewedNum: that.state.reviewedNum + 1,
						notReviewNum: that.state.notReviewNum - 1
					})
				}
			}else{
				alert(meta.msg);
			}
		}
	},'initList');
}

function changeBriefList(item){
	var that = BluMUI.result.drop,
		 drop = that.state.drop;
	drop.value = item.name;
	curReviewID = item.id;
	renderLeftList(1);
	that.setState({
		drop:drop,
		selectIndex: 3
	});
	renderInfoInReview(item.id);
}
// 切换课程评审状态
function changeState(status){
	var that = BluMUI.result.drop;
	that.setState({
		selectIndex: +status
	});
	renderLeftList(+status);
}

// 切换评审课程

function changeReview(item) {
	curClassId = item.courseNo;
	BluMUI.result.courseNav.setState({
		index: 0
	});
	renderReviewInf(item.courseNo);
}
// 渲染审核信息
function  renderReviewInf(courseNo, state) {
	changeNav('课程简介');
	renderResource();
	ajaxPading.send({
		url:reviewCourseInfo,
		data:{
			expID:userId,
			reviewID:curReviewID,
			courseNo:courseNo
		},
		onSuccess:function (result) {
				var meta = result.meta;
				if(meta.result == 100){
					var data = result.data,
						 courseName = data.courseName,
						 courseScore = data.score,
						 courseType = data.kclx,
						 courseMoudule = [],
						 target = data.target,
						 i,
						 len = target.length;
					for( i = 0 ; i < len ; i++){
						courseMoudule.push({
							name:target[i].itemName,
							reviewDesc:target[i].standard || '暂无',
							totalScore:target[i].fullScore,
							curScore:target[i].pf,
							id:target[i].itemID,
							score: target[i].pf
						});
					}
					console.log(courseMoudule);
					renderMenu(courseType);
					var that = BluMUI.result.course;
					that.setState({
						courseScore:courseScore,
						courseName:courseName,
						courseMoudule:courseMoudule,
						courseReview: data.pj,
						isEditor: state !== 2
					});
				}else{
					alert(meta.msg);
				}
		}
	},'reviewCourseInfo')
}

// 渲染课程导航菜单

function renderMenu(type) {
	ajaxPading.send({
		url:getMenu,
		data: {
			unifyCode: userId,
			module: type == 1 ? 12 : 13
		},
		onSuccess:function (result) {
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
// 渲染课程的列表
function renderLeftList(state) {
	ajaxPading.send({
		url:expReviewList,
		data:{
			expID:userId,
			reviewID:curReviewID,
			state:state
		},
		onSuccess:function (result) {
			var meta = result.meta,
				data = result.data,
				items = [];
			if(meta.result == 100){
				var i,
					len = data.length;
				for( i = 0 ; i < len ; i++){
					items.push({
						courseNo:data[i].courseNo,
						name:data[i].courseName,
						score:data[i].score
					});
				}
			}

			var that = BluMUI.result.leftList;
			if(len > 0 ){
				iframeDom.style.cssText='display:block';
				curClassId = data[0].courseNo;
				renderReviewInf(data[0].courseNo, state);
				noData.style.cssText='display:none';
				revewBody.style.cssText='display:block';
			} else {
				revewBody.style.cssText='display:none';
				iframeDom.style.cssText='display:none';
				noData.style.cssText='display:block';
				BluMUI.result.course.setState({
					courseMoudule: []
				});
				BluMUI.result.courseNav.setState({
					items:[]
				});
				BluMUI.result.source.setState({
					source:[]
				});
			}
			that.setState({
				index:0,
				items:items
			});
		}
	},'initList');
}

// 渲染该批次的基本信息
function renderInfoInReview(id) {
	ajaxPading.send({
		url:queryInfoInReview,
		data:{
			zjid:userId,
			ID:id
		},
		onSuccess:function (result) {
			var meta = result.meta;
			if(meta.result == 100){
				var data = result.data;
				var that = BluMUI.result.drop;
				that.setState({
					totalNum:data.totalNum,
					reviewedNum:data.reviewedNum,
					notReviewNum:data.notReviewNum,
					files:data.files,
					time:data.kssj + '至' + data.jssj
				})
			}
		}
	},'queryInfoInReview');
}

// 渲染课程资源数量

function  renderResource() {
	ajaxPading.send({
		url:courseResCount,
		data:{
			unifyCode:userId,
			courseNo:curClassId
		},
		onSuccess:function (result) {
			var meta = result.meta;
			if(meta.result == 100){
				var data = result.data,
					 res = data.res,
					 i,
					 len = res.length,
					 items = [];
				for( i = 0 ; i < len ; i++){
					items.push({
						name:res[i].name,
						num:res[i].count
					});
				}
				var that = BluMUI.result.source;
				that.setState({
					source:items
				})
			}
		}
	},'courseResCount');
}

function  changeNav(value) {
	iframe.location.href = getNavURL(value,curClassId);
}
// 初始化列表和预览模块
(function(){
	// 初始化
	ajaxPading.send({
		url:reviewBriefList,
		data:{
			userID:userId,
			state:2,
			expGroup:''
		},
		onSuccess:function (result) {
			var meta = result.meta,
				 data = result.data,
				 items = [];
			if(meta.result == 100 ){
				var i,
					 list = data.list,
					 len = list.length;
				for( i = 0 ; i < len ; i++){
					items.push({
						name:list[i].wppc,
						id:list[i].id
					})
					var that = BluMUI.result.drop,
						drop = that.state.drop;
					drop.items = items;
					drop.value = list[0].wppc;
					curReviewID = list[0].id;
					that.setState({
						drop:drop
					});
					renderLeftList(3);
					renderInfoInReview(list[0].id);
				}
			} else if (meta.result == 101) {
				revewBody.style.cssText='display:none';
				iframeDom.style.cssText='display:none';
				noData.style.cssText='display:block';
			}

		}
	},'reviewBriefList');

})();
function Download(item){
	var downLoadIframes = window.frames['downLoad'];
	downLoadIframes.location.href = downURL + '?name='+ encodeURI(item.originalName) +'&oName=' + item.filename + '&unifyCode=' + userId;
}

BluMUI.create({
	id:'leftList',
	items:[],
	index:0,
	callback:changeReview
},'NavList',doc.getElementById('reviewList'));
BluMUI.create({
	id:'drop',
	drop:{
		initName:'请选择',
		inputName:'select',
		items:[],
		max:4,
		minbarH:8,
		optionH:28,
		callback:changeBriefList
	},
	downloadFile: Download,
	click:changeState,
	files:[],
	time:'',
	totalNum:0,
	reviewedNum:0,
	notReviewNum:0,
},'ReviewSelect',doc.getElementById('select'));
BluMUI.create({
	id:'courseNav',
	items:[],
	index:0,
	callback:changeNav
},'NavListPercent',doc.getElementById('showAreaNav'));
// reviewCourse
selfAdaptionFrame('myiframe');
BluMUI.create({
	id:'course',
	courseName:'',
	courseScore:0,
	courseMoudule:[],
	submit:submit
},'ReviewCourse',doc.getElementById('reviewCourse'));

BluMUI.create({
	id:'source',
	source:[]
},'ResourceNum',doc.getElementById('resourceNum'));
