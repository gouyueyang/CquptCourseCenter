import React from 'react';
import ReactDOM from 'react-dom';
import flexAnimation from '../flexibleAnimation.react.js';

class BluMUI_Carousel extends React.Component{
	constructor(props){
		super(props);
		this.clickNav=this.clickNav.bind(this);
		this.clickNext=this.clickNext.bind(this);
		this.clickLast=this.clickLast.bind(this);
		this.changIndex=this.changIndex.bind(this);
		this.carouselAnimation=this.carouselAnimation.bind(this);
		this.mouseOffHandel=this.mouseOffHandel.bind(this);
		this.mouseOverHandel=this.mouseOverHandel.bind(this);
		this.state={
			index:this.props.index,
			left:-1*this.props.index*this.props.width,
			animation:false,
			mouse:false
		};
	}
	componentWillMount(){
		var that=this;
		this.timerID=setInterval(
			function(){
				if(!that.state.animation&&!that.state.mouse){
					that.changIndex(that.state.index+1);
					that.carouselAnimation(-1*that.props.width);
				}
			},
			that.props.setIntervalTime
		);
	}
	componentWillUnmount() {
		clearInterval(this.timerID);
	}
	clickLast(){
		if(this.state.animation==false){
			this.changIndex(this.state.index-1);
			this.carouselAnimation(this.props.width);
		}
	}
	clickNext(){
		if(this.state.animation==false){
			this.changIndex(this.state.index+1);
			this.carouselAnimation(-1*this.props.width);
		}
	}
	clickNav(e){
		if(this.state.animation==false){
			var target=e.target,
				preIndex=this.state.index,
				nextIndex=parseInt(target.getAttribute("data-index")),
				dis=(nextIndex-preIndex)*this.props.width;
			this.changIndex(nextIndex);
			this.carouselAnimation(-1*dis);
		}
	}
	mouseOverHandel(){
		this.setState({
			mouse:true
		});
	}
	mouseOffHandel(){
		this.setState({
			mouse:false
		})
	}
	carouselAnimation(dis){
		var that = this,
			left = this.state.left,
			newpos = left + dis;
		if(newpos>0 && dis>0){
			that.setState({left:((that.props.items.length) * that.props.width * -1)});
			left=((that.props.items.length) * that.props.width * -1);
			newpos=left + dis;
		}
		if(newpos<(this.props.width * (that.props.items.length) * (-1)) && dis<0){
			that.setState({left:0});
			left=0;
			newpos=left+dis;
		}
		setTimeout(function (){
			that.setState({
				animation:true
			})
			flexAnimation.init({
				duration:that.props.time,
				easing:that.props.easing,
				endValue:{
					left:newpos
				},
				callback:function () {
					that.setState({
						animation:false
					})
				}
			},'myAnimation');
			flexAnimation.star(that,'myAnimation');
		},200);

	}
	changIndex(nextIndex){
		if(nextIndex < 0){
			nextIndex = this.props.items.length-1;
		}
		if(nextIndex > this.props.items.length-1){
			nextIndex=0;
		}
		this.setState({index:nextIndex})
	}
	render(){
		var bodyShow=[],
			navShow=[],
			i,
			len;
		for(i= 0 ,len = this.props.items.length;i < len;i++){
			bodyShow.push(
				<li key={i}>
					<img  src={this.props.items[i].img}/>
				</li>
			);
			navShow.push(
				<li data-index={i}
					 key={i}
					 onClick={this.clickNav}
					 className={i==this.state.index?"on":"off"}>
				</li>);
		}
		return(
			<div id={this.props.id}
				  onMouseOut={this.mouseOffHandel}
				  onMouseOver={this.mouseOverHandel}
				  className={"BluMUI_Carousel "+this.props.extClass}>
				<ul className="body"
					 style={{
						 left:this.state.left+"px",
						 width:(this.props.items.length+1)*this.props.width+'px'}}>
					{bodyShow}
					<li>
						<img  src={this.props.items[0].img}/>
					</li>
				</ul>
				<div className="nav">
					<ul className="control" >
						<button onClick={this.clickLast}
								  className="last">
						</button>
						<ul className="showNav">
							{navShow}
						</ul>
						<button onClick={this.clickNext}
								  className="next">
						</button>
					</ul>
				</div>
			</div>
		)
	}
}
var BluMUI_M={
	Carousel:BluMUI_Carousel
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
