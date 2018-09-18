require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
require('es6-promise');
var BluMUI = require('../libs/classManageEditor/blueMonUI'),
	ReactDOM  = require('react-dom'),
	ajaxPading = require('../libs/ajaxExpand.mini.min'),
	submitReview = document.getElementById('submitReview'),
	view = document.getElementById('view'),
	back = document.getElementById('back'),
	hash = parseHash(window.location.href),
	ViewArea = document.getElementById('viewArea'),
	unifyCode =  getCookie('userId'),
	userName = getCookie('userName'),
	fileURL ='',
	doc = document,
	courseNo = hash.classId,
	host = courseCenter.host,
	selectedTeachClass,// 选择的教学班
	saveURL={ // save ajax url
		'课程简介':host + 'updateIntroduction',
		'实习计划':host + 'uploadTeachPlan',
		'授课计划':host + 'uploadTeachPlan',
		'学习资源':host + 'uploadLearnRes',
	},
	deleteURL={
		'实习计划':host + 'deleteTeachPlan',
		'授课计划':host + 'deleteTeachPlan',
	},
	initURL={
		'学习资源':host + 'selectLearnResType',
		'实习计划':host + 'searchJXBByCourseNo',
		'讲义':host + 'getCourseStudyResourceMsg',
	},
	moduleNumber  = {
		'考试大纲':1,
		'导学方案':2,
		'教学大纲':3,
		'电子教案':4,
		'知识体系':5,
		'知识点体系':5,
		'逻辑关系':6,
		'考核方案':7
	},
	sourceTypeIndex = {
		'微视频':1,
		'讲义':21,
		'讲义附件':22,
		'作业':3,
		'习（试）题库':4,
		'网络参考资源':5,
		'网络在线学习资源及链接':5,
		'教材/参考书':6
	},
	sourceTypeState = {
		'讲义':'jyFile',
		'作业':'hkFile',
		'习（试）题库':'xtFile',
	},
	courseType,
	stuSourceId = {
		'微视频':1,
		'讲义':21,
		'讲义附件':22,
		'作业':3,
		'习（试）题库':4,
		'网络参考资源':5,
		'网络在线学习资源及链接':5
	},
	classNameDom = doc.getElementById('courseName'),
	deleteResourceLink = host + 'deleteResourceLink',
	getMenu = host + "getMenu",
	getCourseIntroducePageMsg = host + 'getCourseIntroducePageMsg',
	submitOperation =	host + 'submitOperation', // 提交审核
	getTextbookResourceMsg = host + 'getTextbookResourceMsg',// 得到参考书....
	downURL = host + 'fileDownLoad',// 下载链接
	selectLearnResTypeURL = host + 'selectLearnResType',
	queryAttachmentURL = host + 'queryAttachment', // 查询电子教案、教学大纲等
	getKonwledgeSystemPageMsg	= host + 'getKonwledgeSystemPageMsg',// 查询知识体系
	deleteAttachment = host + 'deleteAttachment',
	uploadJiaoAn = host + 'uploadJiaoAn',
	picPath = host + 'upload/PIC/',// 图片路径
	updataPicURL = host + 'updatePic',
	searchJXBByCourseNo = host + 'searchJXBByCourseNo',
	uploadBookURL= host + 'uploadBook',
	getCourseStatus = host + 'getCourseStatus',
	insertAttachment = host + 'insertAttachment',// 保存知识体系、逻辑关系...
	uploadLearnRes = host + 'uploadLearnRes',// 保存微视频...
	deleteLearnRes	= host + 'deleteLearnRes',// 删除微视频...
	deleteBook = host + 'deleteBook',// 删除教材
	getStudyResourceMsg = host + 'getStudyResourceMsg',// 获取微视频
	uploadResourceLinkURL= host + 'uploadResourceLink',// 获取参考资源URL
	loginURL = 'https://ids.cqupt.edu.cn/authserver/login?service=' + host + 'classList';
// ajax返回数据基本处理

var handleData = function (result) {
	return JSON.parse(result);
}


// 初始化ajax对象

ajaxPading.init({
	type:'post',
	dataType:'form',
	handleData:handleData,
	name:'saveAjax',
	async:true
});

// 获取模块基本信息的ajax
ajaxPading.init({
	type:'post',
	dataType:'json',
	handleData:handleData,
	name:'getMouduleInf',
	async:true
});
ajaxPading.init({
	type:'post',
	dataType:'json',
	handleData:handleData,
	name:'getMouduleName',
	async:true
})

// 单独上传文件的ajax

ajaxPading.init({
	type:'post',
	dataType:'form',
	name:'file',
	handleData:handleData,
	async:true
});

// 通过课程ID获取课程名称
ajaxPading.init({
	name:'getClassName',
	type:'post',
	dataType:'json',
	async:true
});


// 删除文件的ajax
ajaxPading.init({
	type:'post',
	dataType:'form',
	handleData:handleData,
	name:'delete',
	async:true
});

