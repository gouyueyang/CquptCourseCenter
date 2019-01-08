
import React from 'react';
import ReactDOM from 'react-dom';


// import DateTime from 'react-datetime';
import moment from 'moment';
// 引入 echarts 主模块。
import * as echarts from 'echarts/lib/echarts';
// 引入饼状图和条形图。
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
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

const _COUNT = 10;


const SET = (key, value) => {
  sessionStorage.setItem("chart-" + key, value);
  return value;
};
const GET = (key) => {
  return sessionStorage.getItem("chart-" + key) || '';
};

class NewFilter extends React.Component {
  constructor(props) {
    super(props);
    this.format = 'YYYY-MM-DD';  //显示日期格式
    this.monthFormat = 'YYYY-MM';
    var nowDate = new Date();
    var oneYearDate = new Date(nowDate - 365 * 24 * 3600 * 1000);
    var defaultStart = moment(oneYearDate).format(DateFormat.startTimeFormat);
    var defaultEnd = moment(nowDate).format(DateFormat.endTimeFormat);

    this.wrapId = this.props.wrapId;  //图表外层id
    this.chartTitle = this.props.chartTitle; //图表名称
    this.callback = this.props.callback;

    this.state = {
      kssj: defaultStart,   //开始时间
      jssj: defaultEnd,   //结束时间
      tjlb: '',   //统计类别  1:登陆 2:操作
      type: this.props.type,   //筛选范围
      sstype: this.props.sstype,  //筛选对象
      lists: [],    //存储结果
      startDatebox: false,   //时间选择框显示控制
      endDateBox: false,
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
      alert("开始时间应小于结束时间!");
      return;
    }


    //console.log(this.state);
    //老师饼状图
    var teaPie1 = {
      unifyCode: getCookie("userId"),
      kssj: this.state.kssj,
      jssj: this.state.jssj,
      tjlb: '1',
      type: '1',
      sstype: '1',
    };
    var teaPie2 = {
      unifyCode: getCookie("userId"),
      kssj: this.state.kssj,
      jssj: this.state.jssj,
      tjlb: '2',
      type: '1',
      sstype: '1',
    };
    //老师柱状图
    var teaBar1 = {
      unifyCode: getCookie("userId"),
      kssj: this.state.kssj,
      jssj: this.state.jssj,
      tjlb: '1',
      type: '2',
      sstype: '1',
    };
    var teaBar2 = {
      unifyCode: getCookie("userId"),
      kssj: this.state.kssj,
      jssj: this.state.jssj,
      tjlb: '2',
      type: '2',
      sstype: '1',
    };
    //老师折线图
    var teaLine1 = {
      unifyCode: getCookie("userId"),
      kssj: moment(this.state.kssj).format('YYYY-MM'),
      jssj: moment(this.state.jssj).format('YYYY-MM'),
      tjlb: '1',         //统计类别 1 登陆，2操作
      type: '1',         //1 老师  2 学生
    };
    var teaLine2 = {
      unifyCode: getCookie("userId"),
      kssj: moment(this.state.kssj).format('YYYY-MM'),
      jssj: moment(this.state.jssj).format('YYYY-MM'),
      tjlb: '2',
      type: '1',
    };
    //学生饼状图
    var stuPie1 = {
      unifyCode: getCookie("userId"),
      kssj: this.state.kssj,
      jssj: this.state.jssj,
      tjlb: '1',
      type: '1',
      sstype: '2',
    };
    var stuPie2 = {
      unifyCode: getCookie("userId"),
      kssj: this.state.kssj,
      jssj: this.state.jssj,
      tjlb: '2',
      type: '1',
      sstype: '2',
    };
    //学生柱状图
    var stuBar1 = {
      unifyCode: getCookie("userId"),
      kssj: this.state.kssj,
      jssj: this.state.jssj,
      tjlb: '1',
      type: '2',
      sstype: '2',
    };
    var stuBar2 = {
      unifyCode: getCookie("userId"),
      kssj: this.state.kssj,
      jssj: this.state.jssj,
      tjlb: '2',
      type: '2',
      sstype: '2',
    };
    //学生折线图
    var stuLine1 = {
      unifyCode: getCookie("userId"),
      kssj: moment(this.state.kssj).format('YYYY-MM'),
      jssj: moment(this.state.jssj).format('YYYY-MM'),
      tjlb: '1',
      type: '2',
    };
    var stuLine2 = {
      unifyCode: getCookie("userId"),
      kssj: moment(this.state.kssj).format('YYYY-MM'),
      jssj: moment(this.state.jssj).format('YYYY-MM'),
      tjlb: '2',
      type: '2',
    };


    var len = this.wrapId.length;
    for (var i = 0; i < len; i++) {
      if (this.wrapId[i] == 'tea_pie_chart1') {
        this.funAjax('getStatisticalData', teaPie1, this.callback[i], this.wrapId[i], this.chartTitle[i]);
      } else if (this.wrapId[i] == 'tea_bar_chart1') {
        this.funAjax('getStatisticalData', teaBar1, this.callback[i], this.wrapId[i], this.chartTitle[i]);
      } else if (this.wrapId[i] == 'tea_line_chart1') {
        this.funAjax('getYfTjData', teaLine1, this.callback[i], this.wrapId[i], this.chartTitle[i]);
      } else if (this.wrapId[i] == 'tea_pie_chart2') {
        this.funAjax('getStatisticalData', teaPie2, this.callback[i], this.wrapId[i], this.chartTitle[i]);
      } else if (this.wrapId[i] == 'tea_bar_chart2') {
        this.funAjax('getStatisticalData', teaBar2, this.callback[i], this.wrapId[i], this.chartTitle[i]);
      } else if (this.wrapId[i] == 'tea_line_chart2') {
        this.funAjax('getYfTjData', teaLine2, this.callback[i], this.wrapId[i], this.chartTitle[i]);
      } else if (this.wrapId[i] == 'stu_pie_chart1') {
        this.funAjax('getStatisticalData', stuPie1, this.callback[i], this.wrapId[i], this.chartTitle[i]);
      } else if (this.wrapId[i] == 'stu_bar_chart1') {
        this.funAjax('getStatisticalData', stuBar1, this.callback[i], this.wrapId[i], this.chartTitle[i]);
      } else if (this.wrapId[i] == 'stu_line_chart1') {
        this.funAjax('getYfTjData', stuLine1, this.callback[i], this.wrapId[i], this.chartTitle[i]);
      } else if (this.wrapId[i] == 'stu_pie_chart2') {
        this.funAjax('getStatisticalData', stuPie2, this.callback[i], this.wrapId[i], this.chartTitle[i]);
      } else if (this.wrapId[i] == 'stu_bar_chart2') {
        this.funAjax('getStatisticalData', stuBar2, this.callback[i], this.wrapId[i], this.chartTitle[i]);
      } else if (this.wrapId[i] == 'stu_line_chart2') {
        this.funAjax('getYfTjData', stuLine2, this.callback[i], this.wrapId[i], this.chartTitle[i]);
      }
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
    var date = moment(a).format(DateFormat.startTimeFormat);
    return this.setState({ kssj: date });
  }

  handleChange2(newDate) {
    var a = newDate._d;
    var date = moment(a).format(DateFormat.endTimeFormat);
    return this.setState({ jssj: date });
  }


  render() {
    return (<div className='filters'>
      <div className="top">
        <div>
          <span>时间区间: </span>
          {/* <DateTime
            className="inlineBlock"
            dateFormat='YYYY-MM-DD'
            timeFormat=''
            defaultValue={moment(new Date() - 365 * 24 * 3600 * 1000).format(this.format)}
            onChange={this.handleChange1}
          ></DateTime> */}
          <div className="text" type="date">
            <span className="timeText">{moment(this.state.kssj).format(this.format) || moment(new Date() - 365 * 24 * 3600 * 1000).format(this.format)}</span>
            <span className="dateIcon" onClick={() => this.setState({ startDatebox: !this.state.startDatebox, endDatebox: false })}></span>
            {
              this.state.startDatebox &&
              <DateInput time={new Date(moment(this.state.kssj).format(DateFormat.startTimeFormat))} isUpdateTime={{ h: false, f: false, s: false }} callback={(time) => this.setState({ kssj: time, startDatebox: false },this.showChart)} />
            }
          </div>
          <span> — </span>
          {/* <DateTime
            className="inlineBlock"
            dateFormat='YYYY-MM-DD'
            timeFormat=''
            defaultValue={moment(new Date()).format(this.format)}
            onChange={this.handleChange2}
          ></DateTime> */}
          <div className="text" type="date">
            <span className="timeText">{moment(this.state.jssj).format(this.format) || moment(new Date()).format(this.format)}</span>
            <span className="dateIcon" onClick={() => this.setState({ endDatebox: !this.state.endDatebox, startDatebox: false })}></span>
            {
              this.state.endDatebox &&
              <DateInput time={new Date(moment(this.state.jssj).format(DateFormat.endTimeFormat))} isUpdateTime={{ h: false, f: false, s: false }} callback={(time) => this.setState({ jssj: time, endDatebox: false },this.showChart)} />
            }
          </div>
        </div>
        <div>
          <button id="search" onClick={this.showChart.bind(this, 1)}>查询</button>
        </div>
        <div>
          {
            this.wrapId.indexOf("tea_pie_chart1") > -1 &&
            <button id="showMore" onClick={() => { Creat_popup('showMore', '', "tea") }}>查看教师详细排名</button>
          }
          {
            this.wrapId.indexOf("stu_pie_chart1") > -1 &&
            <button id="showMore" onClick={() => { Creat_popup('showMore', '', "stu") }}>查看学生详细排名</button>
          }
        </div>
      </div>
    </div>);
  }
  componentDidMount() {
    this.showChart(1);
  }
}


class Item extends React.Component {
  constructor(props) {
    super(props);

    this.wrapId = this.props.wrapId;
    this.chartTitle = this.props.chartTitle;
    this.state = {
      type: this.props.type,
      datas: this.props.datas
    };
    this.pieOption = this.pieOption.bind(this);
    this.leftBarOption = this.leftBarOption.bind(this);
    this.rightBarOption = this.rightBarOption.bind(this);
    this.lineOption = this.lineOption.bind(this);
    this.draw = this.draw.bind(this);
  }

