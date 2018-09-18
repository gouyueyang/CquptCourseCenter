import React from 'react';
import ReactDOM from 'react-dom';

const ajax=require('../libs/post_ajax.js');
const Fanye=require('../libs/fanye.js');
const _prefix="wpgl-";
const _COUNT=10;

const SET = (key, value) => {
  sessionStorage.setItem(_prefix+key, value);
  return value;
}

const GET = (key) => {
  return sessionStorage.getItem(_prefix+key) || '';
}

var WPPCS=[];

class Option extends React.Component {
  constructor(props) {
    super(props);
    this.search_cache={
      wppc: GET("wppc")
    };
    this.state={
      TP: {
        page:1,
        pages:1,
        total:1
      },
      list: [],
      wppc: GET("wppc"),
      wppc_select: []
    }
  }

  _get_list(p) {
    let page=p||+GET("page")||1;

    ajax({
      url: courseCenter.host+"reviewList",
      data: {
        unifyCode: getCookie("userId"),
        name: this.search_cache.wppc,
        page: page,
        count: _COUNT
      },
      success: (gets)=>{
        SET("page", page);
        let datas=JSON.parse(gets);
        this.setState({
          TP: {
            page: page,
            pages: datas.data.totalPages,
            total:datas.data.total
          },
          list: datas.data.list
        });
      }
    });
  }

  change_wppc(e) {
    this.setState({
      wppc: e?e.target.value:this.state.wppc
    },this.search);
  }

  search() {
    this.search_cache.wppc=SET("wppc",this.state.wppc);
    this._get_list(1);
  }

  render() {
    return (
      <div id="wpgl_option">
        <div id="option">
          <div id="big_btns">
            <button className="big_btn" ref={btn=>this.fqwp=btn} >发起网评</button>
            <button className="big_btn" ref={btn=>this.PLdelete=btn}>批量删除</button>
          </div>
          <div id="filter_bar">
            <span id="wppc">网评批次：</span>

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
          </div>
        </div>
        <Lists ref="list" Lists={this.state.list} />
        <Fanye TP={this.state.TP} callback={(p)=>{this._get_list(p)}} />
      </div>
    );
  }

  get_wppc_select() {
    // 填充网评批次下拉菜单
    ajax({
      url: courseCenter.host+"reviewBriefList",
      data: {
        userID: getCookie("userId"),
        state: 1,
        expGroup: ""
      },
      success: (gets)=>{
        let datas=JSON.parse(gets);
        this.setState({
          wppc_select: JSON.parse(gets).data.list
        });
      }
    });
  }

  componentDidMount() {
    this.fqwp.onclick=()=>{
      window.location.href=`./masterPublishWp.html`;
    };

    this.get_wppc_select();
    // // 首次查询列表并填充
    this._get_list();

    let pop = document.getElementById('popup');
    // PiLiangDelete
    this.PLdelete.onclick=()=>{
      Creat_popup('PLdelete', WPPCS, this.refs.list.ids)
      pop.style.display='block';
    };
  }
}

class Lists extends React.Component {
  constructor(props) {
    super(props);
    this.ids=[];
  }

  create_head() {
    return (<thead>
      <tr>
        <td width="25px" className="td_head">
          <div></div>
        </td>
        <td width="0px" className="td_left_space"></td>
        <td width="20px">
          <input 
            type="checkbox" 
            id="allcheck" 
            ref={check=>this.allcheck=check} 
          />
          <label htmlFor="allcheck">
            <img src="../../imgs/public/hook.png"/>
          </label>
        </td>
        <td>网评批次</td>
        <td width="10%">分组批次</td>
        <td width="10%">指标批次</td>
        <td width="13%">专家分组批次</td>
        <td>起止时间</td>
        <td width="10%">分配课程</td>
        <td width="10%">操作</td>
        <td width="0px" className="td_right_space"></td>
        <td width="25px" className="td_end">
          <div></div>
        </td>
      </tr>
    </thead>);
  }

  option(type, id, wppc,eve) {
    eve.preventDefault();

    switch(type) {
      case 'delete':
        Creat_popup('delete', wppc, id);
        document.getElementById('popup').style.display="block";
        break;
      case 'fenpei':
        window.location.href=`./wpgl-fenpei.html?wppc=${wppc}&id=${id}`;
        break;
      case 'jieguo':
        window.location.href=`./wpgl-jieguo.html?wppc=${wppc}&id=${id}`;
        break;
      case 'edit':
        window.location.href=`./masterPublishWp.html?wpId=${id}&isEditor=true`;
        break;
      default:
        break;
    }
  }

  check(id,wppc,eve) {
    this.allcheck.checked=false;
    if(eve.target.checked) {
      // add
      this.ids.push(id);
      WPPCS.push(wppc);
    } else {
      // delet
      this.ids=this.ids.filter(e=>e!==id);
      WPPCS=WPPCS.filter(e=>e!==wppc);
    }
  }

