import React from 'react';
import ReactDOM from 'react-dom';
var ajax=require('./post_ajax.js');
var OUT_COUNT=10;




// 独立页面--------------------------------------------------------------
var Kcfzgl_option = '';
const _COUNT = 10;

const SET = (key, value) => {
  sessionStorage.setItem("kcfzgl-"+key, value);
  return value;
}

const GET = (key) => {
  return sessionStorage.getItem("kcfzgl-"+key) || '';
}
class Fanye extends React.Component {
  constructor(props) {
    super(props);
  }

  create_popup_fanye() {
    if(this.props.TP.pages < 1) {
      return null;
    }
    if(this.props.TP.total===0) {
      return <div style={{height:'21px',padding: '30px 0'}}></div>;
    }

    let nums=[];
    let start=1;
    let end=this.props.TP.pages||1;
    let now=this.props.TP.page||1;
    let page_on={color:"#007A51"};

    let change_page=(p)=>{
      if(p===now) {
        nums.push(<li key={p} style={page_on}>{p}</li>);
      } else {
        nums.push(<li key={p} onClick={this.fanye.bind(this,p)}>{p}</li>);
      }
    }

    if(end<1) {
      nums.push(<li key="only" onClick={this.fanye.bind(this,1)}>1</li>)
    } else if(end<=5) {
      for(let i=1;i<=end;i++) {
        change_page(i)
      }
    } else {
      if(now<3) {
        for(let i=1;i<=5;i++) {
        change_page(i)
        }
      } else if(now>end-3) {
        for(let i=end-4;i<=end;i++) {
        change_page(i)
        }
      } else {
        for(let i=now-2;i<=now+2;i++) {
        change_page(i)
        }
      }
    }

    return (<div className="fanye">
      <span className="total">共{this.props.TP.total>=0?this.props.TP.total:1}条记录</span>
      <input className="fanye_options fanye_start" type="button" value="首页" onClick={this.fanye.bind(this,now===1?0:1)} />
      <input className="fanye_options fanye_pre" type="button" value="上一页" onClick={this.fanye.bind(this,now===1?0:now-1)} />
      <ul className="fanye_nums">{nums}</ul>
      <input type="text" className="tp" ref="tp" placeholder={`${this.props.TP.page}/${this.props.TP.pages}`} />
      <input className="fanye_options fanye_next" type="button" value="下一页" onClick={this.fanye.bind(this,now===end?0:now+1)} />
      <input className="fanye_options fanye_end" type="button" value="尾页" onClick={this.fanye.bind(this,now===end?0:end)} />
    </div>);
  }

  fanye(p) {
    if (!this.refs.tp) {
      return;
    }
    this.refs.tp.value=null;
    if(p==0) {
      return;
    }
    this.props.callback(p);
  }

  render() {
    return this.create_popup_fanye();
  }

  componentDidMount() {
    if (!this.refs.tp) {
      return;
    }
    // 手动跳转翻页
    this.refs.tp.onkeydown=(eve)=>{
      if(eve.keyCode===13) {
        let newpage=+eve.target.value;
        if(!isNaN(newpage)) {
          if(newpage>=1&&newpage<=this.props.TP.pages) {
            this.fanye(newpage);
          } else {
            eve.target.value=null;
          }
        } else {
          eve.target.value=null;
        }
        eve.target.blur();
      }
    }
  }
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
          <td width="10%">网评批次</td>
          <td width="15%">分组批次</td>
          <td width="15%">分组项</td>
          <td>课程列表</td>
          <td width="10%">操作</td>
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
  const popupB=document.getElementById('popup-b');
  const popup_datas={
    type: type,
    id: id
  };
  ReactDOM.render(
    <Popup {...popup_datas}/>,
    document.getElementById('popup-b')
  );
  // click to close popup
  popupB.style.display="block";
  popupB.onclick=cancel_popup;
}

function cancel_popup() {
  let popupB=document.getElementById('popup-b');
  popupB.style.display="none";
  ReactDOM.unmountComponentAtNode(popupB);
}

// var Kcfzgl_option=ReactDOM.render(
//   <Option />,
//   document.getElementById('kcfzgl')
// );
// 独立页面--------------------------------------------------------------






/**
 * ******************课程管理******************
 */

