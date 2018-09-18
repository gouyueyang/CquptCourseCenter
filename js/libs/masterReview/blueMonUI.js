import React from 'react';
import ReactDOM from 'react-dom';
class BluMUI_Drop extends React.Component{
	constructor(props){
		super(props);
		this.state={
			select:0,
			showNum:0,
			move:0,
			bodyMargin:0,
			barMargin:0,
			startPos:0,
			endBarMargin:0,
			endBodyMargin:0
		};
		this.handlerShow=this.handlerShow.bind(this);
		this.handlerClick=this.handlerClick.bind(this);
		this.handlerScroll=this.handlerScroll.bind(this);
		this.handlerMouseDown=this.handlerMouseDown.bind(this);
		this.handlerMouseMove=this.handlerMouseMove.bind(this);
		this.handlerMouseUp=this.handlerMouseUp.bind(this);
		this.handlerMouseOff=this.handlerMouseOff.bind(this);
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
	handlerScroll(e,prevState){
		var dis= this.props.items.length-this.props.max;
		if(dis>0){
			if(e.deltaY>0){
				if(this.state.barMargin<=dis*this.props.optionH/4-2)
					this.setState((prevState,props) => ({
						barMargin:prevState.barMargin+2,
						bodyMargin:prevState.bodyMargin-8
					}));
				else{
					this.setState((prevState,props) => ({
						barMargin:dis*(this.props.optionH)/4,
						bodyMargin:-dis*(this.props.optionH)
					}));
				}
			}
			if(e.deltaY<0){
				if(this.state.barMargin>=2) {
					this.setState((prevState, props) => ({
						barMargin: prevState.barMargin - 2,
						bodyMargin: prevState.bodyMargin + 8
					}));
				}
				else {
					this.setState((prevState,props) => ({
						barMargin:0,
						bodyMargin:0
					}));
				}
			}
		}
	}
	handlerMouseDown(e){
		this.setState({
			move:1,
			startPos:e.clientY,
			endBarMargin:this.state.barMargin,
			endBodyMargin:this.state.bodyMargin
		});
	}
	handlerMouseMove(e){
		if(this.state.move==1){
			var ydis=e.clientY-this.state.startPos,
				dis=this.props.items.length-this.props.max;
			if(ydis>0){
				if(this.state.endBarMargin+ydis<dis*this.props.optionH/4)
					this.setState({
						barMargin:this.state.endBarMargin+ydis,
						bodyMargin:this.state.endBodyMargin-ydis*4
					});
				else{
					this.setState({
						barMargin:dis*(this.props.optionH)/4,
						bodyMargin:-dis*(this.props.optionH),
						startPos:e.clientY,
						endBarMargin:this.state.barMargin,
						endBodyMargin:this.state.bodyMargin
					});
				}
			}
			else{
				if(this.state.endBarMargin+ydis>0)
					this.setState({barMargin:this.state.endBarMargin+ydis,bodyMargin:this.state.endBodyMargin-ydis*4});
				else {
					this.setState({
						barMargin:0,
						bodyMargin:0,
						startPos:e.clientY,
						endBarMargin:this.state.barMargin,
						endBodyMargin:this.state.bodyMargin
					});
				}
			}
		}
	}
	handlerMouseUp(){
		this.setState({move:0});
	}
	handlerMouseOff(){
		this.setState({move:0});
	}
	render(){
		var showNum,
			that=this,
			items = this.props.items,
			props=this.props,
			id=props.id,
			inputName=props.inputName,
			bodyH=items.length*this.props.optionH;

		if(this.props.max<=this.props.items.length){
			showNum = this.props.max;
			scroll = 1;
		}
		else{
			showNum = this.props.items.length;
			scroll = 0;
		}
		var scrollH=showNum*this.props.optionH,
			barH=scrollH-(bodyH-scrollH)/4>this.props.minbarH?scrollH-(bodyH-scrollH)/4:this.props.minbarH;
		return(
			<div className={this.props.disabled?"BluMUI_Drop disabled":"BluMUI_Drop"}
				  id={id}
			>
			<span onClick={this.handlerShow}>
				{this.props.value || '请选择'}
			</span>
				{this.state.select==1&&
				<div className="selectArea"
					  id="selectArea"
					  style={{height:scrollH+'px'}}
					  onWheel={this.handlerScroll}
					  onMouseMove={this.handlerMouseMove}
					  onMouseUp={this.handlerMouseUp}
					  onMouseOut={this.handlerMouseOff}>
					<ul className="body" style={{
						width:showNum<items.length?'90'+"%":'100'+"%",
						marginTop:this.state.bodyMargin+'px'
					}}>
						{items.length>0&&
						items.map((item,index)=>
							<li key={index}
								 onClick={that.handlerClick(item)}
							>
								{item.name}
							</li>
						)
						}
					</ul>
					<div id="scroll">
						<button
							id="bar"
							style={{
								height:barH+'px',
								marginTop:this.state.barMargin+'px'
							}}
							onMouseDown={this.handlerMouseDown}>
						</button>
					</div>
				</div>
				}
				<input name={inputName}
						 type="hidden" value={this.props.value || this.props.initvalue}
						 id={inputName}>
				</input>
			</div>
		);
	}
}
class BluMUI_InputNumber extends  React.Component {
	constructor(props){
		super(props);
		this.state = {
			number: this.props.number || 0
		};
		this._change = this._change.bind(this);
	}
	_input(e){
		var value = e.target.value,
			num = parseInt(value) || 0,
			max = this.props.max;
		if(num > max )
			num = max ;
		this.props.update(num,this.props.index);
		console.log(max, num, value);
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
	componentWillReceiveProps(nextProps) {
		if (nextProps.number !== this.state.number) {
			this.setState({
				number: nextProps.number
			});
		}
	}
	render(){
		return(
			<div className="InputNumber">
				<input type="text"  onInput={this._input.bind(this)} value={this.state.number}/>
				<div className="numberControl">
					<button className="up" onClick={this._change(1)}/>
					<button className="down" onClick={this._change(-1)}/>
				</div>
			</div>
		);
	}
}
class BluMUI_NavList extends  React.Component{
	constructor(props) {
		super(props);
		this.state = {
			items: this.props.items,
			index: this.props.index
		}
		this._onClick = this._onClick.bind(this);
	}
	_onClick(index){
		var that = this ;
		return function () {
			that.setState(
				{
					index:index
				}
			)
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
					 className={this.state.index==i?'selected':''}
					 onClick={this._onClick(i)}
					 data-key={i}>
					<a>{this.state.items[i].name}</a>
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
					<span>{source[i].num}</span>
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
class BluMUI_ReviewModule extends React.Component{
	render(){
		var { name , reviewDesc , totalScore , curScore ,update ,index, score, isEditor} = this.props;
		return(
			<div className="ReviewModule">
				<div>
					<p className="moduleName">{name}</p>
				</div>
				<div className="moduleBody">
					<p className="reviewDesc">
						{'评审标准：' + reviewDesc}
					</p>
					<span className={isEditor ? "totalScore": "totalScore-noeditoer"}>
						{'总分：' + totalScore}
					</span>
					<span className="curScore">
						{'已评分：' + curScore}
					</span>
					{
						isEditor&&
						<span className="score">
							评分：
						</span>
					}
					{
						isEditor&&
						<BluMUI_InputNumber
							number={score}
							index = {index}
							max = {totalScore}
							update={update}
						/>
					}
				</div>
			</div>
		);
	}
}
class BluMUI_ReviewCourse extends  React.Component{
	constructor(props){
		super(props);
		this.state = {
			courseScore:this.props.courseScore,
			courseName:this.props.courseName,
			courseMoudule:this.props.courseMoudule,
			courseReview: '',
			isEditor: true
		};
		this._updateTotalScore = this._updateTotalScore.bind(this);
		this._createModule = this._createModule.bind(this);
	}
	_createModule(modules){
		var i,
			len = modules.length,
			result = [];
		for( i = 0 ; i < len ; i++ ){
			result.push(
				<BluMUI_ReviewModule key={i}  isEditor={this.state.isEditor} index = {i} update = {this._updateTotalScore} {...modules[i]}/>
			)
		}
		return result;
	}
	_updateTotalScore(score,index){
		var courseMoudule = this.state.courseMoudule,
			len = courseMoudule.length,
			i,
			courseScore = 0;
		courseMoudule[index].score = score;
		for( i = 0 ; i < len ; i++){
			courseScore += courseMoudule[i].score
		}
		this.setState({
			courseScore:courseScore
		});
	}
	ajax(type){
		var courseMoudule = this.state.courseMoudule,
			len = courseMoudule.length,
			i,
			zbx = [],
			score = [];
		for( i = 0 ; i < len ; i++){
			zbx.push(courseMoudule[i].name);
			score.push(courseMoudule[i].score);
		}
		var data = {
			score:score.join(','),
			zbx:zbx.join(','),
			evaluation:this.reviewInput.value,
			type:type
		};
		this.props.submit(data,type);
	}
	render(){
		var { courseScore,courseName,courseMoudule, courseReview, isEditor } = this.state;
		return (
			<div>
				{
					courseMoudule.length>0 &&
					<div>
						<div className="contenWarp">
							<div className="scoreWarp">
								<span className="scoretitle">评分</span>
								<span className="name">{'课程名称：' + courseName}</span>
								<span className="score">{'该课程的评分：' + courseScore}</span>
							</div>
							<div className="scoreModuleWarp">
								{this._createModule(courseMoudule)}
							</div>
						</div>
						<div className="reviewArea">
							<p className="reviewTitle">评价</p>
							{
								isEditor&&
								<textarea
									ref ={(input)=>{this.reviewInput = input}}
									onInput={(e) => {this.setState({courseReview: e.target.value})} }
									value={courseReview}
								></textarea>
							}
							{
								!isEditor&&
								<textarea
									disabled
									ref ={(input)=>{this.reviewInput = input}}
									onInput={(e) => {this.setState({courseReview: e.target.value})} }
									value={courseReview}
								></textarea>
							}
							<p className="warn">保存后内容可以修改，提交后评价生效，不可修改</p>
						</div>
						{
							isEditor&&
							<div className="btnWarp">
								<button className="left" onClick={this.ajax.bind(this,1)}>保存</button>
								<button className="right" onClick={this.ajax.bind(this,2)}>提交</button>
							</div>
						}
					</div>
				}
			</div>
		)
	}
}
class BluMUI_ReviewSelect extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			notReviewNum:this.props.notReviewNum || 0,
			reviewedNum:this.props.reviewedNum || 0,
			totalNum:this.props.totalNum || 0,
			drop:this.props.drop,
			time:this.props.time,
			files:this.props.files,
			selectIndex: 3
		}
	}
	createFileList(items){
		var i,
			len = items.length,
			result = [];
		for( i = 0 ; i < len ; i++){
			result.push(
				<span  style={{cursor:'pointer'}}
						 key = {i}
						 className="file"
						 onClick={this.download.bind(this, items[i])}
				>
					{items[i].originalName}
				</span>
			)
		}
		if(len === 0)
			result = (<span>无</span>);
		return result;
	}
	download(item){
		this.props.downloadFile(item);
	}
	render(){
		let { drop,notReviewNum,reviewedNum, totalNum ,time ,files } = this.state;
		return (
			<div>
				<div className="selectWarp">
					<span>网评批次：</span>
					<BluMUI_Drop {...drop}/>
				</div>
				<ul id="infShow">
					<li className={this.state.selectIndex === 1 ? "click selected" : ""} onClick={this.props.click.bind(this,1)}>{'显示全部【'+ totalNum +'】'}</li>
					<li className={this.state.selectIndex === 2 ? "click selected" : ""} onClick={this.props.click.bind(this,2)}>{'显示已评【'+ reviewedNum +'】'}</li>
					<li className={this.state.selectIndex === 3 ? "click selected" : ""} onClick={this.props.click.bind(this,3)}>{'显示未评【'+ notReviewNum +'】'}</li>
					<li>{'评审时间: ' + time || ''}</li>
					<li>
						<span>评审附件：</span>
						{this.createFileList(files)}
					</li>
				</ul>

			</div>
		)
	}
}
var BluMUI_M={
	NavList:BluMUI_NavList,
	ReviewCourse:BluMUI_ReviewCourse,
	NavListPercent:BluMUI_NavListPercent,
	ResourceNum:BluMUI_ResourceNum,
	ReviewSelect:BluMUI_ReviewSelect
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
