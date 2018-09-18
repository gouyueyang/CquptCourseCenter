import React from 'react';
import ReactDOM from 'react-dom';
var ajax = require('../libs/post_ajax.js');
var _count = 10;

//创建绿色的表头（又是绿色= =！）
class BlueMUI_CreateThead extends React.Component {
  constructor(props) {
    super(props);
    // this.bind_pages=this.bind_pages.bind(this);
    this.state = {
      lists: this.props.lists,
      page: this.props.page || 1,
      total: this.props.total,
      totalPages: this.props.totalPages
    }
  }

  //根据权限创建绿色的表头（绿色……）
  thead_create() {
    //创建表头内容数组
    let thead_items = [];
    //填充表头内容
    thead_items[0] = <td key='w1' width='35px'></td>;
    thead_items[1] = <td key='0' width='150px'>序号</td>;
    switch (BluMUI.result.Tab.state.Rank) {
      case 1:
        thead_items[2] = <td key='1'>学院</td>;
        thead_items[3] = <td key='2' width='240px'>系部中心名称</td>;
        thead_items[4] = <td key='3' width='300px'>系部中心主任</td>;
        break;
      case 2:
      case 3:
        thead_items[2] = <td key='1' width='180px'>课程编号</td>;
        thead_items[3] = <td key='2'>课程名称</td>;
        thead_items[4] = <td key='3' width='150px'>课程负责人</td>;
        thead_items[5] = <td key='4' width='280px'>课程团队成员</td>;
        break;
    }
    thead_items.push(<td key={thead_items.length + 1} width='120px'>操作</td>);
    thead_items.push(<td key='w2' width='39px'></td>);
    return thead_items;
  }

  face_serch(p) {
    // if(p==0||p==this.state.page) {
    //   return;
    // }
    // let that=this;
    ajax({
      url: courseCenter.host + 'CourseMatainMsg',
      data: {
        type: BluMUI.result.Tab.state.Rank,
        unifyCode: BluMUI.result.user_id,
        page: p,
        count: _count,
        selectName: document.getElementById('jxtdss').value
      },
      success: (gets) => {
        let list = JSON.parse(gets);
        this.setState({
          lists: list.data.courseList,
          page: p
        });
      }
    });
  }

  //绑定翻页按钮事件（提出来是因为原来需要初始化和重渲染后再绑定）
  // bind_pages() {
  //   let that=this;
  //   let fanye_out=this.refs.fanye_out;
  //   if(fanye_out.refs.popup_fanye){
  //     let fanye_bar=fanye_out.refs.popup_fanye.children;
  //     let yema=fanye_bar.length;
  //     for(let j=0;j<yema;j++) {
  //       if(fanye_bar[j].innerText!='...') {
  //         fanye_bar[j].onclick=function() {
  //           let click_page= +this.innerText;
  //           that.face_serch(click_page);
  //         }
  //       }
  //     }
  //   }

  //   //搜索的前翻和后翻
  //   if(fanye_out.refs.next&&fanye_out.refs.pre) {
  //     fanye_out.refs.next.onclick=function() {
  //       that.face_serch(that.state.page+1>that.state.totalPages?0:that.state.page+1);
  //     }
  //     fanye_out.refs.pre.onclick=function() {
  //       that.face_serch(that.state.page-1<0?1:that.state.page-1);
  //     }
  //   }
  // }

  //组件加载后执行的事件
  componentDidMount() {
    // this.bind_pages();
  }

  //组件重渲染后执行的事件
  componentDidUpdate() {
    // this.bind_pages();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      lists: nextProps.lists,
      page: nextProps.page
    });
  }

  render() {
    return (<div id="table-wrap">
      <table>
        <thead>
          <tr>{this.thead_create()}</tr>
        </thead>
        <BlueMUI_CreateTbody Lists={this.state.lists} Rank={BluMUI.result.Tab.state.Rank} page={this.state.page} />
      </table>
      {/*<BlueMUI_CreateFanye id="Out_fanye" pages={this.state.totalPages} page={this.state.page} ref="fanye_out" />*/}

      <BlueMUI_CreateFanye
        id="Out_fanye"
        TP={{ pages: this.state.totalPages, page: this.state.page, total: this.state.total }}
        ref="fanye_out"
        callback={this.face_serch.bind(this)}
      />
    </div>);
  }
}

//创建表身
class BlueMUI_CreateTbody extends React.Component {
  constructor(props) {
    super(props);
    this.create_list = this.create_list.bind(this);
  }

