/**
 * 我关注的页面
 * Created by shantao.wang on 2016/10/12.
 */
APP.controller('myFollowCtrl', ['$scope', '$rootScope', '$timeout', '$state', 'PopupService', 'myFollowService', 'myFansService',
  function ($scope, $rootScope, $timeout, $state, PopupService, myFollowService, myFansService) {
    /**
     * 变量声明
     */
    //$scope.messageNum = undefined;//未读消息数量
    //$scope.ifRed = undefined;//小红点
    //$scope.isFollowed = true;//我关注的人必然是已关注的
    $scope.isDisplay = false;//更多菜单弹窗
    $scope.nothing = false;//空背景默认不显示
    $scope.interested = [];//感兴趣的人
    $scope.myFollowsData = {
      pageIndex: 0,//页码
      pageSize: 6,//每页数量
      myFollows: [],//我关注的人
      hasMore: true,//还有没有
      api: function (pageIndex, pageSize) {
        return myFollowService.getMyFollows(pageIndex, pageSize);//访问接口
      }
    };
    /**
     * 页面初始化方法
     */
    $scope.init = function () {
      $scope.nothing = false;//空背景默认不显示
      $scope.isDisplay = false;
      $scope.myFollowsData.pageIndex = 0;//从第一页开始
      $scope.myFollowsData.myFollows = [];//清空关注的人
      $scope.myFollowsData.hasMore = true;//默认有
      myFansService.getMyInterested(1, 3).then(function (res) {//获取感兴趣的人
        $scope.interested = res.data.data.list;
      }, function () {
        PopupService.showToast("网络错误！");
      });
      $scope.loadFollowData($scope.myFollowsData, 0);//获取我关注的人，timeout=0
    };
    /**
     * 监听视图事件
     */
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.init();
      /* if (v.direction == "forward" || v.direction == "exit" || v.direction == "none") {
       $scope.init();
       }
       else if (v.direction == "back" && $scope.interested.length && $scope.interested.length < 3) {
       $scope.init();
       }*/
    });
    /**
     * 上拉刷新加载更多已关注的人方法
     */
    $scope.loadFollowData = function (array, time) {
      if (time == undefined) time = 1000;
      array.pageIndex = array.pageIndex + 1;
      console.log('我关注的入参：', array.pageIndex, array.pageSize);
      array.api(array.pageIndex, array.pageSize)
        .success(function (data) {
          $timeout(function () {
            if (data.success == true) {
              console.log('我关注的出参：', data);
              array.hasMore = array.pageIndex * array.pageSize < data.totalCount;
              array.myFollows = array.myFollows.concat(data.data.list);//核心语句：实现要遍历的数组的加长，即实现了加载更多
              $scope.nothing = !array.myFollows.length;
              $scope.$broadcast('scroll.infiniteScrollComplete');
              $scope.$broadcast('scroll.refreshComplete');
            } else {
              console.log(data.message);
            }
          }, time);
        })
        .error(function () {
          PopupService.showToast("网络失败！");
        });
    };
    /**
     * 关注/取关感兴趣的人方法
     */
    $scope.followI = function (person, isFollow) {
      var bin = isFollow ? 1 : 0;
      console.log('关注入参' + person.memberId + 1);
      myFansService.follow(person.memberId, bin)
        .success(function (data) {
          if (data.success == true) {
            //PopupService.showToast(isFollow ? "已关注！" : "已取消关注");
            console.log('出参' + data.data);
            console.log(person.memberId + "操作成功！");
            for (var i = 0; i < $scope.interested.length; i++) {
              if (person.memberId == $scope.interested[i].memberId) {
                $scope.interested.splice(i, 1);//关注完成删除该元素
                console.log('感兴趣：', $scope.interested);
                console.log('关注：', $scope.myFollowsData.myFollows);
                $scope.alreadyFollow = true;
                $timeout(function () {
                  $scope.alreadyFollow = false;
                }, 1000);
              }
            }
            $scope.nothing = false;
            //person.memberId = !person.memberId;
            person.isFollow = !person.isFollow;
            person.followId = person.memberId;
            $scope.myFollowsData.myFollows.push(person);

            console.log('关注：', $scope.myFollowsData.myFollows);
          } else {
            console.log(data.message);
          }
        })
        .error(function () {
          PopupService.showToast("网络失败！");
        });
    };
    /**
     * 关注/取关已关注的人方法
     */
    $scope.followF = function (person, isFollow) {
      var bin = isFollow ? 1 : 0;
      //console.log('关注入参'+id+1);
      var id = person.followId ? person.followId : person.memberId;
      myFansService.follow(id, bin)
        .success(function (data) {
          if (data.success == true) {
            console.log('出参' + data.data);
            console.log(id + "操作成功！");
            for (var i = 0; i < $scope.myFollowsData.myFollows.length; i++) {
              if (id == $scope.myFollowsData.myFollows[i].followId) {
                $scope.myFollowsData.myFollows.splice(i, 1);//关注完成删除该元素
                if (!$scope.myFollowsData.myFollows.length) $scope.nothing = true;
              }
            }
          } else {
            console.log(data.message);
          }
        })
        .error(function () {
          PopupService.showToast("网络失败！");
        });
    };
    /**
     * 更多菜单
     */
    //打开
    $scope.show = function () {
      $scope.isDisplay = !$scope.isDisplay;
    };
    //关闭
    $scope.disappear = function () {
      $scope.isDisplay = false;
    };
    /**
     * 页面跳转方法
     */
    //更多感兴趣的人
    $scope.more = function () {
      $state.go('moreInteresting');
    };
    //消息中心
    $scope.jumpMsg = function () {
      $state.go('messageCenter');
    };
    //TA的主页
    $scope.viewHim = function (person) {
      if (person.followId) {
        $state.go('personalHomepageHe', {othersId: person.followId});
      } else {
        $state.go('personalHomepageHe', {othersId: person.memberId});
      }
    };
  }
])
;
/**
 * 我关注的页面服务
 */
APP.service('myFollowService', ['$http', 'UrlService', function ($http, UrlService) {
  //我的关注接口
  this.getMyFollows = function (pageIndex, pageSize) {
    var postData = {
      pageIndex: pageIndex,
      pageSize: pageSize
    };
    return $http({
      method: 'post',
      url: UrlService.getUrl('MY_FOLLOWS'),
      data: postData
    });
    //假数据
    /*return $http.get("data/myFollows.json", config);*/
  };
}]);

