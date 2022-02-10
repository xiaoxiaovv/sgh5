/**
 * creator:feng.jiang@dhc.com.cn
 * create time:2016/10/11
 * describe：TopicController 测试控制器
 **/

APP.controller('QhotController', ['$scope', '$rootScope','PlatformService','HomePageService','CLASSIFYMESSAGECRNTERService', '$ionicHistory', 'QhotService', 'ShopService', '$http', '$ionicSlideBoxDelegate', '$state',
  '$timeout', 'UserService', 'PopupService', '$ionicScrollDelegate',
  function ($scope, $rootScope,PlatformService,HomePageService ,CLASSIFYMESSAGECRNTERService,$ionicHistory, QhotService, ShopService, $http, $ionicSlideBoxDelegate, $state, $timeout,
    UserService, PopupService, $ionicScrollDelegate) {
    //    初始化参数
    $scope.flagNum = false;
    $scope.tielist = ''; //帖子数组
    $scope.quanlist = ''; //圈子数组
    $scope.bannerlist = ''; //轮播图
    $scope.selectedIndex = ''; //选择
    $rootScope.xiaoxis = false; //消息显示
    $scope.dataList = []; //加载数据
    $scope.nogengduo = ''; //没有更多的提示
    $scope.userdata = ''; //用户信息
    $scope.topshow = false; //消息小红点判断
    $scope.hasMore = true; //控制知否加载更多的开关。
    $scope.ismore = true; //控制知否加载更多的开关。
    $scope.totalCount = ''; //获取的帖子总数
    $scope.datafist = ''; //判断用户第一次
    $scope.message = ''; //提示内容
    $scope.showList = false;//展示列表
    var timerLoadMore = null;

    /*   右上角菜单 代码  开始*/
    $rootScope.showRightTop = false; //是否显示右上角 菜单
    $rootScope.msgCount = ''; //未读消息数

    //显示隐藏右上角菜单
    $scope.toggleMenu = function () {
      $rootScope.showRightTop = !$rootScope.showRightTop;
      $rootScope.xiaoxis = !$rootScope.xiaoxis;
    };
    /*  右上角 菜单代码 结束 */


    //点击帖子跳转
    $scope.gototiezi = function (item) {
      $state.go('noteDetails', {
        noteId: item.id,
        isShortStory: item.isShortStory
      });
    };
    //跳转消息
    $scope.gotoxiaoxi = function () {
      $state.go('ClassifyMessageCenter');
    };
    //跳转我的主页
    $scope.gotomyzhu = function () {
      $state.go('personalHomepageMe');
    };
    //跳转别人主页
    $scope.gotoothers = function (item) {
      $state.go('personalHomepageHe', {
        othersId: item.userCode
      });
    };
    //跳转到圈子
    $scope.gotoquanezi = function (item) {
      $state.go('circlePage', {
        circleId: item.id
      });
    };
    //跳转到热门圈子
    $scope.gotohotquanezi = function () {
      $state.go('allCircle');
    };
    //回到顶部
    $scope.scrollToTop = function () {
      $ionicScrollDelegate.$getByHandle('qhotHandle').scrollTop(true);
      $scope.showTopBtn = false;
    };

    //获取滑动高度
    $scope.getScrollHeight = function () {
      console.log('进方法了么');
      $scope.scrollHeight = Math.abs(document.getElementById("bbb").getBoundingClientRect().top); //获取滚动高度
      console.log(document.getElementById("bbb"));
      if ($scope.scrollHeight > $scope.phoneHeight * 3) {
        $scope.showTopBtn = true;
      } else {
        $scope.showTopBtn = false;
      }
      console.log('$scope.scrollHeight', $scope.scrollHeight);
      console.log('$scope.phoneHeight', $scope.phoneHeight);
      console.log('$scope.showTopBtn', $scope.showTopBtn);
    };
    $scope.hotgo = function () {
      var scroll = $ionicScrollDelegate.$getByHandle('pinglun');
      var hotwidth = scroll.getScrollPosition().left;
      var width = document.getElementById("hotdiv").offsetWidth;
      console.log('scolle宽度', width * 4.3);
      console.log('hotwidth', hotwidth);
      console.log('width', width);
      var is = hotwidth > (width * 4.3) ? true : false;
      if (is) {
        $state.go('allCircle');
      } else {
        console.log('scolle宽度', width);
      }
    };
    //跳转到搜索
    $scope.gotoqSearch = function () {
      $state.go('qSearch');
    };

    //获取 cookie
    function getCookie(name)
    {
      var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
      if(arr=document.cookie.match(reg)) return unescape(arr[2]);
      else return null;
    }
    //贴子点赞
    $scope.dianzan = function (id, index) {
      // console.log($scope.tielist[index].topicId);
      if (window.cordova) {
        $rootScope.gio.track('like', {
          circleID: $scope.tielist[index].topicId
        });
        $rootScope.gio.track('active', {
          circleID: $scope.tielist[index].topicId
        });
      }
      //获取 uuid
      var uuid = getCookie('loginId');
      console.log(uuid);
      var param = {
        id: id,
        noLoading: true,
        userCode: uuid
      };
      QhotService.postdianzan(param)
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
        QhotService.postshoucang(cang).success(function (response, status, headers, config) {
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
        QhotService.postshoucang(cang).success(function (response, status, headers, config) {
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
      $scope.pageSize = 5; //每页加载的数据条数。
      $scope.pageIndex = 1; //当前页码。
      //获取 uuid
      var uuid = getCookie('loginId');
      console.log(uuid);
      var config = $scope.quanlist ? {
        pageSize: $scope.pageSize,
        pageIndex: $scope.pageIndex,
        noLoading: true,
        userCode: uuid
      } : {
        pageSize: $scope.pageSize,
        pageIndex: $scope.pageIndex,
        userCode: uuid
      };
      $timeout(function () {
        QhotService.getstorylist(config).success(function (response, status, headers, config) {
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
    };
    //上拉加载更多
    $scope.loadData = function () {

      $scope.pageIndex += 1;
      //获取 uuid
      var uuid = getCookie('loginId');
      console.log(uuid);
      var searchTag = {
        pageSize: 5,
        pageIndex: $scope.pageIndex,
        noLoading: true,
        userCode: uuid
      };

      QhotService.getstorylist(searchTag)
        .success(function (response) {
          if (response.data.list && response.data.list.length != 0) {
            timerLoadMore = setTimeout(function () {
              $scope.tielist = $scope.tielist.concat(response.data.list);
              $scope.totalCount = response.totalCount;
              $scope.$broadcast('scroll.infiniteScrollComplete');
              var len = $scope.tielist.length;
              $scope.hasmore = !(len == response.totalCount);
              $scope.$broadcast('scroll.refreshComplete');
              $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 1000);

          } else {
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.hasmore = false;
            // $scope.circleList = [];
            // PopupService.showToast('没有更多消息了');
          }
        })
        .error(function () {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };
    /************************* P2 ****************************/
    $scope.jumpBannerUrl = function (type,url) {
      if(type==0){
        var arr = url.split('/');
        console.log(arr);
        if (arr[1] == 'noteDetails') {
          console.log(arr[2]);
          console.log(arr[3]);
          $state.go('noteDetails', {
            noteId: arr[2],
            isShortStory: arr[3]
          });
        } else if(arr[1] =='circlePage'){
          $state.go('circlePage', {
            circleId: arr[2]
          });
        }else{
          $state.go('personalHomepageMe');
        }
      }else if(type==1){
        if(url.indexOf('mobiletest.ehaier.com:8880')>-1||url.indexOf("pre.m.ehaier.com:8880")>-1||url.indexOf("thsq.ehaier.com")>-1){
        // }
        // if(url=='http://mobiletest.ehaier.com:8880/wap?webview=1.2'){
          var urlss = url+"&openType=h5";
          // var urlss=url+'&openType=h5'
          if (PlatformService.getPlatform() == 'APP') {
            cordova.InAppBrowser.open(urlss, '_system', 'location=yes');
          } else {
            window.open(urlss);
          }
        }else{
        var u = navigator.userAgent;
          if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
            if (PlatformService.getPlatform() == 'APP') {
              cordova.InAppBrowser.open(url, '_system', 'location=yes');
            } else {
              window.open(url);
            }
          } else if (u.indexOf('iPhone') > -1) {
            if (PlatformService.getPlatform() == 'APP') {
              cordova.InAppBrowser.open(url, '_system', 'location=yes');
            } else {
              window.open(url);
            }
          } else {
            if (PlatformService.getPlatform() == 'APP') {
              cordova.InAppBrowser.open(url, '_system', 'location=yes');
            } else {
              window.open(url);
            }
          }
        }
      }
    };
    $scope.showCameraList = function () {
      $scope.showList = !$scope.showList;
    };
    $scope.hideList = function () {
      $scope.showList = false;
    };
    //item弹框
    $scope.isClick = function () {
      $scope.isDisplay = !$scope.isDisplay;
    };
    $scope.jumpPhoto = function (item) {
      // $scope.showList = false;
      // $state.go('publishCircle', {identifierCode:'', topicId:'',topicStyle:index});
      HomePageService.isWdHost()
        .success(function (res) {
          $rootScope.isWdHost = res.data.isHost;
          if($rootScope.isWdHost==-1){//如果没有登录 跳转到登录页面
            $state.go('login');
          }else{
            $scope.showList = false;
            if (item != 3) {
              $state.go('publishCircle', { identifierCode: '', topicId: $scope.circleId, topicStyle: item });
            } else {
              if (window.medias) {
                window.medias.StartMedias('5s', '30s', '5', '50', function (success) {
                  console.log(success);
                  var jsonVideo=JSON.parse(success);
                  var videoString=jsonVideo.videoFile;
                  var videoimg=jsonVideo.imageFile;
                  console.log(typeof videoString);
                  var vv=videoString.replace('\\','');
                  var vi=videoimg.replace('\\','');
                  // $scope.mediaurl=success.videoFile.replace(/[\'\"\\\/\b\f\n\r\t]/g, '');
                  $rootScope.mediaurla=vv;
                  $rootScope.mediaImga=vi;
                  $state.go('publishCircle', { identifierCode: '', topicId: $scope.circleId, topicStyle: item });
                }, function (error) {
                  console.log(error)
                })
              }
            }
          }
        })
      
      console.log('item', item);
    };
    /************************* P2 ****************************/

    /**
     *   页面初始化数据
     **/
    $scope.init = function () {
      $scope.showList = false;
      $scope.isDisplay = false;
      $scope.phoneHeight = document.documentElement.clientHeight / 2; //获取手机屏幕高度
      //热门圈子滑动条
      var fen = $scope.quanlist ? {
        'pageIndex': 1,
        'pageSize': 15,
        noLoading: true
      } : {
        'pageIndex': 1,
        'pageSize': 15
      };
      QhotService.gettopic(fen).success(function (response, status, headers, config) {
        $scope.quanlist = response.data.list;
        console.log($scope.quanlist);
        return response;
      }).error(function () {
        console.log('获取数据失败');
      });
      //获取轮播图数据
      var lei = $scope.quanlist ? {
        'bannerType': 0,
        noLoading: true
      } : {
        'bannerType': 0
      };
      QhotService.getlunbo(lei)
        .success(function (response, status, headers, config) {
          console.log(response)
          $scope.bannerlist = response.data.list;
          console.log($scope.bannerlist);
          $ionicSlideBoxDelegate.$getByHandle('qhot_slider').update();
          console.log($scope.bannerlist);
          return response;
        }).error(function () {
          console.log('获取数据失败');
        });
      console.log($scope.bannerlist);
      //获取消息
      var param = {
        noLoading: $scope.quanlist ? true : ''
      };
      QhotService.getxiaoxi(param).success(function (response, status, headers, config) {
        $rootScope.msgCount = response.data;
        $scope.topshow = ($rootScope.msgCount != 0);
        console.log('消息数量' + $rootScope.msgCount);
      }).error(function () {
        console.log('获取数据失败');
      });
      //下拉刷新
      $scope.hasMore = true; //控制知否加载更多的开关。
      $scope.initdata();
      //未读消息数量和最新消息
      ShopService.getMessage()
        .success(function (response) {
          if (response.data.count > 0) {
            $scope.flagNum = true;
          } else {
            $scope.flagNum = false;
          }
        })
    };
    /**
     *   on方法
     **/
    $scope.$on('$ionicView.beforeEnter', function (event, v) {
      if (window.cordova) {
        $rootScope.gio.track("communityEntry")
      }

      if ($rootScope.nextPageBefore == 'noteDetails') {
        console.log('$rootScope.nextPageBefore', $rootScope.nextPageBefore);
        $rootScope.nextPageBefore = '';
        $scope.hasMore = true;
        console.log('前页返回');
        console.log('打印V', v);
      }else {
        console.log('打印V', v);
        console.log('v哪个页面返回', v.direction);
        $('ion-header-bar').show();
        //判断第一次用户进入
        $timeout(function () {
          QhotService.getusertopic().success(function (response, status, headers, config) {
            $scope.datafist = response.data;
            //$scope.datafist=true;
            if ($scope.datafist) {
              $state.go('quanziRecommend');
            } else {
              console.log("进入社区");
            }
          }).error(function () {
            console.log("判断用户第一次进入社区失败");
          });
        }, 1000);
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
  }
]);


APP.service('QhotService', ['$http', 'UrlService', function ($http, UrlService) {
  //获取热门帖子信息
  this.getstorylist = function (config) {
    return $http.post(UrlService.getUrl('GETHOTSTORYLIST'), config);
  };
  //获取个人信息
  this.getuserdata = function (config) {
    return $http.post(UrlService.getUrl('USER_SIMPLE_INFO'), config);
  };
  //获取消息
  this.getxiaoxi = function (param) {
    return $http.get(UrlService.getUrl('UNRED_MESSAGE'), param);
    //return $http.get('http://mobiletest.ehaier.com:38080/trunk/v3/platform/web/member/unread_message.json');
  };
  //获取轮播图
  this.getlunbo = function (config) {
    return $http.post(UrlService.getUrl('GETBANNERLIST'), config);
  };
  //获取热门圈子
  this.gettopic = function (config) {
    return $http.post(UrlService.getUrl('GETHOTTOPICLIST'), config);
  };
  //判断用户进入社区
  this.getusertopic = function (config) {
    return $http.post(UrlService.getUrl('ADDUSER'), config);
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