// 切换学习资源ajax


ajaxPading.init({
	type:'post',
	dataType:'json',
	handleData:handleData,
	name:'stuSource',
	async:true
});

// 获取课程名称
ajaxPading.send({
	data:{
		courseNo:courseNo,
		unifyCode:unifyCode
	},
	url:getCourseStatus,
	onSuccess:function (result) {
		var result = JSON.parse(result),
			 data = result.data,
			 meta = result.meta;
		if(meta.result == 100){
			var type = parseInt(data.kclx);
			if(type === 1 )
				courseType = 5;
			if(type === 2)
				courseType = 6;
			classNameDom.innerHTML = data.courseName;
			getModuleInf();
		}else{
			window.location.href = 'courseManagement.html';
		}

	},
	onFail:function () {
		window.location.href= 'error1.html';
	}
},'getClassName');

//获取审核模块的详细状态


function getModuleInf(){
	ajaxPading.send({
		data:{
			unifyCode:unifyCode,
			module:courseType
		},
		url:getMenu,
		onSuccess:function(result){
			var meta = result.meta;
			if(meta.result == 100 ){
				var data = result.data,
					i,
					subModulesStatus = [],
					len;
				for( i = 0 , len = data.length ; i < len ; i++){
					subModulesStatus.push({
						name:data[i].cdmc,
						isPass:true
					})
				}
				initEditorInf(subModulesStatus,data.note);
			}else{
				console.log('服务器发生错误!');
			}
		}
	},'getMouduleInf');
}


// 处理提交ajax


