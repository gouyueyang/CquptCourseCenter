import React from 'react';
import ReactDOM from 'react-dom';
var ajax=require('./post_ajax.js');
var Place=2;
/*
 * 学习资源
 */

// 左侧导航
class BlueMUI_CreateNav extends React.Component {
  constructor(props) {
    super(props);
    this.choose=this.choose.bind(this);
    this.set_nav=this.set_nav.bind(this);
    this.state={
      Nav:this.props.module||'a'
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this.refs[prevState.Nav].style.background='#FFF';
    this.refs[prevState.Nav].children[0].style.color='#333';
    this.set_nav();
  }

  set_nav() {
    let nav=this.refs[this.state.Nav];
    nav.style.background='#007A51';
    nav.children[0].style.color='#FFF';
    Show_nav_item(this.state.Nav);
  }

  choose(state) {
    let prop={};
    this.setState({Nav:state});
  }

  render() {
    return (<ul id="left">
      <li ref='a' onClick={this.choose.bind(this,'a')}><span>视频</span></li>
      <li ref='b' onClick={this.choose.bind(this,'b')}><span>讲义</span></li>
      <li ref='c' onClick={this.choose.bind(this,'c')}><span>作业</span></li>
      <li ref='d' onClick={this.choose.bind(this,'d')}><span>习（试）题库</span></li>
      <li ref='e' onClick={this.choose.bind(this,'e')}><span>网络学习资源</span></li>
      <li ref='f' onClick={this.choose.bind(this,'f')}><span>教材/参考书</span></li>
    </ul>);
  }

  componentDidMount() {
    this.set_nav();
  }
}

// 在右边显示左边菜单的子项目内容
var Show_nav_item=function(prop) {
  let num=['a','b','c','d','e'];
  let Comps={
    a:BlueMUI_Create_a,
    b:BlueMUI_Create_b,
    c:BlueMUI_Create_c,
    d:BlueMUI_Create_d,
    e:BlueMUI_Create_e,
    f:BlueMUI_Create_f,
  };
  let Comp=Comps[prop];
  let data={};
  let url='';

  if(prop=='f') {
    url=courseCenter.host+'getTextbookResourceMsg';
    data={
      unifyCode:BluMUI.result.config.user_id,
      kcbh:BluMUI.result.config.course_id,
      place:Place,
    };
  } else {
    url=courseCenter.host+'getStudyResourceMsg';
    data={
      unifyCode:BluMUI.result.config.user_id,
      kcbh:BluMUI.result.config.course_id,
      place:Place,
      zylb:prop=='b'?21:1+num.indexOf(prop)
      // zylb: 21
    };
  }

  ajax({
    url:url,
    data:data,
    success:function(gets) {
      let datas=JSON.parse(gets);
      ReactDOM.unmountComponentAtNode(document.getElementById('React_right'));
      ReactDOM.render(
        <Comp {...datas}/>,
        document.getElementById('React_right')
      );
    }
  });
}

// 检查函数，用于检查每个子项目的数据是否合法
function check() {
  let error_msg="";
  if(this.props.meta.result!=100) {
    if(this.props.meta.result===101) {
      error_msg="该模块暂无数据";
    } else if(this.props.meta.result===102) {
      error_msg="该模块数据正在编辑/审核中";
    } else {
      error_msg="系统发生错误";
    }
    return(<div id="error" key='error'>
      <img src="../../imgs/public/error.png" alt="error"/>
      <span>{error_msg}</span>
    </div>);
  }
  return false;
}

// 下载函数，用于下载文件
function xiazai(name,down) {
  let codedName = encodeURI(name);
  let codedDown = encodeURI(down);
  this.refs.DOWNLOAD.src=`${courseCenter.host}fileDownLoad?name=${codedName}&oName=${codedDown}&unifyCode=${BluMUI.result.config.user_id}`;
}

// 导航的子项目
//视频
class BlueMUI_Create_a extends React.Component {
  constructor(props) {
    super(props);
    this.create_shipin=this.create_shipin.bind(this);
    this.create_other_shipin=this.create_other_shipin.bind(this);
    this.up=[];
    this.down=[];
  }

