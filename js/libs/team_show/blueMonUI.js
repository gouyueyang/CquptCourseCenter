import React from 'react';
import ReactDOM from 'react-dom';

function BluMUI_Js(props) {
  console.log(props)
  return(<div id='tdjs'>{props.Js}</div>)
}

class BluMUI_Fuzeren extends React.Component {
  constructor(props) {
    super(props);
    // this.create_fuzeren=this.create_fuzeren.bind(this);
  }
  create_fuzeren() {
    let fuzeren=[];
    this.props.Fuzeren.map(e=>{
      fuzeren.push(<div className="fuzeren" key={e.xm}>
        <img src="../../imgs/team_show/teacher_l.png"/>
        <div className="msg">
          <span>姓名：{e.xm}</span>
          <span>学院：<span className="xueyuan">{e.xymc}</span></span>
        </div>
      </div>);
    });
    return fuzeren;
  }
  render() {
    return(<div id="fuzeren">{this.create_fuzeren()}</div>);
  }
}

class BluMUI_Teachers extends React.Component {
  constructor(props) {
    super(props);
  }
  create_teachers() {
    let teachers=[];
    this.props.Teachers.map(e=>{
      teachers.push(<div className="teachers" key={e.xm}>
        <img src="../../imgs/team_show/teacher_l.png"/>
        <br/><br/>
        <p>姓名：{e.xm}</p>
        {/*<p className="xy">{e.xymc}</p>*/}
      </div>);
    });
    return teachers;
  }
  render() {
    return(<div id="teachers">{this.create_teachers()}</div>);
  }
}

var BluMUI_M = {
  Create_fuzeren:BluMUI_Fuzeren,
  Create_teachers:BluMUI_Teachers,
  Create_jieshao:BluMUI_Js,
  // Review: BlueMUI_Review,
  // Show_all: BlueMUI_ShowAll,
  // Show_teacher: BlueMUI_Teachers,
  // Show_kkqk: BlueMUI_Kkqk
}
var BluMUI = {
  result: {},
  create: function(data, type, elem) {
    var props = data,
      Blu = BluMUI_M[type];
    this.result[props.id] = ReactDOM.render( <Blu {...props } />,
      elem
    );
  }
};
export default BluMUI;
