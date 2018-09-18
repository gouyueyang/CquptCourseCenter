import React from 'react';
import ReactDOM from 'react-dom';

class BluMUI_SimpleDrop extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: this.props.initalSelected, open: false
		}
		this._onClick = this._onClick.bind(this);
	}

	_createIitem() {
		var result = [], i, len;
		for (i = 0, len = this.props.items.length; i < len; i++) {
			result.push(<li key={i}
								 onClick={this._onClick}
								 data-value={this.props.items[i]}
			>
				{this.props.items[i]}
			</li>)
		}
		return result;
	}

	_onClick(e) {
		var selectValue = e.target.getAttribute('data-value');
		this.setState((prevState, props)=>(
		{
			open: !prevState.open, selected: selectValue
		}
		))
	}

	render() {
		return (
			<div className={"BluMUI_SimpleDrop "+this.props.extClass}
				  id={this.props.id}
			>
				<span className="selected"
						data-value={this.state.selected}
						onClick={this._onClick}>
					{this.state.selected}
				</span>
				<ul className={this.state.open?"selectArea":"noSelectArea"}
				>
					{this._createIitem()}
				</ul>
				<input type="hidden"
						 value={this.state.selected}
						 name={this.props.name}
						 id={this.props.name}
				/>
			</div>
		)
	}
}
class BluMUI_UserLoginState extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			userListShow: false
		}
		this._onClick = this._onClick.bind(this);
		this._show = this._show.bind(this);
		this._noShow = this._noShow.bind(this);
	}

	_onClick(e) {
		var funcName = e.target.childNodes[0];
		this.props.callback(funcName, this);
	}

	_isShowVisit() {
		var result;
		if (this.props.isLogin) {
			var result = (
				<span className="loginNum">
					{this.props.loginNumText + this.props.loginNum}
				</span>
			)
		}
		return result;
	}

	_createFunc() {
		if (this.props.isLogin) {
			var right = this.props.right, funcMoulde = this.props.funcName[right], i, len, result = [];
			for (i = 0, len = funcMoulde.length; i <= len; i++) {
				if (i == 0)
					result.push(<hr key={i}></hr>)
				else
					result.push(<li key={i} onClick={this._onClick}>
						{funcMoulde[i - 1]}
					</li>);
			}
		}
		return result;
	}

	_show() {
		this.setState((prevState, props)=> ({
			userListShow: !prevState.userListShow
		}))
	}

	_noShow(e) {
		this.setState((prevState, props)=> ({
			userListShow: false
		}))
		var funcName = e.target.childNodes[0];
		this.props.callback(funcName);
	}

	_isLogin() {

		if (this.props.isLogin) {
			var result = (
				<span className="userInf">
					{this.props.loginExtInf && <span className="loginExtInf">{this.props.loginExtInf}</span>
					}
					<ul className="userName" onClick={this._show}>
						<li id="userName">
							{
								this.props.loginText + this.props.userName + '!'
							}
						</li>
					</ul>
						<ul className="userList" id={!this.state.userListShow?'show':''}>
							{this.props.userList.map((text, i)=>(
								<li key={i} className="func" onClick={this._noShow}>{text}</li>
							))}
						</ul>
				</span>
			);
		} else {
			var result = (
				<span>
					<span className="login" onClick={this._onClick}>
						登录
					</span>
					<span className="inLoginText">
						{this.props.inLoginText}
					</span>
				</span>
			)
		}
		return result;
	}

	render() {
		return (
			<div id={this.props.id} className={"BluMUI_UserLoginState "+this.props.extClass}>
				{this._isShowVisit()}
				<div>
					<span className="userOther">
					</span>
					{this._isLogin()}
				</div>
				<ul>
					{this._createFunc()}
				</ul>
			</div>
		)
	}
}
class BluMUI_PT_LI extends React.Component {
	constructor(props) {
		super(props);
		this.handlerChange = this.handlerChange.bind(this);
	}

	handlerChange(e) {
		var index = parseInt(e.target.getAttribute('data-index'));
		if (index) {
			this.props.change(index)
		}
	}