  create_shipin() {
    let back=[];
    back.push(Create_tab('微视频'));
    let flag = check.call(this);
    if(flag) return flag;
    this.props.data.map(e=>{
      if(!e.wlxxzylj) {
        back.push(<div className="shipin" key={e.id}>
          <a target="view_window" href={'courseVideo.html?fileName='+e.xywjm}>
            <img src="../../imgs/classListInfShow/courseShow/shipin.png" style={{width:'152px',height:'131px'}}/>
          </a>
          <br/>
          <span title={e.ywjm.split('.')[0]} >{e.ywjm.split('.')[0]}</span>
        </div>);
      } else {
        this.down.push(e);
      }
    });
    if(back.length==1) {
      back.push(<div key='space' style={{height:'100px',width:'1px'}}></div>);
    }
    return back;
  }

  create_other_shipin() {
    let back=[];
    let flag = check.call(this);

    back.push(Create_tab('录播视频'));
    if(flag) return;
    this.down.map(e=>{
      back.push(<a target="view_window" href={e.wlxxzylj} key={e.id}>{e.ljmc}</a>)
    })
    if(back.length==1) {
      back.push(<div key='space' style={{height:'100px',width:'1px'}}></div>);
    }
    return back;
  }

  render() {
    return(<div id='right'>
      {this.create_shipin()}
      {this.create_other_shipin()}
    </div>);
  }
}

//讲义
class BlueMUI_Create_b extends React.Component {
  constructor(props) {
    super(props);
    this.jiangyi=false;
    this.other=false;
    this.ziyuan=false;
    this.default_kcbh='';
  }

  show(No) {
    // 在线显示PDF
    if(No) {
      var swfURL = courseCenter.host + 'CquptCourseCenter/pages/classInfShow/docs/CourseCenterAttachment/';
      
      window.frames['preview'].location.href = 'pdfViewer.html?file='+(swfURL + No.xywjm);
      if(No.sfnxz==1) {
        // 字段sfnxz：1->能下载，2->不能下载
        ReactDOM.render(
          <div>
            <a href="javascript:void(0)" onClick={xiazai.bind(this,No.ywjm,No.xywjm)} style={{
              background:'url(../../imgs/public/download.png) no-repeat 0px 8px',
              display:'block',
              color:'#666',
              paddingLeft:'24px',
              width:'58px',
              height:'32px',
              lineHeight:'32px',
              textDecoration:'none',
              fontSize:'12px',
            }}>下载讲义</a>
          </div>,
          document.getElementById('Down')
        );
      } else {
        ReactDOM.unmountComponentAtNode(document.getElementById('Down'));
      }
    }
  }

  create_jiangyi() {
    let back = [];

    this.jiangyi = check.call(this);
    back.push(Create_tab('讲义'));
    if(this.jiangyi) {
      back.push(<div key="no_data" style={{width:"100%",height:"100px"}}></div>);
    } else {
      this.default_kcbh=this.props.data[0];
      this.props.data.map(e=>{
        back.push(<a href="javascript:void(0)" key={e.id} onClick={this.show.bind(this,e)}>{e.ywjm}</a>);
      });
    }
    return back;
  }

  create_other() {
    let back=[];
    back.push(Create_tab('其他资源'));
    var xmlhttp=new XMLHttpRequest();
    var data={
      unifyCode:BluMUI.result.config.user_id,
      kcbh:BluMUI.result.config.course_id,
      place:Place,
      zylb:22
    };
    var ajax_data='';
    for(let i in data) {
      ajax_data+=i+'='+data[i]+'&';
    }
    xmlhttp.onreadystatechange=()=>{
      if (xmlhttp.readyState==4 && xmlhttp.status==200) {
        let datas=JSON.parse(xmlhttp.responseText);
        this.other = datas.meta.result;
        if(this.other==101||this.other==102) {
          back.push(<div key="no_data" style={{width:"100%",height:"100px"}}></div>);
        } else {
          datas.data.map(e=>{
            let Xiazai;
            if(e.sfnxz==1) {
              Xiazai=<span className='ziyuan_xiazai' onClick={xiazai.bind(this,e.ywjm,e.xywjm)}>下载</span>;
            } else {
              Xiazai=<div className="not-login">登录后可下载</div>;
            }
            back.push(<div className="ziyuan_item" key={e.id}>
              <img src="../../imgs/classListInfShow/courseShow/ziyuan.png"/>
              <br/>
              <span title={e.ywjm}>{e.ywjm.split('.')[0]}</span>
              <br/>
              { Xiazai }
              {/* <span className='ziyuan_xiazai' onClick={xiazai.bind(this,e.ywjm,e.xywjm)}>下载</span> */}
            </div>);
          });
        }
      }
    }
    xmlhttp.open("POST",courseCenter.host+"getStudyResourceMsg",false);
    xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send(ajax_data.substr(0,ajax_data.length-1));
    return back;
  }