var handleSaveAjax = function(flag,result,ajaxName,postData,that){
	var data = result.data,
		 meta = result.meta;
	if(flag == 1) {
		if(meta.result == 100) {
			console.log(ajaxName);
			switch (ajaxName) {
					case '课程简介':
						alert('保存成功!')
						break;
					case '考核方案':
					case '知识点体系':
					case '逻辑关系':
					case '电子教案':
					case '导学方案':
					case '教学大纲':
					case '考试大纲':
						var items;
						items = that.state.items;
						doc.getElementById('file').value = '';
						doc.getElementById('warn_file').innerHTML = '上传文件成功！';

						var fileName = data[0].fileName ,
							 originName = data[0].originName ;
						items.push([
							{value: originName},
							{value: '删除', fileName: fileName, callback: deleteFile},
							{value: '下载', downloadName:originName ,fileName: fileName, callback: downloadFile}
						]);
						that.setState({
							items: items,
							fileName: fileName,
							isUpload:true,
							isDown:false
						});
						break;
					case '习（试）题库':
						doc.getElementById('file').value = '';
						doc.getElementById('warn_file').innerHTML = '上传文件成功！';
						var xtFile = that.state.xtFile,
							 fileName = data[0].fileName,
							 originName = data[0].originName;
						xtFile.push([
							{value: originName},
							{value: '删除', fileName: fileName, callback: deleteFile},
							{value: '下载', downloadName:originName ,fileName: fileName, callback: downloadFile},
						]);
						that.setState({
							xtFile: xtFile,
							isUpload : true
						});
					  break;
				case '作业':
					doc.getElementById('file').value = '';
					doc.getElementById('warn_file').innerHTML = '上传文件成功！';
					var fileName = data[0].fileName,
						 originName = data[0].originName,
						 hkFile = that.state.hkFile;
					hkFile.push([
						{value: originName},
						{value: '删除', fileName: fileName, callback: deleteFile},
						{value: '下载', downloadName: originName ,fileName: fileName, callback: downloadFile}
					]);
					that.setState({
						hkFile: hkFile,
						isUpload : true
					});
					  break;
				case '讲义':
					doc.getElementById('file').value = '';
					doc.getElementById('warn_file').innerHTML = '上传文件成功！';
					var jyFile = that.state.jyFile,
						 fileName = data[0].fileName,
						originName = data[0].originName;
					jyFile.push([
						{value: originName},
						{value: '删除', fileName: fileName, callback: deleteFile},
						{value: '下载', downloadName: originName ,fileName: fileName, callback: downloadFile},
					]);
					that.setState({
						jyFile: jyFile,
						isUpload : true,
						isDown:false
					});
					 break;
				case '讲义附件':
					doc.getElementById('file1').value = '';
					doc.getElementById('warn_file1').innerHTML = '上传文件成功！';
					var jyAttachment = that.state.jyAttachment,
						fileName = data[0].fileName,
						originName = data[0].originName;
					jyAttachment.push([
						{value: originName},
						{value: '删除', fileName: fileName, callback: deleteFile},
						{value: '下载', downloadName: originName ,fileName: fileName, callback: downloadFile},
					]);
					that.setState({
						jyAttachment:jyAttachment,
						isUpload1:true
					});
					break;
				case '网络参考资源':
					doc.getElementById('file').value = '';
					doc.getElementById('warn_file').innerHTML = '上传文件成功！';
					var onlineSource = that.state.onlineSource,
						 originName = data[0].originName,
						 fileName = data[0].fileName;
					onlineSource.push([
						{value: originName},
						{value: '删除', fileName: fileName, callback: deleteFile},
						{value: '下载', downloadName:originName ,fileName: fileName, callback: downloadFile}
					]);
					that.setState({
						onlineSource: onlineSource,
						isUpload : true
					});
					 break;
				case '微视频':
					doc.getElementById('file').value = '';
					doc.getElementById('warn_file').innerHTML = '上传视频成功！';
					var videos = that.state.videos;

					videos.push([
							{ value:data[0].originName },
							{ value:'删除',fileName: data[0].fileName,callback: deleteFile},
						   { value: '下载', downloadName:data[0].originName ,fileName:  data[0].fileName, callback: downloadFile}
					]);
					that.setState({
						videos: videos,
						isUpload : true
					});

					break;
				case '其他微视频':
					doc.getElementById('speaker2').value = '';
					doc.getElementById('name').value = '';
					doc.getElementById('link').value = '';
					var otherVideo = that.state.otherVideo;
					otherVideo.push(
						[
							{value: postData.linkName.value,url:postData.linkURL.value},
							{value: '删除', callback: deleteFile, linkURL: postData.linkURL.value,linkName:postData.linkName.value}
						]
					);
					that.setState({
						otherVideo: otherVideo
					});
					break;
				case '网络学习资源URL':
					doc.getElementById('name').value = '';
					doc.getElementById('link').value = '';
					var onlineURL = that.state.onlineURL;
					onlineURL.push(
						[
							{value: postData.linkName.value,url:postData.linkURL.value},
							{value: '删除', callback: deleteFile, linkURL: postData.linkURL.value,linkName:postData.linkName.value}
						]
					);
					that.setState({
						onlineURL: onlineURL
					});
					 break;
				case '参考书':
				case '教材':
					if (ajaxName == '教材') {
						var items = that.state.jcBooks;
					}
					else {
						items = that.state.ckBooks;
					}
					items.push({
						img: picPath + data.picURL,
						bookName: postData.bookName.value,
						author: postData.author.value,
						publisher: postData.press.value,
						bookId:data.bookID
					});
					if (ajaxName == '教材') {
						that.setState({
							jcBooks: items,
							addBox:false,
							fileName:''
						})
					}
					else {
						that.setState({
							ckBooks:items,
							addBox:false,
							fileName:''
						})
					}
					  break;
			}
		}else if(meta.result == 303){
			confirm(result.meta.msg);
			window.location.href=loginURL;
		}
		else{
			if(	ajaxName =="参考书" ||  ajaxName == "教材"){
				document.getElementById('warn_picName').innerHTML = '上传文件失败';
			}
			else if(ajaxName =='其他微视频'){
				if(meta.result == 202 ){
					document.getElementById('warn_speaker2').innerHTML = '资源已存在';
					document.getElementById('warn_linkName').innerHTML = '资源已存在';
					document.getElementById('warn_linkURL').innerHTML = '资源已存在';
				}  else{
					document.getElementById('warn_speaker2').innerHTML = '上传文件失败';
					document.getElementById('warn_linkURL').innerHTML = '上传文件失败';
					document.getElementById('warn_linkName').innerHTML = '上传文件失败';
				}
			}else if( ajaxName =='网络学习资源URL'){
				if(meta.result == 202 ){
					document.getElementById('warn_linkName').innerHTML = '资源已存在';
					document.getElementById('warn_linkURL').innerHTML = '资源已存在';
				}  else{
					document.getElementById('warn_linkURL').innerHTML = '上传文件失败';
					document.getElementById('warn_linkName').innerHTML = '上传文件失败';
				}
			}
			else if(ajaxName =='讲义附件'){
				that.setState({
					isUpload1:true
				});
				document.getElementById('warn_file1').innerHTML = '上传文件失败';
			}
			else {
				that.setState({
					isUpload:true
				});
				document.getElementById('warn_file').innerHTML = '上传文件失败';
			}
		}
	}else{
		switch (ajaxName) {
			case '课程简介':
				console.log('请检查网络!');
				break;
			case '网络学习资源URL':
			case '其他微视频':
				break;
			case '讲义附件':
				that.setState({
					isUpload1:true
				});
				document.getElementById('warn_file1').innerHTML = '上传文件失败';
				break;
			default:
				that.setState({
					isUpload:true
				});
				document.getElementById('warn_file').innerHTML = '上传文件失败';
				break;
		}
	}
}