  option(data, event) {
    switch (this.props.Rank) {
      case 1:
        document.getElementById('body_head').style.display = 'none';
        ReactDOM.render(
          <BlueMUI_CreateAdding Rank={BluMUI.result.Tab.state.Rank} Leaders={data.Liders} Jysh={data.Jysh} />,
          document.getElementById('list')
        );
        break;
      case 2:
        document.getElementById('body_head').style.display = 'none';
        let that = this;
        //获取教学团队成员信息
        ReactDOM.render(
          <BlueMUI_CreateAdding Rank={BluMUI.result.Tab.state.Rank} Master={data.Master} Teachers={data.Teachers} Kcbh={data.Kcbh} Kcmc={data.Kcmc} />,
          document.getElementById('list')
        );
        break;
      case 3:
        document.getElementById('body_head').style.display = 'none';
        ReactDOM.render(
          <BlueMUI_CreateAdding Teachers={data.Teachers} Rank={BluMUI.result.Tab.state.Rank} Kcbh={data.Kcbh} Kcmc={data.Kcmc} />,
          document.getElementById('list')
        );
        break;
    }
    //将事件对象用来阻止链接跳转
    arguments[arguments.length - 1].preventDefault();
  }

  create_list(all_lists) {
    if (all_lists.length == 0) {
      return (<tr id='No-data'><td>
        <div className='no_data'>
          <img width='150px' height='150px' src="../../imgs/public/error.png" />
          <br />
          <span>没有数据</span>
        </div>
      </td></tr>);
    }
    let j = 0;
    let lists = [];
    let teachers = [];//教师数组
    let end = all_lists.length;
    switch (BluMUI.result.Tab.state.Rank) {
      case 1:
        for (let i = 0; i < end; i++) {
          lists.push(<tr key={i}>
            <td></td>
            <td>{i + 1 + _count * (this.props.page - 1)}</td>
            <td>{all_lists[i].kkxymc}</td>
            <td>{all_lists[i].jysmc}</td>
            <td>{all_lists[i].officeLeadersName.map(e => <span key={e.jyszr}>{e.jyszr}</span>)}</td>
            <td><a href="#" onClick={this.option.bind(this, {
              Liders: all_lists[i].officeLeadersName,
              Kcbh: all_lists[i].kcbh,
              Kcmc: all_lists[i].kcmc,
              Jysh: all_lists[i].jysh
            })}>{all_lists[i].officeLeadersName.length ? "修改" : "添加"}</a></td>
            <td></td>
          </tr>);
        }
        break;
      case 2:
        j = 0;
        for (let i = 0; i < end; i++) {
          teachers = [];
          all_lists[i].teacher.map(e => {
            teachers.push(<span key={j++} >{e.xm}</span>);
          });

          lists.push(<tr key={i}>
            <td></td>
            <td>{i + 1 + _count * (this.props.page - 1)}</td>
            <td>{all_lists[i].kcbh}</td>
            <td>{all_lists[i].kcmc}</td>
            <td>{all_lists[i].fzrxm}</td>
            <td className="out-teacher"><div className="teachers">{teachers}</div></td>
            <td><a href="#" onClick={this.option.bind(this, {
              Teachers: all_lists[i].teacher,
              Master: all_lists[i].fzrxm ? { xm: all_lists[i].fzrxm, sfrzh: all_lists[i].fzrsfrzh } : '',
              Kcbh: all_lists[i].kcbh,
              Kcmc: all_lists[i].kcmc
            })}>编辑</a></td>
            <td></td>
          </tr>);
        }
        break;
      case 3:
        j = 0;
        //过滤掉重复的教师信息
        for (let i = 0; i < end; i++) {
          teachers = [];
          if (all_lists[i].teacher) {
            all_lists[i].teacher.map(e => {
              teachers.push(<span key={j++} >{e.xm}</span>);
            });
          } else {
            teachers = [];
          }
          lists.push(<tr key={i}>
            <td></td>
            <td>{i + 1 + _count * (this.props.page - 1)}</td>
            <td>{all_lists[i].kcbh}</td>
            <td>{all_lists[i].kcmc}</td>
            <td>{all_lists[i].fzrxm}</td>
            <td>{teachers}</td>
            <td><a href="#" onClick={this.option.bind(this, {
              Teachers: all_lists[i].teacher,
              Kcbh: all_lists[i].kcbh,
              Kcmc: all_lists[i].kcmc
            })}>编辑</a></td>
            <td></td>
          </tr>);
          teachers = [];
        }
        break;
    }
    return lists;
  }
  render() {
    return (<tbody>{this.create_list(this.props.Lists)}</tbody>);
  }
}


//创建弹出层层
class BlueMUI_CreatePopup extends React.Component {
  constructor(props) {
    super(props);
    this.shuld_insert = true;
    this.popup_serch = this.popup_serch.bind(this);
    this.popup = document.getElementById('popup');
    this.choose_teachers = [];
    this.serch_name = "";
    this.teacher_names = {};
    this.Master = "";
    this.xueyuan_name = '';
    //用于搜索用的state
    this.state = {
      teachers: [],
      total: 0,
      page: 1,
      pages: 0
    };
  }

  create_popup_top() {
    return (<div id="top">
      <span>{this.props.Title}</span>
      <span id="popup_close" ref="close">X</span>
    </div>);
  }