	render() {
		var items = [];
		for (var i = this.props.start; i <= this.props.showNum + this.props.start - 1; i++) {
			if (this.props.showNum + this.props.start <= this.props.sum) {
				if (i <= this.props.showNum + this.props.start - 3) {
					items.push(<li onClick={this.handlerChange}
										className="item" key={i}
										data-index={i}
										className={i==this.props.index?"cur":""}>
						{i}
					</li>);
				} else {
					if (i == this.props.showNum + this.props.start - 2) {
						items.push(<li onClick={this.handlerChange}
											className="item" key={i}
											data-index={false}
											className={""}>
							...
						</li>);
					}
					if (i == this.props.showNum + this.props.start - 1) {
						items.push(<li onClick={this.handlerChange}
											className="item" key={this.props.sum}
											data-index={this.props.sum}
											className={""}>
							{this.props.sum}
						</li>);
					}
				}
			} else {
				items.push(<li onClick={this.handlerChange}
									className="item" key={i}
									data-index={i}
									className={i==this.props.index?"cur":""}>
					{i}
				</li>);
			}
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
			showNum: null, index: this.props.index, start: this.props.start
		};
		this.handlerNext = this.handlerNext.bind(this);
		this.handlerLast = this.handlerLast.bind(this);
		this.handlerChange = this.handlerChange.bind(this);
	}

	handlerNext(e) {
		if (this.state.index < this.props.sum)
			this.handlerChange(this.state.index + 1);
	}

	handlerLast(e) {
		if (this.state.index > 1)
			this.handlerChange(this.state.index - 1);
	}

	handlerChange(value) {
		if (value == this.props.sum) {
			this.setState({start: value - this.state.showNum + 1})
		}
		if (value > Math.floor(this.state.showNum) / 2 && value < this.props.sum - Math.floor(this.state.showNum / 2 - 1)) {
			this.setState({start: value - Math.floor(this.state.showNum / 2)})

		}
		if (value <= Math.floor(this.state.showNum / 2)) {
			this.setState({start: 1})
		}
		this.setState({index: value});
	}

	componentWillUpdate(nextProps, nextState) {
		this.props.change(nextState.index);
	}

	componentWillMount() {
		if (!this.state.showNum) {
			var showNums = this.props.sum;
			if (showNums > this.props.length) {
				showNums = this.props.length;
			}
			this.setState({showNum: showNums});
		}
	}

	render() {
		return (
			<div className={"BluMUI_PT "+this.props.extClass} id={this.props.id}>
				<button id='lastPage' onClick={this.handlerLast} className="last">{this.props.lastName}</button>
				<BluMUI_PT_LI sum={this.props.sum} change={this.handlerChange} showNum={this.state.showNum}
								  index={this.state.index} start={this.state.start}/>
				<button id="nextPage" onClick={this.handlerNext} className="next">{this.props.nextName}</button>
			</div>
		);
	}
}
class BluMUI_DropList_box extends React.Component {
	constructor(props) {
		super(props);
		this.handlerClick = this.handlerClick.bind(this);
		var length = this.props.items.length, selects = [], selectedClass = [], rightLogo = [], items = this.props.items;
		for (var i = 0; i < length; i++) {
			selects.push(items[i].selected);
			rightLogo.push([{backgroundImage: 'url(' + items[i].irightLogo + ')'}, {backgroundImage: 'url(' + items[i].nrightLogo + ')'}]);
			selectedClass.push(['', items[i].selectedClass])
		}
		this.state = {
			style: [{height: "0px"}, {}], rightLogo: rightLogo, selectedClass: selectedClass, selects: selects
		};
	}

	handlerClick(e) {
		var index = e.target.getAttribute('data-key'), result = this.state.selects, i, len;
		for (i = 0, len = this.state.selects.length; i < len; i++) {
			if (this.state.selects[index] == 0) {
				if (index == i) {
					result.splice(index, 1, 1);
				} else {
					result.splice(i, 1, 0);
				}
			} else {
				if (index == i) {
					result.splice(index, 1, 0);
				} else {
					result.splice(i, 1, 0);
				}
			}
		}
		if (this.props.items[index].items.length == 0 || this.props.items[index].isCalled) {
			this.props.callBack(this.props.items[index].name);
		}
		this.setState({
			selects: result
		})
	}

