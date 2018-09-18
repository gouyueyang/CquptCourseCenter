import React from 'react';
import ReactDOM from 'react-dom';

const ajax=require('../libs/post_ajax.js');
const Fanye=require('../libs/fanye.js');
const _COUNT=10;

const SET = (key, value) => {
  sessionStorage.setItem("wpgl-jieguo-"+key, value);
  return value;
}

const GET = (key) => {
  return sessionStorage.getItem("wpgl-jieguo-"+key) || '';
}

var WPPCS=[];

class Option extends React.Component {
  constructor(props) {
    super(props);
    this.model=GET("model")||"zj";
    this.search_cache={
      byzj: Boolean(+GET("byzj"))===Boolean(+GET("bykc"))?true:Boolean(+GET("byzj")),
      bykc: Boolean(+GET("bykc"))||false,
      yfp:  Boolean(+GET("yfp")),
      wfp:  Boolean(+GET("wfp")),
      fzx: GET("fzx"),
      name: GET("name")
    };
    this.state={
      TP: {
        page:1,
        pages:1,
        total:1
      },
      list: [],

      byzj: this.search_cache.byzj,
      bykc: this.search_cache.bykc,
      yfp: this.search_cache.yfp,
      wfp: this.search_cache.wfp,
      fzx: this.search_cache.fzx,
      name: this.search_cache.name,
      fzx_select: [],
      zjxm_input: "",
    }
  }

  _get_list(p) {
    let page=p||+GET("page")||1;

    ajax({
      url: courseCenter.host+"reviewAllocateResult",
      data: {
        unifyCode: getCookie("userId"),
        ID: parseHash(window.location.href).id,
        page: page,
        count: _COUNT,
        type: ['zj', 'kc'].indexOf(this.model)+1,
        allocateStatus: `[${+this.yfp.checked},${+this.wfp.checked}]`,
        selectItem: this.search_cache.fzx,
        selectName: SET('name', this.name_input.value)
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
          list: datas.data.allocateList
        });
      }
    });
  }

  change_fzx(e) {
    this.setState({
      fzx: e?e.target.value:this.state.fzx
    });
    this.search_cache.fzx = SET('fzx', e?e.target.value:this.state.fzx);
    this._get_list(1);
  }

  search() {
    this.search_cache.wppc=SET("yfp",this.yfp.checked);
    this.search_cache.wfp=SET("wfp",this.wfp.checked);
    this.search_cache.fzx=SET("fzx",this.state.fzx);
    this.search_cache.zjxm=SET("zjxm",this.state.zjxm);
    this._get_list(1);
  }

  model_change(model,eve) {
    // limit request of check way
    if(['kc', 'zj'].indexOf(model)===-1 || eve.target.checked===this.state['by'+model]) {
     return;
    }
    this.model=SET("model",model);
    this.search_cache.byzj=Boolean(+SET("byzj",+(model==='zj')));
    this.search_cache.bykc=Boolean(+SET("bykc",+(model==='kc')));
    this.setState({
      fzx: '',
      list: [],
      byzj: this.search_cache.byzj,
      bykc: this.search_cache.bykc
    });
    this.name_input.value='';
    this._get_list(1);
  }

  render() {
    return (
      <div id="wpgl_option">
        <div id="option">
          <div id="up">
            <button className="big_btn" ref={btn=>this.back=btn} >返回</button>
          </div>

          <div id="mid">
            <input 
              name="check_way"
              type="radio" 
              id="byzj" 
              defaultChecked={this.state.byzj}
              onChange={this.model_change.bind(this,'zj')}
              ref={check=>this.byzj=check} 
            />
            <label htmlFor="byzj">
              <img src="../../imgs/public/hook.png"/>
            </label>
            <span>按专家查看</span>

            <input 
              name="check_way"
              type="radio" 
              id="bykc" 
              defaultChecked={this.state.bykc}
              onChange={this.model_change.bind(this,'kc')}
              ref={check=>this.bykc=check} 
            />
            <label htmlFor="bykc">
              <img src="../../imgs/public/hook.png"/>
            </label>
            <span>按课程查看</span>
          </div>

          <div id="down">
            <span>{`${this.state.byzj?'专家':'课程'}分配${this.state.byzj?'课程':'专家'}状态：`}</span>

            <input 
              type="checkbox" 
              id="yfp" 
              ref={check=>this.yfp=check} 
            />
            <label htmlFor="yfp">
              <img src="../../imgs/public/hook.png"/>
            </label>
            <span>已分配</span>

            <input 
              type="checkbox" 
              id="wfp" 
              ref={check=>this.wfp=check} 
            />
            <label htmlFor="wfp">
              <img src="../../imgs/public/hook.png"/>
            </label>
            <span>未分配</span>

            <span id="wppc">{`${this.state.byzj?'专家':'课程'}分组项：`}</span>

            <select 
              name="wppc_select" 
              id="wppc_select" 
              ref={sel=>this.wppc_select=sel}
              value={this.state.fzx}
              onChange={this.change_fzx.bind(this)}
            >
              {
                [<option value="" key="default">请选择</option>].concat(
                  this.state.fzx_select.map((op,index)=><option value={op.fzx} key={index} >{op.fzx}</option>)
                )
              }
            </select>

            <span id="wppc">{`${this.state.byzj?'专家姓名':'课程名'}：`}</span>

            <input 
              name="zjxm_input" 
              id="zjxm_input" 
              ref={input=>this.name_input=input}
              defaultValue={this.state.name}
            ></input>

            <button id="serch" onClick={this.search.bind(this)}>搜索</button>
          </div>
        </div>
        <Lists ref="list" Lists={this.state.list} model={this.model} />
        <Fanye TP={this.state.TP} callback={(p)=>{this._get_list(p)}} />
      </div>
    );
  }

  componentDidMount() {
    // 填充分组项次下拉菜单
    ajax({
      url: courseCenter.host+"getFzxByWppc",
      data: {
        unifyCode: getCookie("userId"),
        reviewBatch: parseHash(window.location.href).wppc
      },
      success: (gets)=>{
        let datas=JSON.parse(gets);
        if(datas.meta.result!==100) {
          alert("下拉菜单获取失败！");
          return;
        }
        this.setState({
          fzx_select: JSON.parse(gets).data
        });
      }
    });

    // 首次查询列表并填充
    this._get_list(1);

    this.yfp.onchange = this._get_list.bind(this, 1);
    this.wfp.onchange = this._get_list.bind(this, 1);

    // back button click options
    this.back.onclick=()=>{
      // clear tab sessionStorage
      let delet_tag_prefix=new RegExp(`^wpgl-jieguo-`);
      for(let end=window.sessionStorage.length;end>0;end--) {
        if(delet_tag_prefix.test(window.sessionStorage.key(end-1))) {
          sessionStorage.removeItem(window.sessionStorage.key(end-1));
        }
      }
      window.location.href='wpgl.html';
    };
  }
}

