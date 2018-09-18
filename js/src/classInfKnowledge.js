require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
require('es6-promise');
var BluMUI = require('../libs/classKnowledge/blueMonUI'),
	ajaxPading = require('../libs/ajaxExpand.mini.min');

ajaxPading.init({
	type:'post',
	dataType:'json',
	name:'getInf',
	async:true
});
ajaxPading.send({
	url:'http://172.20.2.137/subjectCenter/getKonwledgeSystemPageMsg',
	data:{
		kcbh:'A1030010',
		unifyCode:'0110'
	},
	onSuccess : function (result) {
			console.log(result);
			setNav(JSON.parse(result));
	},
	onFail:function (e) {
		console.log(e);
	}
},'getInf');
function setClassNav(){

}
function  setNav(result) {
	var data = result.data,
		 meta = result.meta,
		 i,
		 len,
		 result = {};
	if(meta.result == 100){
		for(i = 0 , len = data.length ; i < len ; i ++){
			result[data[i].fzjbh]
		}
	}
}
	BluMUI.create({
		id:"classList",// 字符串,必选，这个组件的ID
		extClass:"",// 字符串,必选，组件的拓展样式
		height:56,
		items:[// 每个对象元素中必须要有item否则会报错
			{
				name:'知识体系结构',// item的名字
				nleftLogo:'../../imgs/knowledge-system/first-visited.png',
				ileftLogo:'../../imgs/knowledge-system/first-unvisited.png',
				irightLogo:'../../imgs/knowledge-system/unvisitied.png',
				nrightLogo:'../../imgs/knowledge-system/visited.png',
				nameStyle:'firstIitem',// item的拓展样式
				selected:1,// 初始的时候是否被选中
				selectedClass:'item-1-selected',
				isCalled:true,
				items:[
					{
						name:'电子技术概况',// item的名字
						leftLogoName:'1',
						card:'1',
						nleftLogo:'../../imgs/knowledge-system/nodeLogo.png',
						ileftLogo:'../../imgs/knowledge-system/nodeLogo.png',
						nameStyle:'firstIitem',// item的拓展样式
						selected:0,// 初始的时候是否被选中
						selectedClass:'item-2-selected',
						items:[
							{
								name: '1.1 定义',// item的名字
								leftLogoName:'',
								nameStyle: 'Item1',// item的拓展样式
								selected: 0,// 初始的时候是否被选中
								selectedClass: 'item-2-selected',
								items:[]
							},
							{
								name: '1.2 定义',// item的名字
								leftLogoName:'',
								nameStyle: 'Item1',// item的拓展样式
								selected: 0,// 初始的时候是否被选中
								selectedClass: 'item-2-selected',
								items:[]
							}
						]
					},
					{
						name:'电子技术概况',// item的名字
						leftLogoName:'2',
						card:2,
						nleftLogo:'../../imgs/knowledge-system/nodeLogo1.png',
						ileftLogo:'../../imgs/knowledge-system/nodeLogo1.png',
						nameStyle:'Item',// item的拓展样式
						selected:0,// 初始的时候是否被选中
						selectedClass:'item-2-selected',
						items:[
							{
								name: '2.1 定义',// item的名字
								leftLogoName:'',
								nameStyle: 'Item1',// item的拓展样式
								selected: 0,// 初始的时候是否被选中
								selectedClass: 'item-2-selected',
								items:[]
							},
							{
								name: '2.2 定义',// item的名字
								leftLogoName:'',
								nameStyle: 'Item1',// item的拓展样式
								selected: 0,// 初始的时候是否被选中
								selectedClass: 'item-2-selected',
								items:[]
							}
						]
					}
				]
			},
			{
				name:'逻辑关系',
				nleftLogo:'../../imgs/knowledge-system/second-visited.png',
				ileftLogo:'../../imgs/knowledge-system/second-unvisited.png',
				nameStyle:'firstIitem',
				selected:0,
				selectedClass:'item-1-selected',
				items:[]
			}
		],
		callBack:setClassNav// 函数，必选，点击子级item后触发的回调函数
	},'DropList',document.getElementById('content_left'));
