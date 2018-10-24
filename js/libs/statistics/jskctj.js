
import React from 'react';
import ReactDOM from 'react-dom';

// 引入 echarts 主模块。
import * as echarts from 'echarts/lib/echarts';
// 引入饼状图和条形图。
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/bar';
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
var _COUNT = 10;
const SET = (key, value) => {
    sessionStorage.setItem("chart-" + key, value);
    return value;
};
const GET = (key) => {
    return sessionStorage.getItem("chart-" + key) || '';
};

class Top10Filter extends React.Component {
    constructor(props) {
        super(props);
        this.wrapId = this.props.wrapId;  //图表外层id
        this.chartTitle = this.props.chartTitle; //图表名称
        this.callback = this.props.callback;

        this.state = {
            lx: 'fzr',      //fzr:负责人    rkjs:任课教师
            lists: []    //存储结果
        };
        this.showChart = this.showChart.bind(this);
    }

    //向后台发送请求
    showChart() {
        //请求数据
        let top10Bar = {
            unifyCode: getCookie("userId"),
            lx: this.state.lx
        }


        ajax({
            url: courseCenter.host + "selectJsKcData",
            data: top10Bar,
            success: (gets) => {
                let datas = JSON.parse(gets);
                if (datas.meta.result === 100) {
                    this.setState({
                        lists: datas.data.rows
                    });
                }
                //调用回调函数绘制图表
                this.callback(this.state.lists, this.wrapId, this.chartTitle);
            }
        });
    }


    render() {
        return (<div className='filters'>
            <div className="top">
                <span>排名类型:</span>
                <select name="tjlb" id="tjlb" defaultValue="" onChange={(eve) => { this.setState({ lx: eve.target.value }); }}>
                    <option value="">请选择</option>
                    <option value="fzr">负责人</option>
                    <option value="rkjs">任课教师</option>
                </select>
                <button id="search" onClick={this.showChart.bind(this)}>查询</button>
                <button>查看更多</button>
            </div>
        </div>);
    }
    componentDidMount() {
        this.showChart();
    }
}
//筛选条件组件
class KclbFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            xm: '',      //姓名
            xymc: '',    //学院名称
            lx: '',     //fzr:负责人    rkjs:任课教师
            lists: [],    //存储结果
            page: 1,
            pages: 1,
            rows: 0,
        };
        this.showChart = this.showChart.bind(this);
        this.changeOutput = this.changeOutput.bind(this);
    }

    //向后台发送请求
    showChart(p) {
        this.changeOutput();
        this.refs.list.refresh(1, this.state);
        
    }

    changeOutput() {
        this.setState({
            output: `unifyCode=${getCookie("userId")}&lx=drkc&type=${this.state.lx}&xm=${this.state.xm}&xymc=${this.state.xymc}`
        });
    }

    render() {
        return (
            <div>
                <div className='tea_course_filter'>
                    <div className='filters'>
                        <div className="top">

                            <span>排名类型:</span>
                            <select name="tjlb" id="tjlb" defaultValue="" onChange={(eve) => { this.setState({ lx: eve.target.value }); }}>
                                <option value="">请选择</option>
                                <option value="fzr">负责人</option>
                                <option value="rkjs">任课教师</option>
                            </select>
                            <span>学院:</span>
                            <select name="college" id="filter_college" ref="college" onChange={(eve) => { this.setState({ xymc: eve.target.value }) }}>
                                <option value="">请选择学院</option>
                            </select>
                            <span>教师姓名:</span>
                            <input type="text" id="filter_name" placeholder="请输入教师姓名" ref="name" onChange={(eve) => { this.setState({ xm: eve.target.value }) }} />
                            
                            <button id="search" onClick={this.showChart.bind(this, 1)}>查询</button>
                            <a className="output" href={courseCenter.host + "exportExcel?" + this.state.output}>导出</a>
                        </div>
                    </div>
                </div>
                <div className='tea_course_table'>
                    <Lists ref="list" options={this.state} />
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.showChart(1);
        // 获取学院
        ajax({
            url: courseCenter.host + "getCollege",
            data: {
                unifyCode: getCookie("userId")
            },
            success: (gets) => {
                let datas = JSON.parse(gets);
                if (datas.meta.result == 100) {
                    datas.data.map((e, index) => {
                        this.refs.college.innerHTML += `<option value=${e.kkxymc}>${e.kkxymc}</option>`;
                    });
                }
            }
        });
    }
}