class Lists extends React.Component {
  constructor(props) {
    super(props);
  }

  create_head() {
    switch(this.props.model) {
      case 'zj':
        return (<thead>
          <tr>
            <td width="25px" className="td_head">
              <div></div>
            </td>
            <td width="0px" className="td_left_space"></td>
            <td width="10%">专家姓名</td>
            <td width="15%">所属专家分组项</td>
            <td>已分配课程</td>
            <td width="8%">操作</td>
            <td width="0px" className="td_right_space"></td>
            <td width="25px" className="td_end">
              <div></div>
            </td>
          </tr>
        </thead>);
        break;

      case 'kc':
        return (<thead>
          <tr>
            <td width="25px" className="td_head">
              <div></div>
            </td>
            <td width="20px" className="td_left_space"></td>
            <td>课程名称</td>
            <td width="10%">课程编号</td>
            <td width="15%">所属课程分组项</td>
            <td width="45%">已分配专家</td>
            <td width="8%">操作</td>
            <td width="0px" className="td_right_space"></td>
            <td width="25px" className="td_end">
              <div></div>
            </td>
          </tr>
        </thead>);
        break;
      default:
        return(<thead></thead>);
    }
  }

  option(type, id, wpid, groupItem, itemName, courseId, eve) {
    // eve.preventDefault();

    switch(type) {
      case 'show':
        Creat_popup('show', groupItem, id);
        document.getElementById('popup').style.display="block";
        break;
      case 'edit':
        if(this.props.model==='zj') {
          window.location.href=`./masterWPEditorBymaster.html?wpID=${wpid}&expId=${id}&masterId=${id}&masterName=${itemName}&groupItem=${groupItem}&wppc=${parseHash(window.location.href).wppc}`;
        } else {
          window.location.href=`./masterWPEditor.html?courseNo=${courseId}&wpID=${wpid}&expId=${id}&masterId=${id}&masterName=${itemName}&groupItem=${groupItem}&wppc=${parseHash(window.location.href).wppc}`;
        }
        break;
      default:
        break;
    }
  }

