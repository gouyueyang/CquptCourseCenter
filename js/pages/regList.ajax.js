var href = window.location.href;
var page = href.split("?page=");
var limitPage = 5;
var _COUNT = 10;
var title = decodeURI(href.split("?title=")[1])||'';
console.log("href:",href)
var host  = courseCenter.host;
var search = document.getElementById('search');
//console.log(page)
if(page.length == 1){
	var ajaxObj ={		
		user:'user',//用户查看列表1-4字段默认固定值
		state:1,
		title:'',
		source:'',
		unifyCode: getCookie('userId'),
		count: _COUNT,
		page:1
	};
}
else{
	var ajaxObj ={
		user:'user',
		state:1,
		title:'',
		source:'',
		unifyCode: getCookie('userId'),
		count: _COUNT,
		page:page[1]
	};
}
if(title != 'undefined') {
	ajaxObj.title = title;
}
ajax(ajaxObj,host);
//console.log(ajaxObj)

// 搜索内容
search.onclick = Serch_title;
searchTxt.onkeydown=function(e) {
	console.log(e)
	if(e.keyCode==13) {
		Serch_title();
	}
}
function Serch_title(){
	var searchTxt = document.getElementById("searchTxt");
	if(searchTxt.value != ''){
		window.location.href='regList.html?title='+searchTxt.value;
		// a.href = 'regList.html?title=' + searchTxt.value;
		// a.target = '_black';
	}
}

function ajax(ajaxObj,host){
	var user = ajaxObj.user;
	var title = ajaxObj.title;
	var source = ajaxObj.source;
	var state = ajaxObj.state; 
	var unifyCode = ajaxObj.unifyCode;
	var count = ajaxObj.count;
	var page = ajaxObj.page;
	var list = document.getElementById("list");
	var ul = list.getElementsByTagName("ul");
	var url =  host + "getRegulationHead?unifyCode="+unifyCode+"&user="+user+"&count="+count+"&state="+state+"&title="+title+"&source="+source+"&page=";
	var href = "regList.html?page=";
	var request = new XMLHttpRequest();
	request.open("POST",url + page);
	request.send();
	request.onreadystatechange = function() {
		if (request.status===200) {
			if(request.readyState === 4){
				var searchTxt = document.getElementById('searchTxt');
				//console.log(search);				
				if(title!=''&&title!='undefined'){
					searchTxt.value=title;
					console.log('title:',title)
				}					
				var li = new Array();
				var txt = JSON.parse(request.responseText);
				console.log(txt)
				var length = txt.data.regulationInformation.length;
				var allPage = txt.data.totalPages;  
				var nowPage = ajaxObj.page;
				var allList = txt.data.total;
				var beforePage = parseInt(page)-1;
				var nextPage = parseInt(page)+1;
				var pageNum = document.getElementsByClassName('pageNum');
				for(var i = 0; i < pageNum.length; i++){
					if(pageNum[i].innerText == page)
						pageNum[i].style.color = '#209067';
				}				
				document.getElementById('listSum').innerText = '共有'+allList+'条记录';
				document.getElementById('inputPage').value = page + '/' + allPage;
				document.getElementsByClassName('changePT')[3].href = 'regList.html?page='+allPage;
				if(page != 1){
					document.getElementsByClassName('changePT')[1].href = 'regList.html?page='+beforePage;
				}
				if(page != allPage){
					document.getElementsByClassName('changePT')[2].href = 'regList.html?page='+nextPage;
				}else {
					document.getElementsByClassName('changePT')[2].href = 'regList.html?page='+allPage;
				}
				if(allPage <= limitPage){
					for(i = 4; i > allPage-1; i--){
						pageNum[i].style.display = "none";
					}
				}else{
					if(page > limitPage){						
						var flag = 4;
						for(var i = 0; i < pageNum.length; i++){
							pageNum[i].href = 'regList.html?page=' + (parseInt(page)-flag);
							pageNum[i].innerText = (parseInt(page)-flag);
							flag --;
						}
						pageNum[pageNum.length-1].style.color = "#209067";
					}
				}


				for(var i = 0; i < length; i++){
					var name = document.createElement("a");
					name.className = "name";
					name.href = "regContain.html?id="+txt.data.regulationInformation[i].id+"&unifyCode="+ajaxObj.unifyCode+"&title="+ajaxObj.title+"&state="+ajaxObj.state+"&source="+ajaxObj.source;
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
				var style = "text-decoration:none;text-align:center;display:inline-block;width:20px;height:20px;background-color:#007a51;border-radius:50%;color:#fff;";
				// PT(allPage,nowPage);
				// function PT(allPage,nowPage){
				// 	//console.log(nowPage)
				// 	page({
				// 		id:'test_fanye',
				// 		nowNum:nowPage,
				// 		allNum:allPage,
				// 		callback:function(now,all){
				// 			//console.log(now+ ' '+all);
				// 		}
				// 	})
				// }
				// function page(obj){
				// 	if(!obj.id){
				// 		return false;
				// 	}
				// 	var obj1 = document.getElementById(obj.id);
				// 	nowNum =obj.nowNum;
				// 	allNum = obj.allNum;
				// 	callback=obj.callback ||function(){};
				// 	if(nowNum >= 2){
				// 		var oA = document.createElement('a');
				// 		oA.href=href+(nowNum-1);
				// 		oA.target = "_self";
				// 		oA.innerHTML ='<span>上一页</span>';
				// 		obj1.appendChild(oA);
				// 	}

				// 	for(var i=1; i<=allNum;i++){
				// 		var oA = document.createElement('a');
				// 		oA.href=href+i;
				// 		oA.target = "_self";
				// 		if(nowNum==i){
				// 			oA.innerHTML=i;
				// 			oA.style = style;
				// 		}else {
				// 			oA.innerHTML =i;
				// 		}
				// 		obj1.appendChild(oA);
				// 	}

				// 	if(allNum-nowNum>=1){
				// 		var oA = document.createElement('a');
				// 		oA.href=href+(parseInt(nowNum) + 1);
				// 		oA.target = "_self";
				// 		oA.innerHTML ='<span>下一页</span>';
				// 		obj1.appendChild(oA);
				// 	}
				// 	callback(nowNum,allNum);
				// 	var aA= obj1.getElementsByTagName('a');
				// 	for(var i=0;i<aA.length;i++){
				// 		aA[i].onclick=function(){
				// 			var nowNum= parseInt(this.getAttribute('href').split("page=")[1]);
				// 			obj1.innerHTML='';
				// 			page({
				// 				id:obj.id,
				// 				nowNum:nowNum,
				// 				allNum:allNum,
				// 				callback:callback
				// 			});

				// 		}
				// 	}
				// }
				// var width = (1182 - parseInt(allPage) * 28 - 56)/2;
				// //console.log(width)
				// var test = document.getElementById("test_fanye");
				// test.style.marginLeft = width + "px";
			}
		}
		else{
			console.log("发生错误：" + request.readyState + "&" + request.status);
		}
	}
}

function jump(){
	var e=window.event||arguments.callee.caller.arguments[0];
      if(e.keyCode==13){
          var url = 'regList.html?page=' + document.getElementById('inputPage').value.split("/")[0];
          window.open(url,'_self');
      }
}