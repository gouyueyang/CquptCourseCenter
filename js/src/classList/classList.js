require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
require('es6-promise');

var BluMUI = require('../../libs/classList/classList'),
	ajaxPading = require('../../libs/ajaxExpand.mini.min'),
	unifyCode = getCookie('userId'),
	userName =  getCookie('userName'),
	count = 12,
	isLogin = true,
	curSelected=null,
	iframe = document.getElementsByTagName('iframe')[0],
	host = courseCenter.host,
	// topURL = 'http://jwzx.cqupt.edu.cn/jwzxtmp/pyfa/kctpImg/',
	topURL = 'http://jwzx.cqupt.edu.cn/pyfa/kctpImg/',
	picPath = host + 'upload/PIC/',
	getMenu = host + 'getMenu',
	getMoRenKcURL= host + "getMoRenKc",// 获取默认信息
	getAllJctskURL= host + 'getAllJctsk',// 获取交叉通识课
	getAllKcByKkdwURL= host + 'getAllKcByKkdw',// 通过教研室获取课程信息
	getAllKkdwZyXyURL= host + 'getAllKkdwZyXy',// 获取导航栏信息
	getSelectKcURL= host + 'selectKc',
	getVisit = host + 'classListVisit',
	getAllKcByZyhURL= host + 'getAllKcByZyh';// 通过专业号获取课程信息
// 搜索
var searchAjax=function (value,type) {
	ajaxPading.send({
		data:{
			unifyCode:unifyCode,
			sslx:type,
			ssnr:value,
			count:count,
			page:1
		},
		url:getSelectKcURL,
		onSuccess:function (result) {
			var data=JSON.parse(result).data;
			curSelected={
				type:type,
				ssnr:value,
				belong:'搜索',
				index:1
			}
			BluMUI.result.tests.setState({
				index:1,
				start:1,
				isUpdate:false,
				total: data.total,
				sum:data.totalPages,
				inputValue:1
			});
			BluMUI.result.classNavList.setState({
				index:0,
				items:['课程列表']
			});
			parseClassInf(data.courseList);
		}
	},'getListInf');
}


// 解析课程列表信息

function subString(str, len, hasDot) {
	var newLength = 0;
	var newStr = "";
	var chineseRegex = /[^\x00-\xff]/g;
	var singleChar = "";
	var strLength = str.replace(chineseRegex,"**").length;
	for(var i = 0;i < strLength;i++)
	{
		singleChar = str.charAt(i).toString();
		if(singleChar.match(chineseRegex) != null)
		{
			newLength += 2;
		}
		else
		{
			newLength++;
		}
		if(newLength > len)
		{
			break;
		}
		newStr += singleChar;
	}

	if(hasDot && strLength > len)
	{
		newStr += "...";
	}
	return newStr;
}
function handleLongText(data){
	if(data) {
		if(typeof data !== 'string'){
			var str = data.join(' ');
		}else {
			str = data;
		}
		var result = subString(str, 50, true);
		return result;
	}
}
//解析课程信息
var parseClassInf=function (data) {
	var result=data,
		classInf=[],
		item,
		i,
		len;
	for(i=0,len=result.length;i<len;i++){
		item=ajaxPading.parse(result[i],{},[
			['tpurl','img'],
			['kcmc','title'],
			['kcjs','desc'],
			['kcpf','starNum'],
			['xs','stuTime'],
			['jysmc','teamName'],
			['kkxymc','kkxy'],
			['xf','score'],
			['kcbh','classId'],
			['major','major',handleLongText]
		]);
		item.img = item.img !=="" ?(picPath + item.img):'../imgs/home-course/default.png';
		classInf.push(item);
	}
	BluMUI.create({
		id:'classInf',
		extClass:'',
		num:5,
		items:classInf
	},'ClassInfBox',document.getElementById('class_inf'));
};

