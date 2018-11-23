
import React from 'react';
import ReactDOM from 'react-dom';
// import Alert from "../../util/alert.js";

import DateTime from 'react-datetime';
import moment from 'moment';
// 引入 echarts 主模块。
import * as echarts from 'echarts/lib/echarts';
// 引入饼状图和条形图。
import 'echarts/lib/chart/pie';

// 引入提示框组件、标题组件组件。
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/dataset';
import 'echarts/lib/component/visualMap';
import 'echarts/lib/component/dataZoom';
import 'echarts/lib/component/toolbox';



const ajax = require('../post_ajax.js');
const Fanye = require('../turnPage.js');
const DateInput = require('../../util/datebox.js');

const _Count = 15;
const SET = (key, value) => {
    sessionStorage.setItem("chart-" + key, value);
    return value;
};
const GET = (key) => {
    return sessionStorage.getItem("chart-" + key) || '';
};

class PieFilter extends React.Component {
    constructor(props) {
        super(props);
        this.format = 'YYYY-MM-DD';  //显示日期格式
        this.monthFormat = 'YYYY-MM';
        var nowDate = new Date();
        var oneYearDate = new Date(nowDate - 365 * 24 * 3600 * 1000);
        var defaultStart = moment(oneYearDate).format('YYYY-MM-DD 00:00:00');
        var defaultEnd = moment(nowDate).format('YYYY-MM-DD 23:59:59');

        this.wrapId = this.props.wrapId;  //图表外层id
        this.chartTitle = this.props.chartTitle; //图表名称
        this.callback = this.props.callback;

        this.state = {
            kssj: defaultStart,   //开始时间
            jssj: defaultEnd,   //结束时间
            type: this.props.type,   //wh:维护数据，sh：审核数据
            xm: this.props.xm || '',    //姓名
            xymc: this.props.xymc || '',  //学院名称
            lists: [],    //存储结果

            startDatebox: false,
            endDatebox: false,
        };
        this.showChart = this.showChart.bind(this);
        this.handleChange1 = this.handleChange1.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);
    }

    //向后台发送请求
    showChart() {
        var oDate1 = new Date(this.state.kssj);
        var oDate2 = new Date(this.state.jssj);
        if (oDate1.getTime() > oDate2.getTime()) {
            alert("开始时间应小于结束时间！");
            // Alert.open({
            //     alertTip: "开始时间应小于结束时间！"
            // });
        } else {
            //课程维护饼状图
            var datas = {
                unifyCode: getCookie("userId"),
                kssj: this.state.kssj,
                jssj: this.state.jssj,
                type: this.props.type,   //wh:维护数据，sh：审核数据
                txtype: 'tx',  //表现形式 tx:图形 tb:图表
                page: 0,
                count: _Count
            };
            //课程审核饼状图

            this.funAjax('getKcclWhFxData', datas, this.callback, this.wrapId, this.chartTitle);
        }
    }
    funAjax(url, Datas, callback, wrapId, chartTitle) {
        ajax({
            url: courseCenter.host + url,
            data: Datas,
            success: (gets) => {
                let datas = JSON.parse(gets);
                if (datas.meta.result === 100) {
                    this.setState({
                        lists: datas.data.rows
                    });
                }
                //调用回调函数绘制图表
                if (callback) {
                    callback(this.state.lists, wrapId, chartTitle);
                }
            }
        });
    }


    handleChange1(newDate) {
        var a = newDate._d;
        var date = moment(a).format('YYYY-MM-DD 00:00:00');
        return this.setState({ kssj: date });
    }

    handleChange2(newDate) {
        var a = newDate._d;
        var date = moment(a).format('YYYY-MM-DD 23:59:59');
        return this.setState({ jssj: date });
    }


    render() {
        return (<div className='filters'>
            <div className="top">

                <span>时间区间:</span>
                <div className="text" type="date">
                    <span className="timeText">{moment(this.state.kssj).format(this.format) || moment(new Date() - 365 * 24 * 3600 * 1000).format(this.format)}</span>
                    <span className="dateIcon" onClick={() => this.setState({ startDatebox: !this.state.startDatebox, endDatebox: false })}></span>
                    {
                        this.state.startDatebox &&
                        <DateInput time={new Date(moment(this.state.kssj).format(DateFormat.startTimeFormat))} isUpdateTime={{ h: false, f: false, s: false }} callback={(time) => this.setState({ kssj: time, startDatebox: false }, this.showChart)} />
                    }
                </div>
                <span> — </span>
                <div className="text" type="date">
                    <span className="timeText">{moment(this.state.jssj).format(this.format) || moment(new Date()).format(this.format)}</span>
                    <span className="dateIcon" onClick={() => this.setState({ endDatebox: !this.state.endDatebox, startDatebox: false })}></span>
                    {
                        this.state.endDatebox &&
                        <DateInput time={new Date(moment(this.state.jssj).format(DateFormat.endTimeFormat))} isUpdateTime={{ h: false, f: false, s: false }} callback={(time) => this.setState({ kssj: time, endDatebox: false }, this.showChart)} />
                    }
                </div>
                {/* <DateTime
                    className="inlineBlock"
                    dateFormat='YYYY-MM-DD'
                    timeFormat=''

                    defaultValue={moment(new Date() - 365 * 24 * 3600 * 1000).format(this.format)}
                    onChange={this.handleChange1}
                ></DateTime>
                <span> — </span>
                <DateTime
                    className="inlineBlock"
                    dateFormat='YYYY-MM-DD'
                    timeFormat=''
                    defaultValue={moment(new Date()).format(this.format)}
                    onChange={this.handleChange2}
                ></DateTime> */}

                <button id="search" onClick={this.showChart.bind(this, 1)}>查询</button>
            </div>
        </div>);
    }
    componentDidMount() {
        this.showChart(1);
    }
}