	render() {
		var items = this.props.items, callBack = this.props.callBack, curClass = this.props.curClass;
		var result = this.props.items.map((value, index)=> <ul key={index}
																				 className={this.props.curClass+'-'+index}>
			<li>
				<div onClick={this.handlerClick}
					  data-key={index}
					  className={"item_warp "+items[index].nameStyle+' '+this.state.selectedClass[index][this.state.selects[index]]}>
								<span data-key={index}
										className="leftLogo"
										style={{backgroundImage:'url('+items[index].leftLogo+')'}}>
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
				{items[index].items.length > 0 && <BluMUI_DropList_box
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
class BluMUI_DropList extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className={"BluMUI_DropList " +this.props.extClass}>
				<BluMUI_DropList_box callBack={this.props.callBack} curClass="BluMUI_DropList" items={this.props.items}
											curstyle={{}}/>
			</div>
		);
	}
}
class BlueMUI_Review extends React.Component {
	constructor(props) {
		super(props);
		this._clickStar = this._clickStar.bind(this);
		this.state = {
			choiced: null, curIndex: this.props.starNum
		};
	}

	componentWillMount() {
		var len, i, result = [];
		if (this.props.starNum <= this.props.num)
			len = this.props.starNum; else
			len = this.props.num;
		for (i = 1; i <= this.props.num; i++) {
			if (i <= len)
				result.push(1); else
				result.push(0);
		}
		this.setState({
			choiced: result
		})
	}

	_clickStar(e) {
		var index = parseInt(e.target.getAttribute('data-key')) + 1, len, i, result = [];
		for (i = 1; i <= this.props.num; i++) {
			if (this.state.curIndex != index) {
				if (i <= index)
					result.push(1); else
					result.push(0);
			} else {
				if (this.state.choiced[0] == 0 && i <= index) {
					result.push(1);
				} else {
					result.push(0);
					index = 0;
				}
			}
		}
		this.props.callback(index);
		this.setState({
			choiced: result, curIndex: index
		})
	}

	_createStar() {
		var i, len, starList = [];
		for (i = 0, len = this.props.num; i < len; i++) {
			starList.push(<span className={this.state.choiced[i]==1?'star onstar':'star nostar'}
									  key={i}
									  data-key={i}
									  onClick={this.props.enable?this._clickStar:function(){}}>

				</span>);
		}
		return starList;
	}

	render() {
		return (
			<div id={this.props.id}
				  className={'BlueMUI_Review '+this.props.extClass}>
            	<span className='name'>
						{this.props.name}
					</span>
				{this._createStar()}
			</div>
		);
	}
}
class BluMUI_NavList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			items: this.props.items, index: this.props.index
		}
		this._onClick = this._onClick.bind(this);
	}

	_onClick(e) {
		this.setState({
			index: e.target.getAttribute('data-key')
		})
	}

	_createLi() {
		var result = [], i, len;
		for (i = 0, len = this.state.items.length; i < len; i++) {
			result.push(<li key={i}
								 className={this.state.index==i?'selected':''}
								 onClick={this._onClick}
								 data-key={i}>
				{this.state.items[i]}
			</li>);
		}
		return result;
	}

	render() {
		return (
			<ul id={this.props.id} className={"BluMUI_NavList "+this.props.extClass}>
				{this._createLi()}
			</ul>
		)
	}
}
class BluMUI_ClassInfBox extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			items: this.props.items
		}
	}

	_createBox() {
		var i, len, result = [], items = this.state.items;
		for (i = 0, len = items.length; i < len; i++) {
			result.push(<div className="item" key={i}>
				<div className="content_warp">
					<img></img>
					<div className="body">
										<span className="title">
											{items[i].title}
										</span>
						<div>
							<p className="content">
								{'课程简介:' + items[i].desc}
							</p>
							<p className="data">
								<span>{'学分:' + items[i].score}</span>
								<span>{'学时:' + items[i].stuTime}</span>
								<span>{'(理论' + items[i].theory + '+实验' + items[i].exp + ')'}</span>
							</p>
							<p className="major">{'适用院系/专业:' + items[i].major}</p>
						</div>
					</div>
				</div>
				<div className="review_warp">
								<span className="reviewName">
									教学团队评价
								</span>
					<BlueMUI_Review id={'review'+i}
										 extClass="review"
										 name=""
										 num={items[i].num}
										 starNum={items[i].starNum}
										 enable={false}
					>
					</BlueMUI_Review>
								<span className="reviewName1">
									(课程评价)
								</span>
				</div>
			</div>);
		}
		return result;
	}

	render() {
		return (
			<div className="BluMUI_ClassInfBox">
				{this._createBox()}
			</div>
		)
	}
}
class BluMUI_Sch extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: ''
		};
		this.handlerChange = this.handlerChange.bind(this);
		this.handlerSearch = this.handlerSearch.bind(this);
	}

	handlerChange(e) {
		this.setState({value: e.target.value})

	}

	handlerSearch() {
		this.props.search(this.state.value);
	}

	render() {
		var props = this.props, id = props.id, extClass = props.extClass, types = props.types, type = props.type, btn = props.btn;
		return (
			<div id={id} className={"BluMUI_Sch "+extClass}>
				<BluMUI_SimpleDrop name="selectArea"
										 extClass=""
										 initalSelected={type}
										 items={types}
				></BluMUI_SimpleDrop>
				<div className="searchArea">
					<input value={this.state.value}
							 onChange={this.handlerChange}>
					</input>
					<button onClick={this.handlerSearch}>
						{btn}
					</button>
				</div>
			</div>)
	}
}