class BlueMUI_CreateFanye extends React.Component {
  constructor(props) {
    super(props);
    this.fanye=this.fanye.bind(this);
    this.create_popup_fanye=this.create_popup_fanye.bind(this);
  }

  create_popup_fanye() {
    let style={};
    let fanye=[];
    let start=1;
    let end=this.props.pages;
    let style_on={
      background:"url('../../imgs/courseAudit/fanye_bg.png')",
      backgroundRepeat:'no-repeat',
      backgroundPosition:'5px 5px',
      color:'#FFF'
    };
    if(this.props.pages<1) {
      return <div></div>;
    }
    if(this.props.pages<=7) {
      for(let i=2;i<this.props.pages;i++) {
        if(i==this.props.page) {
          style=style_on;
        } else {
          style={};
        }
        fanye.push(<li key={i} style={style} onClick={this.fanye.bind(this,i)}>{i}</li>);
      }
    } else {
      if(this.props.page<5) {
        for(let j=2;j<=6;j++) {
          if(j==this.props.page) {
            style=style_on;
          } else {
            style={};
          }
          fanye.push(<li key={j} style={style} onClick={this.fanye.bind(this,j)}>{j}</li>);
        }
        fanye.push(<li key='end' >...</li>);
      } else if(this.props.page>this.props.pages-4) {
        for(let k=this.props.pages-5;k<this.props.pages;k++) {
          if(k==this.props.page) {
            style=style_on;
          } else {
            style={};
          }
          fanye.push(<li key={k} style={style} onClick={this.fanye.bind(this,k)}>{k}</li>);
        }
        fanye.unshift(<li key='start' >...</li>);
      } else {
        for(let l=this.props.page-2;l<=this.props.page+2; l++) {
          if(l==this.props.page) {
            style=style_on;
          } else {
            style={};
          }
          fanye.push(<li key={l} style={style} onClick={this.fanye.bind(this,l)}>{l}</li>);
        }
        fanye.unshift(<li key='start' >...</li>);
        fanye.push(<li key='end' >...</li>);
      }
    }
    if(1==this.props.pages) {
      fanye.push(<li key={1} style={style_on}>{1}</li>);
    } else if(this.props.page==this.props.pages) {
      fanye.unshift(<li key={1} onClick={this.fanye.bind(this,1)}>{1}</li>);
      fanye.push(<li key={this.props.pages} style={style_on}>{this.props.pages}</li>);
    } else if(this.props.page==1) {
      fanye.unshift(<li key={1} style={style_on}>{1}</li>);
      fanye.push(<li key={this.props.pages} onClick={this.fanye.bind(this,this.props.pages)}>{this.props.pages}</li>);
    } else {
      fanye.unshift(<li key={1} onClick={this.fanye.bind(this,1)}>{1}</li>);
      fanye.push(<li key={this.props.pages} onClick={this.fanye.bind(this,this.props.pages)}>{this.props.pages}</li>);
    }
    return(<div id={this.props.id}>
      <div id="fanye_pre" ref="pre" onClick={this.fanye.bind(this,this.props.page-1<1?0:this.props.page-1)}><img src="../../imgs/courseAudit/fanye_left.png" alt=""/></div>
      <ul ref="popup_fanye">
        {fanye}
      </ul>
      <div id="fanye_next" ref="next" onClick={this.fanye.bind(this,this.props.page+1>this.props.pages?0:this.props.page+1)}><img src="../../imgs/courseAudit/fanye_right.png" alt=""/></div>
    </div>);
  }

  fanye(p) {
    if(p==0||BluMUI.result.Tab.state.subModule==='kcfz') {
      return;
    }
    Array().map.call(
      document.getElementById('center_table').getElementsByTagName('input'),
      e=>{e.checked=false;}
    );
    this.props.This.setState({page:p});
  }

  render() {
    return this.create_popup_fanye();
  }
}