//表格筛选条件组件
class TableFilter extends React.Component {
    constructor(props) {
        super(props);
        this.format = 'YYYY-MM-DD';  //显示日期格式
        this.monthFormat = 'YYYY-MM';
        var nowDate = new Date();
        var oneYearDate = new Date(nowDate - 365 * 24 * 3600 * 1000);
        var defaultStart = moment(oneYearDate).format('YYYY-MM-DD 00:00:00');
        var defaultEnd = moment(nowDate).format('YYYY-MM-DD 23:59:59');

        this.wrapId = this.props.wrapId;  //图表外层id
        this.chartTitle = this.props.chartTitle; //图表名称
        // this.callback = this.props.callback;

        this.state = {
            kssj: defaultStart,   //开始时间
            jssj: defaultEnd,   //结束时间
            type: this.props.type,   //wh:维护数据，sh：审核数据
            txtype: 'tb',  //表现形式 tx:图形 tb:图表
            xm: this.props.xm || '',    //姓名
            xymc: this.props.xymc || '',  //学院名称
            list: [],    //存储结果
            page: 1,
            pages: 1,
            rows: 0,
            count: _Count,
            output: `unifyCode=${getCookie("userId")}`,
            startDatebox: false,
            endDatebox: false,
        };

        this.showChart = this.showChart.bind(this);
        this.handleChange1 = this.handleChange1.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);
        // this.funAjax = this.funAjax.bind(this);
        this.changeOutput = this.changeOutput.bind(this);
        this.key = this.key.bind(this);
    }

    changeOutput() {
        this.setState({
            output: `unifyCode=${getCookie("userId")}&lx=clwh&type=${this.state.type}&xm=${this.state.xm}&xymc=${this.state.xymc}&kssj=${this.state.kssj}&jssj=${this.state.jssj}`
        });

    }
    //向后台发送请求
    showChart() {
        var oDate1 = new Date(this.state.kssj);
        var oDate2 = new Date(this.state.jssj);
        if (oDate1.getTime() > oDate2.getTime()) {
            alert("开始时间应小于结束时间！");
            // Alert.open({
            //     alertTip: "开始时间应小于结束时间！"
            // });
        } else {
            this.changeOutput();
            this.refs.list.refresh(1, this.state);
        }
    }

    key(e) {
        if (e.keyCode == 13) {
            this.showChart();
        }
    }

    handleChange1(newDate) {
        var a = newDate._d;
        var date = moment(a).format('YYYY-MM-DD 00:00:00');
        return this.setState({ kssj: date });
    }

    handleChange2(newDate) {
        var a = newDate._d;
        var date = moment(a).format('YYYY-MM-DD 23:59:59');
        return this.setState({ jssj: date });
    }


    render() {
        return (
            <div>
                <div className='filters'>
                    <div className="top">

                        <span>时间区间:</span>
                        <div className="text" type="date">
                            <span className="timeText">{moment(this.state.kssj).format(this.format) || moment(new Date() - 365 * 24 * 3600 * 1000).format(this.format)}</span>
                            <span className="dateIcon" onClick={() => this.setState({ startDatebox: !this.state.startDatebox, endDatebox: false })}></span>
                            {
                                this.state.startDatebox &&
                                <DateInput time={new Date(moment(this.state.kssj).format(DateFormat.startTimeFormat))} isUpdateTime={{ h: false, f: false, s: false }} callback={(time) => this.setState({ kssj: time, startDatebox: false },this.showChart)} />
                            }
                        </div>
                        <span> — </span>
                        <div className="text" type="date">
                            <span className="timeText">{moment(this.state.jssj).format(this.format) || moment(new Date()).format(this.format)}</span>
                            <span className="dateIcon" onClick={() => this.setState({ endDatebox: !this.state.endDatebox, startDatebox: false })}></span>
                            {
                                this.state.endDatebox &&
                                <DateInput time={new Date(moment(this.state.jssj).format(DateFormat.endTimeFormat))} isUpdateTime={{ h: false, f: false, s: false }} callback={(time) => this.setState({ kssj: time, endDatebox: false },this.showChart)} />
                            }
                        </div>
                        {/* <DateTime
                            className="inlineBlock"
                            dateFormat='YYYY-MM-DD'
                            timeFormat=''

                            defaultValue={moment(new Date() - 365 * 24 * 3600 * 1000).format(this.format)}
                            onChange={this.handleChange1}
                        ></DateTime>
                        <span> — </span>
                        <DateTime
                            className="inlineBlock"
                            dateFormat='YYYY-MM-DD'
                            timeFormat=''
                            defaultValue={moment(new Date()).format(this.format)}
                            onChange={this.handleChange2}
                        ></DateTime> */}

                        {/* <span>学院:</span>
                        <select name="college" id="filter_college" ref="college" onChange={(eve) => { this.setState({ xymc: eve.target.value }) }}>
                            <option value="">请选择学院</option>
                        </select> */}
                        <span>所属单位:</span>
                        <input type="text" placeholder="请输入所属单位" onChange={(eve) => { this.setState({ xymc: eve.target.value }) }} onKeyDown={this.key} ></input>
                        <br />
                        <span>教师姓名:</span>
                        <input type="text" id="filter_name" placeholder="请输入教师姓名" ref="name" onChange={(eve) => { this.setState({ xm: eve.target.value }) }} onKeyDown={this.key} />
                        <button id="search" onClick={this.showChart.bind(this)}>查询</button>
                        <a className="output" href={courseCenter.host + "exportExcel?" + this.state.output}>导出</a>
                    </div>
                </div>
                <TableChart ref="list" options={this.state} />
            </div>

        );
    }
    componentDidMount() {
        this.showChart(1);
        // 获取学院
        // ajax({
        //     url: courseCenter.host + "getTjfxCollege",
        //     data: {
        //         unifyCode: getCookie("userId")
        //     },
        //     success: (gets) => {
        //         let datas = JSON.parse(gets);
        //         if (datas.meta.result == 100) {
        //             datas.data.map((e, index) => {
        //                 this.refs.college.innerHTML += `<option value=${e.kkxymc}>${e.kkxymc}</option>`;
        //             });
        //         }
        //     }
        // });
    }
}