/**
 * ZQ's test component
 */

/**
 * 生成标题并控制3个操作按钮和复选框的显示
 */
class BluMUI_CreateTitle extends React.Component{//创建绿色的标题（“课程审核”，“课程维护”）
	constructor(props){
		super(props);
		this.arr;//
		this.state={title:'shenhe',show:this.props.level!=3?true:false};
	}
	//对于管理员来说，title有2个标签需要切换，此函数作用是切换标签
	toggle(value){
		let that=this;
		return function(){//让复选框和3个控制按钮根据state显示和隐藏
			that.setState({title:value?'shenhe':'weihu',show:value});
			that.props.callback(value);//调用外面传回来的callback参数
		};//必须要用回调函数的方式执行
	}

	//取消左边的全部复选框
	cleanLeft(){
		let checkBoxs = document.getElementById('classList').getElementsByTagName('input');
		for (let j = 0; j < checkBoxs.length; j++) {
			checkBoxs[j].checked = false;
		}
	}
	//条件筛选复选框操作
	filter(){
		let that=this;
		let filters=document.getElementById('settings').getElementsByTagName('input');
		let labels=document.getElementById('settings').getElementsByTagName('label');
		let request=this.arr||[1,1,1,1,1];//初始化筛选条件

		//“所有课程”的操作
		filters[0].onchange=function(){
			if(this.checked) {
				request=[1,1,1,1,1];
				//取消上面条件筛选的复选框
				for (let i = 1; i < filters.length; i++) {
					filters[i].checked = false;
				}
				that.cleanLeft();
			} else {
				request=[0,0,0,0,0];
			}
			/**
			 * 此处发送筛选请求
			 */
			console.log(request);
		}
		//其他复选框的选择事件
		for(let k=0;k<filters.length-1;k++){
			filters['itm'+k].onchange=function(){
				if(request.toString()===[1,1,1,1,1].toString()){
					filters[0].checked=false;
					request=[0,0,0,0,0];
				}
				that.cleanLeft();
				/**
				 * 此处发送筛选请求
				 */
				request[k]= +this.checked;
				that.arr=request;
				console.log(request)
			}
		}
	}
	//title的渲染
	render(){
		this.filter();//对右上方的条件筛选进行初始化与绑定操作
		/**
		 * 初始化复选框和控制按钮的显示状态
       */
		let allCheckToggle=document.getElementById('allCheckToggle');
		let settingStates =document.getElementById('states');
		let isShow=this.state.show?'inline':'none';
		allCheckToggle.style.display=isShow;
		settingStates.style.display=isShow;

		let title;//根据用户权限生成标题
		switch (this.props.level){
			case 1://主任、院长看见的标题
				title=
					<span className="spanTitle" id="shen_he">
					 课程审核<br/>
					 <div id="shenheGreenBar" className="showGreenBar"></div>
				 </span>;
				break;
			case 3://老师看见的标题
				title=
					<span className="spanTitle" id="wei_hu" >
					 课程维护<br/>
					 <div id="shenheGreenBar" className="showGreenBar"></div>
				 </span>;
				break;
			case 2://管理员看见的标题
				title=
				<div>
				 <span className="spanTitle" id="shen_he" onClick={this.toggle(true)}>
					 课程审核<br/>
					 <div id="shenheGreenBar" className={this.state.title=='shenhe'?"showGreenBar":''}></div>
				 </span>
					<div id="vertical_line"></div>
				 <span className="spanTitle" id="wei_hu" onClick={this.toggle(false)}>
					 课程维护<br/>
					 <div id="weihuGreenBar" className={this.state.title=='weihu'?"showGreenBar":''}></div>
				 </span>
				</div>;
			 break;
		}
		return title;
	}
}

