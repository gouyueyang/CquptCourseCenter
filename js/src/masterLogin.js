/**
 * Created by swull on 2017/7/13.
 * 入口文件
 */

require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
require('es6-promise');
var BluMUI = require('../libs/blueMonUI.js'),
	 ajaxPading = require('../libs/ajaxExpand.mini.min'),
	 host = courseCenter.host,
	classListZJ = host + 'classListZJ';
ajaxPading.init({
	name:'login',
	dataType:'json',
	type:'post',
	handleData:function(result){
		return JSON.parse(result);
	},
	async:true
});
function login(data) {
	ajaxPading.send({
		url:classListZJ,
		data:data,
		onSuccess:function(result){
			var meta = result.meta;
			if(meta.result == 100){
				window.location.href = '../classList.jsp';
			}else{
				alert(meta.msg);
			}
		}
	},'login')
}
BluMUI.create({
	ajax:login,
	host:host
},'Login',document.getElementById('Login'));

