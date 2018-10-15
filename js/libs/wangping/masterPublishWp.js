import React from 'react';
import ReactDOM from 'react-dom';

class DateInput extends React.Component{
	constructor(props){
		super(props);
		var time = new Date();
		this.state = { // 拿到当前月份
			m:time.getMonth() + 1,
			y:time.getFullYear(),
			d:time.getDate(),
			h:this.props.initHours || '00',
			f:this.props.initFen || '00',
			s:this.props.initSecond || '00',
			time:''
		}
	}
	_change(type,num){
		var newDate = {};
		newDate[type] = num;
		this.setState(newDate);
	}
	_click(type,num){
		switch (type){
			case 'm':
				if(num < 1)
					num = 1;
				if(num > 12)
					num =12;
				break;
			case 'y':
				if(num < 2017){
					num = 2017;
				}
				if( num > 10000){
					num = 9999;
				}

				break;
		}
		this._change(type,num);
	}
	_input(type,e){
		var value = +e.target.value;
		if(value != value){
			value = '';
		}
		switch (type){
			case 'h':
				if( value <= 0 || value > 23){
					value = '00';
				}
				break;
			case 's':
			case 'f':
				if(value <= 0 || value > 59 ){
					value = '00';
				}
				break;
		}
		if(value > 0 && value < 10){
			value = '0' + value;
		}
		this._change(type,value);
	}
	_choiceDate(day){
		this.setState({
			d:day
		})
	}
	_createDate(){
		var result = [];

		var firstDayWeek = new Date(this.state.y,this.state.m - 1 , 1).getDay(),
			MonsDays =  new Date(this.state.y,this.state.m, 0).getDate();
		var start =  firstDayWeek ,
			end = start + MonsDays,
			i;
		for( i = 0 ; i < end ; i++){
			if(i>=start){
				result.push(
					<li key={i} onClick={this._choiceDate.bind(this,i-start+1)} className={this.state.d == i-start + 1?"selected has":"has"}>{i-start+1}</li>
				);
			}else{
				result.push(
					<li key={i}></li>
				);
			}

		}
		return (
			<div>
				<ul className="titleList" key ={0}>
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
	_reset(){
		var time = new Date();
		this.setState({
			m:time.getMonth() + 1,
			y:time.getFullYear(),
			d:time.getDate(),
			h:this.props.initHours || '00',
			f:this.props.initFen || '00',
			s:this.props.initSecond || '00'
		})
	}
	_sure(){
		let { m , y , h, f, s , d} = this.state;
		let time = y + '-' + m + '-' + d + ' ' + h + ':' + f + ':' + s;
		this.props.callback(time,this.props.name);
	}
	render(){
		let { m , y , h, f, s} = this.state;
		return (
			<div className="BlueMUI_Date" >
				<div className="header">
					<div className="selectWarp">
						<button className="last" onClick={this._click.bind(this,'y',y - 1)}/>
						<span>{y + '年'}</span>
						<button className="next" onClick={this._click.bind(this,'y',y + 1)}/>
					</div>
					<div className="selectWarp">
						<button className="last" onClick={this._click.bind(this,'m',m - 1)}/>
						<span>{m + '月'}</span>
						<button className="next" onClick={this._click.bind(this,'m',m + 1)}/>
					</div>
				</div>
				<div className="body">
					{this._createDate()}
				</div>
				<div className="footer">
					<div className="timer">
						<input className="time" type="text"  onInput={this._input.bind(this,'h')} value={h} />
						<span>:</span>
						<input className="time" type="text"  onInput={this._input.bind(this,'f')} value={f}/>
						<span>:</span>
						<input className="time" type="text"  onInput={this._input.bind(this,'s')} value={s}/>
					</div>
					<button className="sure" onClick={this._sure.bind(this)}>确定</button>
					<button className="reset" onClick={this._reset.bind(this)}>重置</button>
				</div>
			</div>
		);
	}
}
class BluMUI_FileUp extends React.Component{
	constructor(props){
		super(props);
		this._warn=this._warn.bind(this);
	}
	_warn(e){
		var files = e.target.files,
			warn,
			i,
			len = files.length;
		if(len > 0){
			for( i = 0 ; i  < len ; i++){
				if(i === 0)
					warn = files[i].name;
				else
					warn += ';' + files[i].name;
			}
		}
		else{
			warn='没选择文件';
		}
		this.warnBox.innerHTML = warn;
	}
	render(){
		return(
			<div className="BluMUI_FileUp">
				<div className="fileArea">
					<div className="fileInput" >
						<span>浏览</span>
						<input type="file"
								 id={this.props.fileId}
								 name={this.props.fileFormName}
								 onChange={this._warn}
								 multiple={true}
						/>
					</div>
					<span ref={(warnBox)=>(this.warnBox = warnBox)} className="file-warn" id={this.props.warnId || "warn"} >未选择文件</span>
				</div>
			</div>
		)
	}
}
class BluMUI_Drop extends React.Component{
	constructor(props){
		super(props);
		this.state={
			select:0
		};
		this.handlerShow=this.handlerShow.bind(this);
		this.handlerClick=this.handlerClick.bind(this);
	}
	handlerClick(item){
		var that = this;
		return function () {
			that.props.callback(item);
			that.setState({
				select:0
			});

		}
	}
	handlerShow(prevState){
		if(this.state.select==1 || this.props.disabled)
			this.setState({select:0});
		else
			this.setState({select:1});
	}

	render(){
		var that=this,
			items = this.props.items,
			props=this.props,
			id=props.id,
			inputName=props.inputName;

		return(
			<div className={this.props.disabled?"BluMUI_Drop disabled":"BluMUI_Drop"}
				  id={id}
			>
			<span onClick={this.handlerShow}>
				{this.props.value || this.props.initName}
			</span>
				{this.state.select==1&&
				<ul className="body">
					{items.length>0&&
					items.map((item,index)=>
						<li key={index}
							 onClick={that.handlerClick(item)}
						>
							<a>{item.name}</a>
						</li>
					)
					}
				</ul>
				}
				<input name={inputName}
						 type="hidden" value={this.props.value || this.props.initvalue}
						 id={inputName}>
				</input>
			</div>
		);
	}
}
class Form extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			lspc:{
				options:this.props.lspcOptions,
				value:'',
				warn:'',
				pattern:/^\S{1,}$/,
			},
			pc:{
				value:this.props.pc || '',
				warn:'',
				pattern:/^\S{1,}$/
			},
			lb:{
				value:this.props.lb || '',
				warn:'',
				pattern:/^\S{1,}$/,
				options:this.props.lbOptions
			},
			bz:{
				value:this.props.bz || '',
				warn:''
			},
			zb:{
				value:this.props.zb || '',
				warn:'',
				pattern:/^\S{1,}$/,
				options:this.props.zbOptions
			},
			zj:{
				value:this.props.zj || '',
				warn:'',
				pattern:/^\S{1,}$/,
				options:this.props.zjOptions
			},
			startTime:{
				value:this.props.startTime || '',
				warn:'',
				pattern:/^[\S\s]{1,}$/,
				date:false
			},
			endTime:{
				value:this.props.endTime || '',
				warn:'',
				pattern:/^[\S\s]{1,}$/,
				date:false
			},
			fileData:[],
			fileList:this.props.files || [],
			radioSelect:0
		};
		this._check = this._check.bind(this);
		this._input = this._input.bind(this);
		this._select = this._select.bind(this);
		this._createList = this._createList.bind(this);
	}
	_input(name){
		var that = this;
		return function (e) {
			var value = e.target.value,
				newState = that.state[name];
			newState.value = value,
				newState.warn = that._check(name,value);
			that.setState(newState);
		}
	}
	_select(name){
		var that = this;
		return function(item){
			var newState = that.state[name];
			newState.value = item.name;
			that.setState(newState);
			if(name === 'zj'){
				that.props.choiceZJ(item.name);
			}
		};
	}
	_check(name,value){
		var pattern = this.state[name].pattern,
			warn = '';
		if(pattern!==''&&pattern!==undefined&&!pattern.test(value)){
			switch (name){
				case 'pc':
					warn = '网评批次为空';
					break;
				case 'zj':
				case 'zb':
				case 'lb':
					warn = '未选择';
					break;
				// case 'lspc':
				// 	if(this.props.radioSelect === 1){
				// 		warn = '未选择';
				// 	}
				// 	break;
				case 'endTime':
				case 'startTime':
					warn = '未选择日期';
					break;
				default:
					break;
			}
		}
		if(name === 'endTime'){
			if(+new Date(value) <= +new Date(this.state.startTime.value))
				warn = '结束时间不得小于等于开始时间';
		}
		return warn;
	}
	_submit(){
		var { pc ,lb ,zb , zj ,bz ,startTime ,endTime ,lspc , fileData } = this.state;
		var flag = true,
			warn = '',
			inputState = {  pc ,lb ,zb , zj ,bz ,startTime ,endTime,lspc};
		for( var key in inputState){
			var newState = this.state[key];
			warn = this._check(key,this.state[key].value);
			newState.warn = warn;
			this.setState(newState);
			if(warn !== '')
				flag = false;
		};
		var data = {
			name:{
				value:pc.value,
				pattern:''
			},
			type:{
				value:lb.value
			},
			start:{
				value:+new Date(startTime.value)/1000
			},
			end:{
				value:+new Date(endTime.value)/1000
			},
			targetBatch:{
				value:zb.value
			},
			expertGroup:{
				value:zj.value
			},
			historyGroup:{
				value:2
			},
			historyReviewID:{
				value:''
			},
			note:{
				value:bz.value
			}
		};
		if (fileData && fileData.length > 0) {
			data.files = {
				value:fileData,
				dataType:'file',
				isEmpileFile:true
			};
		}
		if(flag)
			this.props.ajax(data, this.state.fileList);
	}
	_showDate(type){
		if(this.props.edit !== 'none'){
			if(type == "startTime"){
				var startTime = this.state.startTime,
					endTime = this.state.endTime;
				startTime.date = !startTime.date;
				endTime.date = false;
				this.setState({
					startTime:startTime,
					endTime:endTime
				});
			}else{
				var startTime = this.state.startTime,
					endTime = this.state.endTime;
				startTime.date = false;
				endTime.date = !endTime.date;
				this.setState({
					startTime:startTime,
					endTime:endTime
				});
			}
		}
	}
	_sureDate(time,type){
		var newState = this.state[type];
		newState.value = time;
		newState.date = false;
		this.setState(newState);
	}
	uploadFile(){
		var fileIput =  document.getElementById('file'),
			files = fileIput.files,
			curLen = files.length,
			curFileData = this.state.fileData,
			fileList = this.state.fileList,
			start = curFileData.length,
			end = curLen + start,
			len = fileList.length,
			t,
			i,
			flag = true;
		for( i = start; i < end ; i ++ ){
			flag = true;
			for(t = 0; t < len; t++){
				if(fileList[t].originalName === files[i-start].name){
					flag = false;
					break;
				}
			}
			if(flag) {
				curFileData[i] = files[i-start];
				fileList.push({
					originalName:files[i-start].name,
					filename: files[i-start].filename
				});
			}
		}
		this.setState({
			fileData:curFileData
		});
		setTimeout(function () {
			if(window.frameElement) {
				window.frameElement.height = document.documentElement.offsetHeight;
			}
		},0);
	}
	_createList(items){
		var i,
			len = items.length,
			result = [],
			{ edit } = this.props;

		for( i = 0 ; i < len ; i++){
			result.push(
				<li key = {i}>
					<span className="fileName" title={items[i].originalName}>{items[i].originalName}</span>
					{edit!== 'none'&&
					< span className="delete" onClick={this.props.deleteFile.bind(this,items[i],i)}>删除</span>
					}
				</li>
			)
		}
		return result;
	}
	_click(type){
		this.setState({
			radioSelect:type
		})
	}
	_back(){
		window.location.href = 'wpgl.html';
	}
	render(){
		var { pc ,lb ,zb , zj ,bz ,startTime ,endTime ,fileList ,lspc  } = this.state;
		var { edit,isEditor } = this.props;
		return(
			<div className="formWarp">
				<p className="formWarp-title" >{isEditor ? '编辑网评' : '发起网评' }</p>
				<div className="inputWarp">
					<span className="title titleM small-title-m">网评批次:</span>
					<input  disabled={edit === 'none'?true:false} className="text" type="text" value={pc.value} onInput={this._input('pc')}/>
					<span className="warn">{pc.warn}</span>
				</div>
				<div className="inputWarp">
					<span className="title titleM small-title-m">网评类别:</span>
					<BluMUI_Drop  { ...lb.options } value={lb.value} callback={this._select('lb')} disabled={edit === 'none'?true:false} />
					<span className="warn">{lb.warn}</span>
				</div>
				<div className="inputWarp" >
					<span className="title">开始时间:</span>
					<div className={edit === "none"?"text disabled":"text"} type="date" onInput={this._input('startTime')}>
						<span className="timeText">{startTime.value || '请选择日期'}</span>
						<span className="dateIcon" onClick={this._showDate.bind(this,'startTime')}></span>
						{
							startTime.date&&
							<DateInput disabled={edit === 'none'?true:false} name="startTime" callback = {this._sureDate.bind(this)}/>
						}
					</div>
					<span className="warn">{startTime.warn}</span>
				</div>
				<div className="inputWarp">
					<span className="title" >结束时间:</span>
					<div className={edit === "none"?"text disabled":"text"}  type="date"  onInput={this._input('endTime')} >
						<span className="timeText">{endTime.value || '请选择日期'}</span>
						<span className="dateIcon" onClick={this._showDate.bind(this,'endTime')}></span>
						{
							endTime.date&&
							<DateInput initHours="23" initFen="59" initSecond="59" disabled={edit === 'none'?true:false} name="endTime" callback = {this._sureDate.bind(this)}/>
						}
					</div>
					<span className="warn">{endTime.warn}</span>
				</div>
				<div className="inputWarp">
					<span className="title titleM small-title-m">指标批次:</span>
					<BluMUI_Drop {...zb.options }  value={zb.value} disabled={edit === 'none'?true:false}  callback={this._select('zb')}/>
					<span className="warn">{zb.warn}</span>
				</div>
				<div className="inputWarp">
					<span className="title titleM">专家分组批次:</span>
					<BluMUI_Drop { ...zj.options } value={zj.value} callback={this._select('zj')} disabled={edit === 'none' || edit === 'one'?true:false}  />
					<span className="warn">{zj.warn}</span>
				</div>
				{/*{edit !== 'none'&&*/}
				{/*<div className="inputWarp">*/}
				{/*<span className="title">历史课程分组:</span>*/}
				{/*<span className={this.state.radioSelect === 0 ? "selected-radio" : "radio"}*/}
				{/*onClick={this._click.bind(this, 0)}/>*/}
				{/*<span className="radioTitle">否</span>*/}
				{/*<span className={this.state.radioSelect === 1 ? "selected-radio" : "radio"}*/}
				{/*onClick={this._click.bind(this, 1)}/>*/}
				{/*<span className="radioTitle">是</span>*/}
				{/*</div>*/}
				{/*}*/}
				{/*{this.state.radioSelect === 1&&*/}
				{/*<div className="inputWarp">*/}
				{/*<span className="title">历史网评批次:</span>*/}
				{/*<BluMUI_Drop { ...lspc.options } value={lspc.value} disabled={edit === 'none' || edit === 'one' ? true : false} callback={this._select('lspc')}/>*/}
				{/*<span className="warn">{lspc.warn}</span>*/}
				{/*</div>*/}
				{/*}*/}
				<div className="inputWarp" style={{height:'126px'}}>
					<span className="floatTitle">备注:</span>
					<textarea disabled={edit === 'none'?true:false} className="textarea" onInput={this._input('bz')}/>
					<span className="warn">{bz.warn}</span>
				</div>
				<div className="inputWarp">
					<span className="floatTitle" style={{marginTop:7}}>附件:</span>
					{
						edit !== 'none'&&
						<BluMUI_FileUp fileId="file" fileFormName="form"/>
					}
					{
						edit === 'none'&&fileList.length === 0&&
						<span style={{marginTop:5,marginLeft:17,float:'left'}}>无</span>
					}
				</div>
				{ edit !== 'none' &&
				<div className="btnWarp">
					<button className="btn left" onClick={this.uploadFile.bind(this)}>添加</button>
				</div>
				}
				<ul className="fileList">
					{this._createList(fileList)}
				</ul>
				<div className="btnWarp">
					<button className="btn left" onClick={this._submit.bind(this)}>确定</button>
					<button className="btn right" onClick={this._back}>返回</button>
				</div>
			</div>
		)
	}
}

// 日期组件测试版本

var BluMUI_M={
	Form:Form,
	DateInput:DateInput
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
