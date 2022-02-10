/**
 * Created by lenovo on 2017-6-26.
 */
APP.controller('CrowdFundingHomeControl', ['$timeout','$ionicScrollDelegate','PopupService','CreditService','UrlService','$ionicSlideBoxDelegate', '$rootScope', '$scope', 'CrowdFundingServer', 'UserService', 'GoodsService', 'CommonAddressService', '$stateParams', '$state',
  '$ionicPopup','HomePageService',
  function ($timeout,$ionicScrollDelegate,PopupService,CreditService,UrlService,$ionicSlideBoxDelegate, $rootScope, $scope, CrowdFundingServer, UserService, GoodsService, CommonAddressService, $stateParams, $state, $ionicPopup,HomePageService) {

    /*声明变量*/
    $scope.typeNumber = $stateParams.type;
    $scope.typeNumber = $scope.typeNumber==2 ? 2:1;
    $scope.flagNum = false;
    var typeList = [2, 3, 1];
    $scope.selectedIndex = 0;
    $scope.isFindTab = true; //默认显示 第一个tab
    $scope.brandList = []; //存放数据
    $scope.HomeBanner =[]; // 轮播
    $scope.isFind = true; //是否显示
    $scope.isFindEnd = false;
    $scope.isFindSoon = false;
    $scope.moreProduct = true; // 没有数据让它显示
    $scope.productList = [];
    $scope.newsList = []; //最新上线 商品列表
    $scope.endList = []; //即将结束 商品列表
    $scope.soonList = []; //即将上线  商品列表
    $scope.hasmore = false; //是否有更多数据
    $scope.page = 1; //默认页数
    $scope.isHasData = false; // 是否有数据
    $scope.isMoreData = true; // 是否有数据
    $scope.Math=window.Math;
    // 默认显示
    $scope.init = function (type, page,num) {
      if($stateParams.shareId){
          $rootScope.shareId = $stateParams.shareId;
        }
      CrowdFundingServer.moreData(typeList[1], $scope.page,$scope.typeNumber).success(function (response) {
        if (response.success == true) {
          $scope.endList = response.data.zActivitylist;

        } else {
          $scope.endList = [];
          console.log('获取数据失败')
        }
      })
      HomePageService.getUnReadMsg()
        .success(function (res) {
          if (res.data > 0) {
            $scope.flagNum = true;
          } else {
            $scope.flagNum = false;
          }
        });
     // $scope.HomeBanner =[];
      $ionicScrollDelegate.scrollTop();
      /*图片轮播 人气列表*/
      CrowdFundingServer.bannerList($scope.typeNumber).success(function (response) {
        if (response.success == true) {
          // 图片轮播
          $scope.HomeBanner = response.data.zBannerList;
          // 人气列表
          $scope.peopleList = response.data.top3ZActivity;
          //$timeout(function () {
            $ionicSlideBoxDelegate.$getByHandle('crowd_funding_slider').update();
            $ionicSlideBoxDelegate.$getByHandle('crowd_funding_slider').loop(true);
        //  },2000)

          if ($scope.peopleList.length == 0) {
            $scope.isHasData = true;
            $scope.isMoreData = false;
          }
          else {
            $scope.isMoreData = true;
            $scope.isHasData = false;
          }
        } else {
          $scope.isHasData = true;
          $scope.isMoreData = false;
        }

      })
      /*活动分类  最新上线 即将结束 即将上线*/
      CrowdFundingServer.moreData(type, page,$scope.typeNumber ).success(function (response) {
        if (response.success == true) {
          $ionicScrollDelegate.resize();
          $scope.newsNum = response.data.zActivitylistTotalCount;
          if (page == 1) {
            $scope.newsList = response.data.zActivitylist;
            $scope.hasmore = $scope.newsList.length < $scope.newsNum;
          } else {
            $scope.newsList = $scope.newsList.concat(response.data.zActivitylist);
            $scope.hasmore = $scope.newsList.length < $scope.newsNum;
          }
        } else {
          console.log('--数据没拿到--')
        }
      });
      /*即将结束*/
      CrowdFundingServer.moreData(typeList[1], $scope.page,$scope.typeNumber )
        .success(function (response) {
          if (response.success == true) {
            $scope.endList = response.data.zActivitylist;
          } else {
            $scope.endList = [];
            console.log('获取数据失败')
          }
        })
    };
    // 图片判断
    $scope.calculateWH = function (imgSrc, index) {
      var img = new Image();
      img.src = imgSrc;
      if (img.width > img.height) {
        $('#img' + index).attr("width", "100%");
      } else {
        $('#img' + index).attr("height", "100%");
      }
    };
    // 周期函数
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.page = 1;
      $ionicScrollDelegate.scrollTop();
      $scope.init(typeList[$scope.selectedIndex], $scope.page);
    });
    /*********************分享标签－whiteBird start*********************/
    // 分享
    $scope.showShare = false;
    $rootScope.isApp = window.cordova ? true : undefined;
    // 分享按钮
    $scope.share = function () {
      if (!UserService.getUser().mid) {
        $state.go('login');
        return;
      }
      $scope.moreShow = false;
      /*********************分享标签－whiteBird start*********************/
      if (window.device && window.device.hasNewShare) {
        //新分享样式
        $scope.showShare = !$scope.showShare;
        /*********************分享标签－whiteBird end*********************/
      }
    };
    $scope.copeText = function (text) {
      if (window.cordova) {
        cordova.plugins.clipboard.copy(text);
        PopupService.showToastShort('复制成功');
        $scope.isShowCopyButton = false;
      } else {
        PopupService.showToast('请下载APP执行此操作');
      }
    };
    $scope.hideblackCover = function () {
      $scope.showShare = false;
    };
    $scope.shareToPlatform = function (index) {

      var title = '顺逛众筹',
        content = '顺逛众筹为您提供与众不同的品质生活',
        pic = 'http://m.ehaier.com/www/img/ic_aboutUS_1.png', //product 里只有这个img
        url = UrlService.getShareLinkHeader() + 'crowdFunding/' + UserService.getUser().mid;
      if (window.umeng) {
        if (index == 0) {
          window.umeng.shareToSina(title, content, pic, url, 0, null, CreditService.shareSuccessCallback);
        } else if (index == 1) {
          window.umeng.shareToWechatSession(title, content, pic, url, 0, null, CreditService.shareSuccessCallback);
        } else if (index == 2) {
          window.umeng.shareToWechatTimeline(title, content, pic, url, 0, null, CreditService.shareSuccessCallback);
        } else if (index == 3) {
          window.umeng.shareToQQ(title, content, pic, url, 0, null, CreditService.shareSuccessCallback);
          CreditService.qqShare();
        } else if (index == 4) {
          window.umeng.shareToQzone(title, content, pic, url, 0, null, CreditService.shareSuccessCallback);
          CreditService.qqShare();
        }
        if (index == 5) {
          $scope.copeText(url);
        } else {
          CreditService.successShare();
        }
      } else {
        alert('umeng undefined 只能在app分享');
      }

      $scope.showShare = false;
    };
    /*********************分享标签－whiteBird end*********************/

    //tab切换 最新上线 即将结束 即将上线
    $scope.crowdTab = function (index) {
      $scope.page = 1;
      CrowdFundingServer.changeSuccess(typeList[index])
        .success(function (response, status, headers, config) {
          if (response.success == true) {
            $scope.page = 1;
            $scope.selectedIndex = index;
            if ($scope.selectedIndex == 0) {
              $scope.isTab = true;
              $scope.isFind = true;
              $scope.isFindEnd = false;
              $scope.isFindSoon = false;
              CrowdFundingServer.moreData(typeList[$scope.selectedIndex], $scope.page,$scope.typeNumber ).success(function (response) {
                if (response.success == true) {
                  $ionicScrollDelegate.resize();
                  $scope.newsNum = response.data.zActivitylistTotalCount;
                  $scope.newsList = response.data.zActivitylist;
                  $scope.hasmore = $scope.newsList.length < $scope.newsNum ? true : false;
                } else {
                  $scope.newsList = [];
                  console.log('获取数据失败');
                }
              });
            }
            else if ($scope.selectedIndex == 1) {
              $scope.isFindEnd = true;
              $scope.isFindSoon = false;
              $scope.isFind = false;
              CrowdFundingServer.moreData(typeList[$scope.selectedIndex], $scope.page,$scope.typeNumber ).success(function (response) {
                if (response.success == true) {
                  $ionicScrollDelegate.resize();
                  $scope.endNum = response.data.zActivitylistTotalCount;
                  $scope.endList = response.data.zActivitylist;
                  $scope.hasmore = $scope.endList.length < $scope.endNum ? true : false;

                } else {
                  $scope.endList = [];
                  console.log('获取数据失败');
                }
              })
            }
            else if ($scope.selectedIndex == 2) {
              $scope.isFindEnd = false;
              $scope.isFindSoon = true;
              $scope.isFind = false;
              CrowdFundingServer.moreData(typeList[$scope.selectedIndex], $scope.page,$scope.typeNumber ).success(function (response) {
                if (response.success == true) {
                  $ionicScrollDelegate.resize();
                  $scope.soonNum = response.data.zActivitylistTotalCount;
                  $scope.soonList = response.data.zActivitylist;
                  $scope.hasmore = $scope.soonList.length < $scope.soonNum ? true : false;
                } else {
                  $scope.endList = [];
                  console.log('获取数据失败');
                }
              });
            } else {
              $scope.isTab = false;
            }
          }
        });
    };

    //商品上拉刷新
    $scope.loadMore = function () {
      $scope.$broadcast('scroll.infiniteScrollComplete');
      $scope.page += 1;
      $scope.loadMoreProducts(typeList[$scope.selectedIndex], $scope.page,$scope.typeNumber);
    };
    //加载商品列表 函数
    $scope.loadMoreProducts = function (type, pageSize,num) {
      CrowdFundingServer.moreData(type, pageSize,$scope.typeNumber)
        .success(function (response) {
          if (response.success == true) {
            if ($scope.isFind) { // 判断是否 第一个模板
              //拼接数据
              $scope.newsList = $scope.newsList.concat(response.data.zActivitylist);
              // 改变上拉状态
              $scope.hasmore = $scope.newsList.length < response.data.zActivitylistTotalCount ? true : false;
            } else if ($scope.isFindEnd) {
              $scope.endList = $scope.endList.concat(response.data.zActivitylist);
              $scope.hasmore = $scope.endList.length < response.data.zActivitylistTotalCount ? true : false;
            } else if ($scope.isFindSoon) {
              $scope.soonList = $scope.soonList.concat(response.data.zActivitylist);
              $scope.hasmore = $scope.soonList.length < response.data.zActivitylistTotalCount ? true : false;
            }
            $scope.$broadcast('scroll.infiniteScrollComplete'); // 广播
          } else {
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.hasmore = false;
          }
        });
    };


  }]);

APP.service('CrowdFundingServer', ['$http', 'UrlService', function ($http, UrlService) {
  // 图片轮播  第一次请求接口 图片轮播
  this.bannerList = function (from) {
    var params = {
      from:from
    }
    // return $http.get('http://mobiletest.ehaier.com:38080/activity/zhongchou/index')
    return $http.get(UrlService.getZCUrl('ZC_INDEX'),params);
  };
  //商品分类(滚动条)切换
  this.changeSuccess = function (type) {
    var params = {
      'type': type
    };
    // return $http.get('http://mobiletest.ehaier.com:38080/activity/zhongchou/index?type='+params.type+'');
    return $http.get(UrlService.getZCUrl('ZC_INDEX'), params);
  };

  //上拉加载更多
  this.moreData = function (type, page,from) {
    var params = {
      'type': type,
      'page': page,
      'from':from
    };
    //  return $http.get('http://mobiletest.ehaier.com:38080/activity/zhongchou/indexZActivitys?type='+params.type+'&page='+params.page+'')
    return $http.get(UrlService.getZCUrl('ZC_INDEX_ACTIVITY'), params);
  }


}]);
