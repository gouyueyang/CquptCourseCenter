import Alert from "../../util/alert.js";

require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
require('es6-promise');
var BluMUI = require('../../libs/masterAddEditor/masterAddEditor.js'),
	ajaxPading = require('../../libs/ajaxExpand.mini.min'),
	host = courseCenter.host,
	doc = document,
	query = parseHash(window.location.href),
	isEditor = query.isEditor || false,
	userId = query.masterId || '',
	unifyCode = getCookie('userId'),
	updateZj = host + 'updateZj',
	getJsLis = host + 'getJsList',
	getZj = host + 'getZj',
	addZj = host + 'addZj',
	// getCollege = host + 'getCollege',
	curSelectCollege = '',
	teacherName = '',
	addZjxn = host + 'addZjxn',
	loginURL = 'https://ids.cqupt.edu.cn/authserver/login?service=' + host + 'classList';

ajaxPading.init({
	name: 'outMaster',
	type: 'post',
	dataType: 'json',
	async: true,
	handleData: function (result) {
		return JSON.parse(result);
	}
});
ajaxPading.init({
	name: 'getInit',
	type: 'post',
	dataType: 'json',
	async: true,
	handleData: function (result) {
		return JSON.parse(result);
	}
});


// 添加校外专家
function addOutMaster(data, isEditor) {
	data.unifyCode = unifyCode;
	if (isEditor)
		data.userId = userId;
	ajaxPading.send({
		url: isEditor ? updateZj : addZj,
		data: data,
		onSuccess: function (result) {
			var meta = result.meta;
			if (meta.result == 100) {
				if (isEditor) {
					Alert.open({
						alertTip: "修改成功！",
						closeAlert: function () {}
					  });
				} else {
					Alert.open({
						alertTip: "添加成功！",
						closeAlert: function () {}
					  });
				}
			} else if (meta.result == 303) {
				confirm(result.meta.msg);
				window.location.href = loginURL;
			} else {
				Alert.open({
					alertTip: meta.msg,
					closeAlert: function () {}
				  });
			}

		},
		onFail: function () {
			Alert.open({
				alertTip: "添加失败！",
				closeAlert: function () {}
			  });
		}
	}, 'outMaster')

}
// 添加校内专家
function addMaster(data) {
	ajaxPading.send({
		url: addZjxn,
		data: {
			unifyCode: unifyCode,
			userIds: data.join(',')
		},
		onSuccess: function (result) {
			var meta = result.meta;
			if (meta.result == 100) {
				Alert.open({
					alertTip: "添加成功！",
					closeAlert: function () {}
				  });
				//刷新列表
				BluMUI.result.app.inside.setState({
					teaName: '',
					college: '',
				},console.log(this.state));
				BluMUI.result.app.inside.refresh(1);
			} else if (meta.result == 303) {
				confirm(result.meta.msg);
				window.location.href = loginURL;
			} else {
				Alert.open({
					alertTip: meta.msg,
					closeAlert: function () {}
				  });
			}
		}
	}, 'outMaster')
}


function getList(teaName, college, page) {
	ajaxPading.send({
		data: {
			unifyCode: unifyCode,
			userName: teaName,
			department: college,
			page: page,
			count: 8
		},
		url: getJsLis,
		onSuccess: function (result) {
			return result;
		},
		onFail: function () {
			return false;
		}
	}, 'getInit')
}

if (isEditor) {
	ajaxPading.send({
		url: getZj,
		data: {
			unifyCode: unifyCode,
			userId: userId
		},
		onSuccess: function (result) {
			var meta = result.meta;
			if (meta.result == 100) {
				var data = result.data;
				BluMUI.create({
					userId: userId,
					isEditor: isEditor,
					outMaster: {
						account: data[0].id,
						name: data[0].xm,
						sex: data[0].xb,
						department: data[0].dw,
						title: data[0].zc,
						research: data[0].xkly,
						identityId: data[0].sfzh,
						telePhone: data[0].lxdh,
						bankId: data[0].yhkh,
						email: data[0].dzyx,
						bank: data[0].khyh,
						ajax: addOutMaster
					}
				}, 'AddEditor', doc.getElementById('form'));
			} else if (meta.result == 303) {
				confirm(result.meta.msg);
				window.location.href = loginURL;
			} else {
				Alert.open({
					alertTip: meta.msg,
					closeAlert: function () {}
				  });
			}
		}
	}, 'getInit');

} else {
	BluMUI.create({
		id: 'app',
		userId: userId,
		isEditor: isEditor,
		master: {
			getList: getList,
			ajax: addMaster,
		},
		outMaster: {
			ajax: addOutMaster
		}
	}, 'AddEditor', doc.getElementById('form'));

}


(function () {
	var height;
	window.onload = function () {
		setTimeout(function () {
			height = document.documentElement.offsetHeight;
			if (window.frameElement) {
				window.frameElement.height = height
			}
		}, 0);
	};
	window.onresize = function () {
		setTimeout(function () {
			height = document.documentElement.offsetHeight;
			if (window.frameElement) {
				window.frameElement.height = height;
			}
		}, 0);
	};
})();

