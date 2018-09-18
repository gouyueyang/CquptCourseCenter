import React from 'react';
import ReactDOM from 'react-dom';
class BluMUI_NavListPercent extends React.Component {
	constructor(props) {
		super(props);//被extends的如果要用this方法必须先super() 
		this.state = {//这里是初始化state
			items: this.props.items,
			index: this.props.index
		};
		this._onClick = this._onClick.bind(this);
	}
	_onClick(index) {
		var that = this;
		return function () {
			that.setState(//这里是修改state，修改了index原来的值 
				{
					index: index
				}
			);
			that.props.callback(that.state.items[index]);
		}
	}
	_createLi() {//导航栏的li标签部分显示
		var result = [],
			i,
			len;//个数
		for (i = 0, len = this.state.items.length; i < len; i++) {
			result.push(
				<li key={i}
					//点击之后调用上面的函数，改变下面部分显示的东西
					onClick={this._onClick(i)}
					data-key={i}
					style={{ width: 100 / len + '%' }}
				>
					<a>{this.state.items[i]}</a>
					{
						this.state.index == i &&
						<span className="selected"></span>
					}
				</li>
			);
		}
		return result;
	}
	render() {
		return (
			<div>
				{this.state.items.length > 0
					&&
					<ul id={this.props.id} className={"BluMUI_NavList " + this.props.extClass}>
						{this._createLi()}
					</ul>
				}
			</div>


		)
	}
}
var BluMUI_M = {
	List: BluMUI_NavListPercent
}
var BluMUI = {
	result: {},
	create: function (data, type, elem, callback) {
		var props = data,
			Blu = BluMUI_M[type];
		this.result[props.id] = ReactDOM.render(
			<Blu {...props} />,
			elem
		);
		if (callback)
			callback();
	}
};
export default BluMUI;
