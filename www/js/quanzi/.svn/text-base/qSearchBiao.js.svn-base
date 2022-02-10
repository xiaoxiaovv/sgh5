/**
 * creator:feng.jiang@dhc.com.cn
 * create time:2016/12/9
 * describe：TopicController 测试控制器
 **/

APP.controller('qSearchBiaoController', ['HomePageService', '$scope', '$rootScope', '$ionicHistory', 'qSearchBiaoService', '$http', '$ionicSlideBoxDelegate', '$state',
  '$timeout', 'UserService', '$stateParams', 'PopupService', '$ionicScrollDelegate',
  function (HomePageService, $scope, $rootScope, $ionicHistory, qSearchBiaoService, $http, $ionicSlideBoxDelegate, $state, $timeout,
    UserService, $stateParams, PopupService, $ionicScrollDelegate) {
    //    初始化参数
    $scope.topiclist = ''; //圈子列表
    $scope.pageIndex = ''; //请求页数
    $scope.pageSize = 10; //请求每页的条数
    $scope.keywords = ''; //上一页参数
    $scope.ismore = ''; //加载更多
    $scope.totalCount = ''; //获取数据总数
    $scope.hasMore = ''; //获取数据判断依据
    $scope.ismoreshow = ''; //获取数据判断依据
    $scope.showmore = ''; //空内容改善
    $scope.input = {
      isinput: $scope.isinput
    }; //大家都在搜


    //返回
    $scope.goBack = function () {
      if ($rootScope.toFilterCode == 1) {
        $rootScope.toFilterCode = 0;
        $scope.input.isinput = '';
        $state.go('allCircle');
      } else if ($rootScope.toFilterCode == 2) {
        $rootScope.toFilterCode = 0;
        $scope.input.isinput = '';
        $state.go('qSearch');
      } else {
        //$scope.input.isinput='';
        $state.go('qSearchThree', {
          keywords: $scope.input.isinput
        });
      }
    };
    //跳转到标签搜索
    $scope.goqSearchTwo = function () {
      $state.go('qSearchTwo', {
        keywords: $scope.input.isinput
      });
    };
    //跳转到圈子
    $scope.gotoquanezi = function (item) {
      $state.go('circlePage', {
        circleId: item.id
      });
    };
    //键盘搜索
    $scope.search = function (param) {
      if (window.cordova) {
        cordova.plugins.Keyboard.close();
      }
      $scope.input.isinput = param.target.value;
      $scope.init();
    };
    //加入圈子
    $scope.joinCircle = function (item) {
      HomePageService.isWdHost()
        .success(function (res) {
          $rootScope.isWdHost = res.data.isHost;
          if ($rootScope.isWdHost == -1) { //如果没有登录 跳转到登录页面
            $state.go('login');
          }else{
            $scope.itemTopicName = item.topicName;
            var ids = {
              ids: item.id
            };
            qSearchBiaoService.joinTopic(ids)
              .success(function (response) {
                if (response.success == true) {
                  item.isJoin = 1;
                  $scope.init();
                  $scope.inCircle = true;
                  $timeout(function () {
                    $scope.inCircle = false;
                  }, 1000);
                } else {
                  PopupService.showToast(response.message);
                }
              }).error(function () {
                PopupService.showToast('加入失败');
              });
          }
        })
      $scope.itemTopicName = item.topicName;
      var ids = {
        ids: item.id
      };
      qSearchBiaoService.joinTopic(ids)
        .success(function (response) {
          if (response.success == true) {
            item.isJoin = 1;
            $scope.init();
            $scope.inCircle = true;
            $timeout(function () {
              $scope.inCircle = false;
            }, 1000);
          }else if (response.errorCode==-2000){
              PopupService.showToast(response.message);
              $rootScope.loginIsAccord2 = true;
            }
        }).error(function () {
          PopupService.showToast('加入失败');
        });

    };
    //加载更多
    $scope.loadData = function () {
      $timeout(function () {
        $scope.ismore = $scope.pageSize * $scope.pageIndex;
        $scope.hasMore = ($scope.ismore <= $scope.totalCount);
        $scope.pageIndex = $scope.pageIndex + 1; //修改加载条数
        if ($scope.hasMore) {
          var config = {
            pageSize: $scope.pageSize,
            pageIndex: $scope.pageIndex,
            keywords: $scope.keywords
          };
          qSearchBiaoService.gettopic(config).success(function (response, status, headers, config) {
            $timeout(function () {
              $scope.topiclist = $scope.topiclist.concat(response.data.list);
              $scope.totalCount = response.totalCount;
              $scope.ismore = $scope.pageSize * $scope.pageIndex;
              $scope.hasMore = ($scope.ismore <= $scope.totalCount);
              $scope.ismoreshow = ($scope.topiclist.length < $scope.totalCount);
              console.log($scope.topiclist);
              $scope.$broadcast('scroll.refreshComplete');
              $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 30);
            return response;
          }).error(function () {
            PopupService.showToast('没有更多数据');
            console.log("查询失败");
          });
        } else {
          PopupService.showToast('没有更多数据');
          return $scope.hasMore;
        }
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }, 1000);
    };

        /**
         *   页面初始化数据
         **/
        $scope.init = function () {
            $scope.keywords = $scope.input.isinput;
            $scope.pageIndex=1;//请求页数
            $scope.pageSize=10;//请求每页的条数
            //获取圈子信息
            var topic={
                pageSize: $scope.pageSize,
                pageIndex: $scope.pageIndex,
                keywords:$scope.keywords
            };
            console.log($scope.keywords);
            qSearchBiaoService.gettopic(topic).success(function(response, status, headers, config){
                $timeout(function(){
                    $scope.topiclist = response.data.list;
                    console.log($scope.topiclist);
                    $scope.totalCount = response.totalCount;
                    $scope.ismore = $scope.pageSize * $scope.pageIndex;
                    $scope.hasMore =($scope.ismore <= $scope.totalCount);
                    $scope.ismoreshow =($scope.topiclist.length < $scope.totalCount);
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

  }
]);


APP.service('qSearchBiaoService', ['$http', 'UrlService', function ($http, UrlService) {
    //获取圈子信息
    this.gettopic= function (config) {
        return $http.post(UrlService.getUrl('GETTOPICBYCONDITION'),config);
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