/**
 * 根据用户权限和课程状态生成课程信息条目
 */
class BluMUI_CouseLists extends React.Component {
	constructor(props) {
		super(props);
		this.level = this.props.user.level;
		this.state={//用于管理员切换“维护”和“审核”的toggle开关
			//title:this.level==3?'weihu':'shenhe',//若不是老师访问则默认为＂shenhe＂
			show:this.level==3?false:true
		};
		this.id = this.props.user.id;
		this.createList = this.createList.bind(this);//绑定ShowList函数，用来输出一条信息
		this.selectAll=this.selectAll.bind(this);
	}
	//“全选”打钩后的操作
	selectAll(flag){
		let btn=document.getElementById('allCheck');
		if(flag==='unchecked'){
			btn.checked=false;
			return;
		}
		if(document.getElementById('control')){
			document.getElementById('control').getElementsByTagName('span')[0].onclick=function(){
				btn.checked=false;
			}
			document.getElementById('control').getElementsByTagName('span')[1].onclick=function(){
				btn.checked=false;
			}
		}
		/**
		 * 取消“全选”label的for属性，用事件绑定的方法来改变“全选”的状态
		 * 如果用label的for，可能会出现一个xiaobug
		 */
		btn.checked=!btn.checked;
		let items=document.getElementsByName('course');
		for(let i=0;i<items.length;i++){
			items[i].checked=btn.checked;
		}
	}
	//禁止连接（a标签）跳转
	linkdisable(event){
		event.preventDefault();
		console.log('this link was clicked')
	}

	//生成课程信息列表
	createList(obj) {
		let operation_up,operation_down,br;

		/**
		 * 根据权限与课程状态设置可操作选项
		 */
		let qiyong=<a href="#" onClick={this.linkdisable}>启用</a>;
		let shenhe=<a href="javascript:void(0)">审核</a>;
		let tingyong=<a style={{cursor:'pointer'}} onClick={this.popup.bind(this,obj.course_id,'tingyong',3)}>停用</a>;
		let bohui=<a style={{cursor:'pointer'}} onClick={this.popup.bind(this,obj.course_id,'bohui',4)}>驳回</a>;
		let bianji=<a href="#" className={obj.course_state==1||obj.course_state==3?'unable':''} onClick={obj.course_state==1||obj.course_state==3?this.linkdisable:''}>编辑</a>;
		switch (this.level){//判断权限
			case 1://主任、院长
				switch (obj.course_state){//判断课程状态
					case 0://初始
					case 4://已驳回
						operation_down=tingyong;//这3中状态的操作只有停用
						break;
					case 1://待审核
						operation_down=shenhe;
						break;
					case 3://已停用
						operation_down=qiyong;
						break;
					case 2://已上线
					 	operation_up=tingyong;
						br=<br/>;
					 	operation_down=bohui;
				}
				break;
			case 2://管理员
				if(this.state.show){//若显示复选框，则为审核操作页面
					switch (obj.course_state){//判断课程状态
						case 0://初始
						case 4://已驳回
							operation_down=tingyong;//这3中状态的操作只有停用
							break;
						case 1://待审核
							operation_down=shenhe;
							break;
						case 3://已停用
							operation_down=qiyong;
							break;
						case 2://已上线
							operation_up=tingyong;
							br=<br/>;
							operation_down=bohui;
					}
				} else {
					operation_down=bianji;
				}
				break;
			case 3:
				operation_down=bianji;
				break;
		}
		/**
		 * 填充课程状态
		 */
		let courseState='';
		switch (obj.course_state){
			case 0:
				courseState='初始';
				break;
			case 1:
				courseState='待审核';
				break;
			case 2:
				courseState='已上线';
				break;
			case 3:
				courseState='已停用';
				break;
			case 4:
				courseState='已驳回';
				break;
		}

		let operation=//操作栏的内容
			<span className="operationSpan">
				{operation_up}
				{br}
				{br}
				{operation_down}
			</span>;

		let isShenhe;//复选框
		if(this.state.show){
			isShenhe=
				<li className="check">
					<input type="checkbox" name="course" value={obj.course_state} id={obj.course_id}/>
					<label htmlFor={obj.course_id} onClick={this.selectAll.bind(this,'unchecked')}></label>
				</li>;
		}

		let list =
			<ul key={obj.course_id} className="courseBar">
				{isShenhe}
				<li className="courseNumber">{obj.course_id}</li>
				<li className="courseName"><a href="#">{obj.course_name}</a></li>
				<li className="classRoom">{obj.teaching_team}</li>
				<li className="sublimeTime">{obj.submit_time}</li>
				<li className="currentState">{courseState}</li>
				<li className="operation">
					{operation}
				</li>
			</ul>;
		return (list);
	}

