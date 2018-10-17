
import React from 'react';
import ReactDOM from 'react-dom';


import DateTime from 'react-datetime';
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
    //var oneMonthDate = new Date(nowDate - 30 * 24 * 3600 * 1000);
    var defaultStart = moment(new Date('2017-01-01')).format('YYYY-MM-DD 00:00:00');
    var defaultEnd = moment(nowDate).format('YYYY-MM-DD 23:59:59');
    
    this.wrapId = this.props.wrapId;  //图表外层id
    this.chartTitle = this.props.chartTitle; //图表名称
    this.callback = this.props.callback;

    this.state = {
      kssj: defaultStart,   //开始时间
      jssj: defaultEnd,   //结束时间
      tjlb: '',   //统计类别
      type: this.props.type,   //筛选范围
      sstype: this.props.sstype,  //筛选对象
      lists: [],    //存储结果
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
    }


    //console.log(this.state);
    //老师饼状图
    var teaPie = {
      unifyCode: getCookie("userId"),
      kssj: this.state.kssj,
      jssj: this.state.jssj,
      tjlb: this.state.tjlb || '1',
      type: '1',
      sstype: '1',
    };
    //老师柱状图
    var teaBar = {
      unifyCode: getCookie("userId"),
      kssj: this.state.kssj,
      jssj: this.state.jssj,
      tjlb: this.state.tjlb || '1',
      type: '2',
      sstype: '1',
    };
    //老师折线图
    var teaLine = {
      unifyCode: getCookie("userId"),
      kssj: moment(this.state.kssj).format('YYYY-MM'),
      jssj: moment(this.state.jssj).format('YYYY-MM'),
      tjlb: this.state.tjlb || '1',
      type: '1',
    };
    //学生饼状图
    var stuPie = {
      unifyCode: getCookie("userId"),
      kssj: this.state.kssj,
      jssj: this.state.jssj,
      tjlb: this.state.tjlb || '1',
      type: '1',
      sstype: '2',
    };
    //学生柱状图
    var stuBar = {
      unifyCode: getCookie("userId"),
      kssj: this.state.kssj,
      jssj: this.state.jssj,
      tjlb: this.state.tjlb || '1',
      type: '2',
      sstype: '2',
    };
    //学生折线图
    var stuLine = {
      unifyCode: getCookie("userId"),
      kssj: moment(this.state.kssj).format('YYYY-MM'),
      jssj: moment(this.state.jssj).format('YYYY-MM'),
      tjlb: this.state.tjlb || '1',
      type: '1',
    };
    var len = this.wrapId.length;
    for(var i =0;i<len;i++){
      if(this.wrapId[i] == 'tea_pie_chart'){
        this.funAjax('getStatisticalData',teaPie,this.callback[i],this.wrapId[i],this.chartTitle[i]);
      }else if(this.wrapId[i] == 'tea_bar_chart'){
        this.funAjax('getStatisticalData',teaBar,this.callback[i],this.wrapId[i],this.chartTitle[i]);
      }else if(this.wrapId[i] == 'tea_line_chart'){
        this.funAjax('getYfTjData',teaLine,this.callback[i],this.wrapId[i],this.chartTitle[i]);
      }else if(this.wrapId[i] == 'stu_pie_chart'){
        this.funAjax('getStatisticalData',stuPie,this.callback[i],this.wrapId[i],this.chartTitle[i]);
      }else if(this.wrapId[i] == 'stu_bar_chart'){
        this.funAjax('getStatisticalData',stuBar,this.callback[i],this.wrapId[i],this.chartTitle[i]);
      }else if(this.wrapId[i] == 'stu_line_chart'){
        this.funAjax('getYfTjData',stuLine,this.callback[i],this.wrapId[i],this.chartTitle[i]);
      }
    }
    
  }
  funAjax(url,Datas,callback,wrapId,chartTitle){
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
       
        

        <span>统计类别:</span>
        <select name="tjlb" id="tjlb" defaultValue='1' onChange={(eve) => { this.setState({ tjlb: eve.target.value }); }}>
          <option value="1">登陆次数</option>
          <option value="2">操作次数</option>
        </select>
        <span>时间区间:</span>

        <DateTime
          className="inlineBlock"
          dateFormat='YYYY-MM-DD'
          timeFormat=''
         
          defaultValue = {moment(new Date("2017-01-01")).format(this.format)}
          onChange={this.handleChange1}
        ></DateTime>
        <span>—</span>
        <DateTime
          className="inlineBlock"
          dateFormat='YYYY-MM-DD'
          timeFormat=''  
          defaultValue = {moment(new Date()).format(this.format)}
          onChange={this.handleChange2}
        ></DateTime>

        <button id="search" onClick={this.showChart.bind(this, 1)}>查询</button>
      </div>
    </div>);
  }
  componentDidMount() {
    this.showChart(1);
  }
}
//筛选条件组件
class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.format = 'YYYY-MM-DD';  //显示日期格式
    var nowDate = new Date();
    //var oneMonthDate = new Date(nowDate - 30 * 24 * 3600 * 1000);
    var defaultStart = moment(new Date('2017-01-01')).format('YYYY-MM-DD 00:00:00');
    var defaultEnd = moment(nowDate).format('YYYY-MM-DD 23:59:59');
    
    this.wrapId = this.props.wrapId;  //图表外层id
    this.chartTitle = this.props.chartTitle; //图表名称

    this.state = {
      kssj: defaultStart,   //开始时间
      jssj: defaultEnd,   //结束时间
      tjlb: '',   //统计类别
      type: this.props.type,   //筛选范围
      sstype: this.props.sstype,  //筛选对象
      lists: [],    //存储结果
      typeText: '',   //筛选范围文字
      sstypeText: ''  //筛选对象文字 
    };
    this.showChart = this.showChart.bind(this);
    this.callback = this.props.callback.bind(this);
    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
  }

  //向后台发送请求
  showChart() {
    if (this.state.type == '1') {
      this.setState({
        typeText: '学院'
      });
    } else if (this.state.type == '2') {
      this.setState({
        typeText: '人'
      });
    }
    if (this.state.sstype == '1') {
      this.setState({
        sstypeText: '老师'
      });
    } else if (this.state.sstype == '2') {
      this.setState({
        sstypeText: '学生'
      });
    }

    var oDate1 = new Date(this.state.kssj);
    var oDate2 = new Date(this.state.jssj);
    if (oDate1.getTime() > oDate2.getTime()) {
      alert("开始时间应小于结束时间!");
    }


    //console.log(this.state);
    var Dates = {
      unifyCode: getCookie("userId"),
      kssj: this.state.kssj,
      jssj: this.state.jssj,
      tjlb: this.state.tjlb || '1',
      type: this.state.type,
      sstype: this.state.sstype,

    };

    ajax({
      url: courseCenter.host + "getStatisticalData",
      data: Dates,
      success: (gets) => {
        let datas = JSON.parse(gets);
        if (datas.meta.result === 100) {
          this.setState({
            lists: datas.data.rows
          });
        }
        //调用回调函数绘制图表
        if (this.callback) {
          this.callback(this.state.lists, this.wrapId, this.chartTitle);
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
       
        

        <span>统计类别:</span>
        <select name="tjlb" id="tjlb" defaultValue='1' onChange={(eve) => { this.setState({ tjlb: eve.target.value }); }}>
          <option value="1">登陆次数</option>
          <option value="2">操作次数</option>
        </select>
        <span>时间区间:</span>

        <DateTime
          className="inlineBlock"
          dateFormat='YYYY-MM-DD'
          //timeFormat='00:00:00'
         
          defaultValue = {moment(new Date("2017-01-01")).format(this.format)}
          onChange={this.handleChange1}
        ></DateTime>
        <span>—</span>
        <DateTime
          className="inlineBlock"
          dateFormat='YYYY-MM-DD'
          //timeFormat='00:00:00'  
          defaultValue = {moment(new Date()).format(this.format)}
          onChange={this.handleChange2}
        ></DateTime>

        <button id="search" onClick={this.showChart.bind(this, 1)}>查询</button>
      </div>
    </div>);
  }

  componentDidMount() {
    this.showChart(1);
  }
}

//筛选条件组件
class FilterLine extends React.Component {
  constructor(props) {
    super(props);
    this.format = 'YYYY-MM';  //日期格式
    var nowDate = new Date();
    var oneMonthDate = new Date(nowDate - 365 * 24 * 3600 * 1000);
    var defaultStart = moment(oneMonthDate).format(this.format);
    var defaultEnd = moment(nowDate).format(this.format);
    
    this.wrapId = this.props.wrapId;  //图表外层id
    this.chartTitle = this.props.chartTitle; //图表名称

    this.state = {
      kssj: defaultStart,   //开始时间
      jssj: defaultEnd,   //结束时间
      type: this.props.type,   //筛选范围
      lists: [],    //存储结果
      typeText: '',   //筛选范围文字
    };
    this.showChart = this.showChart.bind(this);
    this.callback = this.props.callback.bind(this);
    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
  }

  //向后台发送请求
  showChart() {
    if (this.state.type == '1') {
      this.setState({
        typeText: '老师'
      });
    } else if (this.state.type == '2') {
      this.setState({
        typeText: '学生'
      });
    }


    var oDate1 = new Date(this.state.kssj);
    var oDate2 = new Date(this.state.jssj);
    if (oDate1.getTime() > oDate2.getTime()) {
      alert("开始时间应小于结束时间!");
    }


    //console.log(this.state);
    var Dates = {
      unifyCode: getCookie("userId"),
      kssj: this.state.kssj,
      jssj: this.state.jssj,
      type: this.state.type,
    };

    ajax({
      url: courseCenter.host + "getYfTjData",
      data: Dates,
      success: (gets) => {
        let datas = JSON.parse(gets);
        if (datas.meta.result === 100) {
          this.setState({
            lists: datas.data.rows
          });
        }
        // this.state.lists.forEach((val, index) => {
        //   if (val.djsl != 0) {   //有非0值时
        //     //调用回调函数绘制图表
        //     if (this.callback) {
        //       this.callback(this.state.lists, this.wrapId, this.chartTitle);
        //     }
        //   }else if(index == this.state.lists.length-1 && val.djsl ==0){
        //     doucument.getElementById(this.wrapId).lastElementChild.innerHTML = "查询数据均为0！请重新输出查询条件！";
        //   }
        // })
        //调用回调函数绘制图表
        if (this.callback) {
          this.callback(this.state.lists, this.wrapId, this.chartTitle);
        }
      }
    });
  }


  handleChange1(newDate) {
    var a = newDate._d;
    var date = moment(a).format('YYYY-MM');
    return this.setState({ kssj: date });
  }

  handleChange2(newDate) {
    var a = newDate._d;
    var date = moment(a).format('YYYY-MM');
    return this.setState({ jssj: date });
  }


  render() {
    return (<div className='filters'>
      <div className="top">
        
        <span>时间区间:</span>
        <DateTime
          className="inlineBlock"
          dateFormat='YYYY-MM'
          //timeFormat='HH:mm:ss'
          defaultValue={moment(new Date() - 365 * 24 * 3600 * 1000).format(this.format)}
          onChange={this.handleChange1}
        ></DateTime>
        <span>—</span>
        <DateTime
          className="inlineBlock"
          dateFormat='YYYY-MM'
          //timeFormat='HH:mm:ss'
          defaultValue={moment(new Date()).format(this.format)}
          onChange={this.handleChange2}
        ></DateTime>

        <button id="search" onClick={this.showChart.bind(this, 1)}>查询</button>
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
    this.datas = this.props.datas;
    this.wrapId = this.props.wrapId;
    this.chartTitle = this.props.chartTitle;
    this.state = {
      type: this.props.type
    };
    this.pieOption = this.pieOption.bind(this);
    this.barOption = this.barOption.bind(this);
    this.lineOption = this.lineOption.bind(this);
    this.draw = this.draw.bind(this);
  }

  //饼状图数据配置
  pieOption() {
    let datas = this.datas;
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
              console.log(datas);
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




  //柱状图配置函数
  barOption() {
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
      xAxis: { name: '操作数' },
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
            x: '点击数量',
            // 将 "teacherName" 列映射到 Y 轴。
            y: '姓名'
          }
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
    let result = this.datas;
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
        }
      },
      toolbox: {          //右上角工具栏，数据源、还原、下载
        feature: {
          dataView: {
            show: true,
            readOnly: true,
            optionToContent: function (opt) {
              var datas = result;
              console.log(datas);
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
        name: '操作次数',
      },
      grid: {
        top: 120
      },
      //控制缩放
      dataZoom: [
        {
          type: 'slider',
          xAxisIndex: 0,
          filterMode: 'empty'
        },
        {
          type: 'slider',
          yAxisIndex: 0,
          filterMode: 'empty'
        },
        {
          type: 'inside',
          xAxisIndex: 0,
          filterMode: 'empty'
        },
        {
          type: 'inside',
          yAxisIndex: 0,
          filterMode: 'empty'
        }
      ],
      series: seriesArr
    }
  }

  draw() {
    let chartDom = document.getElementById(this.wrapId);
    // let chartDom = React.createElement("div",{style:"width:600px;height:400px;"});
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(chartDom);
    myChart.showLoading({ text: '正在努力的读取数据中...' });
    if (this.state.type == "bar") {
      this.barOption();
    } else if (this.state.type == "pie") {
      this.pieOption();
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


var BluMUI_M = {
  BluMUI_Filter: Filter,
  BluMUI_FilterLine: FilterLine,
  BluMUI_NewFilter:NewFilter,
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
