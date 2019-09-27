require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
require('es6-promise');

var BluMUI = require('../../libs/msgCenter/showReply');
var ajax = require('../../libs/post_ajax');
import Alert from "../../util/alert.js";
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
// 	id:7800003
// };
// // alert(stuArr[rand].xm);
// let Course = {
// 	kcbh: 'A1040040'
// };

let infoBar = document.getElementById("infoBar");//获取右侧信息通知栏

	if(User.id == 1){
		infoBar.style.display = "none";
	}else {
		infoBar.style.display = "block";
	}

//回复列表初次渲染
let replyMsg = null;

searchReplyFun({sstype:'htmc',sstj:'',ssdx:'hfwd',page:1,count:10}).then(retReplgList=>{
    replyMsg = retReplgList;
    BluMUI.create({
        id:"replyDis",
        userId:User.id,
        replyMsg,
        searchReplyFun
    },'WatchReply',document.getElementById("replyDis"));
}).catch(e => {
    if (e === 101) {
        window.location.href = 'error1.html';
    } else {
        window.location.href = 'error2.html';
    }
});

function searchReplyFun({sstype, sstj, ssdx, page, count}) {
	return new Promise((resolve, reject) => {
		ajax({
			url: courseCenter.host+'searchReply',
			data: {
				unifyCode: User.id,
				sstype, //搜索方式（htmc：话题名称；kcmc：课程名称）
				sstj,  //搜索条件
				ssdx,  //搜索对象（hfwd:回复我的，whfd：我回复的）
				page, // int页码,
				count, // int每页显示数目
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