  insert_xueyuan() {
    if (!this.shuld_insert) {
      return;
    } else {
      this.shuld_insert = false;
    }
    ajax({
      url: courseCenter.host + 'getCollege',
      data: {
        unifyCode: getCookie("userId")
      },
      success: (gets) => {
        let datas = JSON.parse(gets);
        if (datas.meta.result == 100) {
          let CL = '<option value="">请选择</option>';
          datas.data.map(e => CL += `<option value=${e.kkxymc}>${e.kkxymc}</option>`);
          this.xueyuan.innerHTML = CL;
        }
      }
    });
  }

  create_popup_serch() {
    return (<div id="serch">
      <span id="xueyuan_span">学院：</span>
      <select
        name="xueyuan"
        id="xueyuan"
        ref={select => { (this.xueyuan = select) ? this.insert_xueyuan() : '' }}
      >
        <option value="">请选择</option>
      </select>
      <span id="popup_left">查找（姓名）</span>
      <input type="text" id="popup_serch" placeholder="请输入关键字……" ref="serch_value" />
      <span id="popup_serch_button" ref="serch">搜 &nbsp;索</span>
    </div>);
  }

  create_popup_thead() {
    return (<thead>
      <tr>
        <td width="34px"></td>
        <td width="45px" className="input"><input type="checkbox" ref="popup_allcheck" /></td>
        <td width="184px">单位</td>
        <td width="130px">姓名</td>
      </tr>
    </thead>);
  }

  create_popup_tbody() {
    let lists = [];
    let end = this.state.teachers.length;
    for (let i = 0; i < end; i++) {
      lists.push(<tr key={this.state.teachers[i].sfrzh}>
        <td>{i + 1 + 10 * (this.state.page - 1)}</td>
        <td><input type="checkbox" value={JSON.stringify(this.state.teachers[i])} id={this.state.teachers[i].sfrzh} /></td>
        <td>{this.state.teachers[i].xymc}</td>
        <td>{this.state.teachers[i].xm}</td>
      </tr>);
    }
    return (<tbody ref="popup_tbody">{lists}</tbody>);
  }

  create_popup_option() {
    return (<div id="popup_option">
      <span className="pop-opt-btn" id="popup_ok" ref="OK">确定</span>
      <span className="pop-opt-btn" id="popup_return" ref="back">返回</span>
    </div>);
  }

  //搜索
  popup_serch(p, start) {
    if (p == 0) {
      return;
    }
    //每次发生ajax的时候清空候选数据与checkbox
    this.refs.popup_allcheck.checked = false;
    let inputs = this.refs.popup_tbody.getElementsByTagName('input');
    this.Master = "";
    this.teacher_names = {};
    this.choose_teachers = [];

    let end = inputs.length;
    for (let i = 0; i < end; i++) {
      inputs[i].checked = false;
    }
    let that = this;
    ajax({
      url: courseCenter.host + 'searchTeacherByName',
      data: {
        name: start || that.serch_name,
        college: this.xueyuan_name,
        page: p,
        count: 10
      },
      success: function (gets) {
        let list = JSON.parse(gets);
        if (list.data) {
          that.setState({
            teachers: list.data.teacherList,
            pages: list.data.totalPages,
            total: list.data.total,
            page: p
          });
        } else {
          that.setState({
            teachers: [],
            total: list.data.total,
            page: 1,
            pages: 0
          });
        }
      }
    });
  }

  //组件渲染完成后会执行的函数，可以在里面进行手动js事件绑定
  //手动绑定可以避免react自己的事件绑定不能阻止冒泡的坑
  //因为react的事件全部代理在document上面的
  componentDidMount() {
    let that = this;
    let hide_popup = function (e) {
      if (e.target.id === 'popup' || e.target.id === 'popup_return' || e.target.id === 'popup_close') {
        that.popup.style.display = "none";
        ReactDOM.unmountComponentAtNode(document.getElementById('popup'));
      }
    };
    //单击弹出窗后面的背景隐藏弹出层
    this.popup.onclick = hide_popup;
    //单击关闭按钮隐藏弹出层
    this.refs.close.onclick = hide_popup;
    //单击弹出窗的返回按钮隐藏弹出层
    this.refs.back.onclick = hide_popup;
    //阻止弹出窗body的单击事件冒泡
    // document.getElementById('popup_body').onclick=function(e){
    //   e.stopPropagation();
    // };

    //搜索按钮单击
    this.refs.serch.onclick = function () {
      that.serch_name = that.refs.serch_value.value;
      that.xueyuan_name = that.xueyuan.value;
      that.popup_serch(1);
    }

    //单击确定按钮
    this.popup_serch(1, '');
  }