//入口(tabs)
class BlueMUI_CreateTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      subModule:parseHash(window.location.href).subModule||this.props.tabs[0].subModule
    };
  }

  change_subModule(Module) {
    this.setState({subModule:Module});
    if(BluMUI.result.Options) {
      BluMUI.result.Options.setState({
        subModule:Module,
        page:1
      });
    }

    // 清空搜索内容
    if(document.getElementById('jxtdss')) {
      document.getElementById('jxtdss').value='';
    }
  }

  render() {
    let tabs=[];

    if(this.props.tabs.length>0) {
      this.props.tabs.map((e,index)=>{
        tabs.push(<li key={e.subModule} ref={e.subModule} onClick={this.change_subModule.bind(this,e.subModule)}>{e.cdmc}</li>);
        tabs.push(<li key={'tab_line'+index} className='tab_line'></li>);
      });
      tabs.pop();
    } else {
      alert("数据获取失败，请刷新页面！");
    }
    return(<div id='tabs'><ul id='tab' ref='tabs'>{tabs}</ul></div>);
  }

  componentDidMount() {
    this.refs[this.state.subModule].style.color='#009361';
  }

  componentWillUpdate(nextProps, nextState) {
    let end=this.refs.tabs.children.length;
    for(let i=0;i<end;i++) {
      this.refs.tabs.children[i].style.color='#999999';
    }
    this.refs[nextState.subModule].style.color='#009361';
  }

}

//显示options(6个过滤条件)
class BlueMUI_CreateOptions extends React.Component {
  constructor(props) {
    super(props);
    this.pages=1;
    // 默认state
    this.state={
      subModule:this.props.subModule,
      page:1,
      course_state:[1,1,1,1,1,1],
    };
    this.change_course_state=this.change_course_state.bind(this);
    this.allcheck=this.allcheck.bind(this);
  }

  // 单个复选框选中
  change_course_state(eve) {
    let bit= +eve.target.value;
    let check= +this.refs['check-'+bit].checked;
    let new_state;
    if(this.refs.allchecked.checked) {
      new_state=[0,0,0,0,0,0];
    } else {
      new_state=this.state.course_state;
    }
    this.refs.allchecked.checked=false;
    new_state.splice(bit,1,check);
    this.setState({
      page:1,
      course_state:new_state
    });
  }

  allcheck(eve) {
    if(eve.target.checked) {
      for(let i=0;i<6;i++) {
        this.refs['check-'+i].checked=false;
      }
      this.setState({
        page:1,
        course_state:[1,1,1,1,1,1]
      });
    } else {
      this.setState({
        page:1,
        course_state:[0,0,0,0,0,0]
      });
    }
  }
  componentDidMount() {
    let that=this;
    let val = this.refs.serchValue ? this.refs.serchValue.value : '';
    function hand_serch(eve) {
      let searchValue = '';
      if (document.getElementById('jxtdss')) {
        searchValue = document.getElementById('jxtdss').value;
      }
      BlueMUI_GetList(
        that.state.subModule,
        1,
        that.state.course_state,
        searchValue,
        that
      );
    }
    //查询列表
    BlueMUI_GetList(this.state.subModule,this.state.page,this.state.course_state,val,this);
    if(this.refs.serchValue) {
      this.refs.serchValue.onkeydown=e=>{
        if(e.keyCode==13) {
          hand_serch();
        }
      }
    }
    if(this.state.subModule!='audit'||this.state.subModule!='kcfz') {
      this.refs.allchecked.checked=true;
    }
    if (this.state.subModule==='kcfz') {
      return;
    }
    if (this.refs.serchBtn) {
      this.refs.serchBtn.onclick=hand_serch;
    }
  }
  componentWillUpdate(nextProps, nextState) {
    if (nextState.subModule==='kcfz') {
      return;
    }
    if(nextState.subModule!=this.state.subModule) {
      nextState.course_state=[1,1,1,1,1,1];
    }
    if (this.refs.serchValue) {
      BlueMUI_GetList(nextState.subModule,nextState.page,nextState.course_state,this.refs.serchValue.value,this);
    } else {
      BlueMUI_GetList(nextState.subModule,nextState.page,nextState.course_state,'',this);
    }
  }

