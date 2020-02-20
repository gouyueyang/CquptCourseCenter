require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
require('es6-promise');

var BluMUI = require('../../libs/msgCenter/showHomework');
var ajaxPading = require('../../libs/ajaxExpand.mini.min');
var ajax = require('../../libs/post_ajax');
var hash = parseHash(window.location.href);

var host = courseCenter.host,
	downURL = host + 'fileDownLoad',// 下载链接
	deleteAttachment = host + 'deleteTopicFile',
	loginURL = 'https://ids.cqupt.edu.cn/authserver/login?service=' + host + 'classList',
	doc = document,
	fjList = [];

//查询数据的变量
let User = {
	id: ""
}
let pageInfo = {
	htid: "",
	hfid: "",
}
let Course = {
	kcbh: ''
};
User.id = getCookie('userId');
pageInfo.htid = parseHash(window.location.href).zyid ? parseHash(window.location.href).zyid.split("#")[0] : "";

/*模拟数据*/
// let stuArr = [{sfrzh:'1',xm:'游客'},{sfrzh:'7800003',xm:'苟月阳'},{sfrzh:'1642495',xm:'张芩'},{sfrzh:'1648589',xm:'王鸿'}, {sfrzh:'1648691',xm:'刘涛'}, {sfrzh:'1648949',xm:'周松'}, {sfrzh:'1648540',xm:'黄发祥'}, {sfrzh:'1653498',xm:'贺洪建'}, {sfrzh:'0100826',xm:'纪良浩'},{sfrzh:'0102387',xm:'蔡婷'}];
// let rand = Math.floor(Math.random() * stuArr.length);
// let User = {
// 	// id:'0100826'
// 	// id:'1'
// 	// id: stuArr[rand].sfrzh
// 	// id:'0102387'
// 	id:'7800003'
// };
// let pageInfo={
// 	htid:"45",
// 	hfid:"87",
// }
// let Course = {
// 	kcbh: ''
// };

let infoBar = document.getElementById("infoBar");//获取右侧信息通知栏

if (User.id == 1) {
	infoBar.style.display = "none";
} else {
	infoBar.style.display = "block";
}



// 话题模块初次渲染

let userType = null;//角色
let qx = null;//权限
let fjd = -1;//父节点
let page = 1;
let count = 10;
let htid = pageInfo.htid;
let hfid = pageInfo.hfid;
let hfMsg = {};
let topicInfo = {};



getTopic().then(topicInfo => {

	topicInfo = topicInfo.htxx;
	Course.kcbh = topicInfo.kcbh;

	let courseLinkUrl = `${courseCenter.host}${Course.kcbh}`;
	document.getElementById("courseName").innerHTML = `<a href=${courseLinkUrl} target="_blank">${topicInfo.kcmc}</a>`;

	//根据角色划分权限
	getJs().then(data => {
		userType = data.js || "游客";
		isAssistant({jsSfrzh:topicInfo.jssfrzh,xsSfrzh:User.id}).then(data=>{
			
			if(data.js=="助理"){
				userType = "助理";
			}
			qx = setQx(userType);
			getTopicFj().then(res => {
			if (res.list) {
				fjList = res;
			} else {
				fjList = { list: [] }
			}
			if (hfid != "") {
				getReplyPageNum({ htid, hfid }).then(res => {
					let hfCount = res.count;
					page = Math.round(hfCount / count) + 1;
					pageInfo.hfid = res.hfid;

				}).then(() => {
					getDetailReplyListFun({ htid, fjd, page, count }).then(res => {
						hfMsg = res;
						BluMUI.create({
							id: 'topic',
							userId: User.id,
							userType,
							kcbh: Course.kcbh,
							hfMsg,
							htid: pageInfo.htid,
							hfid: pageInfo.hfid,
							topicInfo,
							pageInfo,
							qx,
							fjList,
							getDetailReplyListFun, // 获取话题回复列表
							publishReplyFun, // 发表回复
							topicOperateFun, // 话题操作
							replyOperateFun, // 回复操作
							reportOperateFun, // 举报操作
							commitReportFun, // 提交举报信息
							creatReportBox, //创建举报页面
							getTopicFj,//获取话题附件
							deleteFile,
							downloadFile
						}, 'TopicDis', document.getElementById('topicDis'));
					});
				});
			} else {
				getDetailReplyListFun({ htid, fjd, page, count }).then(res => {

					hfMsg = res;
					BluMUI.create({
						id: 'topic',
						userId: User.id,
						userType,
						kcbh: Course.kcbh,
						hfMsg,
						htid: pageInfo.htid,
						hfid: pageInfo.hfid,
						topicInfo,
						pageInfo,
						qx,
						fjList,
						getDetailReplyListFun, // 获取话题回复列表
						publishReplyFun, // 发表回复
						topicOperateFun, // 话题操作
						replyOperateFun, // 回复操作
						reportOperateFun, // 举报操作
						commitReportFun, // 提交举报信息
						creatReportBox, //创建举报页面
						getTopicFj,//获取话题附件
						deleteFile,
						downloadFile
					}, 'TopicDis', document.getElementById('topicDis'));
				});
			}
			})
		})

	});


}).catch(e => {
	console.log(e);
	// if (e === 101) {
	// 	window.location.href = 'error1.html';
	// } else {
	// 	window.location.href = 'error2.html';
	// }
});



