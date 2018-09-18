require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
require('es6-promise');
var BluMUI = require('../libs/classManageCheck/blueMonUI'),
				 ajaxPading = require('../libs/ajaxExpand.mini.min'),
			    unifyCode = getCookie('userId'),
				 host = courseCenter.host,
				 getCourseNameByNo = host + 'getCourseNameByNo',
				 getCourseStatus =  host + 'getCourseStatus',
				 submitAudit =  host + 'submitAudit',
				 hash = parseHash(window.location.href),
	          courseNo =    hash.classId,
				 sum = 0,
				 subModulesStatus = [],
				 courseName = document.getElementById('courseName'),
				 view = document.getElementById('view'),
	          review = document.getElementById('review'),
				 sumbitBtn = document.getElementById('pass'),
				 backBtn = document.getElementById('reject');
ajaxPading.init({
	type:'post',
	dataType:'json',
	name:'getMouduleInf',
	async:true
});
ajaxPading.init({
	name:'getClassName',
	type:'post',
	dataType:'json'
});

ajaxPading.send({
	data:{
		kcbh:courseNo
	},
	url:getCourseNameByNo,
	onSuccess:function (result) {
		var result = JSON.parse(result),
			data = result.data;
		if(data.length > 0 )
			courseName.innerHTML=data[0].kcmc;
		else{
			window.location.href= 'error.html';
		}
	}
},'getClassName');

// 初始化审核、驳回的信息

ajaxPading.send({
	data:{
		unifyCode: unifyCode,
		courseNo: courseNo
	},
	url:getCourseStatus,
	onSuccess:function(result){
		var   result = JSON.parse(result),
				meta = result.meta;
		if(meta.result == 100 ){
			var data = result.data,
				i,
				status = data.status,
				subModules = data.subModules,
				len = subModules.length;
			subModulesStatus.push('全选');
			if( len === 0 || status === '驳回待修改'){
				window.location.href = 'courseManagement.html?subModule=audit';
			}
			for( i = 0; i < len ; i++){
				subModulesStatus.push(subModules[i].name)
			}
			sum = len;
			BluMUI.create({
				id:'MouduleCheck',
				isCheck:false,
				modules:subModulesStatus
			},'MouduleCheck',document.getElementById('content'));
		}else{
			console.log('服务器发生错误!');
		}
	}
},'getMouduleInf');


// 通过

sumbitBtn.onclick = function () {
	var selectArray = BluMUI.result.MouduleCheck.state.selectArray,
		 passModules = [],
		 rejectModules = [],
		 note = review.value,
		 i,
		 len;
	for( i = 0 , len = selectArray.length ; i < len ; i ++){
		if(selectArray[i][0])
			passModules.push(subModulesStatus[i]);
		if(selectArray[i][1]){
			rejectModules.push(subModulesStatus[i])
		}
	}
	ajaxPading.send({
		data:{
			note:note,
			rejectModules:rejectModules,
			type:6,
			unifyCode:unifyCode,
			courseNo:courseNo
		},
		url:submitAudit,
		onSuccess:function (result) {
			var result = JSON.parse(result),
				meta = result.meta;
			if(meta.result == 100) {
				window.location.href = 'courseManagement.html?subModule=audit';
			}
			else{
				alert(meta.msg);
			}
		}
	},'getMouduleInf');
	return false;
}

backBtn.onclick = function () {
	window.location.href = 'courseManagement.html?subModule=audit';
}




// 预览

view.onclick = function () {
	window.open('../classInfShow/classInfReview.html?classId='+courseNo);
}


