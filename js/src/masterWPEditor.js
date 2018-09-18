/**
 * Created by swull on 2017/7/13.
 */
require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
require('es6-promise');
var BluMUI = require('../libs/blueMonUI.js'),
	 ajaxPading = require('../libs/ajaxExpand.mini.min'),
	 host = courseCenter.host,
	 doc = document,
	 back = doc.getElementById('back'),
	 query = parseHash(window.location.href),
	 unifyCode = getCookie('userId'),
	 masterId = query.masterId || '',
	 courseNo =query.courseNo || '',
	 courseName = query.courseName || '',
	 groupItem = query.groupItem || '',
	 modifyType = 2,
	 wpID = query.wpID || '',
	 wppc = query.wppc,
	 curCoursePage = 1,
	 curExpId = '',
	 queryExpAllocDetail = host + 'queryExpAllocDetail',
	 addAllocRs = host + 'addAllocRs',
	 queryCourseAllocRs = host + 'queryCourseAllocRs',
	 deltAllocRs = host + 'deltAllocRs';

//初始化ajax
ajaxPading.init({
	name:"queryCourseAllocRs",
	dataType:'json',
	type:'post',
	async:true,
	handleData:function (result) {
		return JSON.parse(result);
	}
});
ajaxPading.init({
	name:"addAllocRs",
	dataType:'json',
	type:'post',
	async:true,
	handleData:function (result) {
		return JSON.parse(result);
	}
})

// 渲染课程列表

function renderCourseList(that) {
	ajaxPading.send({
		url:queryExpAllocDetail,
		data:{
			unifyCode:unifyCode,
			ID:wpID,
			expID:curExpId,
			groupItem:groupItem,
			page:curCoursePage,
			count:8
		},
		onSuccess:function (result) {
			var meta = result.meta;
			if(meta.result == 100){
				var data = result.data,
					list = data.list,
					len = list.length,
					items = [],
					totalPages = data.totalPages,
					total = data.total,
					i;
				for( i = 0 ; i < len ; i++){
					items.push({
						courseName:list[i].courseName,
						courseId:list[i].courseNo,
						college:list[i].unit
					});
				}
				var PT = that.state.PT;
				PT.total = total;
				PT.sum = totalPages;
				that.setState({
					courseItems:items,
					PT:PT
				});
			}
		}
	},'queryCourseAllocRs');
}

// 显示全部课程

function  showCourseBox(expId,that) {
	curExpId = expId;
	var PT = that.state.PT;
	PT.index = 1;
	that.setState({
		PT:PT,
		showCourse:true
	});
	renderCourseList(that);
}

// 课程翻页

function turn(value,that) {
	curCoursePage = +value;
	renderCourseList(that);

}
// 全部交换
function exchangeAll(type,that) {
	var items = that.state.items,
		 selects = that.state.selects,
		 i,
		 len = selects.length,
		 str = [],
		url,
		data  = {
			unifyCode:unifyCode,
			ID:wpID,
			groupItem:groupItem,
			type:modifyType,
			itemID:masterId,
		};
	for( i = 0 ; i < len ; i++ ){
		if(selects[i]){
			str.push(items[i].id);
		}
	}
	if(type === '删除选择'){
		url = deltAllocRs;
		data.deltItems = str.join(',');
	}else{
		url = addAllocRs;
		data.addItems = str.join(',');
	}
	ajaxPading.send({
		url:url,
		data:data,
		onSuccess:function (result) {
			var meta = result.meta;
			if(meta.result == 100){
				renderList();
			}
			else{
				alert(meta.msg);
			}
		}
	},'addAllocRs');
}
// 单个交换

function exchangeSingle(type,index,that){
	var item = that.state.items[index],
		 url,
		 data = {
			 unifyCode:unifyCode,
			 ID:wpID,
			 groupItem:groupItem,
			 type:modifyType,
			 itemID: courseNo,
		 };
	if(type == '删除'){
		url = deltAllocRs;
		data.deltItems = item.id;
	}else{
		url = addAllocRs;
		data.addItems = item.id;
	}
	ajaxPading.send({
		url:url,
		data:data,
		onSuccess:function (result) {
			var meta = result.meta;
			if(meta.result == 100){
				renderList();
			}
			else{
				alert(meta.msg);
			}
		}
		},'addAllocRs');
}

