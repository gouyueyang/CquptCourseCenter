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
		var dis=this.props.items.length-this.props.max;
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
					<ul id="body" style={{
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
class App extends React.Component{
	constructor(props){
		super(props);
		this.state={
			items:this.props.items||[],
			pc: '',
			PcWarn: '',
			masterPc:'',
			masterPcWarn:""
		}
	}
	save(){
		var masterPc = this.state.masterPc,
			masterPcWarn = this.state.masterPcWarn,
			pc = this.state.pc;
		if(!/\S{1,}/.test(masterPc)){
			masterPcWarn = '分组批次未填写';
		}
		this.setState({
			masterPcWarn:masterPcWarn
		});
		if(!pc){
			this.setState({
				PcWarn: '未选择分组批次'
			});
		}
		if(!masterPcWarn&&pc){
			this.props.save({
				evaluateGroupBatch: masterPc,
				groupBatch: pc
			});
		}
	}
	back(){
		window.location.href = 'zjfzgl.html';
	}
	select(item){
		this.state.pc = item.name;
	}
	render(){
		let { drop } = this.props;
		return (
			<div>
				<div className="inputWarp">
					<span>专家分组批次:</span>
					<input  type="text"  onInput={(e)=>{this.setState({masterPc:e.target.value})}}/>
				</div>
				<div className="warn">{this.state.masterPcWarn}</div>
				<div className="inputWarp">
					<span>分组批次:</span>
					<BluMUI_Drop callback={this.select.bind(this)} {...drop}/>
				</div>
				<div className="warn">{this.state.PcWarn}</div>
				<button onClick={this.save.bind(this)} className="save">保存</button>
				<button onClick={this.back.bind(this)} className="back">返回</button>
			</div>
		);
	}
}


var BluMUI_M={
	App:App
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
