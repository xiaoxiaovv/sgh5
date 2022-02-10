/**
 * creator:feng.jiang@dhc.com.cn
 * create time:2016/12/9
 * describe：TopicController 测试控制器
 **/

APP.controller('qSearchTwoController', ['$scope', '$rootScope', '$ionicHistory', 'qSearchTwoService', '$http', '$ionicSlideBoxDelegate', '$state',
    '$timeout','UserService','$stateParams','PopupService','$ionicScrollDelegate',
    function ($scope, $rootScope, $ionicHistory, qSearchTwoService, $http, $ionicSlideBoxDelegate, $state,$timeout,UserService,
              $stateParams,PopupService,$ionicScrollDelegate) {
        //    初始化参数
        $scope.topiclist='';//圈子列表
        $scope.ismore='';//分页加载显示
        $scope.topicListCount='';//圈子总数
        $scope.pageIndex='';//请求页数
        $scope.pageSize=10;//请求每页的条数
        $scope.tagIds='';//上一页的输入内容id
        $rootScope.toFilterCode=2;//标签页条件
        $scope.ismoreshow ='';//获取数据判断依据
        $scope.showmore='';//空内容改善
        $scope.input={
            isinput:''
        };//大家都在搜

        //返回
        $scope.goBack = function () {
            $scope.input.isinput='';
            $state.go('qSearch');
        };
        //跳转到标签搜索
        $scope.goqSearchBiao= function () {
            $state.go('qSearchBiao',{keywords: $scope.input.isinput});
        };
        //键盘跳转到标签搜索
        $scope.search= function (param) {
          if(window.cordova){
            cordova.plugins.Keyboard.close();
          }
            $state.go('qSearchBiao',{keywords: param.target.value});
        };
        //模糊查询跳页
        $scope.gotobiao=function(){
            $rootScope.toFilterCode=2;
            $state.go('qSearchBiao',{keywords: $scope.input.isinput});
        };
        //跳转到圈子
        $scope.gotoquanezi = function (item) {
            $state.go('circlePage', {circleId: item.id});
        };
        //加入圈子
        $scope.joinCircle = function (item) {
            $scope.itemTopicName = item.topicName;
            var ids = {
                ids: item.id
            };
            qSearchTwoService.joinTopic(ids)
                .success(function (response) {
                    if (response.success == true) {
                        item.isJoin = 1;
                        $scope.inCircle = true;
                        $timeout(function () {
                            $scope.inCircle = false;
                        }, 1000);
                        $scope.init();
                    } else {
                        PopupService.showToast(response.message);
                    }
                }).error(function(){
                    PopupService.showToast('加入失败');
                });
        };
        //加载更多
        $scope.loadData = function () {
            $timeout(function () {
                $scope.ismore = $scope.pageSize * $scope.pageIndex;
                $scope.hasMore =($scope.ismore <= $scope.topicListCount);
                $scope.pageIndex = $scope.pageIndex+1;//修改加载条数
                if ($scope.hasMore) {
                    var config =
                    {
                        pageSize: $scope.pageSize,
                        pageIndex: $scope.pageIndex,
                        tagIds:$scope.tagIds
                    };
                    qSearchTwoService.gettopic(config).success(function (response, status, headers, config) {
                        $timeout(function(){
                            $scope.topiclist = $scope.topiclist.concat(response.data.list.topicList);
                            $scope.topicListCount = response.totalCount;
                            $scope.ismore = $scope.pageSize * $scope.pageIndex;
                            $scope.hasMore =($scope.ismore <= $scope.totalCount);
                            $scope.ismoreshow =($scope.topiclist.length < $scope.topicListCount);
                            console.log($scope.topiclist);
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
            $rootScope.toFilterCode=2;//标签页条件
            $scope.pageIndex=1;//请求页数
            $scope.pageSize=10;//请求每页的条数
            var config={
                pageIndex: $scope.pageIndex,
                pageSize:$scope.pageSize,
                tagIds:$scope.tagIds
            };
            //获取圈子
            qSearchTwoService.gettopic(config).success(function (response, status, headers, config) {
                $timeout(function(){
                    $scope.topiclist = response.data.list.topicList;
                    $scope.topicListCount = response.totalCount;
                    console.log($scope.topiclist);
                    $scope.ismore = $scope.pageSize * $scope.pageIndex;
                    $scope.hasMore =($scope.ismore <= $scope.topicListCount);
                    $scope.ismoreshow =($scope.topiclist.length < $scope.topicListCount);
                    $scope.ismore = response.data.list.createDate1;
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                },30 );
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
            $scope.tagIds = $stateParams.tagIds;
            $scope.input={
                isinput:$stateParams.tagname
            };
            $scope.init();
            $scope.showmore=true;
        });

    }]);


APP.service('qSearchTwoService', ['$http', 'UrlService', function ($http, UrlService) {
    //查询圈子
    this.gettopic = function (config) {
        return $http.post(UrlService.getUrl('GETLISTBYCONDITION'), config);
    };
    //加入圈子方法
    this.joinTopic = function (param) {
        return $http({
            method: 'POST',
            url: UrlService.getUrl('JOIN_TOPIC'),
            data: param
        });
    };
}]);
