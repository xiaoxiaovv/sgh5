APP.service('GetStatisticInfoService', ['LoginService','$rootScope', '$http', 'UserService', '$localstorage','UrlService',
  function (LoginService,$rootScope, $http, UserService, $localstorage,UrlService) {
    //获取用户基本信息
    this.GetUserInfo = function (toState, fromState, toParams) {
      var AppUsers = 'sg_h5';//应用标识;
      var Host = window.location.origin;
      var ActiveUrl = Host + '/#/' + toState;  //当前url
      var PrevUrl = Host + '/#/' + fromState; //上一页url
      var Title = document.getElementsByTagName('title')[0].innerHTML; //页面标题
      var SystemOS = '';//客户端设备
      var WinWidthHeight = window.innerWidth + '*' + window.innerHeight;//屏幕分辨率
      var date = FormatDate(new Date().getTime());//当前时间
      var cookieId = '';//游客登陆绑定Id
      var LanguageBrowser = navigator.language;//浏览器语言
      var operateOS = navigator.platform || '';//操作系统
      var mid = UserService.getUser().mid || '';//用户id
      var LoginType = $localstorage.get('IsThirdLoginType') || '';//登录渠道；
      var isShare = '';//是否是分享
      var shareType = '';//分享类型
      var lon,lat;//经纬度
      var userRole;//数据埋点，新增字段
      LoginService.getRole()>0?userRole=1:userRole=0;
      //大数据埋点页面链接
      var get_statistic_ref='';
      var preArr=$rootScope.xnFromState.url.split("/:");
      if(preArr.length>0){
        for(var i=1;i<preArr.length;i++){
          get_statistic_ref+='/'+$rootScope.xnFromParams[preArr[i]]
        }
        PrevUrl=Host+'/www/index.html#/'+$rootScope.xnFromState.name+get_statistic_ref;
      }
      var get_statistic_url='';
      var actArr=$rootScope.xnToState.url.split("/:");
      if(actArr.length>0){
        for(var i=1;i<actArr.length;i++){
          get_statistic_url+='/'+$rootScope.xnToParams[actArr[i]]
        }
        ActiveUrl=Host+'/www/index.html#/'+$rootScope.xnToState.name+get_statistic_url;
      }
      //地理位置
      function GetPositionGps() {
        if (!$rootScope.globalConstant.positionStatus) {
          setTimeout(function () {
            GetPositionGps();
          }, 5000);
        } else {
          lon = $rootScope.globalConstant.lon;
          lat = $rootScope.globalConstant.lat;
        }
      }

      GetPositionGps();
      if(location.href.indexOf('?fs')!=-1){
        isShare = 'fromShare'
      }else{
        isShare = ''
      }
      if(getCookie('visitorId')){
        cookieId = getCookie('visitorId');
      }else{
        cookieId = this.generateUUID();
        setCookie('visitorId',cookieId);
      }

      // productId  【storeId-店铺id】
      var storeId = '',
        productId = '',
        hasStock = null;

      if (toParams.storeId) {
        storeId = toParams.storeId;
      }
      if (toParams.productId) {
        productId = toParams.productId;
      }

      if (toParams.hasStock) {
        hasStock = 1;
      }else if(toParams.hasStock==false){
        hasStock = -1;
      }


      //获取浏览器信息
      var u = navigator.userAgent;
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isiOS) {
        //iso系统
        SystemOS = 'ios';
      } else if (isAndroid) {
        //安卓系统
        SystemOS = 'android';
      } else {
        //浏览器
        SystemOS = 'pc';
      }
      if (u.toLowerCase().match(/MicroMessenger/i) == "micromessenger") {
        shareType = 'wx';
      } else if (u.toLowerCase().match(/WeiBo/i) == "weibo") {
        shareType = 'wb';
      } else if (u.toLowerCase().match(/QQ/i) == "qq") {
        shareType = 'qq';
      }

      var arr = [AppUsers, SystemOS, date, cookieId, mid, LoginType, storeId, productId, '', PrevUrl, ActiveUrl, Title, WinWidthHeight, '', LanguageBrowser, operateOS, '', isShare, shareType,userRole, hasStock];
      var str = arr.join('|');
      str = str.replace(/,/g,'');
      var url = UrlService.getCPUrl('BIG_DATA') + '?data=' + encodeURIComponent(str);
      jQuery.getScript(url,function(data){
        //console.log("已发送统计数据：",str);
      });
    };
    //生成访客唯一标识
    this.generateUUID = function(){
      var d = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
      });
      return uuid;
    };

//格式化时间
    function FormatDate(time) {
      //补零函数
      function toDub(n) {
        return n > 9 ? n : '0' + n;
      }

      if (time) {
        var oDate = new Date();
        oDate.setTime(time);
        var y = oDate.getFullYear();
        var m = oDate.getMonth() + 1;
        var d = oDate.getDate();
        var h = oDate.getHours();
        var mm = oDate.getMinutes();
        var s = oDate.getSeconds();
        return y + '-' + toDub(m) + '-' + toDub(d) + ' ' + toDub(h) + ':' + toDub(mm) + ':' + toDub(s);
      }
    }
    //设置cookie
    function setCookie(name,value)
    {
      var Days = 3650;
      var exp = new Date();
      exp.setTime(exp.getTime() + Days*24*60*60*1000);
      document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    }
   //读取cookies
    function getCookie(name)
    {
      var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
      if(arr=document.cookie.match(reg)) return unescape(arr[2]);
      else return null;
    }
  }]);