class PieChart extends React.Component {
    constructor(props) {
        super(props);
        this.datas = this.props.datas;
        this.wrapId = this.props.wrapId;
        this.chartTitle = this.props.chartTitle;
        this.pieOption = this.pieOption.bind(this);
        this.draw = this.draw.bind(this);
    }

    //饼状图数据配置
    pieOption() {
        let datas = this.datas;
        let result = [];
        let head = ['学院名称', '操作数量'];//学院名称，点击数量
        result.push(head);
        datas.forEach((val) => {
            let item = [];
            item.push(val.xymc);
            item.push(val.djsl);
            result.push(item);
        });
        this.option = {
            title: {
                text: this.chartTitle,
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{c}</br> ({d}%)"
            },
            toolbox: {          //右上角工具栏，数据源、还原、下载
                feature: {
                    dataView: {
                        show: true,
                        readOnly: true,
                        optionToContent: function (opt) {
                            var datas = result;
                            var tableDom = document.createElement("table");
                            tableDom.style.cssText = "width:100%;border:1px solid #ccc;border-collapse: collapse;text-align:center";
                            var len1 = datas.length;
                            var len2 = datas[0].length;
                            var table = "";
                            for (var i = 0; i < len1; i++) {
                                var trContent = ""
                                for (var j = 0; j < len2; j++) {
                                    trContent += '<td style="border:1px solid #ccc;">' + datas[i][j] + '</td>'
                                }
                                table += '<tr>' + trContent + '</tr>'
                            }

                            tableDom.innerHTML = table;
                            return tableDom;
                        }

                    },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            legend: {
                bottom: 0,
                formatter: function (name) {
                    return echarts.format.truncateText(name, 40, '14px Microsoft Yahei', '…');
                },
                tooltip: {
                    show: true
                }
            },
            dataset: {
                source: result
            },
            series: [
                {
                    type: 'pie',
                    radius: 90,
                    center: ['50%', '50%'],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        },
                        normal: {
                            label: {
                                show: true,
                                formatter: '{c} ({d}%)'
                            },
                            labelLine: { show: true }
                        }
                    }
                }
            ]
        };
    }

