import React from 'react';
import ReactDOM from 'react-dom';
class BluMUI_Drop extends React.Component{
	constructor(props){
		super(props);
		this.state={
			select:0,
			showNum:0,
			scroll:0,
			value:this.props.initvalue || '',
			choiceV:this.props.initName,
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
	componentWillMount(){
		if(this.props.max<=this.props.items.length){
			this.setState({
				showNum:this.props.max,
				scroll:1
			});
		}
		else{
			this.setState({showNum:this.props.items.length,scroll:0});
		}
	}
	handlerClick(item){
		var that = this;
		return function () {
			that.setState({
				select:0,
				value:item.name,
				choiceV:item.name
			});
			that.props.callback(item);
		}
	}
	handlerShow(prevState){
		if(this.state.select==1)
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
		var that=this,
			props=this.props,
			extClass=props.extClass,
			id=props.id,
			inputName=props.inputName,
			scrollH=this.state.showNum*this.props.optionH,
			bodyH=this.props.items.length*this.props.optionH,
			barH=scrollH-(bodyH-scrollH)/4>this.props.minbarH?scrollH-(bodyH-scrollH)/4:this.props.minbarH;
		return(
			<div className={"BluMUI_Drop "+extClass}
				  id={id}
			>
			<span onClick={this.handlerShow}>
				{this.state.choiceV}
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
						width:this.state.showNum<this.props.items.length?'90'+"%":'100'+"%",
						marginTop:this.state.bodyMargin+'px'
					}}>
						{this.props.items.length>0&&
						this.props.items.map((item,index)=>
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
						 type="hidden" value={this.state.value}
						 id={inputName}>
				</input>
			</div>
		);
	}
}
class BluMUI_List extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			items:this.props.items
		};
	}
	_create(items){
		var result = [],
			len = items.length,
			i;
		for( i = 0 ; i < len ; i++){
			result.push(
				<ul key={i}>
					<a href={"result.html?classId=" + items[i].id + '&reviewId=' + items[i].reviewId } target="_blank">
						<li className="pc">{items[i].pc}</li>
						<li className="mc">{items[i].mc}</li>
						<li className="js">{items[i].js}</li>
						<li className="tj">{items[i].tj}</li>
						<li className="pf">{items[i].pf}</li>
						<li className="pj">{items[i].pj}</li>
					</a>
				</ul>
			)
		}
		return result;
	}
	render(){
		return (
			<div className="historyList">
				{this._create(this.state.items)}
			</div>
		);
	}
}
class BluMUI_PT_LI extends React.Component{
	constructor(props){
		super(props);
		this.handlerChange=this.handlerChange.bind(this);
	}
	handlerChange(e){
		this.props.change(parseInt(e.target.getAttribute('data-index')));
	}
	render(){
		var items=[],
			start = 1,
			{index , showNum , sum} = this.props;
		if(index>Math.floor(showNum)/2&&index<sum-Math.floor(showNum/2-1)){
			start = index - Math.floor(showNum/2);
		}
		if(index<=Math.floor(showNum/2)){
			start = 1;
		}
		if(index >= sum-Math.floor(showNum/2)){
			start = sum - showNum + 1;
		}
		for(var i= start;i<= showNum + start - 1;i++) {
			items.push(
				<li onClick={this.handlerChange}
					 data-index={i}
					 className={i==index?"cur":""}>
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
class BluMUI_PT extends React.Component{
	constructor(props){
		super(props);
		this.state={
			index:this.props.index,
			start:this.props.start,
			total:this.props.total,
			inputValue:''
		};
		this.handlerNext=this.handlerNext.bind(this);
		this.handlerLast=this.handlerLast.bind(this);
		this.handlerTop=this.handlerTop.bind(this);
		this.handlerBottom=this.handlerBottom.bind(this);
		this.handlerChange=this.handlerChange.bind(this);
	}
	handlerNext(e){
		this.handlerChange(this.state.index+1);
	}
	handlerLast(e){
		this.handlerChange(this.state.index-1);
	}
	handlerTop(e){
		this.handlerChange(1);
	}
	handlerBottom(e){
		this.handlerChange(this.props.sum);
	}
	handlerChange(value){
		var start = 1;
		if(value>Math.floor(this.state.showNum)/2&&value<this.props.sum-Math.floor(this.state.showNum/2-1)){
			start = value-Math.floor(this.state.showNum/2);
		}
		if(value<=Math.floor(this.state.showNum/2)){
			start = 1;
		}
		if(value >= this.props.sum-Math.floor(this.state.showNum/2)){
			start = this.props.sum - this.state.showNum + 1;
		}
		this.setState({
			index:value,
			start:start
		});
		this.props.change(value);
	}
	_input(e){
		var value = e.target.value,
			num = parseInt(value) || '';
		if( num < 1 && num!=='')
			num = 1;
		if( num > this.props.sum )
			num = this.props.sum;
		this.setState({
			inputValue:num
		});
	}
	_keyPress(e){
		var keyCode  = e.charCode,
			index = this.state.inputValue;
		if(keyCode == 13 ){
			if(index!==''){
				this.handlerChange(index);
			}
		}
	}
	render(){
		var showNum = this.state.sum;
		if(showNum > this.props.length){
			showNum = this.props.length;
		}
		return(
			<div className="BluMUI_PT" >

				<span className="allNum">{'共' + this.state.total+ '条记录'}</span>
				{
					this.state.sum>1&&
					<button id="topPage" className="toTop" onClick={this.handlerTop}>
						{this.props.topName}
					</button>
				}
				{this.state.sum>1&&this.state.index!=1&&<button id='lastPage' onClick={this.handlerLast} className="last">{this.props.lastName}</button>}
				{this.state.sum > 1 &&
				<BluMUI_PT_LI change={this.handlerChange} showNum={showNum} index={this.state.index}/>
				}
				{this.state.sum > 1 &&
				<div className="inputWarp">
					<input type="text"
							 value={this.state.inputValue}
							 onInput={this._input.bind(this)}
							 onKeyPress={this._keyPress.bind(this)}
					/>
					<span className="sum">{'\\' + this.state.sum}</span>
				</div>
				}
				{this.state.sum>1&&this.state.index!==this.props.sum&&<button id="nextPage" onClick={this.handlerNext} className="next">{this.props.nextName}</button>}
				{this.state.sum > 1 &&
				<button id="bottomPage" onClick={this.handlerBottom} className="toBottom">{this.props.bottomName}</button>
				}
			</div>
		);
	}
}
var BluMUI_M={
	Drop:BluMUI_Drop,
	List:BluMUI_List,
	PT:BluMUI_PT
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