// ajax Save
var saveAjax=function (data,ajaxName,that) {
	var fail = null,
		success = null,
		check = null,
		start = null,
		url = saveURL[ajaxName];
	data.unifyCode={
		value:unifyCode
	}
	data.courseNo={
		value:courseNo
	}
	switch (ajaxName){
		case '课程简介':
			fail=function (result) {
				handleSaveAjax(0,result,ajaxName,data,that);
			};
			success=function (result) {

				handleSaveAjax(1,result,ajaxName,data,that);
			};
			check = function (checkInfs) {
				var i,
					 type ,
					 id  = '',
					 checkInf = null,
					 len;
				for ( i = 0 , len = checkInfs.length ; i < len ; i++){
					checkInf = checkInfs[i];
					type = checkInf.type;
					id = 'warn_' + type;
					if(!checkInf.isCheck) {
						if (type == 'picName')
							document.getElementById(id).innerHTML = '未选择封面';
						else
							document.getElementById(id).innerHTML = '未填写课程简介';
					}
					else
						document.getElementById(id).innerHTML = '';
					}
				};
			break;
		case '知识点体系':
		case '逻辑关系':
		case '电子教案':
		case '导学方案':
		case '考核方案':
		case '教学大纲':
		case '考试大纲':
	      url = insertAttachment;
			 data.type={
				 value:moduleNumber[ajaxName]
			 };
			 start = function () {
				 that.setState({
					 isUpload:false
				 });
			 }
			 success = function (result) {
				 handleSaveAjax(1,result,ajaxName,data,that);
			 };
			 fail = function (result) {
				 handleSaveAjax(0,result,ajaxName,data,that);
			 };
			 check = function (checkInfs) {
			 	 var errorInf = checkInfs[0].errorInf || '',
				     type = checkInfs[0].type,
			 	     isCheck = checkInfs[0].isCheck;
			 	 if(!isCheck)
					 document.getElementById('warn_' + type).innerHTML = errorInf;
			 	 else
					 document.getElementById('warn_' + type).innerHTML = '正在上传文件...';
			 };
			 break;
		case '微视频':
		case '网络参考资源':
		case '习（试）题库':
		case '作业':
		case '讲义附件':
		case '讲义':
			data.ID = {
				value:stuSourceId[ajaxName]
			};
			url = uploadLearnRes;
			success = function (result) {
				handleSaveAjax(1,result,ajaxName,data,that);
			};
			start = function () {
				if(ajaxName == '讲义附件'){
					that.setState({
						isUpload1:false
					});
				}else{
					that.setState({
						isUpload:false
					});
				}
			}
			check = function (checkInfs) {
				var checkInf = checkInfs[0],
					 isCheck = checkInf.isCheck,
					 errorInf = checkInf.errorInf,
					 type = checkInf.type;
				if(!isCheck)
					document.getElementById('warn_'+type).innerHTML = errorInf;
				else
					document.getElementById('warn_'+type).innerHTML = '正在上传文件...';
			}
			fail = function (result) {
				handleSaveAjax(0,result,ajaxName,data,that);
			};
			break;
		case '其他微视频':
		case '网络学习资源URL':
			if(ajaxName == '其他微视频' ){
				data.ID = {
					value:1
				}
			}
			else{
				data.ID = {
					value:5
				}
			}
			url = uploadResourceLinkURL;
			check = function (checkInfs) {
				var i,
					 len,
					 checkInf;
				for( i = 0 , len = checkInfs.length ; checkInf = checkInfs[i] ; i++){
					if(!checkInf.isCheck){
						document.getElementById('warn_'+checkInf.type).innerHTML = checkInf.errorInf;
					}else{
						document.getElementById('warn_'+checkInf.type).innerHTML = '';
					}
				}
			}
			success = function (result) {
				handleSaveAjax(1,result,ajaxName,data,that);
				that.setState(
					{
						addBox:false
					}
				)
			};
			break;
		case '参考书':
		case '教材':
			  url = uploadBookURL;
			  success = function (result) {
					handleSaveAjax(1,result,ajaxName,data,that);
				}
			check = function (checkInfs) {
				var i,
					len,
					checkInf;
				for( i = 0 , len = checkInfs.length ; checkInf = checkInfs[i] ; i++){
					if(!checkInf.isCheck){
						document.getElementById('warn_'+checkInf.type).innerHTML = checkInf.errorInf;
					}else{
						document.getElementById('warn_'+checkInf.type).innerHTML = '';
					}

				}
			}
			  break;

		default:
			  break;
	}
	ajaxPading.send({
		data:data,
		url:url,
		onFail:fail,
		onSuccess:success,
		onCheck:check,
		onStart:start
	},'saveAjax',that);
}

// upload File
var uploadFile = function (fileData,dataType,img,that) {
	if(dataType == 'Itru' || dataType == 'teachBook') {
		ajaxPading.send({
			data: {
				unifyCode: {
					value: unifyCode,
				},
				file:{
					value:fileData,
					type:'picName',
					suffix:['jpg','png','jpeg','gif','psd']
				}
			},
			url: updataPicURL,
			onCheck:function(checkInfs){
				var checkInf = checkInfs[0],
					 type = checkInf.type,
					 isCheck = checkInf.isCheck;
				if(!isCheck)
					document.getElementById('warn_' + type).innerHTML = '封面图片格式错误!';
				else
					document.getElementById('warn_' + type).innerHTML =  '正在上传封面';
			},
			onSuccess:function (result) {
				if(result.meta.result == 100) {
					var fileName = result.data.fileName;
					that.state.fileName = fileName;
					img.src = picPath + fileName;
					document.getElementById('warn_picName').innerHTML = '上传成功!';
				}else if(result.meta.result == 303){
					document.getElementById('warn_picName').innerHTML = '上传失败!';
					confirm(result.meta.msg);
					window.location.href=loginURL;
				}
				else{
					document.getElementById('warn_picName').innerHTML = '上传失败!';
					alert(result.meta.msg);
				}
			}
		},'file')
	}
}

