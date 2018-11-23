import React from 'react';
import ReactDOM from 'react-dom';

var _COUNT = 10;
import ajax from '../post_ajax.js';
const Fanye = require('../turnPage.js');
// 筛选条件
class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      college: "",
      name: "",
      page: 1,
      pages: 1,
      rows: 0,
      output: `unifyCode=${getCookie("userId")}`
    };
    this.changeOutput = this.changeOutput.bind(this);
  }

  changeOutput() {
    this.setState({
      output: `unifyCode=${getCookie("userId")}&college=${this.state.college}`
    });
  }

  search() {
    this.changeOutput();
    this.refs.list.refresh(1, {
      college: this.refs.college.value,
    });
  }

  key(e) {
    if (e.keyCode == 13) {
      this.search();
    }
  }

  render() {
    return (<div id="kczttj">
      <div id="kczttj_filter">
        <select name="college" id="filter_college" ref="college" onChange={(e) => { this.setState({ college: e.target.value },this.search) }}>
          <option value="">请选择学院</option>
        </select>
        <input type="button" id="btn" ref="btn" value="搜索" onClick= {this.search}/>
        <a className="output" href={courseCenter.host + "exportKcZtExcel?" + this.state.output}>导出</a>
      </div>
      <Lists ref="list" options={this.state} />
    </div>);
  }

  componentDidMount() {
    // 获取学院
    ajax({
      url: courseCenter.host + "getCollege",
      data: {
        unifyCode: getCookie("userId")
      },
      success: (gets) => {
        let datas = JSON.parse(gets);
        if (datas.meta.result == 100) {
          datas.data.map((e, index) => {
            this.refs.college.innerHTML += `<option value=${e.kkxymc}>${e.kkxymc}</option>`;
          });
        }
      }
    });


  }
}

class Lists extends React.Component {
  constructor(props) {
    super(props);
    let newState = {};
    for (let i in this.props.options) {
      newState[i] = this.props.options[i];
    }
    newState.list = [];
    this.state = newState;
  }

  create_list() {
    let tds = [];
    this.state.list &&
    this.state.list.map((e, index) => {
      tds.push(<tr key={index} className={index == 9 ? "noborder" : null}>
        <td className="lefttd"><div></div></td>
        <td>{e.kkxymc}</td>
        <td>{e.cs}</td>
        <td>{e.bjz}</td>
        <td>{e.xbzxzrds}</td>
        <td>{e.jxyzds}</td>
        <td>{e.bhdxg}</td>
        <td>{e.ysx}</td>
        <td>{e.yty}</td>
        <td>{e.zs}</td>
        <td>{e.bfb}</td>
        <td className="righttd"><div></div></td>
      </tr>);
    });
    return (<tbody>{tds}</tbody>);
  }

  refresh(page, { ...sets }) {
    // 未传第二个参数时sets为空对象{}
    // 判断sets是否为空（是否只是翻页）
    if (JSON.stringify(sets) !== "{}") {
      this.state = sets;
    }
    ajax({
      url: courseCenter.host + "getKcztList",
      data: {
        unifyCode: getCookie("userId"),
        college: sets.college || this.state.college,
        page: page,
        count: _COUNT
      },
      success: (gets) => {
        let datas = JSON.parse(gets);
        this.setState({
          list: datas.data.KcztList,
          page: page,
          pages: datas.data.totalPages,
          rows: datas.data.total
        });
      }
    });
  }

  render() {
    return (<div id="kczttj_lists">
      <div id="kczttj_table">
        <table>
          <thead>
            <tr>
              <td className="lefttd">
                <div></div>
              </td>
              <td>开课学院</td>
              <td width="8%">初始</td>
              <td width="8%">编辑中</td>
              <td width="8%">系部中心待审</td>
              <td width="8%">教学院长待审</td>
              <td width="8%">驳回</td>
              <td width="8%">已上线</td>
              <td width="8%">已停用</td>
              <td width="8%">课程总数</td>
              <td width="8%">上线率</td>
              <td className="righttd">
                <div></div>
              </td>
            </tr>
          </thead>
          {this.create_list()}
        </table>
      </div>
      <Fanye This={this}
        options={{
          page: this.state.page || 1,
          pages: this.state.pages || 1,
          rows: this.state.rows
        }}
        callback={this.refresh.bind(this)}
      />
    </div>);
  }

