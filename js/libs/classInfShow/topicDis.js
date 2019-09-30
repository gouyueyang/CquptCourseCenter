import React from 'react';
import ReactDOM from 'react-dom';
// import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Fanye from '../turnPage';
import moment from 'moment';
import Alert from "../../util/alert.js";


class Search extends React.Component {
    render() {
        const { sstype, changeContent, changeType, search } = this.props;
        return (
            <div className="content_search">
                <select value={sstype} onChange={changeType}>
                    <option value='htmc'>话题名称</option>
                    <option value='zzxm'>作者名称</option>
                </select>
                <div className="search">
                    <input type="text" onChange={changeContent} />
                    <span onClick={search}>搜索</span>
                </div>
            </div>
        )
    }
}

class SendTopic extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            htbt: '', // 话题标题
            sfyxhf: true, //  是否允许回复
            dqzt: 1, // 当前状态，（老师发表话题时，可勾选是否公开，1：默认班内开放；2：公开）
            checkBan: this.props.userBan? {[this.props.userBan]:true} : {}
        };
    }

    render() {
        const { sfyxhf,dqzt } = this.state;
        let { banList, userType } = this.props;
        return (
            <div id="sendMsg">
                <h3>发起新话题</h3>
                <input type="text" id="htmc" placeholder='请输入话题名称（50字内）' maxLength="50" onChange={event => this._changeState('htbt', event)} className='topicName' />
                <textarea name="content" id='editor' maxLength="10" placeholder="请输入话题内容（不超过1万字）">
                </textarea>
                {
                    (userType == "任课教师" || userType =="课程负责人" || userType == "督导" || userType == "管理员") &&
                        <div>
                            <div>
                                <span><span className="mustWrite">*</span>您要发布到哪些班集？请勾选：</span>
                            </div>
                            <div>
                            {
                                banList.map((item, index) => {
                                    {/* if(item.SFJZTL==0){ */}
                                        return (
                                            <div key={item.JXB} className="public_classItem">
                                                <input type="checkbox" id={`checkbox_${item.JXB}`}
                                                    checked={this.state.checkBan[item.JXB] ? this.state.checkBan[item.JXB] : false}
                                                    onChange={event => this._toggleBan(item.JXB)} />
                                                    <label htmlFor={`checkbox_${item.JXB}`}></label>
                                                    <span>{item.JXB}班</span>
                                            </div>
                                        )
                                    {/* }else if(item.SFJZTL==1){
                                        return (
                                            <div key={item.JXB} className="public_classItem">
                                                <input type="checkbox" id={`checkbox_${item.JXB}`}
                                                    checked={false}
                                                    onChange={()=>{return false;}} />
                                                    <span style={{color:'#ccc'}} title="请先解除该班级禁止发表话题状态！">{item.JXB}班</span>
                                            </div>
                                        )
                                    } */}
                                    
                                })
                            }
                            </div>
                            
                        </div>
                }
                {
                    userType == '学生' &&
                    <div>
                        <div>
                            <span><span className="mustWrite">*</span>您要发布到哪些班集？请勾选：</span>
                        </div>
                        <div>
                            <div className="public_classItem">
                                <input type="checkbox" id={`checkbox_${this.props.userBan}`}
                                    checked={this.state.checkBan[this.props.userBan] ? this.state.checkBan[this.props.userBan] : false}
                                    onChange={()=>{return false;}} />
                                    <label htmlFor={`checkbox_${this.props.userBan}`}></label>
                                    <span>{this.props.userBan}班</span>
                            </div>
                        </div>
                        
                    </div>
                        
                }

                <div className='msg_bottom'>
                    <button onClick={this._sendMsg}>发   表</button>
                    {
                        (userType == "任课教师" || userType == "管理员" || userType == "督导" || userType == "课程负责人") &&
                        <div className="otherSet">
                            <input type = "checkbox" id="checkbox_gk" checked={dqzt!=1} onChange={event => this._changeDqzt(event)}></input>
                            <label htmlFor="checkbox_gk"></label>
                            <span>公开(默认状态为班内可见)</span>
                        </div>
                    }
                    <div className="otherSet">
                        <input type="checkbox"
                            id="checkbox_sfyxhf"
                            checked={!sfyxhf}
                            onChange={event => this._changeState('sfyxhf', event)} />
                        <label htmlFor="checkbox_sfyxhf"></label>
                        <span>禁止回复(本班级任课教师可取消此状态)</span>
                    </div>
                    
                    
                </div>
            </div>
        )
    }
    componentDidMount() {
        ClassicEditor
            .create(document.querySelector('#editor'),{
                language : 'zh-cn',
                toolbar: ['heading', '|', 'bold', 'italic','|',  'link', 'bulletedList', 'numberedList', 'blockQuote','|', 'Undo','Redo'],
                // toolbar: ['heading', '|', 'bold', 'italic','TextColor','BGColor','Styles','Format','Font','FontSize','Subscript','Superscript','|',  'link', 'bulletedList', 'numberedList', 'blockQuote','Table','HorizontalRule','Smiley','SpecialChar','PageBreak','|', 'Undo','Redo'],
                maxlength:10
            })
            .then(newEditor => {
                this.editor = newEditor;
                let maxlength = 100;
                newEditor.on('key',function(event){
                    console.log(event.target.value);
                    var oldhtml = this.editor.document.getBody().getHtml();
                    var description = oldhtml.replace(/<.*?>/ig,"");
                    var etop = $("#cke_1_top");
                    var _slen = maxlength-description.length;
                    var canwrite = $("<label id='canwrite'>还可以输入200字</label>");
                    if(etop.find("#canwrite").length<1){
                        canwrite.css({border:'1px #f1f1f1 solid','line-height':'28px',color:'#999'});
                        etop.prepend(canwrite);
                    }
                    var _label = etop.find("#canwrite");
                    if(description.length>maxlength){
                        //alert("最多可以输入"+maxlength+"个文字，您已达到最大字数限制");
                        this.editor.setData(oldhtml);
                        _label.html("还可以输入0字");
                    }else{
                        _label.html("还可以输入"+_slen+"字");
                    }
                });
            })
            .catch(err => {
                console.error(err.stack);
            });
    }
    _changeState = (name, event) => {
        let val = event.target.type === 'checkbox' ? !event.target.checked : event.target.value;
        this.setState({ [name]: val });
    };
    _changeDqzt = (event)=>{
        let val = event.target.checked ? 2 :1;
        this.setState({dqzt:val});
    }
    
    _sendMsg = () => {
        const { htbt, sfyxhf, dqzt, checkBan } = this.state;
        const htnr = this.editor.getData();
        if(htnr.length>10000){
            Alert.open({
                alertTip: "话题内容不得超过1万字！",
                closeAlert: function () {}
              });
            this.editor.setData(htnr.substr(0,9999));
            }else{
                this.props.sendTopic({ htbt, sfyxhf, htnr, dqzt, checkBan });
            }
        
        // this.setState({
        //     htbt: document.querySelector('#htmc').value, // 话题标题
        //     sfyxhf: true, //  是否允许回复
        //     dqzt: 1, // 当前状态，（老师发表话题时，可勾选是否公开，1：默认班内开放；2：公开）
        //     checkBan: this.props.userBan? {[this.props.userBan]:true} : {}
        // });
        // this.editor.setData("");
    };
    _toggleBan = (jxbh) => {
        let status = !this.state.checkBan[jxbh];
        this.setState({
            checkBan: { ...this.state.checkBan, [jxbh]: status }
        })
    };
}
class BluMUI_TopicDis extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            teacherSelected: this.props.teacherSelected, // 选择的老师
            banSelected: this.props.banSelected, // 选择的班级
            allJxbList: this.props.classList.allJxbList, // 教学班编号数组
            teaJxbList:this.props.classList.allJxbList,//教师账号对应的教学班（为了更新发表话题选择班级而设置）
            topicMsg: this.props.topicList, // topic的数据，不只是数组
            isBanPublishTopic: this.props.topicList.isBanPublishTopic || false,//是否禁止发表话题
            expendReplys: {}, // ;标记展开的话题回复
            banReplys: {},//标记禁止回复的话题
            pxtype: 'sjjx', // 选择排序
            sstype: 'htmc', // 搜索方式
            sstj: '', // 搜索条件
            page: 1, // 第几页话题
            count: 5, // 默认申请5个话题
            allReplyConfig: {}, // 所有回复列表的配置选项
            allReplyList: {}, // 所有的回复列表
            htSelected:-1,//回复框标志符，确保页面只存在一个回复框
            htSelectedZzsfrzh:'',//话题
            sendReplyInfo: {
                "zhzhf": 1,
                "fjd": -1,
                "hfnr":""
            }  //发送回复的信息
        }
    }
    

    render() {
        let { teacherSelected, banSelected, allJxbList,teaJxbList, expendReplys, pxtype, sstype, page, allReplyList, allReplyConfig, isBanPublishTopic,htSelected } = this.state;


        let { jsList,wkkJsList } = this.props.teacherList;
        let { userType,userBan,qx,userId } = this.props;
        let { total, totalPages, htList } = this.state.topicMsg; // 话题总的数量，总页数， 话题列表
        let options = { pages: totalPages, page, rows: total };
        let {hfnr} = this.state.sendReplyInfo;
        return (
            <div>
                <div id="topicInfo" className='clearfix'>
                    <div className="info_teachers">
                        <ul>
                            {
                                jsList.map((item, index) => {
                                    return (
                                        <li className={teacherSelected === item.sfrzh ? 'active' : ''}
                                            key={`kc_${item.sfrzh}`}
                                            onClick={() => this._changeTeacher(item.sfrzh,true)}>{item.xm}</li>
                                    )
                                })   
                            }
                        </ul>
                        <ul>
                            {
                                wkkJsList.map((item, index) => {
                                    return (
                                        <li className='wkkJs'
                                            key={`wkc_${item.sfrzh}`}
                                            title="该教师本学期未开课"
                                           >{item.xm}</li>
                                    )
                                })   
                            }
                        </ul>
                    </div>
                    <div className="info_content">
                        <div className="content_ban clearfix">
                            {
                                allJxbList.map((item, index) => {
                                    if (item.SFRZH == this.state.teacherSelected) {
                                        return (
                                            <div className={banSelected === item.JXB ? 'ban_item active' : 'ban_item'}
                                                key={item.JXB}
                                                onClick={() => this._changeBan(item.JXB)}>
                                                {item.JXB}班
										</div>
                                        )
                                    }

                                })
                            }
                        </div>
                        <div className="content_method clearfix">
                            <span>
                                <input id="radio_1" type="radio" value='sjjx' name='pxtype' checked={pxtype === 'sjjx'} onChange={event => this._changeState('pxtype', event)} />
                                <label htmlFor="radio_1"></label>
                                <span>时间降序</span>
							</span>
                            <span>
                                <input id="radio_2" type="radio" value='sjsx' name='pxtype' checked={pxtype === 'sjsx'} onChange={event => this._changeState('pxtype', event)} />
                                <label htmlFor="radio_2"></label>
                                <span>时间升序</span>
							</span>
                            <span>
                                <input id="radio_3" type="radio" value='rmpx' name='pxtype' checked={pxtype === 'rmpx'} onChange={event => this._changeState('pxtype', event)} />
                                <label htmlFor="radio_3"></label>
                                <span>热门排序</span>
							</span>
                            {
                                (userType == "管理员" || userType == "课程负责人" || userType == "督导") || userId == teacherSelected ?
                                <span>
                                <input id="checkbox_banPublicTopic" type="checkbox" checked={isBanPublishTopic ? true : false} onClick={this._stopSendMsg.bind(this)} />
                                <label htmlFor="checkbox_banPublicTopic"></label>
                                禁止发表话题
                                </span>:null
                                
                            }
                            
                            {userType != '游客' && <a className='color' href='../msgCenter/showReply.html' target='_blank'>查看回复</a>}
                            {userType != '游客' && <a className='color' href='../msgCenter/showReport.html' target='_blank'>查看举报</a>}
                            
                            
                            <Search sstype={sstype}
                                changeContent={event => this._changeState('sstj', event)}
                                search={this._searchTopic}
                                changeType={event => this._changeState('sstype', event)} />
                        </div>
                        <div className="content_topic">
                            {
                                htList.map((item, index) => {
                                    return (
                                        <div className="topic_item" key={item.htid}>
                                            <h3><a href={`../msgCenter/showTopic.html?htid=${item.htid}`} target="_blank">{item.htbt}</a></h3>
                                            <div className="htnr_box" dangerouslySetInnerHTML={{ __html: item.htnr }}></div>
                                            <div className="item_bottom clearfix">
                                                <div className="bottom_authCon">
                                                    <span>{item.zzxm}</span>
                                                    <span>{moment(parseInt(item.fbsj)).format('YYYY-MM-DD HH:mm:ss')}</span>
                                                    {/* <span onClick={() => this._topicOperate({ htid: item.id, cz: "点赞" })}>赞({item.dzs})</span> */}
                                                    <span className='color' onClick={() => {this._toggleReply(item.htid);this.setState({ htSelected:item.htid,htSelectedZzsfrzh:item.zzsfrzh,sendReplyInfo: { ...this.state.sendReplyInfo, "hfdxsfrzh": item.zzsfrzh,"hfdxxm":item.zzxm,"zhzhf": 1, "fjd": -1 } }); }}>{expendReplys[item.htid] ? '收起回复' : `回复(${item.hfs})`}</span>
                                                </div>
                                                <div className="bottom_inform">
                                                    
                                                    {userType != '游客' && (userId != item.jssfrzh ? <a className="hidden" href="javascript:void(0);" onClick={() => { this._showReportBox({ htInfo: item }) }}>举报</a> : '')}
                                                    {(qx.deleteTopic && (userType == "管理员" || userType == "课程负责人" || userType == "督导" || userId == item.zzsfrzh || userId == item.jssfrzh)) ? <a className="hidden" href="javascript:void(0);" onClick={() => { this._topicOperate({ htid: item.htid, cz: '删除' }) }}>删除</a> : ''}
                                                    {qx.openTopic && item.dqzt ==1 && (userType == "管理员" || userType == "课程负责人" || userType == "督导" || userId == item.jssfrzh) ?
                                                        (item.dqzt == 1 && <a href="javascript:void(0);" onClick={this._topicOperate.bind(this, { htid: item.htid, cz: '公开' })}>公开话题</a>):null}

                                                    {qx.openTopic && item.dqzt ==2 && (userType == "管理员" || userType == "课程负责人" || userType == "督导" || userId == item.jssfrzh) ?
                                                        (item.dqzt == 2 && <a href="javascript:void(0);" onClick={this._topicOperate.bind(this, { htid: item.htid, cz: '设置班内可见' })}>取消公开</a>):null}
                                                    {qx.setBanReply && (userType == "管理员" || userType == "课程负责人" || userType == "督导" || userId == item.zzsfrzh || userId == item.jssfrzh) ? (item.sfyxhf ? <a href="javascript:void(0);" onClick={this._topicOperate.bind(this, { htid: item.htid, cz: '禁止回复' })}>禁止回复</a> : <a href="javascript:void(0);" onClick={this._topicOperate.bind(this, { htid: item.htid, cz: '解除禁止回复' })}>解除禁止回复</a>) : null}
                                                    
                                                    {qx.addReply && (item.sfyxhf ? <a href="javascript:void(0);" onClick={() => { this.setState({ htSelected:item.htid,htSelectedZzsfrzh:item.zzsfrzh,expendReplys: { ...this.state.expendReplys, [item.htid]: true }, sendReplyInfo: { ...this.state.sendReplyInfo, "hfdxsfrzh": item.zzsfrzh,"hfdxxm":item.zzxm,"zhzhf": 1, "fjd": -1 } }, this._searchReply(item.htid,this.state.allReplyConfig[item.htid].page)); }}>回复</a> : null)}
                                                </div>
                                            </div>
                                            {
                                                expendReplys[item.htid] && allReplyList[item.htid] ?
                                                    <div className="item_info">
                                                        {
                                                            allReplyList[item.htid].hfList.map((repItem, index) => 
                                                            <div className="info_one clearfix" key={index}>
                                                            {
                                                                    repItem.fjd == -1 &&
                                                                    <div className="one_msg">
                                                                        <span>
                                                                            {repItem.zzxm}
                                                                            {repItem.zzsfrzh == item.zzsfrzh ? <span className="tip">题主</span>:null}
                                                                            {repItem.zzsf ==1 && <span className="tip">教师</span>}
                                                                        </span>
                                                                        
                                                                    </div>
                                                                }
                                                                {
                                                                    repItem.fjd != -1 &&
                                                                    <div className="one_msg">
                                                                        <span>
                                                                            {repItem.zzxm}
                                                                            {repItem.zzsfrzh == item.zzsfrzh ? <span className="tip">题主</span>:null}
                                                                            {repItem.zzsf ==1 && <span className="tip">教师</span>}
                                                                        </span>
                                                                        
                                                                    </div>
                                                                }
                                                                {/* <div className="one_msg">
                                                                    <span>
                                                                        {repItem.zzxm}
                                                                        {repItem.zzsfrzh == topicInfo.zzsfrzh ? <span className="tip">题主</span>:null}
                                                                        {repItem.zzsf ==1 && <span className="tip">教师</span>}
                                                                    </span>
						                	                    </div> */}
                                                                <div className="one_func">
                                                            
                                                                    <a href="javascript:void(0);">{moment(parseInt(repItem.hfsj)).format('YYYY-MM-DD HH:mm:ss')}</a>
                                                                    {qx.addReply && <a className='color' href="javascript:void(0);" 
                                                                    onClick={() => { repItem.zzxm ? document.getElementById(`reply_${item.htid}`).value = ` 回复 ${repItem.zzxm}: ` : document.getElementById(`reply_${item.htid}`).value = `回复: `; this.setState({ sendReplyInfo: { ...this.state.sendReplyInfo, "hfdxsfrzh": repItem.zzsfrzh, "hfdxxm":repItem.zzxm,"zhzhf": 2, "fjd": repItem.hfid } }, console.log(this.state)) }}>回复</a>}
                                                                    {(userType == "管理员" || userType == "课程负责人" || userType == "督导"||userId == repItem.zzsfrzh || userId == item.zzsfrzh || userId == item.jssfrzh) ? <a className='color hidden' href="javascript:void(0);" onClick={() => { this._replyOperate(repItem.hfid, "删除", item.htid) }}>删除</a> : null}
                                                                    {qx.addReport && (userId != item.jssfrzh ? <a className='color hidden' href="javascript:void(0);" onClick={() => { this._showReportBox({ htInfo: item, hfInfo: repItem }) }}>举报</a> : null)}
						                	                    </div>
                                                                <div className="one_content clearfix">
                                                                    <span> 回复 </span>
                                                                    <span>{repItem.hfdxxm}{repItem.hfdxsfrzh == topicInfo.zzsfrzh ? <span className="tip">题主</span>:null}{repItem.hfdxsf ==1 && <span className="tip">教师</span>} : </span>
                                                                
                                                                    <div dangerouslySetInnerHTML={{ __html: repItem.hfnr }}></div>
                                                                </div>
                                                            </div> 
                                                              
                                                            )
                                                        }
                                                        {
                                                            
                                                            allReplyList[item.htid].total- allReplyList[item.htid].hfList.length > 0 &&
                                                            <div className="searchMore" onClick={()=>{this._searchReply(item.htid,allReplyConfig[item.htid].page+1)}}>更多{allReplyList[item.htid].total- allReplyList[item.htid].hfList.length}条回复</div>
                                                        }
                                                        
                                                        {
                                                            qx.addReply && htSelected == item.htid &&
                                                            (item.sfyxhf ?
                                                                <div className="info_commit">
                                                                    <textarea rows="2" id={`reply_${item.htid}`} placeholder='请输入回复内容' autoFocus onFocus={() => { this.setState({ sendReplyInfo: { ...this.state.sendReplyInfo, "htid": item.htid } }) }} onInput={(e) => { this.setState({ sendReplyInfo: { ...this.state.sendReplyInfo, "hfnr": e.target.value } }) }}></textarea>
                                                                    <button onClick={() => { this._sendReply(this.state.sendReplyInfo) }}>发表</button>
                                                                </div> : null)
                                                        }
                                                        
                                                        
                                                    </div> : null
                                            }
                                        </div>
                                    )
                                })
                            }
                            
                        </div>
                        {
                            options.pages>1 &&
                            <Fanye This={this} options={options} callback={this._searchTopic} />
                        }
                        {
                            (userType == "管理员" || userType == "督导" || userType == "课程负责人") && <SendTopic ref={(ref)=>this.sendTopic=ref} sendTopic={(data) => this._sendTopic(data)} banList={allJxbList} userType={userType} userBan={userBan}/>
                        }
                        {
                            userType == "任课教师" && userId == teacherSelected && <SendTopic ref={(ref)=>this.sendTopic=ref} sendTopic={(data) => this._sendTopic(data)} banList={teaJxbList} userType={userType} userBan={userBan}/>
                        }
                        {
                            userType == "学生" && userBan == banSelected && (this.state.isBanPublishTopic ? <div><p>本班处于禁止发帖状态</p></div> : <SendTopic ref={(ref)=>this.sendTopic=ref} sendTopic={(data) => this._sendTopic(data)} banList={teaJxbList} userType={userType} userBan={userBan}/>)
                        }
                         
                        
                    </div>
                    
                </div>
                
            </div>
        )
    }
    // 选择老师
    _changeTeacher = (SFRZH,falg) => {
        this.props.getClassListFun(SFRZH).then(data => {
            let { allJxbList } = data;
            this.setState({
                teacherSelected: SFRZH,
                allJxbList,
                banSelected:allJxbList[0].JXB
            },this._searchTopic);
        });
        this.sendTopic.setState({
            htbt: "", // 话题标题
            sfyxhf: true, //  是否允许回复
            dqzt: 1, // 当前状态，（老师发表话题时，可勾选是否公开，1：默认班内开放；2：公开）
            checkBan: this.sendTopic.props.userBan? {[this.sendTopic.props.userBan]:true} : {}
        });
        document.querySelector('#htmc').value = '';
        this.sendTopic.editor.setData("");
    };
    // 选择班级
    _changeBan = (JXB) => {
        this.setState({
            banSelected: JXB,
            expendReplys: {},
            allReplyConfig: {},
            allReplyList: {}
        }, this._searchTopic);
        
    };
    //搜索回复
    _searchReply = (htid, page = 1) => {
        let { htList } = this.state.topicMsg;
        let count = 5; // 默认五个回复数
      
        this.props.getReplyListFun({ htid, page, count }).then(retReplyList => {
            for(let i in htList){
                if(htList[i].htid == htid){
                    htList[i].hfs = retReplyList.total;
                    break;
                }
            };
            if(this.state.allReplyList[htid]){
                let hfList = this.state.allReplyList[htid].hfList;
                let newHfList = retReplyList.hfList;
            
                for(var i = 0;i<newHfList.length;i++){
                    if (!hfList.find(item=>item.hfid == newHfList[i].hfid)) {
                        hfList.push(newHfList[i]);
                    }
                }
                retReplyList.hfList = hfList;
            }
            this.setState({
                topicMsg:{...this.state.topicMsg,htList},
                allReplyConfig: { ...this.state.allReplyConfig, [htid]: {page, count } },
                allReplyList: { ...this.state.allReplyList, [htid]: retReplyList},
            })
        }).then(()=>{
            var iframe = window.parent.document.getElementById('myIframe');
            var height;

            try {
                height = iframe.contentWindow.document.documentElement.offsetHeight;
            } catch (e) {};
            try {
                height = iframe.contentDocument.documentElement.offsetHeight;
            } catch (e) {};
            iframe.height = height;
        })
    }
    // 搜索话题
    _searchTopic = (page = 1) => {
        page = page || 1;
        let {userType,userBan,userId} = this.props;
        let { pxtype, sstype, sstj, count, banSelected,teacherSelected } = this.state;
        let ssfw;//搜索范围：公开、班内
        if (userType== '课程负责人' || userType=="管理员"||userType == "督导"){
            ssfw = '班内';
        }else if(userType == '任课教师'){
            if(userId == teacherSelected){
                ssfw = "班内";
            }else{
                ssfw = "公开";
            }
        }else if(userType == '学生'){
            if(userBan == banSelected){
                ssfw = '班内'
            }else{
                ssfw = '公开'
            }
        }else {
            ssfw = '公开'
        }
        if(userType== '课程负责人' || userType=="管理员"||userType == "督导"){
            this.props.getTopicListFun({ jxbh: banSelected, pxtype, ssfw, sstype, sstj, page, count }).then(resTopicList => {
                this.setState({
                    topicMsg: resTopicList,
                    isBanPublishTopic:resTopicList.isBanPublishTopic,
                    page: page,
                    expendReplys: {},
                    allReplyConfig: {},
                    allReplyList: {}
                });

            }).then(this.props.getClassListFun(teacherSelected).then(classList=>{
                this.setState({
                    allJxbList:classList.allJxbList
                })
            })).then(()=>{
                var iframe = window.parent.document.getElementById('myIframe');
	            var height;

	            try {
	            	height = iframe.contentWindow.document.documentElement.offsetHeight;
	            } catch (e) {};
	            try {
	            	height = iframe.contentDocument.documentElement.offsetHeight;
	            } catch (e) {};
		        iframe.height = height;
            })
            .catch(e => {
                console.log(e);
                {/* if (e === 101) {
                    window.location.href = 'error1.html'
                } else {
                    window.location.href = 'error2.html'
                } */}
            });
        }else{
            this.props.getTopicListFun({ jxbh: banSelected, pxtype, ssfw, sstype, sstj, page, count }).then(resTopicList => {
                this.setState({
                    topicMsg: resTopicList,
                    isBanPublishTopic:resTopicList.isBanPublishTopic,
                    page: page,
                    expendReplys: {},
                    allReplyConfig: {},
                    allReplyList: {}
                });

            }).then(this.props.getClassListFun(teacherSelected).then(classList=>{
                this.setState({
                    teaJxbList:classList.allJxbList
                })
            })).then(()=>{
                var iframe = window.parent.document.getElementById('myIframe');
	            var height;

	            try {
	            	height = iframe.contentWindow.document.documentElement.offsetHeight;
	            } catch (e) {};
	            try {
	            	height = iframe.contentDocument.documentElement.offsetHeight;
	            } catch (e) {};
		        iframe.height = height;
            })
            .catch(e => {
                console.log(e);
                {/* if (e === 101) {
                    window.location.href = 'error1.html'
                } else {
                    window.location.href = 'error2.html'
                } */}
            });
        }
        
    };
    // 改变排序
    _changeState = (name, event) => {
        console.log('event', event, 'value', event.target.value, 'checked', event.target.checked);
        this.setState({
            [name]: event.target.value
        }, this._searchTopic);
    };
    // 切换回复显示效果
    _toggleReply = (htid) => {
        let status = !this.state.expendReplys[htid];
        this.setState({
            expendReplys: { ...this.state.expendReplys, [htid]: status }
        }, this._searchReply(htid, this.state.allReplyConfig[htid]?this.state.allReplyConfig[htid].page : 1))
    };

    // 禁止发送话题
    _stopSendMsg = (event) => {
        let { banSelected,teacherSelected } = this.state;
        if (event.target.checked) {
            this.props.banPublishTopicFun({ jxbh: banSelected, zt: '禁止' }).then(result => {
                if (result) {
                    this.setState({
                        test: "ksjdfk",
                        isBanPublishTopic: true
                    });
                    Alert.open({
                      alertTip: "成功禁止该班学生发表话题！",
                      closeAlert: function () {}
                    });

                }
            }).catch(e => {
                if (e === 101) {
                    window.location.href = 'error1.html';
                } else if (e === 102) {
                    window.location.href = 'error2.html';
                }
            })
        } else {
            this.props.banPublishTopicFun({ jxbh: banSelected, zt: '解除' }).then(result => {
                if (result) {
                    Alert.open({
                      alertTip: "成功解除禁止发表话题",
                      closeAlert: function () {}
                    });
                    let newAllJxbList = this.state.allJxbList;
                    let newTeaJxbList = this.state.teaJxbList;
                    
                    for(let i = 0;i<newAllJxbList.length;i++){
                        if(newAllJxbList[i].JXB == banSelected){
                            newAllJxbList[i].SFJZTL = 0;
                            break;
                        }
                    }
                    for(let i = 0;i<newTeaJxbList.length;i++){
                        if(newTeaJxbList[i].JXB == banSelected){
                            newTeaJxbList[i].SFJZTL = 0;
                            break;
                        }
                    }

                    this.setState({
                        isBanPublishTopic: false,
                        allJxbList: newAllJxbList,
                        teaJxbList:newTeaJxbList,

                    })
                }
            }).catch(e => {
                if (e === 101) {
                    window.location.href = 'error1.html';
                } else if (e === 102) {
                    window.location.href = 'error2.html';
                }
            })
        }
    }
    // 发送话题
    _sendTopic = (data) => {
        const { htbt, sfyxhf, htnr, dqzt, checkBan } = data;
        console.log('发送话题', htbt, sfyxhf, htnr, dqzt, checkBan);
        let flag = false;
        for(const [jxb, statu] of Object.entries(checkBan)){
            if(statu){
                flag = true;
                break;
            }
        }
        if(htbt ==""){
            Alert.open({
              alertTip: "请输入话题标题！",
              closeAlert: function () {}
            });
        }else if(htnr == ""){
            Alert.open({
              alertTip: "请输入话题内容！",
              closeAlert: function () {}
            });
        }else if(!flag){
            Alert.open({
              alertTip: "请选择话题发表班级！",
              closeAlert: function () {}
            });
        }else{
            let flag = true;
            for (const [jxb, statu] of Object.entries(checkBan)) {
                if (statu) {
                    this.props.publishTopicFun({ jxbbh: jxb, htbt, htnr, sfyxhf, dqzt }).then(result => {
                        if (result.result===100) {
                            this._searchTopic();
                            document.querySelector('#htmc').value = '';
                            Alert.open({
                              alertTip: `成功发送话题`,
                              closeAlert: function () {}
                            });
                        }
                    },result=>{
                        flag = false;
                        Alert.open({
                          alertTip:`${jxb}班发表话题出错`,
                          closeAlert: function () {}
                        });
                        this.setState({
                            isBanPublishTopic:true
                        })
                    }).catch(e => {
                        console.log(e);
                    })
                }
            }
            {/* if(flag){
                 Alert.open({
                  alertTip: "成功发送话题",
                  closeAlert: function () {}
                });
            } */}
           
            this.sendTopic.setState({
                htbt: "", // 话题标题
                sfyxhf: true, //  是否允许回复
                dqzt: 1, // 当前状态，（老师发表话题时，可勾选是否公开，1：默认班内开放；2：公开）
                checkBan: this.sendTopic.props.userBan? {[this.sendTopic.props.userBan]:true} : {}
            });
            this.sendTopic.editor.setData("");
        }
    }

    //发送回复 
    _sendReply = (data) => {
        let { htid, hfnr, hfdxsfrzh, hfdxxm, zhzhf, fjd } = data;
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
                            "fjd": -1,
                            "hfnr":"",
                            "hfdxsfrzh":this.state.htSelectedZzsfrzh
                        }
                    });
                    document.getElementById(`reply_${htid}`).value = "";
                }
            }).then(() => {
                this._searchReply(htid,this.state.allReplyConfig[htid].page);
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
        let searchCallback = this._searchTopic;
        let data1 = data;
        let data2 = '';
        
        switch (cz) {
            case "删除":
                Creat_popup({type:"deleteTopic",callback,data1,searchCallback,data2});
                console.log("删除话题", htid, cz);
                
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
                        this._searchTopic();
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
                        this._searchTopic();
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
                        this._searchTopic();
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
                        this._searchTopic();
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
        let callback = this.props.replyOperateFun;
        let data1 = {hfid,cz};
        let searchCallback = this._searchReply;
        let page = this.state.allReplyConfig[htid].page;
        let data2 = {htid,page};
        switch (cz) {
            case "删除":
                Creat_popup({type:"deleteReply",callback,data1,searchCallback,data2});
                console.log("删除回复:" + hfid);
                
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
                    this._searchReply(htid,page);
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
        window.parent.document.getElementById("report_text").value="";
        window.parent.document.getElementById("reportBox").style.display = "none";
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
                            请选择举报的类型：
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
                            <textarea cols="30" rows="10" id="report_text" placeholder='描述理由请不要超过100字' maxLength='100' onInput={event => { this._changeState("jbly", event) }}></textarea>
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
      "deleteTopic": "删除话题",
      "deleteReply":"删除回复"
    };

    switch(type) {
      case 'deleteTopic':
      case 'deleteReply':
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

        case 'showCompleteTalk':
            return(
                <div id="popbody" ref = "pb">
                    <div id="msg">
                        
                    </div>
                    <div id="popup_option">
                      <button id="popup_OK" ref={btn=>this.OK=btn}>确定</button>
                      <button id="popup_back" ref={btn=>this.back=btn}>取消</button>
                    </div>
                </div>
            )
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
                          alertTip: "成功删除话题！",
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
                });
                break;
            case 'deleteReply':
                this.props.callback(data1).then(result => {
                    if (result) {
                        Alert.open({
                            alertTip: "成功删除回复！",
                            closeAlert: function () {}
                        });
                        
                        {/* let {htList} = BluMUI.result.topicDis.state.topicMsg;
                        for(let i in htList){
                            if(htList[i].htid == this.props.data2){
                                htList[i].hfs -= 1;
                                break;
                            }
                        }; */}
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
            default:break;
        }
        
     
    });
  }
}

function Creat_popup({type,callback,data1,searchCallback,data2}) {
  const popup=window.parent.document.getElementById('popup');
  const popup_datas={
    type,
    callback,
    data1,
    searchCallback,
    data2
  };
  ReactDOM.render(
    <Popup {...popup_datas}/>,
    window.parent.document.getElementById('popup')
  );
  // click to close popup
  popup.style.display="block";
  popup.onclick=cancel_popup;
}

function cancel_popup() {
  let popup=window.parent.document.getElementById('popup');

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
