import ReactDOM from 'react-dom';
import React from 'react';

const ajax=require('../libs/post_ajax.js');
const Fanye=require('../libs/fanye.js');

const _COUNT = 10;

const SET = (key, value) => {
  sessionStorage.setItem("zjfzgl-"+key, value);
  return value;
}

const GET = (key) => {
  return sessionStorage.getItem("zjfzgl-"+key) || '';
}

class Option extends React.Component {
  constructor(props) {
    super(props);
    // read cache
    this.search_cache={
      zjfzpc: GET("zjfzpc"),
      fzx: GET("fzx"),
      zj: GET("zj")
    };

    this.state={
      TP: {
        page: 1,
        pages: 1,
        total: 1
      },
      list: [],

      zjfzpc: GET("zjfzpc"),
      fzx: GET("fzx"),
      zj: GET("zj"),
      zjfzpc_select: [],
      fzx_select: []
    };
  }

  search() {
    // cache search datas
    this.search_cache={
      zjfzpc: SET('zjfzpc',this.state.zjfzpc),
      fzx: SET('fzx',this.state.fzx),
      zj: SET('zj',this.state.zj)
    };
    this._get_list(1);
  }

  _get_list(p) {
    let page=p||+GET("page")||1;

    ajax({
      url: courseCenter.host+"getZjfzList",
      data: {
        unifyCode: getCookie('userId'),
        evaluateName: this.search_cache.zj,
        evaluateGroupBatch: this.search_cache.zjfzpc,
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
          list: datas.data.evaluateGroupList
        });
      }
    });
  }

  change_zjfzpc(e) {
    let evaluateGroupBatch, fzx;
    if(e) {
      // handle trriger
      fzx="";
      evaluateGroupBatch=e.target.value;
      // sessionStorage.removeItem("fzx");
    } else {
      // auto trriger
      fzx=this.search_cache.fzx;
      evaluateGroupBatch=this.state.zjfzpc;
    }
    this.setState({
      zjfzpc: evaluateGroupBatch
    });

    // charge fzx select list
    ajax({
      url: courseCenter.host+"getFzxByZjfzpc",
      data: {
        unifyCode: getCookie("userId"),
        evaluateGroupBatch: evaluateGroupBatch
      },
      success: (gets)=>{
        let datas=JSON.parse(gets);
        if(datas.meta.result!==100) {
          this.setState({
            fzx: fzx,
            fzx_select: []
          },this.search);
        } else {
          this.setState({
            fzx: fzx,
            fzx_select: datas.data
          },this.search);
        }
      }
    });
  }

  change_fzx(e) {
    this.setState({
      fzx: e.target.value
    },this.search);
  }

  change_zj(e) {
    this.setState({
      zj: e.target.value
    });
  }

  render() {
    return (
      <div id="Option_react">
        <div id="option">
          <div id="up">
            <button id="add" ref={btn=>this.add_btn=btn}>添加分组</button>
          </div>
          <div id="down">
            <span>专家分组批次：</span>
            <select 
              name="zjfzpc_select" 
              id="zjfzpc_select" 
              ref={sel=>this.zjfzpc_select=sel}
              value={this.state.zjfzpc}
              onChange={this.change_zjfzpc.bind(this)}
            >
              {
                [<option value="" key="default">请选择</option>].concat(
                  this.state.zjfzpc_select.map((op,index)=><option value={op.zjfzpc} key={index} >{op.zjfzpc}</option>)
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

            <span>专家：</span>
            <input 
              type="text" 
              ref={input=>this.zj_input=input} 
              id="zj_input" 
              value={this.state.zj} 
              onChange={this.change_zj.bind(this)}
            />

            <button ref={btn=>this.search_btn=btn} onClick={this.search.bind(this)} >搜索</button>
          </div>
        </div>

        <List list={this.state.list} />
        <Fanye TP={this.state.TP} callback={(p)=>{this._get_list(p)}} />
      </div>
    );
  }

  componentDidMount() {
    // charge zjfzpc select
    ajax({
      url: courseCenter.host+"getZjfzpc",
      data: {
        unifyCode: getCookie('userId')
      },
      success: (gets)=>{
        let datas=JSON.parse(gets);
        this.setState({
          zjfzpc_select: datas.data
        });
      }
    });
    this.change_zjfzpc();    

    this._get_list();

    // bind add option
    this.add_btn.onclick=()=>{window.location.href='./masterSortMasterEditor.html'};
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
          <td width="5px"></td>
          <td width="20%">专家分组批次</td>
          <td width="15%">分组批次</td>
          <td width="15%">分组项</td>
          <td width="30%">专家列表</td>
          <td width="15%">操作</td>
          <td width="5px"></td>
          <td className="righttd"><div></div></td>
        </tr>
      </thead>
    );
  }

  option(type, zjfzpc, fzpc, fzx, eve) {
    eve.preventDefault();
    switch(type) {
      case 'edit': 
        window.location.href=`./masterSortTeam.html?masterPC=${zjfzpc}&groupPC=${fzpc}&groupItem=${fzx}`;
        break;
      case 'delete':
        Creat_popup('delete', zjfzpc);
        break;
      case 'show':
        Creat_popup('show', zjfzpc.map(e=>e.xm));
        break;
      default:
        break;
    }
  }

  creat_tbody() {
    if(this.props.list.length===0) {
      return (
        <tbody>
          <tr>
            <td className="lefttd"></td>
            <td colSpan="7" style={{borderBottom: 'none'}}>
              <img id="err_img" src="../../imgs/public/error.png"/>
              <div>没有数据</div>
            </td>
            <td className="righttd"></td>
          </tr>
        </tbody>
      );
    }

    return(
      <tbody>
        {this.props.list.map((e,index)=><tr key={index}>
          <td className="lefttd"></td>
          <td></td>
          <td>{e.zjfzpc}</td>
          <td>{e.fzpc}</td>
          <td>{e.fzx}</td>
          <td>
            <span className="zj_list" onClick={this.option.bind(this,'show',e.evaluates,'','')}>
              <span className="zj_num">{`[${e.zjs}]`}</span>
              {
                (+e.zjs)>4 ?
                e.evaluates.map((zj,zjNo)=>zjNo<4&&<span key={zjNo} className="zj_name">{zj.xm}</span>).concat(<span key="dot">……</span>) :
                e.evaluates.map((zj,zjNo)=><span key={zjNo} className="zj_name">{zj.xm}</span>)
              }
            </span>
          </td>
          <td>
            <a href="#" onClick={this.option.bind(this,'edit',e.zjfzpc,e.fzpc,e.fzx)} >编辑</a>
            <a href="#" onClick={this.option.bind(this,'delete',e.zjfzpc,e.fzpc,e.fzx)} >删除</a>
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
            <div className="warning">将会删除该专家分组批次下所有分组项及专家的分组，请谨慎操作。</div>
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
            <div id="zjs">{id.map((zj,index)=><span key={index} className="zj">{zj}</span>)}</div>
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
          evaluateGroupBatch: id
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
        "delete": "deleteZjfzpc"
      };
      ajax({
        url: courseCenter.host+data_map[type],
        data: dat,
        success: (gets)=>{
          let datas=JSON.parse(gets);
          if(datas.meta.result==100) {
            cancel_popup();
            Zjfzgl_option._get_list();
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

var Zjfzgl_option=ReactDOM.render(
  <Option />,
  document.getElementById('zjfzgl')
);