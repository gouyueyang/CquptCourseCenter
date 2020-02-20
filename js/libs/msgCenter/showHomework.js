import React from 'react';
import ReactDOM from 'react-dom';
// import CKEditor from '@ckeditor/ckeditor5-react';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
// import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
// import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
// import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
// import WordCount from '@ckeditor/ckeditor5-word-count/src/wordcount';
// import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/simpleuploadadapter';

import wangeditor from 'wangeditor';
import Fanye from '../turnPage';
import moment from 'moment';
import Alert from "../../util/alert.js";

class BluMUI_TopicDis extends React.Component {
    constructor(props) {
        super(props);
        
        let fjList = this.props.fjList.list;
        let items = [];
        for(let i = 0;i<fjList.length;i++){
            console.log(i);
            let fileName = fjList[i].fileName,
            originName = fjList[i].originName;
            items.push([
				{ value: originName },
				{ value: '删除', fileName: fileName, callback: this.props.deleteFile },
				{ value: '下载', downloadName: originName, fileName: fileName, callback: this.props.downloadFile }
            ]);
        }
        fjList = items;
        this.state = {
            isBanReply:this.props.topicInfo.sfyxhf,
            htzt:this.props.topicInfo.dqzt,//话题状态
            fhid:this.props.hfid,
            hfMsg:this.props.hfMsg,
            secondReplyMsgs:this.props.secondReplyMsgs,
            banReplys: {},//标记禁止回复的话题
            page: 1, // 第几页回复
            count: 5, // 默认展示10条回复
            allReplyConfig: {}, // 所有子回复列表的配置选项
            allReplyList: {}, // 所有的子回复列表
            zhfSelect:-1,//主回复选择，保证只有一个回复框显示
            sendReplyInfo: {
                "htid":this.props.topicInfo.htid,
                "hfdxsfrzh":this.props.topicInfo.zzsfrzh,
                "zhzhf": 1,
                "fjd": -1,
                "hfnr":""
            },  //发送回复的信息
            fjList:fjList
        }
        // this._setFjList(this.props.fjList);
    }

    
    

    render() {
        let {hfid,htzt,page, count,isBanReply,zhfSelect,fjList} = this.state;
        let { kcbh,topicInfo,pageInfo,userId,qx,userType,getTopicFj } = this.props;
        let topHfid = pageInfo.hfid;//定位回复id
        let { total, totalPages, hfList } = this.state.hfMsg; // 话题总的数量，总页数， 话题列表
        let options = { pages: totalPages, page, rows: total };
        let {hfnr} = this.state.sendReplyInfo;

        
        return (
            <div id="topicDis">
				<div id="topicInfo">
					<h2 id="topic_htbt">{topicInfo.htbt}</h2>
					<div id="topic_Info">
							<div className="topic_htnr" dangerouslySetInnerHTML={{ __html: topicInfo.htnr }}>
							</div>
                            <div className="fjList">
                                {
                                    fjList.map((item,index)=>{
                                        return(<BluMUI_List id='' key={index} listIndex={index} item={item} userType={userType}></BluMUI_List>)
                                    })
                                }
                            </div>
							<div className="topic_bottom clearfix">

								<div className="bottom_authCon">
                                    <span>{topicInfo.zzxm}</span>
									<span>{moment(parseInt(topicInfo.fbsj)).format('YYYY-MM-DD HH:mm:ss')}</span>
								</div>
								<div className="bottom_inform">
                                    {(qx.deleteTopic && (userType == "管理员" || userType == "课程负责人" || userType == "督导" || userType == "助理" || userId == topicInfo.zzsfrzh || userId == topicInfo.jssfrzh)) ? <a className="hidden" href="javascript:void(0);" onClick={() => { this._topicOperate({ htid: topicInfo.htid, cz: '删除' }) }}>删除</a> : ''}
                                    {qx.openTopic && htzt ==1 && (userType == "管理员" || userType == "课程负责人" || userType == "督导" || userType == "助理" || userId == topicInfo.jssfrzh) ?
                                        (htzt == 1 && <a href="javascript:void(0);" onClick={this._topicOperate.bind(this, { htid: topicInfo.htid, cz: '公开' })}>公开作业</a>):null}
                                    {qx.openTopic && htzt ==2 && (userType == "管理员" || userType == "课程负责人" || userType == "督导" || userType == "助理" || userId == topicInfo.jssfrzh) ?
                                        (htzt == 2 && <a href="javascript:void(0);" onClick={this._topicOperate.bind(this, { htid: topicInfo.htid, cz: '设置班内可见' })}>取消公开</a>):null}
                                    
								</div>
							</div>
						

					</div>
					<div id="hf_list">
                        {
                            hfList.map((item,index)=>{
                                return(
                                    <BluMUI_ReplyItem key={item.hfid} ref={`replyItem_${item.hfid}`} topicInfo={topicInfo} topHfid={topHfid} replyInfo={item} userId={userId} qx={qx} userType={userType} getDetailReplyListFun={this.props.getDetailReplyListFun}
                                        creatReportBox={this.props.creatReportBox} replyOperate={this._replyOperate} publishReplyFun={this.props.publishReplyFun}
                                        changeZhfSelect={this._changeZhfSelect}
                                        zhfSelect = {zhfSelect}
                                    ></BluMUI_ReplyItem>
                                )
                            })
                        }
					</div>
                    {
                        totalPages >1 &&
                        <Fanye This={this} options={options}
                        callback={this._searchReply.bind(this)} />
                    }
                    {
                        (userType == "管理员" || userType == "课程负责人" || userType == "督导" || userType == "助理" || userId == topicInfo.zzsfrzh || userId == topicInfo.jssfrzh) &&
                        <div id="sendMsg">
					    	<h4>添加作业说明或解题思路</h4>
                        
                            <div id="editor">
                            </div>
					    	<div className="msg_bottom">
					    		<button onClick={this._sendReply}>发   表</button>
					    	</div>
					    </div>
                    }
					
				</div>
			</div>
        )
    }
    
