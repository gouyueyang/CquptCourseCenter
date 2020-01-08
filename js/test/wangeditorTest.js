require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
require('es6-promise');
var wangeditor = require("wangeditor");

window.onload = function () {
    let editor = new wangeditor("#editor");

	//开启debug模式
	editor.customConfig.debug = true;
	// 关闭粘贴内容中的样式
	editor.customConfig.pasteFilterStyle = false
	// 忽略粘贴内容中的图片
	editor.customConfig.pasteIgnoreImg = true
	// 使用 base64 保存图片
	//editor.customConfig.uploadImgShowBase64 = true
 


	// 上传图片到服务器
	editor.customConfig.uploadFileName = 'myFile'; //设置文件上传的参数名称
	editor.customConfig.uploadImgServer = 'http://localhost/uploadFile'; //设置上传文件的服务器路径
	editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024; // 将图片大小限制为 3M
	editor.customConfig.uploadImgMaxLength = 1;//限制一次上传一张
	//自定义上传图片事件
	editor.customConfig.uploadImgHooks = {
		before : function(xhr, editor, files) {
			
		},
		success : function(xhr, editor, result) {// 图片上传并返回结果，图片插入成功之后触发
			// xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
			var url = result.data[0];
			alert(url);
			editor.txt.append(url);
		},
		fail : function(xhr, editor, result) {
			console.log("上传失败,原因是"+result);
		},
		error : function(xhr, editor) {
			console.log("上传出错");
		},
		timeout : function(xhr, editor) {
			console.log("上传超时");
		},
		// 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
    	// （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
    	customInsert: function (insertImg, result, editor) {
    	    // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
    	    // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
    	    // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
    	    var url = result.data[0];
    	    insertImg(url);
    	    // result 必须是一个 JSON 格式字符串！！！否则报错
    	}
	};
 
	editor.create();
}