import React from 'react';
import ReactDOM from 'react-dom';
// import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Fanye from '../turnPage';
import moment from 'moment';
import Alert from "../../util/alert.js";
import wangeditor from 'wangeditor';




class Search extends React.Component {
    render() {
        const { sstype, changeContent, changeType, search } = this.props;
        return (
            <div className="content_search">
                <select value={sstype} onChange={changeType}>
                    <option value='htmc'>作业名称</option>
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
            sfyxhf: false, //  是否允许回复
            dqzt: 1, // 当前状态，（老师发表话题时，可勾选是否公开，1：默认班内开放；2：公开）
            checkBan: this.props.userBan? {[this.props.userBan]:true} : {},
            fjList:[],//附件id列表
            fjxxList:[] //附件完整信息
        };
        this._sendMsg = this._sendMsg.bind(this);
    }

    

    render() {
        const { sfyxhf,dqzt,fjxxList } = this.state;
        let { banList, userType,saveAjax} = this.props;
        
        return (
            <div id="sendMsg">
                <h3>发起新作业</h3>
                <input type="text" id="htmc" placeholder='请输入作业名称（50字内）' maxLength="50" onChange={event => this._changeState('htbt', event)} className='topicName' />
                <div id="editor">
                    
                </div>
                
                {
                    (userType == "任课教师" || userType =="课程负责人" || userType == "督导" || userType == "管理员"||userType == "助理") &&
                        <div>
                            <div>
                                <span className="mustWrite">*</span><span className="tip_color">您要发布到哪些班集？请勾选：</span>
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
                            <span className="mustWrite">*</span><span className="tip_color">发布班级：</span>
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
                {
                    (userType == "任课教师" || userType == "管理员" || userType == "督导" || userType == "课程负责人"||userType == "助理") &&
                    <BluMUI_AssessmentScheme
                            id={'AssessmentScheme'}
		            	    fileFormName={'file'}
		            	    items= {fjxxList}
		            	    saveAjax= {saveAjax}
                    />
                }
            
                <div className='msg_bottom'>
                    <button onClick={this._sendMsg}>发   表</button>
                    {
                        (userType == "任课教师" || userType == "管理员" || userType == "督导" || userType == "课程负责人"||userType == "助理") &&
                        <div className="otherSet">
                            <input type = "checkbox" id="checkbox_gk" checked={dqzt!=1} onChange={event => this._changeDqzt(event)}></input>
                            <label htmlFor="checkbox_gk"></label>
                            <span>公开<span className="tip_color">(默认状态为班内可见)</span></span>
                        </div>
                    }
                </div>
            </div>  
        )
    }
    componentDidMount() {
        let editor = new wangeditor("#editor");

        editor.customConfig.zIndex = 10;
        editor.customConfig.emotions = [
            {
                // tab 的标题
                title: '默认',
                // type -> 'emoji' / 'image'
                type: 'image',
                // content -> 数组
                content: [
                    {
                        alt: '[坏笑]',
                        src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/50/pcmoren_huaixiao_org.png'
                    },
                    {
                        alt: '[舔屏]',
                        src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/pcmoren_tian_org.png'
                    }
                ]
            }
        ];
        editor.customConfig.onchange = (html)=>{
            
            
            if(html.length>20000){
                Alert.open({
                    alertTip: "输入内容过长！",
                    closeAlert: function () {}
                });
                editor.cmd.do('undo');
                // console.log(editor.txt.html());
            }
        }
	    //开启debug模式
	    editor.customConfig.debug = true;
	    // 关闭粘贴内容中的样式
	    editor.customConfig.pasteFilterStyle = false;
	    // 忽略粘贴内容中的图片
	    editor.customConfig.pasteIgnoreImg = true;
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
	    		// alert(url);
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
        //         // toolbar: ['heading', '|', 'bold', 'italic','TextColor','BGColor','Styles','Format','Font','FontSize','Subscript','Superscript','|',  'link', 'bulletedList', 'numberedList', 'blockQuote','Table','HorizontalRule','Smiley','SpecialChar','PageBreak','|', 'Undo','Redo'],
        //         maxlength:10
        //     })
        //     .then(newEditor => {
        //         this.editor = newEditor;
        //         let maxlength = 100;
        //         newEditor.on('key',function(event){
        //             console.log(event.target.value);
        //             var oldhtml = this.editor.document.getBody().getHtml();
        //             var description = oldhtml.replace(/<.*?>/ig,"");
        //             var etop = $("#cke_1_top");
        //             var _slen = maxlength-description.length;
        //             var canwrite = $("<label id='canwrite'>还可以输入200字</label>");
        //             if(etop.find("#canwrite").length<1){
        //                 canwrite.css({border:'1px #f1f1f1 solid','line-height':'28px',color:'#999'});
        //                 etop.prepend(canwrite);
        //             }
        //             var _label = etop.find("#canwrite");
        //             if(description.length>maxlength){
        //                 //alert("最多可以输入"+maxlength+"个文字，您已达到最大字数限制");
        //                 this.editor.setData(oldhtml);
        //                 _label.html("还可以输入0字");
        //             }else{
        //                 _label.html("还可以输入"+_slen+"字");
        //             }
        //         });
        //     })
        //     .catch(err => {
        //         console.error(err.stack);
        //     });
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
        const { htbt, sfyxhf, dqzt, checkBan,fjList } = this.state;
        // const htnr = this.editor.getData();
        const htnr = this.editor.txt.html();
       
        
        this.props.sendTopic({ htbt, sfyxhf, htnr, dqzt, checkBan,fjList });
        
    
        
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
            qx:this.props.qx,
            userType:this.props.userType,
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
            },  //发送回复的信息
            
        }
    }

    
    _setNickName=(e,jxbbh,jxbbm)=>{
        let deleteJxbNickname = this.props.deleteJxbNickname;
        let callback = this.props.setJxbNickname;
        let data1 = {jxbbh,jxbbm};
        let searchCallback = this._searchTopic;
        let data2 = '';
        Creat_popup({type:"setJxbNickname",callback,data1,searchCallback,data2,deleteJxbNickname});
    }

    


    

    render() {
        let { teacherSelected, banSelected, allJxbList,teaJxbList, expendReplys, pxtype, sstype, page, allReplyList, allReplyConfig, isBanPublishTopic,htSelected,qx,userType} = this.state;
        let { jsList,wkkJsList } = this.props.teacherList;
        let { userBan,userId,saveAjax } = this.props;
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
                                                onClick={() => this._changeBan(item.JXB)}
                                                onContextMenu={
                                                    (userType == "管理员" || userType == "课程负责人" || userType == "督导"||userType == "助理" || userId == teacherSelected) ? (e)=>{
                                                    e.preventDefault();
                                                    this._setNickName(e,item.JXB,item.JXBBM);
                                                    } : null
                                                }
                                                title="点击鼠标右键设置教学班别名"    
                                                >
                                                {item.JXBBM ? item.JXBBM : item.JXB+"班"}
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
                            {/* {
                                (userType == "管理员" || userType == "课程负责人" || userType == "督导"||userType == "助理") || userId == teacherSelected ?
                                <span>
                                <input id="checkbox_banPublicTopic" type="checkbox" checked={isBanPublishTopic ? true : false} onClick={this._stopSendMsg.bind(this)} />
                                <label htmlFor="checkbox_banPublicTopic"></label>
                                禁止发表话题
                                </span>:null
                            } */}
                            {(userType == '管理员' || userId == teacherSelected) && <a className='color' href="javascript:void(0);" onClick={this._showAssistant.bind(this)}>设置学生助理</a>}
                            {/* {userType != '游客' && <a className='color' href='../msgCenter/showReply.html' target='_blank'>查看回复</a>}
                            {userType != '游客' && <a className='color' href='../msgCenter/showReport.html' target='_blank'>查看举报</a>} */}
                            
                            
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
                                            <h3><a href={`../msgCenter/showHomework.html?zyid=${item.htid}`} target="_blank">{item.htbt}</a></h3>
                                            <div className="htnr_box" dangerouslySetInnerHTML={{ __html: item.htnr }}></div>
                                            <div className="item_bottom clearfix">
                                                <div className="bottom_authCon">
                                                    <span>{item.zzxm}</span>
                                                    <span>{moment(parseInt(item.fbsj)).format('YYYY-MM-DD HH:mm:ss')}</span>
                                                    {/* <span onClick={() => this._topicOperate({ htid: item.id, cz: "点赞" })}>赞({item.dzs})</span> */}
                                                    
                                                </div>
                                                <div className="bottom_inform">
                                                    
                                                    {(qx.deleteTopic && (userType == "管理员" || userType == "课程负责人" || userType == "督导"||userType == "助理" || userId == item.zzsfrzh || userId == item.jssfrzh)) ? <a className="hidden" href="javascript:void(0);" onClick={() => { this._topicOperate({ htid: item.htid, cz: '删除' }) }}>删除</a> : ''}
                                                    {qx.openTopic && item.dqzt ==1 && (userType == "管理员" || userType == "课程负责人" || userType == "督导"||userType == "助理" || userId == item.jssfrzh) ?
                                                        (item.dqzt == 1 && <a href="javascript:void(0);" onClick={this._topicOperate.bind(this, { htid: item.htid, cz: '公开' })}>公开作业</a>):null}

                                                    {qx.openTopic && item.dqzt ==2 && (userType == "管理员" || userType == "课程负责人" || userType == "督导"||userType == "助理" || userId == item.jssfrzh) ?
                                                        (item.dqzt == 2 && <a href="javascript:void(0);" onClick={this._topicOperate.bind(this, { htid: item.htid, cz: '设置班内可见' })}>取消公开</a>):null}
                                                    
                                                </div>
                                            </div>
                                            
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
                            (userType == "管理员" || userType == "督导" || userType == "课程负责人") && <SendTopic ref={(ref)=>this.sendTopic=ref} sendTopic={(data) => this._sendTopic(data)} banList={allJxbList} userType={userType} userBan={userBan} saveAjax={saveAjax}/>
                        }
                        {
                            ((userType == "任课教师" && userId == teacherSelected) || userType == "助理") && <SendTopic ref={(ref)=>this.sendTopic=ref} sendTopic={(data) => this._sendTopic(data)} banList={teaJxbList} userType={userType} userBan={userBan} saveAjax={saveAjax}/>
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
            let qx = null;
            let userType=this.state.userType;
            this.props.isAssistant({jsSfrzh:SFRZH,xsSfrzh:this.props.userId}).then(data=>{
                userType = data.js;
                qx = this.props.setQx(userType);
            }).then(()=>{
                this.setState({
                    teacherSelected: SFRZH,
                    allJxbList,
                    banSelected:allJxbList[0].JXB,
                    qx,
                    userType
                },this._searchTopic);
            })
            
        });
        this.sendTopic &&           //判断是否有发布模块
        this.sendTopic.setState({
            htbt: "", // 话题标题
            sfyxhf: true, //  是否允许回复
            dqzt: 1, // 当前状态，（老师发表话题时，可勾选是否公开，1：默认班内开放；2：公开）
            checkBan: this.sendTopic.props.userBan? {[this.sendTopic.props.userBan]:true} : {},
            fjList:[]
        });
        if(document.querySelector('#htmc')){
            document.querySelector('#htmc').value = '';
        } 
        this.sendTopic &&
        // this.sendTopic.editor.setData("");
        this.sendTopic.editor.txt.html("");
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
        let {userBan,userId} = this.props;
        let { userType,pxtype, sstype, sstj, count, banSelected,teacherSelected } = this.state;
        let ssfw;//搜索范围：公开、班内
        if (userType== '课程负责人' || userType=="管理员"||userType == "督导"||userType == "助理"){
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
                    allReplyList: {},
                    
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
                    allReplyList: {},
                    fjList:[],
                    fjxxList:[]
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
        // console.log('event', event, 'value', event.target.value, 'checked', event.target.checked);
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

    
    // 发送话题
    _sendTopic = (data) => {
        const { htbt, sfyxhf, htnr, dqzt, checkBan,fjList } = data;
        // console.log('发送话题', htbt, sfyxhf, htnr, dqzt, checkBan,fjList);
        let flag = false;
        for(const [jxb, statu] of Object.entries(checkBan)){
            if(statu){
                flag = true;
                break;
            }
        }
        if(htbt ==""){
            Alert.open({
              alertTip: "请输入作业标题！",
              closeAlert: function () {}
            });
        }else if(htnr == ""){
            Alert.open({
              alertTip: "请输入作业内容！",
              closeAlert: function () {}
            });
        }else if(!flag){
            Alert.open({
              alertTip: "请选择作业发表班级！",
              closeAlert: function () {}
            });
        }else{
            let flag = true;
            for (const [jxb, statu] of Object.entries(checkBan)) {
                if (statu) {
                    this.props.publishTopicFun({ jxbbh: jxb, htbt, htnr, sfyxhf, dqzt,fjList }).then(result => {
                        if (result.result===100) {
                            this._searchTopic();
                            document.querySelector('#htmc').value = '';
                            
                            Alert.open({
                              alertTip: `成功发布作业`,
                              closeAlert: function () {
                                  
                              }
                            });
                        }
                    },result=>{
                        flag = false;
                        Alert.open({
                          alertTip:`${jxb}班发布作业出错，请重新操作！`,
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
           
           this.setState({
               key:new Date()
           })
           let clearFjList = [];
           let clearFjxxList = [];
            this.sendTopic.setState({
                htbt: "", // 话题标题
                htnr:"",//话题内容
                sfyxhf: false, //  是否允许回复
                dqzt: 1, // 当前状态，（老师发表话题时，可勾选是否公开，1：默认班内开放；2：公开）
                checkBan: this.sendTopic.props.userBan? {[this.sendTopic.props.userBan]:true} : {},
                fjList:clearFjList,
                fjxxList:clearFjxxList,
            });

            // this.sendTopic.editor.setData("");
            this.sendTopic.editor.txt.html("");
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
                
                
                break;
            case "禁止回复":
                
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
           
                this.props.topicOperateFun({ htid, cz }).then(result => {
                    if (result) {
                        Alert.open({
                          alertTip: "成功公开作业！",
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
               
                this.props.topicOperateFun({ htid, cz }).then(result => {
                    if (result) {
                        Alert.open({
                          alertTip: "成功设置该作业班内可见！",
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
               
                this.props.topicOperateFun({ htid, cz }).then(result => {
                    if (result) {
                        let htList = this.state.topicMsg.htList;
                       
                        htList.find(obj = obj.htid == htid)[dzs] += 1;
                       
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


    _showReportBox({ htInfo, hfInfo } = {}) {
        this.props.creatReportBox({htInfo,hfInfo});
    }

    _showAssistant=()=>{
        let {teacherSelected} = this.state;
        this.props.createAssistantBox(teacherSelected);
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
        // console.log('event', event, 'value', event.target.value, 'checked', event.target.checked);
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

class BluMUI_TopicAssistant extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            zlList : this.props.assistantList,
            stuList : [] ,    //待选列表
            searchXm:'',   
            searchXh:''
        }
        this._getList = this._getList.bind(this);
        this._add = this._add.bind(this);
        this._delete = this._delete.bind(this);
        this._searchStu = this._searchStu.bind(this);
    }

    

    _searchStu(){
        let xm = this.state.searchXm;
        let xh = this.state.searchXh;
        this.props.searchStu({xm,xh}).then(res=>{
            this.setState({
                stuList:res
            })
        })
    }

    _getList(){
        let {jsSfrzh} = this.props;
        this.props.getAssistant(jsSfrzh).then(res=>{
            this.setState({
                zlList:res
            })
        })
    }

    _add(item){
        let {jsSfrzh} = this.props;
        let {sfrzh,xm,xh,xymc} = item;
        this.props.addAssistant({jsSfrzh,sfrzh,xm,xh,xymc}).then(result => {
            Alert.open({
              alertTip: "添加助理成功！",
              closeAlert: ()=>{}
            });
        },result=>{

        }).then(this._getList).catch(e => {
            if (e === 101) {
                window.location.href = 'error1.html';
            } else {
                window.location.href = 'error2.html';
            }
        });
    }

    _delete(id){
        this.props.deleteAssistant(id).then(result => {
            Alert.open({
              alertTip: "删除成功！",
              closeAlert:()=>{}
            });
        }).then(this._getList).catch(e => {
            if (e === 101) {
                window.location.href = 'error1.html';
            } else {
                window.location.href = 'error2.html';
            }
        });
    }

    _closeAssistant = ()=>{
        
        // window.document.getElementById("xmInput").value="";
        // window.document.getElementById("xhInput").value="";
        window.document.getElementById("assistantBox").style.display = "none";
        let assistantWrap = window.document.getElementById("assistantWrap");
        ReactDOM.unmountComponentAtNode(assistantWrap);
    }

    render(){
        let {zlList,stuList} = this.state;
        return(
            <div id='topic_zl'>
				<h1>设置学生助理</h1>
				<p className="topic_zl_tips"><span>*</span>提示：助理辅助教师管理当前课程下所有班级的话题区域，助理不超过3人</p>
				<div id="addZl">
					<span>新增助理：</span>
					<span>
						<input type="text" ref={ref=>this.xmInput = ref} id="xmInput" placeholder="请输入姓名" onInput={(eve)=>{this.setState({searchXm:eve.target.value},this._searchStu)}}></input>
					</span>
					<span>
                        <input type="text" ref={ref=>this.xhInput = ref} id="xhInput" placeholder="请输入学号" onInput={(eve)=>{this.setState({searchXh:eve.target.value},this._searchStu)}}></input>
					</span>
                    {
                        stuList.length >0 &&
                        <div className="zl_table">
					    	<table>
					    		<tr>
					    			<th>学号</th>
					    			<th>身份认证号</th>
					    			<th>学院</th>
					    			<th>姓名</th>
					    			<th>操作</th>
					    		</tr>
                                {
                                    stuList.map((item,index)=>{
                                        return(
                                            <tr key={index}>
                                                <td>{item.xh}</td>
							                	<td>{item.sfrzh}</td>
							                	<td>{item.xymc}</td>
							                	<td>{item.xm}</td>
							                	<td className="operateColor" onClick={()=>{this._add(item)}}>添加</td>
					    		            </tr>
                                        )
                                    })
                                }
                                
					    	</table>
					    </div>
                    }
					
				</div>
                {
                    zlList.length > 0 &&
                    <div id="zlList">
					    <span>助理列表：</span>
					    <div className="zl_table">
						    <table>
							    <tr>
							    	<th>学号</th>
							    	<th>身份认证号</th>
							    	<th>学院</th>
							    	<th>姓名</th>
							    	<th>操作</th>
							    </tr>
                                {
                                    zlList.map((item,index)=>{
                                        return(
                                            <tr key={index}>
							                	<td>{item.xh}</td>
							                	<td>{item.sfrzh}</td>
							                	<td>{item.xymc}</td>
							                	<td>{item.xm}</td>
							                	<td className="operateColor" onClick={()=>{this._delete(item.id)}}>删除</td>
							                </tr>
                                        )  
                                    })
                                }
                                
						    </table>
					    </div>
					
				    </div>
                }
				
                <div className='close_wrap'>
                    <button className='close' onClick={this._closeAssistant}>关闭</button>
                </div>
			</div>
        )
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
		if (item.callback)
			return (
				function () {
					that.setState({
						index: index
					})
					item.callback( that.props.listIndex,index, that.props.items);//listIndex:列表序号，index行内序号
				}
			);
	}
	_createLi() {
		var result = [],
			i,
			len,
			items = this.props.items;
		for (i = 0, len = items.length; i < len; i++) {
			result.push(
				<li key={i}
					className={this.state.index == i ? 'selected index' + i : 'index' + i}
					data-key={i}>
					{
						items[i].url
						&&
						<a title={items[i].value}
							href={items[i].url}
							target="_blank"
							onClick={this._onClick(i, items[i])}
						>{items[i].value}</a>
						||
						<a title={items[i].value}
							onClick={this._onClick(i, items[i])}
						>{items[i].value}</a>
					}
				</li>
			);
        }
        
        
		return result;
    }
    componentDidMount(){
        var iframe = window.parent.document.getElementById('myIframe');
        var height;
        try {
            height = iframe.contentWindow.document.documentElement.offsetHeight;
        } catch (e) {};
        try {
            height = iframe.contentDocument.documentElement.offsetHeight;
        } catch (e) {};
        iframe.height = height;
    }
	render() {
		return (
			<ul id={this.props.id} className={"BluMUI_List " + this.props.extClass}>
				{this._createLi()}
			</ul>
		)
	}
}
// 文件选择
class BluMUI_FileUp extends React.Component {
	constructor(props) {
		super(props);
		this._warn = this._warn.bind(this);
	}
	_warn(e) {
		var value = e.target.value,
			warn;
		if (value) {
			warn = value;
		}
		else {
			warn = '没选择文件';
		}
		this.warnBox.innerHTML = warn;
	}
	render() {
		return (
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
					<span ref={(warnBox) => (this.warnBox = warnBox)} className="warn" id={this.props.warnId || "warn"} >未选择文件</span>
				</div>
			</div>
		)
	}
}
// 文件上传组件
class BluMUI_AssessmentScheme extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			items: this.props.items,
			isDown: true,
			isUpload: true
		};
		// this._isDown = this._isDown.bind(this);
		this._save = this._save.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		this.state = {
			items: nextProps.items
		};
	}
	// _isDown() {
	// 	this.setState({
	// 		isDown: !this.state.isDown
	// 	})
	// }
	_save(e) {
		// if (this.state.isUpload) {
			var data = {
				file: {
					value: document.getElementById('file').files,
					maxSize: 5,
					errorInf: '未选择文件',
					suffix: ['pdf','doc','docx','excel','xls','xlsx','ppt','pptx']
				},
				ableDownload: {
					value: this.state.isDown ? 1 : 2
				}
			};
			if (this.props.saveAjax)
				this.props.saveAjax(data, this);
		// }
	}
	_createList() {
		var i,
			j,
			items = this.state.items,
			result = [];
		for (i = 0, j = items.length; i < j; i++) {
			
			result.push(
				<BluMUI_List id=""
					key={i}
                    listIndex ={i}
					items={this.state.items[i]}
				>
				</BluMUI_List>
			)
		}
		return result;
	}
	render() {
		return (
			<div id={this.props.id}>
				{/* <div>
					<span className="title" >{this.props.title}</span>
				</div> */}
				
					<div>
						<div className="Item" id="khfa">
							<span className="itemNameM">上传附件:</span>
							<BluMUI_FileUp fileId="file"
								warnId="warn_file"
								fileFormName={this.props.fileFormName}
							></BluMUI_FileUp>
                            <button onClick={this._save} className="activeBtn">上传</button>
                            <span className="uploadWarn">允许上传pdf、doc、xlsx、ppt格式的文件</span>
						</div>
						{/* <div className="Item" id="isDown">
							<span className="isDownLoadFile">允许下载</span>
							<BlueMUI_Radio callback={this._isDown}
								selected={this.state.isDown}
							></BlueMUI_Radio>
						</div> */}
						
						
					</div>
				
				<div className="fileList">
					{this._createList()}
				</div>
			</div>
		);
	}
}

class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.state={
        nickname:'',
        data1:this.props.data1,
        data2:this.props.data2
    }
  }

  render() {
    const {type,data1}=this.props;
    const MAP={
      "deleteTopic": "删除作业",
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
      case 'setJxbNickname' :
            return(
                <div id="popbody" ref='pb'>
                  <div id="msg">
                    <p>请设置班级别名</p>
                    <p><input type="text" placeholder={this.props.data1.jxbbh} maxLength="20" onChange={(e)=>{this.setState({nickname:e.target.value})}}></input></p>
                  </div>
                  <div className="warning">别名会替换班级编号显示。</div>
                  <div id="popup_option">
                    <button id="popup_OK" ref={btn=>this.OK=btn}>确定</button>
                    <button id="popup_back" ref={btn=>this.back=btn}>取消</button>
                    {
                        this.props.data1.jxbbm != "" &&
                        <button id="popup_reset" ref={btn=>this.reset=btn}>重置</button>
                    }
                    
                  </div>
                </div>
              );
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

    let {type,data1,data2} = this.props;

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
                case 'setJxbNickname':
                    data1.jxbbm = this.state.nickname;
                    if(this.state.nickname == ""){
                        this.props.deleteJxbNickname(data1.jxbbh).then(result => {
                            if (result) {
                                let that = this;
                                Alert.open({
                                  alertTip: "输入为空，重置教学班编号！",
                                  closeAlert: function () {
                                    cancel_popup();
                                    that.props.searchCallback(data2);
                                  }
                                });
                            }
                            
                        })
                    }else{
                        this.props.callback(data1).then(result => {
                            if (result) {
                                Alert.open({
                                  alertTip: "成功设置别名！",
                                  closeAlert: function () {}
                                });
                                
                            }
                            
                        }).then(() => {
                            cancel_popup();
                            this.props.searchCallback(data2);
                        }).catch(e => {
                            if (e === 101) {
                                window.location.href = 'error1.html'
                            } else if (e === 102) {
                                window.location.href = 'error2.html'
                            }
                        });
                    }
                        
                     break;
            default:break;
        }
        
     
    });
    
    this.reset&&(this.reset.onclick=()=>{
        let jxbbh = this.props.data1.jxbbh;
        this.props.deleteJxbNickname(jxbbh).then(result => {
            if (result) {
                let that = this;
                Alert.open({
                  alertTip: "成功重置教学班编号！",
                  closeAlert: function () {
                    cancel_popup();
                    that.props.searchCallback(data2);
                  }
                });
            }
            
        })
    })
  }
}

function Creat_popup({type,callback,data1,searchCallback,data2,deleteJxbNickname}) {
  const popup=window.parent.document.getElementById('popup');
  const popup_datas={
    type,
    callback,
    data1,
    searchCallback,
    data2,
    deleteJxbNickname
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
    TopicReport: BluMUI_TopicReport,
    TopicAssistant: BluMUI_TopicAssistant
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
