var BluMUI = require('../../libs/statistics/jskctj.js');
const ajax = require('../../libs/post_ajax.js');
//创建教师课程top10统计筛选栏
BluMUI.create({
    id: 'tea_course_top10_filter',
    wrapId: "tea_course_top10_content",
    callback: barCallback,
    chartTitle: '教师课程数Top 10'
},
    'BluMUI_Top10Filter',
    document.getElementById('tea_course_top10_filter')
);
//创建教师任课列表筛选栏
BluMUI.create({
    id: 'tea_course_wrap'
},
    'BluMUI_KclbFilter',
    document.getElementById('tea_course_wrap')
);



//饼状图回调
function pieCallback(datas, wrapId, chartTitle) {
    BluMUI.create({
        id: wrapId,
        datas: datas,
        type: "pie",
        wrapId: wrapId,
        chartTitle: chartTitle,
        parent:true
    },
        'BluMUI_Item',
        document.getElementById(wrapId)
    );
}
//条形图回调
function barCallback(datas, wrapId, chartTitle) {
    BluMUI.create({
        id: wrapId,
        datas: datas,
        type: "bar",
        wrapId: wrapId,
        chartTitle: chartTitle
    },
        'BluMUI_Item',
        document.getElementById(wrapId)
    );
}


ajax({
    url: courseCenter.host + "getXykcData",
    data: {
        unifyCode: getCookie("userId")
    },
    success: (gets) => {
        let datas = JSON.parse(gets);
        if (datas.meta.result === 100) {
            let lists = datas.data.rows;
            //调用回调函数绘制图表
            pieCallback(lists, 'college_course_pie', "各学院课程数统计");
        }
    }
});

(function () {
    if (window.frameElement) {
        window.frameElement.height = document.body.offsetHeight;
    }
})();
