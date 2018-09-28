var BluMUI = require('../../libs/statistics/kcclwhfx.js');

//创建饼状图筛选栏
BluMUI.create({
  id: 'course_fix_pie_filter',
  wrapId:'course_fix_pie_chart',
  callback:callback1,
  type:'1',  //学院
  sstype:'1',   //老师
  chartTitle:'各学院课程维护统计图'
},
  'BluMUI_Filter',
  document.getElementById('course_fix_pie_filter')
);
BluMUI.create({
  id: 'stu_pie_filter',
  wrapId:'stu_pie_chart',
  callback:callback1,
  type:'1',  //学院
  sstype:'2', //学生
  chartTitle:'各学院课程审核统计图'
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