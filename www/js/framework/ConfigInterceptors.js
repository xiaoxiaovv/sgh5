/**
 * creater:chuanpeng.zhu@dhc.com.cn
 * create time:2015/12/30
 * describe：http请求的拦截器
 **/
/* 拦截器 拦截http请求 */
var interceptors = ['$httpProvider', '$ionicConfigProvider', function ($httpProvider, $ionicConfigProvider) {
  /**
   *  $httpProvider.interceptors.push('UserIntercepter');
   *  上个项目遗留，此框架登录方式采用cookie
   */
  $httpProvider.interceptors.push('LoadingIntercepter');
  $httpProvider.interceptors.push('GetParamIntercepter');
  $httpProvider.interceptors.push('UserIntercepter');
  // $httpProvider.interceptors.push('GoldIntercepter');//金币增加拦截器
  $httpProvider.interceptors.push('PostParamIntercepter');
}];

//jquery的http请求 headers统一设置token
$.ajaxSetup({
  beforeSend:function(xhr) {
    //所有的请求头里存放登录相关的token
    xhr.setRequestHeader('TokenAuthorization',window.localStorage.getItem('sg_login_token_secret'));
  }
});
/**
* LOADING 拦截器
 */
APP.factory('LoadingIntercepter', ['$rootScope', '$q', function ($rootScope, $q) {
  return {
    request: function (config) {
      var pattern = /http:\/\//;
      if (pattern.exec(config.url)) {
        //判断是否显示加载条，noLoading为true时不显示。
        if ((!config.noLoading && !config.data && !config.params) || (config.data && !config.data.noLoading && !config.params) || (config.params && !config.data && !config.params.noLoading)) {
            $rootScope.$broadcast('LOADING:SHOW');
        }
          if(config.data && config.data.noLoading){
              delete config.data.noLoading;
      }
          if(config.params && config.params.noLoading){
              delete config.params.noLoading;
          }
      }
      return config;
    },
    response: function (response) {
      var pattern = /http:\/\//;
      if (!response || (response && pattern.exec(response.config.url))) {
        $rootScope.$broadcast('LOADING:HIDE');//取消加载进度条
      }
      // if(response && response.status == 200&&response.data.success&&$rootScope.isShowGoldRain&&response.config.url.indexOf('mstore/sg/task/doTask.html')>=0){
      //   console.log(response);
      //   $rootScope.$broadcast('GOLD_INCREASE');
      // }
      return response;
    },
    responseError: function (rejection) {
      //检测网络异常
      $rootScope.$broadcast('http-response:error', rejection);
      $rootScope.$broadcast('LOADING:HIDE');
      $q.reject(rejection);
    }
  }
}]);

/**
 * 登录 拦截器
 */
APP.factory('UserIntercepter', ['UserService', '$rootScope', 'UrlService',function (UserService, $rootScope, UrlService) {
  return {
    request: function (config) {
      if (config.method == 'GET') {

      }
      return config;
    },
    response: function (response) {
      //拦截如果业务表示代码code为-1，约定错误为需要登录信息。跳转到登录页面。

      if(response && response.config && response.config.method == 'GET'){
        if(response.data && response.data.errorCode){
          if(response.data.errorCode == '-100'){
            //登录失效
            console.log('登录 session 失效过期');
          $rootScope.$emit("userIntercepted","sessionOut",response);
          }
        }
      }
      else if(response && response.config && response.config.method == 'POST'){

          if(response.data&&response.data.errorCode == '-100'){
              console.log('登录 session 失效过期 post !!!');
              $rootScope.$emit("userIntercepted","sessionOut",response);
          }
      }
      return response;
    },
    responseError: function (rejection) {

    }
  }
}]);

/**
 * Get参数拼装 拦截器
 */
APP.factory('GetParamIntercepter', ['$rootScope','$localstorage', function ($rootScope,$localstorage) {
  return {
    request: function (config) {
      if (config.method == 'GET') {
        var tempConfig = angular.copy(config);
        delete tempConfig.cache;
        delete tempConfig.headers;
        delete tempConfig.method;
        delete tempConfig.paramSerializer;
        delete tempConfig.transformRequest;
        delete tempConfig.transformResponse;
        delete tempConfig.url;

        var tempUrl = '';
        for (var p in tempConfig) {
          if (!tempUrl) {
            tempUrl = '?';
          } else {
            tempUrl = tempUrl + '&';
          }
          tempUrl = tempUrl + p + '=' + tempConfig[p];
          //console.log('属性:', p, '-', tempConfig[p]);
        }
        config.url = config.url + tempUrl;
        //所有的请求头里存放登录相关的token
        config.headers.TokenAuthorization = $localstorage.get('sg_login_token_secret');
      }
      /*
       var count = Object.getOwnPropertyNames(tempConfig).length;
       if (count > 0) {
       console.log('count:', count);
       }*/
      return config;
    },
    response: function (response) {
      if(response.config.url.indexOf('sg/game/winnerList.json')==-1&&response.data.data&&response.data.data.code==120){
        $rootScope.$broadcast('tooCrowd','<div><div style="text-align:center;color:#32BEFF;font-size:14px;margin-bottom:10px;">人数太多,请稍后……</div><div>俗话说：好饭不怕晚，好腰不怕闪，大奖都在后面！<br /></div><div style="text-align:center;"><img style="width:70%;" src="{{imgBaseURL}}img/waitBusy.gif" /></div></div>');
      }
      return response;
    },
    responseError: function (rejection) {

    }
  }
}]);

/**
 * Post方式参数拼装 拦截器
 */
APP.factory('PostParamIntercepter', ['$rootScope','$localstorage', function ($rootScope,$localstorage) {
  return {
    request: function (config) {
      if (config.method == 'POST') {
        /*var transformFunction = function (data) {
          return $.param(data);
        };*/
        // var headers = {
        //   'Accept':'application/json, text/plain, */*',
        //   'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        // };
        // //config.transformRequest = transformFunction;
        // config.headers = headers;

        //所有的请求头里存放登录相关的token
        config.headers.TokenAuthorization = $localstorage.get('sg_login_token_secret');
      }
      return config;
    },
    response: function (response) {
      if(response.config.url.indexOf('sg/game/winnerList.json')==-1&&response.data.data&&response.data.data.code==120){
        $rootScope.$broadcast('tooCrowd','<div><div style="text-align:center;color:#32BEFF;font-size:14px;margin-bottom:10px;">人数太多,请稍后……</div><div>俗话说：好饭不怕晚，好腰不怕闪，大奖都在后面！<br /></div><div style="text-align:center;"><img style="width:70%;" src="{{imgBaseURL}}img/waitBusy.gif" /></div></div>');
      }
      return response;
    },
    responseError: function (rejection) {

    }
  }
}]);
