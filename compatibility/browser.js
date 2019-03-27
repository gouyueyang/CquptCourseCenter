$(function(){
    //判断浏览器的内核及操作系统
    BrowserType();
    $('.browser-list-btn').on('click',function(){
        if($(this).hasClass('openFlag')){
            $('#browserListBox').addClass('browser-btn-hide');
            $(this).removeClass('openFlag').find('a').text('点击查看浏览器兼容列表');

        }else{
            $('#browserListBox').removeClass('browser-btn-hide');
            $(this).addClass('openFlag').find('a').text('点击收起浏览器兼容列表');
        }
    });

    $('#animateBtn').on('click',function(){
        $(".browser-pic-group").animate({"margin-left":"-41px"},function(){
            $(".browser-pic-bitmap").fadeIn(2000).removeClass('browser-btn-hide');
        });
        $(this).addClass('browser-btn-visibility');
    });

    //仍要访问
    $('.stillVisitPage').on('click',function(){
        window.location.href = "../index.html?browser=no";
    });



    //判断当前浏览类型
    function BrowserType()
    {
        var browserFlag='';
        var IeVersion = '';
        var browserVersion='';
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
        var isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE; //判断是否IE的Edge浏览器
        var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
        var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
        var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器
        var isUcBrowser = userAgent.indexOf("UBrowser") > -1; // 判断UC浏览器
        var IeNoSupportFlag = true;
        var browserTypeFlag="";
        var flag = true;
        var support_flag = false;
		var OsObject = window.navigator.userAgent;
		

        if (isIE)
        {

            IeNoSupportFlag = false;
            browserTypeFlag = "IE";
            $(".browser-pic-bitmap").removeClass("browser-btn-hide");
        }

        if (isFF) {
            browserTypeFlag= "Firefox";
            flag =false;
        }
        if (isOpera) {
            browserTypeFlag= "Opera";
            flag=false;
        }
        if (isSafari) {
            browserTypeFlag= "Safari";
            flag =false;
        }
        if (isChrome) {
            browserTypeFlag= "Chrome";
            flag = false;
        }
        if (isEdge) {
            browserTypeFlag= "Edge";
        }
        if(isUcBrowser){
            browserTypeFlag= "UC浏览器";
        }
        if(!(isFF ||isOpera||isSafari||isChrome||isEdge||isUcBrowser)){
            browserTypeFlag= "未知浏览器";
        }
        
        if (!!window.ActiveXObject || "ActiveXObject" in window) {

            // if (OsObject.indexOf("MSIE") > 0) {
            //     var version = OsObject.match(/MSIE \d+/i);
            //     var versionNum = version[0].match(/\d+/i);
            //     if (parseInt(versionNum) >= 9) {
            //         flag = false;
            //     }
            // } else 
            // if (OsObject.toLowerCase().indexOf("trident") > -1 && OsObject.indexOf("rv") > -1) {
            //     flag = false;
            // }
            flag = true;
        }
        
        if(!flag){
            support_flag = filterNavigatorNoSupport(OsObject);
        }
        
        

        // var osFg  = getOs();
        // //更新页面信息
        // setPageNewData(osFg,browserTypeFlag);

        // if(!IeNoSupportFlag){
        //     $('#notIeSupportBrowser').removeClass('browser-btn-hide');
        //     $('#norSupportBrowser').addClass('browser-btn-hide');

        // }
    }

    function goIndex(){
       /* var newUrl = '';
        var host = window.location.host;
        var pathname = window.location.pathname;
        var updateurl = pathname.split('/');
        var newupdateurl = '';
        for (var i = 0; i < updateurl.length; i++) {
            debugger;
            if ((updateurl[i].indexOf('portal'))> -1){
                newupdateurl +="";
            }else if((updateurl[i].indexOf('browerTips.html')) > -1){
                newupdateurl += '/' + 'index.html';
            }else if($.trim(updateurl[i])!=''){
                newupdateurl += '/' + updateurl[i];
            }

        }
        newUrl = host + newupdateurl;
        window.location.href = window.location.protocol + '//' + newUrl;*/

    }

    /**
     * 过滤非主流浏览器
     * @param OsObject
     * @returns {boolean}
     */
    function filterNavigatorNoSupport(OsObject) {
        //遨游 Maxthon  猎豹 LBBROWSER  百度 BIDUBrowser  淘宝 TaoBrowser UC  UBrowser
        if ( OsObject.indexOf("UBrowser") > 0 || OsObject.indexOf("Maxthon") > 0 ||  OsObject.indexOf("LBBROWSER") > 0 || OsObject.indexOf("BIDUBrowser") > 0 || OsObject.indexOf("TaoBrowser") > 0) {
            return true;
        }
        return false;
    }

    /**
     * 获取操作系统的信息
     */
    // function getOs(){
    //     var os = navigator.platform;
    //     var userAgent = navigator.userAgent;
    //     var osFlag='';

    //     var isWinXp = userAgent.indexOf("Windows NT 5.0") > -1 || userAgent.indexOf("Windows 2000") > -1 || userAgent.indexOf("Windows NT 5.1") > -1 || userAgent.indexOf("Windows XP") > -1 || userAgent.indexOf("Windows NT 5.2") > -1 || userAgent.indexOf("Windows 2003") > -1;

    //     if(os.indexOf("Win") > -1){
    //         if(isWinXp){
    //             osFlag =  "Windows XP";
    //         }else if(userAgent.indexOf("Windows NT 10.0") > -1 || userAgent.indexOf("Windows NT 10") > -1 || userAgent.indexOf("Windows 10") > -1){
    //             osFlag =  "Windows 10";
    //         }else if(userAgent.indexOf("Windows NT 6.1") > -1 || userAgent.indexOf("Windows 7") > -1){
    //             osFlag =  "Windows 7";
    //         }else if(userAgent.indexOf("Windows 8") > -1){
    //             osFlag =  "Windows 8/8.1";
    //         }else if(userAgent.indexOf("Windows NT 8.1") > -1){
    //             osFlag =  "Windows 8/8.1";
    //         }else{
    //             osFlag =  "Other";
    //         }
    //     }else if(os.indexOf("Mac") > -1){
    //         osFlag=  "Mac OS";
    //     }else{
    //         osFlag=  "Other";
    //     }
    //     return osFlag;
    // }

    // function setPageNewData(osFg,browserTypeFlag){
    //     var osFg =osFg;//当前使用的操作系统
    //     var browserTypeFlag;
    //     var osPicurl = getOsPicName(osFg); //获取操作系统的图标地址
    //     var browserPicUrl = getBrowserPicName(browserTypeFlag);

    //     var osHtm= '您电脑的操作系统为：<img src="./img/'+osPicurl+'" width="14" height="14" class="browser-pic-center"/> <span'+
    //         'class="browser-title-size">'+osFg+'</span>&nbsp;&nbsp;&nbsp;&nbsp;您当前使用的浏览器为：'+
    //         '<img src="./img/'+browserPicUrl+'" class="browser-pic-center" width="14" height="14"/>'+
    //         ' <span class="browser-title-size">'+browserTypeFlag+'</span>';
    //     $('.browser-title-2').html(osHtm);

    //     if(browserTypeFlag !='IE8'){
    //         $('.browser-list-btn').removeClass('browser-btn-hide');
    //         $('.brower-go').removeClass('browser-btn-hide');
    //         $('#browserListBox').addClass('browser-btn-hide');
    //     }

    //     if(osFg == 'Windows XP'){
    //         //下载chrome 49浏览器 及360 8.5
    //         $('.btn-xp').removeClass('browser-btn-hide');
    //         $('.btn-win').addClass('browser-btn-hide');
    //     }else {
    //         $('.btn-xp').addClass('browser-btn-hide');
    //         $('.btn-win').removeClass('browser-btn-hide');
    //     }
    // }

    // function getOsPicName(osFg){
    //     var picurl='';
    //     if(osFg.indexOf('Windows XP')>-1){
    //         picurl = 'xp.png';
    //     }else if(osFg.indexOf('Windows 7')>-1){
    //         picurl = 'w7.png';
    //     }else if(osFg.indexOf('Windows 8/8.1')>-1){
    //         picurl = 'w8.png';
    //     }else if(osFg.indexOf('Windows 10')>-1){
    //         picurl = 'w10.png';
    //     }else if(osFg.indexOf('Mac')>-1){
    //         picurl = 'os.png';
    //     }else{
    //         picurl = 'xp.png';
    //     }

    //     return picurl;
    // }


    // function getBrowserPicName(browserTypeFlag){
    //     var picurl='';
    //     if(browserTypeFlag.indexOf('IE')>-1){
    //         picurl = 'ie9.png';
    //     }else if(browserTypeFlag.indexOf('Safari')>-1){
    //         picurl = 'safari.png';
    //     }else if(browserTypeFlag.indexOf('Chrome')>-1){
    //         picurl = 'chrome.png';
    //     }else if(browserTypeFlag.indexOf('Edge')>-1){
    //         picurl = 'edge.png';
    //     }else{
    //         picurl = 'browser.png';
    //     }
    //     return picurl;
    // }
});