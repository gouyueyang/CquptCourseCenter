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
                        master={this.master}
                        ref={(ref) => { this.inside = ref }} />

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
        this._reset = this._reset.bind(this);

        this.luhnCheck = this.luhnCheck.bind(this);
        this.CheckBankNo = this.CheckBankNo.bind(this);
        this.checkCardID = this.checkCardID.bind(this);
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
                // var pattern1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/,
                //     pattern2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
                // if (value.length > 0 && !pattern1.test(value) && !pattern2.test(value)) {
                //     warn = '身份证号码格式错误!'
                // }
                warn = this.checkCardID(value);
                break;
            case 'bank':
                // pattern = /^(\d{16}|\d{19})$/;
                // if (value.length > 0 && !pattern.test(value)) {
                //     warn = '银行卡位数错误，应该是16位或者19位'
                // }
                warn = this.CheckBankNo(value);
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
    // checkCardID(sId) {
    //     var iSum = 0;
    //     var info = "";
    //     if (!/^\d{17}(\d|x)$/i.test(sId)) return "你输入的身份证长度或格式错误";
    //     sId = sId.replace(/x$/i, "a");
    //     if (let aCity[parseInt(sId.substr(0, 2))] == null) return "你的身份证地区非法";
    //     let sBirthday = sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2));
    //     var d = new Date(sBirthday.replace(/-/g, "/"));
    //     if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) return "身份证上的出生日期非法";
    //     for (var i = 17; i >= 0; i--) iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11);
    //     if (iSum % 11 != 1) return "你输入的身份证号非法";
    //     return '';//aCity[parseInt(sId.substr(0,2))]+","+sBirthday+","+(sId.substr(16,1)%2?"男":"女")
    // }
    checkCardID(id) {
        this.isOK = false;
        this.error = '';

        if (!id || typeof (id) != 'string' || id.length != 15 && id.length != 18
            || !id.match(/^[0-9]{15}$/) && !id.match(/^[0-9]{17}[0-9xX]$/) || "111111111111111" == id) {
            this.error = '输入不是15位或者18位有效字符串';
            return this.error;
        }

        var area = {
            11 : "北京",
            12 : "天津",
            13 : "河北",
            14 : "山西",
            15 : "内蒙古",
            21 : "辽宁",
            22 : "吉林",
            23 : "黑龙江",
            31 : "上海",
            32 : "江苏",
            33 : "浙江",
            34 : "安徽",
            35 : "福建",
            36 : "江西",
            37 : "山东",
            41 : "河南",
            42 : "湖北",
            43 : "湖南",
            44 : "广东",
            45 : "广西",
            46 : "海南",
            50 : "重庆",
            51 : "四川",
            52 : "贵州",
            53 : "云南",
            54 : "西藏",
            61 : "陕西",
            62 : "甘肃",
            63 : "青海",
            64 : "宁夏",
            65 : "新疆",
            71 : "台湾",
            81 : "香港",
            82 : "澳门",
            91 : "国外"
    };

this.areaName = area[id.substr(0, 2)];
if (!this.areaName) {
    this.error = '前2位不是有效的行政区划代码';
    return this.error;
}
;

if (id.length == 15) {
    this.year = parseInt(id.substr(6, 2));
    this.month = parseInt(id.substr(8, 2));
    this.day = parseInt(id.substr(10, 2));
}
else {
    this.year = parseInt(id.substr(6, 4));
    this.month = parseInt(id.substr(10, 2));
    this.day = parseInt(id.substr(12, 2));
}

this.error = '出生日期不正确';
if (this.month > 12) {
    return this.error;
}
if (this.day > 31) {
    return this.error;
}
// February can't be greater than 29 (leap year calculation comes later)
if ((this.month == 2) && (this.day > 29)) {
    return this.error;
}
// check for months with only 30 days
if ((this.month == 4) || (this.month == 6) || (this.month == 9)
    || (this.month == 11)) {
    if (this.day > 30) {
        return this.error;
    }
}
// if 2-digit year, use 50 as a pivot date
if (this.year < 100) {
    this.year += 1900;
}
if (this.year > 9999) {
    return this.error;
}
// check for leap year if the month and day is Feb 29
if ((this.month == 2) && (this.day == 29)) {
    var div4 = this.year % 4;
    var div100 = this.year % 100;
    var div400 = this.year % 400;
    // if not divisible by 4, then not a leap year so Feb 29 is invalid
    if (div4 != 0) {
        return this.error;
    }
    // at this point, year is divisible by 4. So if year is divisible by
    // 100 and not 400, then it's not a leap year so Feb 29 is invalid
    if ((div100 == 0) && (div400 != 0)) {
        return this.error;
    }
}
this.yearStr = '' + this.year;
this.monthStr = (this.month < 10 ? '0' : '') + this.month;
this.dayStr = (this.day < 10 ? '0' : '') + this.day;

// date is valid
var birthDay = new Date(this.year, this.month - 1, this.day);

if (birthDay - new Date() >= 0 || birthDay - new Date(1850, 1, 1) <= 0) {
    return this.error;
}

this.error = '';
var lastNum = id.length == '15' ? id.substr(14, 1) : id.substr(16, 1);
this.sex = (lastNum == '1' || lastNum == '3' || lastNum == '5'
    || lastNum == '7' || lastNum == '9') ? '1' : '0';
this.sexName = this.sex == '1' ? '男' : '女';
if (id.length == '15') {
    this.isOK = '';
    return this.isOK;
}

var getLastValidationLetter = function (str) {
    var strArray = new Array(17);
    // 存储身份证的前17为数字
    var Wi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2,
        1);
    // 表示第i位置上的加权因子
    var Y = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
    // 校验码值
    var S = 0;
    // 十七位数字本体码加权求和
    var jym = 0;
    // 校验码

    for (var i = 16;
        i >= 0;
        i -= 1) {
        strArray[i] = Number(str.charAt(i));
    }

    for (var j = 16;
        j >= 0;
        j -= 1) {
        S += strArray[j] * Wi[j];
    }

    jym = S % 11;
    return Y[jym];
};

