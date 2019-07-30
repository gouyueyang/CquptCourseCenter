import React from 'react';
import ReactDOM from 'react-dom';
// import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Fanye from '../turnPage';
import moment from 'moment';
import Alert from "../../util/alert.js";

class BluMUI_TopicDis extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isBanReply:this.props.topicInfo.sfyxhf,
            fhid:this.props.hfid,
            hfMsg:this.props.hfMsg,
            secondReplyMsgs:this.props.secondReplyMsgs,
            banReplys: {},//标记禁止回复的话题
            page: 1, // 第几页回复
            count: 5, // 默认展示10条回复
            allReplyConfig: {}, // 所有子回复列表的配置选项
            allReplyList: {}, // 所有的子回复列表
            sendReplyInfo: {
                "htid":this.props.topicInfo.htid,
                "hfdxsfrzh":this.props.topicInfo.zzsfrzh,
                "zhzhf": 1,
                "fjd": -1,
                "hfnr":""
            }  //发送回复的信息
        }
    }

    
    

    render() {
        let {hfid,page, count} = this.state;

        let { kcbh,topicInfo,userId,qx,userType } = this.props;
        let { total, totalPages, hfList } = this.state.hfMsg; // 话题总的数量，总页数， 话题列表
        let options = { pages: totalPages, page, rows: total };
        let {hfnr} = this.state.sendReplyInfo;
        
        return (
            <div id="topicDis">
				<div id="topicInfo">
					<h2 id="topic_htbt">{topicInfo.htbt}</h2>
					<div id="topic_Info">
						<div className="left">
							<span>{topicInfo.zzxm}</span>
						</div>
						<div className="right">
							<div className="topic_htnr" dangerouslySetInnerHTML={{ __html: topicInfo.htnr }}>
							</div>
							<div className="topic_bottom clearfix">
								<div className="bottom_authCon">
									<span>{moment(parseInt(topicInfo.fbsj)).format('YYYY-MM-DD hh:mm:ss')}</span>
								</div>
								<div className="bottom_inform">
                                    {userType != '游客' && (userId != topicInfo.jssfrzh ? <a href="javascript:void(0);" onClick={() => { this._showReportBox({ htInfo: topicInfo }) }}>举报</a> : '')}
                                    {qx.openTopic && topicInfo.dqzt ==1 && (userType == "管理员" || userType == "课程负责人" || userType == "督导" || userId == topicInfo.jssfrzh) ?
                                        (topicInfo.dqzt == 1 && <a href="javascript:void(0);" onClick={this._topicOperate.bind(this, { htid: topicInfo.htid, cz: '公开' })}>公开话题</a>):null}
                                    {qx.openTopic && topicInfo.dqzt ==2 && (userType == "管理员" || userType == "课程负责人" || userType == "督导" || userId == topicInfo.jssfrzh) ?
                                        (topicInfo.dqzt == 2 && <a href="javascript:void(0);" onClick={this._topicOperate.bind(this, { htid: topicInfo.htid, cz: '设置班内可见' })}>取消公开</a>):null}
                                    {qx.setBanReply && (userType == "管理员" || userType == "课程负责人" || userType == "督导" || userId == topicInfo.zzsfrzh || userId == topicInfo.jssfrzh) ? (topicInfo.sfyxhf ? <a href="javascript:void(0);" onClick={this._topicOperate.bind(this, { htid: topicInfo.htid, cz: '禁止回复' })}>禁止回复</a> : <a href="javascript:void(0);" onClick={this._topicOperate.bind(this, { htid: topicInfo.htid, cz: '解除禁止回复' })}>解除禁止回复</a>) : null}
                                    {(qx.deleteTopic && (userType == "管理员" || userType == "课程负责人" || userType == "督导" || userId == topicInfo.zzsfrzh || userId == topicInfo.jssfrzh)) ? <a href="javascript:void(0);" onClick={() => { this._topicOperate({ htid: topicInfo.htid, cz: '删除' }) }}>删除</a> : ''}
                                    {qx.addReply && (topicInfo.sfyxhf ? <a href="javascript:void(0);" onClick={() => { this.setState({ sendReplyInfo: { ...this.state.sendReplyInfo, "hfdxsfrzh": topicInfo.zzsfrzh,"zhzhf": 1, "fjd": -1 } }); }}>回复</a> : null)}
								</div>
							</div>
						</div>

					</div>
					<div id="hf_list">
                        {
                            hfList.map((item,index)=>{
                                return(
                                    <BluMUI_ReplyItem key={item.hfid} topicInfo={topicInfo} replyInfo={item} qx={qx} userType={userType} getDetailReplyListFun={this.props.getDetailReplyListFun}
                                        creatReportBox={this.props.creatReportBox} replyOperate={this._replyOperate} publishReplyFun={this.props.publishReplyFun}
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
					<div id="sendMsg">
						<h4>发表回复</h4>
						<textarea name="content" id="editor">
						</textarea>
						<div className="msg_bottom">
							<button onClick={this._sendReply}>发   表</button>
						</div>
					</div>
				</div>
			</div>
        )
    }
    
    componentDidMount() {
        ClassicEditor
            .create(document.querySelector('#editor'))
            .then(newEditor => {
                this.editor = newEditor;
            })
            .catch(err => {
                console.error(err.stack);
            });
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
    _searchSecondReply = (page =1,fjd) =>{
        let { htid } = this.props.topicInfo;
        let count = 10; // 默认10个回复数
        this.props.getDetailReplyListFun({ htid,fjd, page, count }).then(result => {
            let res = "ksdjf";
            return res;
            
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
        let hfnr = this.editor.getData();
        let {page} = this.state;
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
    
                    this.editor.setData("");
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
        switch (cz) {
            case "删除":
                console.log("删除话题", htid, cz);
                this.props.topicOperateFun({ htid, cz }).then(result => {
                    if (result) {
                        Alert.open({
                          alertTip: "成功删除话题！",
                          closeAlert: function () {}
                        });
                    }
                }).catch(e => {
                    if (e === 101) {
                        window.location.href = 'error1.html'
                    } else if (e === 102) {
                        window.location.href = 'error2.html'
                    }
                });
                break;
            case "禁止回复":
                console.log("禁止回复", htid, cz);
                this.props.topicOperateFun({ htid, cz }).then(result => {
                    if (result) {
                        Alert.open({
                          alertTip: "成功设置话题禁止回复！",
                          closeAlert: function () {}
                        });
                        let htList = this.state.topicMsg.htList;
                        htList.find(obj => obj.htid == htid)['sfyxhf'] = 0;
                       
                        {/* this.setState({
                            topicMsg:{...this.state.topicMsg,[htList]:htList}
                        },conosle.log(this.state)) */}
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
                        let htList = this.state.topicMsg.htList;
                        htList.find(obj => obj.htid == htid)['sfyxhf'] = 1;
                        
                        {/* this.setState({
                            topicMsg:{...this.state.topicMsg,[htList]:htList}
                        },conosle.log(this.state)) */}
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
                          alertTip: "成功公开话题！",
                          closeAlert: function () {}
                        });
                        {/* this.setState({
                            topicMsg:{...this.state.topicMsg,[htList]:htList}
                        },conosle.log(this.state)) */}
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
                          alertTip: "成功设置该话题班内可见！",
                          closeAlert: function () {}
                        });
                        {/* this.setState({
                            topicMsg:{...this.state.topicMsg,[htList]:htList}
                        },conosle.log(this.state)) */}
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
    _replyOperate = (hfid, cz, htid) => {
        let {page} = this.state;
        switch (cz) {
            case "删除":
                console.log("删除回复:" + hfid);
                this.props.replyOperateFun({ hfid, cz }).then(result => {
                    if (result) {
                        Alert.open({
                      alertTip: "成功删除回复！",
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

class BluMUI_ReplyItem extends React.Component {
    constructor(props){
        super(props);
        let { htid } = this.props.topicInfo;
        let page = 1;
        let count = 5; // 默认五个回复数
        let fjd = this.props.replyInfo.hfid;
        this.state = {
            replyInfo:this.props.replyInfo,
            secondReplyMsg:{total:0,totalPages:0,hfList:[]},
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
                secondReplyMsg:result,
                page:page
            });
        })
    }
    
    //发送回复 
    _sendReply = (data) => {
        let { htid, hfnr, hfdxsfrzh, zhzhf, fjd,hfdxxm } = data;
        let {replyInfo,page} = this.state;
        console.log(hfnr);
        let str = `回复 ${hfdxxm}: `;
        if(hfnr.includes(str)){
            let strLen = str.length;
            hfnr = hfnr.substr(strLen);
        }
        
        console.log(hfnr);
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
                    
                    document.getElementById(`reply_${replyInfo.hfid}`).value = "";
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
     
    //搜索回复
    _searchReply = ( page = 1) => {
        let { htid } = this.props.topicInfo;
        let count = 5; // 默认五个回复数
        let fjd = this.props.replyInfo.hfid;
        this.props.getDetailReplyListFun({ htid,fjd, page, count }).then(result => {
            this.setState({
                secondReplyMsg:result,
                page:page
            });
        })
    }

    _showReportBox({ htInfo, hfInfo } = {}) {
        this.props.creatReportBox({htInfo,hfInfo});
    }

    render(){
        let {replyInfo,topicInfo,qx,userType,userId} = this.props;
        let {page,count,secondReplyMsg,showReplyBox,showSecondReplyList} = this.state;
        let { total, totalPages, hfList} = secondReplyMsg;
        let options = { pages: totalPages, page, rows: total };
        return(
            <div className="hf_item">
				<div className="left">
					<span>{replyInfo.zzxm}</span>
				</div>
				<div className="right">
					<div className="hf_main clearfix">
						<div className="hf_content" dangerouslySetInnerHTML={{ __html: replyInfo.hfnr }}>
						</div>
						<div className="hf_operate">
                            <span>
                                {qx.addReply && <a className='color' href="javascript:void(0);" onClick={() => { this.setState({ showReplyBox:true,sendReplyInfo: { ...this.state.sendReplyInfo, "hfdxsfrzh": replyInfo.zzsfrzh, "zhzhf": 2, "fjd": replyInfo.hfid ,"hfdxxm":replyInfo.zzxm} }) }}>回复</a>}
                            </span>
							<span>
                                {moment(parseInt(replyInfo.hfsj)).format('YYYY-MM-DD hh:mm:ss')}
							</span>
                            <span>
                                {qx.addReport && (userId != topicInfo.jssfrzh ? <a className='color' href="javascript:void(0);" onClick={() => { this._showReportBox({ htInfo: topicInfo, hfInfo: replyInfo }) }}>举报</a> : null)}
                            </span>
							<span>
                                {(userType == "管理员" || userType == "督导" || userType == "课程负责人") || (userId == topicInfo.zzsfrzh || userId == replyInfo.zzsfrzh || userId == topicInfo.jssfrzh) ? <a className='color' href="javascript:void(0);" onClick={() => { this.props.replyOperate(replyInfo.hfid, "删除", replyInfo.htid) }}>删除</a> : null}
                            </span>
                                         
						</div>
					</div>
                    {
                        showSecondReplyList && hfList.length>=0 &&
                        <div className="second_hf_list_wrap">
                            <div className="second_hf_list">
                            {
                                hfList != [] &&
                                hfList.map((item,index)=>{
                                    return(
                                        <div className="info_one clearfix" key={item.hfid}>
						                	<div className="one_msg">
                                                <span>{item.hfzzxm}</span>
                                                <span> 回复 </span>
                                                <span>{item.hfdxxm} : </span>
                                                <span>{item.hfnr}</span>
						                	</div>
						                	<div className="one_func">
                                                {qx.addReport &&  <a className='color' href="javascript:void(0);" onClick={() => { this._showReportBox({ htInfo: topicInfo, hfInfo: item }) }}>举报</a>}
                                                {(userType == "管理员" || userType == "督导" || userType == "课程负责人") || (userId == topicInfo.zzsfrzh || userId == item.zzsfrzh || userId == item.jssfrzh) ? <a className='color' href="javascript:void(0);" onClick={() => { this.props.replyOperate(item.hfid, "删除", topicInfo.htid) }}>删除</a> : null}             
						                	    <a href="javascript:void(0);">{moment(parseInt(item.hfsj)).format('YYYY-MM-DD hh:mm:ss')}</a>
						                		{qx.addReply && <a className='color' href="javascript:void(0);" 
                                                onClick={() => {
                                                    this.setState({ showReplyBox:true,sendReplyInfo: { ...this.state.sendReplyInfo, "hfdxsfrzh": item.zzsfrzh, "zhzhf": 2, "fjd": replyInfo.hfid ,"hfdxxm":item.zzxm} });
                                                    document.getElementById(`reply_${replyInfo.hfid}`).value = `回复 ${item.zzxm}: `;  
                                                }}>回复</a>}
						                	</div>
						                </div>
                                    )
                                })
                            }
						    {
                                hfList.total >1 &&
                                <Fanye This={this} options={options}
                                callback={this._searchReply.bind(this)} />
                            }
                            {
                                qx.addReply &&
                                (topicInfo.sfyxhf ?
                                    <div className={showReplyBox?"info_commit show":"info_commit"}>
                                        <textarea rows="2" id={`reply_${replyInfo.hfid}`} placeholder='请输入回复内容' autoFocus onInput={(e) => { this.setState({ sendReplyInfo: { ...this.state.sendReplyInfo, "hfnr": e.target.value } }) }}></textarea>
                                        <div><button onClick={() => { this._sendReply(this.state.sendReplyInfo) }}>发表</button></div>
                        
                                    </div> : null)
                            }
                            </div>
                            
                     
					    </div>
                    }

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
        }else if(jbly == ""){
            Alert.open({
              alertTip: "请选择举报理由！",
              closeAlert: function () {}
            });
        }else{
            this.props.commitReportFun({ htid, hfid, jblx, jbly }).then(result => {
                Alert.open({
                  alertTip: "提交举报成功！",
                  closeAlert: function () {}
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
                            <textarea cols="30" rows="10" placeholder='描述理由请不要超过100字' maxLength='100' onInput={event => { this._changeState("jbly", event) }}></textarea>
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
                                <div>{hfInfo.hfnr}</div>
                                <div>{moment(parseInt(hfInfo.hfsj)).format('YYYY-MM-DD hh:mm:ss')}</div>
                            </div> :
                            <div className='report_confirm'>
                                <div>{htInfo.zzxm}</div>
                                <div>{htInfo.htbt}</div>
                                <div>{moment(parseInt(htInfo.fbsj)).format('YYYY-MM-DD hh:mm:ss')}</div>
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