    componentDidMount() {
        let editor = new wangeditor("#editor");

        editor.customConfig.zIndex = 10;
        
        editor.customConfig.onchange = (html)=>{
            console.log(html);
            console.log(html.length);
            
            if(html.length>2000){
                Alert.open({
                    alertTip: "输入内容过长！",
                    closeAlert: function () {}
                });
                editor.cmd.do('undo');
            }
        }
	    //开启debug模式
	    editor.customConfig.debug = true;
	    // 关闭粘贴内容中的样式
	    editor.customConfig.pasteFilterStyle = false
	    // 忽略粘贴内容中的图片
	    editor.customConfig.pasteIgnoreImg = true
	    // 使用 base64 保存图片
	    //editor.customConfig.uploadImgShowBase64 = true
        


	    // 上传图片到服务器
	    editor.customConfig.uploadFileName = 'myFile'; //设置文件上传的参数名称
	    editor.customConfig.uploadImgServer = courseCenter.host + 'uploadFile'; //设置上传文件的服务器路径
	    editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024; // 将图片大小限制为 3M
	    editor.customConfig.uploadImgMaxLength = 1;//限制一次上传一张
	    //自定义上传图片事件
	    editor.customConfig.uploadImgHooks = {
	    	before : function(xhr, editor, files) {
            
	    	},
	    	success : function(xhr, editor, result) {// 图片上传并返回结果，图片插入成功之后触发
	    		// xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
	    		var url = courseCenter.host+"upload/PIC/"+result.data[0];
	    		alert(url);
	    		editor.txt.append(url);
	    	},
	    	fail : function(xhr, editor, result) {
	    		console.log("上传失败,原因是"+result);
	    	},
	    	error : function(xhr, editor) {
	    		console.log("上传出错");
	    	},
	    	timeout : function(xhr, editor) {
	    		console.log("上传超时");
	    	},
	    	// 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
        	// （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
        	customInsert: function (insertImg, result, editor) {
        	    // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
        	    // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
        	    // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
        	    var url = courseCenter.host+"upload/PIC/"+result.data[0];
        	    insertImg(url);
        	    // result 必须是一个 JSON 格式字符串！！！否则报错
        	}
	    };
    
        editor.create();
        this.editor = editor;
        // ClassicEditor
        //     .create(document.querySelector('#editor'),{
        //         language : 'zh-cn',
        //         toolbar: ['heading', '|', 'bold', 'italic','|',  'link', 'bulletedList', 'numberedList', 'blockQuote','|', 'Undo','Redo'],
        //         // plugins: [ WordCount, Paragraph, Bold, Italic ],
        //         // toolbar: [ 'bold', 'italic' ]
        //     })
        //     .then(newEditor => {
        //         this.editor = newEditor;
               
        //     })
        //     .catch(err => {
        //         console.error(err.stack);
        //     });
        let topHfid = this.props.pageInfo.hfid;
        
        // document.querySelector(`#${topHfid}`) && 
        window.location.hash = `#topHfid`;
    }