  //饼状图数据配置
  pieOption() {
    let datas = this.state.datas;
    let result = [];
    let head = ['学院名称', '点击数量'];//学院名称，点击数量
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
        formatter: "{c} ({d}%)"
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

  //左侧柱状图配置函数
  leftBarOption() {
    // let Data = Object.assign([],this.state.datas);
    // Data.filter((item) => { return item.type == 'xy' });
    // console.log(Data);
    let Data = this.state.datas;
    let max = Data[0].djsl;
    let min = Data[Data.length - 1].djsl;
    let result = [];
    let head = ['学院名称', '点击数量'];//学院名称，点击数量
    result.push(head);
    Data.forEach(val => {
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
      grid: {
        left: 60,
        bottom: 100
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
      xAxis: {
        name: '学院',
        type: 'category',
        axisLabel: {
          interval: 0,
          rotate: 40,
          formatter: function (name) {
            return echarts.format.truncateText(name, 100, '14px Microsoft Yahei', '…');
          }
        }
      },
      yAxis: {
        name: '次数',
      },
      visualMap: {
        orient: 'horizontal',
        left: 'center',
        min: min,
        max: max,
        text: [max, min],
        // Map the amount column to color
        dimension: 1,
        inRange: {
          color: ['#D7DA8B', '#E15457']
        }
      },
      series: [
        {
          type: 'bar',
          encode: {
            // 将 "学院名称" 列映射到 X 轴。
            x: '学院名称',
            // 将 "点击数量" 列映射到 Y 轴。
            y: '点击数量'
          },
          itemStyle: {
            normal: {
              label: {
                show: false, //开启显示
                position: 'top', //在上方显示
                textStyle: { //数值样式
                  color: 'black',
                  fontSize: 14
                }
              }
            }
          },

        }
      ]
    };
  }


  //右侧柱状图配置函数
  rightBarOption() {
    this.datas = this.state.datas;
    let max = this.datas[0].djsl;
    let min = this.datas[this.datas.length - 1].djsl;
    let datas = this.datas.reverse();
    let result = [];
    let head = ['姓名', '学院名称', '点击数量'];//姓名，学院名称，点击数量
    result.push(head);
    datas.forEach(val => {
      let item = [];
      item.push(val.xm);
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
      xAxis: { name: '次数' },
      yAxis: {
        name: '姓名',
        type: 'category'
      },
      visualMap: {
        orient: 'horizontal',
        left: 'center',
        min: min,
        max: max,
        text: [max, min],
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
            x: '点击数量',
            // 将 "teacherName" 列映射到 Y 轴。
            y: '姓名'
          },
          itemStyle: {
            normal: {
              label: {
                show: true, //开启显示
                position: 'right', //在上方显示
                textStyle: { //数值样式
                  color: 'black',
                  fontSize: 14
                }
              }
            }
          },
        }
      ]
    };
  }



  //折线图配置
  lineOption() {
    // let result = [
    //   ['month', 'a', 'b', 'c'],
    //   ['2015/1', 43.3, 85.8, 93.7],
    //   ['2015/2', 83.1, 73.4, 55.1],
    //   ['2015/3', 86.4, 65.2, 82.5],
    //   ['2015/4', 72.4, 53.9, 39.1]
    // ];
    let result = this.state.datas;
    let len = result[0].length;
    let seriesArr = [];
    for (let i = 0; i < len - 1; i++) {
      seriesArr.push({ type: 'line', smooth: true });
    }

    this.option = {
      title: {
        text: this.chartTitle,
        x: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        formatter: function (params) {
          var arr = [];
          var paramsLen = params.length;
          for (let i = 0; i < paramsLen; i++) {
            arr.push({
              name: params[i].seriesName,
              value: params[i].data[i + 1]
            })
          }
          //由对象构成的数组依照某一对象属性的排序函数
          var myOrder = function (arr, orderType, property) {
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

          var newarr = myOrder(arr, 'big_to_small', 'value');

          var len = newarr.length;
          var res = '<div><p>时间：' + params[0].name + '</p></div>'
          for (let i = 0; i < len; i++) {
            res += '<p>' + newarr[i].name + ':' + newarr[i].value + '</p>'
          }
          return res;
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
        top: 30,
        formatter: function (name) {
          return echarts.format.truncateText(name, 40, '14px Microsoft Yahei', '…');
        },
      },
      dataset: {
        source: result
      },
      xAxis: {
        name: '日期',
        type: 'category',
        boundaryGap: false,
      },
      yAxis: {
        name: '次数',
      },
      grid: {
        top: 120,
        left: 60,
        right: 60
      },
      //控制缩放
      dataZoom: [
        {
          type: 'slider',
          xAxisIndex: 0,
          filterMode: 'empty'
        },
        // {
        //   type: 'slider',
        //   yAxisIndex: 0,
        //   filterMode: 'empty'
        // },
        {
          type: 'inside',
          xAxisIndex: 0,
          filterMode: 'empty'
        },
        // {
        //   type: 'inside',
        //   yAxisIndex: 0,
        //   filterMode: 'empty'
        // }
      ],
      series: seriesArr
    }
  }

  draw() {
    let chartDom = document.getElementById(this.wrapId);
    // let chartDom = React.createElement("div",{style: "width:600px;height:400px;"});
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(chartDom);
    myChart.showLoading({ text: '正在努力的读取数据中...' });
    if (this.state.type == "bar") {
      this.rightBarOption();
    } else if (this.state.type == "pie") {
      this.leftBarOption();
    } else if (this.state.type == "line") {
      this.lineOption();
    }
    myChart.hideLoading();
    // 绘制图表
    myChart.setOption(this.option);
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

class PopupList extends React.Component {
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
        <td>{(this.state.page - 1) * _COUNT + index + 1}</td>
        <td>{e.xm}</td>
        <td>{e.SFRZH}</td>
        <td>{e.xymc}</td>
        <td>{e.djsl}</td>
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
      url: courseCenter.host + "getMoreData",
      data: {
        unifyCode: getCookie("userId"),
        kssj: this.state.kssj,
        jssj: this.state.jssj,
        tjlb: this.state.tjlb,
        pxtype: this.state.pxtype,
        sstype: this.state.sstype == 'tea' ? 1 : 2,
        xm: this.state.xm,
        xymc: this.state.xymc,
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
    return (<div id="top10_tableWrap">
      <div id="top10_table">
        <table>
          <thead>
            <tr>
              <th>序号</th>
              <th>姓名</th>

              <th>身份认证号</th>
              {
                this.state.sstype == 'tea' &&
                <th>单位</th>
              }
              {
                this.state.sstype == 'stu' &&
                <th>学院</th>
              }
              <th>点击次数</th>
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
      url: courseCenter.host + "getMoreData",
      data: {
        unifyCode: getCookie("userId"),
        kssj: this.props.options.kssj,
        jssj: this.props.options.jssj,
        tjlb: this.props.options.tjlb,
        pxtype: this.props.options.pxtype,
        sstype: this.props.options.sstype == 'tea' ? 1 : 2,
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
}

class PopupBody extends React.Component {
  constructor(props) {
    super(props);
    this.format = 'YYYY-MM-DD';  //显示日期格式
    var nowDate = new Date();
    var oneYearDate = new Date(nowDate - 365 * 24 * 3600 * 1000);
    var defaultStart = moment(oneYearDate).format('YYYY-MM-DD 00:00:00');
    var defaultEnd = moment(nowDate).format('YYYY-MM-DD 23:59:59');

    this.state = {
      kssj: defaultStart,
      jssj: defaultEnd,
      tjlb: 1,     //:统计类别（String）1登录次数，2：操作次数必填
      pxtype: 'desc',  //desc 降序  asc:升序
      sstype: this.props.sstype,    //1:老师 2：学生必填
      xm: '',      //姓名
      xymc: '',    //学院名称
      startDatebox: false,
      endDatebox: false,

      lists: [],    //存储结果
      page: 1,
      pages: 1,
      rows: 0,
    };
    this.showChart = this.showChart.bind(this);
    this.changeOutput = this.changeOutput.bind(this);
    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.key = this.key.bind(this);
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

  changeOutput() {
    this.setState({
      output: `unifyCode=${getCookie("userId")}&kssj=${this.state.kssj}&jssj=${this.state.jssj}&tjlb=${this.state.tjlb}&pxtype=${this.state.pxtype}&sstype=${this.state.sstype}&xm=${this.state.xm}&xymc=${this.state.xymc}`
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
    return (
      <div>
        <div>
          <div className='filters'>
            <div className="top">
              <div>
                <span>统计类别:</span>
                <select name="tjlb" id="tjlb" defaultValue='1' onChange={(eve) => { this.setState({ tjlb: eve.target.value }, this.showChart); }}>
                  <option value="1">登陆次数</option>
                  <option value="2">操作次数</option>
                </select>
              </div>
              <div>
                <span>时间区间: </span>
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
                    <DateInput time={new Date(moment(this.state.jssj).format(DateFormat.endTimeFormat))} isUpdateTime={{ h: false, f: false, s: false }} callback={(time) => this.setState({ jssj: time, endDatebox: false }, this.showChart)} />
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
                ></DateTime>
              </div> */}
                {/* <div>
                <span>身份:</span>
                <select name="'sstype" id="sstype" defaultValue="1" onChange={(eve) => { this.setState({ sstype: eve.target.value }); }}>
                  <option value="1">教师</option>
                  <option value="2">学生</option>
                </select>*/}
              </div>
              <div>
                <span>排序类型:</span>
                <select name="'pxtype" id="pxtype" defaultValue="desc" onChange={(eve) => { this.setState({ pxtype: eve.target.value }, this.showChart); }}>
                  <option value="desc">降序</option>
                  <option value="asc">升序</option>
                </select>
              </div>
              {
                this.props.sstype == 'tea' &&
                <div>
                  <span>单位:</span>
                  <input type="text" id="filter_dw" placeholder="请输入单位名称" ref="dwName" onChange={(eve) => { this.setState({ xymc: eve.target.value }) }} onKeyDown={this.key} />
                </div>
              }
              {
                this.props.sstype == 'stu' &&
                <div>
                  <span>学院:</span>
                  <select name="college" id="filter_college" ref="college" onChange={(eve) => { this.setState({ xymc: eve.target.value }, this.showChart) }}>
                    <option value="">请选择学院</option>
                  </select>
                </div>
              }

              <div>
                <span>姓名:</span>
                <input type="text" id="filter_name" placeholder="请输入姓名" ref="name" onChange={(eve) => { this.setState({ xm: eve.target.value }) }} onKeyDown={this.key} />
              </div>
              <div>
                <button id="search" onClick={this.showChart.bind(this, 1)}>查询</button>
                <a className="output" href={courseCenter.host + "exportMoreData?" + this.state.output}>导出</a>
              </div>
            </div>
          </div>
        </div>
        <PopupList ref="list" options={this.state} />
      </div>
    )

  }

  componentDidMount() {
    this.showChart(1);
    // 获取学院
    if (this.props.sstype == 'stu') {
      ajax({
        url: courseCenter.host + "selectXsXymc",
        data: {
          unifyCode: getCookie("userId")
        },
        success: (gets) => {
          let datas = JSON.parse(gets);
          if (datas.meta.result == 100) {
            datas.data.map((e, index) => {
              this.refs.college.innerHTML += `<option value=${e.xymc}>${e.xymc}</option>`;
            });
          }
        }
      });
    }
  }
}
class Popup extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { type, sstype } = this.props;

    switch (type) {
      case 'showMore':
        return (
          <div id="popbody" ref="pb" className = {sstype == 'tea'?'teaPopup':'stuPopup'}>
            <PopupBody sstype={sstype}/>
            <div><button id="popup_back" ref={btn => this.back = btn}>关闭</button></div>
          </div>
        );
        break;
      default:
        return (<div></div>);
        break;
    }
  }

  componentDidMount() {
    // background click to cancel
    // this.refs.pb.onclick = e => e.stopPropagation();

    // back button click to cancel
    this.back && (this.back.onclick = cancel_popup);
    // OK button option

  }
}

function Creat_popup(type, id, sstype) {
  const popup = document.getElementById('popup');
  const popup_datas = {
    type: type,
    id: id,
    sstype: sstype
  };
  ReactDOM.render(
    <Popup {...popup_datas} />,
    document.getElementById('popup')
  );
  // click to close popup
  popup.style.display = "block";
  // popup.onclick = cancel_popup;
}

function cancel_popup() {
  let popup = document.getElementById('popup');
  popup.style.display = "none";
  ReactDOM.unmountComponentAtNode(popup);
}

var BluMUI_M = {
  // BluMUI_Filter: Filter,
  // BluMUI_FilterLine: FilterLine,
  BluMUI_NewFilter: NewFilter,
  BluMUI_Item: Item
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
