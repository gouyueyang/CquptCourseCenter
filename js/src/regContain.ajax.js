function first(){
  var href = window.location.href;
  var id = href.split("=")[1];
  var host = courseCenter.host;
  id = id.split("&")[0];
  var unifyCode = href.split("=")[2];
  console.log(id);
  var text = document.getElementById("text");
  var title = document.getElementById("title");
  var list = document.getElementById("time");
  var span = list.getElementsByTagName("span");
  var annex = document.getElementById("annex");
  var upDown = document.getElementById("up");
  console.log(span);
  var request = new XMLHttpRequest();
  request.open("POST", host + "regulationShow?unifyCode=" + unifyCode +"&id=" + id);
  request.send();
  request.onreadystatechange = function() {
    if (request.status===200) {
     if(request.readyState === 4){
      var txt = JSON.parse(request.responseText);


      title.innerHTML = txt.data.regulation[0].bt;
      text.innerHTML = txt.data.regulation[0].nr;
      span[0].innerHTML = txt.data.regulation[0].fwl;
      span[1].innerHTML = txt.data.regulation[0].author;
      span[2].innerHTML = txt.data.regulation[0].ly;
      span[3].innerHTML = txt.data.regulation[0].czsj;

        var fjm = txt.data.regulation[0].yfjm.split(";");//附件名
        console.log(fjm);
        for(var i = 0 ; i < fjm.length; i++){
          var fj = document.createElement("li");
          var fja = document.createElement("a");
          fja.innerHTML = fjm[i];
          fj.appendChild(fja);
          annex.appendChild(fj);
        }
        if(txt.data.upRegulation.length != 0){
          var up = document.createElement("li");
          var upA = document.createElement("a");
          var upId = txt.data.upRegulation[0].id;
          upA.href = "regContain.html?id=" + upId;
          upA.innerHTML ="上一条：" + txt.data.upRegulation[0].bt;
          up.appendChild(upA);
          upDown.appendChild(up);
        }
        if(txt.data.downRegulation.length != 0){
          var down = document.createElement("li");
          var downA = document.createElement("a");
          var downId = txt.data.downRegulation[0].id;
          downA.href = "regContain.html?id=" + downId;
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

}
first();


