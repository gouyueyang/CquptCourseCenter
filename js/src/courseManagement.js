	var BluMUI = require('../libs/courseManagment/blueMonUI');
var ajax=require('../libs/post_ajax.js');


// 此处需要获取角色ID
var User={
  id:''
}
User.id=getCookie('userId');
BluMUI.result.unifyCode=User.id;

//获取subModule(tab)

ajax({
  menue: true,
  url:courseCenter.host+"getMenu",
  data:{
    unifyCode:User.id,
    module:4
  },
  success:function(gets) {
    // 未获取到数据则刷新页面
    if(JSON.parse(gets).meta.result!=100) {
      alert("数据获取失败，请重新登录！");
    }
    //渲染tabs
    BluMUI.create({
      id:'Tab',
      tabs:JSON.parse(gets).data
      },
      'Create_tabs',
      document.getElementById('React_tab')
    );

    //渲染options
    BluMUI.create({
      id:'Options',
      subModule:parseHash(window.location.href).subModule||BluMUI.result.Tab.state.subModule
      },
      'Create_options',
      document.getElementById('React_options')
    );
  }
});
