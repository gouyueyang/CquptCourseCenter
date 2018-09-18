import React from 'react';
import ReactDOM from 'react-dom';

class BluMUI_DropList_box extends React.Component{
	constructor(props){
		super(props);
		this.handlerClick=this.handlerClick.bind(this);
		var length=this.props.items.length,
			selects=[],
			selectedClass=[],
			leftLogo=[],
			rightLogo=[],
			items=this.props.items;
		for(var i=0;i<length;i++){
			selects.push(items[i].selected);
			leftLogo.push(
				[
					{backgroundImage:'url('+items[i].ileftLogo+')'},
					{backgroundImage:'url('+items[i].nleftLogo+')'}
				]
			);
			rightLogo.push(
				[
					{backgroundImage:'url('+items[i].irightLogo+')'},
					{backgroundImage:'url('+items[i].nrightLogo+')'}
				]
			);
			selectedClass.push(['',items[i].selectedClass])
		}
		this.state={
			style:[{height:"0px"},{}],
			rightLogo:rightLogo,
			leftLogo:leftLogo,
			selectedClass:selectedClass,
			selects:selects
		};
	}
	handlerClick(e){
		var index=e.target.getAttribute('data-key'),
			result=this.state.selects,
			i,
			len;
		for(i=0,len=this.state.selects.length;i<len;i++){
			if(this.state.selects[index] == 0){
				if(index==i){
					result.splice(index,1,1);
				}else{
					result.splice(i,1,0);
				}
			}
			else {
				if(index==i){
					result.splice(index, 1, 0);
				}else{
					result.splice(i,1,0);
				}
			}
		}
		if(this.props.items[index].items.length == 0 || this.props.items[index].isCalled){
			this.props.callBack(this.props.items[index].name,this.props.items[index].card,this.props.items[index].belong);
		}
		this.setState({
			selects:result
		})
	}
	render(){
		var items=this.props.items,
			callBack=this.props.callBack,
			curClass=this.props.curClass;
		var result=this.props.items.map(
			(value,index)=>
				<ul key={index}
					 className={this.props.curClass+'-'+index}>
					<li>
						<div onClick={this.handlerClick}
							  data-key={index}
							  className={"item_warp "+items[index].nameStyle+' '+this.state.selectedClass[index][this.state.selects[index]]}>
								<span  data-key={index}
										 className="leftLogo"
										 style={this.state.leftLogo[index][this.state.selects[index]]}>
									{items[index].leftLogoName}
								</span>
								<span data-key={index}
										className="name">
									{items[index].name}
								</span>
								<span data-key={index}
										className="rightLogo"
										style={this.state.rightLogo[index][this.state.selects[index]]}>
								</span>
						</div>
						{items[index].items.length>0&&
						<BluMUI_DropList_box
							callBack={callBack}
							curClass={curClass+'-'+index}
							curstyle={this.state.style[this.state.selects[index]]}
							items={items[index].items}
						/>}
					</li>
				</ul>);
		return (

			<div style={this.props.curstyle} className="warp"> {result}</div>

		);
	}
}
class BluMUI_DropList extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		return(
			<div className={"BluMUI_DropList " +this.props.extClass}>

				<BluMUI_DropList_box  callBack={this.props.callBack} curClass="BluMUI_DropList" items={this.props.items} curstyle={{}}/>

			</div>
		);
	}
}
var BluMUI_M={
	DropList:BluMUI_DropList,
}
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
