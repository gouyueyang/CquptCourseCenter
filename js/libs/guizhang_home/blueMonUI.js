import React from 'react';
import ReactDOM from 'react-dom';

var ajax=require('./post_ajax.js');
var Menu_this;

// iframe
class Iframe extends React.Component {
  constructor(props) {
    super(props);
    this.state=this.props;
    this.iframes={length:0};
    Object.defineProperty(this.iframes, "length", {
      enumerable: false
    });
    this.state.tabs.map((e,index)=>{
      this.iframes[e]=<iframe src={'../systemManage/'+e+'.html'} frameBorder="0" id={'ifs-'+e} key={e} style={{display:'none'}} onLoad={this.ld.bind(this)} ></iframe>;
      this.iframes.length++;
    });
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.tabs.length==this.iframes.length) {
    } else if(nextProps.tabs.length>this.iframes.length) {
      nextProps.tabs.map(e=>{
        if(typeof this.iframes[e] =='undefined') {
          this.iframes[e]=<iframe src={'../systemManage/'+e+'.html'} frameBorder="0" id={'ifs-'+e} key={e} style={{display:'none'}} onLoad={this.ld.bind(this)}></iframe>;
          this.iframes.length++;
        }
      });
    } else if(nextProps.tabs.length<this.iframes.length) {
      for(let i in this.iframes) {
        if(-1==nextProps.tabs.indexOf(i)) {
          delete this.iframes[i];
          this.iframes.length--;
        }
      }
    }
    document.getElementById('ifs-'+this.state.on).style.display='none';
    this.setState(nextProps);
  }
  ld() {
    // 从外面设置iframe的高度
    iframe_set('ifs-'+this.state.on);
  }

  componentDidMount() {
    this.render();
    document.getElementById('ifs-'+this.state.on).style.display='block';
  }

  componentDidUpdate() {
    document.getElementById('ifs-'+this.state.on).style.display='block';
  }

  create_iframes() {
    let IFS=[];
    for(let i in this.iframes) {
      IFS.push(this.iframes[i])
    }
    return(<div id="iframes" ref="Iframe">{IFS}</div>);
  }
  render() {
    return(this.create_iframes());
  }
}

function iframe_set(elem) {
  var child_iframe=document.getElementById(elem);
  child_iframe.height=child_iframe.contentWindow.document.body.scrollHeight;
}

// 菜单



class Menu extends React.Component {
  constructor(props) {
    super(props);
    // 设置默认显示的第一个tab
    this.state={
      Menu_on: this.props.Menus[0].url
    }
  }

  tab_change(name,eve) {
    Array.from(document.querySelectorAll(".menu_on")).map(e=>{
      e.className="a";
    });

    this.setState({
      Menu_on:name
    },()=>{
      this.props.Menus.map(e=>{
        if(e.url==name) {
          if(e.hasOwnProperty("second")) {
            this.refs["menu_"+name].getElementsByTagName('ul')[0].style.display="block";
          } else {
            if(document.querySelector("#menu li>ul")) {
              document.querySelector("#menu li>ul").style.display="none";
            }
            Create_tabs(name);
          }
          this.refs["menu_"+name].className="menu_on";
        } else {
          if(e.hasOwnProperty("second")) {
            e.second.map(m=>{
              if(m.url==name) {
                this.refs["menu_"+e.url].className="menu_on";
                this.refs["menu_"+e.url].querySelector("ul").style.display="block";
                this.refs["menu_"+name].className="menu_on";
                Create_tabs(name);
              }
            });
          }
        }
      });
    });
  }

  render() {
    return(<ul ref='menu'>{
      this.props.Menus.map((e,index)=>{
        // 判断二级菜单
        if(e.hasOwnProperty("second")) {
          return (<li key={index} name={e.url} ref={"menu_"+e.url} onClick={this.tab_change.bind(this,e.url)}>
            {e.name}
            <ul className="secondMenu" style={{marginTop:"2px"}}>
              {e.second.map((m,n)=><li key={n} ref={"menu_"+m.url} onClick={this.tab_change.bind(this,m.url)}>{m.name}</li>)}
            </ul>
          </li>);
        } else {
          return (<li key={index} name={e.url} ref={"menu_"+e.url} onClick={this.tab_change.bind(this,e.url)}>{e.name}</li>);
        }
      })
    }</ul>);
  }