if (id.substr(17, 1) != getLastValidationLetter(id.substr(0, 17))) {
    this.error = '18位身份证编码最后一位校验码不正确';
    return false;
}

this.isOK = true;
return true;
    }
//银行卡号Luhn校验算法
//luhn校验规则：16位银行卡号（19位通用）: 
//1.将未带校验位的 15（或18）位卡号从右依次编号 1 到 15（18），位于奇数位号上的数字乘以 2。
//2.将奇位乘积的个十位全部相加，再加上所有偶数位上的数字。
//3.将加法和加上校验位能被 10 整除。

//bankno为银行卡号
luhnCheck(bankno) {
    var lastNum = bankno.substr(bankno.length - 1, 1);//取出最后一位（与luhn进行比较）

    var first15Num = bankno.substr(0, bankno.length - 1);//前15或18位
    var newArr = new Array();
    for (var i = first15Num.length - 1; i > -1; i--) {    //前15或18位倒序存进数组
        newArr.push(first15Num.substr(i, 1));
    }
    var arrJiShu = new Array();  //奇数位*2的积 <9
    var arrJiShu2 = new Array(); //奇数位*2的积 >9

    var arrOuShu = new Array();  //偶数位数组
    for (var j = 0; j < newArr.length; j++) {
        if ((j + 1) % 2 == 1) {//奇数位
            if (parseInt(newArr[j]) * 2 < 9)
                arrJiShu.push(parseInt(newArr[j]) * 2);
            else
                arrJiShu2.push(parseInt(newArr[j]) * 2);
        }
        else //偶数位
            arrOuShu.push(newArr[j]);
    }

    var jishu_child1 = new Array();//奇数位*2 >9 的分割之后的数组个位数
    var jishu_child2 = new Array();//奇数位*2 >9 的分割之后的数组十位数
    for (var h = 0; h < arrJiShu2.length; h++) {
        jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
        jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
    }

    var sumJiShu = 0; //奇数位*2 < 9 的数组之和
    var sumOuShu = 0; //偶数位数组之和
    var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
    var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
    var sumTotal = 0;
    for (var m = 0; m < arrJiShu.length; m++) {
        sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
    }

    for (var n = 0; n < arrOuShu.length; n++) {
        sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
    }

    for (var p = 0; p < jishu_child1.length; p++) {
        sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
        sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
    }
    //计算总和
    sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);

    //计算luhn值
    var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
    var luhn = 10 - k;

    if (lastNum == luhn) {
        //console.log("验证通过");
        return true;
    } else {
        //"银行卡号必须符合luhn校验"
        return false;
    }
}

