import React from 'react';
import ReactDOM from 'react-dom';

const ajax=require('../post_ajax.js');
const Fanye=require('../turnPage.js');

const _COUNT = 10;

const SET = (key, value) => {
  sessionStorage.setItem("wpjgcx-"+key, value);
  return value;
};

const GET = (key) => {
  return sessionStorage.getItem("wpjgcx-"+key) || '';
};

class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      kcmc: '',
      wppc: '',
      kkxy: '',
      kkxbzx: '',
      page: 1,
      pages: 1,
      total: 1,
      lists: []
    };
  }
  //获取网评批次选项
  get_wppc_select() {
    ajax({
      url: courseCenter.host+'reviewBriefList',
      data:{
        userID: getCookie('userId'),
        state: 4,
        expGroup: ''
      },
      success: (gets)=>{
        let datas=JSON.parse(gets);
        let ops=[`<option value="">请选择</option>`];
        datas.data.list.forEach(e=>{
          ops.push(`<option value="${e.wppc}">${e.wppc}</option>`)
        })
        this.wppc_select.innerHTML=ops.join('');
      }
    })
  }

  //获取开课学院选项
  get_kkxy_select() {
    ajax({
      url: courseCenter.host+'getCollege',
      data:{
        unifyCode: getCookie('userId')
      },
      success: (gets)=>{
        let datas=JSON.parse(gets);
        let ops=[`<option value="">请选择</option>`];
        datas.data.forEach(e=>{
          ops.push(`<option value="${e.kkxymc}">${e.kkxymc}</option>`)
        })
        this.kkxy_select.innerHTML=ops.join('');
      }
    })
  }

  //获取开课系部中心选项
  get_kkxbzx_select(college) {
    ajax({
      url: courseCenter.host+'getCourseDepartment',
      data:{
        unifyCode: getCookie('userId'),
        college: college
      },
      success: (gets)=>{
        let datas=JSON.parse(gets);
        let ops=[`<option value="">请选择</option>`];
        datas.data.forEach(e=>{
          ops.push(`<option value="${e.jysmc}">${e.jysmc}</option>`)
        })
        this.kkxbzx_select.innerHTML=ops.join('');
      }
    })
  }

  
  _get_list(p) {
    p = p || 1;
    let D = {
      unifyCode: getCookie("userId"),
      reviewBatch: this.state.wppc,
      college: this.state.kkxy,
      courseDepartment: this.state.kkxbzx,
      courseName: this.state.kcmc,
      page: p,
      count: _COUNT
    };
    ajax({
      url: courseCenter.host + "getWpjgList",
      data: D,
      success: (gets) => {
        let datas = JSON.parse(gets);
        if (datas.meta.result === 100) {
          this.setState({
            page: p,
            pages: datas.data.totalPages,
            total: datas.data.total,
            lists: datas.data.wpjgList
          });
        }
      }
    });
  }

  render() {
    return (<div className='filters'>
      <div className="top">
        <span>网评批次：</span>
        <select name="wppc" id="wppc" onChange={(eve)=>{this.state.wppc=eve.target.value}} ref={sel=>this.wppc_select=sel}>
          <option value="">请选择</option>
        </select>
        <span>开课学院：</span>
        <select name="kkxy" id="kkxy" onChange={(eve)=>{this.state.kkxy=eve.target.value;this.get_kkxbzx_select(eve.target.value)}} ref={sel=>this.kkxy_select=sel}>
          <option value="">请选择</option>
        </select>
        <span>开课系部中心：</span>
        <select name="kkxbzx" id="kkxbzx" onChange={(eve)=>{this.state.kkxbzx=eve.target.value}} ref={sel=>this.kkxbzx_select=sel}>
          <option value="">请选择</option>
        </select>
        <span>课程名称：</span>
        <input placeholder="请输入课程名称" type="text" value={this.state.kcmc} onChange={(eve)=>{this.setState({kcmc: eve.target.value})}}
          onKeyDown={(eve)=>{
            if (eve.keyCode===13) {
              this._get_list(1)
            }
          }}
        />
        <button id="search" onClick={this._get_list.bind(this,1)}>搜索</button>
      </div>
      <Table lists={this.state.lists}></Table>
      <Fanye options={{
          page: this.state.page,
          pages: this.state.pages,
          total: this.state.total
        }}
        This={this}
        callback={this._get_list.bind(this,1)}
      ></Fanye>
    </div>);
  }

  componentDidMount() {
    this.get_wppc_select();
    this.get_kkxy_select();
    this._get_list(1);
  }
}

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showToggles: new Array(10).fill(false)
    }
  }

  show_detail(index) {
    let toggles = this.state.showToggles;
    toggles[index] = !toggles[index];
    this.setState({
      showToggles: toggles
    });
  }

  create_tbody() {
    let lists = [];
    this.props.lists.forEach((e, index) => {
      lists.push(<tr className="list-item" key={index} onClick = {this.show_detail.bind(this, index)}>
        <td></td>
        <td></td>
        <td>{ e.wppc }</td>
        <td>{ e.kkxymc }</td>
        <td>{ e.jysmc }</td>
        <td>{ e.kcbh }</td>
        <td>{ e.kcmc }</td>
        <td>{ e.pjf || 0 }</td>
        <td></td>
        <td></td>
      </tr>);
      lists.push(<Item key={'it-'+index} show={this.state.showToggles[index]} wpid={e.wpid} kcbh={e.kcbh}></Item>);
    });
    return(<tbody>
      { lists }
    </tbody>);
  }

  render() {
    return (<table>
      <thead>
        <tr>
          <td className="lefttd"><div></div></td>
          <td width="5px"></td>
          <td width="15%">网评批次</td>
          <td width="15%">学院名称</td>
          <td width="15%">系部中心</td>
          <td width="15%">课程编号</td>
          <td width="">课程名称</td>
          <td width="10%">平均分（得分）</td>
          <td width="5px"></td>
          <td className="righttd"><div></div></td>
        </tr>
      </thead>
      {this.create_tbody()}
    </table>);
  }

  componentDidUpdate(prevProps, prevState) {
    if(window.frameElement) {
      window.frameElement.height=document.body.scrollHeight;
    }
  }
}


