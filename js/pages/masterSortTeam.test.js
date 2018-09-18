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
	masterPC = query.masterPC ,
	groupPC = query.groupPC,
	getZjfzList = host + 'getZjfzList',
	groupItem = query.groupItem,
	curMasterType = 1	,
	curPage = 1,
	curCollege = '',
	curResearch = '',
	curEevaluateName = '',
	getFzxByZjfzpc = host + 'getFzxByZjfzpc',
	getCollege = host + 'getCollege',
	deleteZjfz = host + 'deleteZjfz',
	addZjfz = host + 'addZjfz',
	getDfpzjList = host + 'getDfpzjList',
	deltAllocRs = host + 'deltAllocRs';

//初始化ajax
ajaxPading.init({
	name:"getDfpzjList",
	dataType:'json',
	type:'post',
	async:true,
	handleData:function (result) {
		return JSON.parse(result);
	}
});
ajaxPading.init({
	name:'getZjfzList',
	dataType:'json',
	type:'post',
	async:true,
	handleData:function (result) {
		return JSON.parse(result);
	}
})
ajaxPading.init({
	name:"addZjfz",
	dataType:'json',
	type:'post',
	async:true,
	handleData:function (result) {
		return JSON.parse(result);
	}
});
ajaxPading.init({
	name:"college",
	dataType:'json',
	type:'post',
	async:true,
	handleData:function (result) {
		return JSON.parse(result);
	}
});
ajaxPading.init({
	name:'getFzxByZjfzpc',
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
			evaluateGroupBatch:masterPC,
			group:groupItem,
			type:curMasterType
		};
	for( i = 0 ; i < len ; i++ ){
		if(selects[i]){
			str.push(items[i].id);
		}
	}
	if(type === '删除选择'){
		url = deleteZjfz ;
		data.evaluates = str.join(',');
	}else{
		url = addZjfz;
		data.evaluates = str.join(',');
	}
	ajaxPading.send({
		url:url,
		data:data,
		onSuccess:function (result) {
			var meta = result.meta;
			if(meta.result == 100){
				renderList();
				renderSelectedList();
			}
			else{
				alert(meta.msg);
			}
		}
	},'addZjfz');
}
// 单个交换

function exchangeSingle(type,index,that){
	var item = that.state.items[index],
		url,
		data = {
			unifyCode:unifyCode,
			evaluateGroupBatch:masterPC,
			group:groupItem,
			type:curMasterType
		};
	if(type == '删除'){
		url = deleteZjfz;
		data.evaluates = item.id;
	}else{
		url = addZjfz;
		data.evaluates = item.id;
	}
	ajaxPading.send({
		url:url,
		data:data,
		onSuccess:function (result) {
			var meta = result.meta;
			if(meta.result == 100){
				renderList();
				renderSelectedList();
			}
			else{
				alert(meta.msg);
			}
		}
	},'addZjfz');
}

function turn(value){
	curPage = +value;
	var that = BluMUI.result.addList,
		PT = that.state.PT;
	PT.index = curPage;
	that.setState({
		PT:PT
	});
	renderList();
}
// 搜素课程名称
function search(value,type) {
	if(type === 0)
		curResearch = value;
	else
		curEevaluateName = value;
	var that = BluMUI.result.addList,
		PT = that.state.PT;
	PT.index = 1;
	that.setState({
		PT:PT
	});
	renderList();
}
// 选择专家种类

function selectMasterType(type) {
	curMasterType = type;
	if(curMasterType)
	var that = BluMUI.result.addList,
		PT = that.state.PT;
	PT.index = 1;
	that.setState({
		PT:PT
	});
	renderList();
}
// 选择学院

function selectCollege(item){
	curCollege = item.value!==undefined?item.value:item.name;
	var that = BluMUI.result.addList,
		PT = that.state.PT,
		college = that.state.college;
	PT.index = 1;

	college.value = item.name;
	that.setState({
		PT:PT,
		college:college
	});
	renderList();
}

//选择分组项