  componentDidMount() {
    Menu_this=this;
    this.refs["menu_"+this.state.Menu_on].className='menu_on';
    Create_tabs(this.state.Menu_on);
  }
}

// tabs
class Tab_head extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      tabs:[this.props.Tab],
      on:this.props.Tab
    }
  }

  tab_change(tab_name,eve) {
    this.refs[this.state.on].className='';
    this.setState({on:tab_name});
    Menu_this.tab_change(tab_name)
  }

  // del(tab_name,eve) {
  //   eve.nativeEvent.preventDefault();
  //   let tabs=this.state.tabs;
  //   let index=tabs.indexOf(tab_name);
  //   let new_on;
  //   tabs.splice(index,1);
  //   if(index<1) {
  //     new_on = tabs[index+1];
  //   } else {
  //     new_on = tabs[index-1];
  //   }
  //   this.setState({
  //     tabs:tabs,
  //     on:new_on
  //   });
  // }

  render() {
    //需要this.state向下传递信息，包括tab[]和on
    return(<ul ref='tabs'>{
      this.state.tabs.map((e,index)=><li key={index} ref={e} onClick={this.tab_change.bind(this,e)}>
        {BluMUI.menu_names[e]}
        <span className="close">x</span>
      </li>)
    }</ul>);
  }

  componentDidMount() {
    Create_iframes(this.state);
    this.refs[this.state.on].className='tabs_on';
  }

  componentWillReceiveProps(nextProps) {
    let new_tabs=this.state.tabs;
    if(this.state.tabs.indexOf(nextProps.Tab)==-1) {
      new_tabs.push(nextProps.Tab);
    }
    this.setState({
      tabs:new_tabs,
      on:nextProps.Tab
    });
  }  
  
  componentDidUpdate(preProps,preState) {
    Create_iframes(this.state);
    if(this.refs[preState.on]) {
      this.refs[preState.on].className='';
    }
    this.refs[this.state.on].className='tabs_on';
    // 为关闭按钮单独绑定事件，不单独绑定会触发事件冒泡
    Array().map.call(
      this.refs.tabs.getElementsByClassName('close'),
      (e,index)=>{e.onclick=eve=>{
        // 阻止事件冒泡
        eve.stopImmediatePropagation();
        let new_on=this.state.on;
        let tabs=this.state.tabs;
        // 如果只有一个tab被打开则这个tab不能关闭
        if(tabs.length==1) {
          return;
        }
        // 将当前打开的标签设置为关闭
        this.refs[this.state.on].className='';
        // 如果关闭的tab和当前打开的tab是同一个
        if(tabs[index]==this.state.on) {
          // 看是不是关闭的第一个tab，是第一个就打开后面个
          tabs.splice(index,1);
          new_on=tabs[tabs.length-1];
        } else {
          tabs.splice(index,1);
        }
        // clear tab sessionStorage
        let delet_tag_prefix=new RegExp(`^${this.state.on}-`);
        for(let end=window.sessionStorage.length;end>0;end--) {
          if(delet_tag_prefix.test(window.sessionStorage.key(end-1))) {
            sessionStorage.removeItem(window.sessionStorage.key(end-1));
          }
        }

        this.setState({
          tabs:tabs,
          on:new_on
        });
        Menu_this.tab_change(new_on);
      }}
    );
  }
}


function Create_tabs(tab) {
  BluMUI.create({
    Tab:tab
  },'Create_tab',document.getElementById('tabs'))
}

function Create_iframes(state) {
  BluMUI.create(state,'Create_iframe',document.getElementById('tab'))
}


// ----------------------------------------------------------------------------------------------------
var BluMUI_M = {
  Create_menu: Menu,
  Create_iframe: Iframe,
  Create_tab: Tab_head
}

var BluMUI = {
	result: {},
  menu_names: {},
	create: function (data, type, elem) {
		var props = data, Blu = BluMUI_M[type];
		this.result[props.id] = ReactDOM.render(<Blu {...props}/>, elem);    
	}
};


export default BluMUI;