    _setFjList=(fjList)=>{
        let items = [];
        for(let i = 0;i<fjList.length;i++){
            let fileName = fjList[i].fileName,
            originName = fjList[i].originName;
            items.push([
				{ value: originName },
				{ value: '删除', fileName: fileName, callback: this.props.deleteFile },
				{ value: '下载', downloadName: originName, fileName: fileName, callback: this.props.downloadFile }
			])
        }
        this.setState({
            fjList:items
        })
    }

    //搜索回复
    _searchReply = ( page = 1) => {
        let { htid } = this.props.topicInfo;
        let count = 10; // 默认10个回复数
        let fjd = -1;
        this.props.getDetailReplyListFun({ htid,fjd, page, count }).then(result => {
            this.setState({
                hfMsg:result,
                page:page
            })
        })
    }

    //搜索二级回复
    _searchSecondReply = ({fjd,deleteHfid}) =>{
        let { htid } = this.props.topicInfo;
        // let count = 5; // 默认10个回复数
        let replyItemState = this.refs[`replyItem_${fjd}`].state;
        let {page,count} = replyItemState;

        let hfList = this.refs[`replyItem_${fjd}`].state.hfList;

        var arr = [];

        for (var j = 0; j < hfList.length; j++) {

            if (hfList[j].hfid != deleteHfid) {

                arr.push(hfList[j]);
            }
                
        }

        this.props.getDetailReplyListFun({ htid,fjd, page, count }).then(result => {

            this.refs[`replyItem_${fjd}`].setState({
                hfList:arr,
                page:page,
                total:result.total
            })
        })
    }

    _changeZhfSelect = (hfid) => {
        this.setState({
            zhfSelect:hfid
        })
    }
   
    // 改变排序
    _changeState = (name, event) => {
        console.log('event', event, 'value', event.target.value, 'checked', event.target.checked);
        this.setState({
            [name]: event.target.value
        });
    };
    


    //发送回复 
    _sendReply = () => {
        let { htid, hfdxsfrzh, zhzhf, fjd } = this.state.sendReplyInfo;
        // let hfnr = this.editor.getData();
        let hfnr = this.editor.txt.html();
        let {page} = this.state;
        if(hfnr==''){
            Alert.open({
              alertTip: "请输入内容！",
              closeAlert: function () {}
            });
        }else if(hfnr.length>2000){
            Alert.open({
                alertTip: "内容过长！",
                closeAlert: function () {}
              });
            //   this.editor.setData(hfnr.substr(0,499));
            this.editor.txt.html(hfnr.substr(0,1999));
        }else{
            this.props.publishReplyFun({ htid, hfnr, hfdxsfrzh, zhzhf, fjd }).then(result => {
                if (result) {
                    Alert.open({
                      alertTip: "成功发送！",
                      closeAlert: function () {}
                    });
    
                    // this.editor.setData("");
                    this.editor.txt.clear();
                }
            }).then(() => {
                this._searchReply(page);
            }).catch(e => {
                if (e === 101) {
                    window.location.href = 'error1.html'
                } else if (e === 102) {
                    window.location.href = 'error2.html'
                }
            })
        }
        
    }

