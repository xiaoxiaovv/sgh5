/**
 * creator:feng.jiang@dhc.com.cn
 * create time:2016/12/9
 * describe：TopicController 测试控制器
 **/

APP.controller('qSearchController', ['$scope', '$rootScope', '$ionicHistory', 'qSearchService', '$http', '$ionicSlideBoxDelegate', '$state',
    '$timeout','UserService','$ionicScrollDelegate',
    function ($scope, $rootScope, $ionicHistory, qSearchService, $http, $ionicSlideBoxDelegate, $state,$timeout,UserService,
              $ionicScrollDelegate) {
        //    初始化参数
        $scope.biaoqian='';//大家都在搜
        $scope.showmore='';//空内容改善
        $scope.input={
            isinput:''
        };//大家都在搜



        //返回
        $scope.goBack = function () {
            $scope.input.isinput='';
            // $state.go('topic.qhot');  //@zyr
            $scope.$ionicGoBack();  //@zyr
        };
        //跳转到标签搜索
        $scope.goqSearchThree = function () {
          if(window.cordova){
            cordova.plugins.Keyboard.close();
          }
            $state.go('qSearchThree',{keywords: $scope.input.isinput});
        };
          //跳转到标签搜索
        $scope.search = function (param) {
            $state.go('qSearchThree',{keywords: param.target.value});
        };
         //点击标签搜索
        $scope.BgoqSearchTwo = function (item) {
            console.log(item.id);
                // $state.go('qSearchTwo',{tagIds: item.id,tagname:item.name});
                $state.go('qSearchThree',{keywords:item.name});
        };
        /**
         *   页面初始化数据
         **/
        $scope.init = function () {
            $scope.input.isinput='';
            var config={
                isHot:0
            };
            qSearchService.getbiaoqian(config).success(function(response, status, headers, config){
                $timeout(function(){
                    $scope.biaoqian = response.data.list;
                    console.log($scope.biaoqian);
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                },30);
                return response;
            }).error(function () {
                console.log('获取数据失败');
            });
            setTimeout(function () {
                document.getElementById('qSearch').focus();
            }, 200);
            $ionicScrollDelegate.scrollTop();
        };
        /**
         *   on方法
         **/
        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.showmore=false;
            $scope.init();
            $scope.showmore=true;
        });

    }]);


APP.service('qSearchService', ['$http', 'UrlService', function ($http, UrlService) {
    //获取热门标签信息
    this.getbiaoqian = function (config) {
        return $http.post(UrlService.getUrl('TOPIC_TAGS'),config);
    };

}]);
