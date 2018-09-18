var BluMUI = require('../libs/blueMonUI.js');
var ajax=require('../libs/post_ajax.js');

var menus=[];

ajax({
  url:courseCenter.host+'getMenu',
  data:{
    module:9,
    unifyCode:getCookie('userId')
  },
  success:function(gets) {
    // 未获取到数据则刷新页面
    // 
    let datas=JSON.parse(gets);
    menus=[];
    datas.data.map(e=>{
      let menu_msg={
        "url": e.subModule,
        "name": e.cdmc
      };
      if(e.hasOwnProperty("secondMenu")) {
        menu_msg["second"]=e.secondMenu.map(m=>{
          BluMUI.menu_names[m.subModule]=m.cdmc;
          return {
            "url": m.subModule,
            "name": m.cdmc
          };
        });
      } else {
        BluMUI.menu_names[e.subModule]=e.cdmc;
      }
      menus.push(menu_msg);
    });

    // 左边的菜单
    BluMUI.create({
      Menus:menus
    },'Create_menu',document.getElementById('menu'));
  }
});