// 解析开课单位 parrern=['kkxymc','jysmc','jysh]
var setItem=function(Item,pattern,belong){
	var i,
		result=[],
		college=[],
		jys={},
		len;
	for(i=0,len = Item.length;i<len;i++){
		if(!jys[Item[i][pattern[0]]]) {
			jys[Item[i][pattern[0]]] = [];
			college.push(Item[i][pattern[0]]);
		}
		jys[Item[i][pattern[0]]].push({name:Item[i][pattern[1]],card:Item[i][pattern[2]]});
	}
	for(i=0,len=college.length;i<len;i++){
		var item={
			name:college[i],
			ileftLogo:'../imgs/classListInfShow/item_logo.png',
			nleftLogo:'../imgs/classListInfShow/item_logo.png',
			nameStyle:'item-2',
			selectedClass:'item-2-selected',
			selected:0
		};
		var j,
			k,
			marjorItem=[];
		for(j=0,k=jys[college[i]].length;j<k;j++){
			marjorItem.push({
					name: jys[college[i]][j].name,
					selected: 0,
					selectedClass:'item-3-selected',
					card:jys[college[i]][j].card,
					belong:belong,
					items: []
				}
			)
		}
		item.items=marjorItem;//将marjorItem这个数组放入item.items中
		result.push(item);
	}
	return result;
}


// 翻页的回调函数
var getPageInf=function (index) {
	if(curSelected == null){
		ajaxPading.send({
				data:{
					unifyCode:unifyCode,
					page:index,
					count:count
				},
				url:getMoRenKcURL,
				onSuccess:function (value) {
					var data=JSON.parse(value).data;
					parseClassInf(data.courseList);
				}
			}
			,'getListInf');
	}
	else{
		if(curSelected.belong == '专业' ){
			ajaxPading.send({
					data:{
						unifyCode:unifyCode,
						zyh:curSelected.card,
						count:count,
						page:index
					},
					url:getAllKcByZyhURL,
					onSuccess:function (value) {
						var data=JSON.parse(value).data;
						parseClassInf(data.courseList);
					}
				}
				,'getListInf');
		}
		if(curSelected.belong == '开课单位' ){
			ajaxPading.send({
					data:{
						unifyCode:unifyCode,
						jysid:curSelected.card,
						count:count,
						page:index
					},
					url:getAllKcByKkdwURL,
					onSuccess:function (value) {
						curSelected.index=index;
						var data=JSON.parse(value).data;
						parseClassInf(data.courseList);
					}
				}
				,'getListInf');
		}
		if(curSelected.belong == '搜索'){
			ajaxPading.send({
				data:{
					unifyCode:unifyCode,
					sslx:curSelected.type,
					ssnr:curSelected.ssnr,
					count:count,
					page:index
				},
				url:getSelectKcURL,
				onSuccess:function (value) {
					var data=JSON.parse(value).data;
					parseClassInf(data.courseList);
				}
			},'getListInf');
		}
		if(curSelected.name == '交叉通识课'){
			ajaxPading.send({
					data:{
						unifyCode:unifyCode,
						count:count,
						page: index
					},
					url:getAllJctskURL,
					onSuccess:function (value) {
						curSelected.index=index;
						var data=JSON.parse(value).data;
						parseClassInf(data.courseList);
					}
				},'getListInf');
		}
	}

}

// 点击导航栏
var setClassNav=function (value,card,belong) {
	var data={
		'专业':['专业培养方案','专业课程拓扑图'],
		'开课单位':['课程列表'],
		'交叉通识课':['交叉通识课']
	}
	curSelected={
		name:value,
		card:card,
		belong:belong,
		index:1
	}
	if(belong=='专业'||belong=='开课单位'||value=='交叉通识课'){

		BluMUI.result.classNavList.setState({
			/*
				这里就是调用组件的地方
				
			*/
			index:0,
			items:data[value]||data[belong]
		});
	}

	if(belong=='专业'){
		ajaxPading.send({
			data:{
				unifyCode:unifyCode,
				zyh:card,
				page:1,
				count:count
			},
			url:getAllKcByZyhURL,
			onSuccess:function (value) {
				var data=JSON.parse(value).data;
				parseClassInf(data.courseList);
				// BluMUI.result.classNavList.setState({
				// 	index:0,
				// 	start:1,
				// 	isUpdate:true,
				// 	total:data.total,
				// 	sum:data.totalPages
				// });
				BluMUI.result.tests.setState({
					index:1,
					start:1,
					isUpdate:true,
					total:data.total,
					sum:data.totalPages,
					inputValue:1
				})
			},
			onFail:function (value) {
				console.log(value);
			}
		},'getListInf');
	}
	if(value == '交叉通识课'){
		ajaxPading.send({
				data:{
					unifyCode:unifyCode,
					page:1,
					count:count
				},
				url:getAllJctskURL,
				onSuccess:function (value) {
					var data = JSON.parse(value).data;
					parseClassInf(data.courseList);
					BluMUI.result.tests.setState({
						index:1,
						start:1,
						isUpdate:true,
						total:data.total,
						sum:data.totalPages,
						inputValue:1
					})
				}
			}
			,'getListInf');
	}
	if(belong == '开课单位'){
		ajaxPading.send({
				data:{
					unifyCode:unifyCode,
					jysid:card,
					count:count,
					page:1
				},
				url:getAllKcByKkdwURL,
				onSuccess:function (value) {
					var data=JSON.parse(value).data;
					parseClassInf(data.courseList);
					BluMUI.result.tests.setState({
						index:1,
						start:1,
						isUpdate:true,
						total:data.total,
						sum:data.totalPages,
						inputValue:1
					});
				}
			}
			,'getListInf');
	}
}

