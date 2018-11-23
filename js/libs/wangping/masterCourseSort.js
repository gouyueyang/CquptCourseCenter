import React from 'react';
import ReactDOM from 'react-dom';

var ajax = require('../post_ajax.js');

class BluMUI_PT_LI extends React.Component {
	constructor(props) {
		super(props);
		this.handlerChange = this.handlerChange.bind(this);
	}
	handlerChange(e) {
		this.props.change(parseInt(e.target.getAttribute('data-index')));
	}
	render() {
		var items = [];
		for (var i = this.props.start; i <= this.props.showNum + this.props.start - 1; i++) {
			items.push(
				<li onClick={this.handlerChange}
					data-index={i}
					key={i}
					className={i == this.props.index ? "cur" : ""}>
					{i}
				</li>);
		}
		return (
			<ul id="warp">
				{items}
			</ul>
		);
	}
}
class BluMUI_PT extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			index: this.props.index,
			start: this.props.start,
			inputValue: 1
		};
		this.handlerNext = this.handlerNext.bind(this);
		this.handlerLast = this.handlerLast.bind(this);
		this.handlerTop = this.handlerTop.bind(this);
		this.handlerBottom = this.handlerBottom.bind(this);
		this.handlerChange = this.handlerChange.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.index !== this.state.index) {
			this.setState({
				index: nextProps.index,
				start: 1
			});
		}
	}
	handlerNext(e) {
		this.handlerChange(this.state.index + 1);
	}
	handlerLast(e) {
		this.handlerChange(this.state.index - 1);
	}
	handlerTop(e) {
		this.handlerChange(1);
	}
	handlerBottom(e) {
		this.handlerChange(this.props.sum);
	}
	handlerChange(value) {
		var start = 1;
		if (value > Math.floor(this.state.showNum) / 2 && value < this.props.sum - Math.floor(this.state.showNum / 2 - 1)) {
			start = value - Math.floor(this.state.showNum / 2);
		}
		if (value <= Math.floor(this.state.showNum / 2)) {
			start = 1;
		}
		if (value >= this.props.sum - Math.floor(this.state.showNum / 2)) {
			start = this.props.sum - this.state.showNum + 1;
		}
		this.setState({
			index: value,
			start: start,
			inputValue: value
		});
		this.props.change(value);
	}
	_input(e) {
		var value = e.target.value,
			num = parseInt(value) || '';
		if (num < 1 && num !== '')
			num = 1;
		if (num > this.props.sum)
			num = this.props.sum;
		this.setState({
			inputValue: num
		});
	}
	_keyPress(e) {
		var keyCode = e.charCode,
			index = this.state.inputValue;
		if (keyCode == 13) {
			if (index !== '') {
				this.handlerChange(index);
			}
		}
	}
	render() {
		var sum = this.props.sum,
			showNum = sum;

		if (showNum > this.props.length) {
			showNum = this.props.length;
		}
		return (
			<div className="BluMUI_PT" >
				<span className="allNum">{'共' + this.props.total + '条记录'}</span>
				{
					showNum > 0 && sum > 1 &&
					<button id="topPage" className="toTop" onClick={this.handlerTop}>
						{this.props.topName}
					</button>

				}
				{
					this.state.index != 1 && showNum > 0 && sum > 1 &&
					<button id='lastPage' onClick={this.handlerLast} className="last">{this.props.lastName}
					</button>
				}
				{
					showNum > 0 && sum > 1 &&
					<BluMUI_PT_LI change={this.handlerChange} showNum={showNum} index={this.state.index} start={this.state.start} />
				}

				{
					showNum > 0 && sum > 1 &&
					<div className="inputWarp">
						<input type="text"
							value={this.state.inputValue}
							onInput={this._input.bind(this)}
							onKeyPress={this._keyPress.bind(this)}
						/>
						<span className="sum">{'\\' + this.props.sum}</span>
					</div>
				}
				{showNum > 0 && sum > 1 && this.state.index !== this.props.sum && <button id="nextPage" onClick={this.handlerNext} className="next">{this.props.nextName}</button>}
				{showNum > 0 && sum > 1 &&
					<button id="bottomPage" onClick={this.handlerBottom} className="toBottom">{this.props.bottomName}</button>
				}
			</div>
		);
	}
}