	//从其他组件接收参数改变本组件的state,控制title的切换
	//在这个组件中貌似没用，没有被调用过
	//toggle(t){
	//	this.setState({title:t});
	//}
	//“停用”和“驳回”操作的弹出框
	popup(id, title, newState,callback){
		//let isArr=id.constructor == Array;//判断id是否为数组
		if(id.constructor!=Array){
			id=[id];
		}
		let pop=document.getElementById('popup');//弹出框以及透明遮挡层
		let close=document.getElementById('close');//弹出框关闭按钮
		let sub=document.getElementById('sub_btn');//驳回按钮
		let msg=document.getElementById('msg');
		pop.style.display='inline';
		document.getElementById(title).style.display="inline";
		close.onclick=function(){//关闭弹出框
			pop.style.display='none';
			document.getElementById(title).style.display="none";
		}
		sub.onclick=function(){//提交修改
			console.log(msg.value+'-----'+id+'   '+title+'newState:'+' '+newState);
			pop.style.display='none';
			if(typeof callback==='function'){
				callback();
			}
			console.log(id)

			/**
			 * 此处发送修改请求
			 */
		}
	}
	//清除左边的复选框
	cleanLeft(){
		//取消左边的全部复选框
		let checkBoxs = document.getElementById('classList').getElementsByTagName('input');
		for (let j = 0; j < checkBoxs.length; j++) {
			checkBoxs[j].checked = false;
		}
	}
	//批量操作
	batch(){
		let that=this;
		let tingyong=document.getElementById('states').children[0];
		let qiyong=document.getElementById('states').children[1];
		let bohui=document.getElementById('states').children[2];
		//console.log(bohui)
		let items=document.getElementById('courses').getElementsByTagName('input');
		let id;
		tingyong.onclick=function(){//批量停用
			id=[];
			for(let i=0;i<items.length;i++){
				if(
					items[i].checked&&(items[i].value=='0'||items[i].value=='2'||items[i].value=='4')
				){
					id.push(items[i].id);//
				}
			}
			if(id.toString()===[].toString()){
				alert('没有可停用的课程');
				return;////
			}
			that.popup(id,'tingyong',4,that.cleanLeft);
		}
		bohui.onclick=function(){//批量驳回
			id=[];
			for(let i=0;i<items.length;i++){
				if(
					items[i].checked&&items[i].value=='2'
				){
					id.push(items[i].id);//
				}
			}
			if(id.toString()===[].toString()){
				alert('没有可驳回的课程');
				return;
			}
			that.popup(id,'bohui',3,that.cleanLeft);
		}
		qiyong.onclick=function(){
			id=[];
			for(let i=0;i<items.length;i++){
				if(
					items[i].checked&&items[i].value=='3'
				){
					id.push(items[i].id);//
				}
			}
			if(id.toString()===[].toString()){
				alert('没有可启用的课程');
				return;
			}
			console.log('启用：'+id);
			//此处最好加个验证，若后台返回已启用的信息，在执行后面的任务
			that.cleanLeft();
		}
	}
	//List渲染
	render() {
		this.batch()//给批量操作按钮绑定事件
		//this.props.callback();
		let btn=document.getElementById('selecAll');
		btn.onclick=this.selectAll;
		//为"全选"绑定事件
		let courses = this.props.datas.data.course;
		let lists = courses.map(e=>this.createList(e));
		return (<div>{lists}</div>);
	}
}


var BluMUI_M = {
	DropList: BluMUI_DropList,
	UserLoginState: BluMUI_UserLoginState,
	NavList: BluMUI_NavList,
	ClassInfBox: BluMUI_ClassInfBox,
	PT: BluMUI_PT,
	Sch: BluMUI_Sch,
	ShowList: BluMUI_CouseLists,
	CreateTitle: BluMUI_CreateTitle
}
var BluMUI = {
	result: {},
	create: function (data, type, elem) {
		var props = data, Blu = BluMUI_M[type];
		this.result[props.id] = ReactDOM.render(<Blu {...props}/>, elem);
	}
};
export default BluMUI;
