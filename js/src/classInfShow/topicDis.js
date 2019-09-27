require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
require('es6-promise');

var BluMUI = require('../../libs/classInfShow/topicDis');
var ajax = require('../../libs/post_ajax');
var hash = parseHash(window.location.href);

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
		}else if(userType == "管理员" ||userType == "督导"||userType == "任课教师" || userType == "课程负责人"){
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
			ssfw='班内';
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
				
				// jsSfrzh = classList.jxb ?  : (classList.allJxbList.filter(item=>item.SFRZH == User.id)!=[]?User.id:teacherList.jsList[0].sfrzh);
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

function publishTopicFun({ jxbbh, htbt, htnr, sfyxhf, dqzt }) {
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
				dqzt   //当前状态，（老师发表话题时，可勾选是否公开，1：默认班内开放；2：公开）

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