    //话题操作
    _topicOperate = (data) => {
        let { htid, cz } = data;
        let callback = this.props.topicOperateFun;
        let data1 = data;
        let searchCallback = null;
        let data2 = null;
        switch (cz) {
            case "删除":
                Creat_popup({type:"deleteTopic",callback,data1,searchCallback,data2});
                break;
            case "禁止回复":
                console.log("禁止回复", htid, cz);
                this.props.topicOperateFun({ htid, cz }).then(result => {
                    if (result) {
                        Alert.open({
                          alertTip: "成功设置话题禁止回复！",
                          closeAlert: function () {}
                        });
                       
                        this.setState({
                            isBanReply:0
                        })
                    }
                }).catch(e => {
                    if (e === 101) {
                        window.location.href = 'error1.html'
                    } else if (e === 102) {
                        window.location.href = 'error2.html'
                    }
                });
                break;
            case "解除禁止回复":
                console.log("解除禁止回复", htid, cz);
                this.props.topicOperateFun({ htid, cz }).then(result => {
                    if (result) {
                        Alert.open({
                          alertTip: "成功解除话题禁止回复！",
                          closeAlert: function () {}
                        });
                        this.setState({
                            isBanReply:1
                        })
                        
                    }
                }).catch(e => {
                    if (e === 101) {
                        window.location.href = 'error1.html'
                    } else if (e === 102) {
                        window.location.href = 'error2.html'
                    }
                });
                break;
            case "公开":
            console.log("公开", htid, cz);
                this.props.topicOperateFun({ htid, cz }).then(result => {
                    if (result) {
                        Alert.open({
                          alertTip: "成功公开作业！",
                          closeAlert: function () {}
                        });
                        this.setState({
                            htzt:2
                        })
                    }
                }).catch(e => {
                    if (e === 101) {
                        window.location.href = 'error1.html'
                    } else if (e === 102) {
                        window.location.href = 'error2.html'
                    }
                });
                break;
            case "设置班内可见":
                console.log("设置班内可见", htid, cz);
                this.props.topicOperateFun({ htid, cz }).then(result => {
                    if (result) {
                        Alert.open({
                          alertTip: "成功设置该作业班内可见！",
                          closeAlert: function () {}
                        });
                        this.setState({
                            htzt:1
                        })
                    }
                }).catch(e => {
                    if (e === 101) {
                        window.location.href = 'error1.html'
                    } else if (e === 102) {
                        window.location.href = 'error2.html'
                    }
                });
                break;
            case "点赞":
                console.log("点赞", htid, cz);
                this.props.topicOperateFun({ htid, cz }).then(result => {
                    if (result) {
                        let htList = this.state.topicMsg.htList;
                        console.log(htList);
                        htList.find(obj = obj.htid == htid)[dzs] += 1;
                        console.log(htList);
                        this.setState({
                            topicMsg: { htList: htList }
                        })
                    }
                }).catch(e => {
                    if (e === 101) {
                        window.location.href = 'error1.html'
                    } else if (e === 102) {
                        window.location.href = 'error2.html'
                    }
                });
                break;
            default: break;
        }

    }
    //回复操作
    _replyOperate = (hfid, cz, htid,fjd) => {
        let {page} = this.state;
        let callback = this.props.replyOperateFun;
        let data1 = null;
        let searchCallback = null;
        let data2 = null;
        switch (cz) {
            case "删除主回复":
                data1 = {hfid,cz:"删除"};
                searchCallback = this._searchReply;
                data2 = page;
                Creat_popup({type:"deleteReply",callback,data1,searchCallback,data2});
                
                
                break;
            case "删除子回复":
                data1 = {hfid,cz:"删除"};
                searchCallback = this._searchSecondReply;
                data2 = {fjd,deleteHfid:hfid};
                Creat_popup({type:"deleteReply",callback,data1,searchCallback,data2});
                // console.log("删除回复:" + hfid);
                
                break;
            case "点赞":
                console.log("点赞:" + hfid);
                this.props.replyOperateFun({ hfid, cz }).then(result => {
                    if (result) {
                        Alert.open({
                          alertTip: "成功点赞！",
                          closeAlert: function () {}
                        });
                    }
                }).then(() => {
                    this._searchReply(page);
                }).catch(e => {
                    if (e === 101) {
                        window.location.href = 'error1.html'
                    } else if (e === 102) {
                        window.location.href = 'error2.html'
                    }
                })
                break;
            default: break;
        }
    }