  render() {
    let double_option='';
    if (this.state.subModule!=='audit') {
      double_option = <div>
          <div id="out_serch">
            <span>课程名称：</span>
            <div id="search-box">
              <input type="text" id="jxtdss" ref="serchValue"/>
              <span id="serch_btn" ref="serchBtn">搜索</span>
            </div>
          </div>
        </div>;
    } else {
      double_option = '';
    }
    // label用作勾选框，中间不能填字
    let filter_items=<ul id="option_bar">
      <li><input type="checkbox" ref='check-5' value="5" id="itm5" onChange={this.change_course_state}/><label htmlFor="itm5"></label>已上线</li>
      <li><input type="checkbox" ref='check-4' value="4" id="itm4" onChange={this.change_course_state}/><label htmlFor="itm4"></label>已停用</li>
      <li><input type="checkbox" ref='check-3' value="3" id="itm3" onChange={this.change_course_state}/><label htmlFor="itm3"></label>驳回</li>
      <li><input type="checkbox" ref='check-2' value="2" id="itm2" onChange={this.change_course_state}/><label htmlFor="itm2"></label>待审核</li>
      <li><input type="checkbox" ref='check-1' value="1" id="itm1" onChange={this.change_course_state}/><label htmlFor="itm1"></label>编辑中</li>
      <li><input type="checkbox" ref='check-0' value="0" id="itm0" onChange={this.change_course_state}/><label htmlFor="itm0"></label>初始</li>
    </ul>;
    let filter_allcheck=<span id="option_allcheck">
      <input type="checkbox" value="7" ref='allchecked' id="itm7" onChange={this.allcheck}/>
      <label htmlFor="itm7"></label>所有课程
    </span>;
    let space_div=<div style={{width:'1px',height:'18px'}}></div>

    return(<div id="options">
      {(this.state.subModule=='audit'||this.state.subModule=='kcfz')?'':filter_items}
      {(this.state.subModule=='audit'||this.state.subModule=='kcfz')?space_div:filter_allcheck}
      <div style={{clear:'both'}}></div>
      <div id="hr"></div>
      {this.state.subModule==='audit'?'':double_option}
    </div>);
  }

  componentDidUpdate(prevProps,prevState) {
    if(this.state.subModule=='kcfz') {
      ReactDOM.unmountComponentAtNode(document.getElementById('React_list'));
      BluMUI.result.CreateList = '';
      ReactDOM.unmountComponentAtNode(document.getElementById('React_fanye'));
      Kcfzgl_option=ReactDOM.render(
        <Option />,
        document.getElementById('React_list')
      );
      return;
    }

    let allchecked=this.state.course_state.reduce((x,y)=>x+y);
    if (!this.refs.allchecked) {
      return;
    }
    if(allchecked==0||allchecked==6) {
      this.refs.allchecked.checked=true;
      for(let i=0;i<6;i++) {
        this.refs['check-'+i].checked=false;
      }
    } else {
      this.refs.allchecked.checked=false;
      for(let i=0;i<6;i++) {
        this.refs['check-'+i].checked=this.state.course_state[i];
      }
    }
  }
}

var BlueMUI_GetList=function(Module,P,Cs,Serch,This) {
  ajax({
    url:courseCenter.host+'getCourseList',
    data:{
      unifyCode:BluMUI.result.unifyCode,
      courseState:'['+Cs+']',
      page:P,
      count:OUT_COUNT,
      subModule:Module=='history'?'maintenance':Module,
      selectName:Serch
    },
    success:function(gets) {
      let list=[];
      let datas=JSON.parse(gets);
      if(datas.meta.result!=100) {
        list=[];
      } else {
        list=datas.data.courseList;
      }
      if(BluMUI.result.CreateList) {
        BluMUI.result.CreateList.setState({
          Lists:list,
          Module:Module
        });
      } else {
        BluMUI.create({
          id:'CreateList',
          module:Module,
          Lists:list
          },
          'Create_list',
          document.getElementById('React_list')
        );
      }
      if (Module==='audit') {
        ReactDOM.unmountComponentAtNode(document.getElementById('React_fanye'));
        return;
      }
      ReactDOM.render(
        <BlueMUI_CreateFanye id={'fanye'} pages={datas.data.totalPages} page={P} This={This}/>,
        document.getElementById('React_fanye')
      );
    }
  });
};

//显示列表
class BlueMUI_CreateList extends React.Component {
  constructor(props) {
    super(props);
    this.create_list=this.create_list.bind(this);
    this.state={
      Lists:this.props.Lists,
      Module:this.props.module
    }
  }

