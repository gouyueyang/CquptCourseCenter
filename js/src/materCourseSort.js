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
	unifyCode = getCookie('userId'),
	query = parseHash(window.location.href),
	fzx = query.fzx,
	back = doc.getElementById('back'),
	getKcfzList = host + 'getKcfzList',
	wppc = query.wppc ,
	wppcId = query.wppcId,
	deleteKcfz = host + 'deleteKcfz',
	addKcfz = host + 'addKcfz',
	getDfpkcList = host + 'getDfpkcList',
	getCollege = host + 'getCollege',
	getCourseDepartment = host + 'getCourseDepartment',
	curCollege = '',
	curCourseDepartment = '',
	curCourseName = '',
	curPage = 1,
	curSelectPage = 1;

//初始化ajax
ajaxPading.init({
	name:"getCollege",
	dataType:'json',
	type:'post',
	async:true,
	handleData:function (result) {
		return JSON.parse(result);
	}
});

ajaxPading.init({
	name:"getCourseDepartment",
	dataType:'json',
	type:'post',
	async:true,
	handleData:function (result) {
		return JSON.parse(result);
	}
});
ajaxPading.init({
	name:"getDfpkcList",
	dataType:'json',
	type:'post',
	async:true,
	handleData:function (result) {
		return JSON.parse(result);
	}
});
ajaxPading.init({
	name:"addKcfz",
	dataType:'json',
	type:'post',
	async:true,
	handleData:function (result) {
		return JSON.parse(result);
	}
});
ajaxPading.init({
	name:"getKcfzList",
	dataType:'json',
	type:'post',
	async:true,
	handleData:function (result) {
		return JSON.parse(result);
	}
});


// 全部交换
function exchangeAll(type,that) {
	var another,
		 url = '',
		 courseNos = [];
	if(type == '删除选择' ){
		another =  BluMUI.result.addList;
		url = deleteKcfz;
	}else if(type == '加入分组'){
		another =  BluMUI.result.deleteList;
		url = addKcfz;
	}
	var anotherItems = another.state.items,
		 anotherSelects = another.state.selects,
		 curItems = that.state.items,
		 curSelects = that.state.selects;
	curItems.forEach(function(item,index){
		if(curSelects[index])
		courseNos.push(item.courseId);
	});
	if(courseNos.length>0){
		ajaxPading.send({
			url:url,
			data:{
				unifyCode:unifyCode,
				reviewId:wppcId,
				group:fzx,
				courseNos:courseNos.join(',')
			},
			onSuccess:function (result) {
				var meta = result.meta;
				if(meta.result == 100){
					getList({
						college:curCollege,
						courseDepartment:curCourseDepartment,
						courseName:curCourseName,
						page:curPage
					});
					getSelectedList();
				}
			}
		},'addKcfz');
	}

}
// 单个交换

function exchangeSingle(type,index,that){
	var another,
		 url,
		 courseNos = [];
	if(type === '删除' ){
		another =  BluMUI.result.addList;
		url = deleteKcfz;
	}else if(type === '添加'){
		another =  BluMUI.result.deleteList;
		url = addKcfz;
	}
	var anotherItems = another.state.items,
		anotherSelects = another.state.selects,
		curItems = that.state.items,
		curSelects = that.state.selects,
		addItems = curItems.splice(index,1),
		addSelects= curSelects.splice(index,1),
		newItems = addItems.concat(anotherItems),
		newSelects = addSelects.concat(anotherSelects);
	if(newItems.length > 8){
		newItems.pop();
		newSelects.pop();
	}

	courseNos.push(addItems[0].courseId);

	ajaxPading.send({
		url:url,
		data:{
			unifyCode:unifyCode,
			reviewId:wppcId,
			group:fzx,
			courseNos:courseNos.join(',')
		},
		onSuccess:function (result) {
			var meta = result.meta;
			if(meta.result == 100){
					getList({
						college:curCollege,
						courseDepartment:curCourseDepartment,
						courseName:curCourseName,
						page:curPage
					});
					getSelectedList();

			}
		}
	},'addKcfz');
}

// 选择学院
function selectCollege(item){
	curCollege = item.value!==undefined?item.value:item.name;
	var that = BluMUI.result.addList,
		 college = that.state.college,
		 PT = that.state.PT;
	PT.index = 1;
	college.value = item.name;
	curPage = 1;
	that.setState({
		college:college,
		PT:PT
	});
	curCourseDepartment = '';
	ajaxPading.send({
		url:getCourseDepartment,
		data:{
			unifyCode:unifyCode,
			college:curCollege
		},
		onSuccess:function(result){
			var meta = result.meta;
			if(meta.result == 100){
				var data = result.data,
					len = data.length,
					items = [],
					i;
				items.push({
					name:'全选',
					value:''
				});
				for( i = 0 ; i < len ; i++){
					items.push({name:data[i].jysmc});
				}
				var that = BluMUI.result.addList,
					center = that.state.center;
				center.items = items;
				center.value = '';
				that.setState({
					center:center
				});
			}
		}
	},'getCourseDepartment');
	getList({
		college:curCollege,
		courseDepartment:curCourseDepartment,
		courseName:curCourseName,
		page:curPage
	});
}