    draw() {
        let chartDom = document.getElementById(this.wrapId);
        // let chartDom = React.createElement("div",{style:"width:600px;height:400px;"});
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(chartDom);
        myChart.showLoading({ text: '正在努力的读取数据中...' });
        this.pieOption();

        // 绘制图表
        myChart.setOption(this.option);
        myChart.hideLoading();
        return myChart;
    }

    render() {
        return (
            <div>
                {this.draw()}
            </div>
        )
    }
}

class TableChart extends React.Component {
    constructor(props) {
        super(props);
        let newState = {};
        for (let i in this.props.options) {
            newState[i] = this.props.options[i];
        }
        newState.list = [];
        this.state = newState;
        this.create_tbody = this.create_tbody.bind(this);
    }

    create_tbody() {
        let lists = [];
        this.state.list.forEach((e, index) => {
            lists.push(<tr key={index}>
                <td>{(this.state.page - 1) * _Count + index + 1}</td>
                <td>{e.xymc}</td>
                <td>{e.xm}</td>
                <td>{e.djsl}</td>
            </tr>);
        });
        return (<tbody>
            {lists}
        </tbody>);
    }

    refresh(page, { ...sets }) {
        // 未传第二个参数时sets为空对象{}
        // 判断sets是否为空（是否只是翻页）
        if (JSON.stringify(sets) !== "{}") {
            this.state = sets;
        }
        ajax({
            url: courseCenter.host + "getKcclWhFxData",
            data: {
                unifyCode: getCookie("userId"),
                kssj: this.state.kssj,
                jssj: this.state.jssj,
                type: this.state.type,   //wh:维护数据，sh：审核数据
                txtype: 'tb',  //表现形式 tx:图形 tb:图表
                xm: this.state.xm || '',    //姓名
                xymc: this.state.xymc || '',
                page: page,
                count: _Count
            },
            success: (gets) => {
                let datas = JSON.parse(gets);
                this.setState({
                    list: datas.data.rows,
                    page: page,
                    pages: datas.data.totalPages,
                    rows: datas.data.total
                });
            }
        });
    }

    render() {
        return (
            <div>
                <div className="table_wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>序号</th>
                                <th>所属单位</th>
                                <th>姓名</th>
                                <th>操作次数</th>
                            </tr>
                        </thead>
                        {this.create_tbody()}
                    </table>
                </div>
                <Fanye This={this}
                    options={{
                        page: this.state.page || 1,
                        pages: this.state.pages || 1,
                        rows: this.state.rows
                    }}
                    callback={this.refresh.bind(this)}
                />

            </div>

        )
    }

    componentDidMount() {
        ajax({
            url: courseCenter.host + "getKcclWhFxData",
            data: {
                unifyCode: getCookie("userId"),
                kssj: this.props.options.kssj,
                jssj: this.props.options.jssj,
                type: this.props.options.type,   //wh:维护数据，sh：审核数据
                txtype: 'tb',  //表现形式 tx:图形 tb:图表
                xm: this.props.options.xm || '',    //姓名
                xymc: this.props.options.xymc || '',
                page: 1,
                count: _Count
            },
            success: (gets) => {
                let datas = JSON.parse(gets);
                this.setState({
                    list: datas.data.rows,
                    page: 1,
                    pages: datas.data.totalPages,
                    rows: datas.data.total
                });
            }
        });
    }
}

var BluMUI_M = {
    BluMUI_PieFilter: PieFilter,
    BluMUI_TableFilter: TableFilter,
    BluMUI_PieChart: PieChart,
    BluMUI_TableChart: TableChart
}

var BluMUI = {
    result: {},
    menues: [],
    menue_names: {},
    create: function (data, type, elem) {
        var props = data, Blu = BluMUI_M[type];
        this.result[props.id] = ReactDOM.render(<Blu {...props} />, elem);
    }
};


export default BluMUI;