  operation(o,a,event) {
    switch(o) {
      case '提交/审核':
        window.location.href='classManageCheck.html?classId='+a+'&type=1';
        break;
      case '系部中心主任审核':
        window.location.href='classManageCheck.html?classId='+a+'&type=2';
        break;
      case '教学院长审核':
        window.location.href='classManageCheck.html?classId='+a+'&type=3';
        break;
      case '撤回':
        Tijiao(3,a);
        break;
      case '停用':
        Tijiao(4,a);
        break;
      case '启用':
        Tijiao(5,a);
        break;
      case '编辑':
        window.location.href='classManageEditor.html?classId='+a;
        break;
      case '抽查':
        window.location.href='classManageSpotCheck.html?classId='+a+'&type=6';
        break;
      case '历史':
        Show_lishi(a);
        break;
    }
  }

  create_list() {
    let op_func;
    let op_able;
    let list=[];
    if(this.state.Lists.length==0) {
      return(<tr style={{background:'transparent'}} ><td id='ND'>
        <div className='no_data'>
          <img width='150px' height='150px' src="../../imgs/public/error.png"/>
          <br/>
          <span>没有数据</span>
        </div>
      </td></tr>);
    }
    this.state.Lists.map((e,index)=>{
      let check;
      let ops=[];
      let lishi=<span key='lish' onClick={this.operation.bind(this,'历史',e.kcbh)} className='op_on'>历史查询</span>;
      let style={
        background: index%2?'#eee':'#fff'
      };
      e.cz.map((f,findex)=>{
        op_func=f.able?this.operation.bind(this,f.name,e.kcbh):'';
        ops.push(<span key={findex} onClick={op_func} className={f.able?'op_on':''}>{f.name}</span>);
      });
      ops.push(<span key='lish' onClick={this.operation.bind(this,'历史',e.kcbh)} className='op_on'>历史查询</span>);
      list.push(<tr key={index}>
        <td></td>
        {check}
        <td>{e.kcbh}</td>
        <td><a target="view_window" href={'../classInfShow/classInfReview.html?classId='+e.kcbh}>{e.kcmc}</a></td>
        {(this.state.Module=="query"||this.state.Module=="maintenance")?<td>{e.fzrxm}</td>:null}
        <td>{e.jysmc}</td>
        <td>{e.czsj||''}</td>
        <td>{e.dqzt}</td>
        <td>{ops}</td>
        <td></td>
      </tr>);
    });
    return list;
  }

  componentDidUpdate() {
    if(BluMUI.result.Tab.state.subModule!=='audit') {
      Array().map.call(
        document.getElementById('center_table').getElementsByTagName('input'),
        e=>{e.checked=false;}
      );
    }
  }

  render() {
    if(this.state.Module=="query"||this.state.Module=="maintenance") {
      return(<table id="center_table">
        <thead>
          <tr>
            <td width='20px'></td>
            <td width="10%">课程编号</td>
            <td width="20%">课程名称</td>
            <td width="6%">课程负责人</td>
            <td width="20%">教学机构名称</td>
            <td width="14%">最近更新时间</td>
            <td width="13%">课程状态</td>
            <td width="10%">操作</td>
            <td width='20px'></td>
          </tr>
        </thead>
        <tbody ref='list_body'>{this.create_list()}</tbody>
      </table>);
    } else {
      return(<iframe style={{display:'block'}} src="../classManage/classManageCheck.html" frameBorder="0"></iframe>);
    }

  }
}

/*显示历史*/
function Show_lishi(course_id) {
  ReactDOM.render(
    <BlueMUI_CreatePopup Course={course_id}/>,
    document.getElementById('popup')
  );
}


