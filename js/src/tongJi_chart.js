var BluMUI = require('../libs/statistics/chartShow.js');

//创建饼状图筛选栏
BluMUI.create({
  id: 'tea_pie_filter',
  wrapId:'tea_pie_chart',
  callback:callback1,
  type:'1',  //学院
  sstype:'1',   //老师
  chartTitle:'各学院老师操作统计图'
},
  'BluMUI_Filter',
  document.getElementById('tea_pie_filter')
);
BluMUI.create({
  id: 'stu_pie_filter',
  wrapId:'stu_pie_chart',
  callback:callback1,
  type:'1',  //学院
  sstype:'2', //学生
  chartTitle:'各学院学生操作统计图'
},
  'BluMUI_Filter',
  document.getElementById('stu_pie_filter')
);
//创建条形图筛选栏
BluMUI.create({
  id: 'tea_bar_filter',
  wrapId:'tea_bar_chart',
  callback:callback2,
  type:'2',  //人
  sstype:'1',   //老师
  chartTitle:'前十老师操作统计图'
},
  'BluMUI_Filter',
  document.getElementById('tea_bar_filter')
);
BluMUI.create({
  id: 'stu_bar_filter',
  wrapId:'stu_bar_chart',
  callback:callback2,
  type:'2',  //人
  sstype:'2' , //学生
  chartTitle:'前十学生操作统计图'
},
  'BluMUI_Filter',
  document.getElementById('stu_bar_filter')
);

//创建折线图筛选栏
BluMUI.create({
  id: 'tea_line_filter',
  wrapId:'tea_line_chart',
  callback:callback2,
  type:'1',  //老师
  chartTitle:'各学院每月老师操作数折线图'
},
  'BluMUI_FilterLine',
  document.getElementById('tea_line_filter')
);
BluMUI.create({
  id: 'stu_line_filter',
  wrapId:'stu_line_chart',
  callback:callback2,
  type:'2',  //学生
  chartTitle:'各学院每月学生操作数折线图'
},
  'BluMUI_FilterLine',
  document.getElementById('stu_line_filter')
);

//饼状图回调
function callback1(datas,wrapId,chartTitle) {
  BluMUI.create({
    id: wrapId,
    datas: datas,
    type: "pie",
    wrapId: wrapId,
    chartTitle:chartTitle
  },
    'BluMUI_Item',
    document.getElementById(wrapId)
  );
}
//条形图回调
function callback2(datas,wrapId,chartTitle) {
  BluMUI.create({
    id: wrapId,
    datas: datas,
    type: "bar",
    wrapId: wrapId,
    chartTitle:chartTitle
  },
    'BluMUI_Item',
    document.getElementById(wrapId)
  );
}
//折线图回调
function callback3(datas,wrapId,chartTitle) {
  BluMUI.create({
    id: wrapId,
    datas: datas,
    type: "line",
    wrapId: wrapId,
    chartTitle:chartTitle
  },
    'BluMUI_Item',
    document.getElementById(wrapId)
  );
}


// var echarts = require('echarts');
// var chartDom = document.getElementById("pieChart");
// var myChart = echarts.init(chartDom);
// var option = {
//   title: {
//     text: 'ECharts 入门示例'
//   },
//   tooltip: {},
//   xAxis: {
//     data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
//   },
//   yAxis: {},
//   series: [{
//     name: '销量',
//     type: 'bar',
//     data: [5, 20, 36, 10, 10, 20]
//   }]
// };
// myChart.setOption(option);

// var chartDom2 = document.getElementById("barChart");
// var myChart2 = echarts.init(chartDom2);
// var option2= {
//   legend: {},
//   tooltip: {},
//   dataset: {
//     // source: result
//     source: [
//       ['xm','collegeName', 'amount'],
//       ['','aa', 122],
//       ['','bb', 123],
//       ['','cc', 456],
//       ['','dd', 300],
//       ['','ee', 200]
//     ]
//   },
//   series: [
//     {
//       type: 'pie',
//       radius: 150,
//       center: ['50%', '50%'],
//       encode: {
//         itemName: 'collegeName',
//         value: 'amount'
//       }
//     }
//   ]
// }
// myChart2.setOption(option2);