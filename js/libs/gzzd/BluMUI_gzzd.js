import React from 'react';
import ReactDOM from 'react-dom';

var ajax=require('./post_ajax.js');
// -----------------------------------------gzzd-------------------------------------------------------


/* 筛选条件 */
class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.serch=this.serch.bind(this);
    this.pub='';
    this.P={
      page:1,
      pages:0
    }
  }

  serch(p) {
    let source=this.refs.Source.value;
    let title=this.refs.Title.value;
    if(this.refs.Pub.checked==this.refs.Unpub.checked) {
      this.pub='';
    } else {
      this.pub=this.refs.Pub.checked?1:0;
    }
    ajax({
      url:courseCenter.host+'getRegulationHead',
      data:{
        page:p||this.P.page,
        unifyCode:getCookie('userId'),
        count:10,
        user:'admin',
        state:this.pub,
        title:title,
        source:source
      },
      success:gets=>{
        let datas=JSON.parse(gets);
        this.P={
          page:p||this.P.page,
          pages:datas.data.totalPages
        }
        show_list(
          datas.data.regulationInformation,
          this.P,
          this
        );
        parent.document.getElementById('ifs-gzzd').height=document.body.scrollHeight;
      }
    });
  }

  componentDidMount() {
    let Pub=this.refs.Pub;
    let Unpub=this.refs.Unpub;

    this.serch();
    this.refs.Serch.onclick=this.serch.bind(this,1);

    Pub.onchange=this.serch.bind(this,1);
    Unpub.onchange=this.serch.bind(this,1);
  }

  render() {
    return(<div id="Filters">
      <label>
        <input type="checkbox" ref='Pub' id='Pub'/>
        <span>&nbsp;已发布&nbsp;&nbsp;&nbsp;</span>
      </label>
      <label>
        <input type="checkbox" ref='Unpub' id='Unpub'/>
        <span>&nbsp;未发布&nbsp;&nbsp;&nbsp;</span>
      </label>
      <span>标题&nbsp;</span>
      <input type="text" ref='Title' id='Title'/>
      <span>来源&nbsp;</span>
      <input type="text" ref='Source' id='Source'/>
      <span id="serch" ref='Serch'>查询</span>
    </div>);
  }
}


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
    return(<div id="fanye">
      <div id="fanye_pre" ref="pre" onClick={this.fanye.bind(this,this.props.page-1<0?1:this.props.page-1)}><img src="../../imgs/courseAudit/fanye_left.png" alt=""/></div>
      <ul ref="popup_fanye">
        {fanye}
      </ul>
      <div id="fanye_next" ref="next" onClick={this.fanye.bind(this,this.props.page+1>this.props.pages?0:this.props.page+1)}><img src="../../imgs/courseAudit/fanye_right.png" alt=""/></div>
    </div>);
  }

  fanye(p) {
    if(p==0) {
      return;
    }
    this.props.This.P.page=p;
    this.props.This.serch();
  }

  render() {
    return this.create_popup_fanye();
  }
}


/* 显示列表 */
class List extends React.Component {
  constructor(props) {
    super(props);
    this.create_body=this.create_body.bind(this);
    this.del=this.del.bind(this);
    this.pub=this.pub.bind(this);
  }
  del(id) {
    ajax({
      url:courseCenter.host+'deleteRegulation',
      data:{
        unifyCode:getCookie('userId'),
        id:id
      },
      success:e=>{
      }
    });
    this.props.This.serch();
  }
  pub(id) {
    ajax({
      url:courseCenter.host+'publishRegulation',
      data:{
        unifyCode:getCookie('userId'),
        id:id
      },
      success:e=>{
      }
    });
    this.props.This.serch();
  }

  create_body() {
    let id, userId, title, state, source;
    return(<tbody>
      {this.props.Lists.map((e,index)=>{
        id=e.id;
        userId=getCookie('userId');
        title=document.getElementById('Title').value;
        source=document.getElementById('Source').value;
        state=(document.getElementById('Pub').checked==document.getElementById('Unpub').checked?'':+document.getElementById('Pub'));
        return <tr key={index}>
          <td>{e.bt}</td>
          <td>{e.czsj}</td>
          <td>{e.author}</td>
          <td>{e.ly}</td>
          <td>{+e.sffb?'已发布':'未发布'}</td>
          <td>{+e.sffb?
            <div id="caozuo">
              <span><a target="view_window" href={
                '../Regulations/regContain.html?id='+id+'&unifyCode='+userId+'&title='+title+'&state='+state+'&source='+source
              }>查看</a></span>
              <span><a href="#" onClick={this.del.bind(this,e.id)}>删除</a></span>
            </div>:
            <div id="caozuo">
              <span><a href="#" onClick={this.pub.bind(this,e.id)}>发布</a></span>
              <span><a target="view_window" href={
                '../Regulations/regContain.html?id='+id+'&unifyCode='+userId+'&title='+title+'&state='+state+'&source='+source
              }>查看</a></span>
              <span><a href="#" onClick={this.del.bind(this,e.id)}>删除</a></span>
            </div>
          }</td>
        </tr>;
      })}
    </tbody>);
  }


  render() {
    return(<div>
      <table id='list_table'>
        <thead>
          <tr>
            <td>标题</td>
            <td width='13%'>发布时间</td>
            <td width='10.5%'>发布人</td>
            <td width='10%'>来源</td>
            <td width='10%'>状态</td>
            <td width='15.4%'>操作</td>
          </tr>
        </thead>
        {this.create_body()}
      </table>
      <BlueMUI_CreateFanye This={this.props.This} page={this.props.P.page} pages={this.props.P.pages}/>
    </div>);
  }
}
function show_list(Lists,P,This) {
  BluMUI.create({
    Lists:Lists,
    P:P,
    This:This
  },'Create_gzzd_list',document.getElementById('list'));
}














var BluMUI_M = {
  Create_filter: Filter,
  Create_gzzd_fanye: BlueMUI_CreateFanye,
  Create_gzzd_list: List
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