  //重新渲染后的执行内容
  componentDidUpdate() {
    let that = this;

    //单击确认
    this.refs.OK.onclick = function () {
      if (that.refs.popup_tbody.children.length > 0) {
        //确认请求  //权限2的确认操作
        if (that.props.Master) {
          that.props.callback({ master: that.Master });
        } else {
          let Teachers = [];
          if (that.props.Rank == 1) {
            that.choose_teachers.map(e => {
              Teachers.push({
                sfrzh: e,
                jyszr: that.teacher_names[e]
              });
            });
          } else {
            that.choose_teachers.map(e => {
              Teachers.push({
                sfrzh: e,
                xm: that.teacher_names[e]
              });
            });
          }
          that.props.callback(Teachers);
        }
      }
      //清空搜索栏
      that.popup.style.display = "none";
      ReactDOM.unmountComponentAtNode(document.getElementById('popup'));
    }

    //全部打钩
    let inputs = that.refs.popup_tbody.getElementsByTagName('input');
    let end = inputs.length;
    if (!this.props.Master) {   //不是权限 1或者权限 2的 Master
      this.refs.popup_allcheck.onchange = function () {
        for (let i = 0; i < end; i++) {
          inputs[i].checked = this.checked;
          inputs[i].onchange(0);
        }
      }

    } else {
      this.refs.popup_allcheck.style.display = 'none';
    }

    //单个打钩
    for (let j = 0; j < end; j++) {
      inputs[j].onchange = function (a) {
        if (a) {
          //取消“全部打钩”的钩
          that.refs.popup_allcheck.checked = false;
        }
        if (that.props.Master) {      //权限 1进入
          if (this.checked) {
            that.Master = JSON.parse(this.value);
            for (let k = 0; k < end; k++) {
              inputs[k].checked = false;
              this.checked = true;
            }
          } else {
            that.Master = "";
          }
        } else {     //不是唯一设置的课程负责人
          if (this.checked) {
            that.choose_teachers.push(this.id);
            that.teacher_names[this.id] = JSON.parse(this.value).xm;
          } else {
            let index = that.choose_teachers.indexOf(this.id);
            if (index > -1) {
              that.choose_teachers.splice(index, 1);
            }
            delete that.teacher_names[this.id];
          }
        }
      }
    }

    //fanye
    // let fanye_in=this.refs.fanye_in;
    // if(fanye_in.refs.popup_fanye){
    //   let fanye_bar=fanye_in.refs.popup_fanye.children;
    //   let yema=fanye_bar.length;
    //   for(let j=0;j<yema;j++) {
    //     if(fanye_bar[j].innerText!='...') {
    //       fanye_bar[j].onclick=e=>{
    //         let click_page= +e.target.innerText;
    //         that.popup_serch(click_page==this.state.page?0:click_page,that.serch_name||'');
    //       }
    //     }
    //   }
    // }

    //搜索的前翻和后翻
    // if(fanye_in.refs.next&&fanye_in.refs.pre) {
    //   fanye_in.refs.next.onclick=function() {
    //     that.popup_serch(that.state.page+1>that.state.pages?0:that.state.page+1,that.serch_name||'');
    //   }
    //   fanye_in.refs.pre.onclick=function() {
    //     that.popup_serch(that.state.page-1<1?0:that.state.page-1,that.serch_name||'');
    //   }
    // }
  }

  render() {
    this.popup.style.display = "block";
    return (<div id="popup_body">
      {this.create_popup_top()}
      {this.create_popup_serch()}
      <table id="serch_table">
        {this.create_popup_thead()}
        {this.create_popup_tbody()}
      </table>
      <BlueMUI_CreateFanye
        id="Popup_Fanye"
        TP={{ pages: this.state.pages, page: this.state.page, total: this.state.total }}
        ref="fanye_out"
        callback={this.popup_serch.bind(this)}
      />
      {this.create_popup_option()}
    </div>);
  }
}

// <BlueMUI_CreateFanye id="Popup_Fanye" page={this.state.page} pages={this.state.pages} ref="fanye_in" />


class BlueMUI_CreateAdding extends React.Component {
  constructor(props) {
    super(props);
    this.del_teacher = this.del_teacher.bind(this);
    this.save_adding = this.save_adding.bind(this);
    this.back = this.back.bind(this);
    this.create_tdjs = this.create_tdjs.bind(this);
    this.state = {
      teachers: this.props.Teachers || this.props.Leaders,
      master: this.props.Master,
    }
  }
  del_teacher(a) {
    let that = this;

    if (typeof a == "number") {
      let teacher_cache = this.state.teachers;
      teacher_cache.splice(a, 1);
      this.setState({ teachers: teacher_cache });
    } else {
      this.setState({ master: "" });
    }
  }

  back() {
    let that = this;
    ajax({
      url: courseCenter.host + 'CourseMatainMsg',
      data: {
        type: that.props.Rank,
        unifyCode: BluMUI.result.user_id,
        page: BluMUI.result.Title.state.page,
        count: _count,
        selectName: document.getElementById('jxtdss').value
      },
      success: function (gets) {
        document.getElementById('body_head').style.display = 'block';
        let data = JSON.parse(gets);
        BluMUI.create({
          id: 'Title',
          rank: that.props.Rank,
          page: BluMUI.result.Title.state.page,
          lists: data.data.courseList,
          totalPages: data.data.totalPages
        },
          'CreateTableTitle',
          document.getElementById('list'));
      }
    });
  }

