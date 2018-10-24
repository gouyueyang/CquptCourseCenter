import React from 'react';
import ReactDOM from 'react-dom';


const ajax = require('../post_ajax.js');
const Fanye = require('../turnPage.js');
const _Count = 8;

class AddEditor extends React.Component {
    constructor(props) {
        super(props);
        this.userId = this.props.userId;
        this.isEditor = this.props.isEditor;
        this.master = this.props.master;
        this.outMaster = this.props.outMaster;
        this.state = {
            zjType: "校外专家",
        };
        this.changeSelect = this.changeSelect.bind(this);
    }
    changeSelect(zj) {
        this.setState({
            zjType: zj,
        });
    }
    render() {
        return (
            <div className="AddEditor">
                {this.isEditor == false &&
                    <div>
                        <p className="addTitle">添加专家</p>
                        <div className="radioWarp">
                            <div className="radio"><span className={this.state.zjType == '校外专家' ? "icon selected" : "icon"} onClick={this.changeSelect.bind(this, '校外专家')}></span><span className="text">校外专家</span></div>
                            <div className="radio"><span className={this.state.zjType == '校内专家' ? "icon selected" : "icon"} onClick={this.changeSelect.bind(this, '校内专家')}></span><span className="text">校内专家</span></div>
                        </div>
                    </div>
                }

                {this.state.zjType == '校外专家' &&
                    <FromWarp
                        userId={this.userId}
                        isEditor={this.isEditor}
                        outMaster={this.outMaster}
                    />
                }
                {this.state.zjType == '校内专家' &&
                    <Inside userId={this.userId}
                        isEditor={this.isEditor}
                        master={this.master} />
                }
            </div>
        );
    }
}

class FromWarp extends React.Component {
    constructor(props) {
        super(props);
        this.userId = this.props.userId;
        this.isEditor = this.props.isEditor;
        this.outMaster = this.props.outMaster;
        this.state = {
            curIndex: 1,
            setArray: [
                {
                    name: 'account',
                    title: '账号'
                },

                {
                    name: 'name',
                    title: '姓名'
                },
                {
                    name: 'zc',
                    title: '职称'
                },
                {
                    name: 'zy',
                    title: '专业类'
                },
                {
                    name: 'email',
                    title: '邮箱'
                },
                {
                    name: 'tel',
                    title: '手机号码'
                },
                {
                    name: 'uid',
                    title: '开户银行'
                },
                {
                    name: 'bank',
                    title: '银行卡号'
                }
            ],


            account: this.outMaster.account || '',     //账号
            accountWarn: '',
            name: this.outMaster.name || '',           //姓名
            nameWarn: '',
            sex: this.outMaster.sex || '男',            //性别
            dw: this.outMaster.department || '',         //工作单位
            dwWarn: '',
            zc: this.outMaster.title || '',             //职称
            zcWarn: '',
            zy: this.outMaster.department || '',        //专业类
            zyWarn: '',
            email: this.outMaster.email || '',
            emailWarn: '',
            tel: this.outMaster.telePhone || '',
            telWarn: '',
            uid: this.outMaster.identityId || '',          //身份证号
            uidWarn: '',
            bank: this.outMaster.bankId || '',             //银行卡号
            bankWarn: '',
            bankname: this.outMaster.bank || '',           //银行名
            banknameWarn: ''
        }
        this._input = this._input.bind(this);
        this._radio = this._radio.bind(this);
        this._save = this._save.bind(this);
        this._check = this._check.bind(this);
    }
    _input(name, title, e) {

        var value = e.target.value;
        this._check(name, value, true, title);

    }
    _check(name, value, flag, title) {
        var warn = '',
            result = 1,
            pattern = null,
            newData = {};
        if (flag)
            newData[name] = value;
        switch (name) {
            case 'zy':
            case 'zc':
            case 'dw':
            case 'name':
                if (value.length == 0) {
                    warn = title + '不能为空';
                }
                break;
            case 'email':
                pattern = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
                if (!pattern.test(value)) {
                    warn = '邮箱格式错误';
                } else if (value.length == 0) {
                    warn = title + '不能为空';
                }
                break;
            case 'tel':
                var pattern = /^1[0-9]{10}$/;
                if (value.length == 0) {
                    warn = title + '不能为空';
                } else if (!pattern.test(value)) {
                    warn = '手机号格式错误!';
                }
                break;
            case 'uid':
                var pattern1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/,
                    pattern2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
                if (value.length > 0 && !pattern1.test(value) && !pattern2.test(value)) {
                    warn = '身份证号码格式错误!'
                }
                break;
            case 'bank':
                pattern = /^(\d{16}|\d{19})$/;
                if (value.length > 0 && !pattern.test(value)) {
                    warn = '银行卡位数错误，应该是16位或者19位'
                }
                break;
            case 'account':
                if (value.length < 5) {
                    warn = '账号长度至少为6位';
                }
                else if (value.length === 0) {
                    warn = '账号不能为空'
                }
                break;
        }
        if (warn.length > 0)
            result = 0;
        newData[name + 'Warn'] = warn;
        this.setState(newData);
        return result;
    }

