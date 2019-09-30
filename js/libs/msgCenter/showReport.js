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
                    <option value='kcmc'>课程名称</option>
                </select>
                <div className="search">
                    {/* <input type="text" onKeyDown={(e)=>{if(e.keyCode == 13){changeContent()}}} /> */}
                    <input type="text" onChange={changeContent} />
                    <span onClick={search}>搜索</span>
                </div>
            </div>
        )
    }
}

class BluMUI_ShowReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reportMsg: this.props.reportMsg,  //report的数据，包括总数、分页信息
            page: 1,
            count: 10,
            sstype: "htmc", //搜索方式
            sstj: '', //搜索条件
            ssdx: 'htjb',  //搜索对象
            onloadFlag:true //加载状态 false:加载中 true:加载完成
        }
    }
    render() {
        let {userType} = this.props;
        let { page, sstype, sstj, ssdx ,onloadFlag} = this.state;
        let { total, totalPages, jbList } = this.state.reportMsg;
        let options = { pages: totalPages, page, rows: total };
        return (
            <div id="report">
                <div className="report_title clearfix">
                    <div className="title_left">
                        <span className='title'>举报管理</span>
                        <span><input type="checkbox" id="checkbox_1" value="htjb" checked={ssdx === 'htjb'} onChange={event => this._changeState('ssdx', event)} /><label htmlFor="checkbox_1"></label>待处理的话题举报</span>
                        <span><input type="checkbox" id="checkbox_2" value="hfjb" checked={ssdx === 'hfjb'} onChange={event => this._changeState('ssdx', event)} /><label htmlFor="checkbox_2"></label>待处理的回复举报</span>
                        <span><input type="checkbox" id="checkbox_3" value="htczjl" checked={ssdx === 'htczjl'} onChange={event => this._changeState('ssdx', event)} /><label htmlFor="checkbox_3"></label>话题举报操作记录</span>
                        <span><input type="checkbox" id="checkbox_4" value="hfczjl" checked={ssdx === 'hfczjl'} onChange={event => this._changeState('ssdx', event)} /><label htmlFor="checkbox_4"></label>回复举报操作记录</span>
                    </div>
                    <Search sstype={sstype}
                                changeContent={event => this._changeState('sstj', event)}
                                search={this._searchReportInfo.bind(this,1)}
                                changeType={event => this._changeState('sstype', event)} />
                </div>
                {onloadFlag == true ? 
                    (jbList.length > 0?
                <div className="report_list">
                    {(ssdx == 'htjb' || ssdx == 'hfjb') &&
                        jbList.map((item, index) => {
                            return (
                                <div className="list_item" key={item.jbid}>
                                    <div className="item_content clearfix">

                                        {ssdx == 'htjb' || ssdx == 'htczjl' ? <div className="content_left"><span>{item.htbt}</span><div className="font_normal" dangerouslySetInnerHTML={{ __html: item.htnr }}></div></div> : null}
                                        {ssdx == 'hfjb' || ssdx == 'hfczjl' ? <div className="content_left"><span>{item.hfzzxm} 回复 {item.hfdxxm} :</span><div className="font_normal" dangerouslySetInnerHTML={{ __html: item.hfnr }}></div></div> : null}

                                        <div className="content_time">
                                            {moment(parseInt(item.jbsj)).format('YYYY-MM-DD HH:mm:ss')}
                                        </div>
                                    </div>
                                    <div className="item_msg clearfix">
                                        <div className="msg_left">
                                            <div className="left_type">
                                                <span>举报类型:</span><span>{item.jblx}</span>&nbsp;&nbsp;
                                                <span>举报人:</span><span>{item.jbrxm}</span>
                                            </div>
                                            <div className="left_reason">
                                                <div>举报理由:</div>
                                                <div className='reason_detail'>
                                                    {item.jbly}
                                                </div>
                                            </div>
                                        </div>

                                        {item.clzt == 2 ?
                                            <div className="msg_func">
                                                <div><a href={`./showTopic.html?htid=${item.htid}`} target="_blank">查看</a></div>
                                                {userType != "学生" &&
                                                (ssdx == 'htjb' ?
                                                    <div>
                                                        <div onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '删除', dx: 'ht', info: { htid: item.htid, cz: "删除" } }) }}>删除</div>
                                                        <div onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '忽略', dx: 'ht', info: { htid: item.htid, cz: "忽略" } }) }}>忽略</div>
                                                    </div>
                                                    :
                                                    <div>
                                                        <div onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '删除', dx: 'hf', info: { hfid: item.hfid, cz: "删除" } }) }}>删除</div>
                                                        <div onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '忽略', dx: 'hf', info: { hfid: item.hfid, cz: "忽略" } }) }}>忽略</div>
                                                    </div>
                                                )
                                                }
                                            </div> :
                                            <div className="msg_func">
                                                <div><a href={`./showTopic.html?htid=${item.htid}`} target="_blank">查看</a></div>
                                                {userType != "学生" &&
                                                (ssdx == 'htczjl' ?
                                                    <div onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '恢复班内可见', dx: 'ht', info: { htid: item.htid, cz: "设置班内可见" } }) }}>恢复班内可见</div> :
                                                    <div onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '恢复', dx: 'hf', info: { hfid: item.hfid, cz: "恢复" } }) }}>恢复</div>
                                                ) 
                                                }
                                            </div>
                                        }
                                    </div>
                                    <div className="item_bottom">

                                        {ssdx == 'hfjb' ? <a href={`./showTopic.html?htid=${item.htid}`}>{item.htbt}></a>  : null}
                                        <a href={`${courseCenter.host+item.kcbh}`}>{item.kcmc}</a>
                                    </div>
                                </div>
                            )
                        })
                    }
                    {ssdx == 'htczjl' &&
                        <table id="center_table">
                            <thead>
                                <tr>
                                    <th width="20px"></th>
                                    {userType !="学生" &&
                                    <th>举报id</th>
                                    }
                                    <th>话题名称</th>
                                    <th>话题内容</th>
                                    <th>举报类型</th>
                                    <th>举报理由</th>
                                    {userType !="学生" &&
                                    <th>举报人</th>
                                    }
                                    <th>举报时间</th>
                                    <th>处理结果</th>
                                    <th>处理人</th>
                                    <th>处理时间</th>
                                    {userType !="学生" &&
                                    <th>操作</th>
                                    }
                                    <th width="20px"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    jbList.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td width="20px"></td>
                                                {
                                                    userType != "学生" &&
                                                <td>{item.jbid}</td>
                                                }
                                                <td><div>{item.htbt}</div></td>
                                                <td><div dangerouslySetInnerHTML={{ __html: item.htnr }}></div></td>
                                                <td>{item.jblx}</td>
                                                <td>{item.jbly}</td>
                                                {
                                                    userType != "学生" &&
                                                <td>{item.jbrxm}</td>
                                                }
                                                <td>{moment(parseInt(item.jbsj)).format('YYYY-MM-DD')}</td>
                                                {item.cljg == 1 && <td>删除</td>}
                                                {item.cljg == 2 && <td>忽略</td>}
                                                {item.cljg == 3 && <td>恢复</td>}
                                                {item.cljg == 4 && <td>班内可见</td>}
                                                {item.cljg == 5 && <td>公开</td>}
                                                
                                                <td>{item.clrxm}</td>
                                                
                                                <td>{moment(parseInt(item.clsj)).format('YYYY-MM-DD')}</td>
                                                {
                                                    userType != "学生" && item.cljg == 1 &&
                                                    <td>
                                                        <span className="op_on" onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '班内可见', dx: 'ht', info: { htid: item.htid, cz: "设置班内可见", kcbh: item.kcbh } }) }}>恢复班内可见</span>
                                                        <span className="op_on" onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '公开', dx: 'ht', info: { htid: item.htid, cz: "公开", kcbh: item.kcbh } }) }}>公开</span>
                                                        <span className="op_on"><a href={`./showTopic.html?htid=${item.htid}`} target="_blank">查看</a></span>
                                                    </td>
                                                }
                                                {
                                                    userType != "学生" && item.cljg == 2 &&
                                                    <td>
                                                        <span className="op_on" onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '班内可见', dx: 'ht', info: { htid: item.htid, cz: "设置班内可见", kcbh: item.kcbh } }) }}>设置班内可见</span>
                                                        <span className="op_on" onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '删除', dx: 'ht', info: { htid: item.htid, cz: "删除", kcbh: item.kcbh } }) }}>删除</span>
                                                        <span className="op_on" onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '公开', dx: 'ht', info: { htid: item.htid, cz: "公开", kcbh: item.kcbh } }) }}>公开</span>
                                                        <span className="op_on"><a href={`./showTopic.html?htid=${item.htid}`} target="_blank">查看</a></span>
                                                    </td>
                                                }
                                                {
                                                    userType != "学生" && item.cljg == 3 &&
                                                    <td>
                                                        <span className="op_on" onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '班内可见', dx: 'ht', info: { htid: item.htid, cz: "设置班内可见", kcbh: item.kcbh } }) }}>设置班内可见</span>
                                                        <span className="op_on" onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '删除', dx: 'ht', info: { htid: item.htid, cz: "删除", kcbh: item.kcbh } }) }}>删除</span>
                                                        <span className="op_on" onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '公开', dx: 'ht', info: { htid: item.htid, cz: "公开", kcbh: item.kcbh } }) }}>公开</span>
                                                        <span className="op_on"><a href={`./showTopic.html?htid=${item.htid}`} target="_blank">查看</a></span>
                                                    </td>
                                                }
                                                {
                                                    userType != "学生" && item.cljg == 4 &&
                                                    <td>
                                                        <span className="op_on" onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '删除', dx: 'ht', info: { htid: item.htid, cz: "删除", kcbh: item.kcbh } }) }}>删除</span>
                                                        <span className="op_on" onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '公开', dx: 'ht', info: { htid: item.htid, cz: "公开", kcbh: item.kcbh } }) }}>公开</span>
                                                        <span className="op_on"><a href={`./showTopic.html?htid=${item.htid}`} target="_blank">查看</a></span>
                                                    </td>
                                                }
                                                {
                                                    userType != "学生" && item.cljg == 5 &&
                                                    <td>
                                                        <span className="op_on" onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '班内可见', dx: 'ht', info: { htid: item.htid, cz: "设置班内可见", kcbh: item.kcbh } }) }}>设置班内可见</span>
                                                        <span className="op_on" onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '删除', dx: 'ht', info: { htid: item.htid, cz: "删除", kcbh: item.kcbh } }) }}>删除</span>
                                                        <span className="op_on"><a href={`./showTopic.html?htid=${item.htid}`} target="_blank">查看</a></span>
                                                    </td>
                                                }

                                                <td width="20px"></td>
                                            </tr>
                                        )

                                    })
                                }

                            </tbody>
                        </table>

                    }
                    {ssdx == 'hfczjl' &&
                        <table id="center_table">
                            <thead>
                                <tr>
                                    <th width="20px"></th>
                                    {userType !="学生" &&
                                    <th>举报id</th>
                                    }
                                    <th>话题名称</th>
                                    <th>回复内容</th>
                                    <th>举报类型</th>
                                    <th>举报理由</th>
                                    <th>举报时间</th>
                                    {userType !="学生" &&
                                    <th>举报人</th>
                                    }
                                    <th>处理结果</th>
                                    <th>处理人</th>
                                    <th>处理时间</th>
                                    {userType !="学生" &&
                                    <th>操作</th>
                                    }
                                    <th width="20px"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    jbList.map((item, index) => {
                                        return (
                                            <tr key={item.jbid}>
                                                <td width="20px"></td>
                                                {
                                                    userType != "学生" &&
                                                <td>{item.jbid}</td>
                                                }
                                                <td><div>{item.htbt}</div></td>
                                                <td><div dangerouslySetInnerHTML={{ __html: item.hfnr }}></div></td>
                                                <td>{item.jblx}</td>
                                                <td>{item.jbly}</td>
                                                {
                                                    userType != "学生" &&
                                                    <td>{item.jbrxm}</td>
                                                }
                                                <td>{moment(parseInt(item.jbsj)).format('YYYY-MM-DD')}</td>
                                                {item.cljg == 1 && <td>删除</td>}
                                                {item.cljg == 2 && <td>忽略</td>}
                                                {item.cljg == 3 && <td>恢复</td>}

                                                <td>{item.clrxm}</td>
                                                <td>{moment(parseInt(item.clsj)).format('YYYY-MM-DD')}</td>
                                                {
                                                    userType != "学生" && item.cljg == 1 &&
                                                    <td>
                                                        <span className="op_on" onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '恢复', dx: 'hf', info: { hfid: item.hfid, cz: "恢复", kcbh: item.kcbh } }) }}>恢复</span>
                                                        <span className="op_on"><a href={`./showTopic.html?htid=${item.htid}&hfid=${item.hfid}`} target="_blank">查看</a></span>
                                                    </td>
                                                }
                                                {
                                                    userType != "学生" && (item.cljg == 2 || item.cljg == 3) &&
                                                    <td>
                                                        <span className="op_on" onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '删除', dx: 'hf', info: { hfid: item.hfid, cz: "删除", kcbh: item.kcbh } }) }}>删除</span>
                                                        <span className="op_on"><a href={`./showTopic.html?htid=${item.htid}&hfid=${item.hfid}`} target="_blank">查看</a></span>
                                                    </td>
                                                }

                                                <td width="20px"></td>
                                            </tr>
                                        )

                                    })
                                }

                            </tbody>
                        </table>
                    }


                </div>:(<div className="report_list">
                            <div id="errorWrap">
                                <img id="errorPic" src="../../imgs/public/error.png" alt="错误或者无数据"/>
                                {ssdx == 'htjb' && <span id="errorMsg">暂无待处理的话题举报数据</span>}
                                {ssdx == 'hfjb' && <span id="errorMsg">暂无待处理的回复举报数据</span>}
                                {(ssdx == 'htczjl' || ssdx == 'hfczjl') && <span id="errorMsg">暂无数据</span>}
                            </div>
                        </div>)
                    ):(<div className="report_list">
                            <div id="errorWrap">
                                <img id="errorPic" src="../../imgs/public/error.png" alt="加载中..."/>
                                <span id="errorMsg">加载中...</span>
                            </div>
                        </div>)
                    }
                
                {totalPages>0 && <Fanye options={options} callback={this._searchReportInfo } />}
            </div>
        )
    }

    // 改变排序
    _changeState = (name, event) => {
        console.log('event', event, 'value', event.target.value, 'checked', event.target.checked);
        this.setState({
            [name]: event.target.value,
            reportMsg:{
                total:0,
                totalPages:0,
                jbList:[]
            },
            onloadFlag:false
        }, this._searchReportInfo);
    };

    _searchReportInfo = (page = 1) => {
        page = page || 1;
        let jbr = '';
        let bjbr = '';
        let { count, sstype, sstj, ssdx } = this.state;
        let {userId,userType} = this.props;
        if(userType == "学生"){
            jbr = userId;
        }
        this.props.searchReportInfoFun({ sstype, sstj, ssdx, jbr,bjbr, page, count }).then(retReportList => {
            this.setState({
                page: page,
                reportMsg: retReportList,
                onloadFlag:true
            })
        })
    }

    _reportOperate({ jbid, cz, dx, info } = {}) {
        let callback1,data1,callback2,data2,callback3,data3;
        // this.props.reportOperateFun({ jbid, cz }).then(result => {
            switch (cz) {
                case "班内可见":
                    if (dx == "ht") {
                        callback1 = this.props.reportOperateFun;
                        data1 = { jbid, cz };
                        callback2 = this.props.topicOperateFun;
                        data2 = info;
                        callback3 = this._searchReportInfo;
                        data3 = this.state.page;
                        Creat_popup({type:"班内可见",callback1,data1,callback2,data2,callback3,data3});
                        // this.props.topicOperateFun(info).then(result => {
                        //     Alert.open({
                        //         alertTip: "该话题已设置为班内可见！",
                        //         closeAlert: function () { }
                        //     });
                        // })
                    }
                    break;
                case "公开":
                    if (dx == "ht") {
                        callback1 = this.props.reportOperateFun;
                        data1 = { jbid, cz };
                        callback2 = this.props.topicOperateFun;
                        data2 = info;
                        callback3 = this._searchReportInfo;
                        data3 = this.state.page;
                        Creat_popup({type:"公开",callback1,data1,callback2,data2,callback3,data3});
                        // this.props.topicOperateFun(info).then(result => {
                        //     Alert.open({
                        //         alertTip: "该话题已设置为公开！",
                        //         closeAlert: function () { }
                        //     });
                        // })
                    }
                case "删除":
                    
                    switch (dx) {
                        case "ht": 
                            callback1 = this.props.reportOperateFun;
                            data1 = { jbid, cz };
                            callback2 = this.props.topicOperateFun;
                            data2 = info;
                            callback3 = this._searchReportInfo;
                            data3 = this.state.page;
                            Creat_popup({type:"删除话题",callback1,data1,callback2,data2,callback3,data3});
                            // this.props.topicOperateFun(info).then(result => {
                            //     Alert.open({
                            //         alertTip: "该话题已删除！",
                            //         closeAlert: function () { }
                            //     });
                            // }); 
                        break;
                        case "hf":
                            callback1 = this.props.reportOperateFun;
                            data1 = { jbid, cz };
                            callback2 = this.props.replyOperateFun;
                            data2 = info;
                            callback3 = this._searchReportInfo;
                            data3 = this.state.page; 
                            
                            Creat_popup({type:"删除回复",callback1,data1,callback2,data2,callback3,data3});
                            // this.props.replyOperateFun(info).then(result => {
                            //     Alert.open({
                            //         alertTip: "该回复已删除！",
                            //         closeAlert: function () { }
                            //     });
                            // }); 
                        break;
                        default: break;
                    }
                    break;
                case "忽略":
                    this.props.reportOperateFun({ jbid, cz }).then(result => {
                        Alert.open({
                            alertTip: "该举报信息已移除！",
                            closeAlert: function () { }
                        });
                        this._searchReportInfo(this.state.page);
                    });
                    break;
                case "恢复":
                    this.props.reportOperateFun({ jbid, cz }).then(result => {
                        switch (dx) {
                            case "ht": this.props.topicOperateFun(info).then(result => {
                                Alert.open({
                                    alertTip: "该话题已恢复！",
                                    closeAlert: function () { }
                                });
                                this._searchReportInfo(this.state.page);
                            }); break;
                            case "hf": this.props.replyOperateFun(info).then(result => {
                                Alert.open({
                                    alertTip: "该回复已恢复！",
                                    closeAlert: function () { }
                                });
                                this._searchReportInfo(this.state.page);
                            }); break;
                            default: break;
                        }
                    });
                    break;
                default: break;
            }
            // this._searchReportInfo(this.state.page);
        // }).catch(e => {
        //     if (e === 101) {
        //         window.location.href = './../classInfShow/error1.html';
        //     } else {
        //         window.location.href = './../classInfShow/error2.html';
        //     }
        // });

    }
}

