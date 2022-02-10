/**
 * creator:feng.jiang@dhc.com.cn
 * create time:2016/10/11
 * describe：TopicController 测试控制器
 **/

APP.controller('QmineController', ['$scope', '$rootScope', '$ionicHistory', 'QmineService', '$http', '$ionicSlideBoxDelegate','CLASSIFYMESSAGECRNTERService',
  '$state', '$timeout', 'PopupService', 'MyCirclePagesService',
  function ($scope, $rootScope, $ionicHistory, QmineService, $http, $ionicSlideBoxDelegate,CLASSIFYMESSAGECRNTERService, $state, $timeout, PopupService, MyCirclePagesService) {
    //    初始化参数
    $scope.tielist = '';//帖子数组
    $scope.flagNum = false;
    $scope.quanlist = '';//圈子数组
    $scope.tuiquanlist = '';//推荐圈子数组
    $scope.lunlist = '';//轮播图数组
    $scope.selectedIndex = '';//选择
    $rootScope.xinxianshow = false;//新鲜事显示
    $rootScope.myquanshow = true;//我的圈子显示
    $rootScope.buttonshowl = false;//按钮左侧圆边效果
    $rootScope.buttonshowr = true;//按钮右侧圆边效果
    $rootScope.xiaoxis = false;//消息显示隐藏
    $scope.userdata = '';
    $scope.hasMore = true;//控制知否加载更多的开关。
    $scope.ismore = true;//控制知否加载更多的开关。
    $scope.message = '';//提示内容
    var timerLoadMore = null;
    /*   右上角菜单 代码  开始*/
    $rootScope.showRightTop = false;//是否显示右上角 菜单
    //$rootScope.msgCount = '' ;//未读消息数
    //显示隐藏右上角菜单
    $scope.toggleMenu = function () {
      $rootScope.showRightTop = !$rootScope.showRightTop;
      $rootScope.xiaoxis = !$rootScope.xiaoxis;
    };
    /*  右上角 菜单代码 结束 */

    //显示隐藏方法
    $scope.xxshow = function () {
      $rootScope.xinxianshow = true;
      $rootScope.myquanshow = false;
      $rootScope.buttonshowl = true;
      $rootScope.buttonshowr = false;
    };
    $scope.wdshow = function () {
      $rootScope.xinxianshow = false;
      $rootScope.myquanshow = true;
      $rootScope.buttonshowl = false;
      $rootScope.buttonshowr = true;
    };

    //点击帖子跳转
    $scope.gototiezi = function (item) {
      $state.go('noteDetails', {noteId: item.id, isShortStory: item.isShortStory});
    };
    //跳转我的主页
    $scope.gotomyzhu = function () {
      $state.go('personalHomepageMe');
    };
    //跳转消息
    $scope.gotoxiaoxi = function () {
      $state.go('ClassifyMessageCenter');
    };
    //跳转别人主页
    $scope.gotoothers = function (item) {
      $state.go('personalHomepageHe', {othersId: item.userCode});
    };
    //跳转到圈子
    $scope.gotoquanezi = function (item) {
      $state.go('circlePage', {circleId: item.id});
    };
    //跳转到热门圈子
    $scope.gotohotquanezi = function () {
      $state.go('allCircle');
    };
    //跳转到搜索
    $scope.gotoqSearch = function () {
      $state.go('qSearch');
    };
    //加入圈子
    $scope.joinCircle = function (item) {
      if(window.cordova){
        $rootScope.gio.track('follow', {circleID:item.id});
        $rootScope.gio.track('active', {circleID:item.id});
      }
      $scope.itemTopicName = item.topicName;
      var ids = {
        ids: item.id,
        noLoading: true
      };
      QmineService.joinTopic(ids)
        .success(function (response) {
          if (response.success == true) {
            item.isJoin = 1;
            item.topicFocusFlag = 1;
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
    };
    //点赞
    $scope.dianzan = function (id, index) {
      if(window.cordova){
        $rootScope.gio.track('like', {circleID:$scope.tielist[index].topicId});
        $rootScope.gio.track('active', {circleID:$scope.tielist[index].topicId});
      }
      var param = {
        id: id,
        noLoading: true
      };
      console.log($scope.tielist[index]);
      QmineService.postdianzan(param)
        .success(function (response) {
          if (response.success == true) {
            if ($scope.tielist[index].praiseFlag == 1) {
              $scope.tielist[index].praiseNumber = $scope.tielist[index].praiseNumber - 1;
              $scope.tielist[index].praiseFlag = !$scope.tielist[index].praiseFlag;
              console.log('取消点赞成功');
            } else {
              $scope.tielist[index].praiseNumber = $scope.tielist[index].praiseNumber + 1;
              $scope.tielist[index].praiseFlag = !$scope.tielist[index].praiseFlag;
              console.log('点赞成功');
            }
          } else {
            $timeout(function () {
              PopupService.showToast(response.message);
            }, 200);
          }
        });
    };
    //收藏
    $scope.shoucang = function (item) {
      var cang = {
        'id': item.id,
        noLoading: true
      };
      if (item.collectionFlag == 0) {
        QmineService.postshoucang(cang).success(function (response, status, headers, config) {
          if (response.success == true) {
            item.collectionFlag = 1;
            item.collectionNumber++;
          } else {
            PopupService.showToast(response.message);
          }
          return response;
        }).error(function () {
          console.log('收藏失败');
        });
      } else {
        QmineService.postshoucang(cang).success(function (response, status, headers, config) {
          if (response.success == true) {
            item.collectionFlag = 0;
            item.collectionNumber--;
          }
          return response;
        }).error(function () {
          console.log('取消收藏失败');
        });
      }
    };

    //拉动加载数据
    $scope.initdata = function () {
      //数据初始化
      $scope.pageSize = 5;//每页加载的数据条数。
      $scope.pageIndex = 1;//当前页码。
      var config = $scope.quanlist ?
      {
        pageSize: $scope.pageSize,
        pageIndex: $scope.pageIndex,
        noLoading: true
      } : {
        pageSize: $scope.pageSize,
        pageIndex: $scope.pageIndex
      };
      $timeout(function () {
        QmineService.gettielist(config).success(function (response, status, headers, config) {
          if(response.success){
            $scope.tielist = response.data.list;
            $scope.totalCount = response.totalCount;
            console.log($scope.tielist);
            $scope.ismore = $scope.pageSize * $scope.pageIndex;
            $scope.hasMore = ($scope.ismore <= $scope.totalCount);
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$broadcast('scroll.infiniteScrollComplete');
            return response;
          }
          
        }).error(function () {
          console.log('获取数据失败');
        });
      }, 300);
    };
    //上拉加载更多
    $scope.loadData = function () {
      $timeout(function () {
        $scope.ismore = $scope.pageIndex * $scope.pageSize;
        $scope.hasMore = ($scope.ismore <= $scope.totalCount);
        $scope.pageIndex = $scope.pageIndex + 1;
        console.log('if成立' + $scope.totalCount);
        if ($scope.hasMore) {  //修改加载条数
          var config =
          {
            pageSize: $scope.pageSize,
            pageIndex: $scope.pageIndex,
            noLoading:true
          };
          QmineService.gettielist(config).success(function (response, status, headers, config) {
            timerLoadMore = setTimeout(function () {
              $scope.tielist = $scope.tielist.concat(response.data.list);
              $scope.totalCount = response.totalCount;
              console.log($scope.tielist);
              $scope.$broadcast('scroll.refreshComplete');
              $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 30);
            return response;
          }).error(function () {
            console.log("查询失败");
          });
        } else {
          PopupService.showToast('没有更多数据');
          $scope.nogengduo = "没有更多数据";
          return $scope.hasMore;
        }
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }, 1000);
    };

    //获取我创建的圈子信息
    $scope.getMyCreatTopicInfo = function (param) {
      var params = {
        keywords: param
      };
      MyCirclePagesService.getMyCreatTopics(params)
        .then(function (res) {
          if(res.data.success){
            $scope.myCreatTopics = res.data.data.list;
          }
        }, function (error) {

        });
    };
    //获取我的加入圈子信息
    $scope.getMyJoinedCircleInfo = function (param) {
      var params = {
        keywords: param
      };
      MyCirclePagesService.getMyJoinedTopics(params)
        .then(function (res) {
          if(res.data.success){
            $scope.myTopics = res.data.data.list;
          }
        }, function (error) {

        });
    };
    $scope.clickIn = function (id, auditStatus) {
      if (auditStatus == 0) {
        $state.go('circlePage', {circleId: id});
      } else if (auditStatus == 2) {
        $rootScope.showApplyTag = 1;
        $rootScope.reviewCircleId = id;
        $state.go('applyCircle');
      } else {
        $rootScope.reviewCircleId = id;
        $state.go('applyCircle');
      }
    };
    //进入某个圈子
    $scope.viewTopic = function (id) {
      $state.go('circlePage', {circleId: id});
    };
    /**
     * 初始化
     */
    $scope.init = function () {
      $scope.myCreatTopics=[];
      $scope.myTopics=[];
      $scope.tielist = '';//帖子数组
      $scope.quanlist = '';//圈子数组
      $scope.tuiquanlist = '';//推荐圈子数组
      $scope.lunlist = '';//轮播图数组
      $scope.selectedIndex = '';//选择
      $rootScope.xinxianshow = false;//新鲜事显示
      $rootScope.myquanshow = true;//我的圈子显示
      $rootScope.buttonshowl = false;//按钮左侧圆边效果
      $rootScope.buttonshowr = true;//按钮右侧圆边效果
      $rootScope.xiaoxis = false;//消息显示隐藏
      $scope.userdata = '';
      $scope.hasMore = true;//控制知否加载更多的开关。
      $scope.ismore = true;//控制知否加载更多的开关。
      $scope.message = '';//提示内容
      var timerLoadMore = null;
      /*   右上角菜单 代码  开始*/
      $rootScope.showRightTop = false;//是否显示右上角 菜单
      $scope.getMyCreatTopicInfo();
      $scope.getMyJoinedCircleInfo();

      $scope.selectedIndex = undefined;
      //获取我的圈子数据
      var user = $scope.quanlist ?
      {
        ids: '',
        noLoading: true
      } : {
        ids: ''
      };
      //我的圈子
      QmineService.gettopic(user).success(function (response, status, headers, config) {
        if(response.success){
          $scope.quanlist = response.data.list;
          return response;
        }
      }).error(function () {
        console.log('获取数据失败');
      });
      var tui = {
        "pageIndex": 1,
        "pageSize": 3
      };
      //推荐圈子
      QmineService.gettuitopic(tui).success(function (response, status, headers, config) {
        if(response.success){
          $scope.tuiquanlist = response.data.list;
          return response;
        }
        
      }).error(function () {
        console.log('获取数据失败');
      });
      var noLoading = $scope.quanlist ?
      {
        noLoading: true
      } : '';
      //获取消息
      QmineService.getxiaoxi(noLoading).success(function (response, status, headers, config) {
        // $rootScope.msgCount = response.data;
        if(response.data && response.data !=0){
          $scope.flagNum = true;
        }else{
          $scope.flagNum = false;
        }
        // $scope.topshow = ($rootScope.msgCount != 0);
      }).error(function () {
        console.log('获取数据失败');
      });
      //数据
      $scope.hasMore = true;//控制知否加载更多的开关。
      $scope.initdata();
    };
    /**
     * on方法
     */
    $scope.$on('$ionicView.beforeEnter', function () {
      if ($rootScope.nextPageBefore == 'noteDetails') {
        console.log('$rootScope.nextPageBefore',$rootScope.nextPageBefore);
        $rootScope.nextPageBefore = '';
        $scope.hasMore = true;
      } else {
        $('ion-header-bar').show();
        $rootScope.showRightTop = false;
        $rootScope.xiaoxis = false;
        $scope.init();
      }
    });
    $scope.$on('$stateChangeStart', function () {
      $scope.hasMore = false;
      clearTimeout(timerLoadMore);
    })
  }]);

APP.service('QmineService', ['$http', 'UrlService', function ($http, UrlService) {
  //获取热门帖子信息
  this.gettielist = function (config) {
    return $http.post(UrlService.getUrl('GETMYFOLLOWINGSTORYLIST'), config);
  };
  //获取个人信息
  this.getuserdata = function (config) {
    return $http.post(UrlService.getUrl('USER_SIMPLE_INFO'), config);
  };

  //获我的圈子
  this.gettopic = function (config) {
    return $http.post(UrlService.getUrl('GETMYTOPICLIST'), config);
  };
  //获推荐圈子
  this.gettuitopic = function (config) {
    return $http.post(UrlService.getUrl('RECOMMEND_LIST'), config);
  };
  //获取消息
  this.getxiaoxi = function () {
    return $http.get(UrlService.getUrl('UNRED_MESSAGE'));
  };
//加入圈子方法
  this.joinTopic = function (param) {
    // return $http.post(UrlService.getUrl('JOIN_TOPIC'));
    return $http({
      method: 'POST',
      url: UrlService.getUrl('JOIN_TOPIC'),
      data: param
    });
  };
  //点赞
  this.postdianzan = function (config) {
    return $http.post(UrlService.getUrl('COMMENT_PRAISE'), config);
  };
  //收藏
  this.postshoucang = function (config) {
    return $http.post(UrlService.getUrl('COLLECTION_TOPIC'), config);
  };

}]);
