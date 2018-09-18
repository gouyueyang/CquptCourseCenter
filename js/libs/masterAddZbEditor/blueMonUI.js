import React from 'react';
import ReactDOM from 'react-dom';

class BluMUI_InputNumber extends  React.Component {
	constructor(props){
		super(props);
		this.state = {
			number:this.props.number || 0
		};
		this._change = this._change.bind(this);
	}
	_input(e){
		var value = e.target.value,
			num = parseInt(value) || 0;

		this.props.update(num,this.props.index,this);
		this.setState({
			number:num
		});
	}
	_change(add){
		var that = this;
		return function(){
			var num = that.state.number + add,
				max = that.props.max;
			if(num < 0)
				num  = 0;
			if(num > max)
				num = max;
			that.props.update(num,that.props.index);
			that.setState({
				number: num
			});
		}
	}

	render(){
		return(
			<div className="InputNumber" id={this.props.id || ''}>
				<input type="text"  onInput={this._input.bind(this)} value={this.state.number}/>
				<div className="numberControl">
					<button className="up" onClick={this._change(1)}/>
					<button className="down" onClick={this._change(-1)}/>
				</div>
			</div>
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
class Items extends React.Component{
	input(index,e){
		var value = e.target.value;
		this.props.textOnInput(index,value);
	}
	_create(items){
		var update = this.props.update,
			len = items.length,
			result = [],
			i;
		for( i = 0 ; i <　len ; i++){
			result.push(
				<ul key={i}>
					<li className="project">{items[i].index}</li>
					<li className="score">
						<BluMUI_InputNumber index = {i} number={items[i].fz}  update={update}/>
					</li>
					<li className="desc">
						<textarea onInput={this.input.bind(this,i)}>{items[i].bzms}</textarea>
					</li>
				</ul>
			);
		}
		return result;
	}
	render(){
		var {
			items
		} = this.props;
		return(
			<div className="items-body" id={this.props.id}>
				<ul className="header-list">
					<li className="project">项目</li>
					<li className="score">分值</li>
					<li className="desc">标准描述</li>
					<li className="delete">操作</li>
				</ul>
				{this._create.call(this,items)}
			</div>
		);
	}
}
class ItemsX extends React.Component{
	_delete(index){
		this.props.delete(index);
	}
	_create(items){
		var len = items.length,
			result = [],
			i;
		for( i = 0 ; i <　len ; i++){
			result.push(
				<ul key={i}>
					<li className="project">{items[i].index}</li>
					<li className="score">{items[i].fz}</li>
					<li className="desc1">{items[i].bzms}</li>
					<li className="delete" onClick={this._delete.bind(this,i)}>删除</li>
				</ul>
			);
		}
		return result;
	}
	render(){
		var {
			items
		} = this.props;
		return(
			<div className="items-body" id={this.props.id}>
				<ul className="header-list">
					<li className="project">项目</li>
					<li className="score">分值</li>
					<li className="desc2">标准描述</li>
					<li className="delete1">操作</li>
				</ul>
				{this._create.call(this,items)}
			</div>
		);
	}
}
class ByCourseItem extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			items:this.props.items || [
				[
					{
						index:'课程简介',
						fz:0,
						bzms:''
					},
					{
						index:'教学大纲',
						fz:0,
						bzms:''
					},
					{
						index:'考试大纲',
						fz:0,
						bzms:''
					},
					{
						index:'授课计划',
						fz:0,
						bzms:''
					},
					{
						index:'教学团队',
						fz:0,
						bzms:''
					},
					{
						index:'知识点体系',
						fz:0,
						bzms:''
					},
					{
						index:'电子教案',
						fz:0,
						bzms:''
					},
					{
						index:'学习资源',
						fz:0,
						bzms:''
					},
					{
						index:'导学方案',
						fz:0,
						bzms:''
					}
				],
				[
					{
						index:'课程简介',
						fz:0,
						bzms:''
					},{
					index:'教学大纲',
					fz:0,
					bzms:''
				},{
					index:'考核方案',
					fz:0,
					bzms:''
				},{
					index:'电子教案',
					fz:0,
					bzms:''
				},{
					index:'实习计划',
					fz:0,
					bzms:''
				},{
					index:'教学团队',
					fz:0,
					bzms:''
				}]
			],
			select:0
		}
	}
	_select(type){
		this.setState({
			select:type
		})
	}
	_update(num,index){
		var items = this.state.items;
		items[this.state.select][index].fz = +num;
		this.setState({
			items:items
		});
	}
	getTotal(index){
		var items = this.state.items[index],
			result = 0;
		items.forEach(function(value){
			result += value.fz;
		});
		return result;
	}
	textOnInput(index,value){
		var items = this.state.items,
			item  = items[this.state.select];
		item[index].bzms = value;
		this.setState({
			items:items
		});
	}
	sure(){
		var llData = {
			indexType:1,
			courseType: 1,
			indexs:JSON.stringify(this.state.items[0])
		};
		var sjData = {
			indexType:1,
			courseType: 2,
			indexs:JSON.stringify(this.state.items[1])
		};
		if(this.getTotal.call(this, 0) === 100 &&
			this.getTotal.call(this, 1) === 100
		) {
			this.props.sure([llData, sjData]);
		} else if(this.getTotal.call(this, 0) !== 100) {
			alert('理论课指标总分不为100分');
		} else if(this.getTotal.call(this, 1) !== 100) {
			alert('实训课指标总分不为100分');
		}
	}
	render(){
		var {
			items,
			select
		} = this.state;
		return(
			<div className="editorBody" >
				<div className="header">
					<span className={select===0?'title selected':'title'} onClick={this._select.bind(this,0)}>理论课</span>
					<span className={select===1?'title selected':'title'} onClick={this._select.bind(this,1)}>实训课</span>
				</div>
				<div className="scorePanel">
					<span className="title">指标总分:</span>
					<span className="num">{this.getTotal.call(this, this.state.select)}</span>
				</div>
				{
					select === 0&&
					<Items items={items[0]} textOnInput={this.textOnInput.bind(this)} update={this._update.bind(this)} type={0}/>
				}
				{
					select === 1&&
					<Items items={items[1]} textOnInput={this.textOnInput.bind(this)} update={this._update.bind(this)} type={0}/>
				}
				<div className="btnWarp">
					<button className="left" onClick={this.sure.bind(this)}>确定</button>
					<button className="right" onClick={this.props.off}>取消</button>
				</div>
			</div>
		);
	}
}
class ByCommon extends React.Component{
	constructor(props){
		super(props);
		this.state={
			items:this.props.items || [],
			curScore:0
		};
	}
	_update(num,index,that){
		this.setState({
			curScore:num,
			projectWarn:'',
			descWarn:''
		})
	}
	_add(){
		var projectWarn = '',
			descWarn = '',
			item = {},
			items = this.state.items;
		if(/\S{1,}/.test(this.projectInput.value)){
			item.index = this.projectInput.value;
		}else{
			projectWarn = '项目未填写';
		}
		if(/\S{1,}/.test(this.textAreaInput.value)){
			item.bzms = this.textAreaInput.value;
		}else{
			descWarn = '评审未填写';
		}
		if(!projectWarn && !descWarn){
			item.fz = this.state.curScore;
			this.projectInput.value = '';
			this.textAreaInput.value = '';
			items.push(item);
		}
		this.setState({
			items:items,
			projectWarn:projectWarn,
			descWarn:descWarn
		})
	}
	_delete(index){
		var  items = this.state.items;
		items.splice(index,1);
		this.setState({
			items:items
		})
	}
	getTotal(){
		var  items = this.state.items,
			score = 0;
		items.forEach((item)=>{score += item.fz});
		return score;
	}
	_sure(){
		var data = {
			indexType:2,
			courseType:'',
			indexs:JSON.stringify(this.state.items)
		};
		if (this.getTotal.call(this) === 100) {
			this.props.sure([data]);
		} else {
			alert('通用课指标总分不为100');
		}
	}
	render(){
		var {
			projectWarn,
			descWarn
		}= this.state;
		return(
			<div>
				<div className="inputWarp">
					<span className="title must">项目</span>
					<input type="text" className="text" ref={(input)=>{this.projectInput = input}}/>
				</div>
				<span className="warn">{projectWarn}</span>
				<div className="inputWarp">
					<span className="title must">分值</span>
					<BluMUI_InputNumber id="commonInputScore" index = {0}  update={this._update.bind(this)}/>
				</div>
				<span className="warn"></span>
				<div className="inputWarp">
					<span className="title must">评审标准</span>
					<textarea type="text" id="textArea" className="text" ref={(input)=>{this.textAreaInput = input}}/>
					<span className="add" onClick={this._add.bind(this)}>添加</span>
				</div>
				<span className="warn">{descWarn}</span>

				<div className="editorBody">
					<div className="scorePanel">
						<span className="title">指标总分:</span>
						<span className="num">{this.getTotal.call(this)}</span>
					</div>
					<ItemsX items={this.state.items} id="common" delete={this._delete.bind(this)}/>
					<div className="btnWarp">
						<button className="left" onClick={this._sure.bind(this)}>确定</button>
						<button className="right" onClick={this.props.off}>取消</button>
					</div>
				</div>
			</div>
		);
	}
}
class AddZbEditor extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			select:this.props.select || 0,
			pcWarn:'',
		}
	}
	off(){
		window.location.href ="./pjzbgl.html";
	}
	_select(type){
		this.setState({
			select:type
		})
	}
	_sure(data){
		var pcWarn = '';
		if(!/\S{1,}/.test(this.pcInput.value)){
			pcWarn = "未填写指标批次";
		}
		if(!pcWarn){
			data[0].indexBatch = this.pcInput.value;
			if(data[1]){
				data[1].indexBatch = this.pcInput.value;
			}
			if(this.props.callback)
				this.props.callback(data,this);
		}
		this.setState({
			pcWarn:pcWarn
		});
	}
	render(){
		var {
			select,
			pcWarn
		} = this.state;
		var {
			isEditor = false,
			indexBatch
		} = this.props;
		return(
			<div className="zbEditor">
				<div className="container">
					<span className="warn"></span>
					<div className="inputWarp">
						<span className="title must">指标批次</span>
						<input defaultValue={indexBatch} disabled={isEditor?true:false} ref={(pc)=>{this.pcInput = pc}} type="text" className="text"/>
					</div>
					<span className="warn">{pcWarn}</span>
					{!isEditor &&
					<div className="inputWarp">
						<span className="title must">指标类别</span>
						<Radio select={select === 0 ? true : false} callback={this._select.bind(this, 0)}/>
						<span className="radioTitle">按课程栏目</span>
						<Radio select={select === 1 ? true : false} callback={this._select.bind(this, 1)}/>
						<span className="radioTitle">通用</span>
					</div>
					}
					<span className="warn"></span>
					{
						select === 0 &&
						<ByCourseItem items={this.props.items}
										  sure={this._sure.bind(this)}
										  off={this.off.bind(this)}
						/>
					}
					{
						select === 1 &&
						<ByCommon 	items={this.props.items}
										sure={this._sure.bind(this)}
										off={this.off.bind(this)}
						/>
					}
				</div>
			</div>
		);
	}
}
var BluMUI_M={
	AddZbEditor: AddZbEditor
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

