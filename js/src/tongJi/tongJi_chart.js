var BluMUI = require('../../libs/statistics/chartShow.js');

//创建教师筛选栏
BluMUI.create({
  id:'tea_filter',
  wrapId:['tea_pie_chart','tea_bar_chart','tea_line_chart'],
  callback:[callback1,callback2,callback3],
  chartTitle:['各学院教师操作统计','教师操作统计Top 10','各学院每月教师操作数分析']
},
  'BluMUI_NewFilter',
  document.getElementById('tea_chart_filter')
);
//创建学生筛选栏
BluMUI.create({
  id:'stu_filter',
  wrapId:['stu_pie_chart','stu_bar_chart','stu_line_chart'],
  callback:[callback1,callback2,callback3],
  chartTitle:['各学院学生操作统计','学生操作统计Top 10','各学院每月学生操作数分析']
},
  'BluMUI_NewFilter',
  document.getElementById('stu_chart_filter')
);

// //创建饼状图筛选栏
// BluMUI.create({
//   id: 'tea_pie_filter',
//   wrapId:'tea_pie_chart',
//   callback:callback1,
//   type:'1',  //学院
//   sstype:'1',   //老师
//   chartTitle:'各学院教师操作统计'
// },
//   'BluMUI_Filter',
//   document.getElementById('tea_pie_filter')
// );
// BluMUI.create({
//   id: 'stu_pie_filter',
//   wrapId:'stu_pie_chart',
//   callback:callback1,
//   type:'1',  //学院
//   sstype:'2', //学生
//   chartTitle:'各学院学生操作统计'
// },
//   'BluMUI_Filter',
//   document.getElementById('stu_pie_filter')
// );
// //创建条形图筛选栏
// BluMUI.create({
//   id: 'tea_bar_filter',
//   wrapId:'tea_bar_chart',
//   callback:callback2,
//   type:'2',  //人
//   sstype:'1',   //老师
//   chartTitle:'教师操作统计Top 10'
// },
//   'BluMUI_Filter',
//   document.getElementById('tea_bar_filter')
// );
// BluMUI.create({
//   id: 'stu_bar_filter',
//   wrapId:'stu_bar_chart',
//   callback:callback2,
//   type:'2',  //人
//   sstype:'2' , //学生
//   chartTitle:'学生操作统计Top 10'
// },
//   'BluMUI_Filter',
//   document.getElementById('stu_bar_filter')
// );

// //创建折线图筛选栏
// BluMUI.create({
//   id: 'tea_line_filter',
//   wrapId:'tea_line_chart',
//   callback:callback3,
//   type:'1',  //老师
//   chartTitle:'各学院每月教师操作数分析'
// },
//   'BluMUI_FilterLine',
//   document.getElementById('tea_line_filter')
// );
// BluMUI.create({
//   id: 'stu_line_filter',
//   wrapId:'stu_line_chart',
//   callback:callback3,
//   type:'2',  //学生
//   chartTitle:'各学院每月学生操作数分析'
// },
//   'BluMUI_FilterLine',
//   document.getElementById('stu_line_filter')
// );

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


