require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
require('es6-promise');

var BluMUI = require('../../libs/msgCenter/showTopic');
var ajax = require('../../libs/post_ajax');
var hash = parseHash(window.location.href);

//查询数据的变量
let User = {
	id:""
}
let pageInfo={
	htid:"",
	hfid:"",
}
let Course = {
	kcbh: ''
};
User.id=getCookie('userId');
pageInfo.htid=parseHash(window.location.href).htid;
pageInfo.hfid=parseHash(window.location.href).hfid;

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
	
	let userType = null;//角色
	let qx = null;//权限
	let fjd = -1;//父节点
	let page = 1;
	let count =10;
	let htid = pageInfo.htid;
	let hfMsg = {};

	getTopic().then(topicInfo=>{
		topicInfo = topicInfo.htxx;
		Course.kcbh = topicInfo.kcbh;
		
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

			getDetailReplyListFun({htid,fjd,page,count}).then(res=>{
				hfMsg = res;
				BluMUI.create({
					id:'topic',
					userId:User.id,
					kcbh:Course.kcbh,
					hfMsg,
					htid:pageInfo.htid,
					hfid:pageInfo.hfid,
					topicInfo,
					pageInfo,
					qx,
					getDetailReplyListFun, // 获取话题回复列表
					publishReplyFun, // 发表回复
					topicOperateFun, // 话题操作
					replyOperateFun, // 回复操作
					reportOperateFun, // 举报操作
					commitReportFun, // 提交举报信息
					creatReportBox, //创建举报页面
				}, 'TopicDis', document.getElementById('topicDis'));
			});
			

			
		});

		
	}).catch(e => {
		console.log(e);
		// if (e === 101) {
		// 	window.location.href = 'error1.html';
		// } else {
		// 	window.location.href = 'error2.html';
		// }
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

function getTopic(){
	return new Promise((resolve,reject)=>{
		let data = null;
		ajax({
			url:courseCenter.host +'getTopic',
			data:{
				unifyCode:User.id,
				htid:pageInfo.htid
			},
			success(response){
				let result = JSON.parse(response);
				let {meta,data} = result;
				if(meta.result === 100){
					resolve(data);
				}else{
					reject(meta.result);
				}
			}
		});
	})
}

function getDetailReplyListFun({htid,fjd,page,count}){
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
	getReportTypeFun().then(result=>{
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