class WpEditorTitle extends React.Component {
	render() {
		var { courseName, teamName } = this.props;
		return (
			<p className="warp">
				<span className="courseName">{'网评批次:' + courseName}</span>
				<span className="teamName">{'分组项 : ' + teamName}</span>
			</p>
		);
	}
}
class Radio extends React.Component {
	constructor(props) {
		super(props);
	}
	_click() {
		var select = !this.props.select;
		if (this.props.callback)
			this.props.callback(select, this.props.index);
	}
	render() {
		var { select } = this.props;
		return (
			<div className={select ? "radio-selected" : "radio"} onClick={this._click.bind(this)}></div>
		);
	}
}
class EditorList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			items: this.props.items || [],
			selects: [],// 列表
			selected: false, // 全选按钮
			college: this.props.college,
			center: this.props.center,
			PT: this.props.PT
		};
		this._clickOpera = this._clickOpera.bind(this);
		this.createList = this.createList.bind(this);
		this.selectChange = this.selectChange.bind(this);
		this._search = this._search.bind(this);
		this.key = this.key.bind(this);
	}
	componentWillMount() {
		var i,
			len = this.props.items.length,
			result = [];
		for (i = 0; i < len; i++) {
			result[i] = false;
		}
		this.setState({
			selects: result
		});
	}
	selectChange(select, index) {
		var selects = this.state.selects;
		selects[index] = select;
		this.setState({
			selects: selects
		});
	}
	_clickOpera(item, index) {
		var that = this;
		return function () {
			item.callback(item.name, index, that);
		};
	}
	createCourseSpan(items) {
		var num = items.length,
			len = num,
			i,
			str = '',
			result = [];

		for (i = 0; i < len; i++) {
			str += items[i] + ' ';
		}
		result.push(<span key={2}>
			{str}
		</span>);
		return result;
	}
	createOperation(operaions, index) {
		var i,
			len = operaions.length,
			result = [];
		for (i = 0; i < len; i++) {
			result.push(
				<span className="operaBtn"
					key={i}
					onClick={this._clickOpera(operaions[i], index)}>
					{operaions[i].name}
				</span>
			)
		}
		return result;
	}
	createList(items) {
		var i,
			len = items.length,
			result = [],
			operaions = this.props.operaions,
			selects = this.state.selects;
		for (i = 0; i < len; i++) {
			result.push(
				<ul className="List" key={i}>
					<li><Radio select={selects[i]} index={i} callback={this.selectChange} /></li>
					<li className="courseName" title={items[i].courseName}>{items[i].courseName}</li>
					<li className="courseId" title={items[i].courseId}>{items[i].courseId}</li>
					<li className="college" title={items[i].college}>{items[i].college}</li>
					<li className="center" title={items[i].center}>{items[i].center}</li>
					<li className="opera" title={this.createOperation(operaions, i)}>{this.createOperation(operaions, i)}</li>
				</ul>

			);
		}
		return result;
	}
	clickAll(select) {
		var i,
			selects = this.state.selects,
			len = selects.length;
		for (i = 0; i < len; i++) {
			selects[i] = select;
		}
		this.setState({
			selected: select,
			selects: selects
		});
	}
	_search(e) {
		let [college = '', department = '', courseName = ''] = [this.college.value, this.department.value, this.searchInput.value.trim()];
		this.props.search(college, department, courseName);
	}

	_titleCallback(value) {
		this.props.titleCallback(value, this);
	}

	key(e) {
		if (e.keyCode == 13) {
			this._search();
		}
	}

	render() {
		var { titleName, titleIcon, id, name } = this.props;
		var { selected, college, center, PT } = this.state;
		return (
			<div id={id}>
				<div className="titleWarp">

					<span onClick={this._titleCallback.bind(this, titleName)} className="title">{titleName}</span>
					<span onClick={this._titleCallback.bind(this, titleName)} className={"btn " + id} style={{ backgroundImage: 'url(' + titleIcon + ')' }}></span>
					<span className="WarpTitle">{name}</span>
				</div>
				{
					college &&
					<div className="titleWarp">
						<span className="selectTitle">开课学院</span>
						<select name="college" id="filter_college" ref={(college) => this.college = college}>
							<option value="">请选择学院</option>
						</select>
						{/* <BluMUI_Drop {...college} /> */}
						<span className="selectTitle">系部中心</span>
						<select name="department" id="filter_department" ref={department => this.department = department} onChange={this._search}>
							<option value="">请选择系部中心</option>
						</select>
						{/* <BluMUI_Drop {...center} /> */}
						<span className="selectTitle">课程名称</span>
						<input type="text" className="searchInput" ref={(searchInput) => { this.searchInput = searchInput; }} onKeyDown={this.key} />
						<button className="searchBtn" onClick={this._search.bind(this)}>搜索</button>
					</div>
				}
				<div className="ListWarp" >
					<ul className="headerLine">
						<li><Radio select={selected} callback={this.clickAll.bind(this)} /></li>
						<li className="courseName">课程名称</li>
						<li className="courseId">课程编号</li>
						<li className="college">开课学院</li>
						<li className="center">系部中心</li>
						<li className="opera">操作</li>
					</ul>
					<div className="bodyList">
						{this.createList(this.state.items)}
					</div>
				</div>
				{
					PT &&
					<div style={{ textAlign: 'center' }}>
						<BluMUI_PT {...PT} />
					</div>
				}

			</div>
		);
	}
	componentDidMount() {
		// 获取学院
		ajax({
			url: courseCenter.host + "getCollege",
			data: {
				unifyCode: getCookie("userId")
			},
			success: (gets) => {
				let datas = JSON.parse(gets);
				if (datas.meta.result == 100) {
					this.college &&
						datas.data.map((e, index) => {
							this.college.innerHTML += `<option value=${e.kkxymc}>${e.kkxymc}</option>`;
						});
				}
			}
		});


		// 选定学院后获取专业并填充
		if (this.college) {
			this.college.onchange = (e) => {
				this.department.innerHTML = "<option value=''>请选择系部中心</option>";
				this._search();
				this.college.value &&
					ajax({
						url: courseCenter.host + "getCourseDepartment",
						data: {
							unifyCode: getCookie("userId"),
							college: this.college.value
						},
						success: (gets) => {
							let datas = JSON.parse(gets);
							if (datas.meta.result == 100) {
								datas.data.map((e, index) => {
									this.department.innerHTML += `<option value=${e.jysmc}>${e.jysmc}</option>`;
								});
							}
						}
					});
			}
		}

	}
}
var BluMUI_M = {
	WpEditorTitle: WpEditorTitle,
	EditorList: EditorList
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
