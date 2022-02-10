/**
 * creator:feng.jiang@dhc.com.cn
 * create time:2016/10/11
 * describe：TopicController 测试控制器
 **/

APP.controller('QwschoolController', ['$scope', '$rootScope', '$ionicHistory', 'QwschoolService', '$http', '$state','CLASSIFYMESSAGECRNTERService',
  '$timeout', 'PopupService','$ionicScrollDelegate',
  function ($scope, $rootScope, $ionicHistory, QwschoolService, $http, $state, CLASSIFYMESSAGECRNTERService, $timeout, PopupService,$ionicScrollDelegate) {
    //    初始化参数
    $scope.tielist = '';//帖子数据
    $scope.flagNum = false;
    $scope.quanlist = '';//圈子数据
    $scope.classlist = '';//课程数据
    $scope.ziliaolist = '';//资料数据
    $scope.buttonshowl = false;//左圆边
    $scope.buttonshowr = true;//右圆边
    $rootScope.xiaoxis = false;//消息显示
    $scope.isjiazai = 0;//加载数据
    $scope.nogengduo = '';//没有更多
    $scope.userdata = '';//用户信息
    $scope.selectedIndex = undefined;
    $scope.hasMore = true;//控制知否加载更多的开关。
    $scope.ismore = true;//控制知否加载更多的开关。
    $scope.message = '';//提示内容
    $scope.catelist='';//分类列表
    $scope.selectCheck='';
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


    //点击帖子跳转
    $scope.gototiezi = function (item) {
      $state.go('classNoteDetails', {noteId: item.id});
    };
    //跳转我的主页
    $scope.gotomyzhu = function () {
      $state.go('personalHomepageMe');
    };
    //跳转别人主页
    $scope.gotoothers = function (item) {
      $state.go('personalHomepageHe', {othersId: item.userCode});
    };
    //跳转到搜索
    $scope.gotoqSearch = function () {
      $state.go('qSearch');
    };
    //跳转消息
    $scope.gotoxiaoxi = function () {
      $state.go('messageCenter');
    };
    //跳转到资料库
    $scope.gotoziliao = function () {
      $state.go('qdatabase');
    };
    //点赞
    $scope.dianzan = function (id, index) {
      var param = {
        id: id,
        noLoading: true
      };
      QwschoolService.postdianzan(param)
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
        QwschoolService.postshoucang(cang).success(function (response, status, headers, config) {
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
        QwschoolService.postshoucang(cang).success(function (response, status, headers, config) {
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
    //获取商品分类信息
    $scope.selectlist=function(item){
      if($scope.selectCheck==item){
        $scope.selectCheck='';
        $scope.storyid='';
        $scope.initdata();
      }else{
        $scope.pageIndex=1;
        $scope.selectCheck=item;
        $scope.storyid=parseInt(item);
      // console.log($scope.storyid);
      var config = {
        pageSize: $scope.pageSize,
        pageIndex: $scope.pageIndex,
        categoryId: $scope.storyid,
        noLoading: true
      }
      $timeout(function () {
        QwschoolService.getstorylist(config).success(function (response, status, headers, config) {
          console.log(response);
          $scope.tielist = response.data.list;
          $scope.totalCount = response.totalCount;
          console.log($scope.tielist);
          $scope.ismore = $scope.pageSize * $scope.pageIndex;
          $scope.hasMore = ($scope.ismore <= $scope.totalCount);
          $scope.$broadcast('scroll.refreshComplete');
          $scope.$broadcast('scroll.infiniteScrollComplete');
          return response;
        }).error(function () {
          console.log('获取数据失败');
        });
      }, 300);
      }
      
    }

    //拉动加载数据
    $scope.initdata = function () {
      //数据初始化
      $scope.storyid='';
      $scope.selectCheck='';
      $scope.pageSize = 5;//每页加载的数据条数。
      $scope.pageIndex = 1;//当前页码。
      var config = $scope.userdata ?
      {
        pageSize: $scope.pageSize,
        pageIndex: $scope.pageIndex,
        noLoading: true
      } : {
        pageSize: $scope.pageSize,
        pageIndex: $scope.pageIndex
      };
      $timeout(function () {
        QwschoolService.getstorylist(config).success(function (response, status, headers, config) {
          $scope.tielist = response.data.list;
          $scope.totalCount = response.totalCount;
          console.log($scope.tielist);
          if($scope.tielist<5){
            $scope.hasMore=false;
          }else{
            $scope.hasMore = true;
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
          // $scope.ismore = $scope.pageSize * $scope.pageIndex;
          return response;
        }).error(function () {
          console.log('获取数据失败');
        });
      }, 300);
    };
    //上拉加载更多
    $scope.loadData = function () {
        $scope.pageIndex = $scope.pageIndex + 1;
        console.log('if成立' + $scope.totalCount);
        if($scope.storyid){
          var config =
          {
            pageSize: $scope.pageSize,
            pageIndex: $scope.pageIndex,
            categoryId: $scope.storyid,
            noLoading: true
          };
        }else{
          var config =
          {
            pageSize: $scope.pageSize,
            pageIndex: $scope.pageIndex,
            noLoading: true
          };
        }
          QwschoolService.getstorylist(config).success(function (response, status, headers, config) {
            timerLoadMore = setTimeout(function () {
              if(response.data.list.length<5){
                $scope.hasMore=false;
                PopupService.showToast('没有更多数据');
                $scope.nogengduo = "没有更多数据";
          // return $scope.hasMore;
              }else{
                $scope.hasMore=true;
              }
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
        }

    //页面初始化
    $scope.init = function () {
      $scope.selectedIndex = undefined;
      //获取消息
      var noLoading = {
        noLoading: true
      };
      QwschoolService.business().success(function(response){
        console.log(response);
        $scope.catelist=response.data.list;
      })
      QwschoolService.getxiaoxi(noLoading).success(function (response, status, headers, config) {
        $rootScope.msgCount = response.data;
        $scope.topshow = ($rootScope.msgCount != 0);
        if(response.data && response.data !=0){
          $scope.flagNum = true;
        }else{
          $scope.flagNum = false;
        }
      }).error(function () {
        console.log('获取数据失败');
      });
      //获取个人信息
      var type = {
        'id': 1,
        'type': 1,
        noLoading: true
      };
      QwschoolService.getuserdata(type)
        .success(function (response, status, headers, config) {
          $scope.userdata = response.data;
          console.log($scope.userdata);
          return response;
        }).error(function () {
          console.log('获取数据失败');
        });

      //获取课程
      var isclass = {
        noLoading: true
      };
      QwschoolService.getclass(isclass)
        .success(function (response, status, headers, config) {
          $scope.classlist = response.data.list;
          console.log($scope.classlist);
          return response;
        });
      //下拉刷新
      $scope.hasMore = true;//控制知否加载更多的开关。
      $scope.initdata();
    };
    //加载页面
    $scope.$on('$ionicView.beforeEnter', function (event, v) {
      console.log(v);
     if ($rootScope.nextPageBefore == 'classNoteDetails') {
        console.log('$rootScope.nextPageBefore', $rootScope.nextPageBefore);
        $rootScope.nextPageBefore = '';
        // $scope.hasMore = true;
        console.log('前页返回');
        console.log('打印V', v);
      }else{
        $('ion-header-bar').show();
        $rootScope.xiaoxis = false;
        $rootScope.showRightTop = false;
        //$scope.$broadcast('closeMsg');
        $scope.init();
      }
    });
    $scope.$on('$stateChangeStart', function () {
      $scope.hasMore = false;
      clearTimeout(timerLoadMore);
    })
  }]);


APP.service('QwschoolService', ['$http', 'UrlService', function ($http, UrlService) {
  //最新帖子
  this.getstorylist = function (config) {
    return $http.post(UrlService.getUrl('GETUPDATELIST'), config);
  };
  //获取个人信息
  this.getuserdata = function (config) {
    return $http.post(UrlService.getUrl('USER_SIMPLE_INFO'), config);
  };

  //获取课程  GETCOURSEINFO
  this.getclass = function (config) {
    return $http.post(UrlService.getUrl('GETCOURSEINFO'), config);
  };
  //获取消息
  this.getxiaoxi = function () {
    return $http.get(UrlService.getUrl('UNRED_MESSAGE'));
  };
  //点赞
  this.postdianzan = function (config) {
    return $http.post(UrlService.getUrl('SCHOOLPRAISESTORY'), config);
  };
  //收藏
  this.postshoucang = function (config) {
    return $http.post(UrlService.getUrl('SCHOOLCOLLECTION'), config);
  };
  //分类
  this.business=function(config){
    return $http.post(UrlService.getUrl('GET_BUSINESS'), config)
  }

}]);
