import React from 'react';
import ReactDOM from 'react-dom';
class BluMUI_List extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			items: this.props.items,
			index: this.props.index
		}
		this._onClick = this._onClick.bind(this);
	}
	_onClick(index,item){
		var that=this,
			value;
		if(item.value)
			value=item.value;
		else
			value=item.name;
		if(item.callback)
			return(
				function () {
					that.setState({
						index: index
					})
					item.callback(index,value,item);
				}
			);
	}
	_createLi(){
		var result=[],
			i,
			len,
			items=this.state.items;
		for(i=0,len=items.length;i<len;i++){
			result.push(
				<li key={i}
					 className={this.state.index==i?'selected selected-index'+i:'index'+i}
					 onClick={this._onClick(i,items[i])}
					 data-key={i}>
					<a href={items[i].url} title={items[i].name.length>16?items[i].name:''}>
						{items[i].name}
					</a>
				</li>
			);
		}
		return result;
	}
	render(){
		return(
			<ul id={this.props.id} className={"BluMUI_List "+this.props.extClass}>
				{this._createLi()}
			</ul>
		)
	}
}
class BluMUI_DropList_box extends React.Component{
	constructor(props){
		super(props);
		this.handlerClick=this.handlerClick.bind(this);
		this.selectedDom=[];
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
	handlerClick(index,selectClass,noselectClass){
		var that = this;
		return function () {
			var result=that.state.selects,
				i,
				len;
			for(i=0,len=that.state.selects.length;i<len;i++){
				if(that.state.selects[index] == 0){
					if(index==i){
						result.splice(index,1,1);
					}else{
						result.splice(i,1,0);
					}
				}
				else {
					if(index==i){
						if( that.props.items[index].items.length > 0){
							result.splice(index,1,0);
						}else{
							result.splice(index,1,1);
						}

					}else{
						result.splice(i,1,0);
					}
				}
			}
			if(that.props.items[index].items.length === 0 && that.props.items[index].isCalled  ){
				that.selectedDom[index].className = selectClass + ' ' +  noselectClass;
				that.props.selected(that.selectedDom[index],selectClass,noselectClass);
				that.props.callBack(that.props.items[index].name,that.props.items[index].file,that.props.items[index].ableDownload);
			}
			that.setState({
				selects:result
			})
		}

	}
	render(){
		var items=this.props.items,
			callBack=this.props.callBack,
			getInitDom = this.props.getInitDom,
			curClass=this.props.curClass;
		var result=this.props.items.map(
			(value,index)=>{
				return (<ul key={index}
								className={this.props.curClass+'-'+index}>
					<li>
						<div onClick={this.handlerClick(index,this.state.selectedClass[index][1],"item_warp "+items[index].nameStyle)}
							  data-key={index}
							  id = {this.props.curClass+'-'+index}
							  ref = {(selectedDom)=>{
								  this.selectedDom[index] = selectedDom;
								  if(this.state.selects[index] && items[index].items.length === 0){
									  getInitDom(selectedDom,this.state.selectedClass[index][1],"item_warp "+items[index].nameStyle);
								  }
							  }}
							  className={items[index].items.length>=0?
								  "item_warp "+
								  items[index].nameStyle+
								  ' '+
								  this.state.selectedClass[index][this.state.selects[index]]:''
							  }
						>
								<span  data-key={index}
										 className="leftLogo"
										 style={this.state.leftLogo[index][this.state.selects[index]]}>
								</span>
							<span data-key={index}
									className="name"
									title = {items[index].title||''}
							>
									{items[index].name}
								</span>
							<span data-key={index}
									className="rightLogo"
									style={this.state.rightLogo[index][this.state.selects[index]]}>
								</span>
						</div>
						{items[index].items.length>0&&
						<BluMUI_DropList_box
							selected = {this.props.selected}
							callBack={callBack}
							curClass={curClass+'-'+index}
							curstyle={this.state.style[this.state.selects[index]]}
							items={items[index].items}
							getInitDom = {this.props.getInitDom}
						/>}
					</li>
				</ul>)});
		return (
			<div style={this.props.curstyle} className="warp"> {result}</div>
		);
	}
}
class BluMUI_DropList extends React.Component{
	constructor(props){
		super(props);
		this.state={
			selectDom:{
				ref:null,
				noSelectClass:'',
			}
		}
		this._selectDom = this._selectDom.bind(this);
		this._getInitDom = this._getInitDom.bind(this);
	}
	_getInitDom(initDom,selectClass,noselectClass){
		if(this.state.selectDom.ref == null ) {
			this.state.selectDom.ref = initDom;
			this.state.selectDom.noSelectClass = noselectClass;
		}
	}
	_selectDom(selectDom,selectClass,noselectClass){
		if(this.state.selectDom.ref!=null && this.state.selectDom.ref!==selectDom){
			this.state.selectDom.ref.className = this.state.selectDom.noSelectClass;
			this.state.selectDom.ref= selectDom;
			this.state.selectDom.noSelectClass = noselectClass;
		}
		else{
			this.state.selectDom.ref= selectDom;
			this.state.selectDom.noSelectClass = noselectClass;
			this.state.selectDom.ref.className = noselectClass+' '+selectClass;
		}

	}

	render(){
		return(
			<div className={"BluMUI_DropList " +this.props.extClass} >

				<BluMUI_DropList_box  callBack={this.props.callBack}
											 curClass="BluMUI_DropList"
											 items={this.props.items}
											 selected={this._selectDom}
											 getInitDom = {this._getInitDom}
											 curstyle={{}}/>

			</div>
		);
	}
}
class BluMUI_downLoad extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			isAbleDown:false
		};
		this._download = this._download.bind(this);
	}
	_download(){
		this.props._download();
	}
	render(){
		return (
			<div>
				{
					this.state.isAbleDown &&
					<a onClick = {this._download}>下载附件</a>
				}
			</div>
		);
	}
}
class BluMUI_PdfViewer extends React.Component{
	constructor(props){
		super(props);
	}
	componentDidMount(){
		window.frames['pdf'].location.href = 'pdfViewer.html?file=' + this.props.pdfURL;
	}
	render(){
		return(
			<iframe name="pdf">
			</iframe>
		)
	}
}
var BluMUI_M={
	List:BluMUI_List,
	DropList:BluMUI_DropList,
	DownLoad:BluMUI_downLoad,
	PdfViewer:BluMUI_PdfViewer
}
var BluMUI={
	result:{},
	create:function(data,type,elem,callback){
		var props=data,
			Blu=BluMUI_M[type];
		this.result[props.id]= ReactDOM.render(
			<Blu {...props}/>,
			elem
		);
		if(callback)
			callback();
	}
};
export default BluMUI;
