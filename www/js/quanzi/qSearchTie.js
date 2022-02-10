/**
 * creator:feng.jiang@dhc.com.cn
 * create time:2016/12/9
 * describe：TopicController 测试控制器
 **/

APP.controller('qSearchTieController', ['$scope', '$rootScope', '$ionicHistory', 'qSearchTieService', '$http', '$ionicSlideBoxDelegate', '$state',
    '$timeout','UserService','$stateParams','PopupService','$ionicScrollDelegate',
    function ($scope, $rootScope, $ionicHistory, qSearchTieService, $http, $ionicSlideBoxDelegate, $state,$timeout,
              UserService,$stateParams,PopupService,$ionicScrollDelegate) {
        //    初始化参数
        $scope.huatilist='';//话题列表
        $scope.pageIndex='';//请求页数
        $scope.pageSize=10;//请求每页的条数
        $scope.keywords = '';//上页内容
        $scope.totalCount ='';//获取数据总条数
        $scope.hasMore ='';//判断依据
        $scope.ismoreshow ='';//获取数据判断依据
        $scope.showmore='';//空内容改善
        $scope.input={
            isinput:$stateParams.keywords
        };//大家都在搜



        //返回
        $scope.goBack = function () {
            //$scope.input.isinput='';
            $state.go('qSearchThree',{keywords: $scope.input.isinput});
        };
        //跳转到标签搜索
        $scope.goqSearchTwo = function () {
                $state.go('qSearchTwo',{keywords: $scope.input.isinput});
        };
        //点击帖子跳转
        $scope.gototiezi = function (item) {
            $state.go('noteDetails', {noteId: item.id,isShortStory:item.isShortStory});
        };
        //键盘搜索
        $scope.search=function(param){
          if(window.cordova){
            cordova.plugins.Keyboard.close();
          }
            $scope.input.isinput=param.target.value;
            $scope.init();
        };
        //加载更多
        $scope.loadData = function () {
            $timeout(function () {
                $scope.ismore = $scope.pageIndex  * $scope.pageSize;
                $scope.hasMore =($scope.ismore <= $scope.totalCount);
                $scope.pageIndex = $scope.pageIndex+1;//修改加载条数
                if ($scope.hasMore) {
                    var config =
                    {
                        pageSize: $scope.pageSize,
                        pageIndex: $scope.pageIndex,
                        keywords:$scope.keywords
                    };
                    qSearchTieService.gethuati(config).success(function (response, status, headers, config) {
                        $timeout(function(){
                            $scope.huatilist = $scope.huatilist.concat(response.data.list);
                            $scope.totalCount = response.totalCount;
                            $scope.ismore = $scope.pageSize * $scope.pageIndex;
                            $scope.hasMore =($scope.ismore <= $scope.totalCount);
                            $scope.ismoreshow =($scope.huatilist.length < $scope.totalCount);
                            console.log($scope.huatilist);
                            $scope.$broadcast('scroll.refreshComplete');
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        },30);
                        return response;
                    }).error(function () {
                        PopupService.showToast('没有更多数据');
                        console.log("查询失败");
                    });
                }else {
                    PopupService.showToast('没有更多数据');
                    return $scope.hasMore;
                }
                $scope.$broadcast('scroll.refreshComplete');
                $scope.$broadcast('scroll.infiniteScrollComplete');
            },1000);
        };
        /**
         *   页面初始化数据
         **/
        $scope.init = function () {
            $scope.keywords = $scope.input.isinput;
            $scope.pageIndex=1;//请求页数
            $scope.pageSize=10;//请求每页的条数
            //获取话题信息
            var huati={
                pageSize: $scope.pageSize,
                pageIndex: $scope.pageIndex,
                keywords:$scope.keywords
            };
            console.log($scope.keywords);
            qSearchTieService.gethuati(huati).success(function(response, status, headers, config){
                $timeout(function(){
                    $scope.huatilist = response.data.list;
                    console.log($scope.huatilist);
                    $scope.totalCount = response.totalCount;
                    $scope.ismore = $scope.pageSize * $scope.pageIndex;
                    $scope.hasMore =($scope.ismore <= $scope.totalCount);
                    $scope.ismoreshow =($scope.huatilist.length < $scope.totalCount);
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                },30);
                return response;
            }).error(function () {
                console.log('获取数据失败');
            });
            $ionicScrollDelegate.scrollTop();
        };
        /**
         *   on方法
         **/
        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.showmore=false;
            $scope.input={
                isinput:$stateParams.keywords
            };
            $scope.keywords = $scope.input.isinput;
            console.log($scope.keywords);
            $scope.init();
            $scope.showmore=true;
        });

    }]);


APP.service('qSearchTieService', ['$http', 'UrlService', function ($http, UrlService) {
    //获取话题信息
    this.gethuati = function (config) {
        return $http.post(UrlService.getUrl('GETSTORYBYCONDITION'),config);
    };
}]);
