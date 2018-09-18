import ReactDOM from 'react-dom';
import React from 'react';

const ajax=require('../libs/post_ajax.js');
const Fanye=require('../libs/fanye.js');

const _COUNT = 10;

const SET = (key, value) => {
  sessionStorage.setItem("kcfzgl-"+key, value);
  return value;
}

const GET = (key) => {
  return sessionStorage.getItem("kcfzgl-"+key) || '';
}

class Option extends React.Component {
  constructor(props) {
    super(props);
    // read cache
    this.search_cache={
      wppc: GET("wppc"),
      fzx: GET("fzx"),
      kcmc: GET("kcmc")
    };

    this.state={
      TP: {
        page: 1,
        pages: 1,
        total: 1
      },
      list: [],

      wppc: GET("wppc"),
      fzx: GET("fzx"),
      kcmc: GET("kcmc"),
      wppc_select: [],
      fzx_select: []
    };
  }

  search() {
    // cache search datas
    this.search_cache={
      wppc: SET('wppc',this.state.wppc),
      fzx: SET('fzx',this.state.fzx),
      kcmc: SET('kcmc',this.state.kcmc)
    };
    this._get_list(1);
  }

  _get_list(p) {
    let page=p||+GET("page")||1;

    ajax({
      url: courseCenter.host+"getKcfzList",
      data: {
        unifyCode: getCookie('userId'),
        reviewBatch: this.search_cache.wppc,
        courseName: this.search_cache.kcmc,
        group: this.search_cache.fzx,
        count: _COUNT,
        page: page
      },
      success: (gets)=>{
        let datas=JSON.parse(gets);
        SET("page", page);
        this.setState({
          TP: {
            page: page,
            pages: datas.data.totalPages,
            total:datas.data.total
          },
          list: datas.data.courseGroupList
        });
      }
    });
  }

  change_wppc(e) {
    let reviewBatch, fzx;
    if(e) {
      // handle trriger
      fzx="";
      reviewBatch=e.target.value;
      // sessionStorage.removeItem("fzx");
    } else {
      // auto trriger
      fzx=this.search_cache.fzx;
      reviewBatch=this.state.wppc;
    }
    this.setState({
      wppc: reviewBatch
    }, () => {
      this.search();
    });

    // charge fzx select list
    ajax({
      url: courseCenter.host+"getFzxByWppc",
      data: {
        unifyCode: getCookie("userId"),
        reviewBatch: reviewBatch
      },
      success: (gets)=>{
        let datas=JSON.parse(gets);
        if(datas.meta.result!==100) {
          this.setState({
            fzx: fzx,
            fzx_select: []
          });
        } else {
          this.setState({
            fzx: fzx,
            fzx_select: datas.data
          });
        }
      }
    });
  }

  change_fzx(e) {
    this.setState({
      fzx: e.target.value
    }, () => {
      this.search();
    });
  }

  render() {
    return (
      <div id="Option_react">
        <div id="option">
          <div id="down">
            <span>网评批次：</span>
            <select 
              name="wppc_select" 
              id="wppc_select" 
              ref={sel=>this.wppc_select=sel}
              value={this.state.wppc}
              onChange={this.change_wppc.bind(this)}
            >
              {
                [<option value="" key="default">请选择</option>].concat(
                  this.state.wppc_select.map((op,index)=><option value={op.wppc} key={index} >{op.wppc}</option>)
                )
              }
            </select>

            <span>分组项：</span>
            <select 
              name="fzx_select" 
              id="fzx_select" 
              ref={sel=>this.fzx_select=sel}
              value={this.state.fzx}
              onChange={this.change_fzx.bind(this)}
            >
              {
                [<option value="" key="default">请选择</option>].concat(
                  this.state.fzx_select.map((op,index)=><option value={op.fzx} key={index} >{op.fzx}</option>)
                )
              }
            </select>

          </div>
        </div>

        <List list={this.state.list} />
        <Fanye TP={this.state.TP} callback={(p)=>{this._get_list(p)}} />
      </div>
    );
  }

  componentDidMount() {
    // charge wppc select
    ajax({
      url: courseCenter.host+"reviewBriefList",
      data: {
        userID: getCookie('userId'),
        state: 1,
        expGroup: ''
      },
      success: (gets)=>{
        let datas=JSON.parse(gets);
        if(datas.meta.result===100) {
          this.setState({
            wppc_select: datas.data.list
          });
        } else {
          this.setState({
            wppc_select: []
          });
        }
      }
    });
    this.change_wppc();    

    this._get_list();
  }
}

class List extends React.Component {
  constructor(props) {
    super(props);
  }

