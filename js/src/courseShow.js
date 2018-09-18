var BluMUI = require('../libs/courseShow/blueMonUI');
var ajax=require('../libs/post_ajax.js');
var Place=2;

let prop=parseHash(window.location.href).module||'a';
let num=['a','b','c','d','e']
let config={
  user_id:'',
  course_id:''
}
let data={};
let url='';

config.user_id=getCookie('userId')
config.course_id=parseHash(window.location.href).classId
BluMUI.result.config=config;

if(prop=='f') {
  url=courseCenter.host+'getTextbookResourceMsg';
  data={
    unifyCode:BluMUI.result.config.user_id,
    kcbh:BluMUI.result.config.course_id,
    place:Place,
  };
} else {
  url=courseCenter.host+'getStudyResourceMsg';
  data={
    unifyCode:BluMUI.result.config.user_id,
    kcbh:BluMUI.result.config.course_id,
    place:Place,
    zylb:1+num.indexOf(prop)
  };
}

BluMUI.create(
  {
    id:'Nav',
    // module为左边菜单的子选项，默认为'a'，即第一项
    module:parseHash(window.location.href).module||'a'
  },
  'CreateNav',
  document.getElementById('React_left')
);