//创建弹出层层(历史)
class BlueMUI_CreatePopup extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      lists:[],
      page:1,
      pages:0
    };
    this.popup=document.getElementById('popup');
  }

  create_popup_top() {
    return(<div id="top">
      <span>历史信息</span>
      <span id="popup_close" ref="close"><img src="../../imgs/classListInfShow/close.png" alt="close"/></span>
    </div>);
  }

  create_popup_thead() {
    return(<thead>
      <tr>
        <td width="10%">操作</td>
        <td width="10%">操作后状态  </td>
        <td width="15%">操作时间</td>
        <td width="10%">操作人姓名</td>
        <td width="">备注</td>
      </tr>
    </thead>);
  }

  create_popup_tbody() {
    return(<tbody ref="popup_tbody">
      {this.state.lists.map((e,index)=>{
        return(<tr key={index}>
          <td>{e.cz}</td>
          <td>{e.czhzt}</td>
          <td>{e.czsj}</td>
          <td>{e.czrxm}</td>
          <td>{e.bz.replace(/\\n/g, '\n')}</td>
        </tr>)
      })}
    </tbody>);
  }
  del_popup() {
    ReactDOM.unmountComponentAtNode(this.popup);
    this.popup.style.display='none';
  }

  get_lists() {
      /* 获取数据 */
    ajax({
      url:courseCenter.host+'getOperationList',
      data:{
        unifyCode:BluMUI.result.unifyCode,
        courseNo:this.props.Course,
        page:this.state.page,
        count:11
      },
      success:e=>{
        let datas=JSON.parse(e);
        this.setState({
          lists:datas.data.operationList,
          pages:datas.data.totalPages
        });
      }
    });
  }

  componentDidUpdate(preProps, preState) {
    if(preState.page!=this.state.page) {
      this.get_lists();
    }
  }

  componentDidMount() {
    document.getElementById('popup_body').onclick=e=>{
    };
    this.refs.close.onclick=this.del_popup.bind(this);
    this.get_lists();
  }

  render() {
    this.popup.style.display="block";
    return(<div className="pop-wrap">
      <div id="popup_body">
      {this.create_popup_top()}
      <table id="serch_table">
        {this.create_popup_thead()}
        {this.create_popup_tbody()}
      </table>
      <BlueMUI_CreateFanye id={'lishi_fanye'} page={this.state.page} pages={this.state.pages} This={this} ref="fanye_in" />
      </div>
      </div>);
  }
}



// 提交审核的弹出

class Tijiaoshenhe extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.refs.tijiao.onclick=(e=>{
      Tijiao(1,this.props.Kcbh);
      this.die();
    });
    this.refs.fanhui.onclick=this.die;
    this.refs.close.onclick=this.die;
  }
  die() {
    document.getElementById('tijiaoshenhe').style.display='none';
    ReactDOM.unmountComponentAtNode(document.getElementById('tijiaoshenhe'));
  }
  render() {
    return(<div>
      <div id="tijiaoshenhe_head">
        <span>提交审核</span>
        <img ref='close' src="../../imgs/courseAudit/close.png"/>
      </div>
      <p>材料将提交至教学院长、系部中心主任、<br/>课程负责人进行审核，提交后不可修改。</p>
      <div id="tijiao_div">
        <span className="tijiao" ref="tijiao">确定</span>
        <span className="fanhui" ref="fanhui">返回</span>
      </div>
    </div>);
  }
}

function Tjsh(kcbh) {
  let t=document.getElementById('tijiaoshenhe');
  t.style.display="block";
  ReactDOM.render(
    <Tijiaoshenhe Kcbh={kcbh}/>,
    t
  );
}

function Tijiao(op,course,note) {
  ajax({
    url:courseCenter.host+'submitOperation',
    data: {
      unifyCode:BluMUI.result.unifyCode,
      courseNo:course,
      note:note||'',
      type:op
    },
    success:function(gets) {
      let datas=JSON.parse(gets);
      BluMUI.result.Tab.change_subModule(BluMUI.result.Tab.state.subModule);
      // BlueMUI_GetList(
      //   BluMUI.result.Tab.state.subModule,
      //   BluMUI.result.Options.state.page,
      //   BluMUI.result.Options.state.course_state
      // );
    }
  });
}


var BluMUI_M = {
  Create_options:BlueMUI_CreateOptions,
  Create_tabs:BlueMUI_CreateTabs,
  Create_list:BlueMUI_CreateList,
};

var BluMUI = {
	result: {},
	create: function (data, type, elem) {
		var props = data, Blu = BluMUI_M[type];
		this.result[props.id] = ReactDOM.render(<Blu {...props}/>, elem);
	}
};
BluMUI.result.Get_list=BlueMUI_GetList;

export default BluMUI;
