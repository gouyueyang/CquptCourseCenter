import React from 'react';

export default class DateInput extends React.Component {
	constructor(props) {
		super(props);
		var time = this.props.time || new Date();
		this.isUpdateTime = this.props.isUpdateTime || { h: true, f: true, s: true };
		this.state = { // 拿到当前月份
			m: time.getMonth() + 1,
			y: time.getFullYear(),
			d: time.getDate(),
			h: time.getHours() < 10 ? "0" + time.getHours() : time.getHours(),
			f: time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes(),
			s: time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds(),
			time: '',
		}
	}
	_change(type, num) {
		var newDate = {};
		newDate[type] = num;
		this.setState(newDate);
	}
	_click(type, num) {
		switch (type) {
			case 'm':
				if (num < 1)
					num = 1;
				if (num > 12)
					num = 12;
				break;
			case 'y':
				if (num < 2017) {
					num = 2017;
				}
				if (num > 10000) {
					num = 9999;
				}

				break;
		}
		this._change(type, num);
	}
	_input(type, e) {
		var value = +e.target.value;
		if (value != value) {
			value = '';
		}
		switch (type) {
			case 'h':
				if (value <= 0 || value > 23) {
					value = '00';
				}
				break;
			case 's':
			case 'f':
				if (value <= 0 || value > 59) {
					value = '00';
				}
				break;
		}
		if (value > 0 && value < 10) {
			value = '0' + value;
		}
		this._change(type, value);
	}
	_choiceDate(day) {
		this.setState({
			d: day
		})
	}
	_createDate() {
		var result = [];

		var firstDayWeek = new Date(this.state.y, this.state.m - 1, 1).getDay(),
			MonsDays = new Date(this.state.y, this.state.m, 0).getDate();
		var start = firstDayWeek,
			end = start + MonsDays,
			i;
		for (i = 0; i < end; i++) {
			if (i >= start) {
				result.push(
					<li key={i} onClick={this._choiceDate.bind(this, i - start + 1)} className={this.state.d == i - start + 1 ? "selected has" : "has"}>{i - start + 1}</li>
				);
			} else {
				result.push(
					<li key={i}></li>
				);
			}

		}
		return (
			<div>
				<ul className="titleList" key={0}>
					<li>日</li>
					<li>一</li>
					<li>二</li>
					<li>三</li>
					<li>四</li>
					<li>五</li>
					<li>六</li>
				</ul>
				<ul className="dateList">
					{result}
				</ul>
			</div>
		);
	}
	_reset() {
		var time = new Date();
		this.setState({
			m: time.getMonth() + 1,
			y: time.getFullYear(),
			d: time.getDate(),
			h: this.props.initHours || '00',
			f: this.props.initFen || '00',
			s: this.props.initSecond || '00'
		})
	}
	_sure() {
		let { m, y, h, f, s, d } = this.state;
		let time = y + '-' + m + '-' + d + ' ' + h + ':' + f + ':' + s;
		this.props.callback(time, this.props.name);
	}
	render() {
		let { m, y, h, f, s } = this.state;
		return (
			<div id="BlueMUI_Date" >
				<div className="header">
					<div className="selectWarp">
						<button className="last" onClick={this._click.bind(this, 'y', y - 1)} />
						<span>{y + '年'}</span>
						<button className="next" onClick={this._click.bind(this, 'y', y + 1)} />
					</div>
					<div className="selectWarp">
						<button className="last" onClick={this._click.bind(this, 'm', m - 1)} />
						<span>{m + '月'}</span>
						<button className="next" onClick={this._click.bind(this, 'm', m + 1)} />
					</div>
				</div>
				<div className="body">
					{this._createDate()}
				</div>
				<div className="footer">
					<div className="timer">
						<input className="time" type="text" onInput={this._input.bind(this, 'h')} value={h} disabled={!this.isUpdateTime.h} />
						<span>:</span>
						<input className="time" type="text" onInput={this._input.bind(this, 'f')} value={f} disabled={!this.isUpdateTime.f} />
						<span>:</span>
						<input className="time" type="text" onInput={this._input.bind(this, 's')} value={s} disabled={!this.isUpdateTime.s} />
					</div>
					<button className="sure" onClick={this._sure.bind(this)}>确定</button>
					<button className="reset" onClick={this._reset.bind(this)}>重置</button>
				</div>
			</div>
		);
	}
}