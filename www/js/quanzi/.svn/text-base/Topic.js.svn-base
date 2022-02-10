/**
 * creator:feng.jiang@dhc.com.cn
 * create time:2016/10/11
 * describe：TopicController 测试控制器
 **/

APP.controller('TopicController', ['$scope','$rootScope', '$ionicHistory','$state','TopicService','$localstorage',
    function ($scope,$rootScope,$ionicHistory,$state,TopicService,$localstorage) {
//        初始化数据
        $rootScope.xiaoxis=false;//消息
        $scope.shuxiaoxi=false;
        $scope.count=0;//消息判断条件
        $rootScope.msgCount='';//未读消息数量

        $scope.init=function(){
            $scope.tabNav='qhot';
        //获取消息
        TopicService.getxiaoxi().success(function(response, status, headers, config){
            $rootScope.msgCount=response.data;
            $scope.topshow = ($rootScope.msgCount!=0);
            console.log('消息数量'+$rootScope.msgCount);
        }).error(function(){
            console.log('获取数据失败');
            });
        };
        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.init();
        });
     $scope.onTabSelected = function(){
         $rootScope.xiaoxis=false;
     }
     $scope.open=function(){
        var DINGZHI_ZHONGCHUANGHUI = "http://m.ehaier.com/v3/sgcommunity/diy/login/request.ajax"+"?flag="+$localstorage.get('sg_login_token_secret').substring(6);
        //如果是 网页端
        if (!window.cordova) {
            window.location.href = DINGZHI_ZHONGCHUANGHUI;
            return;
        } else {
            /**
             * H5跳转原生webView页面
             * @param resultUrl {String} 链接url
             * @param title {String} 标题
             *
             */
            window.emc.presentH5View(DINGZHI_ZHONGCHUANGHUI, "创意社区");
        }

     }
}]);

APP.service('TopicService', ['$http', 'UrlService', function ($http, UrlService) {
 //获取消息
    this.getxiaoxi = function () {
        return $http.get(UrlService.getUrl('UNRED_MESSAGE'));
    }
}]);
