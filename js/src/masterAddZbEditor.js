require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
require('es6-promise');
var doc = document,
	BluMUI = require('../libs/blueMonUI.js'),
	ajaxPading = require('../libs/ajaxExpand.mini.min'),
	host = courseCenter.host,
	query = parseHash(window.location.href),
	isEditor = query.isEditor|| false,
	type = +query.type || 0,
	unifyCode = getCookie('userId'),
	indexBatch = query.indexBatch || '',
	addPjzb = host + 'addPjzb',
	getPjzbList = host + 'getPjzbList';
	ajaxPading.init({
		name:"addPjzb1",
		dataType:'json',
		type:'post',
		async:true,
		handleData:function (result) {
			return JSON.parse(result);
		}
	});
ajaxPading.init({
	name:"addPjzb2",
	dataType:'json',
	type:'post',
	async:true,
	handleData:function (result) {
		return JSON.parse(result);
	}
});

function ajax(datas){
	var data = datas[0],
		 data1 = datas[1];
	data.unifyCode = unifyCode;
	if(data1) {
		data1.unifyCode = unifyCode;
		var sendLLData = function () {
			var that = this;
			ajaxPading.send({
				url:addPjzb,
				data:data,
				onSuccess:function (result) {
					var meta = result.meta;
					that.finish(meta);
				}
			},"addPjzb1")
		};
		var sendSJData = function() {
			var that = this;
			ajaxPading.send({
				url:addPjzb,
				data:data1,
				onSuccess:function (result) {
					var meta = result.meta;
					that.finish(meta);
				}
			},"addPjzb2")
		};
		taskManager(sendLLData, sendSJData).to(function (meta1, meta2) {
			if(meta1.result == 100 && meta2.result == 100){
				if(isEditor){
					alert('编辑成功!')
				}else{
					alert('添加成功!');
				}
				window.location.href = './pjzbgl.html';
			} else {
				alert(meta.msg);
			}
		}).run();
	} else {
		ajaxPading.send({
			url:addPjzb,
			data:data,
			onSuccess:function (result) {
				var meta = result.meta,
					courseType = data.courseType;
				if(meta.result == 100){
					if(isEditor){
						if (courseType === 1) {
							alert('理论课指标编辑成功!');
						} else {
							alert('实训课指标编辑成功!')
						}
					}else{
						if (courseType === 1) {
							alert('理论课指标添加成功!');
						} else {
							alert('实训课指标添加成功!')
						}
					}
					window.location.href= './pjzbgl.html';
				} else {
					alert(meta.msg);
				}
			}
		},"addPjzb1")
	}

}
if(isEditor) {
	ajaxPading.send({
		url: getPjzbList,
		data: {
			unifyCode:unifyCode,
			indexBatch:indexBatch,
			count:1,
			page:1
		},
		onSuccess:function(result) {
			if (result.meta.result == 100){
				var data = result.data,
					 lists = data.indexList[0].indexs,
					 items = [];
				if(data.indexList[0].zblb==='按课程栏目') {
					items = [[], []];
					lists.forEach((item)=>{
						if(item.kclx === '理论课/实验课'){
							items[0].push({
								index: item.zbx,
								fz: item.fz,
								bzms:item.pjbz
							});
						} else {
							items[1].push({
								index: item.zbx,
								fz: item.fz,
								bzms:item.pjbz
							});
						}
					});
				} else {
					lists.forEach((item)=>{
							items.push({
								index: item.zbx,
								fz: item.fz,
								bzms:item.pjbz
							});
					});
				}
			}
			BluMUI.create({
				items:items,
				isEditor:isEditor,
				select:type,
				indexBatch:indexBatch,
				callback:ajax
			},'AddZbEditor',doc.getElementById('test'));
			window.frameElement.height = 780;
		}
	},'addPjzb1');
} else {
	BluMUI.create({
		isEditor:isEditor,// true-编辑,false-添加
		select:type,// 0-按照课程, 1 - 通用
		indexBatch:indexBatch,// 分组批次
		callback:ajax
	},'AddZbEditor',doc.getElementById('test'));
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