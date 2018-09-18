/**
 * 参数说明
 * json  json对象
 * elem  在哪个DOM元素中植入ajax获取的数据
 * dataName 用于数据填充的自定义属性的名称
**/ 
var ajaxDataFill=function(json,elem,dataName){
	var elems=elem.getElementsByTagName('*'),
		i,
		len,
		value;
	for(i=0,len=elems.length;i<len;i++){
		value=elems.getAttribute(dataName)
		if(value){
			elems[i].innerHTML=value;
		}
	}
}