  componentDidMount() {
    ajax({
      url: courseCenter.host + "getKcztList",
      data: {
        unifyCode: getCookie("userId"),
        college: this.props.options.college,
        page: this.props.options.page,
        count: _COUNT
      },
      success: (gets) => {
        let datas = JSON.parse(gets);
        this.datas = datas.data.KcztList;
        this.setState({
          list: datas.data.KcztList,
          pages: datas.data.totalPages,
          rows: datas.data.total
        });
      }
    });
  }

  componentDidUpdate() {
    // 设置该frame的高度自适应
    if (window.frameElement) {
      window.frameElement.height = document.body.offsetHeight;
    }
  }
}


// class Fanye extends React.Component {
//   constructor(props) {
//     super(props);
//   }

//   create_popup_fanye() {
//     let nums=[];
//     let start=1;
//     let end=this.props.options.pages||1;
//     let now=this.props.options.page||1;
//     let page_on={color:"#007A51"};

//     let change_page=(p)=>{
//       if(p===now) {
//         nums.push(<li key={p} style={page_on}>{p}</li>);
//       } else {
//         nums.push(<li key={p} onClick={this.fanye.bind(this,p)}>{p}</li>);
//       }
//     }

//     if(end<1) {
//       nums.push(<li key="only" onClick={this.fanye.bind(this,1)}>1</li>)
//     } else if(end<=5) {
//       for(let i=1;i<=end;i++) {
//         change_page(i)
//       }
//     } else {
//       if(now<3) {
//         for(let i=1;i<=5;i++) {
//         change_page(i)
//         }
//       } else if(now>end-3) {
//         for(let i=end-5;i<=end;i++) {
//         change_page(i)
//         }
//       } else {
//         for(let i=now-2;i<=now+2;i++) {
//         change_page(i)
//         }
//       }
//     }

//     return (<div className="fanye">
//       <span id="rows">共{this.props.options.rows?this.props.options.rows:1}条记录</span>
//       <input className="fanye_options" type="button" value="首页"   id="fanye_start" onClick={this.fanye.bind(this,1)} />
//       <input className="fanye_options" type="button" value="上一页" id="fanye_pre"   onClick={this.fanye.bind(this,now===1?0:now-1)} />
//       <ul id="fanye_nums">{nums}</ul>
//       <input type="text" id="tp" ref="tp" placeholder={`${this.props.options.page}/${this.props.options.pages}`} />
//       <input className="fanye_options" type="button" value="下一页" id="fanye_next"  onClick={this.fanye.bind(this,now===end?0:now+1)} />
//       <input className="fanye_options" type="button" value="尾页"   id="fanye_end"   onClick={this.fanye.bind(this,end)} />
//     </div>);
//   }

//   fanye(p) {
//     this.refs.tp.value=null;
//     if(p==0) {
//       return;
//     }
//     this.props.This.refresh(p);
//   }

//   render() {
//     return this.create_popup_fanye();
//   }

//   componentDidMount() {
//     // 手动跳转翻页
//     this.refs.tp.onkeydown=(eve)=>{
//       if(eve.keyCode===13) {
//         if(!isNaN(+eve.target.value)) {
//           this.fanye(+eve.target.value);
//         } else {
//           eve.target.value=null;
//           eve.target.blur();
//         }
//       }
//     }
//   }
// }

var BluMUI_M = {
  BluMUI_Filter: Filter
}

var BluMUI = {
  result: {},
  menues: [],
  menue_names: {},
  create: function (data, type, elem) {
    var props = data, Blu = BluMUI_M[type];
    this.result[props.id] = ReactDOM.render(<Blu {...props} />, elem);
  }
};


export default BluMUI;