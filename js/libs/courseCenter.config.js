var courseCenter = {
	//http://172.22.114.135:6535/
	// host:'http://localhost:8000'
	// //172.22.114.135
	host: 'http://172.20.2.139/'
}
function parseHash(URL) {
	var hash = decodeURI(URL).split('?')[1],
	//split('?')方法将字符串以"?"开割形成一个字符串数组
	//然后再通过索引[1]取出所得数组中的第二个元素的值
		result = {};
	if (hash) {
		var hashArry = hash.split('&'),
			i,
			keyValue,
			result = {},
			len;//声明变量
		for (i = 0, len = hashArry.length; i < len; i++) {
			keyValue = hashArry[i].split('=');
			result[keyValue[0]] = keyValue[1];
		}

	}
	return result;
}

// 获取cookie
function getCookie(c_name) {
	var c_start,
		c_end;
	if (document.cookie.length > 0) {
		c_start = document.cookie.indexOf(c_name + "=")
		if (c_start != -1) {
			c_start = c_start + c_name.length + 1
			c_end = document.cookie.indexOf(";", c_start)
			if (c_end == -1) c_end = document.cookie.length
			return decodeURI(document.cookie.substring(c_start, c_end))
		}
	}
	console.log(c_name == 'userId');
	if (c_name == 'userName') {
		return "游客";
	}
	if (c_name == 'userId') {
		//0102549
		//0102295
		//0102387
		//0102295
		return "0102215";
	} else if (c_name == 'masterId') {
		return "0102215";
	} else {
		return '';
	}

}

// 删除cookie
function delCookie(name) {
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = getCookie(name);
	if (cval != null)
		document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

function getElementsByClassName(elem, className) {
	var elems = elem.getElementsByTagName('*'),
		i,
		result = [],
		len;
	for (i = 0, len = elems.length; i < len; i++) {
		if (elems[i].class == className || elems[i].className == className) {
			result.push(elems[i]);
		}
	}
	return result;
}

function selfAdaptionFrame(id, cb) {
	var iframe = document.getElementById(id);
	var height;
	iframe.height = height;
	iframe.onload = function () {
		setTimeout(function () {
			try {
				height = iframe.contentWindow.document.documentElement.offsetHeight;
			} catch (e) { };
			try {
				height = iframe.contentDocument.documentElement.offsetHeight;
			} catch (e) { };
			iframe.height = height;
			if (cb)
				cb();
		}, 100);
	};
	window.onresize = function () {
		try {
			height = iframe.contentWindow.document.documentElement.offsetHeight;
		} catch (e) { };
		try {
			height = iframe.contentDocument.documentElement.offsetHeight;
		} catch (e) { };
		iframe.height = height;
		if (cb)
			cb();
	};
}
