require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
require('es6-promise');
var BluMUI = require('../../libs/masterSortEditor/blueMonUI.js'),
	ajaxPading = require('../../libs/ajaxExpand.mini.min.js'),
	ajax = require('../../libs/post_ajax.js'),
	host = courseCenter.host,
	doc = document,
	unifyCode = getCookie('userId'),
	query = parseHash(window.location.href),
	groupBatch = query.groupBatch || '', //分组项名字
	isEditor = query.isEditor || false,
	deleteFzx = host + 'deleteFzx',
	getFzList = host + 'getFzList',
	addFz = host + 'addFz';

	//配置添加分组项的ajax参数
ajaxPading.init({
	name: 'addFz',
	type: 'post',
	dataType: "json",
	async: true,
	handleData: function (result) {
		return JSON.parse(result);
	}
});
//配置删除分组项的ajax参数
ajaxPading.init({
	name: 'deleteFzx',
	type: 'post',
	dataType: "json",
	async: true,
	handleData: function (result) {
		return JSON.parse(result);
	}
});
//配置查询分组项的ajax参数
ajaxPading.init({
	name: 'getFzList',
	type: 'post',
	dataType: "json",
	async: true,
	handleData: function (result) {
		return JSON.parse(result);
	}
});
function showFzxList() {
	if(groupBatch != ''){
		ajaxPading.send({
			data: {
				unifyCode: unifyCode,
				groupBatch: groupBatch,
				page: 1,
				count: 1
			},
			url: getFzList,
			onSuccess: function (result) {
				var meta = result.meta;
				if (meta.result == 100) {
					var data = result.data,
						groups = data.groupList[0].groups,
						items = [],
						fzx = '';
					for (var i = 0, len = groups.length; i < len; i++) {
						items.push({ name: groups[i].fzx });
						if (i === len - 1) {
							fzx += groups[i].fzx;
						} else {
							fzx += groups[i].fzx + ',';
						}
					}
					BluMUI.result.app.setState({
						items: items,
						fzx: fzx
					});
					//console.log(items);
				} else {
					//console.log(meta.msg);
				}
			},
			onFail: function () {

			}
		}, 'getFzList');
	}
}
showFzxList();

function Delete(item, index) {
	var that = BluMUI.result.app,
		items = that.state.items;
	ajaxPading.send({
		url: deleteFzx,
		data: {
			unifyCode: unifyCode,
			groupBatch: groupBatch,
			group: items[index].name
		},
		onSuccess: function (result) {
			var meta = result.meta;
			if (meta.result == 100) {
				items.splice(index, 1);
				that.setState({
					items: items
				});
			} else {
				alert(meta.msg);
			}
		}
	}, 'deleteFzx');
	

}
function add(value, pc) {
	ajaxPading.send({
		url: addFz,
		data: {
			unifyCode: unifyCode,
			groupBatch: pc,
			groups: value || ''
		},
		onSuccess: function (result) {
			var meta = result.meta;
			if (meta.result == 100) {
				groupBatch=pc;
				showFzxList();
				BluMUI.result.app.fzxTextarea.value = '';
			} else {
				alert(meta.msg);
			}
		},
		onFail: function () {
			alert('服务器发生错误!');
		}
	}, 'addFz');
}

BluMUI.create({
	id: 'app',
	callback: Delete,
	// save: save,
	add: add,
	pc: groupBatch,
	items: [],
	isEditor: isEditor
}, 'App', doc.getElementById('form'));

