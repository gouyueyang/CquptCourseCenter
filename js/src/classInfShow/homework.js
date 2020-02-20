require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
require('es6-promise');

import Alert from "../../util/alert.js";

var BluMUI = require('../../libs/classInfShow/homework');
var ajaxPading = require('../../libs/ajaxExpand.mini.min');
var ajax = require('../../libs/post_ajax');
var hash = parseHash(window.location.href),
	host = courseCenter.host,
	downURL = host + 'fileDownLoad',// 下载链接
	deleteAttachment = host + 'deleteAttachment',
	loginURL = 'https://ids.cqupt.edu.cn/authserver/login?service=' + host + 'classList',
	doc = document;
var fjList = [];

var insertAttachment = host + 'insertTopicAttachment';
//查询数据的变量
let User={
	id:''
};
let Course={
	kcbh:''
};
User.id=getCookie('userId');
Course.kcbh=parseHash(window.location.href).classId;

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
// let Course = {
// 	kcbh: 'A1040040'
// };

if (hash.modelName === 'reply') {

	BluMUI.create({
		id: 'watchReply'
	}, 'WatchReply', document.getElementById('topicDis'))

} else if (hash.modelName === 'reportMan') {
	BluMUI.create({
		id: 'reportMan'
	}, 'ReportMan', document.getElementById('topicDis'))
} else if (hash.modelName === 'report') {
	BluMUI.create({
		id: 'topicReport'
	}, 'TopicReport', document.getElementById('topicDis'))
} else {
	// 话题模块初次渲染
	let teacherList = null;
	let classList = null;
	let topicList = null;
	let jsSfrzh = null;
	let userType = null;//角色
	let qx = null;//权限
	let ssfw = "公开";//搜索范围

	//根据角色划分权限
	getJs().then(data=>{
		userType = data.js || "游客";
		
		// alert(userType);

		getTeacherList().then(retTeacherList => {
			teacherList = retTeacherList;
			getClassListFun(teacherList.jsList[0].sfrzh).then(retClassList => {
				classList = retClassList;
				switch(userType){
					case '游客':jsSfrzh = teacherList.jsList[0].sfrzh;break;
					case '学生':classList.jxb && classList.jxb.length!=0 ? ssfw = "班内" :ssfw = "公开";ssfw == "班内" ? jsSfrzh = classList.jxb[0].SFRZH : jsSfrzh = teacherList.jsList[0].sfrzh;break;
					case '管理员':
					case '其他教师':jsSfrzh = teacherList.jsList[0].sfrzh;break;
					// case '督导':jsSfrzh = teacherList.jsList[0].sfrzh;break;
					case '督导':classList.jxb && classList.jxb.length!=0 ? jsSfrzh=classList.jxb[0].SFRZh : jsSfrzh=teacherList.jsList[0].sfrzh;break;
					case '任课教师':jsSfrzh = User.id;break;
					case '课程负责人':
						jsSfrzh = teacherList.jsList.filter(item=>item.sfrzh == User.id).length ==0?teacherList.jsList[0].sfrzh : User.id;break;
					default :break;
				}
				if(userType == "管理员" ||userType == "督导"||userType == "任课教师" || userType == "课程负责人"){
					ssfw = "班内";
				}
				isAssistant({jsSfrzh,xsSfrzh:User.id}).then(data=>{
					
					if(data.js=="助理"){
						userType = data.js;
						ssfw = "班内";
					}
					qx = setQx(userType);
					getClassListFun(jsSfrzh).then(retClassList => {
						classList = retClassList;
						getTopicListFun({ jxbh: classList.jxb && classList.jxb[0] ? classList.jxb[0].JXB : classList.allJxbList[0].JXB, pxtype: 'sjjx',  sstype: 'htmc',ssfw:ssfw, sstj: '', page: 1, count: 5 }).then(retTopicList => {
							topicList = retTopicList;
							BluMUI.create({
								id: 'topicDis',
								userId: User.id,
								userType,   //用户身份类型
								qx,    //用户权限
								userBan: classList.jxb && classList.jxb[0] ? classList.jxb[0].JXB : '',//学生用户所在班级
								teacherList,
								classList,
								topicList,
								teacherSelected: classList.jxb && classList.jxb[0] ? classList.jxb[0].SFRZH : jsSfrzh,
								banSelected: classList.jxb && classList.jxb[0] ? classList.jxb[0].JXB : classList.allJxbList[0].JXB,//选择班级
								getJs,
								isAssistant,
								setQx,
								getClassListFun, // 获取教学班列表
								getTopicListFun, //获取教学班话题列表
								getTopicFun, //根据话题id获取话题（回复页面点击回复或管理查看时进行的查询）
								getReplyListFun, // 获取话题回复列表
								banPublishTopicFun, //禁止发表话题
								publishTopicFun, // 发表话题
								publishReplyFun, // 发表回复
								// searchReplyFun, // 查看回复
								searchReportInfoFun, // 查询举报信息
								topicOperateFun, // 话题操作
								replyOperateFun, // 回复操作
								reportOperateFun, // 举报操作
								commitReportFun, // 提交举报信息
								creatReportBox, //创建举报页面
								createAssistantBox,//创建助理列表
								handleSaveAjax,
								deleteFile,
								saveAjax,
								setJxbNickname,
								deleteJxbNickname
							}, 'TopicDis', document.getElementById('topicDis'));
						}).then(()=>{
							var iframe = window.parent.document.getElementById('myIframe');
							var height;
			
							try {
								height = iframe.contentWindow.document.documentElement.offsetHeight;
							} catch (e) {};
							try {
								height = iframe.contentDocument.documentElement.offsetHeight;
							} catch (e) {};
							iframe.height = height;
						})
					})
				})
				// jsSfrzh = classList.jxb ?  : (classList.allJxbList.filter(item=>item.SFRZH == User.id)!=[]?User.id:teacherList.jsList[0].sfrzh);
				
				
			})
		}).catch(e => {
			if (e === 101) {
				window.location.href = 'error1.html';
			} else {
				window.location.href = 'error2.html';
			}
		});
	});
	
	
}


