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
	groupBatch = query.groupBatch || '',
	isEditor = query.isEditor || false,
	deleteFzx = host + 'deleteFzx',
	getFzList = host + 'getFzList',
	addFz = host + 'addFz';

ajaxPading.init({
	name:'addFz',
	type:'post',
	dataType:"json",
	async:true,
	handleData:function (result) {
		return JSON.parse(result);
	}
});
ajaxPading.init({
	name:'deleteFzx',
	type:'post',
	dataType:"json",
	async:true,
	handleData:function (result) {
		return JSON.parse(result);
	}
});
ajaxPading.init({
	name:'getFzList',
	type:'post',
	dataType:"json",
	async:true,
	handleData:function (result) {
		return JSON.parse(result);
	}
});
if(isEditor){
	ajaxPading.send({
		data: {
			unifyCode: unifyCode,
			groupBatch: groupBatch,
			page:1,
			count:1
		},
		url:getFzList,
		onSuccess:function(result){
			var meta = result.meta;
			if(meta.result == 100){
				var data =result.data,
					groups = data.groupList[0].groups,
					items = [],
					fzx = '';
				for(var i = 0 , len = groups.length ; i < len ; i++){
					items.push({name:groups[i].fzx});
					if (i === len - 1) {
					 fzx += groups[i].fzx;
					} else {
						fzx += groups[i].fzx + ',';
					}
				}
				BluMUI.result.app.setState({
					items:items,
					fzx: fzx
				});
				console.log(items);
			}else{
				console.log(meta.msg);
			}
		},
		onFail:function () {

		}
	},'getFzList');
}

function Delete(item,index){
	var that = BluMUI.result.app,
		items = that.state.items;
	// if(isEditor){
	// 	ajaxPading.send({
	// 		url:deleteFzx,
	// 		data:{
	// 			unifyCode:unifyCode,
	// 			groupBatch:groupBatch,
	// 			group:items[index].name
	// 		},
	// 		onSuccess:function(result){
	// 			var meta = result.meta;
	// 			if(meta.result == 100 ){
	// 				items.splice(index,1);
	// 				that.setState({
	// 					items:items
	// 				});
	// 			}else{
	// 				alert(meta.msg);
	// 			}
	// 		}
	// 	},'deleteFzx');
	// }else{
    //
	// }
	items.splice(index,1);
	that.setState({
		items:items
	});

}
function save(value,pc){
	ajaxPading.send({
		url:addFz,
		data:{
			unifyCode:unifyCode,
			groupBatch:pc,
			groups:value||''
		},
		onSuccess:function(result){
			var meta = result.meta;
			if(meta.result == 100){
				alert('保存成功!');
				window.location.href = 'fzgl.html';
			}else{
				alert(meta.msg);
			}
		},
		onFail:function(){
			alert('服务器发生错误!');
		}
	},'addFz');
}

BluMUI.create({
	id:'app',
	callback:Delete,
	save:save,
	pc:groupBatch,
	items:[],
	isEditor:isEditor
},'App',doc.getElementById('form'));