  save_adding() {
    let that = this;

    if (!this.state.master && this.props.Rank == 2) {
      alert("请添加负责人！");
      return;
    }
    if (this.props.Rank == 3) {
      if (this.refs.Js.value === '') {
        alert('请填写团队介绍！');
        return;
      }
      let teacher_codes = "";
      this.state.teachers.map(e => {
        teacher_codes += e.sfrzh + ",";
      });
      //去掉字符串末尾的","
      teacher_codes = teacher_codes.substring(0, teacher_codes.length - 1);
      ajax({
        url: courseCenter.host + 'updateTeachingTeam',
        data: {
          kcbh: that.props.Kcbh,
          kcmc: that.props.Kcmc,
          unifyCode: BluMUI.result.user_id,
          unifyCodes: teacher_codes,
          tdjs: document.getElementById('tdjs_text').value
        },
        success: function (gets) {
          if (JSON.parse(gets).meta.msg == 'success') {
            ajax({
              url: courseCenter.host + 'CourseMatainMsg',
              data: {
                type: 3,
                unifyCode: BluMUI.result.user_id,
                page: BluMUI.result.Title.state.page,
                count: _count,
                selectName: document.getElementById('jxtdss').value
              },
              success: function (gets) {
                document.getElementById('body_head').style.display = 'block';
                let data = JSON.parse(gets);
                BluMUI.create({
                  id: 'Title',
                  rank: 3,
                  page: BluMUI.result.Title.state.page,
                  lists: data.data.courseList,
                  totalPages: data.data.totalPages
                },
                  'CreateTableTitle',
                  document.getElementById('list'));
              }
            });
          }
        }
      });
    } else if (this.props.Rank == 2) {
      let teacher_codes = "";
      this.state.teachers.map(e => {
        teacher_codes += e.sfrzh + ",";
      });
      //去掉字符串末尾的","
      teacher_codes = teacher_codes.substring(0, teacher_codes.length - 1);
      ajax({
        url: courseCenter.host + 'updateCoursePrincipal',
        data: {
          kcbh: that.props.Kcbh,
          kcmc: that.props.Kcmc,
          unifyCode: BluMUI.result.user_id,
          unifyCodes: teacher_codes,
          principalUnifyCode: that.state.master.sfrzh
        },
        success: function (gets) {
          if (JSON.parse(gets).meta.msg == 'success') {
            ajax({
              url: courseCenter.host + 'CourseMatainMsg',
              data: {
                type: 2,
                unifyCode: BluMUI.result.user_id,
                page: BluMUI.result.Title.state.page,
                count: _count,
                selectName: document.getElementById('jxtdss').value
              },
              success: function (gets) {
                document.getElementById('body_head').style.display = 'block';
                let data = JSON.parse(gets);
                BluMUI.create({
                  id: 'Title',
                  rank: 2,
                  page: BluMUI.result.Title.state.page,
                  lists: data.data.courseList,
                  totalPages: data.data.totalPages
                },
                  'CreateTableTitle',
                  document.getElementById('list'));
              }
            });
          }
        }
      });
    } else if (this.props.Rank == 1) {
      let teacher_codes = "";
      this.state.teachers.map(e => {
        teacher_codes += e.sfrzh + ",";
      });
      //去掉字符串末尾的","
      teacher_codes = teacher_codes.substring(0, teacher_codes.length - 1);
      ajax({
        url: courseCenter.host + 'updateTeachingOfficeLeader',
        data: {
          jysh: this.props.Jysh,
          unifyCode: BluMUI.result.user_id,
          leaderUnifyCode: teacher_codes
        },
        success: function (gets) {
          if (JSON.parse(gets).meta.msg == 'success') {
            ajax({
              url: courseCenter.host + 'CourseMatainMsg',
              data: {
                type: 1,
                unifyCode: BluMUI.result.user_id,
                page: BluMUI.result.Title.state.page,
                count: _count,
                selectName: document.getElementById('jxtdss').value
              },
              success: function (gets) {
                document.getElementById('body_head').style.display = 'block';
                let data = JSON.parse(gets);
                BluMUI.create({
                  id: 'Title',
                  rank: 1,
                  page: BluMUI.result.Title.state.page,
                  lists: data.data.courseList,
                  totalPages: data.data.totalPages
                },
                  'CreateTableTitle',
                  document.getElementById('list'));
              }
            });
          }
        }
      });
    }
  }
  // <img src="../../imgs/public/red_star.png" />
  create_fuzeren() {
    let fuzeren;
    let mst;

    if (this.props.Rank == 2) {
      if (this.state.master.xm) {
        mst = <div id="master">
          {this.state.master && <span className="green_btn" key={this.state.master.sfrzh}>
            {this.state.master.xm}
            <div className="dt">
              <img src="../../imgs/public/teacher_del.png" onClick={this.del_teacher} />
            </div>
          </span>}
        </div>;
      }
      fuzeren = <div id="fuzeren">
        <div className="list_left">
          <span style={{ color: 'red' }}>*</span><span>课程负责人</span>
        </div>
        <div className="list_right">
          <span className="add_btn" ref="adding_fuzeren">{(this.state.master.xm ? "修改" : "添加") + "负责人"}</span>
          {mst}
        </div>
      </div>;
    } else { fuzeren = null; }
    return fuzeren;
  }

