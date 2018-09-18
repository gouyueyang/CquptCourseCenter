import React from 'react';
import ReactDOM from 'react-dom';

class WpEditorTitle extends React.Component{
	render(){
		var { courseName,teamName } = this.props;
		return(
			<p className="warp">
				<span className="courseName"><span className="title">{courseName}</span>课程分配结果</span>
				<span className="teamName">{'所属专家分组名称 : ' + teamName}</span>
			</p>
		);
	}
}
class Radio extends React.Component{
	constructor(props){
		super(props);
	}
	_click(){
		var select = !this.props.select;
		if(this.props.callback)
			this.props.callback(select,this.props.index);
	}
	render(){
		var { select } = this.props;
		return(
			<div className={select?"radio-selected":"radio"} onClick={this._click.bind(this)}></div>
		);
	}
}
class EditorList extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			items:this.props.items||[],
			selects:[],// 列表
			selected:false // 全选按钮
		};
		this._clickOpera = this._clickOpera.bind(this);
		this.createList = this.createList.bind(this);
		this.selectChange = this.selectChange.bind(this);
	}
	componentWillMount(){
		var i,
			len = this.props.items.length,
			result = [];
		for( i = 0 ; i < len ; i ++ ){
			result[i] = false;
		}
		this.setState({
			selects:result
		});
	}
	selectChange(select,index){
		var selects = this.state.selects;
		selects[index] = select;
		this.setState({
			selects:selects
		});
	}
	_clickOpera(item,index){
		var that = this;
		return function(){
			item.callback(item.name,index,that);
		};
	}
	createCourseSpan(items){
		var num = items.length,
			len = num,
			i,
			str = '',
			result = [];

		for( i = 0 ; i < len ; i++){
			str+=items[i].expName + ' ';
		}
		result.push(<span key = {2}>
			{str}
		</span>);
		return result;
	}
	createOperation(operaions,index){
		var i,
			len = operaions.length,
			result = [];
		for( i = 0 ; i < len ; i++){
			result.push(
				<span className="operaBtn"
						key = {i}
						onClick={this._clickOpera(operaions[i],index)}>
					{operaions[i].name}
				</span>
			)
		}
		return result;
	}
	createList(items){
		var i,
			len = items.length,
			result = [],
			operaions = this.props.operaions,
			selects = this.state.selects;
		for( i = 0 ; i < len ; i++){
			result.push(
				<ul className="List" key={i}>
					<li><Radio select={selects[i]} index={i} callback={this.selectChange}/></li>
					<li className="courseName">{items[i].courseName}</li>
					<li className="courseId">{items[i].id}</li>
					<li className="masters">
						{this.createCourseSpan(items[i].masters)}
					</li>
					<li className="college">{items[i].college}</li>
					<li className="opera">{this.createOperation(operaions,i)}</li>
				</ul>

			);
		}
		return result;
	}
	clickAll(select){
		var i,
			selects = this.state.selects,
			len = selects.length;
		for( i = 0 ; i < len ; i++){
			selects[i] = select;
		}
		this.setState({
			selected:select,
			selects:selects
		});
	}
	titleCallback(type){
		this.props.titleCallback(type,this);
	}
	render() {
		var { titleName,titleIcon,id,name } = this.props;
		var { selected } = this.state;
		return (
			<div>
				<div className="titleWarp">
					<span onClick={this.titleCallback.bind(this,titleName)} className="title">{titleName}</span>
					<span onClick={this.titleCallback.bind(this,titleName)} className={"btn "+ id} style={{backgroundImage:'url('+ titleIcon+ ')'}}></span>
					<span className="WarpTitle">{name}</span>
				</div>
				<div className="ListWarp">
					<ul className="headerLine">
						<li><Radio select={selected} callback={this.clickAll.bind(this)}/></li>
						<li className="courseName">课程名称</li>
						<li className="courseId">课程编号</li>
						<li className="masters">已分配专家</li>
						<li className="college">开课学院</li>
						<li className="opera">操作</li>
					</ul>
					<div className="bodyList">
						{this.createList(this.state.items)}
					</div>
				</div>
			</div>
		);
	}
}
var BluMUI_M={
	WpEditorTitle:WpEditorTitle,
	EditorList:EditorList
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
