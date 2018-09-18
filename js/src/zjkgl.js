import React from 'react';
import ReactDOM from 'react-dom';

const _COUNT = 10;
const ajax=require('../libs/post_ajax.js');
const Fanye=require('../libs/fanye');
var masterNames=[];

function SET(key,value) {
  sessionStorage.setItem("zjkgl-"+key,value);
  return value;
}

function GET(key) {
  return sessionStorage.getItem("zjkgl-"+key);
}

class Option extends React.Component {
  constructor(props) {
    super(props);
    this.search_data={
      zh: GET('zh')||'',
      xm: GET('xm')||'',
      gzdw: GET('gzdw')||'',
      ssxy: GET('ssxy')||'',
      jsxm: GET('jsxm')||'',
      state: +GET('qy')===+GET('ty')?'':+GET('qy')
    };
    this.state = {
      // 取不到当前默认的masterstate就默认为out
      master: GET("master")||'out',
      list: [],
      TP: {
        page: 1,
        pages:1,
        total:1
      }
    }
  }

  creat_option_down() {
    const {master} = this.state;
    let inputs = null;
    switch(master) {
      case 'out':
        inputs = <div id="option_input">
          <span>账号：</span>
          <input type="text" ref="zhanghao"/>
          <span>姓名：</span>
          <input type="text" ref="name"/>
          <span>工作单位：</span>
          <input type="text" ref="danwei"/>
        </div>
        break;
      case 'in':
        inputs = <div id="option_input">
          <span>所属学院：</span>
          <select id="xueyuan" ref={select=>this.xueyuan=select}>
            <option value="">{"请选择"}</option>
          </select>
          <span>教师姓名：</span>
          <input type="text" ref="jsxm"/>
        </div>
        break;
      default: 
        inputs = null;
        break;
    }
    return <div id="down">
          {inputs}
          <div id="option_search">
            <span>账号状态：</span>
            <input type="checkbox" id="qy" ref={input=>this.qy=input} />
            <label htmlFor="qy"><img src="../../imgs/public/hook.png"/></label>
            <span>启用</span>
            <input type="checkbox" id="ty" ref={input=>this.ty=input} />
            <label htmlFor="ty"><img src="../../imgs/public/hook.png"/></label>
            <span>停用</span>
            <button ref={search=>this.search=search} id="search">搜索</button>
          </div>
        </div>;
  }

  insert_xueyuan() {
    ajax({
      url: courseCenter.host+'getCollege',
      data: {
        unifyCode: getCookie("userId")
      },
      success: (gets) => {
        let datas = JSON.parse(gets);
        let options = "<option value=''>请选择</option>";

        datas.data.map(e=>{
          options+=`<option value=${e.kkxymc} ${e.kkxymc==GET('ssxy')?"selected":''}>${e.kkxymc}</option>`;
        });
        this.xueyuan.innerHTML=options;
        this.xueyuan.onchange=()=>{
          this.search_handler()
        }
      }
    });
  }

  change_master_state(state) {
    if(state==='in') {
      this.insert_xueyuan();
    }
    if(state===this.state.master) {
      return;
    }

    Array.from(document.querySelectorAll("#down input[type='text']"))
         .map(e=>e.value="");

    sessionStorage.clear();
    SET("master", state);

    this.qy.checked=false;
    this.ty.checked=false;
    Array.from(document.querySelectorAll("#down input[type='text']"))
         .map(e=>e.value="");

    this.setState({
      master: state,
      list: []
    },()=>{this.get_list(1)});
  }

  search_handler() {
    switch(this.state.master) {
      case 'in':
        this.search_data={
          ssxy: SET('ssxy',this.xueyuan.value),
          jsxm: SET("jsxm",this.refs.jsxm.value)
        };
        break;
      case 'out':
        this.search_data={
          zh: SET('zh',this.refs.zhanghao.value),
          xm: SET('xm',this.refs.name.value),
          gzdw: SET('gzdw',this.refs.danwei.value)
        };
        break;
    }
    SET('qy',+this.qy.checked);
    SET('ty',+this.ty.checked);
    this.search_data.state=this.qy.checked===this.ty.checked?'':+this.qy.checked;
    this.get_list(1);
  }