    _radio(newsex) {
        this.setState({
            sex: newsex
        });
    }
    _save() {
        var that = this;
        var setArray = that.state.setArray,
            len = setArray.length,
            result = 0,
            title = '',
            key = '';
        for (var i = 0; i < len; i++) {
            key = setArray[i].name;
            title = setArray[i].title;
            result += that._check(key, that.state[key], false, title);
        }
        if (result === len) {
            var data = {
                userId: that.state.account,
                userName: that.state.name,
                sex: that.state.sex,
                department: that.state.dw,
                title: that.state.zc,
                research: that.state.zy,
                identityId: that.state.uid,
                bank: that.state.bankname,
                account: that.state.bankAccount,
                telePhone: that.state.tel,
                email: that.state.email,
            };
            that.props.outMaster.ajax(data, that.props.isEditor);
        } else {

        }
    }
    render() {
        return (
            <div className="formWarp">
                <div className="inputGroup">
                    <div className="inputWarp">
                        <span className="title must" >
                            <span className="left">账</span>
                            <span className="right">号</span>
                        </span>
                        <input type="text" className="text" value={this.state.account} onInput={this._input.bind(this, 'account', '账号')} />
                        <span className="warn">{this.state.accountWarn}</span>
                    </div>
                    <div className="inputWarp">
                        <span className="title must" >
                            <span className="left">姓</span>
                            <span className="right">名</span>
                        </span>
                        <input type="text" className="text" value={this.state.name} onInput={this._input.bind(this, 'name', '姓名')} />
                        <span className="warn">{this.state.nameWarn}</span>
                    </div>
                    <div className="inputWarp " >
                        <span className="title must" >
                            <span className="left">姓</span>
                            <span className="right">别</span>
                        </span>
                        <div className="sexRadioWarp">
                            <span className={this.state.sex == '男' ? 'sexRadio sexOn' : 'sexRadio'} onClick={this._radio.bind(this, '男')}></span>
                            <span className="sexRadioTitle">男</span>
                            <span className={this.state.sex == '女' ? 'sexRadio sexOn' : 'sexRadio'} onClick={this._radio.bind(this, '女')}></span>
                            <span className="sexRadioTitle" style={{ marginLeft: 10 }}>女</span>
                        </div>
                    </div>
                    <div className="inputWarp" >
                        <span className="title must" >
                            工作单位
								</span>
                        <input type="text" className="text" value={this.state.dw} onInput={this._input.bind(this, 'dw', '工作单位')} />
                        <span className="warn">{this.state.dwWarn}</span>
                    </div>
                    <div className="inputWarp " >
                        <span className="title must" >
                            <span className="left">职</span>
                            <span className="right">称</span>
                        </span>
                        <input type="text" className="text" value={this.state.zc} onInput={this._input.bind(this, 'zc', '职称')} />
                        <span className="warn">{this.state.zcWarn}</span>
                    </div>
                    <div className="inputWarp" >
                        <span className="title must" >
                            专业类
								</span>
                        <input type="text" className="text" value={this.state.zy} onInput={this._input.bind(this, 'zy', '专业类')} />
                        <span className="warn">{this.state.zyWarn}</span>
                    </div>
                    <div className="inputWarp " >
                        <span className="title must" >
                            电子邮箱
								</span>
                        <input type="text" className="text" value={this.state.email} onInput={this._input.bind(this, 'email', '电子邮箱')} />
                        <span className="warn">{this.state.emailWarn}</span>
                    </div>
                    <div className="inputWarp" >
                        <span className="title must" >
                            手机号码
								</span>
                        <input type="text" className="text" value={this.state.tel} onInput={this._input.bind(this, 'tel', '手机号码')} />
                        <span className="warn">{this.state.telWarn}</span>
                    </div>
                    <div className="inputWarp" >
                        <span className="title" >
                            身份证号
								</span>
                        <input type="text" className="text" value={this.state.uid} onInput={this._input.bind(this, 'uid', '身份证号')} />
                        <span className="warn">{this.state.uidWarn}</span>
                    </div>
                    <div className="inputWarp" >
                        <span className="title" >
                            开户银行
								</span>
                        <input type="text" className="text" value={this.state.bankname} onInput={this._input.bind(this, 'bankname', '银行名称')} />
                        <span className="warn">{this.state.banknameWarn}</span>
                    </div>
                    <div className="inputWarp">
                        <span className="title" >
                            银行卡号
								</span>
                        <input type="text" className="text" value={this.state.bank} onInput={this._input.bind(this, 'bank', '银行卡号')} />

                        <span className="warn">{this.state.bankWarn}</span>
                    </div>
                    <div className="inputWarp ">
                        <span className="extwarn">（注：请确保姓名、身份证、银行卡开户人为同一人）</span>
                    </div>
                </div>
                <div className='btnWarp'>
                    <button className="btn left" onClick={this._save}>添加</button>
                    <button className="btn right" onClick={() => { location = './zjkgl.html' }}>返回</button>
                </div>

            </div>
        );
    }
}

