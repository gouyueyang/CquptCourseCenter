var BluMUI = require('../libs/BluMUI_gzzd.js');
var ajax=require('../libs/post_ajax.js');


document.getElementById("fabu_btn").onclick=()=>{
  window.location.href='./guizhang_publish.html';
}
BluMUI.create({},'Create_filter',document.getElementById('filter'));

parent.document.getElementById('ifs-gzzd').height=document.body.offsetHeight;