  create_body() {
    if(this.props.Lists.length===0) {
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

    switch(this.props.model) {
      case 'zj':
        return (<tbody>
          {this.props.Lists.map((e,index)=><tr key={index}>
            <td className="td_head"></td>
            <td></td>
            <td>{e.itemName}</td>
            <td>{e.groupItem}</td>
            <td>
              <span className="num">{`[${e.count}]`}</span>
              <a href="#" onClick={this.option.bind(this,"show",e.itemID, e.wpid, e.groupItem, e.itemName)}>
                {
                  e.count<4
                  ?e.list.map((m,index)=><span key={index}>{m.name}</span>)
                  :e.list.map((m,index)=>index<3&&<span key={index}>{m.name}</span>).concat(<span key="dot">……</span>)
                }
              </a>
            </td>
            <td>
              {
                e.ableModify?
                <div>
                  <span className="green_btn" onClick={this.option.bind(this,"edit", e.itemID, e.wpid, e.groupItem, e.itemName)}>修改</span>
                </div>: ''
              }
            </td>
            <td></td>
            <td className="td_end"></td>
          </tr>)}
        </tbody>);
        break;

      case 'kc':
        return (<tbody>
          {this.props.Lists.map((e,index)=><tr key={index}>
            <td className="td_head"></td>
            <td></td>
            <td>{e.itemName}</td>
            <td>{e.itemID}</td>
            <td>{e.groupItem}</td>
            <td>
              <span className="num">{`[${e.count}]`}</span>
              <span>
                {
                  e.count<6
                  ?e.list.map((m,index)=><span key={index}>{m.name}</span>)
                  :e.list.map((m,index)=>index<5&&<span key={index}>{m.name}</span>).concat(<span key="dot">……</span>)
                }
              </span>
            </td>
            <td>
              {
                e.ableModify?
                <div>
                  <span className="green_btn" onClick={this.option.bind(this,"edit", e.itemID, e.wpid, e.groupItem, e.itemName,e.itemID)}>修改</span>
                </div>: ''
              }
            </td>
            <td></td>
            <td className="td_end"></td>
          </tr>)}
        </tbody>);
        break;
      default:
        return(<tbody></tbody>);
        break;
    }
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

  }

  componentDidUpdate(prevProps, prevState) {
    if(window.frameElement) {
      window.frameElement.height=document.body.scrollHeight;

    }
  }
}

class Poplist extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      list: [],
      TP: {
        page: 1,
        pages: 1,
        total: 1
      }
    };
  }

  _get_list(p) {
    ajax({
      url: courseCenter.host+'queryExpAllocDetail',
      data: {
        unifyCode: getCookie("userId"),
        ID: parseHash(window.location.href).id,
        expID: this.props.id,
        groupItem: this.props.fzx,
        page: p||1,
        count: _COUNT
      },
      success: (gets) => {
        let datas=JSON.parse(gets);
        if(datas.meta.result!==100) {
          return;
        }
        this.setState({
          list: datas.data.list,
          TP: {
            page: p||1,
            pages: datas.data.totalPages,
            total: datas.data.total
          }
        });
      }
    });
  }

  render() {
    return (
      <div>
        <div id="pop_table_body">
          <table>
            <thead>
              <tr>
                <td width="44%">课程名称</td>
                <td width="28%">课程编号</td>
                <td width="28%">开课学院</td>
              </tr>
            </thead>
            <tbody>
              {
                this.state.list.map((e,index)=><tr key={index}>
                  <td>{e.courseName}</td>
                  <td>{e.courseNo}</td>
                  <td>{e.unit}</td>
                </tr>)
              }
            </tbody>
          </table>
        </div>
        <Fanye TP={this.state.TP} callback={(p)=>{this._get_list(p)}} />
      </div>
    );
  }

  componentDidMount() {
    this._get_list(1);
  }
  componentDidUpdate() {
    let bgh = document.getElementById('background').scrollHeight;
    if(window.frameElement) {
      let H=document.body.offsetHeight;
      if(bgh>parseInt(document.body.offsetHeight)) {
        H=bgh;
      }
      window.frameElement.height=H;
    }


  }
}

class Popup extends React.Component {
  constructor(props) {
    super(props);
  }

  delete_popup(e) {
    if(e.target===this.background) {
      ReactDOM.unmountComponentAtNode(e.target.parentNode);
    }
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
      case 'show':
        return(
          <div 
            id="background" 
            ref={div=>this.background=div}
            onClick={e=>this.delete_popup(e)}
          >
          <div id="poplist" ref="pb" onClick={e=>e.stopPropagation}>
            <Poplist id={this.props.id} fzx={this.props.names} />
          </div>
          </div>
        );
      default: 
        return(<div>error</div>);
        break;
    }
  }

  componentDidMount() {
    const {id,type}=this.props;
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
  }

  componentWillUnmount() {
    if(window.frameElement) {
      window.frameElement.height=document.body.offsetHeight;
    }
  }
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
}

var WPGL=ReactDOM.render(
  <Option />,
  document.getElementById('wpgl')
);