function getJs() {
	return new Promise((resolve, reject) => {
		let data = null;
		ajax({
			url: courseCenter.host + 'getJs',
			data: {
				unifyCode: User.id,
				kcbh: Course.kcbh
			},
			success(response) {
				let result = JSON.parse(response);
				let { meta, data } = result;
				if (meta.result === 100) {
					resolve(data);
				} else {
					reject(meta.result);
				}
			}
		});
	})
}

//确认学生当前是否为助理
function isAssistant({jsSfrzh,xsSfrzh}){ //课程编号，教师身份认证号，学生身份认证号
	return new Promise((resolve,reject) => {
		let data = null;
		ajax({
			url: courseCenter.host + 'isAssistant',
			data: {
				unifyCode: User.id,
				kcbh:Course.kcbh,
				jsSfrzh,
				xsSfrzh
			},
			success(response) {
				let result = JSON.parse(response);
				let { meta, data } = result;
				if (meta.result === 100) {
					resolve(data);
				} else {
					reject(meta.result);
				}
			}
		});
	})
}

//设置权限
function setQx(userType){
	let qx = null;
	if(userType=="游客"){
		qx = {
			publicTopic:false,  //发布话题
			addReply:false,		//回复
			addReport:false,		//举报
			deleteTopic:false,  //删除话题
			deleteReply:false,  //删除回复
			banPublicTopic:false,//禁止发布话题
			setBanReply:false,  //设置禁止回复
			openTopic:false,    //公开话题
		};
	}else if(userType == "学生"){
		qx = {
			publicTopic:true,  //发布话题
			addReply:true,		//回复
			addReport:true,		//举报
			deleteTopic:true,  //删除话题
			deleteReply:true,  //删除回复
			banPublicTopic:false,//禁止发布话题
			setBanReply:true,  //设置禁止回复
			openTopic:false,    //公开话题
		};
	}else if(userType == "管理员" ||userType == "督导"||userType == "任课教师" || userType == "课程负责人"||userType=="助理"){
		qx = {
			publicTopic:true,  //发布话题
			addReply:true,		//回复
			addReport:true,		//举报
			deleteTopic:true,  //删除话题
			deleteReply:true,  //删除回复
			banPublicTopic:true,//禁止发布话题
			setBanReply:true,  //设置禁止回复
			openTopic:true,    //公开话题
		};
	}else if(userType == "其他教师"){
		qx = {
			publicTopic:false,  //发布话题
			addReply:true,		//回复
			addReport:true,		//举报
			deleteTopic:false,  //删除话题
			deleteReply:true,  //删除回复
			banPublicTopic:false,//禁止发布话题
			setBanReply:false,  //设置禁止回复
			openTopic:false,    //公开话题
		};
	};
	return qx;
}

function getTopic() {
	return new Promise((resolve, reject) => {
		let data = null;
		ajax({
			url: courseCenter.host + 'getTopic',
			data: {
				unifyCode: User.id,
				htid: pageInfo.htid
			},
			success(response) {
				let result = JSON.parse(response);
				let { meta, data } = result;
				if (meta.result === 100) {
					resolve(data);
				} else {
					reject(meta.result);
				}
			}
		});
	})
}
// 获取附件
function getTopicFj() {
	return new Promise((resolve, reject) => {
		let data = null;
		ajax({
			url: courseCenter.host + 'queryTopicAttachment',
			data: {
				unifyCode: User.id,
				courseNo: Course.kcbh,
				htid: htid,
				type: 8
			},
			success(response) {
				let result = JSON.parse(response);
				let { meta, data = {} } = result;
				// if(meta.result === 100){
				resolve(data);
				// }else{
				// 	reject(data);
				// }
			}
		})
	})
}

// ajax返回数据基本处理

