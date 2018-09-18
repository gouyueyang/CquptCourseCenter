import React from 'react';
import ReactDOM from 'react-dom';
class BlueMUI_Login extends  React.Component{
	constructor(props){
		super(props);
		this.state = {
			rember:false,
			account:'',
			key:'',
			ca:'',
			isLogin:false
		}
		this._input = this._input.bind(this);
	}
	_click(){
		this.setState({
			rember:!this.state.rember
		})
	}
	_login(){
		var data = {
			userId:this.state.account,
			passWord:this.state.key,
			captcha:this.state.ca
		};
		this.props.ajax(data);
	}
	_reset(){
		this.setState({
			key:'',
			account:'',
			isLogin:false
		});
	}
	_input(name){
		var that = this;
		return function(e){
			var value = e.target.value,
				state = {};
			state[name] = value;
			that.setState(state,function(){
				var isLogin;
				if(that.state.key.length > 0 && that.state.account.length > 0 && that.state.ca.length > 0)
					isLogin = true;
				else
					isLogin = false;
				that.setState({
					isLogin:isLogin
				})
			});
		}
	}
	render(){
		return(
			<div className="Login">
				<p className="loginTitle">用户登录</p>
				<div className="inputWarp">
					<span className="title account"></span>
					<input type="text" placeholder="请输入账号" onInput={this._input('account')} value={this.state.account}/>
				</div>
				<div className="inputWarp" style={{marginTop:20}}>
					<span className="title key"></span>
					<input type="password" placeholder="请输入密码" onInput={this._input('key')} value={this.state.key}/>
				</div>
				<div className="inputWarp" style={{marginTop:20}}>
					<span className="title1 ca1"></span>
					<input style={{width:151,height:30}} type="text" placeholder="" onInput={this._input('ca')} value={this.state.ca}/>
					<span className="ca" style={{backgroundImage:'url(' + this.props.host  + 'CquptCourseCenter/pages/courseMaster/identify_Code.jsp)'}}></span>
				</div>
				<button className={this.state.isLogin?'login':'disable'} onClick={this._login.bind(this)}>登录</button>
				<button className="reset" onClick={this._reset.bind(this)}>重置</button>
			</div>
		)
	}
}
var BluMUI_M={
	Login:BlueMUI_Login
}
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
