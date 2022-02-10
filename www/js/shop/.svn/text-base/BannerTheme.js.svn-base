/**
 * creator:feng.jiang@dhc.com.cn
 * create time:2016/8/9
 * describe：BannerThemeController 轮播图主题活动控制器
 **/
APP.controller('BannerThemeController', ['$scope', 'BannerThemeService', '$stateParams',
  '$state', '$ionicHistory', '$localstorage', 'UserService', 'PopupService', 'UrlService','CreditService','InAppBrowserService', '$rootScope',
  function ($scope, BannerThemeService, $stateParams, $state, $ionicHistory, $localstorage, UserService, PopupService, UrlService,CreditService,InAppBrowserService,$rootScope) {

    /**变量声明**/
    var bannerId = $stateParams.bannerId;
    var storeId = $localstorage.get('storeId', '20219251');
    var platformType = $stateParams.platformType;
    $scope.activityImageList = [];//活动封面图片
    var sharePic = 'http://www.ehaier.com/mstatic/wd/v2/img/sg.png';
    $scope.shareStoreId = $stateParams.shareStoreId;
    var shareInfo = {};//分享内容
    /*********************分享标签－whiteBird start*********************/
    $scope.showShare = false;
    /*********************分享标签－whiteBird end*********************/

      //IOS特殊样式
    $scope.leftArrow = {};
    // $scope.rightShare = {top: '6px'};
    $scope.rightShare = {top: '26px'};
    $scope.leftShare = {top: '26px'};
    if(window.cordova&&ionic.Platform.isIOS){
      $scope.rightShare = {
        "top":"16px",
        "position": "absolute",
        "left":"8px",
        "z-index": "10",
        "width": "32px"
      }
    }else{
      $scope.rightShare = {
        "top":"16px",
        "position": "absolute",
        "left":"8px",
        "z-index": "10",
        "width": "32px"
      }
    }
    if(window.cordova&&ionic.Platform.isIOS){
      $scope.leftShare = {
        "top":"16px",
        "position": "absolute",
        "right":"8px",
        "z-index": "10",
        "width": "32px"
      }
    }else{
      $scope.leftShare = {
        "top":"16px",
        "position": "absolute",
        "right":"8px",
        "z-index": "10",
        "width": "32px"
      }
    }


    if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {//只有ios app 特有的样式
      $scope.leftArrow = {top: '14px'};
      // $scope.rightShare = {top: '16px'};
    }
    //查看活动图片详情
    $scope.goDetail = function (index) {
      var productInfo = $scope.activityImageList[index];
      // if (productInfo.activityUrl) {
      //   console.log('活动链接：', productInfo.activityUrl);
      //   var gameIndex = productInfo.activityUrl.indexOf('game/');
      //   var couponIndex = productInfo.activityUrl.indexOf('coupon/toList');
      //   var extraIndex = productInfo.activityUrl.indexOf('http');
      //   var bannerTheme = productInfo.activityUrl.indexOf('bannerTheme');
      //   var bannerDaily = productInfo.activityUrl.indexOf('bannerDaily');
      //   var vrShop = productInfo.activityUrl.indexOf('VRshop');
      //   if (gameIndex != -1) {
      //     var gameStr = productInfo.activityUrl.substr(gameIndex + 5);
      //     var endIndex = gameStr.indexOf('/');
      //     var gameId = gameStr.substr(0, endIndex);
      //     $state.go('game', {gameId: gameId, shareStoreId: $scope.shareStoreId});
      //   } else if (bannerTheme != -1) {
      //     var bannerIdStr = productInfo.activityUrl.substr(bannerTheme + 12);
      //     var bannerId = bannerIdStr.substr(0, bannerIdStr.indexOf('/'));
      //     $state.go('bannerTheme', {bannerId: bannerId, shareStoreId: $scope.shareStoreId});
      //   } else if (bannerDaily != -1) {
      //     bannerIdStr = productInfo.activityUrl.substr(bannerDaily + 12);
      //     bannerId = bannerIdStr.substr(0, bannerIdStr.indexOf('/'));
      //     var templateStart = bannerIdStr.indexOf('/') + 1;
      //     var templateStr = bannerIdStr.substr(templateStart);
      //     var template = templateStr.substr(0, templateStr.indexOf('/'));
      //     $state.go('bannerDaily', {bannerId: bannerId, layout: template, shareStoreId: $scope.shareStoreId});
      //   } else if (vrShop != -1) {
      //     var ref = null;
      //     var serverHead = UrlService.getHead().replace('v3', 'www'),
      //       openUrl = serverHead + 'index.html#/VrPage/';
      //     ref = InAppBrowserService.open(openUrl);
      //     ref.addEventListener('loadstart', function (event) {
      //       if (event.url.indexOf('backToApp') != -1) {
      //         ref.close();
      //       }
      //     });
      //   } else if (extraIndex != -1) {
      //     if (window.cordova) {
      //       if($rootScope.isIOS){
      //         cordova.InAppBrowser.open(productInfo.activityUrl, '_system', 'location=yes');
      //       }else{
      //         cordova.InAppBrowser.open(productInfo.activityUrl, '_blank', 'location=yes');
      //       }
      //     } else {
      //       window.open(productInfo.activityUrl, '_blank', 'location=yes');
      //     }
      //   } else if (couponIndex != -1) {
      //     $state.go('getCouponsList', {shareStoreId: $scope.shareStoreId});
      //   }
      // } else if (productInfo.productId) {
      //   $state.go('productDetail', {
      //     productId: productInfo.productId,
      //     o2oType: productInfo.o2oType,
      //     fromType: '',
      //     storeId: storeId,
      //     shareStoreId: $scope.shareStoreId
      //   });
      // } else {
      //   console.log('未关联相关活动');
      // }
      if (productInfo.productId) {
        $state.go('productDetail', {
          productId: productInfo.productId,
          o2oType: productInfo.o2oType,
          fromType: '',
          storeId: storeId,
          shareStoreId: $scope.shareStoreId
        });
      } else if (productInfo.activityUrl) {
        if (productInfo.activityUrl.indexOf('VRshop') != -1) {
          var ref = null;
          var serverHead = UrlService.getHead().replace('v3', 'www'), openUrl = serverHead + 'index.html#/VrPage/';
          ref = InAppBrowserService.open(openUrl);
          ref.addEventListener('loadstart', function (event) {
            if (event.url.indexOf('backToApp') != -1) {
              ref.close();
            }
          });
        } else if (productInfo.activityUrl.indexOf('coupon/toList') != -1) {
          $state.go('getCouponsList', {shareStoreId: $scope.shareStoreId});
        } else if (productInfo.activityUrl.indexOf('m.ehaier.com/www/index.html') != -1) {
          var gotoUrl = productInfo.activityUrl.slice(productInfo.activityUrl.indexOf('#/'));
          window.location.hash = gotoUrl;
        } else {
          if (window.cordova) {
            if ($rootScope.isIOS) {
              cordova.InAppBrowser.open(productInfo.activityUrl, '_system', 'location=yes');
            } else {
              cordova.InAppBrowser.open(productInfo.activityUrl, '_blank', 'location=yes');
            }
          } else {
            window.open(productInfo.activityUrl, '_blank', 'location=yes');
          }
        }
      } else {
        console.log('未关联相关活动');
      }
    };
    //获取主题活动图片数组
    function getBannerThemeImg(bannerId,platformType) {
      BannerThemeService.getBannerTheme(bannerId,platformType)
        .success(function (response) {
          $scope.activityImageList = response.data.productList;
          shareInfo = response.data;
        })
    }

    $scope.goBack = function () {
      if($ionicHistory.backView()){
        $ionicHistory.goBack();
      }else{
        $state.go('homePage');
      }
    };

    $scope.init = function () {
      /*********************分享标签－whiteBird start*********************/
      $scope.showQQ = false;
      $scope.showWeChat = false;

      /*********************分享标签－whiteBird end*********************/
      bannerId = $stateParams.bannerId;
      platformType = $stateParams.platformType;
      getBannerThemeImg(bannerId,platformType);
    };

    $scope.$on('$ionicView.beforeEnter', function (e, v) {
      if($stateParams.shareStoreId){
        $rootScope.shareId = $stateParams.shareStoreId; 
       }
      storeId = $stateParams.shareStoreId ? $stateParams.shareStoreId : $localstorage.get('storeId', '20219251');
      $scope.shareStoreId = $stateParams.shareStoreId;
      if (v.direction == 'back') {//不需要刷新

      } else {
        //需要刷新
        $scope.init();
      }
    });

    //分享
    $scope.share = function () {

      /*********************分享标签－whiteBird start*********************/
      if (window.device && window.device.hasNewShare) {
        if (!UserService.getUser().mid) {
          PopupService.showToast('请先登录,再分享');
          return;
        }
        //新分享样式
        $scope.showShare = !$scope.showShare;
        /*********************分享标签－whiteBird end*********************/
      } else {

        //旧分享样式
        if (!UserService.getUser().mid) {
          PopupService.showToast('请先登录,再分享');
          return;
        }
        if (window.umeng) {
          var url = UrlService.getShareLinkHeader() + 'bannerTheme/' + bannerId + '/' + UserService.getUser().mid;
          window.umeng.share(shareInfo.title, shareInfo.content, shareInfo.imgUrl, url, 0);
        }
      }

    };
    /*********************分享标签－whiteBird start*********************/

      //复制
    $scope.copeText = function (text) {
      if (window.cordova) {
        cordova.plugins.clipboard.copy(text);
        PopupService.showToastShort('复制成功');
      }
      else {
        PopupService.showToast('请下载APP执行此操作');
      }
    };
    $scope.hideblackCover = function () {
      $scope.showShare = false;
    };
    $scope.shareToPlatform = function (index) {

      var url = UrlService.getShareLinkHeader() + 'bannerTheme/' + bannerId + '/' + UserService.getUser().mid;
      var title = shareInfo.title;
      var pic = shareInfo.imgUrl;
      var content = shareInfo.content;

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
        } else if (index == 5) {
          $scope.copeText(url);
        }
        CreditService.successShare();
      } else {
        alert('umeng undefined 只能在app分享');
      }

      $scope.showShare = false;
    };
    /*********************分享标签－whiteBird end*********************/

  }]);


APP.service('BannerThemeService', ['$http', 'UrlService', function ($http, UrlService) {
  this.getBannerTheme = function (bannerId,platformType) {
    if(platformType){
      var params = {
        bannerId: bannerId,
        isHost: '1',
        backUrl: '',
        platformType: platformType
      };
    }else{
      params = {
        bannerId: bannerId,
        isHost: '1',
        backUrl: ''
      };
    }
    return $http.get(UrlService.getUrl('GET_BANNER_THEME'), params);
  };
}]);