  create_adding_left() {
    let leader = <span><span style={{ color: 'red', position: 'relative', top: '2px' }}>*&nbsp;</span>系部中心主任</span>;
    let jiaoshi = <span>任课教师</span>;
    return (<div className="list_left">
      <span>{this.props.Rank == 1 ? leader : jiaoshi}</span>
    </div>);
  }

  create_adding_right() {
    let teachers = [];
    let end = this.state.teachers.length;
    for (let i = 0; i < end; i++) {
      teachers.push(
        <span className="green_btn" key={this.state.teachers[i].sfrzh}>
          {this.props.Rank == 1 ? this.state.teachers[i].jyszr : this.state.teachers[i].xm}
          <div className="dt">
            <img src="../../imgs/public/teacher_del.png" onClick={this.del_teacher.bind(this, i)} />
          </div>
        </span>
      )
    }

    return (<div className="list_right">
      <span className="add_btn" ref="adding_teachers">{this.props.Rank == 1 ? '添加系部中心主任' : '添加任课教师'}</span>
      <div id="teachers">{teachers}</div>
    </div>);
  }

  create_tdjs() {
    if (this.props.Rank != 3) return;
    return (<div id="tdjs">
      <span style={{ color: 'red' }}>*</span><span style={{ marginLeft: 5 }}>团队介绍</span>
      <textarea name="TDJS" id="tdjs_text" cols="30" rows="10" ref='Js'></textarea>
      <span id="Js_warn" ref='Js_warn' style={{ color: 'red' }}></span>
    </div>);
  }

  //组件第一次渲染后执行的内容
  componentDidMount() {
    // document.getElementById('list').style.minHeight="738px";
    if (this.props.Rank == 3) {
      ajax({
        url: courseCenter.host + 'getTeachingTeamPageMsg',
        data: {
          kcbh: this.props.Kcbh,
          unifyCode: BluMUI.result.user_id
        },
        success: gets => {
          document.getElementById('tdjs_text').value = JSON.parse(gets).data.tdjs;
        }
      });
    }
    let that = this;

    let change = function (dat) {
      that.setState(dat);
    };
    let add_teacher = function (tea) {
      let newTeachers = that.state.teachers.concat(tea);
      let result = [];
      for (let i = 0; i < newTeachers.length; i++) {
        let flag = 0;
        for (let j = 0; j < result.length; j++) {
          if (newTeachers[i].sfrzh == result[j].sfrzh) {
            flag++;
          }
        }
        if (flag == 0) {
          result.push(newTeachers[i]);
        }
      }
      that.setState({ teachers: result });
    }

    if (this.refs.adding_fuzeren) {   //存在按钮的时候才能绑定事件
      this.refs.adding_fuzeren.onclick = function () {
        ReactDOM.render(
          <BlueMUI_CreatePopup Rank={that.props.Rank} Master={true} Title="选择教师" callback={change} />,
          document.getElementById('popup')
        );
      }
    }

    this.refs.adding_teachers.onclick = function () {
      if (that.props.Rank == 1) {
        ReactDOM.render(
          <BlueMUI_CreatePopup Rank={that.props.Rank} Master={false} Title="选择系部中心主任" callback={add_teacher} />,
          document.getElementById('popup')
        );
      } else {
        ReactDOM.render(
          <BlueMUI_CreatePopup Rank={that.props.Rank} Master={false} Title="选择教师" callback={add_teacher} />,
          document.getElementById('popup')
        );
      }
    }
    if (this.props.Rank == 3) {
      this.refs.Js.onchange = e => {
        if (e.target.value === '') {
          this.refs.Js_warn.innerText = '请输入团队介绍！';
        } else {
          this.refs.Js_warn.innerText = '';
        }
      }
    }

  }

  render() {
    return (<div id="adding">
      {this.create_tdjs()}
      {this.create_fuzeren()}
      <div id="down">
        {this.create_adding_left()}
        {this.create_adding_right()}
      </div>
      <div id="opt">
        <span className="caozuo" id="Adding_baocun" ref="save_adding" onClick={this.save_adding} >保存</span>
        <span className="caozuo" id="Adding_fanhui" ref="back" onClick={this.back} >返回</span>
      </div>
    </div>);
  }
}



// class BlueMUI_CreateFanye extends React.Component {
//   constructor(props) {
//     super(props);
//   }

