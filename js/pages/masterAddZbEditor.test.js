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
	query = parseHash(window.location.href),
	isEditor = query.isEditor|| false,
	type = query.type || 0,
	unifyCode = getCookie('userId'),
	indexBatch = query.indexBatch || '',
	addPjzb = host + 'addPjzb';
ajaxPading.init({
	name:"addPjzb",
	dataType:'json',
	type:'post',
	async:true,
	handleData:function (result) {
		return JSON.parse(result);
	}
});

function ajax(data,that){
	data.unifyCode = unifyCode;
	ajaxPading.send({
		url:addPjzb,
		data:data,
		onSuccess:function (result) {
			var meta = result.meta;
			if(meta.result == 100){
				if(isEditor){
					alert('编辑成功!')
				}else{
					alert('添加成功!');
				}
				window.location.href = './zbpcgl.html';
			}
		}
	},"addPjzb")
}
BluMUI.create({
	isEditor:isEditor,// true-编辑,false-添加
	select:type,// 0-按照课程, 1 - 通用
	indexBatch:indexBatch,// 分组批次
	callback:ajax
},'AddZbEditor',doc.getElementById('test'));
