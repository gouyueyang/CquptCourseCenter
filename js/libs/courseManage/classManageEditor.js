import React from 'react';
import ReactDOM from 'react-dom';

class BlueMUI_Radio extends  React.Component{
	constructor(props){
		super(props);
		this._onclick=this._onclick.bind(this);
		this.state = {
			selected:false
		}
	}
	_onclick(e){
		this.props.callback();
		this.setState((prevState)=>({
			selected:!prevState.selected
		}))
	}
	render(){
		var selected = this.props.selected !=undefined ?this.props.selected:this.state.selected;
		return(
			<div className="BlueMUI_Radio">
				<span className="name">
						{this.props.name}
					</span>
				<span onClick={this._onclick}
						className={selected?"radio selected":'radio'}
				>
					</span>
			</div>
		)
	}
}
class BluMUI_List extends  React.Component{
	constructor(props) {
		super(props);
		this.state = {
			index: this.props.index
		}
		this._onClick = this._onClick.bind(this);
	}
	_onClick(index,item){
		var that=this;
		if(item.callback)
			return(
				function () {
					that.setState({
						index: index
					})
					item.callback(that.props.ajaxName,index,that,1,that.props.items);
				}
			);
	}
	_createLi(){
		var result=[],
			i,
			len,
			items=this.props.items;
		for(i=0,len=items.length;i<len;i++){
			result.push(
				<li key={i}
					 className={this.state.index==i?'selected index'+i:'index'+i}
					 data-key={i}>
					{
						items[i].url
						&&
						<a title = {items[i].value}
							href= {items[i].url}
							target="_blank"
							onClick={this._onClick(i,items[i])}
						>{items[i].value}</a>
						||
						<a title = {items[i].value}
							onClick={this._onClick(i,items[i])}
						>{items[i].value}</a>
					}
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
class BluMUI_SimpleDrop extends  React.Component{
	constructor(props){
		super(props);
		this.state={
			selectedValue:'',
			selected:this.props.initalSelected,
			open:false
		}
		this._onClick=this._onClick.bind(this);
		this._open=this._open.bind(this);
	}
	_open(){
		this.setState(
			(prevState,props)=>(
				{
					open:!prevState.open
				}));
	}

	_createIitem(){
		var result=[],
			i,
			len;
		for(i=0,len=this.props.items.length;i<len;i++){
			result.push(
				<li key={i}
					 onClick={this._onClick(this.props.items[i])}
				>
					{this.props.items[i]}
				</li>
			)
		}
		return result;
	}
	_onClick(value){
		var that=this;
		return function () {
			that.setState(
				(prevState,props)=>(
					{
						open:!prevState.open,
						selected:value,
						selectedValue:value
					}
				));
			if(that.props.callback)
				that.props.callback(value);
		}
	}
	render(){
		return(
			<div className={"BluMUI_SimpleDrop "+this.props.extClass}
				  id={this.props.id}
			>
				<span className="selected"
						data-value={this.state.selected}
						onClick={this._open}>
					{this.state.selected}
				</span>
				<ul className={this.state.open?"selectArea":"noSelectArea"}
				>
					{this._createIitem()}
				</ul>
				<input type="hidden"
						 value={this.state.selectedValue}
						 id={this.props.name}
				/>
			</div>
		)
	}
}
class BluMUI_Table extends  React.Component{
	constructor(props){
		super(props);
		this._onClick=this._onClick.bind(this);
	}
	_onClick(item,that,i){
		var that = this;
		if(item.callback){
			return function () {
				item.callback(that.props.ajaxName,i,that,0);
			}
		}
	}
	componentWillReceiveProps(nextProps){
		this.setState({
			items:nextProps.items
		})
	}
	_create(){
		var result=[],
			i,
			items=this.props.items,
			len;
		for(i=0,len=items.length;i<len;i++){
			result.push(
				<tr  key={i} className={i==0?'thead':'tbody'}>
					{items[i].map((value,index)=>(
						<td key={index}
							 className={"td"+index}
						>
							{value.url&&
							<a href={value.url} onClick={this._onClick(value,this,i)}>
								{value.value}
							</a>
							}
							{!value.url&&
							<a onClick={this._onClick(value,this,i)}>
								{value.value}
							</a>
							}
						</td>
					))}
				</tr>
			);
		}
		return result;
	}
	render() {
		return (
			<table className={'BluMUI_Table '+this.props.extClass}
					 id={this.props.id}
			>
				<tbody>
				{this._create()}
				</tbody>
			</table>
		)
	}
}
class BluMUI_FileUp extends React.Component{
	constructor(props){
		super(props);
		this._warn=this._warn.bind(this);
	}
	_warn(e){
		var value=e.target.value,
			warn;
		if(value){
			warn=value;
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
						<span>选择文件</span>
						<input type="file"
								 id={this.props.fileId}
								 name={this.props.fileFormName}
								 onChange={this._warn}
						/>
					</div>
					<span ref={(warnBox)=>(this.warnBox = warnBox)} className="warn" id={this.props.warnId || "warn"} >未选择文件</span>
				</div>
			</div>
		)
	}
}
class BluMUI_classItru extends  React.Component{
	constructor(props) {
		super(props);
		this.state={
			fileName:this.props.fileName || '',
			editor:null
		}
		this._upLoad=this._upLoad.bind(this);
		this._save=this._save.bind(this);
	}
	_upLoad(){
		this.props.uploadFile(this.file.files,'Itru',this.img,this);
	}
	_save(){
		var contentText = this.state.editor.getContentTxt();
		var data={
			picName:{
				value:this.state.fileName
			},
			introduction:{
				value:contentText,
				checkValue:contentText,
				pattern:/\S{1,}/
			},
			introductionHtml:{
				value:this.state.editor.getContent()
			}
		}
		this.props.saveAjax(data,this.props.ajaxName,this);
	}
	componentDidMount(){
		var that = this,
			editor = this.state.editor;
		if(editor){
			editor.render(document.getElementById('editor'));
		}else{
			editor = this.state.editor = new UE.ui.Editor();
			editor.render(document.getElementById('editor'));
		}
		editor.addListener('ready', function( ) {
			if(that.props.html){
				editor.setContent(that.props.html);
			}
			if(!that.props.isPass){
				editor.setDisabled('fullscreen');
			}
		});
	}
	render(){
		return(
			<div id={this.props.id}>
				<div>
					<span className="title">课程简介</span>
				</div>
				<div className="Item" id="surface">
					<span className="itemNameM" >课程封面</span>
					<div className="fileArea" >
						<img className="fileInput" ref={(img)=>(this.img = img)} src ={this.props.tpurl}>
						</img>
						{this.props.isPass &&
						<span>(建议上传长宽比例为1:1的图片)</span>
						}
					</div>
					{this.props.isPass &&
					<span className="fileUp activeBtn">
						<input type="file"
								 name="file"
								 id="faceImg"
								 onChange={this._upLoad}
								 ref={(file) => {
									 this.file = file
								 }}
						/>
						选择封面
					</span>
					}
					{this.props.isPass&&
					<span id="warn_picName" className="warn1"></span>
					}
				</div>
				<div className="Item" id="short">
					<span className="itemNameM">课程简介</span>
					<div id="textEditorWarp">
						<script id="editor" style={{height:400}}></script>
					</div>
					<div className="warn2" id="warn_introduction" ></div>
				</div>
				{this.props.isPass&&
				<button onClick={this._save} id="save" className="activeBtn">保存</button>
				}
			</div>
		)
	}
}
class BluMUI_AssessmentScheme extends  React.Component{
	constructor(props){
		super(props);
		this.state={
			items:this.props.items,
			isDown:false,
			isUpload:this.props.isUpload || true
		};
		this._isDown = this._isDown.bind(this);
		this._save=this._save.bind(this);
	}
	componentWillReceiveProps(nextProps){
		this.state={
			items:nextProps.items
		};
	}
	_isDown(){
		this.setState({
			isDown:!this.state.isDown
		})
	}
	_save(e){
		if(this.state.isUpload) {
			var data = {
				file: {
					value: document.getElementById('file').files,
					maxSize: 20,
					errorInf: '未选择文件',
					suffix: ['pdf']
				},
				ableDownload: {
					value:  this.state.isDown ? 1 : 2
				}
			};
			if (this.props.saveAjax)
				this.props.saveAjax(data, this.props.ajaxName, this);
		}
	}
	_createList(){
		var i,
			j,
			items=this.state.items,
			result=[];
		for(i = 0,j=items.length;i<j;i++){
			if(!this.props.isPass){
				items[i].splice(1,1);
			}
			result.push(
				<BluMUI_List id=""
								 key={i}
								 items={this.state.items[i]}
								 callback={this.props.callback}
								 ajaxName = {this.props.ajaxName}
				>
				</BluMUI_List>
			)
		}
		return result;
	}
	render() {
		return (
			<div id={this.props.id}>
				<div>
					<span className="title" >{this.props.title}</span>
				</div>
				{this.props.isPass&&
				<div>
					<div className="Item" id="khfa">
						<span className="itemNameM">{this.props.title}</span>
						<BluMUI_FileUp fileId = "file"
											warnId = "warn_file"
											fileFormName={this.props.fileFormName}
						></BluMUI_FileUp>
					</div>
					<div className="Item" id="isDown">
						<span className="isDownLoadFile">允许下载</span>
						<BlueMUI_Radio callback={this._isDown}
											selected = {this.state.isDown}
						></BlueMUI_Radio>
					</div>
					<button onClick={this._save} className={this.state.isUpload?'activeBtn':'noActiveBtn'}>上传</button>
					<div className="Item">
						<span className="uploadWarn">只允许上传pdf格式的文件</span>
					</div>
				</div>
				}
				<div className="fileList">
					{this._createList()}
				</div>
			</div>
		);
	}
}
class BluMUI_StudySource extends  React.Component{
	constructor(props) {
		super(props);
		this.state={
			isDown:true,
			fileName:'',
			bookType:'',
			otherVideo:this.props.otherVideo,
			sourceType:this.props.title,
			jcBooks:this.props.jcBooks,
			ckBooks:this.props.ckBooks,
			onlineSource:this.props.onlineSource,
			onlineURL:this.props.onlineURL,
			videos:this.props.videos,
			jyFile:this.props.jyFile,
			jyAttachment:this.props.jyAttachment,
			hkFile:this.props.hkFile,
			xtFile:this.props.xtFile,
			isUpload:true,
			isUpload1:true,
			addBox:false
		}
		this._isDown = this._isDown.bind(this);
		this._uploadPic=this._uploadPic.bind(this);
		this._delete=this._delete.bind(this);
		this._add=this._add.bind(this);
		this._sure=this._sure.bind(this);
		this._off=this._off.bind(this);
		this._save = this._save.bind(this);
	}
	_off(){
		this.setState(
			{
				addBox:false
			}
		)
	}
	_sure(){
		var data={
			picURL:{
				value:this.state.fileName,
				type:'picName'
			},
			bookName:{
				value:this.bookName.value,
				pattern:/\S{1,}/,
				errorInf:'未填写书籍名称'
			},
			author:{
				value:this.author.value,
				pattern:/\S{1,}/,
				errorInf:'未填作者名字'
			},
			press:{
				value:this.press.value,
				pattern:/\S{1,}/,
				errorInf:'未填写出版社'
			},
			bookType:{
				value:this.state.bookType
			}
		}
		this.props.saveAjax(data,this.state.bookType,this);
	}
	_add(type){
		var that=this;
		return function () {
			that.setState((prevState,props)=>({
				addBox:!prevState.addBox,
				bookType:type
			}));
		}
	}
	_delete(type,index){
		var that=this,
			item;
		switch (type){
			case '微视频':
				item = this.state.videos;
				break;
			case '教材':
				item = this.state.jcBooks;
				break;
			case '参考书':
				item = this.state.ckBooks;
				break;
		}
		return function (){
			that.props.deleteFile(type,index,that,2,item);
		}
	}
	_uploadPic(){
		this.props.uploadFile(this.file.files,'teachBook',this.img,this);
	}
	_createSimpDrop(){
		var result=[],
			i,
			drops=this.props.drops,
			len;
		for(i=0,len=drops.length;i<len;i++){
			var props=drops[i]
			result.push(
				<BluMUI_SimpleDrop {...props}
										 key={i}
				>
				</BluMUI_SimpleDrop>
			)
		}
		return result;
	}

	_createList(ajaxName){
		var i,
			j,
			items,
			result=[];
		if(ajaxName == '讲义附件'){
			items = this.state.jyAttachment;
		}
		if(ajaxName == '讲义'){
			items = this.state.jyFile;
		}
		if(ajaxName == '作业'){
			items = this.state.hkFile;
		}
		if(ajaxName == '习（试）题库'){
			items = this.state.xtFile;
		}
		if(ajaxName == '网络参考资源'){
			items = this.state.onlineSource
		}
		if(ajaxName == '网络学习资源URL' ){
			items = this.state.onlineURL;
		}
		if( ajaxName =='其他微视频' ){
			items = this.state.otherVideo;
		}
		if( ajaxName == '微视频'){
			items = this.state.videos;
		}
		for(i = 0,j=items.length;i<j;i++){
			if(!this.props.isPass){
				items[i].splice(1,1);
			}
			result.push(
				<BluMUI_List id = ""
								 key = {i}
								 items = {items[i]}
								 ajaxName = {ajaxName}
				>
				</BluMUI_List>
			)
		}
		return result;
	}
	_createBookItem(bookInf,type){
		var i,
			len,
			result=[];
		for(i=0,len=bookInf.length;i<len;i++){
			result.push(
				<div className="bookBox" key={i}>
					<img src={bookInf[i].img}></img>
					<ul className="bookBoxWarp">
						<li>
							<span className="name">书籍名称</span>
							<span className="value"><a>:</a>{bookInf[i].bookName}</span>
						</li>
						<li>
							<span className="name">作者</span>
							<span className="value"><a>:</a>{bookInf[i].author}</span>
						</li>
						<li>
							<span className="name">出版</span>
							<span className="value">
								<a>:</a>{bookInf[i].publisher}
							</span>
						</li>
					</ul>
					{this.props.isPass &&
					<span className="delete" onClick={this._delete(type, i)}>删除</span>
					}
				</div>
			)
		}
		return (
			<div className="bookWarp">
				{result}
			</div>
		);
	}
	componentWillMount(){
		this.setState({
			isDown:false
		});
	}
	_isDown(){
		this.setState({
			isDown:!this.state.isDown
		})
	}
	_save(ID,type,fileId){
		var data ={},
			that = this;
		return function(){
			if(type == 'file' ) {
				var file = document.getElementById(fileId).files;
				data.file = {
					value: file,
					errorInf: '未选择文件',
					type:fileId,
					maxSize: 20
				};
				data.ableDownload = {
					value:1
				};
				if(ID == '讲义'){
					data.file.suffix=['pdf'];
					data.ableDownload.value  = that.state.isDown?1:2;
				}
				if (ID == '微视频') {
					data.speaker = {
						value: document.getElementById('speaker1').value,
						errorInf: '未填写主讲人',
						pattern: /\S{1,}/,
						type: 'speaker1'
					}
					data.file.maxSize = 500;
					data.file.suffix = ['mp4'];
				}

				if(that.state.isUpload && ID!='讲义附件') {
					that.props.saveAjax(data, ID, that);
				}else if(that.state.isUpload1){
					that.props.saveAjax(data, ID, that);
				}
			}
			else{
				var sourceName = document.getElementById('name').value,
					link = document.getElementById('link').value;
				data = {
					linkURL:{
						value:link,
						pattern:/^(http(s)?:\/\/){1}\w+\.\w+\.\w+/,
						errorInf:'未填写资源地址或者地址格式错误'
					},
					linkName:{
						value:sourceName,
						pattern:/\S{1,}/,
						errorInf:'未填写资源名称'
					}
				}
				if(ID == '其他微视频'){
					data.speaker = {
						value:document.getElementById('speaker2').value,
						errorInf:'未填写主讲人',
						pattern:/\S{1,}/,
						type:'speaker2'
					}
					data.linkName.errorInf = '未填写视频名称';
					data.linkURL.errorInf = '未填写视频资源地址或者地址格式错误';
				}
				that.props.saveAjax(data,ID,that)
			}
		}
	}
	_selector(){
		var result,
			sourceType = this.state.sourceType;
		switch (sourceType){
			case "微视频":
				result=(
					<div>
						{this.props.isPass &&
						<div className="Item inputWarp">
							<span className="itemNameM">主讲人</span>
							<input type="text" id="speaker1"/>
							<span className="warn" id="warn_speaker1"></span>
						</div>
						}
						<div className="Item" id="content3">
							<span className="itemNameM">{sourceType}</span>
							{this.props.isPass &&
							<BluMUI_FileUp fileId = 'file'
												warnId = 'warn_file'
												fileFormName={this.props.fileFormName}
							></BluMUI_FileUp>
							}
						</div>
						{this.props.isPass &&
						<button className={this.state.isUpload?'save activeBtn':'save noActiveBtn'} onClick={this._save('微视频', 'file','file')}>上传</button>
						}
						{this.props.isPass &&
						<div className="Item">
							<span className="uploadWarn">只允许上传mp4格式的视频(最大500M)</span>
						</div>
						}
						<div className="VideoList">
							{this._createList('微视频')}
						</div>
						<div className="Item" id="content5">
							<span className="itemName">录播视频</span>
						</div>
						{this.props.isPass &&
						<div className="Item inputWarp">
							<span className="itemNameM">主讲人</span>
							<input type="text" id="speaker2"/>
							<span className="warn" id="warn_speaker2"></span>
						</div>
						}
						{this.props.isPass &&
						<div className="Item inputWarp">
							<span className="itemNameM">视频名称</span>
							<input type="text" id="name"/>
							<span className="warn" id="warn_linkName"></span>
						</div>
						}

						{this.props.isPass &&
						<div className="Item inputWarp">
							<span className="itemNameM">视频资源地址</span>
							<input type="text" id="link"/>
							<span className="warn" id="warn_linkURL"></span>
						</div>
						}
						{this.props.isPass &&
						<button className="save activeBtn" onClick={this._save('其他微视频', 'link')}>添加</button>
						}
						<div className="fileList">
							{this._createList('其他微视频')}
						</div>
					</div>
				);
				break;
			case "网络在线学习资源及链接":
				result=(
					<div>
						<div className="Item" id="content4">
							<span className="itemNameM">网络参考资源</span>
							{this.props.isPass &&
							<BluMUI_FileUp fileId="file"
												fileFormName={this.props.fileFormName}
												warnId = 'warn_file'
							></BluMUI_FileUp>
							}
						</div>
						{this.props.isPass &&
						<button className={this.state.isUpload?'save activeBtn':'save noActiveBtn'} onClick={this._save('网络参考资源', 'file','file')}>上传</button>
						}
						{this.props.isPass &&
						<div className="fileList">
							{this._createList('网络参考资源')}
						</div>
						}
						{this.props.isPass &&
						<div className="Item inputWarp">
							<span className="itemNameM">其他资源名称</span>
							<input type="text" id="name"/>

							<span className="warn" id="warn_linkName"></span>
						</div>
						}
						{this.props.isPass &&
						<div className="Item inputWarp">
							<input type="text" id="link"/>
							<span className="itemNameM">其他资源地址</span>
							<span className="warn" id="warn_linkURL"></span>
						</div>
						}
						{this.props.isPass &&
						<button className="save activeBtn" onClick={this._save('网络学习资源URL', 'link')}>添加</button>
						}
						<div className="fileList">
							{this._createList('网络学习资源URL')}
						</div>
					</div>
				);
				break;
			case '讲义':
				result=(
					<div>
						<div className="Item" id="content">
							<span className="itemNameM">讲义</span>
							{this.props.isPass&&
							<BluMUI_FileUp fileId="file"
												fileFormName={this.props.fileFormName}
												warnId = 'warn_file'
							></BluMUI_FileUp>
							}
						</div>
						<div className="Item" id="isDown">
							<span className="isDownLoadFile_jy">允许下载</span>
							<BlueMUI_Radio callback={this._isDown}
												selected = {this.state.isDown}
							></BlueMUI_Radio>
						</div>
						{this.props.isPass&&
						<button className={this.state.isUpload?'save activeBtn':'save noActiveBtn'} onClick={this._save('讲义','file','file')}>上传</button>
						}
						{
							this.props.isPass &&
							<div className="Item">
								<span className="uploadWarn">只允许上传pdf格式的文件,用户可在线浏览讲义(最大20M)</span>
							</div>
						}
						<div className="fileList">
							{this._createList('讲义')}
						</div>
						<div className="Item" id="content">
							<span className="itemNameM">其他附件</span>
							{this.props.isPass&&
							<BluMUI_FileUp fileId="file1"
												fileFormName={this.props.fileFormName}
												warnId = 'warn_file1'
							></BluMUI_FileUp>
							}
						</div>
						{this.props.isPass&&
						<button className={this.state.isUpload1?'save activeBtn':'save noActiveBtn'} onClick={this._save('讲义附件','file','file1')}>上传</button>
						}
						{
							this.props.isPass &&
							<div className="Item">
								<span className="uploadWarn">用户只能下载附件(最大20M)</span>
							</div>
						}
						<div className="fileList">
							{this._createList('讲义附件')}
						</div>
					</div>
				);
				break;
			case "习（试）题库":
			case "作业":
				result=(
					<div>
						<div className="Item" id="content">
							<span className="itemNameM">{sourceType}</span>
							{this.props.isPass&&
							<BluMUI_FileUp fileId="file"
												fileFormName={this.props.fileFormName}
												warnId = 'warn_file'
							></BluMUI_FileUp>
							}
						</div>
						{this.props.isPass&&
						<button className={this.state.isUpload?'save activeBtn':'save noActiveBtn'} onClick={this._save(sourceType,'file','file')}>上传</button>
						}
						{
							this.props.isPass &&
							<div className="Item">
								<span className="uploadWarn">用户只能下载该文件,不能在线浏览(最大20M)</span>
							</div>
						}
						<div className="fileList">
							{this._createList(sourceType)}
						</div>
					</div>
				);
				break;
			case  '教材/参考书':
				result=(
					<div id="teachBook">
						<div className="Item" id="content1">
							<span className="itemName">课程教材</span>
							{this.props.isPass &&
							<button onClick={this._add('教材')} className="activeBtn">添加</button>
							}
						</div>
						{this._createBookItem(this.state.jcBooks,'教材')}
						<div className="Item" id="content2">
							<span className="itemName">参考书</span>
							{this.props.isPass &&
							<button onClick={this._add('参考书')} className="activeBtn">添加</button>
							}
						</div>
						{this._createBookItem(this.state.ckBooks,'参考书')}
					</div>
				)
				break;
			default:
				break
		}
		return result;
	}
	render(){
		return(
			<div id={this.props.id} className="BluMUI_Table">
				<div>
					<span className="title">学习资源</span>
				</div>
				<div className="Item" id="sourceType">
					<span className="itemName" >资源类型</span>
					<div className="dropList">
						{this._createSimpDrop()}
						<div className="warn"></div>
					</div>
				</div>
				{this._selector()}
				{this.state.addBox&&
				<div id="addBox">
					<div className="box">
						<div className="header">
							<span>{'添加' + this.state.bookType}</span>
						</div>
						<div className="body">
							<div className="Item" id="face">
								<span className="itemName">教材封面</span>
								<div className="fileArea">
									<img className="fileInput"  ref={(img)=>(this.img=img)} src="../../imgs/home-course/default.png">
									</img>
								</div>
								<span className="fileUp activeBtn" >
									<input type="file"
											 ref={(file)=>(this.file=file)}
											 onChange={this._uploadPic}
									/>
									上传封面
								</span>
								<span id="warn_picName" className="warn1"></span>
							</div>
							<div className="Item1">
								<span className="itemNameM">书籍名称</span>
								<input type="text"  ref={(bookName)=>(this.bookName=bookName)}/>
								<span id="warn_bookName" className="warn2"></span>
							</div>
							<div className="Item1">
								<span className="itemNameM">作者</span>
								<input type="text"  ref={(author)=>(this.author=author)}/>
								<span id="warn_author" className="warn2"></span>
							</div>
							<div className="Item1">
								<span className="itemNameM">出版社</span>
								<input type="text"  ref={(press)=>(this.press=press)}/>
								<span id="warn_press" className="warn2"></span>
							</div>
							<div className="control">
								<button className="left" onClick={this._sure}>确定</button>
								<button className="right" onClick={this._off}>取消</button>
							</div>
						</div>
					</div>
				</div>
				}
			</div>
		)
	}
}
class BluMUI_CourseStatus extends  React.Component{
	constructor(props){
		super(props)
	}
	_createLi(items){
		var i,
			len,
			result = [];
		for( i = 0 , len = items.length ; i < len ; i++){
			result.push(
				<li key={i} className="status">{items[i]}</li>
			);
		}
		return result;
	}
	render(){
		return (
			<div className="BluMUI_CourseStatus" >
				{
					this.props.noSubmit.length>0&&
					<ul>
						<li className="statusTitle">未被提交:</li>
						{this._createLi(this.props.noSubmit)}
					</ul>
				}
				{
					this.props.noReviewCourse.length>0&&
					<ul>
						<li className="statusTitle">未被审核:</li>
						{this._createLi(this.props.noReviewCourse)}
					</ul>
				}
				{
					this.props.passCourse.length>0&&
					<ul>
						<li className="statusTitle">审核通过:</li>
						{this._createLi(this.props.passCourse)}
					</ul>
				}
				{
					this.props.rejectCourse.length>0&&
					<ul>
						<li className="statusTitle">已被驳回:</li>
						{this._createLi(this.props.rejectCourse)}
					</ul>
				}
				{
					this.props.notes.length>0&&
					<ul className="notes">
						<li className="statusTitle">备注:</li>
						{this._createLi(this.props.notes)}
					</ul>
				}
			</div>
		)
	}
}
var BluMUI_M={
	List:BluMUI_List,
	ClassItru:BluMUI_classItru,
	AssessmentScheme:BluMUI_AssessmentScheme,
	CourseStatus:BluMUI_CourseStatus,
	StudySource:BluMUI_StudySource,
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