    _showReportBox({ htInfo, hfInfo } = {}) {
        this.props.creatReportBox({htInfo,hfInfo});
    }
}


// 文件列表
class BluMUI_List extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			index: this.props.index
		}
		this._onClick = this._onClick.bind(this);
	}
	_onClick(index, item) {
		var that = this;
		if (index ==1 && item.callback){
            return (
				function () {
                    that.setState({
						index: index
					})
                    let callback = item.callback;
                    let data1 = {
                        listIndex:that.props.listIndex,
                        index:index, 
                        that:that,
                        items:that.props.item
                    };
                    let searchCallback = null;
                    let data2 = null;

                    Creat_popup({type:"deleteFile",callback,data1,searchCallback,data2});
                    
					
					// item.callback( that.props.listIndex,index, that,that.props.item);
				}
			);
        }else if(index == 2 && item.callback){
           
            return (
		    	function () {
                    that.setState({
		    			index: index
		    		})
                
		    		item.callback({
                        listIndex:that.props.listIndex,
                        index, 
                        that,
                        items:that.props.item});
		    	}
		    );
            
        }
	}
	_createLi() {
		var result = [],
			i,
			len,
            item = this.props.item,
            userType = this.props.userType;
            console.log(item);
		for (i = 0, len = item.length; i < len; i++) {
            if(i==0){
                result.push(
                    <li key={i}
                        className={this.state.index == i ? 'selected index' + i : 'index' + i}
                        data-key={i}>
                        {
                            item[i].url
                            &&
                            <a title={item[i].value}
                                href={item[i].url}
                                target="_blank"
                                onClick={this._onClick(i, item[i])}
                            >{item[i].value}</a>
                            ||
                            <a title={item[i].value}
                                onClick={this._onClick(i, item[i])}
                            >{item[i].value}</a>
                        }
                    </li>
                );
            }else if(userType!="游客"&&i==2){
                result.push(
                    <li key={i}
                        className={this.state.index == i ? 'selected index' + i : 'index' + i}
                        data-key={i}>
                        {
                            item[i].url
                            &&
                            <a title={item[i].value}
                                href={item[i].url}
                                target="_blank"
                                onClick={this._onClick(i, item[i])}
                            >{item[i].value}</a>
                            ||
                            <a title={item[i].value}
                                onClick={this._onClick(i, item[i])}
                            >{item[i].value}</a>
                        }
                    </li>
                );
            }else if((userType == "管理员" ||userType == "督导"||(userType == "任课教师" && userId == topicInfo.jssfrzh) || userType == "助理" || userType == "课程负责人")&&i==1){
                result.push(
                    <li key={i}
                        className={this.state.index == i ? 'selected index' + i : 'index' + i}
                        data-key={i}>
                        {
                            item[i].url
                            &&
                            <a title={item[i].value}
                                href={item[i].url}
                                target="_blank"
                                onClick={this._onClick(i, item[i])}
                            >{item[i].value}</a>
                            ||
                            <a title={item[i].value}
                                onClick={this._onClick(i, item[i])}
                            >{item[i].value}</a>
                        }
                    </li>
                );
            }
			
		}
		return result;
    }
    
	render() {
		return (
			<ul id={this.props.id} className={"BluMUI_List " + this.props.extClass}>
				{this._createLi()}
			</ul>
		)
	}
}

class BluMUI_ReplyItem extends React.Component {
    constructor(props){
        super(props);
        let { htid } = this.props.topicInfo;
        let page = 1;
        let count = 5; // 默认五个回复数
        let fjd = this.props.replyInfo.hfid;
        this.state = {
            replyInfo:this.props.replyInfo,
            // secondReplyMsg:{total:0,totalPages:0,hfList:[]},
            hfList:[],
            total:0,
            showSecondReplyList:true,
            showReplyBox:false,
            page: 1, // 第几页回复
            count: 5, // 默认展示10条回复
            sendReplyInfo: {
                "zhzhf": 1,
                "fjd": this.props.replyInfo.hfid,
                "htid":this.props.topicInfo.htid,
                "hfnr":"",
                "hfdxxm":""
            }  //发送回复的信息
        }
    }

