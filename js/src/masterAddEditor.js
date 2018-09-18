require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
require('es6-promise');
var BluMUI = require('../libs/blueMonUI.js'),
	ajaxPading = require('../libs/ajaxExpand.mini.min'),
	host = courseCenter.host,
	doc = document,
	query = parseHash(window.location.href),
	isEditor = query.isEditor || false,
	userId = query.masterId || '',
	unifyCode = getCookie('userId'),
	updateZj = host + 'updateZj',
	getJsLis	= host + 'getJsList',
	getZj = host +  'getZj',
	addZj = host +  'addZj',
	getCollege = host + 'getCollege',
	curSelectCollege = '',
	teacherName = '',
	addZjxn = host + 'addZjxn',
	loginURL = 'https://ids.cqupt.edu.cn/authserver/login?service=' + host + 'classList';

ajaxPading.init({
	name:'outMaster',
	type:'post',
	dataType:'json',
	async:true,
	handleData:function (result) {
		return JSON.parse(result);
	}
});
ajaxPading.init({
	name:'getInit',
	type:'post',
	dataType:'json',
	async:true,
	handleData:function (result) {
		return JSON.parse(result);
	}
});

ajaxPading.init({
	name:'getCollege',
	type:'post',
	dataType:'json',
	async:true,
	handleData:function (result) {
		return JSON.parse(result);
	}
})


// 添加校外专家
function addOutMaster(data,isEditor){
	data.unifyCode = unifyCode;
	if(isEditor)
		data.userId = userId;
	ajaxPading.send({
		url:isEditor?updateZj:addZj,
		data:data,
		onSuccess:function (result) {
			var meta = result.meta;
			if(meta.result == 100){
				if(isEditor){
					alert('修改成功!')
				}else {
					alert('添加成功!');
				}
			}else {
				alert(meta.msg);
			}

		},
		onFail:function () {
			alert('添加失败');
		}
	},'outMaster')

}
// 添加校内专家
function addMaster(data){
	ajaxPading.send({
		url:addZjxn,
		data:{
			unifyCode:unifyCode,
			userIds:data.join(',')
		},
		onSuccess:function(result){
			var meta = result.meta;
			if(meta.result == 100){
				alert('添加成功!');
			}else{
				alert(meta.msg);
			}
		}
	},'outMaster')
}
// 选择

function select(item){
	var name = item.name;
	teacherName = '';
	curSelectCollege = name;
	ajaxPading.send({
		data:{
			unifyCode:unifyCode,
			userName:'',
			department:curSelectCollege,
			page:1,
			count:8
		},
		url:getJsLis,
		onSuccess:function (result) {
			renderList(result, 1);
		}
	},'getInit')
}

//
function search(name){
	teacherName = name;
	ajaxPading.send({
		data:{
			unifyCode:unifyCode,
			userName:teacherName,
			department:curSelectCollege,
			page:1,
			count:8
		},
		url:getJsLis,
		onSuccess:function (result) {
			renderList(result, 1);
		}
	},'getInit')
}
function changePage(page) {
	ajaxPading.send({
		data:{
			unifyCode:unifyCode,
			userName:teacherName,
			department:curSelectCollege,
			page:page,
			count:8
		},
		url:getJsLis,
		onSuccess:function (result) {
			renderList(result, page);
		}
	},'getInit')
}
//

function renderList(result, index){
	var meta = result.meta;
	if( meta.result == 100) {
		var data = result.data,
			total = data.total,
			totalPages = data.totalPages,
			zjList = data.zjList,
			i,
			len = zjList.length,
			items = [];
		for( i = 0 ; i < len ; i++){
			items.push({
				name:zjList[i].xm,
				college:zjList[i].xymc,
				id:zjList[i].sfrzh,
				select:false
			});
		}
		var master = BluMUI.result.app.state.master;
		master.items = items;
		master.PT.index = index;
		master.PT.total = total;
		master.PT.sum = totalPages;
		console.log(index === 1);
		if(index === 1) {
			master.PT.start = 1;
		} else {
			master.PT.start = -1;
		}
		master.collegeOptions.initName = curSelectCollege;
		master.collegeOptions.initvalue = curSelectCollege;
		BluMUI.result.app.setState({
			master:master,
			select:false
		});
	}else if(meta.result == 303){
		confirm(result.meta.msg);
		window.location.href=loginURL;
	}else {
		alert(meta.msg);
	}
}
if(isEditor){
	ajaxPading.send({
		url: getZj,
		data:{
			unifyCode:unifyCode,
			userId:userId
		},
		onSuccess:function (result) {
			var meta = result.meta;
			if(meta.result == 100){
				var data = result.data;
				BluMUI.create({
					account:userId,
					isEditor:isEditor,
					outMaster:{
						masterName:data[0].xm,
						xb:data[0].xb,
						dw:data[0].dw,
						zc:data[0].zc,
						xk:data[0].xkly,
						uid:data[0].sfzh,
						tel:data[0].lxdh,
						bankId:data[0].yhkh,
						email:data[0].dzyx,
						bank:data[0].khyh,
						ajax:addOutMaster
					}
				},'AddEditor',doc.getElementById('form'));
			}else{
				alert(meta.msg);
			}
		}
	},'getInit');

}else{
	ajaxPading.send({
		url:getJsLis,
		data:{
			unifyCode:unifyCode,
			userName:teacherName,
			department:curSelectCollege,
			page:1,
			count:8
		},
		onSuccess:function (result) {
			var meta = result.meta;
			if( meta.result == 100){
				var data = result.data,
					 total = data.total,
					 totalPages = data.totalPages,
					 zjList = data.zjList,
					 i,
					 len = zjList.length,
					 items = [];
				for( i = 0 ; i < len ; i++){
					items.push({
						name:zjList[i].xm,
						college:zjList[i].xymc,
						id:zjList[i].sfrzh,
						select:false
					});
				}
			}else if(meta.result == 303){
				confirm(result.meta.msg);
				window.location.href=loginURL;
			}else {
				alert('服务器发生错误!');
			}
			ajaxPading.send({
				url:getCollege,
				data:{
					unifyCode:unifyCode
				},
				onSuccess:function (result) {
					var meta = result.meta;
					if(meta.result == 100){
						var data = result.data,
							colleges = [],
							i,
							len = data.length;
						for( i = 0 ; i < len ; i++){
							colleges.push({
								name:data[i].kkxymc
							});
						}
						BluMUI.create({
							id:'app',
							account:userId,
							isEditor:isEditor,
							master:{
								collegeOptions:{
									initName:'请选择',
									initvalue:'',
									inputName:'sexInput',
									items:colleges,
									max:len,
									minbarH:8,
									optionH:28,
									callback:select
								},
								items:items,
								ajax:addMaster,
								search:search,
								PT:{
									index:1,
									id:"tests",
									length:7,
									total:total,
									sum:totalPages,
									eachNum:8,
									start:1,
									lastName:'上一页',
									nextName:'下一页',
									bottomName:'尾页',
									topName:'首页',
									change:changePage
								}
							},
							outMaster:{
								ajax:addOutMaster
							}
						},'AddEditor',doc.getElementById('form'));
					}else if(meta.result == 303){
						confirm(result.meta.msg);
						window.location.href=loginURL;
					}else {
						alert(meta.msg);
					}
					console.log(result);
				}
			},'getCollege');
		}
	},'getInit');

}


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

