
import React from 'react';
import ReactDOM from 'react-dom';


import DateTime from 'react-datetime';
import moment from 'moment';
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

const ajax = require('../post_ajax.js');
const SET = (key, value) => {
  sessionStorage.setItem("chart-" + key, value);
  return value;
};
const GET = (key) => {
  return sessionStorage.getItem("chart-" + key) || '';
};



//筛选条件组件
class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.format = 'YYYY-MM-DD HH:mm:ss';  //日期格式
    var nowDate = new Date();
    var oneMonthDate = new Date(nowDate - 30 * 24 * 3600 * 1000);
    var defaultStart = moment(oneMonthDate).format(this.format);
    var defaultEnd = moment(nowDate).format(this.format);
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
    
    
    console.log(this.state);
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
    var date = moment(a).format('YYYY-MM-DD HH:mm:ss');
    return this.setState({ kssj: date }); 
  }

  handleChange2(newDate) {
    var a = newDate._d;
    var date = moment(a).format('YYYY-MM-DD HH:mm:ss');
    return this.setState({ jssj: date });
  }


  render() {
    return (<div className='filters'>
      <div className="top">
        <span>统计{this.state.typeText}&nbsp;&nbsp;</span>

        <span>目标:{this.state.sstypeText}&nbsp;&nbsp;</span>

        <span>统计类别:</span>
        <select name="tjlb" id="tjlb" defaultValue='1' onChange={(eve) => { this.setState({ tjlb: eve.target.value });}}>
          <option value="1">登陆次数</option>
          <option value="2">操作次数</option>
        </select>
        <span>时间区间:</span>

        <DateTime
          className="inlineBlock"
          dateFormat = 'YYYY-MM-DD'
          timeFormat = 'HH:mm:ss'
          defaultValue={moment(new Date() - 30 * 24 * 3600 * 1000).format(this.format)}
          onChange={this.handleChange1}
        ></DateTime>
        <span> —— </span>
        <DateTime
          className="inlineBlock"
          dateFormat = 'YYYY-MM-DD'
          timeFormat = 'HH:mm:ss'
          defaultValue={moment(new Date()).format(this.format)}
          onChange={this.handleChange2}
        ></DateTime>

        <button id="search" onClick={this.showChart.bind(this, 1)}>展示结果</button>
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
  }

  //饼状图数据配置
  pieOption() {
    let datas = this.datas;
    let result = [];
    let head = ['collegeName', 'amount'];//学院名称，点击数量
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
      legend: {
        top: 30,
      },
      dataset: {
        source: result
      },
      series: [
        {
          type: 'pie',
          radius: 150,
          center: ['50%', '60%'],
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
    let head = ['name', 'collegeName', 'amount'];//姓名，学院名称，点击数量
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
      legend: {},
      dataset: {
        source: result
      },
      xAxis: { name: '操作次数' },
      yAxis: {
        name: '姓名',
        type: 'category'
      },
      visualMap: {
        orient: 'horizontal',
        left: 'center',
        min: min,
        max: max,
        text: ['High Amount', 'Low Amount'],
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
            x: 'amount',
            // 将 "teacherName" 列映射到 Y 轴。
            y: 'name'
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
    if (this.state.type == "bar") {
      this.barOption();
    } else if (this.state.type == "pie") {
      this.pieOption();
    }
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
  BluMUI_Item: Item,
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
