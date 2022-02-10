/**
 * creater:chuanpeng.zhu@dhc.com.cn
 * create time:2016/3/14
 * describe：APP全局配置文件
 **/
APP.config(commonConfig);//backButton
APP.config(route);//加入路由表
APP.config(interceptors);//加入http请求拦截器

APP.config(['$httpProvider',
  function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }]);