//   create_popup_fanye() {
//     let style={};
//     let fanye=[];
//     let start=1;
//     let end=this.props.pages;
//     let style_on={
//       background:"url('../../imgs/courseAudit/fanye_bg.png')",
//       backgroundRepeat:'no-repeat',
//       backgroundPosition:'5px 5px',
//       color:'#FFF'
//     };
//     if(this.props.pages==0) {
//       return <div></div>;
//     }
//     if(this.props.pages<=7) {
//       for(let i=2;i<this.props.pages;i++) {
//         if(i==this.props.page) {
//           style=style_on;
//         } else {
//           style={};
//         }
//         fanye.push(<li key={i} style={style}>{i}</li>);
//       }
//     } else {
//       if(this.props.page<5) {
//         for(let j=2;j<=6;j++) {
//           if(j==this.props.page) {
//             style=style_on;
//           } else {
//             style={};
//           }
//           fanye.push(<li key={j} style={style}>{j}</li>);
//         }
//         fanye.push(<li key='end' >...</li>);
//       } else if(this.props.page>this.props.pages-4) {
//         for(let k=this.props.pages-5;k<this.props.pages;k++) {
//           if(k==this.props.page) {
//             style=style_on;
//           } else {
//             style={};
//           }
//           fanye.push(<li key={k} style={style}>{k}</li>);
//         }
//         fanye.unshift(<li key='start' >...</li>);
//       } else {
//         for(let l=this.props.page-2;l<=this.props.page+2; l++) {
//           if(l==this.props.page) {
//             style=style_on;
//           } else {
//             style={};
//           }
//           fanye.push(<li key={l} style={style}>{l}</li>);
//         }
//         fanye.unshift(<li key='start' >...</li>);
//         fanye.push(<li key='end' >...</li>);
//       }
//     }
//     if(this.props.page==1) {
//       if(this.props.pages==1) {
//         fanye=[<li key={1} style={style_on} >{1}</li>];
//       } else {
//         fanye.unshift(<li key={1} style={style_on} >{1}</li>);
//         fanye.push(<li key={this.props.pages}>{this.props.pages}</li>);
//       }
//     } else if(this.props.page==this.props.pages) {
//       fanye.unshift(<li key={1}>{1}</li>);
//       fanye.push(<li key={this.props.pages} style={style_on} >{this.props.pages}</li>);
//     } else {
//       fanye.unshift(<li key={1}>{1}</li>);
//       fanye.push(<li key={this.props.pages}>{this.props.pages}</li>);
//     }
//     return(<div className="fanye" id={this.props.id}>
//       <div className="popup_fanye_pre" ref="pre"><img src="../../imgs/courseAudit/fanye_left.png"/></div>
//       <ul ref="popup_fanye">
//         {fanye}
//       </ul>
//       <div className="popup_fanye_next" ref="next"><img src="../../imgs/courseAudit/fanye_right.png"/></div>
//     </div>);
//   }

//   render() {
//     return this.create_popup_fanye();
//   }

// }

class BlueMUI_CreateFanye extends React.Component {
  constructor(props) {
    super(props);
  }

  create_popup_fanye() {
    if (this.props.TP.pages < 1) {
      return null;
    }
    if (this.props.TP.total === 0) {
      return <div style={{ height: '21px', padding: '30px 0' }}></div>;
    }

    let nums = [];
    let start = 1;
    let end = this.props.TP.pages || 1;
    let now = this.props.TP.page || 1;
    let page_on = { color: "#007A51" };

    let change_page = (p) => {
      if (p === now) {
        nums.push(<li key={p} style={page_on}>{p}</li>);
      } else {
        nums.push(<li key={p} onClick={this.fanye.bind(this, p)}>{p}</li>);
      }
    }

    if (end < 1) {
      nums.push(<li key="only" onClick={this.fanye.bind(this, 1)}>1</li>)
    } else if (end <= 5) {
      for (let i = 1; i <= end; i++) {
        change_page(i)
      }
    } else {
      if (now < 3) {
        for (let i = 1; i <= 5; i++) {
          change_page(i)
        }
      } else if (now > end - 3) {
        for (let i = end - 4; i <= end; i++) {
          change_page(i)
        }
      } else {
        for (let i = now - 2; i <= now + 2; i++) {
          change_page(i)
        }
      }
    }

    return (<div className="fanye" id={this.props.id}>
      <span className="total">共{this.props.TP.total >= 0 ? this.props.TP.total : 1}条记录</span>
      <input className="fanye_options fanye_start" type="button" value="首页" onClick={this.fanye.bind(this, now === 1 ? 0 : 1)} />
      <input className="fanye_options fanye_pre" type="button" value="上一页" onClick={this.fanye.bind(this, now === 1 ? 0 : now - 1)} />
      <ul className="fanye_nums">{nums}</ul>
      <input type="text" className="tp" ref="tp" placeholder={`${this.props.TP.page}/${this.props.TP.pages}`} />
      <input className="fanye_options fanye_next" type="button" value="下一页" onClick={this.fanye.bind(this, now === end ? 0 : now + 1)} />
      <input className="fanye_options fanye_end" type="button" value="尾页" onClick={this.fanye.bind(this, now === end ? 0 : end)} />
    </div>);
  }