// delete File,type 1 为删除list的item, 0 为删除table的item
var deleteFile = function (ajaxName,index,that,type,items) {
	var url = deleteURL[ajaxName],
		 data = {
			unifyCode:{
				value:unifyCode
			},
			courseNo:{
				value:courseNo
			},
			fileName:{
				value:items[index].fileName
			}
		};
	switch (ajaxName){
		case '授课计划':
		case '实习计划':
			data.teachClass={
				value:selectedTeachClass,
				pattern:/.{1,}/
			};
			break;
		case '其他微视频':
		case '网络学习资源URL':
				url = deleteResourceLink;
				if(ajaxName == '网络学习资源URL'){
					data.ID={
						value:5
					};
				}else{
					data.ID={
						value:1
					};
				}
			  data.linkURL={
				  value:items[index].linkURL
			  };
			  data.linkName = {
					value:items[index].linkName
				};
			  break;
		case '网络参考资源':
		case '习（试）题库':
		case '作业':
		case '讲义':
		case '讲义附件':
		case '微视频':
				url = deleteLearnRes;
				data.ID={
					value:sourceTypeIndex[ajaxName]
				};
			  break;
		case '参考书':
		case '教材':
				url = deleteBook;
				data.bookID = {
					value:items[index].bookId
				};

				break;
		case '知识点体系':
		case '教学大纲':
		case '考试大纲':
		case '电子教案':
		case '导学方案':
		case '考核方案':
			  url = deleteAttachment;
			  data.type = {
				  value:moduleNumber[ajaxName]
			  };
				break;
		default:
			  break;
	}
	switch (type){
		case 0:
			ajaxPading.send({
				data:data,
				url:url,
				onSuccess:function (result) {
					if(result.meta.result == 100) {
						items.splice(index, 1);
						that.setState({
							items: items
						});
					}else if(result.meta.result == 303){
						confirm(result.meta.msg);
						window.location.href=loginURL;
					}else{
						alert(result.meta.msg);
					}
				},
				onFail:function () {
					alert('请检查您的网络');
				}
			},'delete');
			break;
		case 1:
			ajaxPading.send({
				data:data,
				url:url,
				onSuccess:function (result) {
					if(result.meta.result == 100) {
						items.splice(0, 3);
						that.setState({
							items: items
						});
					}else if(result.meta.result == 303){
						confirm(result.meta.msg);
						window.location.href=loginURL;
					}
					else{
						alert(result.meta.msg);
					}
				},
				onFail:function () {
				}
			},'delete');
			break;
		case 2:
			// 删除微视频、教材/参考书籍
			ajaxPading.send({
				data:data,
				url:url,
				onSuccess:function (result) {
					if(result.meta.result == 100) {
						items.splice(index, 1);
						if (ajaxName == '微视频')
							that.setState({
								videos: items
							});
						if (ajaxName == '教材') {
							that.setState({
								jcBooks: items
							});
						}
						if (ajaxName == '参考书') {
							that.setState({
								ckBooks: items
							});
						}
					}
					else if(result.meta.result == 303){
						confirm(result.meta.msg);
						window.location.href=loginURL;
					}
					else{
						alert(result.meta.msg);
					}
				},
				onFail:function () {
					alert('请检查您的网络');
				}
			},'delete');
			break;
	}
};

// download File

var downloadFile = function (ajaxName,index,that,type,items) {
	var fileName = items[index].fileName,
		 downloadName = items[index].downloadName,
		 downLoadIframes = window.frames['downLoad'];
	downLoadIframes.location.href = downURL + '?name='+ encodeURIComponent(downloadName)+'&oName='+ encodeURIComponent(fileName) + '&unifyCode=' + unifyCode;
}


// 处理切换模块的数据