// 渲染当前列表
function renderList() {
	ajaxPading.send({
		url:queryCourseAllocRs,
		data:{
			unifyCode:unifyCode,
			ID:wpID,
			courseNo:courseNo,
			groupItem:groupItem
		},
		onSuccess:function (result) {
			var meta = result.meta;
			if(meta.result == 100){
				var data = result.data,
					 courseAllocLists = data.courseAllocList,// 已分配
				  	 otherAllocLists = data.otherAllocList,// 未分配
				 	 courseAllocList = courseAllocLists[0] || [],
					 otherAllocList = otherAllocLists[0] || [],
				    len,
					 i,
					 selectsEXP = [],
					 selectsOther = [],
					 itemsEXP = [],
					 itemsOther = [];

				for(i = 0 , len = courseAllocList.length ; i < len ; i++){
					itemsEXP.push({
						masterName:courseAllocList[i].expName,
						college:courseAllocList[i].unit,
						courses:courseAllocList[i].allocCourse,
						id:courseAllocList[i].expID
					});
					selectsEXP.push(false);
				}

				for(i = 0 , len = otherAllocList.length ; i < len ; i++){
					itemsOther.push({
						masterName:otherAllocList[i].expName,
						college:otherAllocList[i].unit,
						courses:otherAllocList[i].allocCourse,
						id:otherAllocList[i].expID
					});
					selectsOther.push(false);
				}

				var that1 = BluMUI.result.deleteList,
					 that2 = BluMUI.result.addList;
				that1.setState({items:itemsEXP,selected:false,selects:selectsEXP});
				that2.setState({items:itemsOther,selected:false,selects:selectsOther});
			}
		}
	},'queryCourseAllocRs');
}
renderList();
BluMUI.create({
	courseName:courseName,
	teamName:groupItem
},'WpEditorTitle',doc.getElementById('wpEditorTitle'));
BluMUI.create({
	id:'deleteList',
	items:[],
	name:"已分配课程",
	titleName:'删除选择',
	titleIcon:'../../imgs/systemManage/delete.png',
	titleCallback:exchangeAll,
	operaions:[{
		name:'删除',
		callback:exchangeSingle
	}],
	showCourseBox:showCourseBox,
	PT:{
		index:1,
		id:"tests",
		length:7,
		sum:0,
		total:0,
		start:1,
		lastName:'上一页',
		nextName:'下一页',
		bottomName:'尾页',
		topName:'首页',
		change:turn
	}
},'EditorList',doc.getElementById('hasEditored'));

BluMUI.create({
	id:'addList',
	items:[],
	name:"分组内其他课程",
	titleName:'加入分配',
	titleIcon:'../../imgs/systemManage/add.png',
	titleCallback:exchangeAll,
	operaions:[{
		name:'添加',
		callback:exchangeSingle
	}],
	showCourseBox:showCourseBox,
	PT:{
		index:1,
		id:"tests",
		length:7,
		sum:0,
		total:0,
		start:1,
		lastName:'上一页',
		nextName:'下一页',
		bottomName:'尾页',
		topName:'首页',
		change:turn
	}
},'EditorList',doc.getElementById('addEditor'));
back.onclick = function () {
	window.location.href = 'wpgl-jieguo.html?wppc=' + wppc +'&id=' +wpID;
};
// 出书

(function (){
	var height;
	window.onload = function () {
		setTimeout(function () {
				height = document.documentElement.offsetHeight;
			if(window.frameElement) {
				window.frameElement.height = height
			}
		},0);
	};
	window.onresize = function () {
		setTimeout(function () {
			height = document.documentElement.offsetHeight;
			if(window.frameElement) {
				window.frameElement.height = height;
			}
		},0);
	};
})();