  creat_thead() {
    return(
      <thead>
        <tr>
          <td className="lefttd"><div></div></td>
          <td width="0px"></td>
          <td width="10%">网评批次</td>
          <td width="15%">分组批次</td>
          <td width="15%">分组项</td>
          <td>课程列表</td>
          <td width="15%">操作</td>
          <td width="0px"></td>
          <td className="righttd"><div></div></td>
        </tr>
      </thead>
    );
  }

  option(type, data, data2, data3, eve) {
    eve.preventDefault();
    switch(type) {
      case 'edit': 
        window.location.href=`./materCourseSort.html?fzx=${data2}&wppc=${data}&wppcId=${data3}`;
        break;
      case 'delete':
        Creat_popup('delete', data);
        break;
      case 'show':
        Creat_popup('show', data.map(e=>e.kcmc));
        break;
      default:
        break;
    }
  }

  creat_tbody() {
    return(
      <tbody>
        {this.props.list.map((e,index)=><tr key={index}>
          <td className="lefttd"></td>
          <td></td>
          <td>{e.wppc}</td>
          <td>{e.fzpc}</td>
          <td>{e.fzx}</td>
          <td>
            <span className="kcmc_num">{`[${e.kcs}]`}</span>
            <span className="kcmc_list" onClick={this.option.bind(this,'show',e.courseList,e.fzx,e.wpid)}>
              {
                (+e.kcmcs)>3 ?
                e.courseList.map((kcmc,kcmcNo)=>kcmcNo<3&&<span key={kcmcNo} className="kcmc_name">{kcmc.xm}</span>).concat(<span key="dot">……</span>) :
                e.courseList.map((kcmc,kcmcNo)=><span key={kcmcNo} className="kcmc_name">{kcmc.kcmc}</span>)
              }
            </span>
          </td>
          <td>
            <a href="#" onClick={this.option.bind(this,'edit',e.wppc,e.fzx,e.wpid)} >编辑</a>
          </td>
          <td></td>
          <td className='righttd'></td>
        </tr>)}
      </tbody>
    );
  }

  render() {
    return (
      <div id="List">
        <table>
          {this.creat_thead()}
          {this.creat_tbody()}
        </table>
      </div>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if(window.frameElement) {
      window.frameElement.height=document.body.offsetHeight;
    }
  }
}



class Popup extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {type,id}=this.props;
    const MAP={
      "delete": "删除"
    };

    switch(type) {
      case 'delete':
        return(
          <div id="popbody" ref='pb'>
            <div id="msg">
              <p>{`确定要${MAP[type]+id}?`}</p>
            </div>
            <div id="popup_option">
              <button id="popup_OK" ref={btn=>this.OK=btn}>确定</button>
              <button id="popup_back" ref={btn=>this.back=btn}>取消</button>
            </div>
          </div>
        );
        break;
      case 'show':
        return(
          <div id="popbody" ref="pb">
            <div id="kcmcs">{id.map((kcmc,index)=><span key={index} className="kcmc">{kcmc}</span>)}</div>
          </div>
        );
        break;
      default: 
        return(<div></div>);
        break;
    }
  }

  componentDidMount() {
    const {id,type}=this.props;
    // background click to cancel
    this.refs.pb.onclick=e=>e.stopPropagation();
    let dat={};

    switch(type) {
      case "delete":
        dat={
          unifyCode: getCookie("userId"),
          reviewId: id
        };
        break;
      default:
        break;
    }

    // back button click to cancel
    this.back&&(this.back.onclick=cancel_popup);
    // OK button option
    this.OK&&(this.OK.onclick=()=>{
      let data_map={
        "delete": "deleteKcfz"
      };
      ajax({
        url: courseCenter.host+data_map[type],
        data: dat,
        success: (gets)=>{
          let datas=JSON.parse(gets);
          if(datas.meta.result==100) {
            cancel_popup();
            Kcfzgl_option._get_list();
          }
        }
      });
    });
  }
}

function Creat_popup(type, id) {
  const popup=document.getElementById('popup');
  const popup_datas={
    type: type,
    id: id
  };
  ReactDOM.render(
    <Popup {...popup_datas}/>,
    document.getElementById('popup')
  );
  // click to close popup
  popup.style.display="block";
  popup.onclick=cancel_popup;
}

function cancel_popup() {
  let popup=document.getElementById('popup');
  popup.style.display="none";
  ReactDOM.unmountComponentAtNode(popup);
}

var Kcfzgl_option=ReactDOM.render(
  <Option />,
  document.getElementById('kcfzgl')
);