// 跳转到某个功能

var setNavList=function (units,majors) {
	BluMUI.create({
		id:"classList",// 字符串,必选，这个组件的ID
		extClass:"",// 字符串,必选，组件的拓展样式
		height:56,
		items:[// 每个对象元素中必须要有item否则会报错
			{
				name:'专业',// item的名字
				ileftLogo:'../imgs/classListInfShow/major_logo_noselect.png',
				nleftLogo:'../imgs/classListInfShow/major_logo_select.png',
				nameStyle:'firstIitem',// item的拓展样式
				selected:1,// 初始的时候是否被选中
				selectedClass:'item-1-selected',
				isCalled:false,
				items:majors,
				root:true,
				rootflag:false
			},
			{
				name:'开课单位',
				ileftLogo:'../imgs/classListInfShow/unit_logo_noselect.png',
				nleftLogo:'../imgs/classListInfShow/unit_logo_Select.png',
				nameStyle:'firstIitem',
				selected:0,
				selectedClass:'item-1-selected',
				isCalled:false,
				items:units,
				root:true,
				rootflag:false
			},
			{
				name:'交叉通识课',
				ileftLogo:'../imgs/classListInfShow/other_logo.png',
				nleftLogo:'../imgs/classListInfShow/other_logo_select.png',
				irightLogo:'',
				nrightLogo:'',
				nameStyle:'firstIitem',
				selected:0,
				selectedClass:'item-1-selected',
				isCalled:false,
				items:[],
				root:true,
				rootflag:false
			}
		],
		callBack:setClassNav// 函数，必选，点击子级item后触发的回调函数
	},'DropList',document.getElementById('body_left'));
}

