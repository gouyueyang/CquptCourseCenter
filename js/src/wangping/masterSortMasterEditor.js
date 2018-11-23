
import Alert from './../../util/alert.js';

require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
require('es6-promise');

var BluMUI = require('../../libs/wangping/masterSortMasterEditor.js'),
	ajaxPading = require('../../libs/ajaxExpand.mini.min'),
	host = courseCenter.host,
	doc = document,
	unifyCode = getCookie('userId'),
	addZjfzpc = host + 'addZjfzpc',
	getFzpc = host + 'getFzpc',
	getFzxByZjfzpc = host + 'getFzxByZjfzpc',
	query = parseHash(window.location.href);

ajaxPading.init({
	name:'addZjfzpc',
	type:'post',
	dataType:"json",
	async:true,
	handleData:function (result) {
		return JSON.parse(result);
	}
});
ajaxPading.init({
	name:'getFzxByZjfzpc',
	type:'post',
	dataType:"json",
	async:true,
	handleData:function (result) {
		return JSON.parse(result);
	}
});

function save(data){
	data.unifyCode = unifyCode;
	ajaxPading.send({
		url:addZjfzpc,
		data:data,
		onSuccess: function (result) {
			var meta = result.meta;
			if(meta.result == 100){
				ajaxPading.send({
					url:getFzxByZjfzpc,
					data:{
						unifyCode:unifyCode,
						evaluateGroupBatch: data.evaluateGroupBatch
					},
					onSuccess:function (result) {
						var meta = result.meta;
						if(meta.result == 100){
							var groupItem = result.data[0].fzx;
							window.location.href = './masterSortTeam.html?masterPC=' +
								data.evaluateGroupBatch + '&groupPC=' + data.groupBatch +
								'&groupItem=' + groupItem;
						}else{
							Alert.open({
								alertTip:meta.msg
							});
						}
					}
				},'getFzxByZjfzpc')
			} else {
				Alert.open({
					alertTip:meta.msg
				});
			}
		}
	},'addZjfzpc');
}

ajaxPading.send({
	data:{
		unifyCode: unifyCode
	},
	url:getFzpc,
	onSuccess: function(result){
		var meta = result.meta;
		if(meta.result === 100){
			var data = result.data,
				 items = [],
				 len = data.length,
				 i;
			for(i = 0 ; i < len ; i++){
				items.push({
					name: data[i].fzpc
				})
			}
			BluMUI.create({
				id:'app',
				items:[],
				drop: {
					initName:'请选择',
					inputName:'wpInput',
					items:items,
					max:4,
					minbarH:8,
					optionH:28
				},
				save:save
			},'App',doc.getElementById('form'));
		} else {
			Alert.open({
				alertTip:meta.msg
			});
		}
	}

},'addZjfzpc');

// (function () {
// 	var height;
// 	window.onload = function () {
// 		setTimeout(function () {
// 			height = document.documentElement.offsetHeight;
// 			if (window.frameElement) {
// 				window.frameElement.height = height
// 			}
// 		}, 0);
// 	};
// 	window.onresize = function () {
// 		setTimeout(function () {
// 			height = document.documentElement.offsetHeight;
// 			if (window.frameElement) {
// 				window.frameElement.height = height;
// 			}
// 		}, 0);
// 	};
// })();