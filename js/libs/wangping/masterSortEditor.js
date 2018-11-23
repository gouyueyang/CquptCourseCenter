import React from 'react';
import ReactDOM from 'react-dom';
import Alert from './../../util/alert.js';
// import { Alert } from 'antd';

class List extends React.Component {
	constructor(props) {
		super(props);
	}
	_click(item, index) {
		var that = this;
		return function () {
			that.props.callback(item, index);
		}
	}
	create(items) {
		var i,
			len = items.length,
			result = [];
		for (i = 0; i < len; i++) {
			result.push(
				<li key={i}>
					<span className="name">{items[i].name}</span>
					<span className="delte" onClick={this._click(items[i], i)}>删除</span>
				</li>
			);
		}
		return result;
	}
	render() {
		var { callback, items } = this.props;
		return (
			<ul className="List">
				{this.create(items, callback)}
			</ul>
		);
	}
}
class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			fzx: '',
			items: this.props.items || [],
			pc: this.props.pc || '',
			pcWarn: "",
			isEditor:this.props.isEditor
		}
		this.key = this.key.bind(this);
		this.add = this.add.bind(this);
	}


	//回车添加
	key(event) {
		if (event.keyCode == "13") {//keyCode=13是回车键；数字不同代表监听的按键不同
		  this.add();
		}
	  }
	
	
	//检查参数是否合格并调用回调添加分组项
	add() {
		var pc = this.state.pc,
			pcWarn = this.state.pcWarn;
		if (!pc) {
			pcWarn = '分组批次未填写';
			Alert.open({
				alertTip:pcWarn
			});
		}else{
			pcWarn = '';
		}
		
		if (!this.fzxTextarea.value) {
			pcWarn = '未添加分组项目！';
			Alert.open({
				alertTip:pcWarn
			});
		}
		this.setState({
			pcWarn: pcWarn
		});
		if (!pcWarn) {
			this.props.add(this.state.fzx, pc);
		}
	}
	//返回函数
	back() {
		window.location.href = 'fzgl.html';
	}
	render() {
		var { callback } = this.props;
		var items = this.state.items;
		var { pc, pcWarn, isEditor } = this.state;
		return (
			<div>
				{
					isEditor &&
					<p className="header">
						<span className="title">分组批次:</span>
						<span className="name">{pc}</span>
					</p>
				}
				{
					!isEditor &&
					<div className="inputWarp">
						<span>分组批次:</span>
						<input type="text" onInput={(e) => { this.setState({ pc: e.target.value,pcWarn:'' }) }} />
					</div>
				}
				<div className="warn">{this.state.pcWarn}</div>
				<div className="inputWarp">
					<span>分组项:</span>
					<textarea type="text" ref={(ref)=>{this.fzxTextarea=ref}} onInput={(e) => { this.setState({ fzx: e.target.value }) }} onKeyDown={this.key}/>
					<button onClick={this.add.bind(this)}>添加(回车)</button>
				</div>
				<div className="warn">
					可以同时添加多个分组项，不同分组项用英文逗号：','隔开即可,不能与已添加的分组项重复
				</div>
				<div className="ListWarp">
					<span className="title">已添加:</span>
					<List items={items} callback={callback} />
				</div>
				<button onClick={this.back.bind(this)} className="back">返回</button>
			</div>
		);
	}
}


var BluMUI_M = {
	App: App
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
