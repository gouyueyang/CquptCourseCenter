import React from 'react';
import ReactDOM from 'react-dom';

// 课程资源模板
class BlueMUI_Resources extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (<div id="r2">
      <p className="content_title">课程资源</p>
      <div id="r2_content">
        <ul>
          <li>
            <span>参考书</span>
            <a id="more1" className="more" href="#">更多》</a>
          </li>
          <li className="right-item">
            <span>视频资源</span>
            <a id="more2" className="more" href="#">更多》</a>
          </li>
          <li>
            <span>习题库</span>
            <a id="more3" className="more" href="#">更多》</a>
          </li>
          <li className="right-item">
            <span>网络学习资源</span>
            <a id="more4" className="more" href="#">更多》</a>
          </li>
          <li>
            <span>作业</span>
            <a id="more5" className="more" href="#">更多》</a>
          </li>
          <li className="right-item">
            <span>讲义</span>
            <a id="more6" className="more" href="#">更多》</a>
          </li>
        </ul>
      </div>
    </div>);
  }
}

class BlueMUI_Review extends React.Component {
  constructor(props) {
    super(props);
    this._clickStar = this._clickStar.bind(this);
    this.state = {
      choiced: null,
      curIndex: this.props.starNum
    };
  }
  componentWillMount() {
    var len,
      i,
      result = [];
    if (this.props.starNum <= this.props.num)
      len = this.props.starNum;
    else
      len = this.props.num;
    for (i = 1; i <= this.props.num; i++) {
      if (i <= len)
        result.push(1);
      else
        result.push(0);
    }
    this.setState({
      choiced: result
    })
  }
  _clickStar(e) {
    var index = parseInt(e.target.getAttribute('data-key')) + 1,
      len,
      i,
      result = [];
    for (i = 1; i <= this.props.num; i++) {
      if (this.state.curIndex != index) {
        if (i <= index)
          result.push(1);
        else
          result.push(0);
      } else {
        if (this.state.choiced[0] == 0 && i <= index) {
          result.push(1);
        } else {
          result.push(0);
          index = 0;
        }
      }
    }
    this.props.callback(index);
    this.setState({
      choiced: result,
      curIndex: index
    })
  }
  _createStar() {
    var i,
      len,
      starList = [];
    for (i = 0, len = this.props.num; i <len; i++) {
      starList.push( <span className = { this.state.choiced[i] == 1 ? 'star onstar' : 'star nostar' }
        key = { i }
        data-key = { i }
        onClick = { this.props.enable ? this._clickStar : function() {} }> </span>
      );
    }
    return starList;
  }
  render() {
    return ( <div id = { this.props.id }
      className = { 'BlueMUI_Review ' + this.props.extClass }>
      <span className = 'name'> { this.props.name } </span> { this._createStar() } </div>
    );
  }
}

//任课教师
class BlueMUI_Teachers extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let teachers=[];
    let teacher=[];
    let warnings;
    let fuzeren;
    this.props.teachers.map(e => {
      if (e.jslx == '负责人') {
        fuzeren = 
          <div key={e.xm} className="teachers">
            <img src="../../imgs/team_show/teacher_l.png" />
            <div className="down">
              <span>{ e.xm }</span>
              <br/>
              <span>负责人</span>
            </div>
          </div>
      } else {
        teachers.push(
          <div key={e.xm} className="teachers">
            <img src="../../imgs/team_show/teacher_l.png" />
            <div className="down">
              <span>{ e.xm }</span>
              <br/>
              <span>{ e.xymc }</span>
            </div>
          </div>
        );
      }
    });
    if(fuzeren) {
      if(teachers.length>2) {
        teacher[0]=teachers[0];
        teacher[1]=teachers[1];
      } else {
        teacher=teachers;
      }
    } else {
      if(teachers.length>3) {
        teacher[0]=teachers[0];
        teacher[1]=teachers[1];
        teacher[2]=teachers[2];
      } else {
        teacher=teachers;
      }
    }
    if(this.props.teachers.length==0) {
      warnings=<p>该课程没有任课教师</p>;
    } else {
      warnings=null;
    }
    return (
      <div id="course-teachers">
        {fuzeren}
        {teacher}
        {warnings}
      </div>
    );
  }
}


//全部显示
class BlueMUI_ShowAll extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let items=[];
    this.props.xueyuan.data.map(e=>{
      let listitem=[];
      e.zy.map(m=>{
        listitem.push(<li key={m.zyh}>{'-'+m.zymc}</li>);
      })
      items.push(
        <li key={e.xyh}>
          <ul>
            <b>{e.xymc}</b>
            <li>
              <ul>{listitem}</ul>
            </li>
          </ul>
        </li>
      );
    });
    return (<ul>{items}</ul>)
  }
}

var BluMUI_M = {
  Review: BlueMUI_Review,
  Resources:BlueMUI_Resources,
  Show_all: BlueMUI_ShowAll,
  Show_teacher: BlueMUI_Teachers,
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
