var BluMUI = require('../../libs/statistics/kcclwhfx.js');

//创建课程维护饼状图筛选栏
BluMUI.create({
  id: 'course_fix_pie_filter',
  wrapId:'course_fix_pie_chart',
  callback:pieCallback,
  type:'wh',  //wh:维护数据，sh：审核数据
  chartTitle:'各学院课程维护统计图'
},
  'BluMUI_PieFilter',
  document.getElementById('course_fix_pie_filter')
);
//创建课程维护表格筛选栏
BluMUI.create({
  id: 'course_fix_table_filter',
  wrapId:'course_fix_table_content',
  callback:tableCallback,
  type:'wh',  //wh:维护数据，sh：审核数据
},
  'BluMUI_TableFilter',
  document.getElementById('course_fix_table_filter')
);

//创建课程审核饼状图筛选栏
BluMUI.create({
  id: 'course_audit_pie_filter',
  wrapId:'course_audit_pie_chart',
  callback:pieCallback,
  type:'sh',  //wh:维护数据，sh：审核数据
  chartTitle:'各学院课程审核统计图'
},
  'BluMUI_PieFilter',
  document.getElementById('course_audit_pie_filter')
);
//创建课程审核表格筛选栏
BluMUI.create({
  id: 'course_audit_table_filter',
  wrapId:'course_audit_table_content',
  callback:tableCallback,
  type:'sh',  //wh:维护数据，sh：审核数据
},
  'BluMUI_TableFilter',
  document.getElementById('course_audit_table_filter')
);
//饼状图回调
function pieCallback(datas,wrapId,chartTitle) {
  BluMUI.create({
    id: wrapId,
    datas: datas,
    type: "pie",
    wrapId: wrapId,
    chartTitle:chartTitle
  },
    'BluMUI_PieChart',
    document.getElementById(wrapId)
  );
}

//表格回调
function tableCallback(datas,wrapId,output){
  BluMUI.create({
    id:wrapId,
    datas:datas,
    wrapId:wrapId,
    output:output
  },
  'BluMUI_TableChart',
  document.getElementById(wrapId)
  );
}