  render() {
    return(<div id='right' ref='right'>
      <div id="jiangyi">
        {this.create_jiangyi()}
        {this.jiangyi?'':<iframe name="preview" ref="preview" style={{display:'block',width:'100%',height:'700px'}}></iframe>}
        <div ref="fujian_download" id="Down"></div>
      </div>
      <div id="other">
        {this.create_other()}
      </div>
      <iframe src="" frameBorder="0" ref='DOWNLOAD' style={{display:'none'}}></iframe>
    </div>);
  }

  componentDidMount() {
    let error_msg="";
    if(this.jiangyi&&this.other!==100) {
      if(this.other===101) {
        error_msg="该模块暂无数据";
      } else if(this.other==102) {
        error_msg="该模块数据正在编辑/审核中";
      } else {
        error_msg="系统发生错误";
      }
      this.refs.right.innerHTML="<div id='error' key='error'><img src='../../imgs/public/error.png' alt='error'/><span>"+error_msg+"</span></div>";
    } else {
      this.show(this.default_kcbh);
    }
  }
}

//作业
class BlueMUI_Create_c extends React.Component {
  constructor(props) {
    super(props);
  }

  create_zuoye() {
    let flag = check.call(this);
    if(flag) return flag;
    let back=[];
    let Xiazai;
    this.props.data.map(e=>{
      if(e.sfnxz==1) {
        Xiazai=<span className='ziyuan_xiazai' onClick={xiazai.bind(this,e.ywjm,e.xywjm)}>下载</span>;
      } else {
        Xiazai=<div className="not-login">登录后可下载</div>;
      }
      back.push(<div className="ziyuan_item" key={e.id}>
        <img src="../../imgs/classListInfShow/courseShow/ziyuan.png"/>
        <br/>
        <span title={e.ywjm}>{e.ywjm.split('.')[0]}</span>
        <br/>
        {Xiazai}
      </div>);
    });
    if(back.length==1) {
      back.push(<div key='space' style={{height:'100px',width:'1px'}}></div>);
    }
    return(<div id="ziyuan">
      {back}
      <div style={{clear:'both'}} ></div>
    </div>);
  }

  render() {
    return(<div id='right'>
      {this.create_zuoye()}
      <iframe src="" frameBorder="0" ref='DOWNLOAD' style={{display:'none'}}></iframe>
    </div>);
  }
}


//习题
class BlueMUI_Create_d extends React.Component {
  constructor(props) {
    super(props);
  }

  create_xiti() {
    let flag = check.call(this);
    if(flag) return flag;
    let back=[];
    let Xiazai;
    this.props.data.map(e=>{
      if(e.sfnxz==1) {
        Xiazai=<span className='ziyuan_xiazai' onClick={xiazai.bind(this,e.ywjm,e.xywjm)}>下载</span>;
      } else {
        Xiazai=<div className="not-login">登录后可下载</div>;
      }
      back.push(<div className="ziyuan_item" key={e.id}>
        <img src="../../imgs/classListInfShow/courseShow/ziyuan.png"/>
        <br/>
        <span title={e.ywjm}>{e.ywjm.split('.')[0]}</span>
        <br/>
        {Xiazai}
      </div>);
    });
    if(back.length==1) {
      back.push(<div key='space' style={{height:'100px',width:'1px'}}></div>);
    }
    return(<div id="ziyuan">
      {back}
      <div style={{clear:'both'}} ></div>
    </div>);
  }

