var href = window.location.href;
var page = href.split("?page=");
var host  = courseCenter.host;
//console.log(page)
if(page.length == 1){
  var ajaxObj ={
    user:getCookie('userName'),
    unifyCode: getCookie('userId'),
    count: 9,
    page:1
  };
  ajax(ajaxObj);
}
else{
  var ajaxObj ={
    user: getCookie('userName'),
    unifyCode: getCookie('userId'),
    count: 9,
    page:page[1]
  };
  ajax(ajaxObj);
}




function ajax(ajaxObj){
	var user = ajaxObj.user;
	var unifyCode = ajaxObj.unifyCode;
	var count = ajaxObj.count;
	var page = ajaxObj.page;
	var list = document.getElementById("list");
	var ul = list.getElementsByTagName("ul");
	var url =  "http://172.20.2.137/subjectCenter/getRegulationHead?unifyCode="+ unifyCode + "&user=" + user + "&count=" + count + "&page=";
	var href = "regList.html?page=";
	var request = new XMLHttpRequest();
	request.open("POST",url + page);
	request.send();
	request.onreadystatechange = function() {
		if (request.status===200) {
			if(request.readyState === 4){
				var li = new Array();
				var txt = JSON.parse(request.responseText);
				var length = txt.data.regulationInformation.length;
				var allPage = txt.data.totalPages;
				var nowPage = ajaxObj.page;
				console.log(nowPage);
				for(var i = 0; i < length; i++){
					var name = document.createElement("a");
					name.className = "name";
					name.href = "regContain.html?id=" + txt.data.regulationInformation[i].id + "&unifyCode=" + txt.data.regulationInformation[i].unifyCode;
					name.innerHTML = txt.data.regulationInformation[i].bt;
					var time = document.createElement("span");
					time.className = "time";
					time.innerHTML = txt.data.regulationInformation[i].czsj;
					var li = document.createElement("li");
					li.appendChild(name);
					li.appendChild(time);
					ul[0].appendChild(li);
				}
				var disNum = 10;
				var style = "background-color:#007a51;border-radius:100%;color:#fff;";
				PT(allPage,nowPage);
				function PT(allPage,nowPage){
					console.log(nowPage)
					page({
						id:'test',
						nowNum:nowPage,
						allNum:allPage,
						callback:function(now,all){
							console.log(now+ ' '+all);
						}
					})
				}
				function page(obj){
					if(!obj.id){
						return false;
					}
					var obj1 = document.getElementById(obj.id);
					nowNum =obj.nowNum;
					allNum = obj.allNum;
					callback=obj.callback ||function(){};
					if(nowNum >= 2){
						var oA = document.createElement('a');
						oA.href=href+(nowNum-1);
						oA.target = "_self";
						oA.innerHTML ='<img src="../../imgs/public/regUp.png">';
						obj1.appendChild(oA);
					}

					for(var i=1; i<=allNum;i++){
						var oA = document.createElement('a');
						oA.href=href+i;
						oA.target = "_self";
						if(nowNum==i){
							oA.innerHTML=i;
							oA.style = style;
						}else {
							oA.innerHTML =i;
						}
						obj1.appendChild(oA);
					}

					if(allNum-nowNum>=1){
						var oA = document.createElement('a');
						oA.href=href+(parseInt(nowNum) + 1);
						oA.target = "_self";
						oA.innerHTML ='<img src="../../imgs/public/regDown.png">';
						obj1.appendChild(oA);
					}
					callback(nowNum,allNum);
					var aA= obj1.getElementsByTagName('a');
					for(var i=0;i<aA.length;i++){
						aA[i].onclick=function(){
							var nowNum= parseInt(this.getAttribute('href').split("page=")[1]);
							obj1.innerHTML='';
							page({
								id:obj.id,
								nowNum:nowNum,
								allNum:allNum,
								callback:callback
							});

						}
					}
				}
				var width = (1182 - parseInt(allPage) * 28 - 56)/2;
				var test = document.getElementById("test");
				test.style.marginLeft = width + "px";
			}
		}
		else{
			console.log("发生错误：" + request.readyState + "&" + request.status);
		}
	}
}
