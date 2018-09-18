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
	masterId = query.masterId,
	masterName = query.masterName,
	groupItem = query.groupItem,
	modifyType = 1,
	wpID = query.wpID ,
	wppc = query.wppc,
	addAllocRs = host + 'addAllocRs',
	queryExpAllocRs = host + 'queryExpAllocRs',
	deltAllocRs = host + 'deltAllocRs';
console.log(wpID);
//初始化ajax
ajaxPading.init({
	name:"queryExpAllocRs",
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
			 itemID:masterId,
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



BluMUI.create({
	courseName:masterName,
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
	}]
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
	}]
},'EditorList',doc.getElementById('addEditor'));


function renderList() {
	ajaxPading.send({
		url:queryExpAllocRs,
		data:{
			unifyCode:unifyCode,
			ID:wpID,
			expID:masterId,
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
						courseName:courseAllocList[i].courseName,
						college:courseAllocList[i].unit,
						masters:courseAllocList[i].allocExp,
						id:courseAllocList[i].courseNo
					});
					selectsEXP.push(false);
				}

				for(i = 0 , len = otherAllocList.length ; i < len ; i++){
					itemsOther.push({
						courseName:otherAllocList[i].courseName,
						college:otherAllocList[i].unit,
						masters:otherAllocList[i].allocExp,
						id:otherAllocList[i].courseNo
					});
					selectsOther.push(false);
				}

				var that1 = BluMUI.result.deleteList,
					that2 = BluMUI.result.addList;
				that1.setState({items:itemsEXP,selected:false,selects:selectsEXP});
				that2.setState({items:itemsOther,selected:false,selects:selectsOther});
			}
		}
	},'queryExpAllocRs');
}
renderList();
back.onclick = function () {
	window.location.href = 'wpgl-jieguo.html?wppc=' + wppc +'&id=' +wpID;
};
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

