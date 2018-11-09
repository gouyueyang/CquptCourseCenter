import React from 'react';
import ReactDOM from 'react-dom';

const ajax = require('../post_ajax.js');
class BluMUI_NavList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			items: this.props.items,
			index: this.props.index
		}
		this._onClick = this._onClick.bind(this);
	}
	_onClick(index) {
		var that = this;
		return function () {
			that.setState(
				{
					index: index
				}
			)
			that.props.callback(that.state.items[index]);
		}
	}
	_createLi() {
		var result = [],
			i,
			len;
		for (i = 0, len = this.state.items.length; i < len; i++) {
			result.push(
				<li key={i}
					className={this.state.index == i ? 'selected' : ''}
					onClick={this._onClick(i)}
					data-key={i}>
					<a>{this.state.items[i]}</a>
				</li>
			);
		}
		return result;
	}
	render() {
		return (
			<ul id={this.props.id} className={"BluMUI_NavList " + this.props.extClass}>
				{this._createLi()}
			</ul>
		)
	}
}
class BluMUI_Set extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			curIndex: 1,
			keyArray: ['curKeyWord', 'newKeyWord', 'newKeyWordSure'],
			setArray: [
				{
					name: 'sex',
					title: '性别'
				},
				{
					name: 'name',
					title: '姓名'
				},
				{
					name: 'dw',
					title: '工作单位'
				},
				{
					name: 'zc',
					title: '职称'
				},
				{
					name: 'zy',
					title: '学科领域'
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

			curKeyWord: this.props.curKeyWord || '',
			curKeyWordWarn: '',
			newKeyWord: this.props.newKeyWord || '',
			newKeyWordWarn: '密码长度至少为6位',
			newKeyWordSure: this.props.newKeyWordSure || '',
			newKeyWordSureWarn: '请在自再次输入新密码',
			account: this.props.account || '',     //账号
			sex: this.props.sex || '男',
			name: this.props.name || '',
			dw:this.props.department || '',
			nameWarn: '',
			zc: this.props.zc || '',
			zcWarn: '',
			zy: this.props.zy || '',
			zyWarn: '',
			email: this.props.email || '',
			emailWarn: '',
			tel: this.props.tel || '',
			telWarn: '',
			uid: this.props.uid || '',
			uidWarn: '',
			bank: this.props.bank || '',
			bankWarn: '',
			bankname: this.props.bankname || '',
			banknameWarn: ''
		}
		this._input = this._input.bind(this);
		this._radio = this._radio.bind(this);
		this._save = this._save.bind(this);
		this._check = this._check.bind(this);
	}
	_input(name, title) {
		var that = this;
		return function (e) {
			var value = e.target.value;
			that._check(name, value, true, title);
		}
	}
	_check(name, value, flag, title) {
		var warn = '',
			result = 1,
			pattern = null,
			newData = {};
		if (flag)
			newData[name] = value;
		switch (name) {
			case 'dw':
			case 'name':
			case 'zy':
			case 'zc':
				if (value.length == 0) {
					warn = title + '不能为空';
				}
				break;
			case 'email':
				pattern = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
				if (value.length == 0) {
					warn = title + '不能为空';
				} else if (!pattern.test(value)) {
					warn = '邮箱格式错误';
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
				// 	pattern2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
				// if (value.length > 0 && !pattern1.test(value) && !pattern2.test(value)) {
				// 	warn = '身份证号码格式错误!'
				// }
				warn = this.checkCardID(value);
				break;
			case 'bank':
				// pattern = /^(\d{16}|\d{19})$/;
				// if (value.length > 0 && !pattern.test(value)) {
				// 	warn = '银行卡位数错误，应该是16位或者19位'
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
			case 'curKeyWord': {
				if (value.length === 0) {
					warn = '密码不能为空!';
				}
				break;
			}
			case 'newKeyWord':
				if (value.length < 6) {
					warn = '密码长度至少为6位';
				}
				else if (value.length === 0) {
					warn = '密码不能为空!';
				}
				break;
			case 'newKeyWordSure':
				if (value.length == 0) {
					warn = '请再次输入新密码'
				} else if (value !== this.state.newKeyWord) {
					warn = '新密码不一致';
				}
				break;
		}
		if (warn.length > 0)
			result = 0;
		newData[name + 'Warn'] = warn;
		this.setState(newData);
		return result;
	}

	checkCardID(id) {
		this.isOK = false;
		this.error = '';

		if (id == '') {
			return this.error;
		}
		if (!id || typeof (id) != 'string' || id.length != 15 && id.length != 18
			|| !id.match(/^[0-9]{15}$/) && !id.match(/^[0-9]{17}[0-9xX]$/) || "111111111111111" == id) {
			this.error = '输入不是15位或者18位有效字符串';
			return this.error;
		}


		var area = {
			11: "北京",
			12: "天津",
			13: "河北",
			14: "山西",
			15: "内蒙古",
			21: "辽宁",
			22: "吉林",
			23: "黑龙江",
			31: "上海",
			32: "江苏",
			33: "浙江",
			34: "安徽",
			35: "福建",
			36: "江西",
			37: "山东",
			41: "河南",
			42: "湖北",
			43: "湖南",
			44: "广东",
			45: "广西",
			46: "海南",
			50: "重庆",
			51: "四川",
			52: "贵州",
			53: "云南",
			54: "西藏",
			61: "陕西",
			62: "甘肃",
			63: "青海",
			64: "宁夏",
			65: "新疆",
			71: "台湾",
			81: "香港",
			82: "澳门",
			91: "国外"
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
			return msg;
		}
		if (bankno.length < 16 || bankno.length > 19) {
			msg = "银行卡号长度必须在16到19之间";
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

	_radio(sex) {
		var that = this;
		return function () {
			that.setState({
				sex: sex
			})
		}
	}
	_save(type) {
		var that = this;
		if (type === 1) {
			return function () {
				var keyArray = that.state.keyArray,
					len = keyArray.length,
					result = 0,
					key = '';
				for (var i = 0; i < len; i++) {
					key = keyArray[i];
					result += that._check(key, that.state[key], false);
				}
				if (result === len) {
					var data = {
						oldPassWord: that.state.curKeyWord,
						newPassWord: that.state.newKeyWord
					};
					that.props.ajax(data, 1);
				}
			}
		}
		else {
			return function () {
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
						sex: that.state.sex,
						userId: that.state.account,
						department: that.state.dw,
						title: that.state.zc,
						research: that.state.zy,
						bank: that.state.bankname,
						identityId: that.state.uid,
						account: that.state.bank,
						telePhone: that.state.tel,
						email: that.state.email,
						userName: that.state.name
					};
					that.props.ajax(data, 0);
				} else {

				}
			}
		}
	}
	render() {
		return (
			<div id="mySET">
				{
					this.state.curIndex === 0 &&
					<div id="myself">
						<div style={{ overflow: 'hidden' }}>
							<div className="inputWarp" style={{ marginTop: 58 }}>
								<span className="title must" >
									<span className="left">账</span>
									<span className="right">号</span>
								</span>
								<input type="text" className="text" disabled value={this.state.account} />
								<span className="warn"></span>
							</div>
							<div className="inputWarp leftWarp" style={{ marginTop: 58 }}>
								<span className="title must" >
									<span className="left">姓</span>
									<span className="right">名</span>
								</span>
								<input type="text" className="text" value={this.state.name} onInput={this._input('name', '姓名')} />
								<span className="warn">{this.state.nameWarn}</span>
							</div>
							<div className="inputWarp" >
								<span className="title must" >
									<span className="left">性</span>
									<span className="right">别</span>
								</span>
								<div className="radioWarp">
									<span className="radioTitle">男</span>
									<span className={this.state.sex == '男' ? 'radio on' : 'radio'} onClick={this._radio('男')}></span>
									<span className="radioTitle" style={{ marginLeft: 10 }}>女</span>
									<span className={this.state.sex == '女' ? 'radio on' : 'radio'} onClick={this._radio('女')}></span>
								</div>
							</div>
							<div className="inputWarp leftWarp" >
								<span className="title must" >
									工作单位
								</span>
								<input type="text" className="text" value={this.state.dw} onInput={this._input('dw', '工作单位')} />
								<span className="warn">{this.state.dwWarn}</span>
							</div>
							<div className="inputWarp " >
								<span className="title must" >
									电子邮箱
								</span>
								<input type="text" className="text" value={this.state.email} onInput={this._input('email', '电子邮箱')} />
								<span className="warn">{this.state.emailWarn}</span>
							</div>
							<div className="inputWarp leftWarp" >
								<span className="title must" >
									手机号码
								</span>
								<input type="text" className="text" value={this.state.tel} onInput={this._input('tel', '手机号码')} />
								<span className="warn">{this.state.telWarn}</span>
							</div>
							<div className="inputWarp " >
								<span className="title must" >
									<span className="left">职</span>
									<span className="right">称</span>
								</span>
								<input type="text" className="text" value={this.state.zc} onInput={this._input('zc', '职称')} />
								<span className="warn">{this.state.zcWarn}</span>
							</div>
							<div className="inputWarp leftWarp" >
								<span className="title must" >
									学科领域
								</span>
								<input type="text" className="text" value={this.state.zy} onInput={this._input('zy', '学科领域')} />
								<span className="warn">{this.state.zyWarn}</span>
							</div>

							<div className="inputWarp" >
								<span className="title" >
									身份证号
								</span>
								<input type="text" className="text" value={this.state.uid} onInput={this._input('uid')} />
								<span className="warn">{this.state.uidWarn}</span>
							</div>
							<div className="inputWarp leftWarp" >
								<span className="title" >
									开户银行
								</span>
								<input type="text" className="text" value={this.state.bankname} onInput={this._input('bankname')} />
								<span className="warn">{this.state.banknameWarn}</span>
							</div>
							<div className="inputWarp " style={{ width: 730 }}>
								<span className="title" >
									银行卡号
								</span>
								<input type="text" className="text" value={this.state.bank} onInput={this._input('bank')} />
								<span className="extwarn">（注：请确保姓名、身份证、银行卡开户人为同一人）</span>
								<span className="warn">{this.state.bankWarn}</span>
							</div>
						</div>
						<button onClick={this._save(0)}>保存</button>
					</div>
				}
				{
					this.state.curIndex === 1 &&
					<div id="keyModify">
						<div className="inputWarp" style={{ marginTop: 74 }}>
							<span className="title">当前密码</span>
							<input type="password" className="text" onInput={this._input('curKeyWord')} />
							<span className="warn">{this.state.curKeyWordWarn}</span>
						</div>
						<div className="inputWarp">
							<span className="title">新密码</span>
							<input onInput={this._input('newKeyWord')} type="password" className="text" />
							<span className="warn">{this.state.newKeyWordWarn}</span>
						</div>
						<div className="inputWarp">
							<span className="title">新密码确认</span>
							<input onInput={this._input('newKeyWordSure')} type="password" className="text" />
							<span className="warn">{this.state.newKeyWordSureWarn}</span>
						</div>
						<button onClick={this._save(1)}>保存</button>
					</div>
				}

			</div>
		)
	}
	componentDidMount() {
		ajax({
			url: courseCenter.host + "getZj",
			data: {
				unifyCode: getCookie("userId"),
				userId: this.props.userId
			},
			success: (gets) => {
				let datas = JSON.parse(gets);
				let Data = datas.data;
				if (datas.meta.result == 100) {
					if (Data[0]) {
						let data = Data[0];
						this.setState({
							account: data.id,
							name: data.xm,
							sex: data.xb,
							dw: data.dw,
							zc: data.zc,
							zy: data.xkly,
							email: data.dzyx,
							tel: data.lxdh,
							uid: data.sfzh,
							bankname: data.khyh,
							bank: data.yhkh,
						});
					}
				}
			}
		});
	}
}
class BluMUI_UserLoginState extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			userListShow: false,
			right: this.props.right,
			isLogin: this.props.isLogin
		}
		this._onClick = this._onClick.bind(this);
		this._show = this._show.bind(this);
		this._noShow = this._noShow.bind(this);
	}
	_onClick(value) {
		var that = this;
		return function () {
			that.props.callback(value, that);
		}
	}
	_isShowVisit() {
		var result = (
			<span className="loginNum">
				{this.props.loginNumText + this.props.loginNum}
			</span>
		)
		return result;
	}
	_createFunc() {
		var defaultModule = this.props.defaultFunc,
			t,
			i,
			result = [],
			len,
			moduleToURL = this.props.moduleToURL;
		if (this.state.isLogin) {
			var funcMoulde = this.props.funcName;
			for (i = 0, len = funcMoulde.length; i <= len; i++) {
				if (moduleToURL[funcMoulde[i]]) {
					result.push(
						<a key={i} href={moduleToURL[funcMoulde[i]].url} target={moduleToURL[funcMoulde[i]].openType}>
							<li >
								{funcMoulde[i]}
							</li>
						</a>
					);
				} else {
					result.push(
						<li key={i}>
							{funcMoulde[i]}
						</li>
					);
				}
			}
			for (t = i, len = i + defaultModule.length; t < len; t++) {
				result.push(
					<a key={t} href={moduleToURL[defaultModule[t - i]].url} target={moduleToURL[defaultModule[t - i]].openType}>
						<li >
							{defaultModule[t - i]}
						</li>
					</a>
				)
			}
			result.push(<hr key={t}></hr>);
		} else {
			for (t = 0, len = defaultModule.length; t < len; t++) {
				result.push(
					<a key={t} href={moduleToURL[defaultModule[t]].url} target={moduleToURL[defaultModule[t]].openType}>
						<li >
							{defaultModule[t]}
						</li>
					</a>
				)
			}
			result.push(<hr key={t}></hr>);
		}
		return result.reverse();
	}
	_show() {
		this.setState((prevState, props) => ({
			userListShow: !prevState.userListShow
		}))
	}
	_noShow(text) {
		var that = this;
		return function () {
			that.props.callback(text);
		}
	}
	_isLogin() {
		if (this.state.isLogin) {
			var result = (
				<div className="userInf">
					{this.props.loginExtInf &&
						<span className="loginExtInf">{this.props.loginExtInf}</span>
					}
					<ul className="userName" onClick={this._show}>
						<li id="userName">
							{
								this.props.loginText +
								this.props.userName +
								'!'
							}
						</li>
						<li id="userDrop"></li>
					</ul>
					<ul className="userList" id={!this.state.userListShow ? 'show' : ''}>
						{this.props.userList.map((text, i) => (
							<li key={i} className="func" onClick={this._noShow(text)}>
								<a>{text}</a>
							</li>
						))}
					</ul>
				</div>
			);
		}
		else {
			var result = (
				<div>
					<div className="login" onClick={this._onClick('专家登录')}>
						专家登录
					</div>
					<div className="login" onClick={this._onClick('登录')}>
						登录
					</div>
					<div className="inLoginText">
						{this.props.inLoginText}
					</div>

				</div>
			)
		}
		return result;
	}

	render() {
		return (
			<div id={this.props.id} className={"BluMUI_UserLoginState " + this.props.extClass}>
				{this._isShowVisit()}
				<div>
					<div className="userOther">
					</div>
					{this._isLogin()}
				</div>
				<ul>
					{this._createFunc()}
				</ul>
				<a className="clearFloat"></a>
			</div>
		)
	}
}
var BluMUI_M = {
	NavList: BluMUI_NavList,
	Set: BluMUI_Set,
	UserLoginState: BluMUI_UserLoginState
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