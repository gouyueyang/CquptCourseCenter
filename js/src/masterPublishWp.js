require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
require('es6-promise');
var BluMUI = require('../libs/blueMonUI.js'),
	ajaxPading = require('../libs/ajaxExpand.mini.min'),
	host = courseCenter.host,
	doc = document,
	query = parseHash(window.location.href),
	wpId = query.wpId ,
	isEditor = query.isEditor,
	unifyCode = getCookie('userId'),
	reviewBriefList = host + 'reviewBriefList',
	getZjfzpc = host + 'getZjfzpc',
	getPjzbpc = host + 'getPjzbpc',
	uploadFiles = host + 'uploadFiles',
	createReview = host + 'createReview',
	editReview = host + 'editReview',
	queryReview = host + 'queryReview';

// ajax初始化
ajaxPading.init({
	name:'createReview',
	dataType:'form',
	handleData:function(result){
		return JSON.parse(result);
	},
	type:'post',
	async:true
});
ajaxPading.init({
	name:'queryReview',
	dataType:'json',
	handleData:function(result){
		return JSON.parse(result);
	},
	type:'post',
	async:true
});


ajaxPading.init({
	name:'file',
	dataType:'form',
	handleData:function(result){
		return JSON.parse(result);
	},
	type:'post',
	async:true
});

	// ajaxPading.init({
	// 	name:'getreviewBriefList',
	// 	dataType:'json',
	// 	handleData:function(result){
	// 		return JSON.parse(result);
	// 	},
	// 	type:'post',
	// 	async:true
	// });

// ajax提交数据

function ajaxSumbit(data, fileList){
	data.unifyCode = {
		 value:unifyCode
	};
	if(isEditor){
		let i,
			 len = fileList.length,
			 fileNames = [];
		for(i = 0; i < len; i++) {
			fileNames.push(fileList[i].filename);
		}
		data.ID = {
			value: wpId
		};
		data.fileNames = {
			value: fileNames.join(':')
		};
		ajaxPading.send({
			url:editReview,
			data:data,
			onSuccess:function(result){
				var meta = result.meta;
				if(meta.result == 100){
					alert('网评编辑成功!');
					window.location.href = 'wpgl.html';
				}else{
					alert(meta.msg);
				}
			}
		},'createReview');
	} else {
		ajaxPading.send({
			url:createReview,
			data:data,
			onSuccess:function(result){
				var meta = result.meta;
				if(meta.result == 100){
					alert('网评发起成功!');
					window.location.href = 'wpgl.html';
				}else{
					alert(meta.msg);
				}
			}
		},'createReview');
	}
}


//删除文件

function  deleteFile(item,index) {
		var fileList = this.state.fileList,
			 fileData = this.state.fileData;
		fileList.splice(index,1);
		fileData.splice(index,1);
		this.setState({
			fileList:fileList,
			fileData:fileData
		})
}

// 历史批次获取

// function getreviewBriefList(expGroup){
// 	ajaxPading.send({
// 		url:reviewBriefList,
// 		data:{
// 			userID:unifyCode,
// 			state:4,
// 			expGroup:expGroup
// 		},
// 		onSuccess:function (result) {
// 			var meta = result.meta;
// 			if(meta.result == 100){
// 				var list = result.data.list,
// 					 lspc = [],
// 					 len = list.length,
// 					 i;
// 				for( i = 0 ; i < len ; i++){
// 					lspc.push({
// 						name:list[i].wppc
// 					});
// 				}
// 			}else if(meta.result == 101){
// 				var lspc = [];
// 			}
//
// 			var that = BluMUI.result.app,
// 				lspcs = that.state.lspc;
//
// 			lspcs.options.items = lspc;
// 			lspcs.value = '';
// 			that.setState({
// 				lspc:lspcs
// 			});
// 		}
// 	},'getreviewBriefList')
// }
// 选择专家批次,对应历史批次

