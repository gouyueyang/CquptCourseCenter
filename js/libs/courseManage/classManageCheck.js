import React from 'react';
import ReactDOM from 'react-dom';
class BluMUI_NavListPercent extends  React.Component{
	constructor(props) {
		super(props);
		this.state = {
			items: this.props.items,
			index: this.props.index
		};
		this._onClick = this._onClick.bind(this);
	}
	_onClick(index){
		var that = this ;
		return function () {
			that.setState(
				{
					index:index
				}
			);
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
					 onClick={this._onClick(i)}
					 data-key={i}
					 style={{width:100/len + '%'}}
				>
					<a>{this.state.items[i]}</a>
					{
						this.state.index==i&&
						<span className="selected"></span>
					}
				</li>
			);
		}
		return result;
	}
	render(){
		return(
			<div>
				{this.state.items.length>0&&
				<ul id={this.props.id} className={"BluMUI_NavList "+this.props.extClass}>
					{this._createLi()}
				</ul>
				}
			</div>


		)
	}
}
class BluMUI_ResourceNum extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			source:this.props.source
		};
	}
	_create(source){
		var result = [],
			len = source.length,
			i;
		for( i = 0  ; i < len ; i++){
			result.push(
				<li key={i} className={'index'+i}>
					<span>{source[i].count}</span>
					<span className="name">{source[i].name}</span>
				</li>
			);
		}
		return result;
	}
	render(){
		return(
			<ul className={this.state.source.length > 0 ? "ResourceNum" : ""}>
				{this._create(this.state.source)}
			</ul>
		);
	}
}
class BlueMUI_NoLogin extends  React.Component{
	constructor(props){
		super(props);
		this.state = {
			time:8
		}
	}
	componentDidMount(){
		var that = this;
		this.timer = setInterval(function test(){
			that.setState({
				time:that.state.time - 1
			});
			if(that.state.time<=0){
				clearInterval(that.timer);
				delCookie('unifyCode');
				delCookie('userId');
				window.location.href = that.props.url
			}
		},1000);
	}
	componentWillUnmount(){
		clearInterval(this.timer);
	}
	render(){
		return(
			<div className="BlueMUI_NoLogin">
				<p style={{marginTop:200}}>您尚未登录，系统将在
					<a className="time">{this.state.time + '秒'}</a>
					后自动跳转到登录页
				</p>
				<a href={this.props.url} style={{color:'red'}}>
					<p>
						若仍未跳转，请点击这里
					</p>
				</a>
			</div>
		)
	}
}
class BlueMUI_Radio extends  React.Component{
	constructor(props){
		super(props);
		this._onclick=this._onclick.bind(this);
	}
	_onclick(e){
		this.props.callback(!this.props.select,this.props.index,this.props.type);
	}
	render(){
		return(
			<div className={'BlueMUI_Radio radio' + this.props.index}>

				<span onClick={this._onclick}
						className={this.props.select?"radio selected":'radio'}
				>
				</span>
				<span className="name">
						{this.props.name}
				</span>
			</div>
		)
	}
}
class BlueMUI_MouduleCheck extends  React.Component{
	constructor(props){
		super(props);
		this._Click = this._Click.bind(this);
		var i,
			len,
			selectArray = [];
		for( i = 0 , len = this.props.modules.length ; i < len ; i++){
			selectArray[i] = [false,false];
		}
		this.state={
			selectArray:selectArray
		};
	}
	_Click(select,index,type){
		var selectArray = this.state.selectArray;
		if(index == 0){
			var i,
				len;
			for(i = 0 , len = this.props.modules.length ; i < len ; i++){
				selectArray[i][type] = select;
				selectArray[i][+!type] = false;
			}
		}
		else{
			selectArray[0][+!type] = false;
			selectArray[index][type] = select;
			selectArray[index][+!type] = false;
		}
		this.setState(
			{
				selectArray:selectArray
			}
		)
	}
	_createRadios(radios,index){
		var i,
			len,
			result = [];
		for( i = 0 , len = radios.length ; i < len ; i++){
			result.push(
				<BlueMUI_Radio name = {radios[i]}
									key={i}
									index = {i}
									type = {index}
									select={this.state.selectArray[i][index]}
									callback = {this._Click}
				></BlueMUI_Radio>
			);
		}
		return result;
	}
	render(){
		return(
			<div className="BlueMUI_MouduleCheck">
				{this.props.isCheck &&
				<div className="Warp">
					<span className="radioTitle">通过</span>
					<div className="radiosWarp">
						{this._createRadios(this.props.modules, 0)}
					</div>
				</div>
				}
				<div className="Warp">
					<span className="radioTitle">驳回</span>
					<div className="radiosWarp">
						{this._createRadios(this.props.modules,1)}
					</div>
				</div>
			</div>
		)
	}
}
class BlueMUI_List extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			items: this.props.items || [],
			index: 0
		};
	}
	_click(id, index) {
		this.setState({
			index: index
		});
		this.props.callback(id);
	}
	create(items) {
		var result = [],
			len = items.length,
			i;
		for (i = 0; i < len ; i++) {
			result.push(
				<li onClick={this._click.bind(this, items[i], i)}
					 title = {items[i].name}
					 key = {i}
					 className={i === this.state.index ? 'selected' : ''}
				>
					<p className="course-name">{items[i].name}</p>
					<p>{items[i].id}</p>
					<p className='course-status'>{items[i].status}</p>
				</li>
			);
		}
		return result;
	}
	render() {
		return (
			<ul className="BlueMUI_List">
				<li className="first">
					<span>
						课程列表
					</span>
				</li>
				<div>
					{this.create(this.state.items)}
				</div>
			</ul>
		);
	}
}
var BluMUI_M={
	NavList:BluMUI_NavListPercent,
	ResourceNum:BluMUI_ResourceNum,
	MouduleCheck:BlueMUI_MouduleCheck,
	NoLogin:BlueMUI_NoLogin,
	List: BlueMUI_List
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