class Popup extends React.Component {
    constructor(props) {
      super(props);
    }
  
    render() {
      const {type}=this.props;
      const MAP={
        "班内可见":"将话题设置为班内可见？",
        "公开": "将话题设置为公开？",
        "删除话题":"删除话题？删除话题后可在“话题举报操作记录”处找回",
        "删除回复":"删除回复？删除回复后可在“回复举报操作记录”处找回"
      };
  
      switch(type) {
        case '班内可见':
        case '公开':
        case '删除话题':
        case '删除回复':
          return(
            <div id="popbody" ref='pb'>
              <div id="msg">
                <p>{`确定要${MAP[type]}`}</p>
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
                  this.props.callback1(data1).then(result => {
                      if (result) {
                          Alert.open({
                            alertTip: "处理成功！",
                            closeAlert: function () {}
                          });
                          
                      }
                      
                  }).then(() => {
                      this.props.callback2(this.props.data2);
                  }).then(()=>{
                    cancel_popup();
                    this.props.callback3(this.props.data3);
                  }).catch(e => {
                      if (e === 101) {
                          window.location.href = 'error1.html'
                      } else if (e === 102) {
                          window.location.href = 'error2.html'
                      }
                  });
              
      });
    }
  }
  
  function Creat_popup({type,callback1,data1,callback2,data2,callback3,data3}) {
    const popup=document.getElementById('popup');
    const popup_datas={
      type,
      callback1,
      data1,
      callback2,
      data2,
      callback3,
      data3
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
    ShowReport: BluMUI_ShowReport
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