class Item extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teachers: []
    };
  }

  render() {
    let pf = this.state.teachers.map((e,ei) => <div className="item-zj" key={ei}>
      <p>专家姓名：{e.xm}<span className="df">总分：{e.zf}</span></p>
      <p><span className="item-l">指标项</span><span className="item-r">得分</span></p>
      {
        e.zbxdfList.map((m, mi) => <p key={mi}>
          <span className="item-l">{m.zbx}</span>
          <span className="item-r">{m.pf}</span>
        </p>)
      }
      <p>评价：{e.pj}</p>
    </div>);
    return (<tr className="items"
                style={{
                  display: this.props.show ? 'table-row' : 'none'
                }}
    >
      <td colSpan={10} className="item-td">
        <div className="th">{ pf }</div>
      </td>
    </tr>);
  }

  componentDidMount() {
    ajax({
      url: courseCenter.host + 'getWpjgxqList',
      data: {
        unifyCode: getCookie('userId'),
        reviewId: this.props.wpid,// wpid
        courseNo: this.props.kcbh,//kcbh
        count: 10 * _COUNT,
        page: 1
      },
      success: (gets) => {
        let datas = JSON.parse(gets);
        this.setState({
          teachers: datas.data.wpjgxqList
        });
      }
    });
  }
}

var BluMUI_M = {
  BluMUI_Filter: Filter
}

var BluMUI = {
  result: {},
  menues:[],
  menue_names:{},
  create: function (data, type, elem) {
    var props = data, Blu = BluMUI_M[type];
    this.result[props.id] = ReactDOM.render(<Blu {...props}/>, elem);
  }
};


export default BluMUI;