//选择系部中心
function selectCourseDepartment(item){
	curCourseDepartment = item.value!==undefined?item.value:item.name;
	var that = BluMUI.result.addList,
		 center = that.state.center,
		 PT = that.state.PT;
	PT.index = 1;
	curPage = 1;
	center.value = item.name;
	that.setState({
		center:center,
		PT:PT
	});
	getList({
		college:curCollege,
		courseDepartment:curCourseDepartment,
		courseName:curCourseName,
		page:curPage
	});
}

// 翻页

function turn(value){
	curPage = +value;
	var that = BluMUI.result.addList,
		PT = that.state.PT;
	PT.index = curPage;
	that.setState({
		PT:PT
	});
	getList({
		college:curCollege,
		courseDepartment:curCourseDepartment,
		courseName:curCourseName,
		page:curPage
	});
}

function selectTurn(value){
	curSelectPage = +value;
	getSelectedList();
}
// 搜素

function search(value){
	curCourseName = value;
	curPage = 1;
	getList({
		college:curCollege,
		courseDepartment:curCourseDepartment,
		courseName:curCourseName,
		page:curPage
	});
}

BluMUI.create({
	courseName:wppc,
	teamName:fzx
},'WpEditorTitle',doc.getElementById('wpEditorTitle'));
BluMUI.create({
	id:'deleteList',
	name:'已分配课程',
	items:[],
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
	PT:{
		index:1,
		id:"tests",// 字符串,必选，这个组件的ID
		length:7,// 数字,必选,显示点击块的最大数目
		sum:0,// 数字,必选,总页数
		total:0,
		start:1,// 数字,必选,第一个点击块对应的页数
		lastName:'上一页',// 字符串,必选，上一页按钮名字
		nextName:'下一页',// 字符串,必选，下一页按钮名字
		bottomName:'尾页',// 字符串,必选，末尾按钮名字
		topName:'首页',// 字符串,必选，首页按钮名字
		change:turn
	},
	name:'待分配课程',
	items:[],
	titleName:'加入分组',
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
			max:8,
			minbarH:8,
			optionH:28,
			callback:selectCollege
	},
	center:{
			id:'center',
			initName:'请选择',
			initvalue:'',
			inputName:'center',
			items:[],
			max:8,
			minbarH:8,
			optionH:28,
		   callback:selectCourseDepartment
	},
	search:search
},'EditorList',doc.getElementById('addEditor'));

// 初始化
ajaxPading.send({
	url:getCollege,
	data:{
		unifyCode:unifyCode
	},
	onSuccess:function(result){
		var meta = result.meta;
		if(meta.result == 100){
			var data = result.data,
				len = data.length,
				items = [],
				i;
			items.push({
				name:'全选',
				value:''
			});
			for( i = 0 ; i < len ; i++){
				items.push({name:data[i].kkxymc});
			}
			var that = BluMUI.result.addList,
				 college = that.state.college;
			college.items = items;
			that.setState({
				college:college
			});
		}
	}
},'getCollege');
function getSelectedList() {
	ajaxPading.send({
		url:getKcfzList,
		data:{
			unifyCode:unifyCode,
			reviewBatch:wppc,
			courseName:'',
			group:fzx,
			count:8,
			page:curSelectPage
		},
		onSuccess:function(result ){
			var meta = result.meta;
			if(meta.result == 100){
				var data = result.data,
					total = data.total,
					totalPage = data.totalPages,
					courseGroupList = data.courseGroupList[0],
					list = courseGroupList.courseList?courseGroupList.courseList:null,
					len = list?list.length:0,
					items  = [],
					selects = [],
					i;
				for( i = 0 ; i < len ; i++){
					items.push({
						courseName:list[i].kcmc,
						courseId:list[i].kcbh,
						college:list[i].kkxymc,
						center:list[i].jysmc
					})
					selects.push(false);
				}
				var that = BluMUI.result.deleteList;
				that.setState({
					items:items,
					selected:false,
					selects:selects
				});
			}
		}
	},'getKcfzList');
}
getSelectedList();
function getList(data) {
	data.unifyCode = unifyCode;
	data.reviewId = wppcId;
	data.count = 8;
	ajaxPading.send({
		url:getDfpkcList,
		data:data,
		onSuccess:function (result) {
			var meta = result.meta;
			if(meta.result == 100){
				var data = result.data,
					 total = data.total,
					 totalPage = data.totalPages,
					 list = data.courseList?data.courseList:null,
					 len = list?list.length:0,
					 items  = [],
					 selects = [],
					 i;
				for( i = 0 ; i < len ; i++){
					items.push({
						courseName:list[i].kcmc,
						courseId:list[i].kcbh,
						college:list[i].kkxymc,
						center:list[i].jysmc
					});
					selects.push(false);
				}
				var that = BluMUI.result.addList,
					 PT = that.state.PT;
				PT.total = total;
				PT.sum = totalPage;
				that.setState({
					PT:PT,
					items:items,
					selected:false,
					selects:selects
				});
			}
		}
	},'getDfpkcList');
}
getList({
	college:curCollege,
	courseDepartment:curCourseDepartment,
	courseName:curCourseName,
	page:curPage
});

back.onclick = function () {
	window.location.href = 'kcfzgl.html';
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