function  selectFzx(item) {
	groupItem = item.name;
	renderSelectedList();
}
// 渲染当前列表
function renderSelectedList() {
	ajaxPading.send({
		url:getZjfzList,
		data:{
			unifyCode:unifyCode,
			evaluateGroupBatch:masterPC,
			evaluateName:'',
			group:groupItem,
			count:1,
			page:1
		},
		onSuccess:function (result) {
			var meta = result.meta;
			if(meta.result == 100){
				var data = result.data,
					 evaluateGroupList = data.evaluateGroupList,
					 list = evaluateGroupList.length ===1 ?evaluateGroupList[0].evaluates :[],
					 i,
					 len,
					 selects = [],
					 items = [];
				for( i = 0 , len  = list.length ; i < len ; i++){
					items.push({
						masterName:list[i].xm,
						tel:list[i].lxdh,
						dw:list[i].dw,
						id:list[i].zjid,
						course:list[i].xkly
					});
					selects.push(false);
				}
				var that = BluMUI.result.deleteList;
				that.setState({items:items,selected:false,selects:selects});
			}else{
				alert(meta.msg);
			}
		}
	},'getZjfzList')
}
function renderList() {
	ajaxPading.send({
		url:getDfpzjList,
		data:{
			unifyCode:unifyCode,
			evaluateGroupBatch:masterPC,
			type:curMasterType,
			research:curMasterType===1?curResearch:curCollege,
			evaluateName:curEevaluateName,
			count:8,
			page:curPage
		},
		onSuccess:function (result) {
			var meta = result.meta;
			if(meta.result == 100){
				var data = result.data,
				  	 total = data.total,
					 totalPages = data.totalPages,
					 evaluateList = data.evaluateList,// 已分配
					 selects = [],
					 items = [],
					 len,
					 i;
				for(i = 0 , len = evaluateList.length ; i < len ; i++){
					items.push({
						masterName:evaluateList[i].xm,
						tel:evaluateList[i].lxdh,
						dw:evaluateList[i].dw,
						id:evaluateList[i].zjid,
						course:evaluateList[i].xkly
					});
					selects.push(false);
				}
				var that = BluMUI.result.addList,
					 PT = that.state.PT;

				PT.total = total;
				PT.sum = totalPages;
				that.setState({items:items,PT:PT,selected:false,selects:selects});
			}
		}
	},'getDfpzjList');
}
renderList();
renderSelectedList();
ajaxPading.send({
	url:getCollege,
	data:{
		unifyCode:unifyCode
	},
	onSuccess(result){
		var meta = result.meta;
		if(meta.result == 100){
			var data = result.data,
				 len = data.length,
				 items = [],
				 i;
			items.push({
				name:'全部',
				value:''
			});
			for( i = 0 ; i < len ; i++){
				items.push({
					name:data[i].kkxymc
				});
			}
			var that = BluMUI.result.addList,
				 college = that.state.college;
			college.items = items;
			that.setState({
				college:college
			});
		}else{
			alert(meta.msg);
		}
	}
},'college');
ajaxPading.send({
	url:getFzxByZjfzpc,
	data:{
		unifyCode:unifyCode,
		evaluateGroupBatch:masterPC
	},
	onSuccess:function (result) {
		var meta = result.meta;
		if(meta.result == 100){
			var data = result.data,
				 len = data.length,
				 items = [],
				 i;

			for( i = 0 ; i < len ; i++){
				items.push({
					name:data[i].fzx
				});
			}
			BluMUI.create({
				groupPC:groupPC,
				masterPC:masterPC,
				fzx:{
					id:'fzx',
					initName:'请选择',
					initvalue:data.length > 0?data[0].fzx:'',
					value:data.length > 0?data[0].fzx:'',
					inputName:'fzx',
					items:items,
					max:4,
					minbarH:8,
					optionH:28,
					callback:selectFzx
				}
			},'WpEditorTitle',doc.getElementById('wpEditorTitle'));
		}else{
			alert(meta.msg);
		}
	}
},'getFzxByZjfzpc')

BluMUI.create({
	id:'deleteList',
	items:[],
	name:"已选择专家",
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
	name:"选择专家",
	titleName:'加入分配',
	titleIcon:'../../imgs/systemManage/add.png',
	titleCallback:exchangeAll,
	operaions:[{
		name:'添加',
		callback:exchangeSingle
	}],
	college:{
		id:'college',
		initName:'请选择',
		initvalue:'',
		inputName:'college',
		items:[],
		max:4,
		minbarH:8,
		optionH:28,
		callback:selectCollege
	},
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
	},
	selectMasterType:selectMasterType,
	search:search
},'EditorList',doc.getElementById('addEditor'));
back.onclick = function () {
	window.location.href = 'zjfzgl.html';
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