  // get datas from this.search_data
  get_list(p) {
    let data={};
    let session_page=p||+GET(this.state.master+"page")||1;
    if(this.state.master==='out') {
      data={
        unifyCode: getCookie("userId"),
        userId: this.search_data.zh,
        userName: this.search_data.xm,
        department: this.search_data.gzdw,
        state: this.search_data.state,
        page: session_page,
        count: _COUNT,
        type: ['in', 'out'].indexOf(this.state.master)
      }
    } else if(this.state.master==='in') {
      data={
        unifyCode: getCookie("userId"),
        userId: "",
        userName: this.search_data.jsxm,
        department: this.search_data.ssxy,
        state: this.search_data.state,
        page: session_page,
        count: _COUNT,
        type: ['in', 'out'].indexOf(this.state.master)
      }
    }
    ajax({
      url: courseCenter.host+"getZjList",
      data: data,
      success: (gets)=>{
        SET(this.state.master+"page",session_page);
        let datas=JSON.parse(gets);
        this.setState({
          TP: {
            page: session_page,
            pages: datas.data.totalPages,
            total: datas.data.total
          },
          list: datas.data.zjList
        });
      }
    });
  }

  set_default() {
    this.qy.checked=+GET('qy');
    this.ty.checked=+GET('ty');
    switch(this.state.master) {
      case 'in':
        this.refs.jsxm.value=GET('jsxm')||'';
        this.search_data={
          ssxy: GET('ssxy')||'',
          jsxm: GET('jsxm')||''
        };
        break;
      case 'out':
        this.refs.zhanghao.value=GET('zh')||'';
        this.refs.name.value=GET('xm')||'';
        this.refs.danwei.value=GET('gzdw')||'';
        this.search_data={
          zh: GET('zh')||'',
          xm: GET('xm')||'',
          gzdw: GET('gzdw')||''
        };
        break;
    }
    this.search_data.state=this.qy.checked===this.ty.checked?'':+this.qy.checked;
  }

  render() {
    const {master} = this.state;
    return (
      <div id="Option">
        <div id="option_bar">
          <div id="top">
            <button className="option_big_btn" ref={button=>this.add=button}>添加专家</button>
            <button className="option_big_btn" ref={button=>this.PLdelete=button}>批量删除</button>
            { this.state.master === 'out' ? <button className="option_big_btn" ref={button=>this.change=button}>修改密码</button> : '' }
            
          </div>
          <div id="mid">
            <input
              type="radio"
              name="master"
              id="master_in"
              ref={input=>this.master_out=input}
              onChange={()=>{this.change_master_state('out')}}
              defaultChecked={master==='out'}
            />
            <label htmlFor="master_in"><img src="../../imgs/public/hook.png"/></label>
            <span>显示校外专家</span>
            <input 
              type="radio" 
              name="master"
              id="master_out" 
              ref={input=>this.master_in=input} 
              onChange={()=>{this.change_master_state('in')}}
              defaultChecked={master==='in'}
            />
            <label htmlFor="master_out"><img src="../../imgs/public/hook.png"/></label>
            <span>显示校内专家</span>
          </div>
          {this.creat_option_down()}
        </div>
        <List list={this.state.list} master={this.state.master} ref="list" />
        <Fanye TP={this.state.TP} callback={(p)=>{this.get_list(p)}} />
      </div>
    );
  }

  componentDidMount() {
    this.set_default();
    let pop = document.getElementById('popup');
    // first mount insert college list
    if(this.state.master==='in') {
      this.insert_xueyuan();
    }

    // add master
    this.add.onclick=()=>{
      window.location.href="./masterAddEditor.html";
    }
    this.get_list();

    // PiLiangDelete
    this.PLdelete.onclick=()=>{
      Creat_popup('PLdelete', masterNames, this.refs.list.ids)
      pop.style.display='block';
    };

    // change password
    this.change.onclick=()=>{
      if (this.state.master === 'out') {
        if (this.refs.list.ids.length > 1) {
          alert('一次只能修改一个专家的密码！');
          return;
        }
        if (this.refs.list.ids.length === 0) {
          alert('请先选中要修改密码的专家！');
          return;
        }
        Creat_popup('change_PW', masterNames, this.refs.list.ids[0])
        pop.style.display='block';
      };
    }

    // search
    this.search.onclick=this.search_handler.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    this.set_default();
    if(window.frameElement) {
      window.frameElement.height=document.body.offsetHeight;
    }
  }
}

