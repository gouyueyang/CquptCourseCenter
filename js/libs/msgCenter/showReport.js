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
            reportMsg: this.props.reportMsg,  //reply的数据，包括总数、分页信息
            page: 1,
            count: 10,
            sstype: "htmc", //搜索方式
            sstj: '', //搜索条件
            ssdx: 'htjb',  //搜索对象
        }
    }
    render() {
        let { page, sstype, sstj, ssdx } = this.state;
        console.log("渲染时：");
        console.log(this.state);
        let { total, totalPages, jbList: jbList } = this.state.reportMsg;
        console.log(jbList);
        let options = { pages: totalPages, page, rows: total };
        return (
            <div id="report">
                <div className="report_title clearfix">
                    <div className="title_left">
                        <span className='title'>举报管理</span>
                        <span><input type="checkbox" value="htjb" checked={ssdx === 'htjb'} onChange={event => this._changeState('ssdx', event)} />话题举报</span>
                        <span><input type="checkbox" value="hfjb" checked={ssdx === 'hfjb'} onChange={event => this._changeState('ssdx', event)} />回复举报</span>
                        <span><input type="checkbox" value="htczjl" checked={ssdx === 'htczjl'} onChange={event => this._changeState('ssdx', event)} />话题举报操作记录</span>
                        <span><input type="checkbox" value="hfczjl" checked={ssdx === 'hfczjl'} onChange={event => this._changeState('ssdx', event)} />回复举报操作记录</span>
                    </div>
                    <Search />
                </div>
                <div className="report_list">
                    {(ssdx == 'htjb' || ssdx == 'hfjb') &&
                        jbList.map((item, index) => {
                            return (
                                <div className="list_item" key={item.jbid}>
                                    <div className="item_content clearfix">

                                        {ssdx == 'htjb' || ssdx == 'htczjl' ? <div className="content_left"><span>{item.htbt}</span><span dangerouslySetInnerHTML={{ __html: item.htnr }}></span></div> : null}
                                        {ssdx == 'hfjb' || ssdx == 'hfczjl' ? <div className="content_left"><span>{item.hfzzxm}</span><span>{item.hfnr}</span></div> : null}

                                        <div className="content_time">
                                            {moment(parseInt(item.jbsj)).format('YYYY-MM-DD hh:mm:ss')}
                                        </div>
                                    </div>
                                    <div className="item_msg clearfix">
                                        <div className="msg_left">
                                            <div className="left_type">
                                                举报类型：<span>{item.jblx}</span>
                                            </div>
                                            <div className="left_reason">
                                                <div>举报理由：</div>
                                                <div className='reason_detail'>
                                                    {item.jbly}
                                                </div>
                                            </div>
                                        </div>

                                        {item.clzt == 2 ?
                                            <div className="msg_func">
                                                <div><a href={`./showTopic.html?kcbh=${item.kcbh}`} target="_blank">查看</a></div>
                                                {ssdx == 'htjb' ?
                                                    <div>
                                                        <div onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '删除', dx: 'ht', info: { htid: item.htid, cz: "删除" } }) }}>删除</div>
                                                        <div onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '忽略', dx: 'ht', info: { htid: item.htid, cz: "忽略" } }) }}>忽略</div>
                                                    </div>
                                                    :
                                                    <div>
                                                        <div onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '删除', dx: 'hf', info: { hfid: item.hfid, cz: "删除" } }) }}>删除</div>
                                                        <div onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '忽略', dx: 'hf', info: { hfid: item.hfid, cz: "忽略" } }) }}>忽略</div>
                                                    </div>

                                                }
                                            </div> :
                                            <div className="msg_func">
                                                <div><a href={`./showTopic.html?kcbh=${item.kcbh}`} target="_blank">查看</a></div>
                                                {ssdx == 'htczjl' ?
                                                    <div onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '恢复班内可见', dx: 'ht', info: { htid: item.htid, cz: "设置班内可见" } }) }}>恢复班内可见</div> :
                                                    <div onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '恢复', dx: 'hf', info: { hfid: item.hfid, cz: "恢复" } }) }}>恢复</div>}
                                            </div>
                                        }
                                    </div>
                                    <div className="item_bottom">

                                        {ssdx == 'hfjb' ? <span>{item.htbt} ></span> : null}
                                        <span>{item.kcmc}</span>
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
                                    <th>举报id</th>
                                    <th>话题名称</th>
                                    <th>话题内容</th>
                                    <th>举报类型</th>
                                    <th>举报理由</th>
                                    <th>举报时间</th>
                                    <th>处理结果</th>
                                    <th>处理人</th>
                                    <th>处理时间</th>
                                    <th>操作</th>
                                    <th width="20px"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    jbList.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td width="20px"></td>
                                                <td>{item.jbid}</td>
                                                <td>{item.htbt}</td>
                                                <td dangerouslySetInnerHTML={{ __html: item.htnr }}></td>
                                                <td>{item.jblx}</td>
                                                <td>{item.jbly}</td>
                                                <td>{moment(parseInt(item.jbsj)).format('YYYY-MM-DD')}</td>
                                                {item.cljg == 1 && <td>删除</td>}
                                                {item.cljg == 2 && <td>忽略</td>}
                                                {item.cljg == 3 && <td>恢复</td>}
                                                {item.cljg == 4 && <td>班内可见</td>}
                                                {item.cljg == 5 && <td>公开</td>}
                                                <td>{item.clr}</td>
                                                <td>{moment(parseInt(item.clsj)).format('YYYY-MM-DD')}</td>
                                                {
                                                    item.cljg == 1 &&
                                                    <td>
                                                        <span className="op_on" onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '班内可见', dx: 'ht', info: { htid: item.htid, cz: "设置班内可见", kcbh: item.kcbh } }) }}>恢复班内可见</span>
                                                        <span className="op_on" onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '公开', dx: 'ht', info: { htid: item.htid, cz: "公开", kcbh: item.kcbh } }) }}>公开</span>
                                                        <span className="op_on"><a href={`./showTopic.html?kcbh=${item.kcbh}`} target="_blank">查看</a></span>
                                                    </td>
                                                }
                                                {
                                                    item.cljg == 2 &&
                                                    <td>
                                                        <span className="op_on" onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '班内可见', dx: 'ht', info: { htid: item.htid, cz: "设置班内可见", kcbh: item.kcbh } }) }}>设置班内可见</span>
                                                        <span className="op_on" onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '删除', dx: 'ht', info: { htid: item.htid, cz: "删除", kcbh: item.kcbh } }) }}>删除</span>
                                                        <span className="op_on" onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '公开', dx: 'ht', info: { htid: item.htid, cz: "公开", kcbh: item.kcbh } }) }}>公开</span>
                                                        <span className="op_on"><a href={`./showTopic.html?kcbh=${item.kcbh}`} target="_blank">查看</a></span>
                                                    </td>
                                                }
                                                {
                                                    item.cljg == 3 &&
                                                    <td>
                                                        <span className="op_on" onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '班内可见', dx: 'ht', info: { htid: item.htid, cz: "设置班内可见", kcbh: item.kcbh } }) }}>设置班内可见</span>
                                                        <span className="op_on" onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '删除', dx: 'ht', info: { htid: item.htid, cz: "删除", kcbh: item.kcbh } }) }}>删除</span>
                                                        <span className="op_on" onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '公开', dx: 'ht', info: { htid: item.htid, cz: "公开", kcbh: item.kcbh } }) }}>公开</span>
                                                        <span className="op_on"><a href={`./showTopic.html?kcbh=${item.kcbh}`} target="_blank">查看</a></span>
                                                    </td>
                                                }
                                                {
                                                    item.cljg == 4 &&
                                                    <td>
                                                        <span className="op_on" onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '删除', dx: 'ht', info: { htid: item.htid, cz: "删除", kcbh: item.kcbh } }) }}>删除</span>
                                                        <span className="op_on" onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '公开', dx: 'ht', info: { htid: item.htid, cz: "公开", kcbh: item.kcbh } }) }}>公开</span>
                                                        <span className="op_on"><a href={`./showTopic.html?kcbh=${item.kcbh}`} target="_blank">查看</a></span>
                                                    </td>
                                                }
                                                {
                                                    item.cljg == 5 &&
                                                    <td>
                                                        <span className="op_on" onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '班内可见', dx: 'ht', info: { htid: item.htid, cz: "设置班内可见", kcbh: item.kcbh } }) }}>设置班内可见</span>
                                                        <span className="op_on" onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '删除', dx: 'ht', info: { htid: item.htid, cz: "删除", kcbh: item.kcbh } }) }}>删除</span>
                                                        <span className="op_on"><a href={`./showTopic.html?kcbh=${item.kcbh}`} target="_blank">查看</a></span>
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
                                    <th>举报id</th>
                                    <th>话题名称</th>
                                    <th>回复内容</th>
                                    <th>举报类型</th>
                                    <th>举报理由</th>
                                    <th>举报时间</th>
                                    <th>处理结果</th>
                                    <th>处理人</th>
                                    <th>处理时间</th>
                                    <th>操作</th>
                                    <th width="20px"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    jbList.map((item, index) => {
                                        return (
                                            <tr key={item.jbid}>
                                                <td width="20px"></td>
                                                <td>{item.jbid}</td>
                                                <td>{item.htbt}</td>
                                                <td>{item.hfnr}</td>
                                                <td>{item.jblx}</td>
                                                <td>{item.jbly}</td>
                                                <td>{moment(parseInt(item.jbsj)).format('YYYY-MM-DD')}</td>
                                                {item.cljg == 1 && <td>删除</td>}
                                                {item.cljg == 2 && <td>忽略</td>}
                                                {item.cljg == 3 && <td>恢复</td>}

                                                <td>{item.clr}</td>
                                                <td>{moment(parseInt(item.clsj)).format('YYYY-MM-DD')}</td>
                                                {
                                                    item.cljg == 1 &&
                                                    <td>
                                                        <span className="op_on" onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '恢复', dx: 'hf', info: { hfid: item.hfid, cz: "恢复", kcbh: item.kcbh } }) }}>恢复</span>
                                                        <span className="op_on"><a href={`./showTopic.html?kcbh=${item.kcbh}`} target="_blank">查看</a></span>
                                                    </td>
                                                }
                                                {
                                                    item.cljg == 2 || item.cljg == 3 &&
                                                    <td>
                                                        <span className="op_on" onClick={() => { this._reportOperate({ jbid: item.jbid, cz: '删除', dx: 'hf', info: { hfid: item.hfid, cz: "删除", kcbh: item.kcbh } }) }}>删除</span>
                                                        <span className="op_on"><a href={`./showTopic.html?kcbh=${item.kcbh}`} target="_blank">查看</a></span>
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


                </div>
                <Fanye options={options} callback={() => { this._searchReportInfo }} />
            </div>
        )
    }

    // 改变排序
    _changeState = (name, event) => {
        console.log('event', event, 'value', event.target.value, 'checked', event.target.checked);
        this.setState({
            [name]: event.target.value
        }, this._searchReportInfo);
    };

    _searchReportInfo = (page = 1) => {
        page = page || 1;
        let { count, sstype, sstj, ssdx } = this.state;
        this.props.searchReportInfoFun({ sstype, sstj, ssdx, page, count }).then(retReportList => {
            this.setState({
                page: page,
                reportMsg: retReportList
            })
        })
    }

    _reportOperate({ jbid, cz, dx, info } = {}) {
        this.props.reportOperateFun({ jbid, cz }).then(result => {
            switch (cz) {
                case "班内可见":
                    if (dx == "ht") {
                        this.props.topicOperateFun(info).then(result => {
                            Alert.open({
                                alertTip: "该话题已设置为班内可见！",
                                closeAlert: function () { }
                            });
                        })
                    }
                    break;
                case "公开":
                    if (dx == "ht") {
                        this.props.topicOperateFun(info).then(result => {
                            Alert.open({
                                alertTip: "该话题已设置为公开！",
                                closeAlert: function () { }
                            });
                        })
                    }
                case "删除":
                    switch (dx) {
                        case "ht": this.props.topicOperateFun(info).then(result => {
                            Alert.open({
                                alertTip: "该话题已删除！",
                                closeAlert: function () { }
                            });
                        }); break;
                        case "hf": this.props.replyOperateFun(info).then(result => {
                            Alert.open({
                                alertTip: "该回复已删除！",
                                closeAlert: function () { }
                            });
                        }); break;
                        default: break;
                    }
                    break;
                case "忽略":
                    Alert.open({
                        alertTip: "该举报信息已移除！",
                        closeAlert: function () { }
                    });
                    break;
                case "恢复":
                    switch (dx) {
                        case "ht": this.props.topicOperateFun(info).then(result => {
                            Alert.open({
                                alertTip: "该话题已恢复！",
                                closeAlert: function () { }
                            });
                        }); break;
                        case "hf": this.props.replyOperateFun(info).then(result => {
                            Alert.open({
                                alertTip: "该回复已恢复！",
                                closeAlert: function () { }
                            });
                        }); break;
                        default: break;
                    }
                    break;
                default: break;
            }
            this._searchReportInfo(this.state.page);
        }).catch(e => {
            if (e === 101) {
                window.location.href = './../classInfShow/error1.html';
            } else {
                window.location.href = './../classInfShow/error2.html';
            }
        });

    }
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