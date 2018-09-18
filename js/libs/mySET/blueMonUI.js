import React from 'react';
import ReactDOM from 'react-dom';
class BluMUI_NavList extends  React.Component{
	constructor(props) {
		super(props);
		this.state = {
			items: this.props.items,
			index: this.props.index
		}
		this._onClick = this._onClick.bind(this);
	}
	_onClick(index){
		var that = this ;
		return function () {
			that.setState(
				{
					index:index
				}
			)
			that.props.callback(that.state.items[index]);
		}
	}
	_createLi(){
		var result=[],
			i,
			len;
		for(i=0,len=this.state.items.length;i<len;i++){
			result.push(
				<li key={i}
					 className={this.state.index==i?'selected':''}
					 onClick={this._onClick(i)}
					 data-key={i}>
					<a>{this.state.items[i]}</a>
				</li>
			);
		}
		return result;
	}
	render(){
		return(
			<ul id={this.props.id} className={"BluMUI_NavList "+this.props.extClass}>
				{this._createLi()}
			</ul>
		)
	}
}
class BluMUI_Set extends  React.Component{
	constructor(props){
		super(props);
		this.state = {
			curIndex:1,
			keyArray:['curKeyWord','newKeyWord','newKeyWordSure'],
			setArray:[
				{
					name:'sex',
					title:'性别'
				},
				{
					name:'name',
					title:'姓名'
				},
				{
					name:'zc',
					title:'职称'
				},
				{
					name:'zy',
					title:'专业类'
				},
				{
					name:'email',
					title:'邮箱'
				},
				{
					name:'tel',
					title:'手机号码'
				},
				{
					name:'uid',
					title:'开户银行'
				},
				{
					name:'bank',
					title:'银行卡号'
				}
			],
			sex:'男',
			curKeyWord: this.props.curKeyWord || '',
			curKeyWordWarn:'',
			newKeyWord: this.props.newKeyWord || '',
			newKeyWordWarn:'密码长度至少为6位',
			newKeyWordSure: this.props.newKeyWordSure || '',
			newKeyWordSureWarn:'请在自再次输入新密码',
			account:this.props.userId,
			name: this.props.name || '',
			nameWarn: '',
			zc: this.props.zc || '',
			zcWarn:'',
			zy: this.props.zy || '',
			zyWarn:'',
			email: this.props.email ||'',
			emailWarn:'',
			tel: this.props.tel || '',
			telWarn:'',
			uid: this.props.uid || '',
			uidWarn:'',
			bank: this.props.bank || '',
			bankWarn:'',
			bankname: this.props.bankname || '',
			banknameWarn:''
		}
		this._input = this._input.bind(this);
		this._radio = this._radio.bind(this);
		this._save = this._save.bind(this);
		this._check = this._check.bind(this);
	}
	_input(name,title){
		var that = this;
		return function(e){
			var value = e.target.value;
			that._check(name,value,true,title);
		}
	}
	_check(name,value,flag,title){
		var  warn = '',
			result = 1,
			pattern  =null,
			newData = {};
		if(flag)
			newData[name] = value;
		switch (name){
			case 'zy':
			case 'zc':
			case 'dw':
			case 'name':
				if(value.length == 0){
					warn = title + '不能为空';
				}
				break;
			case 'email':
				pattern = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
				if(!pattern.test(value)){
					warn = '邮箱格式错误';
				}else if(value.length == 0){
					warn = title + '不能为空';
				}
				break;
			case 'tel':
				var pattern = /^1[0-9]{10}$/;
				if(value.length == 0){
					warn = title + '不能为空';
				}else if(!pattern.test(value)){
					warn = '手机号格式错误!';
				}
				break;
			case 'uid':
				var pattern1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/,
					pattern2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
				if(value.length > 0&&!pattern1.test(value)&&!pattern2.test(value)){
					warn = '身份证号码格式错误!'
				}
				break;
			case 'bank':
				pattern =  /^(\d{16}|\d{19})$/;
				console.log(pattern.test(value));
				if(value.length > 0&&!pattern.test(value)){
					warn = '银行卡位数错误，应该是16位或者19位'
				}
				break;
			case 'account':
				if(value.length < 5){
					warn = '账号长度至少为6位';
				}
				else if(value.length === 0){
					warn = '账号不能为空'
				}
				break;
			case 'curKeyWord':{
				if(value.length === 0){
					warn = '密码不能为空!';
				}
				break;
			}
			case 'newKeyWord':
				if(value.length < 6 ){
					warn = '密码长度至少为6位';
				}
				else if(value.length === 0){
					warn = '密码不能为空!';
				}
				break;
			case 'newKeyWordSure':
				if(value.length == 0){
					warn = '请在自再次输入新密码'
				}else if(value !== this.state.newKeyWord){
					warn = '新密码不一致';
				}
				break;
		}
		if(warn.length > 0)
			result = 0;
		newData[name + 'Warn'] = warn;
		this.setState(newData);
		return result;
	}
	_radio(sex){
		var that = this;
		return function () {
			that.setState({
				sex:sex
			})
		}
	}
	_save(type){
		var that = this;
		if(type === 1){
			return function(){
				var keyArray = that.state.keyArray,
					len = keyArray.length,
					result = 0,
					key = '';
				for(var i = 0 ; i < len ; i++){
					key = keyArray[i];
					result += that._check(key,that.state[key],false);
				}
				if(result === len){
					var data = {
						oldPassWord:that.state.curKeyWord,
						newPassWord:that.state.newKeyWord
					};
					that.props.ajax(data,1);
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
				for(var i = 0 ; i < len ; i++){
					key = setArray[i].name;
					title = setArray[i].title;
					result += that._check(key,that.state[key],false,title);
				}
				if(result === len){
					var data = {
						sex:that.state.sex,
						userId:that.state.account,
						department:that.state.dw,
						title:that.state.zc,
						research:that.state.zy,
						bank:that.state.bankname,
						identityId:that.state.uid,
						account:that.state.bank,
						telePhone:that.state.tel,
						email:that.state.email,
						userName:that.state.name
					};
					that.props.ajax(data,0);
				}else{

				}
			}
		}
	}
	render(){
		return(
			<div id="mySET">
				{
					this.state.curIndex === 0&&
					<div id="myself">
						<div style={{overflow:'hidden'}}>
							<div className="inputWarp" style={{marginTop:58}}>
								<span className="title must" >
									<span className="left">账</span>
									<span className="right">号</span>
								</span>
								<input type="text" className="text" disabled value={this.props.userId}/>
								<span className="warn"></span>
							</div>
							<div className="inputWarp leftWarp" style={{marginTop:58}}>
								<span className="title must" >
									<span className="left">姓</span>
									<span className="right">名</span>
								</span>
								<input type="text" className="text" value={this.state.name} onInput={this._input('name','姓名')}/>
								<span className="warn">{this.state.nameWarn}</span>
							</div>
							<div className="inputWarp " >
								<span className="title must" >
									<span className="left">姓</span>
									<span className="right">别</span>
								</span>
								<div className="radioWarp">
									<span className="radioTitle">男</span>
									<span className={this.state.sex == '男'?'radio on':'radio'} onClick={this._radio('男')}></span>
									<span className="radioTitle" style={{marginLeft:10}}>女</span>
									<span className={this.state.sex == '女'?'radio on':'radio'} onClick={this._radio('女')}></span>
								</div>
							</div>
							<div className="inputWarp leftWarp" >
								<span className="title must" >
									工作单位
								</span>
								<input type="text" className="text" value={this.state.dw} onInput={this._input('dw','工作单位')}/>
								<span className="warn">{this.state.dwWarn}</span>
							</div>
							<div className="inputWarp " >
								<span className="title must" >
									<span className="left">职</span>
									<span className="right">称</span>
								</span>
								<input type="text" className="text" value={this.state.zc} onInput={this._input('zc','职称')}/>
								<span className="warn">{this.state.zcWarn}</span>
							</div>
							<div className="inputWarp leftWarp" >
								<span className="title must" >
									专业类
								</span>
								<input type="text" className="text" value={this.state.zy} onInput={this._input('zy','专业类')}/>
								<span className="warn">{this.state.zyWarn}</span>
							</div>
							<div className="inputWarp " >
								<span className="title must" >
									电子邮箱
								</span>
								<input type="text" className="text" value={this.state.email} onInput={this._input('email','电子邮箱')}/>
								<span className="warn">{this.state.emailWarn}</span>
							</div>
							<div className="inputWarp leftWarp" >
								<span className="title must" >
									手机号码
								</span>
								<input type="text" className="text" value={this.state.tel} onInput={this._input('tel','手机号码')}/>
								<span className="warn">{this.state.telWarn}</span>
							</div>
							<div className="inputWarp" >
								<span className="title" >
									身份证号
								</span>
								<input type="text" className="text" value={this.state.uid} onInput={this._input('uid')}/>
								<span className="warn">{this.state.uidWarn}</span>
							</div>
							<div className="inputWarp leftWarp" >
								<span className="title" >
									开户银行
								</span>
								<input type="text" className="text" value={this.state.bankname} onInput={this._input('bankname')}/>
								<span className="warn">{this.state.banknameWarn}</span>
							</div>
							<div className="inputWarp "  style={{width:730}}>
								<span className="title" >
									银行卡号
								</span>
								<input type="text" className="text" value={this.state.bank} onInput={this._input('bank')}/>
								<span className="extwarn">（注：请确保姓名、身份证、银行卡开户人为同一人）</span>
								<span className="warn">{this.state.bankWarn}</span>
							</div>
						</div>
						<button onClick={this._save(0)}>保存</button>
					</div>
				}
				{
					this.state.curIndex === 1&&
					<div id="keyModify">
						<div className="inputWarp" style={{marginTop:74}}>
							<span className="title">当前密码</span>
							<input type="password" className="text" onInput={this._input('curKeyWord')}/>
							<span className="warn">{this.state.curKeyWordWarn}</span>
						</div>
						<div className="inputWarp">
							<span className="title">新密码</span>
							<input onInput={this._input('newKeyWord')} type="password" className="text"/>
							<span className="warn">{this.state.newKeyWordWarn}</span>
						</div>
						<div className="inputWarp">
							<span className="title">新密码确认</span>
							<input onInput={this._input('newKeyWordSure')} type="password" className="text"/>
							<span className="warn">{this.state.newKeyWordSureWarn}</span>
						</div>
						<button onClick={this._save(1)}>保存</button>
					</div>
				}

			</div>
		)
	}
}
class BluMUI_UserLoginState extends React.Component{
	constructor(props){
		super(props);
		this.state={
			userListShow:false,
			right:this.props.right,
			isLogin:this.props.isLogin
		}
		this._onClick=this._onClick.bind(this);
		this._show=this._show.bind(this);
		this._noShow=this._noShow.bind(this);
	}
	_onClick(value){
		var that = this;
		return function () {
			that.props.callback(value,that);
		}
	}
	_isShowVisit(){
		var result=(
			<span className="loginNum">
					{this.props.loginNumText+this.props.loginNum}
				</span>
		)
		return result;
	}
	_createFunc(){
		var defaultModule = this.props.defaultFunc,
			t,
			i,
			result = [],
			len,
			moduleToURL = this.props.moduleToURL;
		if(this.state.isLogin) {
			var funcMoulde = this.props.funcName;
			for (i = 0, len = funcMoulde.length; i <= len; i++) {
				if(moduleToURL[funcMoulde[i]]) {
					result.push(
						<a key={i} href={moduleToURL[funcMoulde[i]].url} target={moduleToURL[funcMoulde[i]].openType}>
							<li >
								{funcMoulde[i]}
							</li>
						</a>
					);
				}else{
					result.push(
						<li key={i}>
							{funcMoulde[i]}
						</li>
					);
				}
			}
			for(t = i ,len = i + defaultModule.length ; t < len ; t++){
				result.push(
					<a key={t} href={moduleToURL[defaultModule[t-i]].url} target={moduleToURL[defaultModule[t-i]].openType}>
						<li >
							{defaultModule[t-i]}
						</li>
					</a>
				)
			}
			result.push(<hr key={t}></hr>);
		}else{
			for(t = 0 ,len = defaultModule.length ; t < len ; t++){
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
	_show(){
		this.setState((prevState, props)=> ({
			userListShow:!prevState.userListShow
		}))
	}
	_noShow(text){
		var that = this;
		return function () {
			that.props.callback(text);
		}
	}
	_isLogin(){
		if(this.state.isLogin){
			var result=(
				<div className="userInf">
					{this.props.loginExtInf&&
					<span className="loginExtInf">{this.props.loginExtInf}</span>
					}
					<ul className="userName"  onClick={this._show}>
						<li id="userName">
							{
								this.props.loginText+
								this.props.userName+
								'!'
							}
						</li>
						<li id="userDrop"></li>
					</ul>
					<ul className="userList" id={!this.state.userListShow?'show':''}>
						{this.props.userList.map((text,i)=>(
							<li key={i} className="func" onClick={this._noShow(text)}>
								<a>{text}</a>
							</li>
						))}
					</ul>
				</div>
			);
		}
		else{
			var result=(
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

	render(){
		return(
			<div id={this.props.id} className={"BluMUI_UserLoginState "+this.props.extClass}>
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
var BluMUI_M={
	NavList:BluMUI_NavList,
	Set:BluMUI_Set,
	UserLoginState:BluMUI_UserLoginState
};
var BluMUI={
	result:{},
	create:function(data,type,elem){
		var props=data,
			Blu=BluMUI_M[type];
		this.result[props.id]= ReactDOM.render(
			<Blu {...props}/>,
			elem
		);
	}
};
export default BluMUI;