function getJs(){
	return new Promise((resolve,reject) => {
		let data = null;
		ajax({
			url: courseCenter.host + 'getJs',
			data: {
				unifyCode: User.id,
				kcbh:Course.kcbh
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
//根据姓名、学号搜索学生
function searchStu({xm,xh}){
	return new Promise((resolve,reject)=>{
		let data = null;
		ajax({
			url:courseCenter.host + 'getAssistantOption',
			data:{
				unifyCode:User.id,
				xm,
				xh
			},
			success(response){
				let result = JSON.parse(response);
				let {meta,data} = result;
				if(meta.result === 100){
					resolve(data.assistantOptionList);
				}else{
					reject(meta.result)
				}
			}
		})
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

function getTeacherList() {
	return new Promise((resolve, reject) => {
		let data = null;
		ajax({
			url: courseCenter.host + 'getTeacherList',
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

function getClassListFun(SFRZH) {
	return new Promise((resolve, reject) => {
		let data = null;
		ajax({
			url: courseCenter.host + 'getClassList',
			data: {
				unifyCode: User.id,
				kcbh: Course.kcbh,
				jssfrzh: SFRZH
			},
			success(response) {
				let result = JSON.parse(response);
				if (result.meta.result === 100) {
					data = result.data;
					resolve(data);
				} else {
					reject(result.meta.result);
				}
			}
		});
	});
}

function getTopicListFun({ jxbh, pxtype, sstype, ssfw, sstj, page, count }) {
	return new Promise((resolve, reject) => {
		ajax({
			url: courseCenter.host + 'getTopicList',
			data: {
				unifyCode: User.id,
				kcbh: Course.kcbh,
				jxbh,//String教学班号,
				pxtype,//String排序方式（sjsx:时间升序,sjjx:时间降序,rmpx:热门排序）,
				sstype,// String搜索方式（htmc:话题名称,zzxm:作者姓名）,
				ssfw,//String搜索范围(公开，班内)
				sstj,//String搜索条件（string）,
				page,//int页码,
				count,//int每页显示数目
				type:'作业'
			},
			success(response) {
				let result = JSON.parse(response);
				if (result.meta.result === 100) {
					resolve(result.data)
				} else {
					reject(result.meta.result)
				}
			}
		});
	});
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

function banPublishTopicFun({ jxbh, zt }) {
	return new Promise((resolve, reject) => {
		ajax({
			url: courseCenter.host + 'banPublishTopic',
			data: {
				unifyCode: User.id,
				kcbh: Course.kcbh,
				jxbh, // 教学班号
				zt
			},
			success(response) {
				let result = JSON.parse(response);
				if (result.meta.result === 100) {
					resolve(true)
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

function publishTopicFun({ jxbbh, htbt, htnr, sfyxhf, dqzt,fjList }) {
	return new Promise((resolve, reject) => {
		ajax({
			url: courseCenter.host + 'publishTopic',
			data: {
				unifyCode: User.id,
				kcbh: Course.kcbh,
				jxbbh, // 教学班号
				htbt, //话题标题
				htnr,//话题内容
				sfyxhf,//是否允许回复
				dqzt,   //当前状态，（老师发表话题时，可勾选是否公开，1：默认班内开放；2：公开）
				fjList:fjList.join(","),//附件列表
				type:'作业'//类型：作业、话题
			},
			success(response) {
				let result = JSON.parse(response);
				if (result.meta.result === 100) {
					resolve(result.meta);
				} else {
					reject(result.meta);
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

function searchReportInfoFun({ sstype, sstj, ssdx, page, count }) {
	return new Promise((resolve, reject) => {
		ajax({
			url: courseCenter.host + 'searchReply',
			data: {
				unifyCode: User.id,
				sstype, //搜索方式（htmc：话题名称；kcmc：课程名称）
				sstj,  //搜索条件
				ssdx, //搜索对象（htjb:话题举报；hfjb:回复举报；htczjl:话题操作记录；hfczjl:回复操作记录）
				page, //int页码,
				count, //int每页显示数目
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
	});
}

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
	window.parent.document.getElementById("reportBox").style.display = "block";
	getReportTypeFun().then(result=>{
		let reportTypeList = result;
		BluMUI.create({ 
			id: "reportBox", 
			htInfo, 
			hfInfo, 
			commitReportFun,
			reportTypeList,//举报类型列表
		 }, "TopicReport", window.parent.document.getElementById("reportWrap"));
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


function createAssistantBox(teacherSelected){
	window.document.getElementById("assistantBox").style.display = "block";
	
	
	getAssistant(teacherSelected).then(result=>{
		let assistantList = result;
		BluMUI.create({
			id:"assistantBox",
			assistantList,
			searchStu,
			deleteAssistant,
			addAssistant,
			jsSfrzh:teacherSelected,
			getAssistant
		}, "TopicAssistant", window.document.getElementById("assistantWrap"));
	}).catch(e => {
		console.log(e);
		// if (e === 101) {
		// 	window.location.href = 'error1.html';
		// } else {
		// 	window.location.href = 'error2.html';
		// }
	});
}

function getAssistant(teaId){
	return new Promise((resolve,reject)=>{
		ajax({
			url:courseCenter.host + 'getAssistant',
			data: {
				unifyCode:User.id,
				teaId,
				kcbh:Course.kcbh
			},
			success(response){
				let result = JSON.parse(response);
				if (result.meta.result == 100) {
					resolve(result.data.assistantList);
				} else {
					reject(result.meta.result);
				}
			}
		})
	})
}

function addAssistant({jsSfrzh,sfrzh,xh,xm,xymc}){
	return new Promise((resolve,reject)=>{
		ajax({
			url:courseCenter.host + 'addAssistant',
			data: {
				unifyCode:User.id,
				kcbh: Course.kcbh,
				jsSfrzh,
				sfrzh,    //助理身份认证号
				xh,
				xm,
				xymc
			},
			success(response){
				let result = JSON.parse(response);
				if(result.meta.result == 100){
					resolve(true);
				}else{
					reject(result.meta.msg);
				}
			}
		})
	})
}

function deleteAssistant(id){
	return new Promise((resolve,reject)=>{
		ajax({
			url: courseCenter.host + 'deleteAssistant',
			data: {
				unifyCode :User.id,
				assistantId: id
			},
			success(response) {
				let result = JSON.parse(response);
				if (result.meta.result == 100) {
					resolve(true);
				} else {
					reject(result.meta.result);
				}
			}
		})
	})
}

function setJxbNickname({jxbbh,jxbbm}){
	return new Promise((resolve,reject)=>{
		ajax({
			url: courseCenter.host + 'setJxbNickname',
			data: {
				unifyCode :User.id,
				kcbh: Course.kcbh,
				jxbbh,
				nickname:jxbbm
			},
			success(response) {
				let result = JSON.parse(response);
				if (result.meta.result == 100) {
					resolve(true);
				} else {
					reject(result.meta.result);
				}
			}
		})
	})
}

function deleteJxbNickname(jxbbh){
	return new Promise((resolve,reject)=>{
		ajax({
			url: courseCenter.host + 'deleteJxbNickname',
			data: {
				unifyCode :User.id,
				kcbh: Course.kcbh,
				jxbbh
			},
			success(response) {
				let result = JSON.parse(response);
				if (result.meta.result == 100) {
					resolve(true);
				} else {
					reject(result.meta.result);
				}
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

var handleSaveAjax = function (flag, result,  postData, that) {
	var data = result.data,
		meta = result.meta;
	if (flag == 1) {
		if (meta.result == 100) {
			var items;
			items = that.state.items;
			doc.getElementById('file').value = '';
			doc.getElementById('warn_file').innerHTML = '上传文件成功！';

			var fileName = data[0].fileName,
				originName = data[0].originName;
			var	fjid = data[0].id;
			fjList = [...fjList,fjid];
			
			items.push([
				{ value: originName },
				{ value: '删除', fileName: fileName, callback: deleteFile },
				{ value: '下载', downloadName: originName, fileName: fileName, callback: downloadFile }
			]);
			BluMUI.result.topicDis.sendTopic.setState({
				fjList:fjList,
				fjxxList:items
			})
			// that.setState({
			// 	items: items,
			// 	fileName: fileName,
			// 	// isUpload: true,
			// 	isDown: false
			// });

			// BluMUI.result.topicDis.sendTopic.setState({
			// 	fjList:[...BluMUI.result.topicDis.sendTopic.state.fjList,fjid]
			// },console.log(BluMUI.result.topicDis.sendTopic.state))
			

			
		} else if (meta.result == 303) {
			confirm(result.meta.msg);
			window.location.href = loginURL;
		}
		else {
			// that.setState({
			// 	isUpload: true
			// });
			document.getElementById('warn_file').innerHTML = '上传文件失败';
		}
	} else {
		
		// that.setState({
		// 	isUpload: true
		// });
		document.getElementById('warn_file').innerHTML = '上传文件失败';

	}
}

// ajax Save
var saveAjax = function (data,that) {
	var fail = null,
		success = null,
		check = null,
		start = null,
		url = insertAttachment;
	data.unifyCode = {
		value: User.id
	}
	data.courseNo = {
		value: Course.kcbh
	}

			
			data.type = {
				value: 8   //表示文件是话题讨论相关的文件
			};
			// start = function () {
			// 	that.setState({
			// 		isUpload: true
			// 	});
			// }
			success = function (result) {
				handleSaveAjax(1, result, data, that);
			};
			fail = function (result) {
				handleSaveAjax(0, result, data, that);
			};
			check = function (checkInfs) {
				var errorInf = checkInfs[0].errorInf || '',
					type = checkInfs[0].type,
					isCheck = checkInfs[0].isCheck;
				if (!isCheck)
					document.getElementById('warn_' + type).innerHTML = errorInf;
				else
					document.getElementById('warn_' + type).innerHTML = '正在上传文件...';
			};
			
	
	ajaxPading.send({
		data: data,
		url: url,
		onFail: fail,
		onSuccess: success,
		onCheck: check,
		onStart: start
	}, 'saveAjax', that);
}



// delete File
var deleteFile = function (listIndex,index,items) {
	var data = {
			unifyCode: {
				value: User.id
			},
			courseNo: {
				value: Course.kcbh
			},
			fileName: {
				value: items[index].fileName
			}
		};
	
		
	var url = deleteAttachment;
	data.type = {
		value: 8
	};
			
	

			ajaxPading.send({
				data: data,
				url: url,
				onSuccess: function (result) {
					if (result.meta.result == 100) {
						let fjList = BluMUI.result.topicDis.sendTopic.state.fjList;
						let fjxxList = BluMUI.result.topicDis.sendTopic.state.fjxxList;
						fjList.splice(listIndex,1);
						fjxxList.splice(listIndex,1);
						BluMUI.result.topicDis.sendTopic.setState({
							fjList:fjList,
							fjxxList:fjxxList
						})
						
					} else if (result.meta.result == 303) {
						confirm(result.meta.msg);
						window.location.href = loginURL;
					}
					else {
						Alert.open({
							alertTip: result.meta.msg,
							closeAlert: function () { }
						});
					}
				},
				onFail: function () {
				}
			}, 'delete');

};

// download File

var downloadFile = function (listIndex,index, items) {
	var fileName = items[index].fileName,
		downloadName = items[index].downloadName,
		downLoadIframes = window.frames['downLoad'];
	downLoadIframes.location.href = downURL + '?name=' + encodeURIComponent(downloadName) + '&oName=' + encodeURIComponent(fileName) + '&unifyCode=' + User.id;
}