class List extends React.Component {
  constructor(props) {
    super(props);
    this.ids=[];
  }

  creat_thead() {
    const {master} = this.props;
    switch(master) {
      case 'out':
        return(
          <thead>
            <tr>
              <td className="lefttd"><div></div></td>
              <td width="5px"></td>
              <td width="10%">
                <input 
                  type="checkbox" 
                  id="allcheck" 
                  ref={check=>this.allcheck=check} 
                />
                <label htmlFor="allcheck">
                  <img src="../../imgs/public/hook.png"/>
                </label>
              </td>
              <td width="15%">账号</td>
              <td width="15%">姓名</td>
              <td>工作单位</td>
              <td width="20%">联系电话</td>
              <td width="7%">账号状态</td>
              <td width="15%">操作</td>
              <td width="0px"></td>
              <td className="righttd"><div></div></td>
            </tr>
          </thead>
        );
        break;

      case 'in':
        return(
          <thead>
            <tr>
              <td className="lefttd"><div></div></td>
              <td width="5px"></td>
              <td width="10%">
                <input 
                  type="checkbox" 
                  id="allcheck" 
                  ref={check=>this.allcheck=check} 
                />
                <label htmlFor="allcheck">
                  <img src="../../imgs/public/hook.png"/>
                </label>
              </td>
              <td width="15%">姓名</td>
              <td>学院</td>
              <td width="10%">账号状态</td>
              <td width="15%">操作</td>
              <td width="0px"></td>
              <td className="righttd"><div></div></td>
            </tr>
          </thead>
        );
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

    const {master}=this.props;
    switch(master) {
      case 'out':
        return(
          <tbody>
            {this.props.list.map((e,index)=><tr key={index}>
              <td className="lefttd"></td>
              <td></td>
              <td>
                <input 
                  type="checkbox" 
                  id={"input-"+index} 
                  value={e.id+"#"+e.xm}
                  onChange={this.check.bind(this,e.id,e.xm)} 
                />
                <label htmlFor={"input-"+index} >
                  <img src="../../imgs/public/hook.png"/>
                </label>
              </td>
              <td>{e.id}</td>
              <td>{e.xm}</td>
              <td>{e.dw}</td>
              <td>{e.lxdh}</td>
              <td>{e.zt}</td>
              <td>
                <a href="#" onClick={this.option.bind(this,'edit', e.id, e.xm)}>编辑</a>
                <a href="#" onClick={this.option.bind(this,'del', e.id, e.xm)}>删除</a>
                {
                  e.zt==='可用' ?
                  <a href="#" onClick={this.option.bind(this,'stop', e.id, e.xm)}>停用</a> :
                  <a href="#" onClick={this.option.bind(this,'open', e.id, e.xm)}>启用</a>
                }
              </td>
              <td></td>
              <td className='righttd'></td>
            </tr>)}
          </tbody>
        );
        break;

      case 'in':
        return(
          <tbody>
            {this.props.list.map((e,index)=><tr key={index}>
              <td className="lefttd"></td>
              <td></td>
              <td>
                <input 
                  type="checkbox" 
                  id={"input-"+index} 
                  value={e.sfrzh+"#"+e.xm}
                  onChange={this.check.bind(this,e.sfrzh,e.xm)} 
                />
                <label htmlFor={"input-"+index} >
                  <img src="../../imgs/public/hook.png"/>
                </label>
              </td>
              <td>{e.xm}</td>
              <td>{e.xymc}</td>
              <td>{e.zt}</td>
              <td>
                <a href="#" onClick={this.option.bind(this,'del', e.sfrzh, e.xm)}>删除</a>
                {
                  e.zt==='可用' ?
                  <a href="#" onClick={this.option.bind(this,'stop', e.sfrzh, e.xm)}>停用</a> :
                  <a href="#" onClick={this.option.bind(this,'open', e.sfrzh, e.xm)}>启用</a>
                }
              </td>
              <td></td>
              <td className='righttd'></td>
            </tr>)}
          </tbody>
        );
        break;
    }
  }

  option(option,id,name,eve) {
    eve.preventDefault();
    switch(option) {
      case 'edit':
        window.location.href="./masterAddEditor.html?isEditor=true&masterId="+id;
        break;
      case 'del':
        // ajax();
        Creat_popup('delete', name, id);
        document.getElementById('popup').style.display="block";
        break;
      case 'open':
        // ajax();
        Creat_popup('open', name, id);
        document.getElementById('popup').style.display="block";
        break;
      case 'stop':
        // ajax();
        Creat_popup('stop', name, id);
        document.getElementById('popup').style.display="block";
        break;
      default:
        break;
    }
  }

  check(id,name,eve) {
    this.allcheck.checked=false;
    if(eve.target.checked) {
      // add
      this.ids.push(id);
      masterNames.push(name);
    } else {
      // delet
      this.ids=this.ids.filter(e=>e!==id);
      masterNames=masterNames.filter(e=>e!==name);
    }
  }

  render() {
    masterNames=[];
    this.ids=[];
    return (
      <div id="List">
        <table>
          {this.creat_thead()}
          {this.creat_tbody()}
        </table>
      </div>
    );
  }

  componentDidMount() {
    this.allcheck.onchange=(eve)=>{
      this.ids=[];
      masterNames=[];
      let checks=Array.from(document.querySelectorAll('tbody td input[type="checkbox"]'));
      checks.map(e=>{
        (e.checked=eve.target.checked)
        && this.ids.push(e.value.split("#")[0])
        && masterNames.push(e.value.split("#")[1]);
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    Array.from(document.querySelectorAll('input[type="checkbox"]'))
         .map(e=>e.checked=false);
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
      "open": "启用",
      "stop": "停用"
    };

    switch(type) {
      case 'PLdelete':
      case 'delete':
      case 'open':
      case 'stop':
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
      case 'change_PW':
        return(
          <div id="popbody" style={{height: "350px"}} ref='pb'>
            <div id="title">
              <p>修改密码</p>
            </div>
            <div id="inputs">
              {/* <div>
                <span className="left_span"><span className="warn">*</span>当前密码</span>
                <input type="password" ref="dqmm" />
                <span className="tips"></span>
              </div> */}
              <div>
                <span className="left_span"><span className="warn">*</span>新密码</span>
                <input type="password" ref="xmm" />
                <span className="tips">密码长度至少6位</span>
              </div>
              <div>
                <span className="left_span"><span className="warn">*</span>新密码确认</span>
                <input type="password" ref="xmmqr" />
                <span className="tips">请再次输入新密码</span>
              </div>
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
          usersId: id,
          type: ['in', 'out'].indexOf(OptionComponent.state.master)
        };
        break;
      case "open":
        dat={
          unifyCode: getCookie("userId"),
          userId: id,
          state: 1,
          type: ['in', 'out'].indexOf(OptionComponent.state.master)
        };
        break;
      case "stop":
        dat={
          unifyCode: getCookie("userId"),
          userId: id,
          state: 0,
          type: ['in', 'out'].indexOf(OptionComponent.state.master)
        };
        break;
      default:
        break;
    }

    this.OK.onclick=()=>{
      let data_map={
        "PLdelete": "deleteZj",
        "delete": "deleteZj",
        "open": "updateZjState",
        "stop": "updateZjState",
        "change_PW": "updateZjPassWord"
      };
      if(type=='change_PW') {
        if(!(this.refs.xmm.value&&this.refs.xmmqr.value)) {
          alert("请检查参数！");
          return;
        }
        if(this.refs.xmm.value!==this.refs.xmmqr.value) {
          alert("新密码确认错误，请检查！");
          return;
        } else {
          dat={
            unifyCode: getCookie("userId"),
            userId: this.props.id,
            oldPassWord: '',
            // oldPassWord: this.refs.dqmm.value,
            newPassWord: this.refs.xmm.value
          };
        }
      }
      ajax({
        url: courseCenter.host+data_map[type],
        data: dat,
        success: (gets)=>{
          let datas=JSON.parse(gets);
          if(datas.meta.result==100) {
            alert("操作成功！");
            cancel_popup();
            OptionComponent.get_list();
          } else {
            // alert("操作失败");
          }
        }
      });
    };
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

  // click to close popup
  document.getElementById('popup').onclick=cancel_popup;
}

function cancel_popup() {
  let popup=document.getElementById('popup');
  popup.style.display="none";
  ReactDOM.unmountComponentAtNode(popup);
}





var OptionComponent = ReactDOM.render(
  <Option />,
  document.getElementById('zjkgl')
);