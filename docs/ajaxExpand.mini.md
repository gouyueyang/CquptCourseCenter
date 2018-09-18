ajaxExpand.mini
=====

支持IE8请引入libs/json2.js文件

ajaxExpand.js的轻量级版本，去除了本次项目中不需要的部分


### 快速开始


``` 
ajaxExpanding.init({
    name:'myFirstAjax',
	type:"post",
	async:false,
	contentType:'text',
	accept:"text",
	charset:"utf-8",
	timeOut:1000
});
ajaxExpanding.send(
	url:"php/Form_Ajax.php",
	data:{
		name:"2344"
	}	,
	onProgress:function(loaded , total){
		console.log(loaded / total * 100 + '%')
	},
	onAbort:function(){
		console.log("请求已经中断");
	},
	onError:function(errorCode){
		console.log("请求过程中发生错误:" + errorCode);
	},
	onTimeOut:function(){/
		console.log("请求超时")
	},
	onSuccess:function(){/
		console.log("请求成功!");
	},
	onFail:function(){
		console.log("请求失败!");
	}
},'myFirstAjax')
	
```

### 方法及参数选项
 
ajaxExpanding.init([object])

配置ajax基本信息

- name:字符串,必须：ajaxExpand对象的名称
- type:字符串,可选：post、get(默认)
- async:布尔值,是否支持异步,可选:默认为false
- contentType:字符串，传输给服务器的数据类型,可选：file,text(默认)
- accept:字符串，希望从服务器接受到的数据类型,可选:json,text(默认)
- charset:字符串,可选
- timeOut:可选,单位(ms),请求超时的时间,同步时不要使用!!


ajaxExpanding.send([object],bindObject,name)

向服务器发送请求

[object]:

- url:必选,请求服务器的URL
- data:可选,默认为null。data值根据contentType而定：
  - text 字符串、对象
  - form form元素对象
  - json json对象
  - file file对应的表单字段DOM对象(只支持IE10+,低于IE10请将该DOM对象配置在初始化信息中)
- onProgress： 函数,可选,数据传输过程中调用的回调函数
- onAort： 函数,可选,请求中断的回调函数
- onError: 函数,可选,请求发生错误的回调函数
- onTimeOut 函数,可选,请求超时的回调函数
- onFail 函数,可选,请求失败的回调函数
- onSucccess 函数,可选,请求成功的回调函数
- onfileUpCallback 函数,可选,文件开始上传的回调函数

注意：IE10下的异步文件传输不会有上述的所有回调函数,不过可以在提交的时候生产另一个ajax请求，用来获取当前传输文件的情况以及结果。

bindOject 可选
将所有的回调函数绑定到bindOject这个对象中。

name 必须

ajaxExpand对象的名称


### 获取请求的结果

获取请求的结果有两种途径：

- 访问ajaxExpanding.result,当请求成功时候才会获得否则为null
- 请求成功时，请求的结果会传入onSuccess中的函数:

```
ajaxExpanding.send(
	url:"php/Form_Ajax.php",
	data:{
		name:"2344"
	}	,
	onSuccess:function(result){
		console.log(result);
		console.log(ajax.result);
	}
},'myFirstAjax')
```

### 更改ajax配置
初始化ajax配置信息后，可以根据需要在发生请求前修改一些配置信息,只需要直接访问并修改ajaxExpanding某个ajaxExpand对象对应的配置信息(只有初始化配置的信息才可修改)即可:

``` 

ajaxExpanding.init({
    name:'myFirstAjax',
	type:"post",
	async:false,
	contentType:'text',
	contentType:'form',
	accept:"text",
	charset:"utf-8",
	timeOut:1000
});

ajaxExpanding.myFirstAjax.type="post";
ajaxExpanding.myFirstAjax.async=true;
ajaxExpanding.myFirstAjax.timeOut=500;
``` 