var handleChangeModuleData = function(result,moduleName,that){
	var meta = result.meta,
		 data = result.data || [],
		 i,
		 len,
		 items;
	console.log(meta.result);
	if(meta.result == 100) {
		switch (moduleName) {
			case '课程简介':
				that.tpurl = picPath + data[0].tpurl;
				that.html = data[0].kcjshtml;
				that.fileName = data[0].tpurl;
				break;
			case '知识点体系':
			case '教学大纲':
			case '考试大纲':
			case '导学方案':
			case '电子教案':
			case '考核方案':
				items = [];
				var list = data.list;
				for( i=0, len = list.length; i< len;i++){
					items[i]=[
						{value: list[i].originName},
						{value: '删除',fileName:list[i].fileName,callback: deleteFile},
						{value: '下载', downloadName:list[i].originName ,fileName: list[i].fileName, callback: downloadFile}
					]
				}
				that.items = items;
				that.isUpload = true;
				break;
			case '实习计划':
			case '授课计划':
				items = [];
				for( i = 0 , len = data.length ; i < len ; i++){
					items[i] = [
						{value:data[i].JXB + '-' + moduleName},
						{value: '下载', downloadName:data[i].JXB + '-' + moduleName ,fileName: data[i].url, callback: downloadFile}
					]
				}
				that.items = items;
				that.isUpload = true;
			break;
			case '学习资源':
				items = [];
				for( i = 0 , len = data.length ; i<len ; i++){
					items.push(data[i].lxmc);
				}
				that.drops[0].items = items;
				that.drops[0].initalSelected="微视频";
				ajaxPading.send({
					data:{
						kcbh:courseNo,
						zylb: 1,
						unifyCode:unifyCode,
						place:1
					},
					url:getStudyResourceMsg,
					onSuccess:function (result) {
						var meta = result.meta;
						if(meta.result == 100  ) {
							var data = result.data || [],
								videos = [],
								otherVideo = [],
								i,
								len;
							for (i = 0 , len = data.length; i < len; i++) {
								if (data[i].wlxxzylj == "") {
									videos.push([
											{ value:data[i].ywjm},
											{ value:'删除',fileName: data[i].xywjm,callback: deleteFile},
											{value: '下载', downloadName:data[i].ywjm ,fileName:data[i].xywjm, callback: downloadFile}
									]);
								} else {
									otherVideo.push(
										[
											{
												value: data[i].ljmc,
												url:data[i].wlxxzylj
											},
											{
												value: '删除',
												callback: deleteFile,
												linkURL: data[i].wlxxzylj,
												linkName: data[i].ljmc
											},
										]
									);
								}
							}
							BluMUI.result.stuSource.setState({
								videos: videos,
								otherVideo:otherVideo
							});
						}
					}
				},'stuSource');
				break;
		}
	} else{
		console.log('数据处理失败!');
	}
}

// 切换模块
var changeMoudule= function (ajaxName,index,that,type,items) {
	var mouduleName = items[index].value,
		url,
		success = null,
		data = null;
	url = initURL[mouduleName];
	ReactDOM.unmountComponentAtNode(ViewArea);
	switch (mouduleName){
		case '知识点体系':
		case '考核方案':
		case '逻辑关系':
		case '电子教案':
		case '教学大纲':
		case '导学方案':
		case '考试大纲':
			url = queryAttachmentURL;
			data = {
				courseNo:courseNo,
				unifyCode:unifyCode,
				type:moduleNumber[mouduleName],
				place:1
			};
			success = function (result) {
				console.log(result);
				handleChangeModuleData(result,mouduleName,selects[mouduleName].componentInf);
				BluMUI.create(
						selects[mouduleName].componentInf,
						selects[mouduleName].type,
						ViewArea,
						selects[mouduleName].callback
					);
			};
			break;
		case '学习资源':
			url = selectLearnResTypeURL;
			data ={
				kcbh:courseNo,
				zylb:sourceTypeIndex[mouduleName],
				unifyCode:unifyCode
			};
			success = function (result) {
				handleChangeModuleData(result,mouduleName,selects[mouduleName].componentInf);
				BluMUI.create(
					selects[mouduleName].componentInf,
					selects[mouduleName].type,
					ViewArea,
					selects[mouduleName].callback
				);
			}
			break;
		case '课程简介':
			url = getCourseIntroducePageMsg;
			data ={
				kcbh:courseNo,
				unifyCode:unifyCode,
				place:1

			};
			success = function (result) {
				handleChangeModuleData(result,mouduleName,selects[mouduleName].componentInf);
				BluMUI.create(
					selects[mouduleName].componentInf,
					selects[mouduleName].type,
					ViewArea,
					selects[mouduleName].callback
				);
			}
			break;
		default:
			BluMUI.create(
				selects[mouduleName].componentInf,
				selects[mouduleName].type,
				ViewArea,
				selects[mouduleName].callback
			);
			break;
	}
	if(data != null){
		ajaxPading.send({
			data:data,
			url:url,
			onSuccess:success
		},'getMouduleInf');
	}
};

// 切换资源类型