var changeMoulde=function (value) {
	switch (value){
		case '专家登录':
			window.location.href = './courseMaster/login.html';
			break;
		case '登录':
			window.location.href = 'https://ids.cqupt.edu.cn/authserver/login?service=' + host + 'classList';
			break;
		case '默认课程':// userList
			window.location.reload();
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


// 改变导航栏

function changeNav(value){
	let card;
	switch (value){
		case '专业培养方案':
			card = curSelected.card;
			ajaxPading.send({
				data:{
					unifyCode:unifyCode,
					zyh:card,
					page:1,
					count:count
				},
				url:getAllKcByZyhURL,
				onSuccess:function (value) {
					var data=JSON.parse(value).data;
					parseClassInf(data.courseList);
					BluMUI.result.tests.setState({
						index:1,
						start:1,
						isUpdate:true,
						sum:data.totalPages,
						inputValue:1
					})
				},
				onFail:function (value) {
					console.log(value);
				}
			},'getListInf');
			break;
		case '专业课程拓扑图':
			card = curSelected.card;
			BluMUI.create({
				topURL:topURL,
				zyh:card
			},'TopPic',document.getElementById('class_inf'));
			BluMUI.result.tests.setState({
				sum:0,
				isUpdate:false,
				inputValue:1
			});
			break;
	}
}

// ajax
ajaxPading.init({
	name:"getListInf",
	dataType:'json',
	type:'post',
	async:true
});
ajaxPading.init({
	name:"getVisit",
	dataType:'json',
	type:'post',
	async:true
});
ajaxPading.init({
	name:"getList",
	dataType:'json',
	type:'post',
	async:true
});
ajaxPading.init({
	name:"getModule",
	dataType:'json',
	type:'post',
	async:true
});

// 初始化列表信息
ajaxPading.send({
	data:{
		unifyCode:unifyCode,
		page:1,
		count:count
	},
	url:getMoRenKcURL,
	onSuccess:function (value) {
		var data=JSON.parse(value).data;
		parseClassInf(data.courseList);
		BluMUI.create({
			index:1,// 数字,必选,当前页
			showNum:9,
			total: data.total,
			id:"tests",// 字符串,必选，这个组件的ID
			length:7,// 数字,必选,显示点击块的最大数目
			sum:data.totalPages,// 数字,必选,总页数
			start:1,// 数字,必选,第一个点击块对应的页数
			url:"",// 数字,必选,页面跳转的时候的URL
			extClass:"h",// 字符串,必选，拓展样式名
			bottomName: '尾页',
			topName: '首页',
			lastName:'上一页',// 字符串,必选，上一页按钮名字
			nextName:'下一页',// 字符串,必选，下一页按钮名字
			change:getPageInf,// 函数，必选，页数变化时的触发事件,value为点击的页数
			inputValue:1
		},'PT',document.getElementById('turnPage'));
	},
	onFail:function () {
		BluMUI.create({
			index:1,// 数字,必选,当前页
			showNum:9,
			id:"tests",// 字符串,必选，这个组件的ID
			length:7,// 数字,必选,显示点击块的最大数目
			sum:0,// 数字,必选,总页数
			start:1,// 数字,必选,第一个点击块对应的页数
			url:"",// 数字,必选,页面跳转的时候的URL
			extClass:"h",// 字符串,必选，拓展样式名
			lastName:'',// 字符串,必选，上一页按钮名字
			nextName:'',// 字符串,必选，下一页按钮名字
			change:getPageInf,// 函数，必选，页数变化时的触发事件,value为点击的页数
			inputValue:1
		},'PT',document.getElementById('turnPage'));
	}
},'getListInf');

// 获取用户操作功能模块

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
				var result = JSON.parse(result),
					sum = 0,
					data = result.data,
					meta = result.meta;
				if(meta.result == 100){
					sum = data.fwl;
					BluMUI.create({
						id:'userHeader',
						isLogin:isLogin,// 是否登录
						loginNum:sum,// 平台的访问量
						loginNumText:'平台访问量:',
						userName:userName,// 登录的用户
						userList:['默认课程','退出登录'],// 用户列表功能
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
							'规章制度':{
								url:'./Regulations/regList.html?state=&title=&source=',
								openType:'_blank'
							},
							'个人设置':{
								url:'./classManage/mySET.html',
								openType:'_blank'
							},
							'评审':{
								url:'./courseMaster/review.html',
								openType:'_blank'
							},
							'统计分析':{
								url:'./classManage/tongJi.html',
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
},'getModule');


// 生产导航栏Y
ajaxPading.init({
	name:"getNav",
	type:'post',
	dataType:'json',
	async:true
})
ajaxPading.send({
	data:{
		unifyCode:unifyCode
	},
	url:getAllKkdwZyXyURL,
	onSuccess:function (value) {
		var result=JSON.parse(value).data,
			majors=setItem(result.majorList||[],['xymc','zymc','zyh'],'专业'),
			units=setItem(result.teachingOfficeList||[],['kkxymc','jysmc','jysh'],'开课单位');
		setNavList(units,majors)
	},
	onFail:function () {
		console.log('请检查网络')
	}
},'getNav');



// 基础UI渲染



BluMUI.create({
	id:'classNavList',
	items:['课程列表'],
	extClass:'',
	index:0,
	callback:changeNav
},'NavList',document.getElementById('class_nav'));

BluMUI.create({
	id:"tests3",// 字符串,必选，这个组件的ID
	btn:"",// 字符串,必选，搜索框名字
	type:'课程名称',
	types:["课程名称",'课程编号','教师','开课单位','专业'],// 数组[字符串],必选,搜索类别
	extClass:"1231",// 字符串,必选，拓展样式名
	search:searchAjax
},'Sch',document.getElementById('search'));
