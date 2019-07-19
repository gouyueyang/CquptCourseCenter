import React from 'react';
import ReactDOM from 'react-dom';
// import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Fanye from '../turnPage';
import moment from 'moment';

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
        const { sfyxhf } = this.state;
        let { banList, userType } = this.props;
        return (
            <div id="sendMsg">
                <h3>发起新话题</h3>
                <input type="text" id="htmc" placeholder='输入话题名称' onChange={event => this._changeState('htbt', event)} className='topicName' />
                <textarea name="content" id='editor'>
                </textarea>
                {
                    userType == "教师" &&
                        <div>
                            {
                                banList.map((item, index) => {
                                    return (
                                        <div key={item.JXB}>
                                            <input type="checkbox"
                                                checked={this.state.checkBan[item.JXB] ? this.state.checkBan[item.JXB] : false}
                                                onChange={event => this._toggleBan(item.JXB)} /><span>{item.JXB}班</span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                }
                {
                    userType == '学生' &&
                        <div>
                            <input type="checkbox"
                                checked={this.state.checkBan[this.props.userBan] ? this.state.checkBan[this.props.userBan] : false}
                                onChange={event => this._toggleBan(this.props.userBan)} /><span>{this.props.userBan}班</span>
                        </div>
                }

                <div className='msg_bottom'>
                    <button onClick={this._sendMsg}>发表</button>
                    <input type="checkbox"
                        checked={!sfyxhf}
                        onChange={event => this._changeState('sfyxhf', event)} /><span>禁止回复(本班级任课教师可取消此状态)</span>
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
    _changeState = (name, event) => {
        let val = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.setState({ [name]: val });
    };
    _sendMsg = () => {
        const { htbt, sfyxhf, dqzt, checkBan } = this.state;
        const htnr = this.editor.getData();
        this.props.sendTopic({ htbt, sfyxhf, htnr, dqzt, checkBan });
        this.setState({
            htbt: '', // 话题标题
            sfyxhf: true, //  是否允许回复
            dqzt: 1, // 当前状态，（老师发表话题时，可勾选是否公开，1：默认班内开放；2：公开）
            checkBan: this.props.userBan? {[this.props.userBan]:true} : {}
        });
        this.editor.setData("");
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
            sendReplyInfo: {
                "zhzhf": 1,
                "fjd": -1,
                "hfnr":""
            }  //发送回复的信息
        }
    }
    // componentDidMount() {
    //     let { htList } = this.state.topicMsg;
    //     htList.forEach(item => {
    //         let page = 0;
    //         let count = 5; // 默认五个回复数
    //         this.props.getReplyListFun({ htid: item.htid, page, count }).then(retReplyList => {
    //             this.setState({
    //                 allReplyConfig: { ...this.state.allReplyConfig, [item.htid]: { page, count } },
    //                 allReplyList: { ...this.state.allReplyList, [item.htid]: retReplyList },
    //             })
    //         })
    //     });
    // }

    render() {
        let { teacherSelected, banSelected, allJxbList, expendReplys, pxtype, sstype, page, allReplyList, allReplyConfig, isBanPublishTopic } = this.state;
        console.log(allJxbList);

        let { jsList } = this.props.teacherList;
        let { userType,userBan } = this.props;
        let banList = this.props.classList.allJxbList;//登陆教师的班级列表
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
                                        <li className={teacherSelected === item.SFRZH ? 'active' : ''}
                                            key={item.SFRZH}
                                            onClick={() => this._changeTeacher(item.SFRZH)}>{item.XM}</li>
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
                                <input type="radio" value='sjjx' name='pxtype' checked={pxtype === 'sjjx'} onChange={event => this._changeState('pxtype', event)} />时间降序
							</span>
                            <span>
                                <input type="radio" value='sjsx' name='pxtype' checked={pxtype === 'sjsx'} onChange={event => this._changeState('pxtype', event)} />时间升序
							</span>
                            <span>
                                <input type="radio" value='rmpx' name='pxtype' checked={pxtype === 'rmpx'} onChange={event => this._changeState('pxtype', event)} />热门排序
							</span>
                            {
                                this.props.userId == teacherSelected ?
                                <span>
                                <input type="checkbox" checked={isBanPublishTopic ? true : false} onClick={this._stopSendMsg.bind(this)} />禁止发表话题
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
                                            <h3>{item.htbt}</h3>
                                            <div dangerouslySetInnerHTML={{ __html: item.htnr }}></div>
                                            <div className="item_bottom clearfix">
                                                <div className="bottom_authCon">
                                                    <span>{item.zzxm}</span>
                                                    <span>{moment(parseInt(item.fbsj)).format('YYYY-MM-DD hh:mm:ss')}</span>
                                                    {/* <span onClick={() => this._topicOperate({ htid: item.id, cz: "点赞" })}>赞({item.dzs})</span> */}
                                                    <span className='color' onClick={() => this._toggleReply(item.htid)}>{expendReplys[item.htid] ? '收起回复' : `回复(${item.hfs})`}</span>
                                                </div>
                                                <div className="bottom_inform">
                                                    {/* {console.log("登陆id:" + this.props.userId)}
                                                    {console.log("话题举报权限:" + (this.props.userId != item.jssfrzh))}
                                                    {console.log("话题禁止回复权限:" + (this.props.userId == item.jssfrzh))}
                                                    {console.log("话题删除权限:" + (this.props.userId == item.zzsfrzh || this.props.userId == item.jssfrzh))} */}
                                                    {userType != '游客' && (this.props.userId != item.jssfrzh ? <a href="javascript:void(0);" onClick={() => { this._showReportBox({ htInfo: item }) }}>举报</a> : '')}
                                                    {this.props.userId == item.jssfrzh ? (item.sfyxhf ? <a href="javascript:void(0);" onClick={this._topicOperate.bind(this, { htid: item.htid, cz: '禁止回复' })}>禁止回复</a> : <a href="javascript:void(0);" onClick={this._topicOperate.bind(this, { htid: item.htid, cz: '解除禁止回复' })}>解除禁止回复</a>) : null}
                                                    {(this.props.userId == item.zzsfrzh || this.props.userId == item.jssfrzh) ? <a href="javascript:void(0);" onClick={() => { this._topicOperate({ htid: item.htid, cz: '删除' }) }}>删除</a> : ''}
                                                    {userType != '游客' && (item.sfyxhf ? <a href="javascript:void(0);" onClick={() => { this.setState({ expendReplys: { ...this.state.expendReplys, [item.htid]: true }, sendReplyInfo: { ...this.state.sendReplyInfo, "hfdxsfrzh": item.zzsfrzh } }, this._searchReply(item.htid)); }}>回复</a> : null)}
                                                </div>
                                            </div>
                                            {
                                                expendReplys[item.htid] && allReplyList[item.htid] ?
                                                    <div className="item_info">
                                                        {
                                                            allReplyList[item.htid].hfList.map((repItem, index) => <div className="info_one clearfix" key={index}>
                                                                <div className="one_msg">
                                                                    <span>{repItem.zzxm}</span>
                                                                    <span>{repItem.hfnr}</span>
                                                                </div>
                                                                <div className="one_func">

                                                                    {userType!= '游客' && (this.props.userId != item.jssfrzh ? <a className='color' href="javascript:void(0);" onClick={() => { this._showReportBox({ htInfo: item, hfInfo: repItem }) }}>举报</a> : null)}
                                                                    {/* <a href="javascript:void(0)" onClick={() => { this._replyOperate(repItem.hfid, "点赞", item.htid) }}>赞({repItem.dzs})</a> */}
                                                                    {(this.props.userId == repItem.zzsfrzh || this.props.userId == item.zzsfrzh || this.props.userId == item.jssfrzh) ? <a className='color' href="javascript:void(0);" onClick={() => { this._replyOperate(repItem.hfid, "删除", item.htid) }}>删除</a> : null}
                                                                    <a href="#">{moment(parseInt(repItem.hfsj)).format('YYYY-MM-DD hh:mm:ss')}</a>
                                                                    {userType != '游客' && <a className='color' href="javascript:void(0);" onClick={() => { repItem.zzxm ? document.getElementById(`reply_${item.htid}`).value = ` 回复 ${repItem.zzxm}: ` : document.getElementById(`reply_${item.htid}`).value = `回复: `; this.setState({ sendReplyInfo: { ...this.state.sendReplyInfo, "hfdxsfrzh": repItem.zzsfrzh, "zhzhf": 2, "fjd": repItem.hfid } }, console.log(this.state)) }}>回复</a>}
                                                                </div>
                                                            </div>
                                                            )
                                                        }
                                                        {
                                                            userType != '游客' &&
                                                            (item.sfyxhf ?
                                                                <div className="info_commit">
                                                                    <textarea rows="2" id={`reply_${item.htid}`} placeholder='请输入回复内容' autoFocus onFocus={() => { this.setState({ sendReplyInfo: { ...this.state.sendReplyInfo, "htid": item.htid } }) }} onInput={(e) => { this.setState({ sendReplyInfo: { ...this.state.sendReplyInfo, "hfnr": e.target.value } }) }}></textarea>
                                                                    <button onClick={() => { this._sendReply(this.state.sendReplyInfo) }}>发表</button>
                                                                </div> : null)
                                                        }
                                                        {
                                                            allReplyList[item.htid].totalPages >1 &&
                                                            <Fanye This={this} options={{ pages: allReplyList[item.htid].totalPages, page: allReplyConfig[item.htid].page, rows: allReplyList[item.htid].total }}
                                                            callback={this._searchReply.bind(this, item.htid)} />
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
                            userType != '游客' && (this.state.isBanPublishTopic ? <div><p>本班处于禁止发帖状态</p></div> : <SendTopic sendTopic={(data) => this._sendTopic(data)} banList={banList} userType={userType} userBan={userBan}/>)
                        }
                    </div>
                    
                </div>
                
            </div>
        )
    }
    // 选择老师
    _changeTeacher = (SFRZH) => {
        this.props.getClassListFun(SFRZH).then(data => {
            let { allJxbList } = data;
            this.setState({
                teacherSelected: SFRZH,
                allJxbList
            })
        });
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
            this.setState({
                allReplyConfig: { ...this.state.allReplyConfig, [htid]: { page, count } },
                allReplyList: { ...this.state.allReplyList, [htid]: retReplyList },
            })
        })
    }
    // 搜索话题
    _searchTopic = (page = 1) => {
        let {userType,userBan} = this.props;
        let { pxtype, sstype, sstj, count, banSelected } = this.state;
        let ssfw;//搜索范围：公开、班内
        if (userType== '游客'){
            ssfw = '公开';
        }else if(userType == '学生'){
            if(userBan == banSelected){
                ssfw = '班内'
            }else{
                ssfw = '公开'
            }
        }else if(userType == '教师'){
            ssfw = '班内'
        }
        this.props.getTopicListFun({ jxbh: banSelected, pxtype, ssfw, sstype, sstj, page, count }).then(retTopicList => {
            this.setState({
                topicMsg: retTopicList,
                page: page,
                expendReplys: {},
                allReplyConfig: {},
                allReplyList: {}
            });

        }).catch(e => {
            if (e === 101) {
                window.location.href = 'error1.html'
            } else {
                window.location.href = 'error2.html'
            }
        });
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
        }, this._searchReply(htid, 1))
    };

    // 禁止发送话题
    _stopSendMsg = (event) => {
        let { banSelected } = this.state;
        if (event.target.checked) {
            this.props.banPublishTopicFun({ jxbh: banSelected, zt: '禁止' }).then(result => {
                if (result) {
                    this.setState({
                        test: "ksjdfk",
                        isBanPublishTopic: true
                    });
                    alert('成功禁止发表话题');

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
                    alert('成功解除禁止发表话题');
                    this.setState({
                        isBanPublishTopic: false
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
            alert("请输入话题标题！");
        }else if(htnr == ""){
            alert("请输入话题内容！");
        }else if(!flag){
            alert("请选择话题发表班级！");
        }else{
            for (const [jxb, statu] of Object.entries(checkBan)) {
                if (statu) {
                    this.props.publishTopicFun({ jxbbh: jxb, htbt, htnr, sfyxhf, dqzt }).then(result => {
                        if (result) {
                            this._searchTopic();
                            document.querySelector('#htmc').value = '';
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
            alert('成功发送话题');
        }
    }

    //发送回复 
    _sendReply = (data) => {
        let { htid, hfnr, hfdxsfrzh, zhzhf, fjd } = data;
        if(hfnr==''){
            alert('请输入回复内容！');
        }else{
            this.props.publishReplyFun({ htid, hfnr, hfdxsfrzh, zhzhf, fjd }).then(result => {
                if (result) {
                    alert("成功发送回复");
                    this.setState({
                        sendReplyInfo: {
                            "zhzhf": 1,
                            "fjd": -1,
                            "hfnr":""
                        }
                    })
                }
            }).then(() => {
                this._searchReply(htid);
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
                        alert('成功删除话题');
                    }
                }).then(() => {
                    this._searchTopic
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
                        alert('成功设置话题禁止回复');
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
                        alert('成功解除话题禁止回复');
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
        switch (cz) {
            case "删除":
                console.log("删除回复:" + hfid);
                this.props.replyOperateFun({ hfid, cz }).then(result => {
                    if (result) {
                        alert('成功删除回复');
                    }
                }).then(() => {
                    this._searchReply(htid);
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
                        alert('成功点赞');
                    }
                }).then(() => {
                    this._searchReply(htid);
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

{/* class BluMUI_WatchReply extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        let options = { pages: 5, page: 3, rows: 30 };
        return (
            <div id='watch_rep'>
                <div className="rep_top">
                    <div className="top_reply">
                        <span className='active'>回复我的</span>
                        <span>我回复的</span>
                    </div>
                    <Search />
                </div>
                <div className="rep_list">
                    <div className="list_item">
                        <div className="item_main clearfix">
                            <div className="main_content">
                                <span>同学A</span>回复 <span>老师B</span>：<span>回复的内容回复的内容回复的内容</span>
                            </div>
                            <div className="main_time">2019-04-10 13:30</div>
                        </div>
                        <div className="item_topic clearfix">
                            <div className="topic_msg">
                                回复我的话题：“TCP与UDP传输协议的区别和用法”> <span>通讯技术概论</span>
                            </div>
                            <div className="topic_replay">
                                <span>回复</span>
                            </div>
                        </div>
                    </div>
                    <div className="list_item">
                        <div className="item_main clearfix">
                            <div className="main_content">
                                <span>同学A</span>回复 <span>老师B</span>：<span>回复的内容回复的内容回复的内容</span>
                            </div>
                            <div className="main_time">2019-04-10 13:30</div>
                        </div>
                        <div className="item_topic clearfix">
                            <div className="topic_msg">
                                回复我的话题：“TCP与UDP传输协议的区别和用法”> <span>通讯技术概论</span>
                            </div>
                            <div className="topic_replay">
                                <span>回复</span>
                            </div>
                        </div>
                    </div>
                    <div className="list_item">
                        <div className="item_main clearfix">
                            <div className="main_content">
                                <span>同学A</span>回复 <span>老师B</span>：<span>回复的内容回复的内容回复的内容</span>
                            </div>
                            <div className="main_time">2019-04-10 13:30</div>
                        </div>
                        <div className="item_topic clearfix">
                            <div className="topic_msg">
                                回复我的话题：“TCP与UDP传输协议的区别和用法”> <span>通讯技术概论</span>
                            </div>
                            <div className="topic_replay">
                                <span>回复</span>
                            </div>
                        </div>
                    </div>
                    <div className="list_item">
                        <div className="item_main clearfix">
                            <div className="main_content">
                                <span>同学A</span>回复 <span>老师B</span>：<span>回复的内容回复的内容回复的内容</span>
                            </div>
                            <div className="main_time">2019-04-10 13:30</div>
                        </div>
                        <div className="item_topic clearfix">
                            <div className="topic_msg">
                                回复我的话题：“TCP与UDP传输协议的区别和用法”> <span>通讯技术概论</span>
                            </div>
                            <div className="topic_replay">
                                <span>回复</span>
                            </div>
                        </div>
                    </div>
                    <div className="list_item">
                        <div className="item_main clearfix">
                            <div className="main_content">
                                <span>同学A</span>回复 <span>老师B</span>：<span>回复的内容回复的内容回复的内容</span>
                            </div>
                            <div className="main_time">2019-04-10 13:30</div>
                        </div>
                        <div className="item_topic clearfix">
                            <div className="topic_msg">
                                回复我的话题：“TCP与UDP传输协议的区别和用法”> <span>通讯技术概论</span>
                            </div>
                            <div className="topic_replay">
                                <span>回复</span>
                            </div>
                        </div>
                    </div>
                    <div className="list_item">
                        <div className="item_main clearfix">
                            <div className="main_content">
                                <span>同学A</span>回复 <span>老师B</span>：<span>回复的内容回复的内容回复的内容</span>
                            </div>
                            <div className="main_time">2019-04-10 13:30</div>
                        </div>
                        <div className="item_topic clearfix">
                            <div className="topic_msg">
                                回复我的话题：“TCP与UDP传输协议的区别和用法”> <span>通讯技术概论</span>
                            </div>
                            <div className="topic_replay">
                                <span>回复</span>
                            </div>
                        </div>
                    </div>
                </div>
                <Fanye options={options} callback={() => { console.log('fanye') }} />
                <SendTopic />
            </div>
        )
    }
} */}

class BluMUI_ReportMan extends React.Component {
    render() {
        return (
            <div id="report">
                <div className="report_title clearfix">
                    <div className="title_left">
                        <span className='title'>举报管理</span>
                        <span><input type="checkbox" />话题举报</span>
                        <span><input type="checkbox" />回复举报</span>
                        <span><input type="checkbox" />话题操作记录</span>
                        <span><input type="checkbox" />回复操作举报</span>
                    </div>
                    <Search />
                </div>
                <div className="report_list">
                    <div className="list_item">
                        <div className="item_content clearfix">
                            <div className="content_left">
                                <span>同学A</span>回复<span>同学B</span><span>回复的内容回复的内容回复的内容</span>
                            </div>
                            <div className="content_time">
                                2019-04-10 13:30
							</div>
                        </div>
                        <div className="item_msg clearfix">
                            <div className="msg_left">
                                <div className="left_type">
                                    举报类型：<span>垃圾广告</span>
                                </div>
                                <div className="left_reason">
                                    <div>举报理由：</div>
                                    <div className='reason_detail'>
                                        这是举报内容
										这是举报内容
										这是举报内容
										这是举报内容
										这是举报内容
										这是举报内容
										这是举报内容
										这是举报内容
										这是举报内容
										这是举报内容
										这是举报内容
										这是举报内容
										这是举报内容
										这是举报内容
										这是举报内容
										这是举报内容
									</div>
                                </div>
                            </div>
                            <div className="msg_func">
                                <div>查看</div>
                                <div>删除</div>
                                <div>忽略</div>
                            </div>
                        </div>
                        <div className="item_bottom">
                            <span>话题名称</span> >
							<span>课程名称</span> >
							<span>教学班老师名字</span> >
							教学班
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
        let  hfid  = this.props.hfInfo ? this.props.hfInfo.hfid : null;
        let { jblx, jbly } = this.state;
        this.props.commitReportFun({ htid, hfid, jblx, jbly }).then(result => {
            alert("提交举报成功！");
        }).catch(e => {
            if (e === 101) {
                window.location.href = 'error1.html';
            } else {
                window.location.href = 'error2.html';
            }
        });
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
                                    <span key={index}><input type="checkbox" value={item.xlxnr} checked={jblx === item.xlxnr} onChange={event => { this._changeState("jblx", event);this.setState({'xlxjj':item.xlxjj}) }} />{item.xlxnr}</span>
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
    ReportMan: BluMUI_ReportMan,
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
