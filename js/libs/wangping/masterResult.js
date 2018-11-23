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
			<ul id={this.props.id} className={"BluMUI_NavList "+this.props.extClass}>
				{this._createLi()}
			</ul>
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
					<span>{source[i].num}</span>
					<span className="name">{source[i].name}</span>
				</li>
			);
		}
		return result;
	}
	render(){
		return(
			<ul className="ResourceNum">
				{this._create(this.state.source)}
			</ul>
		);
	}
}
class BluMUI_ReviewModule extends React.Component{
	render(){
		var { name , reviewDesc , totalScore , curScore } = this.props;
		return(
			<div className="ReviewModule">
				<div>
					<p className="moduleName">{name}</p>
				</div>
				<div className="moduleBody">
					<p className="reviewDesc">
						{'评审标准：' + reviewDesc}
					</p>
					<span className="totalScore">
						{'总分：' + totalScore}
					</span>
					<span className="curScore">
						{'评分：' + curScore}
					</span>

				</div>
			</div>
		);
	}
}
class BluMUI_ReviewCourse extends  React.Component{
	constructor(props){
		super(props);
		this.state = {
			courseScore:this.props.courseScore
		}
		this._createModule = this._createModule.bind(this);
	}
	_createModule(modules){
		var i,
			len = modules.length,
			result = [];
		for( i = 0 ; i < len ; i++ ){
			result.push(
				<BluMUI_ReviewModule key={i}   {...modules[i]}/>
			)
		}
		return result;
	}
	render(){
		var { courseName,courseMoudule,pjdesc } = this.props;
		var { courseScore } = this.state;
		return (
			<div>
				<div className="contenWarp">
					<div className="scoreWarp">
						<span className="scoretitle">{'课程名称：' + courseName}</span>

						<span className="score">{'该课程的评分：' + courseScore}</span>
					</div>
					<div className="scoreModuleWarp">
						{this._createModule(courseMoudule)}
					</div>
				</div>
				<div className="reviewArea">
					<p className="reviewTitle">评价</p>
					<p className="textarea">{pjdesc}</p>
				</div>
			</div>
		)
	}
}
class BluMUI_Result extends React.Component{
	constructor(props) {
		super(props);
		this._create = this._create.bind(this);
	}
	_create(items){
		var i,
			len = items.length,
			result = [];
		for( i = 0 ; i < len ; i++){
			result.push(
				<span key={i} onClick={this.downLoadFile.bind(this, items[i])} className="fj">{items[i].originalName}</span>
			);
		}
		if(len === 0){
			result = '无';
		}
		return result;
	}
	downLoadFile(item) {
		this.props.downLoad(item);
	}
	render(){
		var { pc , sj , fj } = this.props;
		return (
			<div className="Result">
				<p className="pc">{'网评批次：' + pc}</p>
				<p style={{marginTop:11}}>
					<span className="sj">{'评审时间：' + sj}</span>
					<span className="fjTitle">评审附件：</span>
					{this._create(fj)}
				</p>
			</div>
		);
	}
}
var BluMUI_M={
	ReviewCourse:BluMUI_ReviewCourse,
	NavListPercent:BluMUI_NavListPercent,
	ResourceNum:BluMUI_ResourceNum,
	Result:BluMUI_Result
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