function choiceZJ(item){
	// getreviewBriefList(item);
}
if(isEditor){
	ajaxPading.send({
		url:queryReview,
		data:{
			unifyCode:unifyCode,
			ID:wpId
		},
		onSuccess:function(result){
			var meta = result.meta,
				data = result.data,
				edit = data.edit;
			if(meta.result == 100){
				var {
					wppc,
					wplb,
					zbpc,
					kssj,
					jssj,
					zjfzpc,
					bz,
					files
				} = data;

			}else if(meta.result == 303 ){
				window.location.href=loginURL;
			}else if(meta.result !=101){
				alert(meta.msg);
			}
			BluMUI.create({
				id:'app',
				pc:wppc || '',
				startTime:kssj,
				endTime:jssj,
				zb:zbpc,
				zj:zjfzpc,
				bz:bz,
				lb:wplb,
				files:files,
				lbOptions:{
					initName:wplb || '请选择',
					initvalue:wplb || '',
					inputName:'lbInput',
					items:[{
						name:'专家评价'
					},{
						name:'职能部门评价'
					}],
					max:4,
					minbarH:8,
					optionH:28,
				},
				zbOptions:{
					initName:zbpc || '请选择',
					initvalue:zbpc || '',
					inputName:'zbInput',
					items:[],
					max:4,
					minbarH:8,
					optionH:28,
				},
				zjOptions:{
					initName:zjfzpc || '请选择',
					initvalue:'',
					inputName:'zjInput',
					items:[],
					max:4,
					minbarH:8,
					optionH:28
				},
				lspcOptions:{
					initName:'请选择',
					initvalue:'',
					inputName:'zbInput',
					items:[],
					max:4,
					minbarH:8,
					optionH:28,
				},
				ajax:ajaxSumbit,
				choiceZJ:choiceZJ,
				edit:edit,
				isEditor: true,
				deleteFile:deleteFile
			},'Form',doc.getElementById('form'));
			// if(zjfzpc){
			// 	getreviewBriefList(zjfzpc);
			// }
			ajaxPading.send({
				url:getPjzbpc,
				data:{
					unifyCode:unifyCode
				},
				onSuccess:function (result) {
					var meta = result.meta;
					if(meta.result == 100){
						var data = result.data,
							len = data.length,
							i,
							zb = [];
						for(  i = 0 ; i < len ; i++){
							zb.push({
								name:data[i].zbpc
							});
						}
						var that = BluMUI.result.app,
							zbs = that.state.zb;
						zbs.options.items = zb;
						BluMUI.result.app.setState({
							zb:zbs
						});
					}else {
						alert(meta.msg);
					}
				}
			},'queryReview');
			ajaxPading.send({
				url:getZjfzpc,
				data:{
					unifyCode:unifyCode
				},
				onSuccess:function(result){
					var meta = result.meta;
					if(meta.result == 100 ){
						var data = result.data,
							len = data.length,
							i,
							zj = [];
						for( i = 0 ; i < len ; i++){
							zj.push({
								name:data[i].zjfzpc
							});
						}
						var that = BluMUI.result.app,
							zjs = that.state.zj;
						zjs.options.items = zj;
						BluMUI.result.app.setState({
							zj:zjs
						});
					}else{
						alert(meta.msg);
					}
				}
			},'file');
		}
	},'queryReview');
}else{
	BluMUI.create({
		id:'app',
		lbOptions:{
			initName:'请选择',
			initvalue:'',
			inputName:'lbInput',
			items:[{
				name:'专家评价'
			},{
				name:'职能部门评价'
			}],
			max:4,
			minbarH:8,
			optionH:28,
		},
		zbOptions:{
			initName:'请选择',
			initvalue:'',
			inputName:'zbInput',
			items:[],
			max:4,
			minbarH:8,
			optionH:28,
		},
		zjOptions:{
			initName: '请选择',
			initvalue:'',
			inputName:'zjInput',
			items:[],
			max:4,
			minbarH:8,
			optionH:28
		},
		lspcOptions:{
			initName:'请选择',
			initvalue:'',
			inputName:'zbInput',
			items:[],
			max:4,
			minbarH:8,
			optionH:28,
		},
		deleteFile:deleteFile,
		ajax:ajaxSumbit,
		choiceZJ:choiceZJ,
		isEditor: false,
		edit:true
	},'Form',doc.getElementById('form'));
	ajaxPading.send({
		url:getPjzbpc,
		data:{
			unifyCode:unifyCode
		},
		onSuccess:function (result) {
			var meta = result.meta;
			if(meta.result == 100){
				var data = result.data,
					len = data.length,
					i,
					zb = [];
				for(  i = 0 ; i < len ; i++){
					zb.push({
						name:data[i].zbpc
					});
				}
				var that = BluMUI.result.app,
					zbs = that.state.zb;
				zbs.options.items = zb;
				BluMUI.result.app.setState({
					zb:zbs
				});
			}else {
				alert(meta.msg);
			}
		}
	},'queryReview');
	ajaxPading.send({
		url:getZjfzpc,
		data:{
			unifyCode:unifyCode
		},
		onSuccess:function(result){
			var meta = result.meta;
			if(meta.result == 100 ){
				var data = result.data,
					len = data.length,
					i,
					zj = [];
				for( i = 0 ; i < len ; i++){
					zj.push({
						name:data[i].zjfzpc
					});
				}
				var that = BluMUI.result.app,
					zjs = that.state.zj;
				zjs.options.items = zj;
				BluMUI.result.app.setState({
					zj:zjs
				});
			}else{
				alert(meta.msg);
			}
		}
	},'file');
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

