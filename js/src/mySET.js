require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
require('es6-promise');
var BluMUI = require('../libs/blueMonUI.js'),
	 ajaxPading = require('../libs/ajaxExpand.mini.min'),
	 doc = document,
	 userId =  getCookie('userId'),
 	 host = courseCenter.host,
	 isLogin = false,
	 unifyCode = getCookie('userId'),
	 userName =  getCookie('userName'),
	 getVisit = host + 'classListVisit',
	 updateZjPassWord = host + 'updateZjPassWord',
	 getZj = host + 'getZj',
 	 updateZj = host + 'updateZj',
	 getMenu = host + 'getMenu';

// ajax
ajaxPading.init({
	name:"getMenu",
	dataType:'json',
	type:'post',
	async:true
});
ajaxPading.init({
	name:"getVisit",
	dataType:'json',
	type:'post',
	handleData:function(result){
		return JSON.parse(result);
	},
	async:true
});
ajaxPading.init({
	name:'updateZjPassWord',
	dataType:'json',
	type:'post',
	handleData:function(result){
		return JSON.parse(result);
	},
	async:true
});
function sendAjax(data,type){
	if(type === 1){
		data.unifyCode = unifyCode;
		data.userId = userId;
		console.log(data);
		ajaxPading.send({
			url:updateZjPassWord,
			data:data,
			onSuccess:function(result){
				var meta = result.meta;
				if(meta.result == 100){
					alert('修改成功!');
				}else{
					alert(meta.msg)
				}
				console.log(result);
			}
		},'updateZjPassWord')
	}else{
		data.unifyCode = unifyCode;

		console.log(data);
		ajaxPading.send({
			url:updateZj,
			data:data,
			onSuccess:function(result){
				var meta = result.meta;
				if(meta.result == 100){
					alert('修改成功!');
				}else{
					alert(meta.msg)
				}
				console.log(result);
			}
		},'updateZjPassWord');
	}
}
function changeMoulde(value) {
	console.log(value);
	switch (value){
		case '专家登录':
			window.location.href = '../courseMaster/login.html';
			break;
		case '登录':
			window.location.href = 'https://ids.cqupt.edu.cn/authserver/login?service=' + host + 'classList';
			break;
		case '我的课程':// userList
			window.location.href = '../classList.html';
			break;
		case '退出登录':// userList
			delCookie('userId');
			delCookie('userName');
			window.frames[0].location.href = host + 'logout';
			BluMUI.result.userHeader.setState({
				right:0,
				isLogin:false
			});
			break;
	}
}
function changeNav(value){
	var curIndex ;
	if(value === '个人资料'){
		curIndex = 0;
	}else{
		curIndex = 1;
	}
	BluMUI.result.myset.setState({
		curIndex:curIndex
	})
}
ajaxPading.send({
	url:getMenu,
	data:{
		unifyCode:unifyCode,
		module:1
	},
	onSuccess:function (result) {
		var result = JSON.parse(result),
			data = result.data,
			i,
			len,
			items = [];
		for ( i = 0 , len = data.length ; i < len ; i ++){
			items.push(data[i].cdmc);
		}
		if(unifyCode == '1'){
			isLogin = false;
		}else{
			isLogin = true;
		}
		ajaxPading.send({
			data:{
				unifyCode:unifyCode
			},
			url:getVisit,
			onSuccess:function (result) {
				var sum = 0,
					data = result.data,
					meta = result.meta;
				console.log(result);
				if(meta.result == 100){
					sum = data.fwl;
					BluMUI.create({
						id:'userHeader',
						isLogin:isLogin,// 是否登录
						loginNum:sum,// 平台的访问量
						loginNumText:'平台访问量:',
						userName:userName,// 登录的用户
						userList:['我的课程','退出登录'],// 用户列表功能
						loginText:'欢迎您，',// 登录后用户的user显示
						inLoginText:'欢迎来到课程中心!',// 未登录时的信息
						loginExtInf:'',// 登录后提醒用户的额外信息
						funcName:items,
						defaultFunc:['规章制度','平台使用指南'],
						moduleToURL:{// 模块到URL的映射，修复服务器上IE open()打开的窗口总是空白页
							'课程管理':{
								url:'./classManage/courseManagement.html',
								openType:'_blank'
							},
							'系统管理':{
								url:'./classManage/guizhangzhidu.html',
								openType:'_blank'
							},
							'教学团队管理':{
								url:'./classManage/teaching_team.html',
								openType:'_blank'
							},
							'平台使用指南':{
								url:'../pdf/platformUsageGuide.pdf',
								openType:'_blank'
							},
							'登录':{
								url:'https://ids.cqupt.edu.cn/authserver/login?service=' + host + 'classList',
								openType:'_self'
							},
							'专家登录': {
								url: '../courseMaster/login.html',
								openType:'_self'
							},
							'规章制度':{
								url:'./Regulations/regList.html?state=&title=&source=',
								openType:'_blank'
							}
						},
						callback:changeMoulde,
						extClass:''
					},'UserLoginState',document.getElementById('test'));
				}
			}
		},'getVisit')
	}
},'getMenu');
ajaxPading.send({
	url: getZj,
	data: {
		unifyCode: unifyCode,
		userId: userId
	},
	onSuccess: function (result) {
		if (result.code == 100) {
			let data = result.data,
				 that = BluMUI.result.myset;
			if (data[0]) {
				data = data[0];
				that.setState({
					name: data.xm,
					zc: data.zc,
					zy: data.xkly,
					email: data.dzyx,
					tel: data.lxdh,
					bank: data.yhkh,
					bankname: data.khyh,
					sex: data.xb
				});
			}
		}
	}
}, 'getVisit');
BluMUI.create({
	id:'myset',
	userId:userId,
	ajax:sendAjax
},'Set',doc.getElementById('mySETContent'));
BluMUI.create({
	id:'mySETNavList',
	items:['个人资料','密码修改'],
	extClass:'',
	index:1,
	callback:changeNav
},'NavList',doc.getElementById('Nav'));