    componentDidMount(){
        let htid = this.props.topicInfo.htid;
        let fjd = this.props.replyInfo.hfid;
        let page = 1;
        let count = 5;
        this.props.getDetailReplyListFun({ htid,fjd, page, count }).then(result => {
            this.setState({
                // secondReplyMsg:result,
                total:result.total,
                hfList:result.hfList,
                page:page
            });
        })
    }
    
    //发送回复 
    _sendReply = (data) => {
        let { htid, hfnr, hfdxsfrzh, zhzhf, fjd,hfdxxm } = data;
        let {replyInfo,page,hfList,count} = this.state;
        let str = `回复 ${hfdxxm}: `;
        if(hfnr.includes(str)){
            let strLen = str.length;
            hfnr = hfnr.substr(strLen);
        }
        
        if(hfnr==''){
            Alert.open({
              alertTip: "请输入回复内容！",
              closeAlert: function () {}
            });
        }else{
            this.props.publishReplyFun({ htid, hfnr, hfdxsfrzh, zhzhf, fjd }).then(result => {
                if (result) {
                    Alert.open({
                      alertTip: "成功发送回复！",
                      closeAlert: function () {}
                    });
                    this.setState({
                        sendReplyInfo: {
                            "zhzhf": 1,
                            "fjd": this.props.replyInfo.hfid,
                            "htid":this.props.topicInfo.htid,
                            "hfnr":"",
                            "hfdxxm":"",
                            "hfdxsfrzh":this.props.replyInfo.zzsfrzh
                        }  //发送回复的信息
                    })
                    document.getElementById(`reply_${replyInfo.hfid}`).value = "";
                    this._searchReply(this.state.page);
                }
            }).catch(e => {
                if (e === 101) {
                    window.location.href = 'error1.html'
                } else if (e === 102) {
                    window.location.href = 'error2.html'
                }
            })
        }
        
    }
     
    //搜索回复
    _searchReply = ( page = 1) => {
        let { htid } = this.props.topicInfo;
        let count = 5; // 默认五个回复数
        let fjd = this.props.replyInfo.hfid;
        this.props.getDetailReplyListFun({ htid,fjd, page, count }).then(result => {
            let hfList = this.state.hfList;
            let newHfList = result.hfList;
        
            for(var i = 0;i<newHfList.length;i++){
                if (!hfList.find(item=>item.hfid == newHfList[i].hfid)) {
                    hfList.push(newHfList[i]);
                }
            }
        
            this.setState({
                hfList:hfList,
                total:result.total,
                page:page
            });
        })
    }

    _showReportBox({ htInfo, hfInfo } = {}) {
        this.props.creatReportBox({htInfo,hfInfo});
    }

    render(){
        let {replyInfo,topicInfo,topHfid,qx,userType,userId,zhfSelect} = this.props;
        let {page,count,showReplyBox,showSecondReplyList,total,hfList} = this.state;
        
        
        return(
            <div className="hf_item" id={topHfid == replyInfo.hfid?'topHfid':''}>
				<div className="left">
                    {replyInfo.zzsf == 2 && <img src="../../imgs/public/head_stu.png" alt="学生默认头像" title="学生默认头像"/>}
                    {replyInfo.zzsf == 1 && <img src="../../imgs/public/head_tea.png" alt="教师默认头像" title="教师默认头像"/>}
                    
					<div>
                        <span>{replyInfo.zzxm}</span>
                        {replyInfo.zzsfrzh == topicInfo.zzsfrzh ? <span className="tip">题主</span>:null}
                        {replyInfo.zzsf ==1 && <span className="tip">教师</span>}
                    </div>
				</div>
				<div className="right">
					<div className="hf_main clearfix">
						<div className="hf_content" dangerouslySetInnerHTML={{ __html: replyInfo.hfnr }}>
						</div>
						<div className="hf_operate">
                            
							<span className="time">
                                {moment(parseInt(replyInfo.hfsj)).format('YYYY-MM-DD HH:mm:ss')}
							</span>
                            
                            <span>
                                {(userType == "管理员" || userType == "督导" || userType == "课程负责人" || userType == "助理" || userId == topicInfo.zzsfrzh || userId == replyInfo.zzsfrzh || userId == topicInfo.jssfrzh) ? <a className='color hidden' href="javascript:void(0);" onClick={() => { this.props.replyOperate(replyInfo.hfid, "删除主回复", replyInfo.htid) }}>删除</a> : null}
                            </span>          
						</div>
					</div>
                    

				</div>
            </div>
        )
    }

    
}