var handleData = function (result) {
	return JSON.parse(result);
}


// 初始化ajax对象

ajaxPading.init({
	type: 'post',
	dataType: 'form',
	handleData: handleData,
	name: 'saveAjax',
	async: true
});

// 单独上传文件的ajax

ajaxPading.init({
	type: 'post',
	dataType: 'form',
	name: 'file',
	handleData: handleData,
	async: true
});

// 删除文件的ajax
ajaxPading.init({
	type: 'post',
	dataType: 'form',
	handleData: handleData,
	name: 'delete',
	async: true
});

// delete File
var deleteFile = function ({ listIndex, index, that, items }) {
	return new Promise((resolve, reject) => {
		var data = {
			unifyCode: {
				value: User.id
			},
			courseNo: {
				value: Course.kcbh
			},
			fileName: {
				value: items[index].fileName
			},
			htid:{
				value: htid
			}
		};

		console.log(data);

		var url = deleteAttachment;
		data.type = {
			value: 8
		};
		ajaxPading.send({
			data: data,
			url: url,
			onSuccess: function (result) {
				if (result.meta.result == 100) {
					items.splice(0, 3);
					that.setState({
						items: items
					});
					
					resolve(true);
				} else if (result.meta.result == 303) {
					confirm(result.meta.msg);
					window.location.href = loginURL;
					reject(false);

				}else {
					Alert.open({
						alertTip: result.meta.msg,
						closeAlert: function () { }
					});
					reject(false);
				}
			},
			onFail: function () {
				reject(result.data);
			}
		}, 'delete');
	})


};

// download File

var downloadFile = function ({ listIndex, index, that, items }) {
	var fileName = items[index].fileName,
		downloadName = items[index].downloadName,
		downLoadIframes = window.frames['downLoad'];
	downLoadIframes.location.href = downURL + '?name=' + encodeURIComponent(downloadName) + '&oName=' + encodeURIComponent(fileName) + '&unifyCode=' + User.id;
}

function getReplyPageNum({ htid, fjd, hfid }) {
	return new Promise((resolve, reject) => {
		ajax({
			url: courseCenter.host + 'getReplyPageNum',
			data: {
				unifyCode: User.id,
				htid, //int话题id,
				hfid,
			},
			success(response) {
				let result = JSON.parse(response);
				if (result.meta.result === 100) {
					resolve(result.data);
				} else {
					reject(result.meta.result)
				}
			}
		});
	})
	// let result;
	// ajax({
	// 	url: courseCenter.host + 'getReplyPageNum',
	// 	data:{
	// 		unifyCode:User.id,
	// 		htid,
	// 		hfid
	// 	},
	// 	success(response){
	// 		let res = JSON.parse(response);
	// 		if(res.meta.result === 100){
	// 			result = res.data;
	// 		}else{
	// 			result = result.meta.result;
	// 		}
	// 		console.log(result);
	// 		return result;
	// 	}
	// })
}
function getDetailReplyListFun({ htid, fjd, page, count }) {
	return new Promise((resolve, reject) => {
		ajax({
			url: courseCenter.host + 'getDetailReplyList',
			data: {
				unifyCode: User.id,
				htid, //int话题id,
				fjd,//父节点
				page, //iint页码,
				count, //iint每页显示数目
			},
			success(response) {
				let result = JSON.parse(response);
				if (result.meta.result === 100) {
					resolve(result.data);
				} else {
					reject(result.meta.result)
				}
			}
		});
	})
}


function getReplyListFun({ htid, page, count }) {
	return new Promise((resolve, reject) => {
		ajax({
			url: courseCenter.host + 'getReplyList',
			data: {
				unifyCode: User.id,
				htid, //int话题id,
				page, //iint页码,
				count, //iint每页显示数目
			},
			success(response) {
				let result = JSON.parse(response);
				if (result.meta.result === 100) {
					resolve(result.data);
				} else {
					reject(result.meta.result)
				}
			}
		});
	})
}


function getTopicFun({ jxbh, htid }) {
	return new Promise((resolve, reject) => {
		ajax({
			url: courseCenter.host + 'getTopic',
			data: {
				unifyCode: User.id,
				kcbh: Course.kcbh,
				jxbh, // 教学班号
				htid, //int话题id,
			},
			success(response) {
				let result = JSON.parse(response);
				if (result.meta.result === 100) {
					resolve(result.data);
				} else {
					reject(result.meta.result);
				}
			}
		});
	})
}