//检查银行卡号
CheckBankNo(bankno) {
    var msg = '';
    var bankno = bankno.replace(/\s/g, '');
    if (bankno == "") {
        msg = "请填写银行卡号";
        return msg;
    }
    if (bankno.length < 16 || bankno.length > 19) {
        msg="银行卡号长度必须在16到19之间";
        return msg;
    }
    var num = /^\d*$/;//全数字
    if (!num.exec(bankno)) {
        msg = "银行卡号必须全为数字";
        return msg;
    }
    //开头6位
    var strBin = "10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";
    if (strBin.indexOf(bankno.substring(0, 2)) == -1) {
        msg = "银行卡号开头6位不符合规范";
        return msg;
    }
    //Luhn校验
    if (!this.luhnCheck(bankno)) {
        msg = "银行卡号必须符合luhn校验";
        return msg;
    }
    return msg;
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
_reset() {
    this.setState({
        account: '',     //账号
        accountWarn: '',
        name: '',           //姓名
        nameWarn: '',
        sex: '男',            //性别
        dw: '',         //工作单位
        dwWarn: '',
        zc: '',             //职称
        zcWarn: '',
        zy: '',        //专业类
        zyWarn: '',
        email: '',
        emailWarn: '',
        tel: '',
        telWarn: '',
        uid: '',          //身份证号
        uidWarn: '',
        bank: '',             //银行卡号
        bankWarn: '',
        bankname: '',           //银行名
        banknameWarn: ''
    })
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
                    <input type="text" className="text" value={this.state.uid} onInput={this._input.bind(this, 'uid', '身份证号')} /><br />
                    <span className="warn" style={{ 'marginLeft': 130 + 'px' }}>{this.state.uidWarn}</span>
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
                    <input type="text" className="text" value={this.state.bank} onInput={this._input.bind(this, 'bank', '银行卡号')} /><br />

                    <span className="warn" style={{ 'marginLeft': 130 + 'px' }}>{this.state.bankWarn}</span>
                </div>
                <div className="inputWarp ">
                    <span className="extwarn">（注：请确保姓名、身份证、银行卡开户人为同一人）</span>
                </div>
            </div>
           <p className="tips">注意：校外专家初始密码为：123456</p>
            <div className='btnWarp'>
                <button className="btn choose" onClick={this._save}>添加</button>
                <button className="btn" onClick={this._reset}>重置</button>
                <button className="btn" onClick={() => { location = './zjkgl.html' }}>返回</button>
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
            select: [],
            selectZj: [],
        };
        this.selectAll = this.selectAll.bind(this);
        this.select = this.select.bind(this);
        this.creat_list = this.creat_list.bind(this);
        this.refresh = this.refresh.bind(this);
        this.add = this.add.bind(this);
        this.key = this.key.bind(this);
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
                    select: Array.apply(null, Array(this.state.list.length)).map(() => true)
                })
            } else {
                this.setState({
                    selectZj: sfrzhArr,
                    select: Array.apply(null, Array(this.state.list.length)).map(() => false)
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
            if (this.state.selectZj.length == this.state.list.length) {
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
    //回车搜索
    key(event) {
        if (event.keyCode == "13") {//keyCode=13是回车键；数字不同代表监听的按键不同
            this.refresh(1);
        }
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
                page: page || 1,
                count: _Count
            },
            success: (gets) => {
                let datas = JSON.parse(gets);
                this.setState({
                    list: datas.data.zjList,
                    page: page,
                    pages: datas.data.totalPages,
                    rows: datas.data.total,
                    selectAll: false,
                    select: Array.apply(null, Array(datas.data.zjList.length)).map(() => false),
                    selectZj: [],
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
        if (this.state.selectZj.length > 0) {
            this.addMaster(this.state.selectZj);
        } else {
            alert("未选勾选专家，无法添加！");
        }

    }

    render() {
        return (
            <div className="inside">
                <div className="header">

                    <div className="searchWarp"><span className="title" style={{ float: 'left' }}>所属单位:</span>
                        <div className="inputWarp"><input type="text" defaultValue={this.state.college} onInput={(eve) => { this.setState({ college: eve.target.value }); }} onKeyDown={this.key} /><button onClick={this.refresh.bind(this, 1)}>搜索</button></div>
                    </div>
                    <div className="searchWarp"><span className="title" style={{ float: 'left' }}>教师姓名:</span>
                        <div className="inputWarp"><input type="text" defaultValue={this.state.teaName} onInput={(eve) => { this.setState({ teaName: eve.target.value }); }} onKeyDown={this.key} /><button onClick={this.refresh.bind(this, 1)}>搜索</button></div>
                    </div>
                </div>
                <div className="ListWarp">
                    <ul className="headUL">
                        <li className="ra">
                            <div className={this.state.selectAll ? "Radio-selected" : "Radio"} onClick={this.selectAll}></div>
                        </li>
                        <li className="xm">姓名</li>
                        <li className="xy">单位</li>
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
        // ajax({
        //     url: courseCenter.host + "getCollege",
        //     data: {
        //         unifyCode: getCookie("userId")
        //     },
        //     success: (gets) => {
        //         let datas = JSON.parse(gets);
        //         if (datas.meta.result == 100) {
        //             datas.data.map((e, index) => {
        //                 this.refs.college.innerHTML += `<option value=${e.kkxymc}>${e.kkxymc}</option>`;
        //             });
        //         }
        //     }
        // });
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