require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
require('es6-promise');

var BluMUI = require('../../libs/msgCenter/showReport');
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
// let stuArr = [{sfrzh:'1648589',xm:'王鸿'}, {sfrzh:'1648691',xm:'刘涛'}, {sfrzh:'1648949',xm:'周松'}, {sfrzh:'1648540',xm:'黄发祥'}, {sfrzh:'1653498',xm:'贺洪建'}, {sfrzh:'0100826',xm:'纪良浩'}];
// let rand = Math.floor(Math.random() * stuArr.length);
// let User = {
// 	// id:'0100826'
// 	// id: stuArr[rand].sfrzh
// 	id:'7800003'

// };
// alert(stuArr[rand].xm);
// let Course = {
// 	kcbh: 'A1040040'
// };

//举报列表初次渲染

let infoBar = document.getElementById("infoBar");//获取右侧信息通知栏

	if(User.id == 1){
		infoBar.style.display = "none";
	}else {
		infoBar.style.display = "block";
	}


let reportMsg = null;
let userType = null;

getJs().then(data=>{
	userType = data.js || "游客";
	if(userType == "游客"){
		window.localtion.href = `https://ids.cqupt.edu.cn/authserver/login?service=${courseCenter.host}classList`
	};
	searchReportInfoFun({sstype:'htmc',sstj:'',ssdx:'htjb',page:1,count:10}).then(retReportList=>{
		reportMsg = retReportList;
		BluMUI.create({
			id:"reportDis",
			userId:User.id,
			userType,
			reportMsg,
			searchReportInfoFun,
			reportOperateFun,
			topicOperateFun,
			replyOperateFun
		},'ShowReport',document.getElementById("reportDis"));
	}).catch(e => {
		console.log(e);
		// if (e === 101) {
		//     window.location.href = './../classInfShow/error1.html';
		// } else {
		//     window.location.href = './../classInfShow/error2.html';
		// }
	});
}).catch(e => {
	console.log(e);
})
searchReportInfoFun({sstype:'htmc',sstj:'',ssdx:'htjb',page:1,count:10}).then(retReportList=>{
    reportMsg = retReportList;
    BluMUI.create({
        id:"reportDis",
		userId:User.id,
		userType,
        reportMsg,
        searchReportInfoFun,
		reportOperateFun,
		topicOperateFun,
		replyOperateFun
    },'ShowReport',document.getElementById("reportDis"));
}).catch(e => {
	console.log(e);
    // if (e === 101) {
    //     window.location.href = './../classInfShow/error1.html';
    // } else {
    //     window.location.href = './../classInfShow/error2.html';
    // }
});

function searchReportInfoFun({sstype, sstj, ssdx, jbr="",bjbr="", page, count}) {
	return new Promise((resolve, reject) => {
		ajax({
			url: courseCenter.host+'searchReportInfo',
			data: {
				unifyCode: User.id,
				sstype, //搜索方式（htmc：话题名称；kcmc：课程名称）
				sstj,  //搜索条件
				ssdx, //搜索对象（htjb:话题举报；hfjb:回复举报；htczjl:话题操作记录；hfczjl:回复操作记录）
				jbr,  //举报人
				bjbr,  //被举报人
				page, //int页码,
				count, //int每页显示数目
			},
			success(response) {
				let result = JSON.parse(response);
				if (result.meta.result === 100) {
					resolve(result.data);
				}else {
					reject(result.meta.result);
				}
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

function topicOperateFun({htid, cz,kcbh}) {
	return new Promise((resolve, reject) => {
		ajax({
			url: courseCenter.host+'topicOperate',
			data: {
				unifyCode: User.id,
				kcbh: kcbh || Course.kcbh, //String课程编号,
				htid, //int话题id
				cz, //String操作（删除、恢复、公开、设置班内可见、禁止回复、解除禁止回复）
			},
			success(response) {
				let result = JSON.parse(response);
				if (result.meta.result === 100) {
					resolve(true);
				}else {
					reject(result.meta.result);
				}
			}
		});
	})
}

function replyOperateFun({hfid, cz}) {
	return new Promise((resolve, reject) => {
		ajax({
			url: courseCenter.host+'replyOperate',
			data: {
				unifyCode: User.id,
				kcbh: Course.kcbh, //String课程编号,
				hfid, //int话题id
				cz, //String操作（删除、恢复）
			},
			success(response) {
				let result = JSON.parse(response);
				if (result.meta.result === 100) {
					resolve(true);
				}else {
					reject(result.meta.result);
				}
			}
		});
	})

}

function reportOperateFun({jbid, cz}) {
	return new Promise((resolve, reject) => {
		ajax({
			url: courseCenter.host+'reportOperate',
			data: {
				unifyCode: User.id,
				jbid, //int举报id
				cz, //String操作（删除、忽略、公开）
			},
			success(response) {
				let result = JSON.parse(response);
				if (result.meta.result === 100) {
					resolve(true);
				}else{
					reject(result.meta.result);
				}
			}
		});
	})
}