class Item extends React.Component {
    constructor(props) {
        super(props);
        this.datas = this.props.datas;
        this.wrapId = this.props.wrapId;
        this.chartTitle = this.props.chartTitle;
        this.state = {
            type: this.props.type
        };
        this.pieOption = this.pieOption.bind(this);
        this.barOption = this.barOption.bind(this);
        this.draw = this.draw.bind(this);
        this.myOrder = this.myOrder.bind(this);
    }

    //饼状图数据配置
    pieOption() {
        let datas = this.datas;
        let result = [];
        let head = ['学院名称', '课程数量', '学院号'];//学院名称，数量
        result.push(head);
        datas.forEach((val) => {
            let item = [];
            item.push(val.xymc);
            item.push(val.kcsl);
            item.push(val.xyh);
            result.push(item);
        });
        this.option = {
            title: {
                text: this.chartTitle,
                x: 'center',
                top: 20
            },
            tooltip: {
                trigger: 'item',
                //formatter: "{c} ({d}%)"
                formatter: function (a) {
                    return (
                        `学院名称:${a.value[0]}</br>
                        课程数量:${a.value[1]}</br>
                        学院号:${a.value[2]}</br>
                        百分比:${a.percent}%`
                    )
                }
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
                    radius: 100,
                    center: ['50%', '50%'],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
    }

    //子类饼状图数据配置
    subpieOption() {
        let datas = this.datas;
        let result = [];
        let head = ['教研室名称', '课程数量', '教研室号'];//学院名称，数量
        result.push(head);
        datas.forEach((val) => {
            let item = [];
            item.push(val.jysmc);
            item.push(val.kcsl);
            item.push(val.jysh);
            result.push(item);
        });
        this.option = {
            title: {
                text: this.chartTitle,
                x: 'center',
                top: 20
            },
            tooltip: {
                trigger: 'item',
                // formatter: "{c} ({d}%)"
                formatter: function (a) {
                    return (
                        `教研室名称:${a.value[0]}</br>
                        课程数量:${a.value[1]}</br>
                        教研室号:${a.value[2]}</br>
                        百分比:${a.percent}%`
                    )
                }
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
                    radius: 100,
                    center: ['50%', '50%'],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
    }

    //由对象构成的数组依照某一对象属性的排序函数
    myOrder(arr, orderType, property) {
        var compare = function (property) {
            return function (a, b) {
                var value1 = a[property];
                var value2 = b[property];
                if (orderType == 'small_to_big') {
                    return value1 - value2;
                } else if (orderType == 'big_to_small') {
                    return value2 - value1;
                }
            }
        };
        return arr.sort(compare(property));
    };


    //柱状图配置函数
    barOption() {
        let datas = this.myOrder(this.datas, 'small_to_big', 'kcsl')
        let max = datas[this.datas.length - 1].kcsl;
        let min = datas[0].kcsl;
        let result = [];
        let head = ['姓名', '学院名称', '课程数量'];//姓名，学院名称，课程数量
        result.push(head);
        datas.forEach(val => {
            let item = [];
            item.push(val.xm);
            item.push(val.xymc);
            item.push(val.kcsl);
            result.push(item);
        });
        this.option = {
            title: {
                text: this.chartTitle,
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{c}"
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
            legend: {},
            dataset: {
                source: result
            },
            xAxis: { name: '课程数' },
            yAxis: {
                name: '姓名',
                type: 'category'
            },
            visualMap: {
                orient: 'horizontal',
                left: 'center',
                min: min,
                max: max,
                text: ['高', '低'],
                // Map the amount column to color
                dimension: 2,
                inRange: {
                    color: ['#D7DA8B', '#E15457']
                }
            },
            series: [
                {
                    type: 'bar',
                    encode: {
                        // 将 "amount" 列映射到 X 轴。
                        x: '课程数量',
                        // 将 "teacherName" 列映射到 Y 轴。
                        y: '姓名'
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
        if (this.state.type == "bar") {
            this.barOption();
            // 绘制图表
            myChart.setOption(this.option, true);
        } else if (this.state.type == "pie") {
            this.pieOption();
            // 绘制图表
            myChart.setOption(this.option);
            myChart.on('click', function (params) {
                let xyh = params.data[2];
                let xymc = params.data[0];
                ajax({
                    url: courseCenter.host + "getJyskcDataByXyh",
                    data: {
                        unifyCode: getCookie("userId"),
                        xyh: xyh
                    },
                    success: (gets) => {
                        let datas = JSON.parse(gets);
                        if (datas.meta.result === 100) {
                            document.querySelector("#department_course_pie").style.display = "block";
                            let lists = datas.data.rows;
                            BluMUI.create({
                                id: "department_course_pie",
                                datas: lists,
                                type: "subpie",
                                wrapId: "department_course_pie",
                                chartTitle: `${xymc}各教研室课程统计`
                            },
                                'BluMUI_Item',
                                document.getElementById("department_course_pie")
                            );
                            //调用回调函数绘制图表
                            pieCallback(lists, 'college_course_pie', "各学院课程数统计");
                        }
                    }
                });

            });
        } else if (this.state.type == 'subpie') {
            this.subpieOption();
            // 绘制图表
            myChart.setOption(this.option);
        }


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

class Lists extends React.Component {
    constructor(props) {
        super(props);
        let newState = {};
        for (let i in this.props.options) {
            newState[i] = this.props.options[i];
        }
        newState.lists = [];
        this.state = newState;
    }

    create_list() {
        let tds = [];
        this.state.lists.map((e, index) => {
            tds.push(<tr key={index}>
                <td>{(this.state.page-1)*_COUNT+index + 1}</td>
                <td>{e.xm}</td>
                <td>{e.xymc}</td>
                <td>{e.kcbh}</td>
                <td>{e.kcmc}</td>
                <td>{e.jslx}</td>
            </tr>);
        });
        return (<tbody>{tds}</tbody>);
    }

    refresh(page, { ...sets }) {
        // 未传第二个参数时sets为空对象{}
        // 判断sets是否为空（是否只是翻页）
        if (JSON.stringify(sets) !== "{}") {
            this.state = sets;
        }
        ajax({
            url: courseCenter.host + "selectMgJsKcData",
            data: {
                unifyCode: getCookie("userId"),
                xm: this.state.xm,
                xymc: this.state.xymc,
                lx: this.state.lx,
                page: page,
                count: _COUNT

            },
            success: (gets) => {
                let datas = JSON.parse(gets);
                this.setState({
                    lists: datas.data.rows,
                    page: page,
                    pages: datas.data.totalPages,
                    rows: datas.data.total
                });
            }
        });
    }

    render() {
        return (<div id="kczttj_lists">
            <div id="kczttj_table">
                <table>
                    <thead>
                        <tr>
                            <th>序号</th>
                            <th>教师姓名</th>
                            <th>学院名称</th>
                            <th>课程编号</th>
                            <th>课程名称</th>
                            <th>角色</th>
                        </tr>
                    </thead>
                    {this.create_list()}
                </table>
            </div>
            <Fanye This={this}
                options={{
                    page: this.state.page || 1,
                    pages: this.state.pages || 1,
                    rows: this.state.rows || 0
                }}
                callback={this.refresh.bind(this)}
            />
        </div>);
    }

    componentDidMount() {
        ajax({
            url: courseCenter.host + "selectMgJsKcData",
            data: {
                unifyCode: getCookie("userId"),
                lx: this.props.options.lx,
                xm: this.props.options.xm,
                xymc: this.props.options.xymc,
                page: this.props.options.page,
                count: _COUNT
            },
            success: (gets) => {
                let datas = JSON.parse(gets);
                let total = datas.data.total;
                this.datas = datas.data.rows;
                this.setState({
                    lists: datas.data.rows,
                    pages: datas.data.totalPages,
                    rows: total
                });
            }
        });
    }

    componentDidUpdate() {
        // 设置该frame的高度自适应
        if (window.frameElement) {
            window.frameElement.height = document.body.offsetHeight;
        }
    }
}

var BluMUI_M = {
    BluMUI_Top10Filter: Top10Filter,
    BluMUI_KclbFilter: KclbFilter,
    BluMUI_Item: Item,
    BluMUI_Lists: Lists
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
