require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
require('es6-promise');

// 电子教案、教学大纲、
var BluMUI = require('../libs/classReviewModule/blueMonUI'),
	ajaxExpanding = require('../libs/ajaxExpand.mini.min'),
	hash = parseHash(window.location.href),
	contentRight = document.getElementById('content_right'),
	classId = hash.classId,
	moduleName = hash.moduleName,
	downloadName, // 下载文件名字
	fileName,
	type = {
		'考试大纲':1,
		'导学方案':2,
		'教学大纲':3,
		'电子教案':4,
		'知识体系结构':5,
		'知识体系':5,
		'逻辑关系':6,
		'考核方案':7
	},
	unifyCode = getCookie('userId'),
	host = courseCenter.host,
	queryJXDG = host + 'queryJXDG',
	queryAttachment = host + 'queryAttachment',
	pdfURL = host + 'CquptCourseCenter/pages/classInfShow/docs/CourseCenterAttachment/',
	downURL = host + 'fileDownLoad',
	pdfViewer = null,
	searchJXBByCourseNo = host + 'searchJXBByCourseNo';
// 初始化ajax对象

ajaxExpanding.init({
	name:"getFile",
	dataType:'json',
	type:'post',
	async:true
});
ajaxExpanding.init({
	name:'getDownLoad',
	dataType:'json',
	type:'post',
	async:true
})
initPage();
// 初始化 页面ajax请求
function initPage(){
	var url,
		data;
	switch (moduleName){
		case '知识体系':
		case '电子教案':
		case '教学大纲':
		case '考试大纲':
		case '考核方案':
		case '导学方案':
			if(moduleName == '教学大纲'){
				data = {
					unifyCode:unifyCode,
					courseNo:classId,
					place:3
				};
				url = queryJXDG;
			}
			else{
				data = {
					unifyCode:unifyCode,
					courseNo:classId,
					type:type[moduleName],
					place:3
				};
				url = queryAttachment;
			}
			break;
	}
	ajaxExpanding.send({
		data:data,
		url:url,
		onSuccess:function (result) {
			handleInit(JSON.parse(result),moduleName);
		}
	},'getFile',this);
}



// 初始化渲染
function handleInit(result, moduleName) {
	var data = result.data,
		meta = result.meta,
		i,
		len,
		items = [];
	if (meta.result == 100) {
		var list = data.list;
		switch (moduleName) {
			case '知识体系':
			case '电子教案':
			case '考试大纲':
			case '考核方案':
			case '导学方案':
				len = list.length;
				if (len > 1) {
					for (i = 0; i < len; i++) {
						items.push({
							name: list[i].originName, // 显示给用户的值
							callback: showPDFFile,
							orgFile: list[i].fileName,
							ableDownload:list[i].ableDownload
						});
					}
					BluMUI.create({
						id: 'fileList',
						extClass: '',
						items: items,
						index: 0
					}, 'List', document.getElementById('content_left'));
				} else if (len == 1) {
					contentRight.id = 'content_right_noNav';
				}
				break;
			case '教学大纲':
				list = [{
					originName: data.originName,
					ableDownload:data.ableDownload,
					fileName: data.fileName || ''
				}];
				len = 1;
				contentRight.id = 'content_right_noNav';
				break;
		}
	} else {
		if (meta.result == 102) {
			window.location.href = 'error2.html';
		}
		if (meta.result == 101) {
			window.location.href = 'error1.html';
		}
	}
	if (len > 0) {
		if (list.length > 0) {
			var curItem = list[0];
			fileName = curItem.fileName;
			downloadName = curItem.originName;
		}
		BluMUI.create({
			pdfURL: pdfURL + fileName
		}, 'PdfViewer', document.getElementById('documentViewer'));
		pdfViewer = window.frames['pdf'];
		if (curItem.ableDownload == 1) {
			BluMUI.result.download.setState({
				isAbleDown: true
			});
		} else {
			BluMUI.result.download.setState({
				isAbleDown: false
			});
		}
	}
}

var setNavList = function setNavList(txItems, ljItems ,select) {
	BluMUI.create({
		id: "classList", // 字符串,必选，这个组件的ID
		extClass: "", // 字符串,必选，组件的拓展样式
		height: 56,
		items: [// 每个对象元素中必须要有item否则会报错
			{
				name: '知识点体系', // item的名字
				nleftLogo: '../../imgs/classListInfShow/major_logo_select.png',
				ileftLogo: '../../imgs/classListInfShow/major_logo_noselect.png',
				nameStyle: 'firstIitem', // item的拓展样式
				selected: select?1:0, // 初始的时候是否被选中
				selectedClass: 'item-1-selected',
				isCalled: true,
				items: txItems
			}, {
				name: '知识点逻辑关系',
				nleftLogo: '../../imgs/classListInfShow/other_logo_select.png',
				ileftLogo: '../../imgs/classListInfShow/other_logo.png',
				nameStyle: 'firstIitem',
				selected: !select?1:0,
				selectedClass: 'item-1-selected',
				isCalled:false,
				items: ljItems
			}],
		callBack: function callBack(orginalName, file,ableDownload) {
			fileName = file;
			downloadName = orginalName;
			if(ableDownload == 1){
				BluMUI.result.download.setState({
					isAbleDown: true
				});
			}else{
				BluMUI.result.download.setState({
					isAbleDown: false
				});
			}
			if(file){
				pdfViewer.location.href = 'pdfViewer.html?file=' + pdfURL + file;
			}else{
				pdfViewer.location.href = 'error11.html';
			}

		}
	}, 'DropList', document.getElementById('content_left'));
};

// 文件下载
function Download(){
	var downLoadIframes = window.frames['downLoad'];
	downLoadIframes.location.href = downURL + '?name='+ encodeURI(downloadName) +'&oName='+fileName + '&unifyCode=' + unifyCode;
}



// 点击文件item显示对应的swf文件
function showPDFFile(index,value,item) {
	console.log(item);
	pdfViewer.location.href = 'pdfViewer.html?file=' + pdfURL +  item.orgFile;
	if(item.ableDownload == 1){
		BluMUI.result.download.setState({
			isAbleDown: true
		});
	}else{
		BluMUI.result.download.setState({
			isAbleDown: false
		});
	}
}


BluMUI.create({
	id:'download',
	_download:Download
},'DownLoad',document.getElementById('right_download'));