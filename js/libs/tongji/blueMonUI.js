import React from 'react';
import ReactDOM from 'react-dom';

// var ajax=require('./post_ajax.js');
var Menue_this;

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
      this.iframes[e]=<iframe src={'../systemManage/'+e+'.html'} frameBorder="0" id={'ifs-'+e} key={e} style={{display:'none'}} ></iframe>;
      this.iframes.length++;
    });
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.tabs.length==this.iframes.length) {
    } else if(nextProps.tabs.length>this.iframes.length) {
      nextProps.tabs.map(e=>{
        if(typeof this.iframes[e] =='undefined') {
          this.iframes[e]=<iframe src={'../systemManage/'+e+'.html'} frameBorder="0" id={'ifs-'+e} key={e} style={{display:'none'}} ></iframe>;
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
    console.log("s");
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

// function iframe_set(elem) {
//   var child_iframe=document.getElementById(elem);
//   child_iframe.height=child_iframe.contentWindow.document.body.scrollHeight;
// }

// 菜单

class Menue extends React.Component {
  constructor(props) {
    super(props);
    // 设置默认显示的第一个tab
    this.state={
      Menue_on:this.props.Menues[0]
    }
  }

  tab_change(name,eve) {
    this.setState({
      Menue_on:name
    },()=>{
      Create_tabs(this.state.Menue_on);
    });
    
  }

  componentDidMount() {
    Menue_this=this;
    this.refs.menue.children[0].className='menue_on';
    Create_tabs(this.state.Menue_on);
  }
  componentDidUpdate(preProps,preState) {
    this.refs.menue.children[this.props.Menues.indexOf(preState.Menue_on)].className='';
    this.refs.menue.children[this.props.Menues.indexOf(this.state.Menue_on)].className='menue_on';
  }

  render() {
    return(<ul ref='menue'>{
      this.props.Menues.map((e,index)=><li key={index} name={e} onClick={this.tab_change.bind(this,e)}>{BluMUI.menue_names[e]}</li>)
    }</ul>);
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
    Menue_this.setState({Menue_on:tab_name});
  }
  del(tab_name,eve) {
    eve.nativeEvent.preventDefault()
    let tabs=this.state.tabs;
    let index=tabs.indexOf(tab_name);
    let new_on;
    tabs.splice(index,1);
    if(index<1) {
      new_on = tabs[index+1];
    } else {
      new_on = tabs[index-1];
    }
    this.setState({
      tabs:tabs,
      on:new_on
    });
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
  componentDidMount() {
    Create_iframes(this.state);
    this.refs[this.state.on].className='tabs_on';
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
        this.setState({
          tabs:tabs,
          on:new_on
        });
        Menue_this.setState({Menue_on:new_on});
      }}
    );
  }
  render() {
    //需要this.state向下传递信息，包括tab[]和on
    return(<ul ref='tabs'>{
      this.state.tabs.map((e,index)=><li key={index} ref={e} onClick={this.tab_change.bind(this,e)}>
        {BluMUI.menue_names[e]}
        <span className="close">x</span>
      </li>)
    }</ul>);
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
  Create_menu: Menue,
  Create_iframe: Iframe,
  Create_tab: Tab_head,

}

var BluMUI = {
	result: {},
  menue_names:{},
	create: function (data, type, elem) {
		var props = data, Blu = BluMUI_M[type];
		this.result[props.id] = ReactDOM.render(<Blu {...props}/>, elem);    
	}
};


export default BluMUI;
