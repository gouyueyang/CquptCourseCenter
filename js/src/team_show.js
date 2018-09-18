require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
require('es6-promise');
let BluMUI = require('../libs/team_show/blueMonUI');
var ajax = require('../libs/post_ajax');


/*

院长：0102295 Cq011568 (黄容)
教研室主任：0102549  251833（罗婷婷）
课程负责人：0102387 密码caiting@cqupt（蔡婷）
教师：0102295 0102549   0102387 

*/

/*变量信息*/

let User={
  id:''
}
let Course={
  kcbh:''
}
User.id=getCookie('userId')
Course.kcbh=parseHash(window.location.href).classId

/*获取信息*/
ajax({
  url:courseCenter.host+'getTeachingTeamPageMsg',
  data:{
    unifyCode:User.id,
    kcbh:Course.kcbh
  },
  success:function(get) {
    let datas=JSON.parse(get);
    if(datas.meta.result==100) {
      let teachers=[];
      let master=[];
      datas.data.member.map(e=>{
        if(e.jslx=="负责人") {
          master.push(e);
        } else {
          teachers.push(e);
        }
      });
      console.log('负责人',master)
      console.log('教师',teachers)
      BluMUI.create({
        id:'Msg',
        Js:datas.data.tdjs
        },
        'Create_jieshao',
        document.getElementById('React-jieshao')
      );
      BluMUI.create({
        id:'Master',
        Fuzeren:master
        },
        'Create_fuzeren',
        document.getElementById('React-fuzeren')
      );
      BluMUI.create({
        id:'Teacher',
        Teachers:teachers
        },
        'Create_teachers',
        document.getElementById('React-teachers')
      );
    } else if(datas.meta.result==101) {
      window.location.href='error1.html';
    } else if(datas.meta.result==102) {
      window.location.href='error2.html';
    }
  }
})