class Inside extends React.Component {
    constructor(props) {
        super(props);
        this.master = this.props.master;

        this.addMaster = this.master.ajax;
        this.state = {
            teaName: '',
            college: '',
            page: 1,
            pages: 1,
            rows: 0,
            list: [],
            selectAll: false,
            select: Array.apply(null, Array(_Count)).map(() => false),
            selectZj: [],
        };
        this.selectAll = this.selectAll.bind(this);
        this.select = this.select.bind(this);
        this.creat_list = this.creat_list.bind(this);
        this.refresh = this.refresh.bind(this);
        this.add = this.add.bind(this);
    }

    selectAll() {
        let flag = !this.state.selectAll;
        this.setState({
            selectAll: flag
        }, () => {
            let sfrzhArr = [];
            if (this.state.selectAll) {
                this.state.list.forEach((e, index) => {
                    sfrzhArr.push(e.sfrzh);
                });
                this.setState({
                    selectZj: sfrzhArr,
                    select: Array.apply(null, Array(_Count)).map(() => true)
                }, () => {
                    console.log(this.state);
                })
            } else {
                this.setState({
                    selectZj: sfrzhArr,
                    select: Array.apply(null, Array(_Count)).map(() => false)
                }, () => {
                    console.log(this.state);
                })
            }


        });

    }