  create_body() {
    if(this.props.Lists.length===0) {
      return (<tbody>
        <tr>
          <td className="lefttd"></td>
          <td colSpan="7" style={{borderBottom: 'none'}}>
            <img id="err_img" src="../../imgs/public/error.png"/>
            <div>没有数据</div>
          </td>
          <td className="righttd"></td>
        </tr>
      </tbody>);
    }

    return (<tbody>
      {this.props.Lists.map((e,index)=><tr key={index}>
        <td className="td_head"></td>
        <td></td>
        <td>
          <input 
            type="checkbox" 
            id={"input-"+index} 
            value={e.id+"#"+e.wppc}
            onChange={this.check.bind(this,e.id,e.wppc)} 
          />
          <label htmlFor={"input-"+index} >
            <img src="../../imgs/public/hook.png"/>
          </label>
        </td>
        <td>{e.wppc}</td>
        <td>{e.fzpc}</td>
        <td>{e.zbpc}</td>
        <td>{e.zjfzpc}</td>
        <td>{e.kssj+"-"+e.jssj}</td>
        <td>{<div>
          <span className="green_btn" onClick={this.option.bind(this,"fenpei", e.id, e.wppc)}>分配</span>
          <span className="green_btn" onClick={this.option.bind(this,"jieguo", e.id, e.wppc)}>结果</span>
        </div>}</td>
        <td>{<div>
          <span className="green_btn" onClick={this.option.bind(this,"edit", e.id, e.wppc)}>编辑</span>
          <span className="yellow_btn" onClick={this.option.bind(this,"delete", e.id, e.wppc)}>删除</span>
        </div>}</td>
        <td></td>
        <td className="td_end"></td>
      </tr>)}
    </tbody>);
  }

  render() {
    return (<div id="wpgl_table">
      <table ref="table">
        {this.create_head()}
        {this.create_body()}
      </table>
    </div>);
  }

  componentDidMount() {
    this.allcheck.onchange=(eve)=>{
      this.ids=[];
      WPPCS=[];
      let checks=Array.from(document.querySelectorAll('tbody td input[type="checkbox"]'));
      checks.map(e=>{
        (e.checked=eve.target.checked)
        && this.ids.push(e.value.split("#")[0])
        && WPPCS.push(e.value.split("#")[1]);
      });
    }
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
    const {type,names}=this.props;
    const MAP={
      "PLdelete": "删除",
      "delete": "删除",
    };

    switch(type) {
      case 'PLdelete':
      case 'delete':
        return(
          <div id="popbody" ref='pb'>
            <div id="msg">
              <p>{`确定要${MAP[type]+names}?`}</p>
            </div>
            <div id="popup_option">
              <button id="popup_OK" ref={btn=>this.OK=btn}>确定</button>
              <button id="popup_back" ref={btn=>this.back=btn}>取消</button>
            </div>
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
    // back button click to cancel
    this.back.onclick=cancel_popup;
    // OK button option
    let dat={};

    switch(type) {
      case "PLdelete":
      case "delete":
        dat={
          unifyCode: getCookie("userId"),
          ID: id
        };
        break;
      default:
        break;
    }

    this.OK.onclick=()=>{
      let data_map={
        "PLdelete": "deleteReview",
        "delete": "deleteReview",
      };
      ajax({
        url: courseCenter.host+data_map[type],
        data: dat,
        success: (gets)=>{
          let datas=JSON.parse(gets);
          if(datas.meta.result!==100) {
            return;
          }
          cancel_popup();
          WPGL._get_list();
          WPGL.get_wppc_select();
        }
      });
    };

    if(window.frameElement) {
      let H=document.body.offsetHeight;
      if(650>parseInt(document.body.offsetHeight)) {
        H=650;
      }
      window.frameElement.height=H;
    }
  }

  componentWillUnmount() {
    if(window.frameElement) {
      window.frameElement.height=document.body.offsetHeight;
    }
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if(window.frameElement) {
  //     let H=document.body.offsetHeight;
  //     if(this.refs.pb.offsetHeight>parseInt(document.body.offsetHeight)) {
  //       H=this.refs.pb.offsetHeight;
  //     }
  //     window.frameElement.height=H;
  //   }
  // }
}

function Creat_popup(type, names, id) {
  const popup_datas={
    type: type,
    names: names,
    id: id
  };
  var popup = ReactDOM.render(
    <Popup {...popup_datas}/>,
    document.getElementById('popup')
  );

  // click to close popup
  document.getElementById('popup').onclick=cancel_popup;
}

function cancel_popup() {
  let popup=document.getElementById('popup');
  popup.style.display="none";
  ReactDOM.unmountComponentAtNode(popup);
}


var WPGL=ReactDOM.render(
  <Option />,
  document.getElementById('wpgl')
);





