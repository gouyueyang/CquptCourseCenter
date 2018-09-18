var BluMUI = require('../libs/blueMonUI.js');
var ajax=require('../libs/post_ajax.js');



/*
 * 教师：0100024
 * 课程负责人：0101225
 * 教研室主任：0102549
 * 院长：0110
 */
// 此处需要获取角色ID
var user={
  id:'0101225'
}

BluMUI.result.unifyCode=user.id;

//获取subModule

ajax({
  url:"http://172.20.2.137/subjectCenter/getMenu",
  data:{
    unifyCode:user.id,
    module:4
  },
  success:function(gets) {
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
      subModule:BluMUI.result.Tab.state.subModule
      },
      'Create_options',
      document.getElementById('React_options')
    );

    // BluMUI.result.Get_list(BluMUI.result.Tab.state.subModule);
  }
});
