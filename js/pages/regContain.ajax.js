var host = courseCenter.host;
var href = window.location.href;
var id = href.split("=")[1].split("&")[0];
var unifyCode = href.split("=")[2].split("&")[0];
var searchTitle = href.split("=")[3].split("&")[0];
var state = href.split("=")[4].split("&")[0];
var source = href.split("=")[5].split("&")[0];
var text = document.getElementById("text");
var title = document.getElementById("title");
var list = document.getElementById("time");
var span = list.getElementsByTagName("span");
var annex = document.getElementById("annex");
var upDown = document.getElementById("up");
var fileDown = document.getElementById("fileDown");

function first(){
  var request = new XMLHttpRequest();
  request.open("POST", host + "regulationShow?unifyCode="+unifyCode+"&id="+id+"&title="+searchTitle+"&state="+state+"&source="+source);
  request.send();
  request.onreadystatechange = function() {
    if (request.status===200) {
     if(request.readyState === 4){
      var txt = JSON.parse(request.responseText);
      title.innerHTML = txt.data.regulation[0].bt;
      text.innerHTML = txt.data.regulation[0].nr;
      // span[0].innerHTML = txt.data.regulation[0].fwl;

      span[1].innerHTML = txt.data.regulation[0].author;
      span[2].innerHTML = txt.data.regulation[0].ly;
      span[3].innerHTML = txt.data.regulation[0].czsj;
        var yfjm = txt.data.regulation[0].yfjm.split(";");//原附件名
        var fjm = txt.data.regulation[0].fjm.split(";");
        //console.log(fjm[0])
        if(fjm[0] != ''){
          for(var i = 0 ; i < yfjm.length; i++){//创建附件下载
            var fj = document.createElement("li");
            var fja = document.createElement("a");
            fja.innerHTML = yfjm[i];
            fja.onclick = file(host,yfjm[i],fjm[i]);
            fj.appendChild(fja);
            annex.appendChild(fj);
          }
        }
        
        if(txt.data.upRegulation.length != 0){
          var up = document.createElement("li");
          var upA = document.createElement("a");
          var upId = txt.data.upRegulation[0].id;
          upA.href = "regContain.html?id="+upId+"&unifyCode="+unifyCode+"&title="+searchTitle+"&state="+state+"&source="+source;
          upA.innerHTML ="上一条：" + txt.data.upRegulation[0].bt;
          up.appendChild(upA);
          upDown.appendChild(up);
        }
        if(txt.data.downRegulation.length != 0){
          var down = document.createElement("li");
          var downA = document.createElement("a");
          var downId = txt.data.downRegulation[0].id;
          downA.href = "regContain.html?id="+downId+"&unifyCode="+unifyCode+"&title="+searchTitle+"&state="+state+"&source="+source;
          downA.innerHTML ="下一条：" + txt.data.downRegulation[0].bt;
          down.appendChild(downA);
          upDown.appendChild(down);
        }
      }
    }
    else{
      console.log("发生错误：" + request.readyState + "&" + request.status);
    }

  }
  function file(host,name,oName){
    return function(){
      fileDown.src=host+"fileDownLoad?name="+name+"&oName="+oName+"&unifyCode="+unifyCode;
    }
  }

}
first();

// 访问量
var content_fwl = document.getElementById("time").getElementsByTagName("span");
var fwl_request = new XMLHttpRequest();
fwl_request.open("POST", courseCenter.host + "regulationVisit?unifyCode="+unifyCode+"&id="+id);
fwl_request.send();
fwl_request.onreadystatechange = function() {
  if(fwl_request.status==200&&fwl_request.readyState==4) {
    content_fwl[0].innerHTML = JSON.parse(fwl_request.responseText).data.fwl;
  } else {
    content_fwl[0].innerHTML = '0';
  }
}