  fanye(p) {
    if (!this.refs.tp || !this.props.callback) {
      return;
    }
    this.refs.tp.value = null;
    if (p == 0) {
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
    this.refs.tp.onkeydown = (eve) => {
      if (eve.keyCode === 13) {
        let newpage = +eve.target.value;
        if (!isNaN(newpage)) {
          if (newpage >= 1 && newpage <= this.props.TP.pages) {
            this.fanye(newpage);
          } else {
            eve.target.value = null;
          }
        } else {
          eve.target.value = null;
        }
        eve.target.blur();
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.refs.tp) {
      return;
    }

    // 手动跳转翻页
    this.refs.tp.onkeydown = (eve) => {
      if (eve.keyCode === 13) {
        let newpage = +eve.target.value;
        if (!isNaN(newpage)) {
          if (newpage >= 1 && newpage <= this.props.TP.pages) {
            this.fanye(newpage);
          } else {
            eve.target.value = null;
          }
        } else {
          eve.target.value = null;
        }
        eve.target.blur();
      }
    }
  }
}
//tab标签
class BlueMUI_CreateTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Rank: +this.props.role[0].subModule,
    };
    this.show_list = this.show_list.bind(this);
  }

  componentDidMount() {
    //改变第一个tab标签的字体为粗体
    this.refs['Rank-' + this.state.Rank].style.color = '#009361';
    let that = this;
    for (let i = 0; i < this.props.role.length; i++) {
      this.refs['Rank-' + this.props.role[i].subModule].onclick = function (e) {
        document.getElementById('jxtdss').value = '';
        that.setState({ Rank: +that.props.role[i].subModule }, tab_change);
      }
    }

    let tab_change = function () {
      that.props.role.map(e => {
        that.refs['Rank-' + e.subModule].style.color = '#999999'
      });
      that.refs['Rank-' + that.state.Rank].style.color = '#009361';
    }

    /*绑定搜素*/
    document.getElementById('serch_btn').onclick = SERCH;
    document.getElementById('jxtdss').onkeydown = e => {
      if (e.keyCode == 13)
        SERCH();
    };
    function SERCH() {
      ajax({
        url: courseCenter.host + 'CourseMatainMsg',
        data: {
          page: 1,
          count: _count,
          type: that.state.Rank,
          unifyCode: BluMUI.result.user_id,
          selectName: document.getElementById('jxtdss').value
        },
        success: function (get) {
          let datas = JSON.parse(get);
          BluMUI.result.Title.setState({
            lists: datas.data.courseList,
            page: 1,
            total: datas.data.total,
            totalPages: datas.data.totalPages
          });
        }
      });
    }
  }

  show_list() {
    let that = this;
    ajax({
      url: courseCenter.host + 'CourseMatainMsg',
      data: {
        type: that.state.Rank,
        unifyCode: BluMUI.result.user_id,
        page: 1,
        count: _count,
        selectName: document.getElementById('jxtdss').value
      },
      success: function (gets) {
        let datas = JSON.parse(gets);
        if (!BluMUI.result.Title) {
          BluMUI.create({
            id: 'Title',
            rank: that.state.Rank,
            lists: datas.data.courseList,
            page: 1,
            total: datas.data.total,
            totalPages: datas.data.totalPages
          },
            'CreateTableTitle',
            document.getElementById('list'));
        } else {
          BluMUI.result.Title.setState({
            rank: that.state.Rank,
            lists: datas.data.courseList,
            page: 1,
            total: datas.data.total,
            totalPages: datas.data.totalPages
          });
        }
      }
    });
  }

  render() {
    if (this.state.Rank == 1) {
      document.getElementById('serch_title').innerText = '系部中心名称';
      document.getElementById('jxtdss').placeholder = '请输入系部中心名称';
    } else {
      document.getElementById('serch_title').innerText = '课程名称';
      document.getElementById('jxtdss').placeholder = '请输入课程名称';
    }
    let tabs = [];
    this.props.role.map(e => {
      tabs.push(<li key={e.cdxh} ref={'Rank-' + e.subModule}>{e.cdmc}</li>);
      tabs.push(<li key={'line-' + e.cdxh} className='center_line'></li>);
    });
    tabs.pop();
    this.show_list();
    return (<ul ref='tab'>{tabs}</ul>);
  }
}


var BluMUI_M = {
  CreateTableTitle: BlueMUI_CreateThead,
  CreateTableBody: BlueMUI_CreateTbody,
  CreateTab: BlueMUI_CreateTab,
}

var BluMUI = {
  result: {},
  create: function (data, type, elem) {
    var props = data, Blu = BluMUI_M[type];
    this.result[props.id] = ReactDOM.render(<Blu {...props} />, elem);
  }
};

export default BluMUI;
