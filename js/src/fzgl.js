import ReactDOM from 'react-dom';
import React from 'react';

const ajax=require('../libs/post_ajax.js');
const Fanye=require('../libs/fanye.js');

const _COUNT = 10;

const SET = (key, value) => {
  sessionStorage.setItem("fzgl-"+key, value);
  return value;
}

const GET = (key) => {
  return sessionStorage.getItem("fzgl-"+key) || '';
}

class Option extends React.Component {
  constructor(props) {
    super(props);
    this.pici_insert=[];
    this.fzpc=GET("fzpc")||'';
    this.state={
      TP: {
        page: 1,
        pages: 1,
        total: 1
      },
      list: [],
      fzpc_select: []
    };
  }

  insert_pici() {
    let pc=`<option value="">请选择</option>`;
    this.state.fzpc_select.map(e=>pc+=`<option ${(this.fzpc===e.fzpc)?"selected":''} value=${e.fzpc} >${e.fzpc}</option>`);
    this.pici.innerHTML=pc;
  }

  search() {
    this.fzpc=this.pici.value;
    SET("fzpc", this.fzpc);
    this.get_list(1);
  }

  get_list(p) {
    let page=p||+GET("page")||1;
    ajax({
      url: courseCenter.host+"getFzList",
      data: {
        unifyCode: getCookie('userId'),
        groupBatch: this.fzpc,
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
          list: datas.data.groupList
        })
      }
    });
  }

  render() {
    return (
      <div id="Option_react">
        <div id="option">
          <div id="up">
            <button id="add" ref={btn=>this.add=btn}>添加分组</button>
          </div>
          <div id="down">
            <span>分组批次：</span>
            <select 
              name="fzpc" 
              id="fzpc_select" 
              ref={sel=>(this.pici=sel)} 
              defaultValue={this.fzpc}
            >
              {
                this.state.fzpc_select.length
                ?this.insert_pici()
                :<option value="">{this.fzpc||"请选择"}</option>
              }
            </select>
          </div>
        </div>

        <List list={this.state.list} />
        <Fanye TP={this.state.TP} callback={(p)=>{this.get_list(p)}} />
      </div>
    );
  }

  componentDidMount() {
    ajax({
      url: courseCenter.host+"getFzpc",
      data: {
        unifyCode: getCookie('userId')
      },
      success: (gets)=>{
        let datas=JSON.parse(gets);
        this.setState({
          fzpc_select: datas.data
        })
      }
    });

    this.pici.onchange=this.search.bind(this);

    this.get_list();
    // bind search option
    this.add.onclick=()=>{window.location.href='./masterSortEditor.html'};
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
          <td width="20%">分组批次</td>
          <td width="55%">分组项</td>
          <td width="20%">操作</td>
          <td width="5px"></td>
          <td className="righttd"><div></div></td>
        </tr>
      </thead>
    );
  }

  option(type, fzpc, eve) {
    eve.preventDefault();
    switch(type) {
      case 'edit': 
        window.location.href='./masterSortEditor.html?isEditor=true&groupBatch='+fzpc;
        break;
      case 'delete':
        Creat_popup('delete', fzpc);
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
      )
    }
    return(
      <tbody>
        {this.props.list.map((e,index)=><tr key={index}>
          <td className="lefttd"></td>
          <td></td>
          <td>{e.fzpc}</td>
          <td>
            {
              e.groups.map((fzx,index)=><span key={index}>{fzx.fzx}</span>)
            }
          </td>
          <td>
            <a href="#" onClick={this.option.bind(this,'edit',e.fzpc)} >编辑</a>
            <a href="#" onClick={this.option.bind(this,'delete',e.fzpc)} >删除</a>
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
      case "delete":
        dat={
          unifyCode: getCookie("userId"),
          groupBatch: id
        };
        break;
      default:
        break;
    }

    this.OK.onclick=()=>{
      let data_map={
        "delete": "deleteFz"
      };
      ajax({
        url: courseCenter.host+data_map[type],
        data: dat,
        success: (gets)=>{
          let datas=JSON.parse(gets);
          if(datas.meta.result==100) {
            cancel_popup();
            Fzgl_option.get_list();
          }
        }
      });
    };
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

var Fzgl_option=ReactDOM.render(
  <Option />,
  document.getElementById('fzgl')
);