class BluMUI_TopicReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            jblx: '',
            jbly: '',
            xlxjj:''
        }
    }

    _changeState = (name, event) => {
        console.log('event', event, 'value', event.target.value, 'checked', event.target.checked);
        this.setState({
            [name]: event.target.value
        });
    };

    _commitReport = () => {
        let { htid } = this.props.htInfo;
        let  hfid  = this.props.hfInfo ? this.props.hfInfo.hfid : -1;
        let { jblx, jbly } = this.state;
        if(jblx==""){
            Alert.open({
              alertTip: "请选择举报类型！",
              closeAlert: function () {}
            });
        }else{
            this.props.commitReportFun({ htid, hfid, jblx, jbly }).then(result => {
                Alert.open({
                  alertTip: "提交举报成功！",
                  closeAlert: this._closeReport
                });
            }).catch(e => {
                if (e === 101) {
                    window.location.href = 'error1.html';
                } else {
                    window.location.href = 'error2.html';
                }
            });
        }
        
    }

    _closeReport = ()=>{
        this.setState({
            jblx: '',
            jbly: '',
            xlxjj:''
        });
        document.getElementById("report_text").value="";
        document.getElementById("reportBox").style.display = "none";
    }

    render() {
        let { jblx,xlxjj } = this.state;
        let { htInfo, hfInfo,reportTypeList } = this.props;
        return (
            <div id="topic_report">
                <div className="report_title">
                    <div>填写举报信息</div>
                </div>
                <div className='report_msg'>
                    <div className='msg_desc'>
                        <div className='desc_type'>
                            <span>*</span>
                            请选择投诉的类型：
						</div>
                        <div className="desc_choose">
                        {
                            reportTypeList.map((item,index)=>{
                                return(
                                    <span key={index}><input id={`checkbox_${item.id}`} type="checkbox" value={item.xlxnr} checked={jblx === item.xlxnr} onChange={event => { this._changeState("jblx", event);this.setState({'xlxjj':item.xlxjj}) }} /><label htmlFor={`checkbox_${item.id}`}></label>{item.xlxnr}</span>
                                )
                            })
                         }
                        </div>
                        <p>{xlxjj}</p>
                        <div className='report_reason'>
                            <div>请填写举报理由：</div>
                            <textarea id="report_text" cols="30" rows="10" placeholder='描述理由请不要超过100字' maxLength='100' onInput={event => { this._changeState("jbly", event) }}></textarea>
                        </div>

                        
                    </div>
                    
                </div>
                <div className="report_title">
                    <div>所举报的内容</div>
                </div>
                <div className='report_msg'>
                    <div className='msg_desc'>
                    {hfInfo ?
                            <div className='report_confirm'>
                                <div>{hfInfo.zzxm}</div>
                                <div dangerouslySetInnerHTML={{ __html: hfInfo.hfnr }}></div>
                                <div>{moment(parseInt(hfInfo.hfsj)).format('YYYY-MM-DD HH:mm:ss')}</div>
                            </div> :
                            <div className='report_confirm'>
                                <div>{htInfo.zzxm}</div>
                                <div>{htInfo.htbt}</div>
                                <div>{moment(parseInt(htInfo.fbsj)).format('YYYY-MM-DD HH:mm:ss')}</div>
                            </div>
                        }
                    </div>
                    <div className='report_submit'>
                        <button onClick={this._commitReport}>提交</button>
                        <button className='close' onClick={this._closeReport}>关闭</button>
                    </div>
                </div>
            </div>
        )
    }
}

class Popup extends React.Component {
    constructor(props) {
      super(props);
    }
  
