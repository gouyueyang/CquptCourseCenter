var courseCenter = {
	//http://172.22.114.135:6535/
	// host:'http://localhost:80/'
    // //172.22.114.135
    
	host: 'http://172.20.2.139/',
	// host:'http://cc.cqupt.edu.cn/'

	idsUrl:'https://ids.cqupt.edu.cn/authserver/login',
};
//日期格式
var DateFormat = {
	yearFormat: 'YYYY',
	monthFormat: "YYYY-MM",
	dayFormat: "YYYY-MM-DD",
	timeFormat: "YYYY-MM-DD hh:ff:ss",
	startTimeFormat: "YYYY-MM-DD 00:00:00",
	endTimeFormat: "YYYY-MM-DD 23:59:59"
};

var confirmFlag = true;      //登陆超时弹框标志，防止多次弹框，为true时表示可以弹框
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
// document.cookie.setMaxAge(20);
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
	// console.log(c_name == 'userId');
	if (c_name == 'userName') {
		return "游客";
	}
	if (c_name == 'userId') {
		return "1";
	} else if (c_name == 'masterId') {
		return "管理员";
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

//兼容性判断
// $(function(){
//     //判断浏览器的内核及操作系统
//     BrowserType();
//     $('.browser-list-btn').on('click',function(){
//         if($(this).hasClass('openFlag')){
//             $('#browserListBox').addClass('browser-btn-hide');
//             $(this).removeClass('openFlag').find('a').text('点击查看浏览器兼容列表');

//         }else{
//             $('#browserListBox').removeClass('browser-btn-hide');
//             $(this).addClass('openFlag').find('a').text('点击收起浏览器兼容列表');
//         }
//     });

//     $('#animateBtn').on('click',function(){
//         $(".browser-pic-group").animate({"margin-left":"-41px"},function(){
//             $(".browser-pic-bitmap").fadeIn(2000).removeClass('browser-btn-hide');
//         });
//         $(this).addClass('browser-btn-visibility');
//     });

//     //仍要访问
//     $('.stillVisitPage').on('click',function(){
//         window.location.href = "../index.html?browser=no";
//     });



//     //判断当前浏览类型
//     function BrowserType()
//     {
//         var browserFlag='';
//         var IeVersion = '';
//         var browserVersion='';
//         var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
//         var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
//         var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
//         var isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE; //判断是否IE的Edge浏览器
//         var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
//         var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
//         var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器
//         var isUcBrowser = userAgent.indexOf("UBrowser") > -1; // 判断UC浏览器
//         var IeNoSupportFlag = true;
//         var browserTypeFlag="";
//         var flag = false;
//         var support_flag = true;
// 		var OsObject = window.navigator.userAgent;

//         if (isIE)
//         {
//             IeNoSupportFlag = false;
//             browserTypeFlag = "IE";
//         }

//         if (isFF) {
//             browserTypeFlag= "Firefox";
//             flag =true;
//         }
//         if (isOpera) {
//             browserTypeFlag= "Opera";
//             flag=true;
//         }
//         if (isSafari) {
//             browserTypeFlag= "Safari";
//             flag =true;
//         }
//         if (isChrome) {
//             browserTypeFlag= "Chrome";
//             flag = true;
//         }
//         if (isEdge) {
//             browserTypeFlag= "Edge";
//         }
//         if(isUcBrowser){
//             browserTypeFlag= "UC浏览器";
//         }
//         if(!(isFF ||isOpera||isSafari||isChrome||isEdge||isUcBrowser)){
//             browserTypeFlag= "未知浏览器";
//         }

//         if (!!window.ActiveXObject || "ActiveXObject" in window) {

//             // if (OsObject.indexOf("MSIE") > 0) {
//             //     var version = OsObject.match(/MSIE \d+/i);
//             //     var versionNum = version[0].match(/\d+/i);
//             //     if (parseInt(versionNum) >= 9) {
//             //         flag = false;
//             //     }
//             // } else
//             // if (OsObject.toLowerCase().indexOf("trident") > -1 && OsObject.indexOf("rv") > -1) {
//             //     flag = false;
//             // }
//             flag = false;
//         }

//         if(!flag){
//             support_flag = filterNavigatorNoSupport(OsObject);
//         }

        
        
//         if(flag && support_flag){
//             //浏览器支持，跳转到平台的url.
//             return;
//         }else{
//             window.location.href=courseCenter.host+'CquptCourseCenter/compatibility/browerTips.html';

//         }


//     }

//     function goIndex(){
//        /* var newUrl = '';
//         var host = window.location.host;
//         var pathname = window.location.pathname;
//         var updateurl = pathname.split('/');
//         var newupdateurl = '';
//         for (var i = 0; i < updateurl.length; i++) {
//             debugger;
//             if ((updateurl[i].indexOf('portal'))> -1){
//                 newupdateurl +="";
//             }else if((updateurl[i].indexOf('browerTips.html')) > -1){
//                 newupdateurl += '/' + 'index.html';
//             }else if($.trim(updateurl[i])!=''){
//                 newupdateurl += '/' + updateurl[i];
//             }

//         }
//         newUrl = host + newupdateurl;
//         window.location.href = window.location.protocol + '//' + newUrl;*/

//     }

//     /**
//      * 过滤非主流浏览器
//      * @param OsObject
//      * @returns {boolean}
//      */
//     function filterNavigatorNoSupport(OsObject) {
//         //遨游 Maxthon  猎豹 LBBROWSER  百度 BIDUBrowser  淘宝 TaoBrowser UC  UBrowser
       
//         if ( OsObject.indexOf("UBrowser") > 0 || OsObject.indexOf("Maxthon") > 0 ||  OsObject.indexOf("LBBROWSER") > 0 || OsObject.indexOf("BIDUBrowser") > 0 || OsObject.indexOf("TaoBrowser") > 0) {
//             return false;
//         }
//         return true;
//     }




// });