function publishReplyFun({ htid, hfnr, hfdxsfrzh, zhzhf, fjd }) {
	return new Promise((resolve, reject) => {
		ajax({
			url: courseCenter.host + 'publishReply',
			data: {
				unifyCode: User.id,
				htid, //int话题id,
				hfnr,//回复内容
				hfdxsfrzh,//回复对象身份认证号
				hflc: 1,//回复楼层
				zhzhf,//主或子回复  （1：主回复；2：子回复）
				fjd,//父节点（如果是子回复，值回复ID，如果是主回复，值为‘-1’）
			},
			success(response) {
				let result = JSON.parse(response);
				if (result.meta.result === 100) {
					resolve(true);
				} else {
					reject(false);
				}
			}
		});
	})
}

// function searchReplyFun({sstype, sstj, ssdx, page, count}) {
// 	return new Promise((resolve, reject) => {
// 		ajax({
// 			url: courseCenter.host+'searchReply',
// 			data: {
// 				unifyCode: User.id,
// 				sstype, //搜索方式（htmc：话题名称；kcmc：课程名称）
// 				sstj,  //搜索条件
// 				ssdx,  //搜索对象（hfwd:回复我的，whfd：我回复的）
// 				page, // int页码,
// 				count, // int每页显示数目
// 			},
// 			success(response) {
// 				let result = JSON.parse(response);
// 				if (result.meta.result === 100) {
// 					resolve(result.data);
// 				}else {
// 					reject(result.meta.result);
// 				}
// 			}
// 		});
// 	});
// }



function topicOperateFun({ htid, cz }) {
	return new Promise((resolve, reject) => {
		ajax({
			url: courseCenter.host + 'topicOperate',
			data: {
				unifyCode: User.id,
				kcbh: Course.kcbh, //String课程编号,
				htid, //int话题id
				cz, //String操作（删除、恢复、公开、设置班内可见、禁止回复、解除禁止回复）
			},
			success(response) {
				let result = JSON.parse(response);
				if (result.meta.result === 100) {
					resolve(true);
				} else {
					reject(result.meta.result);
				}
			}
		});
	})
}

function replyOperateFun({ hfid, cz }) {
	return new Promise((resolve, reject) => {
		ajax({
			url: courseCenter.host + 'replyOperate',
			data: {
				unifyCode: User.id,
				kcbh: Course.kcbh, //String课程编号,
				hfid, //int话题id
				cz, //String操作（删除、恢复、公开、设置班内可见）
			},
			success(response) {
				let result = JSON.parse(response);
				if (result.meta.result === 100) {
					resolve(true);
				} else {
					reject(result.meta.result);
				}
			}
		});
	})

}

function reportOperateFun({ jbid, cz }) {
	return new Promise((resolve, reject) => {
		ajax({
			url: courseCenter.host + 'reportOperate',
			data: {
				unifyCode: User.id,
				kcbh: Course.kcbh, //String课程编号,
				jbid, //int举报id
				cz, //String操作（删除、忽略、公开）
			},
			success(response) {
				let result = JSON.parse(response);
				if (result.meta.result === 100) {
					resolve(true);
				} else {
					reject(result.meta.result);
				}
			}
		});
	})
}

function creatReportBox({ htInfo, hfInfo }) {
	document.getElementById("reportBox").style.display = "block";
	getReportTypeFun().then(result => {
		let reportTypeList = result;
		BluMUI.create({
			id: "reportBox",
			htInfo,
			hfInfo,
			commitReportFun,
			reportTypeList,//举报类型列表
		}, "TopicReport", document.getElementById("reportWrap"));
	}).catch(e => {
		if (e === 101) {
			window.location.href = 'error1.html';
		} else {
			window.location.href = 'error2.html';
		}
	});

}

function commitReportFun({ htid, hfid, jblx, jbly }) {
	return new Promise((resolve, reject) => {
		ajax({
			url: courseCenter.host + 'commitReport',
			data: {
				unifyCode: User.id,
				htid, //int话题id,
				hfid, //int回复id,
				jblx, //String举报类型,
				jbly, //String举报理由

			},
			success(response) {
				let result = JSON.parse(response);
				if (result.meta.result === 100) {
					resolve(true);
				} else {
					reject(result.meta.result);
				}
			}
		});
	})
}

function getReportTypeFun() {
	return new Promise((resolve, reject) => {
		ajax({
			url: courseCenter.host + 'getReportType',
			data: {
				zdmc: '举报类型'
			},
			success(response) {
				let result = JSON.parse(response);
				if (result.meta.result == 100) {
					resolve(result.data.xlxxList);
				} else {
					reject(result.meta.result);
				}
			}
		})
	})
}
