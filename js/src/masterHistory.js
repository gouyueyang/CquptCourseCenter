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
	 host = courseCenter.host,
	 userId = getCookie('userId'),
	 search = doc.getElementById('search'),
	 searchBtn = doc.getElementById('searchBtn'),
	 curPage = 1,
	 curReviewId = '',
	 curCourseName = '',
	 searchTpye = '课程名称',
	 reviewBriefList = host + 'reviewBriefList',
	 expReviewHistory = host + 'expReviewHistory';

ajaxPading.init({
	name:'expReviewHistory',
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
function changeBriefList(item) {
	searchTpye = item.name;
}

// 选择网评批次

function selectWP(item) {
	curReviewId = item.id;
	renderList();
}

// 翻页

function turn(value) {
	curPage = +value;
	renderList();
}

// 渲染列表

function  renderList() {
	ajaxPading.send({
		url:expReviewHistory,
		data:{
			expID:userId,
			reviewID:curReviewId,
			courseName:curCourseName,
			page:1,
			count:10
		},
		onSuccess:function (result) {
			var meta = result.meta;
			if(meta.result == 100){
				var data= result.data,
					 total = data.total,
					 totalPages = data.totalPages,
					 list = data.list,
					 len = list.length,
					 items = [],
					 i;
				for( i = 0 ; i < len ; i++){
					items.push({
						reviewId:list[i].reviewID,
						pc:list[i].reviewName,
						mc:list[i].courseName,
						tj:list[i].start,
						js:list[i].end,
						pf:list[i].score,
						pj:list[i].evaluate,
						zt:'',
						id:list[i].courseNo
					});
				}
				var that = BluMUI.result.list,
					 PT = BluMUI.result.PT;
				PT.setState({
					sum:totalPages,
					index:curPage,
					total:total
				});
				console.log(items);
				that.setState({
					items:items
				});
			}
		}
	},'expReviewHistory');
}

// 渲染网评批次


function renderPC() {
	ajaxPading.send({
		url:reviewBriefList,
		data:{
			userID:userId,
			state:1,
			expGroup:''
		},
		onSuccess:function (result) {
			var meta = result.meta;
			if(meta.result == 100){
				var list = result.data.list,
					 i,
					 len = list.length,
					 items = [];
				for( i = 0 ; i < len ; i++){
					items.push({
						name:list[i].wppc,
						id:list[i].id
					});
				}
				BluMUI.create({
					initName:'请选择',
					inputName:'wpInput',
					items:items,
					max:4,
					minbarH:8,
					optionH:28,
					callback:selectWP
				},'Drop',doc.getElementById('wpSelect'));
			}
		}
	},'reviewBriefList')
}
renderPC();
renderList();
searchBtn.onclick = function (e) {
	var value = search.value;
	curCourseName = value;
	renderList();
};
search.onkeydown = function (e) {
	var ketCode = e.keyCode;
	if(ketCode === 13){
		var value = search.value;
		curCourseName = value;
		renderList();
	}
};
BluMUI.create({
	id:'list',
	items:[]
},'List',doc.getElementById('list'));
BluMUI.create({
	id:'PT',
	index:1,
	length:7,
	sum:0,
	total:0,
	start:1,
	lastName:'上一页',
	nextName:'下一页',
	bottomName:'尾页',
	topName:'首页',
	change:turn
},'PT',document.getElementById('Pt'));