var selectSourceType = function (value) {
	var that = BluMUI.result.stuSource,
		 url,
		 fail = null,
		 success = null,
		 data = {
				kcbh:courseNo,
				zylb:sourceTypeIndex[value],
				unifyCode:unifyCode,
			 	place:1,
		 };
	switch (value){
		case '网络在线学习资源及链接':
		case '微视频':
			url = getStudyResourceMsg;
			success = function (result) {
				var meta = result.meta;
				if(meta.result == 100 ) {
					var data = result.data || [],
						localResourse = [],
						thirdOfferResource = [],
						i,
						len;
					for (i = 0 , len = data.length; i < len; i++) {

						if (data[i].wlxxzylj == "") {

							if(value == '微视频') {
								localResourse.push([
									{value: data[i].ywjm},
									{value:'删除', callback: deleteFile,fileName:data[i].xywjm},
									{value: '下载',downloadName:data[i].ywjm ,fileName:data[i].xywjm, callback: downloadFile}
								])
							}else{
								localResourse.push(
									[
										{value: data[i].ywjm},
										{value: '删除', callback: deleteFile, fileName: data[i].xywjm},
										{value: '下载', downloadName:data[i].sfnxz ,fileName: data[i].xywjm, callback: downloadFile},
									]
								)
							}
						}
						else {
							thirdOfferResource.push(
								[
									{value: data[i].ljmc},
									{
										value: '删除',
										callback: deleteFile,
										linkURL: data[i].wlxxzylj,
										linkName: data[i].ljmc
									},
								]
							)
						}
					}
					if (value == '微视频') {
						that.setState({
							videos: localResourse,
							otherVideo:thirdOfferResource,
							sourceType: value,
							isUpload : true
						});
					}
					else {
						that.setState({
							onlineSource: localResourse,
							onlineURL:thirdOfferResource,
							sourceType: value,
							isUpload : true
						});
					}
				}
				else{
					that.setState({
						sourceType:value,
						isUpload : true
					});
				}
			}
			break;
		case '讲义':
			data.zylb=2;
			url = getStudyResourceMsg;
			success  = function(result){
				var meta = result.meta,
					warn = document.getElementById('warn_file');
				if(warn)
					warn.innerHTML = '未选择文件!';
				if(meta.result == 100 ) {
					var items = [],
						 items1 = [],
						 data = result.data || [],
						 i,
						 result = {},
						 len;
					for (i = 0 , len = data.length; i < len; i++) {
						if(data[i].zylb == 22){
							items1.push([
								{value: data[i].ywjm},
								{value: '删除', callback: deleteFile, fileName: data[i].xywjm},
								{value: '下载', downloadName:data[i].sfnxz ,fileName: data[i].xywjm, callback: downloadFile}
							])
						}else if(data[i].zylb == 21){
							items.push(
								[
									{value: data[i].ywjm},
									{value: '删除', callback: deleteFile, fileName: data[i].xywjm},
									{value: '下载', downloadName:data[i].sfnxz ,fileName: data[i].xywjm, callback: downloadFile},
								]
							);
						}
					}
					result.isUpload=true;
					result.isUpload1=true;
					result.sourceType=value;
					result.jyFile=items;
					result.jyAttachment=items1;
					that.setState(result);
				}
				else {
					that.setState({
						sourceType:value,
						isUpload : true
					});
				}
			};
			fail = function(result){
			};
			break;
		case '作业':
		case '习（试）题库':
			url = getStudyResourceMsg;
			success  = function(result){
				var meta = result.meta,
					 warn = document.getElementById('warn_file');
				if(warn)
				warn.innerHTML = '未选择文件!';
				if(meta.result == 100 ) {
					var items = [],
						data = result.data || [],
						i,
						result = {},
						len;
					for (i = 0 , len = data.length; i < len; i++) {
						items.push(
							[
								{value: data[i].ywjm},
								{value: '删除', callback: deleteFile, fileName: data[i].xywjm},
								{value: '下载', downloadName:data[i].sfnxz ,fileName: data[i].xywjm, callback: downloadFile},
							]
						)
					}
					result.isUpload=true;
					result.sourceType=value;
					result[sourceTypeState[value]]=items;
					that.setState(result);
				}
				else {
					that.setState({
						sourceType:value,
						isUpload : true
					});
				}
			};
			fail = function(result){
			};
			break;
		case '教材/参考书':
			url = getTextbookResourceMsg;
			success = function(result){
				var meta = result.meta;
				if(meta.result == 100 ) {
					var data = result.data || [],
						jcBooks = [],
						ckBooks = [],
						teachBookList = data.teachBookList,
						referenceBookList = data.referenceBookList,
						i,
						len;;
					for( i = 0 , len = teachBookList.length ; i < len ; i++ ){
							jcBooks.push({
								img:picPath + teachBookList[i].tpmc,
								bookName: teachBookList[i].sm,
								author: teachBookList[i].zz,
								publisher: teachBookList[i].CBS,
								bookId:teachBookList[i].id
							});
					}
					for( i = 0 , len = referenceBookList.length ; i < len ; i++ ){
						ckBooks.push({
							img: picPath + referenceBookList[i].tpmc,
							bookName: referenceBookList[i].sm,
							author: referenceBookList[i].zz,
							publisher: referenceBookList[i].CBS,
							bookId:referenceBookList[i].id
						});
					}
					that.setState({
						jcBooks: jcBooks,
						ckBooks:ckBooks,
						sourceType:value
					});
				}else{
					that.setState({
						sourceType:value
					});
				}
			}
			fail = function (){
			}
			break;
	}
	ajaxPading.send({
		data:data,
		url:url,
		onSuccess:success,
		onFail:fail
	},'stuSource')
}


