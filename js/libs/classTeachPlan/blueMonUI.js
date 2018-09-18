import React from 'react';
import ReactDOM from 'react-dom';
class BluMUI_UserLoginState extends React.Component{
	constructor(props){
		super(props);
		this.state={
			userListShow:false
		}
		this._onClick=this._onClick.bind(this);
		this._show=this._show.bind(this);
		this._noShow=this._noShow.bind(this);
	}
	_onClick(e){
		var funcName=e.target.childNodes[0];
		this.props.callback(funcName,this);
	}
	_isShowVisit(){
		var result;
		if(this.props.isLogin){
			var result=(
				<span className="loginNum">
					{this.props.loginNumText+this.props.loginNum}
				</span>
			)
		}
		return result;
	}
	_createFunc(){
		if(this.props.isLogin) {
			var right = this.props.right,
				funcMoulde = this.props.funcName[right],
				i,
				len,
				result = [];
			for (i = 0, len = funcMoulde.length; i <= len; i++) {
				if (i == 0)
					result.push(<hr key={i}></hr>)
				else
					result.push(
						<li key={i} onClick={this._onClick}>
							{funcMoulde[i - 1]}
						</li>
					);
			}
		}
		return result;
	}
	_show(){
		this.setState((prevState, props)=> ({
			userListShow:!prevState.userListShow
		}))
	}
	_noShow(text){
		var that=this;
		return function(){
			that.setState((prevState, props)=> ({
				userListShow:false
			}));
			that.props.callback(text);
		}
	}
	_isLogin(){
		if(this.props.isLogin){
			var result=(
				<span className="userInf">
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
						</ul>
						<ul className="userList" id={!this.state.userListShow?'show':''}>
							{this.props.userList.map((text,i)=>(
								<li key={i} className="func" onClick={this._noShow(text)} >{text}</li>
							))}
						</ul>
				</span>
			);
		}
		else{
			var result=(
				<span>
					<span className="login" onClick={this._onClick}>
						登录
					</span>
					<span className="inLoginText">
						{this.props.inLoginText}
					</span>
				</span>
			)
		}
		return result;
	}

	render(){
		return(
			<div id={this.props.id} className={"BluMUI_UserLoginState "+this.props.extClass}>
				{this._isShowVisit()}
				<div>
					<span className="userOther">
					</span>
					{this._isLogin()}
				</div>
				<ul>
					{this._createFunc()}
				</ul>
			</div>
		)
	}
}
class BluMUI_List extends  React.Component{
	constructor(props) {
		super(props);
		this.state = {
			items: this.props.items,
			index: this.props.index
		}
		this._onClick = this._onClick.bind(this);
	}
	_onClick(index,item){
		var that=this,
			value;
		if(item.value)
			value=item.value;
		else
			value=item.name;
		if(item.callback)
			return(
				function () {
					that.setState({
						index: index
					})
					item.callback(index,value,item);
				}
			);
	}
	_createLi(){
		var result=[],
			i,
			len,
			items=this.state.items;
		for(i=0,len=items.length;i<len;i++){
			result.push(
				<li key={i}
					 className={this.state.index==i?'selected selected-index'+i:'index'+i}
					 onClick={this._onClick(i,items[i])}
					 data-key={i}>
					<a href={items[i].url} title={items[i].name.length>16?items[i].name:''}>
						{items[i].name}
					</a>
				</li>
			);
		}
		return result;
	}
	render(){
		return(
			<ul id={this.props.id} className={"BluMUI_List "+this.props.extClass}>
				{this._createLi()}
			</ul>
		)
	}
}
class BluMUI_TeachPlan extends React.Component{
	constructor(props){
		super(props);
	}
	_create(items){
		var i,
			len,
			result = [];
		for( i = 0 , len = items.length ; i < len ; i++){
			result.push(
				<div key = {i} className="list">
					<span className="course-no">{'教学班号:' + items[i].jxb}</span>
					<span className="course-team">{'班级组合:' + items[i].xsbjzh}</span>
					{items[i].sfrzh != 2&&
					<a  className="download" href={items[i].url}>下载授课计划</a>
					}
				</div>
			)
		}
		return result;
	}
	render(){
		return (
			<div className="BluMUI_TeachPlan">
				{this._create(this.props.items)}
			</div>
		)
	}
}

var BluMUI_M={
	UserLoginState:BluMUI_UserLoginState,
	List:BluMUI_List,
	TeachPlan:BluMUI_TeachPlan
}
var BluMUI={
	result:{},
	create:function(data,type,elem,callback){
		var props=data,
			Blu=BluMUI_M[type];
		this.result[props.id]= ReactDOM.render(
			<Blu {...props}/>,
			elem
		);
		if(callback)
			callback();
	}
};
export default BluMUI;
