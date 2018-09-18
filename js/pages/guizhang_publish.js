var title = document.getElementById('title');
var warn = document.getElementById('warn');
var ajax = function(options) {
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
        options.success && options.success(xhr.responseText, xhr.responseXML);
      } else {
        options.fail && options.fail(status);
      }
    }
  }
}





/* 百度富文本编辑器 */
// var Baidu_editor=new UE.ui.Editor();
// Baidu_editor.render(document.getElementById('inputs'));
var Baidu_editor=UE.getEditor('inputs');


// document.getElementById('form').action=courseCenter.host+'releaseRegulation';
// document.getElementById('unifyCode').value=getCookie('userId');

title.onblur=function(e) {
  var l=0;
  var str=e.target.value;
  for(var i=0, len=str.length;i<len;i++) {
    if((str.charCodeAt(i)&0xff00)!=0) l++;
    l++;
  }
  if(l>20*2) {
    warn.innerText='标题长度超过20';
    warn.style.color='red';
  } else {
    warn.innerText='20字以内';
    warn.style.color='#999';
  }
}

/* 富文本编辑器 */
// var editor=new wangEditor('inputs');
// editor.onchange = function () {
//     // 编辑区域内容变化时，实时打印出当前内容
//     document.getElementById('inputs').innerHTML=this.$txt.html();
// };
// editor.create();


/* 文件 */
var FILEs=[];
document.getElementById('files').onchange=function(){
  var new_Li;
  var same=false;
  for(var i=0,file_num=this.files.length;i<file_num;i++) {
    if(FILEs.length<1) {
      FILEs.push(this.files[i]);
      add_files(this.files[i].name);
    }
    FILEs.map((e,index)=>{
      if(e.name==this.files[i].name) {
        FILEs[i]=e;
        same=true;
        return;
      }
    });
    if(!same) {
      FILEs.push(this.files[i]);
      add_files(this.files[i].name);
    }
    same=false;
  }
  console.log(typeof FILEs[0])
}

function add_files(file_name) {
  let new_li=document.createElement('li');
  // new_li.innerHTML=file_name+
  // '<span><a href=\'javascript:void(0)\'>删除</a></span><br />';
  new_li.innerHTML=file_name+
    '<span><a href="javascript:void(0);" onclick="del_file(this,\''+file_name+'\')">删除</a></span><br/>'
  // new_li.onclick=del_file.bind(this,file_name,new_li)
  document.getElementById('file_names').appendChild(new_li);
  console.log("change iframe height");
  parent.document.getElementById('ifs-gzzd').height=document.body.scrollHeight;
}

/* 删除文件 */
function del_file(a,name) {
  document.getElementById('files').value='';
  a.parentNode.parentNode.remove();
  FILEs.map((e,index)=>{
    if(e.name==name) {
      FILEs.splice(index,1);
      return;
    }
  });
  parent.document.getElementById('ifs-gzzd').height=document.body.scrollHeight;
  // console.log(a.parentNode.parentNode)
  console.log(FILEs)
}


/* 操作 */
var Pub=document.getElementById('publish');
var Bak=document.getElementById('back');
Bak.onclick=function(e) {
  window.location.href='./gzzd.html';
}
Pub.onclick=function(e) {
  if(document.getElementById('title').value=='') {
    alert('请填写标题！');
    return;
  }
  var datas = new FormData();
  datas.append('unifyCode',getCookie('userId'));
  datas.append('head',document.getElementById('title').value);
  datas.append('source',document.getElementById('source').value);
  datas.append('body',Baidu_editor.getContent());
  for(var i=0,len=FILEs.length;i<len;i++) {
    datas.append('file',FILEs[i]);
  }

  var xhr2 = new XMLHttpRequest();
  xhr2.open("POST", courseCenter.host+'releaseRegulation', true);
  xhr2.send(datas);
  xhr2.onreadystatechange = function() {
    if (xhr2.readyState == 4) {
      var status = xhr2.status;
      if (status >= 200 && status < 300) {
        (gets=>{
          console.log(JSON.parse(gets))
          if(JSON.parse(gets).meta.result==100) {
            window.location.href="./gzzd.html";
          }
        })(xhr2.responseText);
      } else {
        alert("保存失败，请检查！");
      }
    }
  }
}
