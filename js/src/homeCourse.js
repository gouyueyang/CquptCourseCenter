require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
require('es6-promise');
var BluMUI = require('../libs/blueMonUI');
var ajax = require('../libs/post_ajax');


//查询数据的变量
let User={
  id:''
}
let Course={
  kcbh:''
}
User.id=getCookie('userId')
Course.kcbh=parseHash(window.location.href).classId

//显示全部（适用专业）
function showMore(){
	document.getElementById('gdxy').style.display='inline';
	document.getElementById('close').onclick=function(){
		document.getElementById('gdxy').style.display='none';
	}
	return false;//禁止连接跳转
}


//提前获取“更多学院的信息”
ajax({
  url:courseCenter.host+'getCourseMajor',
  data: {
    'courseNo': Course.kcbh,
    'unifyCode': User.id
  },
  success: function (response) {
    let datas=JSON.parse(response);

    BluMUI.create({
      'xueyuan':datas
    },'Show_all',document.getElementById('xys'));
  }
});

//ajax1,显示学院(左上)
ajax({
	url:courseCenter.host+'getCourseHomePageMsg',
	data: {
		'kcbh': Course.kcbh,
    'unifyCode': User.id
	},
	success: function (response) {
    var fengmian='../../imgs/home-course/default.png';
		var totalInfos={};
		var getCourseHomePageMsg=JSON.parse(response).data;
		var courseBaseMsg=getCourseHomePageMsg.courseBaseMsg[0];
		var teacherMsg=getCourseHomePageMsg.teacherMsg;
		var courseIntrodeceList=getCourseHomePageMsg.courseIntrodeceList[0];

		for(let a in courseIntrodeceList){
			totalInfos[a]=courseIntrodeceList[a];
		}
		for(let b in courseBaseMsg){
			totalInfos[b]=courseBaseMsg[b];
		}
		document.getElementById('bigkcmc').innerText=totalInfos['kcmc'];
    // 访问量：
    ajax({
      url:courseCenter.host+'courseVisit',
      data:{
        'classId':Course.kcbh,
        'unifyCode':User.id
      },
      success:function(response) {
        var datas=JSON.parse(response);

        if("fwl" in datas.data) {
          document.getElementById('visited').innerText=datas.data.fwl+'人看过';
        }
      }
    })

		var baseInfos=['kcmc','kcbh','xf','xs','kcjs','kclx'];

		baseInfos.map(e=>{
      if (e === 'xf' || e === 'xs') {
        document.getElementById(e).innerText=totalInfos[e];
      } else if (e === 'kclx') {
        let ty = ["理论课/实验课","课程设计/实习实训"];
        document.getElementById(e).innerText=ty[parseInt(totalInfos[e])-1];
      } else {
			 document.getElementById(e).innerText=totalInfos[e];
      }
		});//填充课程基本信息
    if(courseBaseMsg.tpurl!='') {
      fengmian=courseCenter.host+'upload/PIC/'+courseBaseMsg.tpurl;
    }
    document.getElementById('fengmian').src=fengmian;
		//适用专业、学院

		totalInfos.applyMajor.map(e=>{
			document.getElementById('syxy').innerHTML+=e+'<br/>';
		});
    if (totalInfos.applyMajor.length > 1) {
  		document.getElementById('syxy').innerHTML+='<span id="showMore">显示全部 》</span>';
      document.getElementById('showMore').onclick=showMore;
    }
    if (totalInfos.applyMajor === 0 || totalInfos.applyMajor[0] === null) {
      document.getElementById('syxy').innerHTML='全校';
    }

    //左下角的老师
    BluMUI.create({
      teachers: teacherMsg
      },
      'Show_teacher',
      document.getElementById('rkjs_table')
    );

    // 课程资源：
    if(courseBaseMsg.kclx==1) {
      BluMUI.create({
          id:"Resources"
        },
        'Resources',
        document.getElementById('Resources')
      );
      set_more();
    }

		/**
		 * 在这进行星星打分///
		 */

    //评论组件
    // BluMUI.create({
    //   id:"Review",
    //   extClass:'review_test',
    //   name:'课程评价',// 评价组件名称
    //   num:5,// 评价的星星总数
    //   starNum:getCourseHomePageMsg.courseBaseMsg.kcpf,// 当前评价的星星数
    //   enable:false,// 是否可修改评价，布尔值
    //   callback:function(value){//
    //   }},
    //   'Review',
    //   document.getElementById('evaluation3')
    // );
	}
});

//评论组件
BluMUI.create({
	id:"Review1",
	extClass:'review_test',
	name:'资源评价',// 评价组件名称
	num:5,// 评价的星星总数
	starNum:5,// 当前评价的星星数
	enable:true,// 是否可修改评价，布尔值
	callback:function(value){//
    document.getElementById('value2').value=value;
	}
},'Review',document.getElementById('evaluation2'));

//评论组件
BluMUI.create({
	id:"Review2",
	extClass:'review_test',
	name:'课程评价',// 评价组件名称
	num:5,// 评价的星星总数
	starNum:5,// 当前评价的星星数
	enable:true,// 是否可修改评价，布尔值
	callback:function(value){//
    // document.getElementById('percent').innerText=value*20;
    document.getElementById('value1').value=value;
	}
},'Review',document.getElementById('evaluation1'));

// 绑定“更多”事件
function set_more() {
  let Mapps=['f','a','d','e','c','b'];
  [1,2,3,4,5,6].map((e)=>{
    document.getElementById('more'+e).onclick=(eve)=>{
      window.location.href=`courseShow.html?module=${Mapps[e-1]}&toModuleName=学习资源&classId=${Course.kcbh}`;
      eve.preventDefault();
    };
  });
}

document.getElementById('more_info').onclick=function(e) {
  window.location.href='courseJianjie.html?toModuleName=课程简介&classId='+Course.kcbh;
  e.preventDefault();
}

document.getElementById('button').onclick=function(e) {
  let v1=document.getElementById('value1').value;
  let v2=document.getElementById('value2').value;
  ajax({
    url:courseCenter.host+'courseScore',
    data: {
      'kcbh': Course.kcbh,
      'unifyCode': User.id,
      'kcpf':v1,
      'zypf':v2,
    },
    success: function (response) {
      let datas=JSON.parse(response);
      if(datas.meta.result==100) {
        alert('评论成功！');
        document.getElementById('button').onclick=function(e) {
          document.getElementById('warn').innerText='您已提交过评价，请勿重复提交！'
          e.preventDefault();
        }
      }
    }
  });
  e.preventDefault();
}