  render() {
    return(<div id='right'>
      {this.create_xiti()}
      <iframe src="" frameBorder="0" ref='DOWNLOAD' style={{display:'none'}}></iframe>
    </div>);
  }
}

//资源
class BlueMUI_Create_e extends React.Component {
  constructor(props) {
    super(props);
  }

  create_ziyuan() {
    let flag = check.call(this);
    let back=[];
    let Xiazai;
    if(flag) return flag;
    back.push(Create_tab('附件'));

    this.props.data.map(e=>{
      if(e.ywjm!='') {
        if(e.sfnxz==1) {
          Xiazai=<span className='ziyuan_xiazai' onClick={xiazai.bind(this,e.ywjm,e.xywjm)}>下载</span>;
        } else {
          Xiazai=<div className="not-login">登录后可下载</div>;
        }
        back.push(<div className="ziyuan_item" key={e.id}>
          <img src="../../imgs/classListInfShow/courseShow/ziyuan.png"/>
          <br/>
          <span title={e.ywjm}>{e.ywjm.split('.')[0]||e.ywjm.split('.')[0]+'.'+e.ywjm.split('.')[1]}</span>
          <br/>
          {Xiazai}
        </div>);
      }
    });
    if(back.length==1) {
      back.push(<div key='space' style={{height:'100px',width:'1px'}}></div>);
    }
    return(back);
  }

  create_link() {
    if(check.call(this)) {
      return;
    }
    let back=[];
    back.push(Create_tab('链接'));
    this.props.data.map(e=>{
      if(e.wlxxzylj!='') {
        back.push(<div key={e.id} className='ziyuan_link'><span>网络链接：</span><a target="view_window" href={e.wlxxzylj}>{e.ljmc}</a></div>);
      }
    });
    return(
      back
    );
  }

  render() {
    return(<div id='right'>
      {this.create_ziyuan()}
      {this.create_link()}
      <iframe src="" frameBorder="0" ref='DOWNLOAD' style={{display:'none'}}></iframe>
    </div>);
  }
}


// 参考书
class BlueMUI_Create_f extends React.Component {
  constructor(props) {
    super(props);
    this.no_data=false;
  }

  create_jiaocai() {
    let flag = check.call(this);
    let back=[];

    back.push(Create_tab('课程教材'));
    if(flag) return flag;
    this.props.data.teachBookList.map(e=>{
      back.push(<div className="item" key={e.id} >
        <img width='120px' height='160px' src={courseCenter.host+'upload/PIC/'+e.tpmc}/>
        <span className="item_title">{'教材名称：'+e.sm}</span><br/><br/>
        <span>{'作者：'+e.zz}</span><br/>
        <span>{'出版社：'+e.CBS}</span>
      </div>);
    });
    if(back.length==1) {
      back.push(<div key='space' style={{height:'100px',width:'1px'}}></div>);
    }
    return back;
  }

  create_cankaoshu() {
    let flag = check.call(this);
    let back=[];

    back.push(Create_tab('参考书'));
    if(flag) return;
    this.props.data.referenceBookList.map(e=>{
      back.push(<div className="item" key={e.id} >
        <img width='120px' height='160px' src={courseCenter.host+'upload/PIC/'+e.tpmc}/>
        <span className="item_title">{'参考书名称：'+e.sm}</span><br/><br/>
        <span>{'作者：'+e.zz}</span><br/>
        <span>{'出版社：'+e.CBS}</span>
      </div>);
    });
    if(back.length==1) {
      back.push(<div key='space' style={{height:'100px',width:'1px'}}></div>);
    }
    return back;
  }

  render() {
    return(<div id='right'>
      {this.create_jiaocai()}
      {this.create_cankaoshu()}
    </div>);
  }
}

function Create_tab(tab_name) {
  return(<div className="tab" key={tab_name+'head'} >
    <span>{tab_name}</span>
  </div>);
}

var BluMUI_M = {
  CreateNav:BlueMUI_CreateNav,
}

var BluMUI = {
	result: {},
	create: function (data, type, elem) {
		var props = data, Blu = BluMUI_M[type];
		this.result[props.id] = ReactDOM.render(<Blu {...props}/>, elem);    
	}
};

export default BluMUI;