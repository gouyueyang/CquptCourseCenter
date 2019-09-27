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
                    <option value='kcmc'>课程名称</option>
                </select>
                <div className="search">
                    {/* <input type="text" onKeyDown={(e)=>{if(e.keyCode == 13){changeContent()}}} /> */}
                    <input type="text" onChange={changeContent}/>
                    <span onClick={search}>搜索</span>
                </div>
            </div>
        )
    }
}

class BluMUI_WatchReply extends React.Component {
    constructor(props){
        super(props);
        this.state={
            replyMsg : this.props.replyMsg,  //reply的数据，包括总数、分页信息
            page:1,
            count:10,
            sstype:"htmc", //搜索方式
            sstj:'', //搜索条件
            ssdx:'hfwd',  //搜索对象
        }
    }
    render() {
        let {page,sstype,sstj,ssdx} = this.state;
        let {total,totalPages,hfList:replyList} = this.state.replyMsg;
        let options = {pages: totalPages, page, rows: total };
        return (
            <div id='watch_rep'>
                <div className="rep_top">
                    <div className="top_reply">
                        <span className={ssdx=='hfwd'?'active':''} onClick={()=>{this.setState({ssdx:'hfwd'},this._searchReply)}}>回复我的</span>
                        <span className={ssdx=='whfd'?'active':''} onClick={()=>{this.setState({ssdx:'whfd'},this._searchReply)}}>我回复的</span>
                    </div>
                    <Search sstype={sstype}
                                changeContent={event => this._changeState('sstj', event)}
                                search={this._searchReply.bind(this,1)}
                                changeType={event => this._changeState('sstype', event)} />
                </div>
                <div className="rep_list">
                    {replyList.length > 0 ?
                    replyList.map((item,index)=>{
                        return(
                            <div className="list_item" key={item.hfid}>
                                <div className="item_main clearfix">
                                    <div className="main_content">
                                        <span>{item.zzxm}</span> 回复 <span>{item.hfdxxm}</span>:<span dangerouslySetInnerHTML={{ __html: item.hfnr }}></span>
                                    </div>
                                    <div className="main_time">{moment(parseInt(item.hfsj)).format('YYYY-MM-DD HH:mm:ss')}</div>
                                </div>
                                <div className="item_topic clearfix">
                                    <div className="topic_msg">
                                    <a href={`${courseCenter.host+item.kcbh}`}>{item.kcmc}</a>
                                        >
                                        <a href={`./showTopic.html?htid=${item.htid}`}>{item.htbt}</a>  
                                    </div>
                                    <div className="topic_replay">
                                        <a href={`./showTopic.html?htid=${item.htid}&hfid=${item.hfid}`} target="_blank">回复</a>
                                    </div>
                                </div>
                            </div>
                        )
                        
                    }):(<div id="errorWrap">
                            <img id="errorPic" src="../../imgs/public/error.png" alt="错误或者无数据"/>
                            <span id="errorMsg">暂无回复数据</span>
                        </div>)
                    }
                </div>
                {totalPages>0 && <Fanye options={options} callback={this._searchReply } />}
                
            </div>
        )
    }
    // 改变排序
    _changeState = (name, event) => {
        console.log('event', event, 'value', event.target.value, 'checked', event.target.checked);
        this.setState({
            [name]: event.target.value
        }, this._searchReply);
    };

    _searchReply = (page=1) =>{
        page = page ||1;
        const count = 10;
        let {sstype,sstj,ssdx} = this.state;
        this.props.searchReplyFun({sstype,sstj,ssdx,page,count}).then(retReplyList=>{
            this.setState({
                page:page,
                replyMsg:retReplyList
            })
        }).catch(e => {
            if (e === 101) {
                window.location.href = 'error1.html'
            } else {
                window.location.href = 'error2.html'
            }
        });
    }
}

var BluMUI_M = {
    WatchReply: BluMUI_WatchReply
};

var BluMUI = {
    result: {},
    create: function(data, type, elem, callback) {
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