// 初始化课程维护

var initEditorInf = function(inf,notes){
	var i,
		 len,
		 moudleItems = [],
		 status = [[],[],[],[]];
	for( i = 0 , len = inf.length ; i < len ; i++ ){
		moudleItems.push({value:inf[i].name,callback:changeMoudule});
		if(selects[inf[i].name])
		selects[inf[i].name].componentInf.isPass = inf[i].isPass;
	}
	BluMUI.create({
		noSubmit:status[0],
		noReviewCourse:status[1],
		passCourse:status[2],
		rejectCourse:status[3],
		notes:notes||[]
	},'CourseStatus',document.getElementById('courseStatus'));
	ajaxPading.send({
		url:getCourseIntroducePageMsg,
		data:{
			kcbh:courseNo,
			unifyCode:unifyCode,
			place: 1
		},
		onSuccess:function (result) {
			var data = result.data || [],
				 meta = result.meta;
				selects['课程简介'].componentInf.html = data[0].kcjshtml;
				selects['课程简介'].componentInf.tpurl = picPath + data[0].tpurl;
				selects['课程简介'].componentInf.fileName =data[0].tpurl;
			BluMUI.create(selects['课程简介'].componentInf, selects['课程简介'].type, ViewArea, selects['课程简介'].callback);
		}
	},'getMouduleInf');
	BluMUI.create({
		id:'contentNav',
		extClass:'',
		items:moudleItems,
		index:0
	},'List',document.getElementById('nav'));

}

// 模块数据
var selects= {
	'课程简介': {
		componentInf: {
			id: 'intro',
			isPass:true,
			fileURL: fileURL,
			unifyCode: unifyCode,
			ajaxName: '课程简介',
			saveAjax: saveAjax,
			uploadFile: uploadFile,
		},
		type: 'ClassItru'
	},
	'教学大纲': {
		componentInf: {
			id: 'AssessmentScheme',
			isPass:true,
			title: '教学大纲',
			fileFormName: 'file',
			ajaxName: '教学大纲',
			items: [],
			saveAjax: saveAjax
		},
		type: 'AssessmentScheme',
	},
	'考试大纲': {
		componentInf: {
			id: 'AssessmentScheme',
			isPass:true,
			title: '考试大纲',
			ajaxName: '考试大纲',
			fileFormName: 'file',
			items: [],
			saveAjax: saveAjax
		},
		type: 'AssessmentScheme'
	},
	'电子教案': {
		componentInf: {
			id: 'AssessmentScheme',
			isPass:true,
			title: '电子教案',
			ajaxName: '电子教案',
			fileURL: fileURL,
			fileFormName: 'file',
			items: [],
			saveAjax: saveAjax
		},
		type: 'AssessmentScheme'
	},
	'知识点体系': {
		componentInf: {
			id: 'AssessmentScheme',
			isPass:true,
			title: '知识点体系',
			ajaxName: '知识点体系',
			fileURL: fileURL,
			fileFormName: 'file',
			items: [],
			saveAjax: saveAjax
		},
		type: 'AssessmentScheme'
	},
	'学习资源': {
		componentInf: {
			id: 'stuSource',
			isPass:true,
			title: '微视频',
			fileURL: fileURL,
			fileFormName: 'file',
			ajaxName: '学习资源',
			drops: [
				{
					id: 'soureTypeWarp',
					name: 'soureType',
					callback: selectSourceType
				}
			],
			videos: [],
			onlineSource: [],
			onlineURL: [],
			jcBooks: [],
			ckBooks: [],
			jyFile: [],
			jyAttachment:[],
			hkFile: [],
			xtFile: [],
			otherVideo: [],
			uploadFile: uploadFile,
			saveAjax: saveAjax,
			deleteFile: deleteFile
		},
		type: 'StudySource'
	},
	'导学方案': {
		componentInf: {
			id: 'AssessmentScheme',
			isPass:true,
			title: '导学方案',
			ajaxName: '导学方案',
			fileURL: fileURL,
			fileFormName: 'file',
			items: [],
			saveAjax: saveAjax
		},
		type: 'AssessmentScheme'
	},
	'考核方案': {
		componentInf: {
			id: 'AssessmentScheme',
			isPass:true,
			title: '考核方案',
			ajaxName: '考核方案',
			fileURL: fileURL,
			fileFormName: 'file',
			items: [],
			saveAjax: saveAjax
		},
		type: 'AssessmentScheme'
	}
};
view.onclick = function () {
	window.open('../classInfShow/classInfReview.html?classId='+courseNo);
}
back.onclick = function () {
	window.location.href='courseManagement.html';
}
