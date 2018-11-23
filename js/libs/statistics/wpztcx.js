import React from 'react';
import ReactDOM from 'react-dom';

const ajax = require('../post_ajax.js');
const Fanye = require('../turnPage.js');

const _COUNT = 10;

const SET = (key, value) => {
  sessionStorage.setItem("wpjgcx-" + key, value);
  return value;
}

const GET = (key) => {
  return sessionStorage.getItem("wpjgcx-" + key) || '';
}

class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      kcmc: '',
      zjxm: '',
      zt: '',
      wppc: '',
      kkxy: '',
      kkxbzx: '',
      page: 1,
      pages: 1,
      total: 0,
      lists: []
    };
  }

  //网评批次选项
  get_wppc_select() {
    ajax({
      url: courseCenter.host + 'reviewBriefList',
      data: {
        userID: getCookie('userId'),
        state: 4,
        expGroup: ''
      },
      success: (gets) => {
        let datas = JSON.parse(gets);
        let ops = [`<option value="">请选择</option>`];
        datas.data.list.forEach(e => {
          ops.push(`<option value="${e.wppc}">${e.wppc}</option>`)
        })
        this.wppc_select.innerHTML = ops.join('');
      }
    })
  }
  //开课学院选项
  get_kkxy_select() {
    ajax({
      url: courseCenter.host + 'getCollege',
      data: {
        unifyCode: getCookie('userId')
      },
      success: (gets) => {
        let datas = JSON.parse(gets);
        let ops = [`<option value="">请选择</option>`];
        datas.data.forEach(e => {
          ops.push(`<option value="${e.kkxymc}">${e.kkxymc}</option>`)
        })
        this.kkxy_select.innerHTML = ops.join('');
      }
    })
  }

  //开课系部中心选项
  get_kkxbzx_select(college) {
    if (college) {
      ajax({
        url: courseCenter.host + 'getCourseDepartment',
        data: {
          unifyCode: getCookie('userId'),
          college: college
        },
        success: (gets) => {
          let datas = JSON.parse(gets);
          let ops = [`<option value="">请选择</option>`];
          datas.data.forEach(e => {
            ops.push(`<option value="${e.jysmc}">${e.jysmc}</option>`)
          })
          this.kkxbzx_select.innerHTML = ops.join('');
        }
      })
    } else {
      this.kkxbzx_select.innerHTML = `<option value="">请选择</option>`;
    }

  }

  change_zt(eve) {
    this.setState({ zt: eve.target.value }, this._get_list);
  }

  _get_list(p) {
    p = p || 1;
    let D = {
      unifyCode: getCookie("userId"),
      reviewBatch: this.state.wppc,
      college: this.state.kkxy,
      courseDepartment: this.state.kkxbzx,
      courseName: this.state.kcmc,
      evaluateName: this.state.zjxm,
      state: this.state.zt,
      page: p,
      count: _COUNT
    };
    ajax({
      url: courseCenter.host + "getWpztList",
      data: D,
      success: (gets) => {
        let datas = JSON.parse(gets);
        if (datas.meta.result === 100) {
          this.setState({
            page: p,
            pages: datas.data.totalPages,
            total: datas.data.total,
            lists: datas.data.wpztList
          });
        }
      }
    });
  }

  render() {
    return (<div className='filters'>
      <div className="top">
        <span>网评批次：</span>
        <select name="wppc" id="wppc" onChange={(eve) => { this.state.wppc = eve.target.value; this._get_list() }} ref={sel => this.wppc_select = sel}>
          <option value="">请选择</option>
        </select>
        <span>开课学院：</span>
        <select name="kkxy" id="kkxy" onChange={(eve) => { this.state.kkxy = eve.target.value; this.get_kkxbzx_select(eve.target.value); this._get_list() }} ref={sel => this.kkxy_select = sel}>
          <option value="">请选择</option>
        </select>
        <span>开课系部中心：</span>
        <select name="kkxbzx" id="kkxbzx" onChange={(eve) => { this.state.kkxbzx = eve.target.value; this._get_list() }} ref={sel => this.kkxbzx_select = sel}>
          <option value="">请选择</option>
        </select>
        <span>课程名称：</span>
        <input placeholder="请输入课程名称" type="text" value={this.state.kcmc}
          onChange={(eve) => { this.setState({ kcmc: eve.target.value }) }}
          onKeyDown={(eve) => { if (eve.keyCode === 13) this._get_list(1) }}
        />
        <span>专家姓名：</span>
        <input placeholder="请输入专家姓名" type="text" value={this.state.zjxm}
          onChange={(eve) => { this.setState({ zjxm: eve.target.value }) }}
          onKeyDown={(eve) => { if (eve.keyCode === 13) this._get_list(1) }}
        />
        <span>状态：</span>
        <select name="zt" id="zt" ref={sel => this.zt_select = sel} onChange={this.change_zt.bind(this)} defaultValue={this.state.zt}>
          <option value="">请选择</option>
          <option value="0">待评价</option>
          <option value="1">待提交</option>
          <option value="2">已提交</option>
        </select>
        <button id="search" onClick={this._get_list.bind(this, 1)}>搜索</button>
      </div>
      <Table lists={this.state.lists}></Table>
      <Fanye options={{
        page: this.state.page,
        pages: this.state.pages,
        rows: this.state.total
      }}
        This={this}
        callback={this._get_list.bind(this)}
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
      lists.push(<tr className="list-item" key={index} onClick={this.show_detail.bind(this, index)}>
        <td></td>
        <td>{e.wppc}</td>
        <td>{e.kkxymc}</td>
        <td>{e.jysmc}</td>
        <td>{e.kcbh}</td>
        <td>{e.kcmc}</td>
        <td>{e.ZJXM}</td>
        <td>{e.JSSJ}</td>
        <td>{e.TJZT}</td>
        <td>{e.CZSJ}</td>
        <td>{parseInt(+e.ZF)}</td>
        <td>{e.PJ}</td>
        <td></td>
      </tr>);
    });
    return (<tbody>
      {lists}
    </tbody>);
  }

  render() {
    return (<table>
      <thead>
        <tr>
          <td className="lefttd"></td>
          <td>网评批次</td>
          <td>学院名称</td>
          <td>系部中心</td>
          <td>课程编号</td>
          <td>课程名称</td>
          <td>专家姓名</td>
          <td>结束时间</td>
          <td>提交状态</td>
          <td>提交时间</td>
          <td>总分</td>
          <td style={{ maxWidth: "200px" }}>评价</td>
          <td className="righttd"></td>
        </tr>
      </thead>
      {this.create_tbody()}
    </table>);
  }

  componentDidUpdate(prevProps, prevState) {
    if (window.frameElement) {
      window.frameElement.height = document.body.scrollHeight;
    }
  }
}


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
