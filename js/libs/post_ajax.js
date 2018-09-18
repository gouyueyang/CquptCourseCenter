// 登录判断与处理
function loginCheck(loginData) {
  var status = [100, 101, 102, 303];
  if (!Array.indexOf) {  
    Array.prototype.indexOf = function (obj) {  
      for (var i = 0; i < this.length; i++) {  
        if (this[i] == obj) {  
          return i;  
        }
      }
      return -1;  
    }  
  }
  if(status.indexOf(loginData.meta.result)===-1) { 
    alert(loginData.meta.msg);
  }
  if(loginData.meta.result==303) {
    confirm(loginData.meta.msg);
    window.location.href="https://ids.cqupt.edu.cn/authserver/login?service="+courseCenter.host+"classList";
  }
}

// 封装ajax(BluMUI.result.Title.props.ajaxing)
var post_ajax=function(options) {
  options = options || {};
  // options.dataType = "json";

  //创建 - 非IE6 - 第一步
  if (window.XMLHttpRequest) {
    var xhr = new XMLHttpRequest();
  } else { //IE6及其以下版本浏览器
    var xhr = new ActiveXObject('Microsoft.XMLHTTP');
  }

  //数据处理
  var arr=[];
  for(var name in options.data) {
      arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(options.data[name]));
  }
  var params=arr.join("&");


  //连接 和 发送 - 第二步
  xhr.open("POST", options.url, true);
  //设置表单提交时的内容类型(注意头信息的UTF-8，不然后台会乱码)
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
  xhr.send(params);

  //接收 - 第三步
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      var status = xhr.status;
      if (status >= 200 && status < 300) {
        loginCheck(JSON.parse(xhr.responseText));
        options.success && options.success(xhr.responseText, xhr.responseXML);
      } else {
        options.fail && options.fail(status);
      }
    }
  }
}

export default post_ajax;