    render() {
      const {type}=this.props;
      const MAP={
        "deleteTopic": "删除作业",
        "deleteReply":"删除",
        "deleteFile" :"删除附件"
      };
  
      switch(type) {
        case 'deleteTopic':
        case 'deleteReply':
        case 'deleteFile':
          return(
            <div id="popbody" ref='pb'>
              <div id="msg">
                <p>{`确定要${MAP[type]}?`}</p>
              </div>
              {/* <div className="warning">将会删除该专家分组批次下所有分组项及专家的分组，请谨慎操作。</div> */}
              <div id="popup_option">
                <button id="popup_OK" ref={btn=>this.OK=btn}>确定</button>
                <button id="popup_back" ref={btn=>this.back=btn}>取消</button>
              </div>
            </div>
          );
          break;
        
        case 'show':
          return(
            <div id="popbody" ref="pb">
              {/* <div id="zjs">{id.map((zj,index)=><span key={index} className="zj">{zj}</span>)}</div> */}
              <div id="popup_back"><button ref={btn=>this.back=btn}>关闭</button></div>
            </div>
          );
          break;
        default: 
          return(<div></div>);
          break;
      }
    }
  
    componentDidMount() {
  
      let {type,data1} = this.props;
  
      if(this.refs.pb) this.refs.pb.onclick=e=>e.stopPropagation();
  
  
      // back button click to cancel
      this.back&&(this.back.onclick=cancel_popup);
      // OK button option
      this.OK&&(this.OK.onclick=()=>{
          switch(type){
              case 'deleteTopic':
                  this.props.callback(data1).then(result => {
                      if (result) {
                          Alert.open({
                            alertTip: "成功删除作业！",
                            closeAlert: function () {
                                window.location.href="about:blank";
                                window.close();
                            }
                          });
                      }
                  }).then(() => {
                      cancel_popup();
                      this.props.searchCallback(this.props.data2);
                  }).catch(e => {
                      if (e === 101) {
                          window.location.href = 'error1.html'
                      } else if (e === 102) {
                          window.location.href = 'error2.html'
                      }
                  });
                  break;
              case 'deleteReply':
                  this.props.callback(data1).then(result => {
                      if (result) {
                          Alert.open({
                        alertTip: "成功删除！",
                        closeAlert: function () {}
                      });
                      }
                  }).then(() => {
                      cancel_popup();
                      this.props.searchCallback(this.props.data2);
                  }).catch(e => {
                      if (e === 101) {
                          window.location.href = 'error1.html'
                      } else if (e === 102) {
                          window.location.href = 'error2.html'
                      }
                  })
                  break;
              case 'deleteFile':
                    this.props.callback(data1).then(result => {
                        if (result) {
                            Alert.open({
                          alertTip: "成功删除附件！",
                          closeAlert: function () {}
                        });
                        }
                    }).then(() => {
                        cancel_popup();
                    }).catch(e => {
                        if (e === 101) {
                            window.location.href = 'error1.html'
                        } else if (e === 102) {
                            window.location.href = 'error2.html'
                        }
                    })
                    break;
              default:break;
          }
          
       
      });
    }
  }
  
  function Creat_popup({type,callback,data1,searchCallback,data2}) {
    const popup=document.getElementById('popup');
    const popup_datas={
      type,
      callback,
      data1,
      searchCallback,
      data2
    };
    ReactDOM.render(
      <Popup {...popup_datas}/>,
      document.getElementById('popup')
    );
    // click to close popup
    popup.style.display="block";
    popup.onclick=cancel_popup;
  }
  
  function cancel_popup() {
    let popup=document.getElementById('popup');
    popup.style.display="none";
    ReactDOM.unmountComponentAtNode(popup);
  }

var BluMUI_M = {
    TopicDis: BluMUI_TopicDis,
    TopicReport: BluMUI_TopicReport
};

var BluMUI = {
    result: {},
    create: function (data, type, elem, callback) {
        var props = data,
            Blu = BluMUI_M[type];
        this.result[props.id] = ReactDOM.render(
            <Blu {...props} />,
            elem
        );
        if (callback)
            callback();
    }
};
export default BluMUI;