    select(index, sfrzh) {
        let sfrzhArr = this.state.selectZj || [];

        this.state.select.splice(index, 1, !this.state.select[index]);
        if (this.state.select[index]) {
            sfrzhArr.push(sfrzh);
        } else {
            var order = sfrzhArr.indexOf(sfrzh);
            if (order > -1) {
                sfrzhArr.splice(order, 1);
            }
        }
        this.setState({
            selectZj: sfrzhArr
        }, () => {
            if (this.state.selectZj.length == _Count) {
                this.setState({
                    selectAll: true
                })
            } else {
                this.setState({
                    selectAll: false
                })
            }
        })
    }
    refresh(page) {
        // 未传第二个参数时sets为空对象{}
        // 判断sets是否为空（是否只是翻页）

        ajax({
            url: courseCenter.host + "getJsList",
            data: {
                unifyCode: getCookie("userId"),
                userName: this.state.teaName,
                department: this.state.college,
                page: page,
                count: _Count
            },
            success: (gets) => {
                let datas = JSON.parse(gets);
                this.setState({
                    list: datas.data.zjList,
                    page: page,
                    pages: datas.data.totalPages,
                    rows: datas.data.total
                });
            }
        });
    }

    creat_list() {
        let lists = [];
        this.state.list.forEach((e, index) => {
            let classname = `UL index-${index}`;
            lists.push(
                <ul className={classname} key={index} >
                    <li className="ra">
                        <div className={this.state.select[index] ? "Radio-selected" : "Radio"} onClick={this.select.bind(this, index, e.sfrzh)}></div>

                    </li>
                    <li className="xm">{e.xm}</li>
                    <li className="xy">{e.xymc}</li>
                </ul>
            );
        });
        return (
            <div>
                {lists}
            </div>
        )
    }
    add() {
        this.addMaster(this.state.selectZj);
    }

    render() {
        return (
            <div className="inside">
                <div className="header">
                    <div className="searchWarp"><span className="title" style={{ float: 'left' }}>所属学院:</span>
                        <div className="selectWrap">
                            <select name="college" id="filter_college" ref="college" onChange={(eve) => { this.setState({ college: eve.target.value }) }}>
                                <option value="">请选择学院</option>
                            </select>
                        </div>

                    </div>
                    <div className="searchWarp"><span className="title" style={{ float: 'left' }}>教师姓名:</span>
                        <div className="inputWarp"><input type="text" onBlur={(eve) => { this.setState({ teaName: eve.target.value }); }} /><button onClick={this.refresh.bind(this, 1)}>搜索</button></div>
                    </div>
                </div>
                <div className="ListWarp">
                    <ul className="headUL">
                        <li className="ra">
                            <div className={this.state.selectAll ? "Radio-selected" : "Radio"} onClick={this.selectAll}></div>
                        </li>
                        <li className="xm">姓名</li>
                        <li className="xy">学院</li>
                    </ul>
                    {
                        this.creat_list()
                    }
                </div>
                <div className="fanye">
                    <Fanye This={this}
                        options={{
                            page: this.state.page || 1,
                            pages: this.state.pages || 1,
                            rows: this.state.rows
                        }}
                        callback={this.refresh.bind(this)}
                    />
                </div>

                <div className="btnWarp"><button className="btn left" onClick={this.add}>添加</button><button className="btn right" onClick={() => { location = './zjkgl.html' }}>返回</button>
                </div>
            </div>

        );
    }
    componentDidMount() {
        // 获取学院
        ajax({
            url: courseCenter.host + "getCollege",
            data: {
                unifyCode: getCookie("userId")
            },
            success: (gets) => {
                let datas = JSON.parse(gets);
                if (datas.meta.result == 100) {
                    datas.data.map((e, index) => {
                        this.refs.college.innerHTML += `<option value=${e.kkxymc}>${e.kkxymc}</option>`;
                    });
                }
            }
        });
        this.refresh(1);
    }
}

var BluMUI_M = {
    AddEditor: AddEditor
};
var BluMUI = {
    result: {},
    create: function (data, type, elem) {
        var props = data,
            Blu = BluMUI_M[type];
        this.result[props.id] = ReactDOM.render(
            <Blu {...props} />,
            elem
        );
    }
};
export default BluMUI;