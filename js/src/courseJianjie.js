import React from 'react';
import ReactDOM from 'react-dom';
var ajax=require('../libs/post_ajax.js');
var Place=2;
var url_place=parseHash(window.location.href);
if("place" in url_place) {
  Place = url_place.place;
}
let User={
  id:''
}
let Course={
  kcbh:''
}
User.id=getCookie('userId')
Course.kcbh=parseHash(window.location.href).classId

class JianJie extends React.Component {
  render() {
    let H5 = '';
    if (this.props.H5) {
      H5 = <div id="intro" dangerouslySetInnerHTML={{__html: this.props.H5}}></div>;
    } else {
      H5 = <div id="intro">{this.props.intro}</div>;
    }
    return H5;
  }
}

/*

      <div id="title">{this.props.courseName}课程简介</div>
      <div id="infos">
        <div id="left">
          <p>
            <span id="No">课程编号：{this.props.infos.No}</span>
            <span>学时[学分]：{this.props.infos.xs}[{this.props.infos.xf}]</span>
          </p>
          <p>适用专业：{this.props.infos.suit}</p>
        </div>
        <div id="right">
          <p>课程类型：{this.props.infos.type}</p>
        </div>
      </div>
      { H5 }
*/
// getCourseHomePageMsg

function aj1() {
  return new Promise(function(resolve, reject) {
    ajax({
      url:courseCenter.host+'getCourseIntroducePageMsg',
      data:{
        kcbh:Course.kcbh,
        unifyCode:User.id,
        place:Place
      },
      success: (gets) => {
        let datas = JSON.parse(gets).data[0];
        let D = JSON.parse(gets);
        if(D.meta.result==101) {
          window.location.href='error1.html';
          return;
        } else if(D.meta.result==102) {
          window.location.href='error2.html';
          return;
        }
        let intro = datas.kcjs;
        let courseName = datas.kcmc;
        let H5 = datas.kcjshtml;
        resolve({intro, courseName, H5});
      }
    });
  });
}

function aj2() {
  return new Promise(function(resolve, reject) {
    ajax({
      url:courseCenter.host+'getCourseHomePageMsg',
      data: {
        kcbh:Course.kcbh,
        unifyCode:User.id
      },
      success: (gets) => {
        let datas = JSON.parse(gets).data;
        let D = JSON.parse(gets);
        if(D.meta.result==101) {
          window.location.href='error1.html';
          return;
        } else if(D.meta.result==102) {
          window.location.href='error2.html';
          return;
        }
        let No = datas.courseBaseMsg[0].kcbh;
        let type = datas.courseBaseMsg[0].kclx;
        type = ['其他', '选修课程', '必修课程'][type];
        let xf = parseInt(datas.courseIntrodeceList[0].xf);
        let xs = parseInt(datas.courseIntrodeceList[0].xs);
        let suit = datas.courseIntrodeceList[0].applyMajor.join(',');
        resolve({infos: {No, type, xf, xs, suit}});
      }
    });
  });
}

Promise.all([aj1(), aj2()])
  .then(function(results) {
    let introData = Object.assign(results[0], results[1]);
    ReactDOM.render(
      <JianJie {...introData}/>,
      document.getElementById('jianjie')
    );
  });
