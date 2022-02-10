/**
 * 刘成杰 2017-07-16.
 */
APP.controller('lifeController', ['$ionicHistory','BannerThemeService','CLASSIFYMESSAGECRNTERService','$ionicScrollDelegate', '$ionicSlideBoxDelegate', '$q', 'GoodsService', 'HomePageService', 'CalculateStrLength', 'lifeService', '$interval', '$http', '$scope', '$stateParams',
  '$state', 'UserService', '$timeout', '$rootScope', 'PopupService', 'ShopService',
  function ($ionicHistory,BannerThemeService,CLASSIFYMESSAGECRNTERService,$ionicScrollDelegate, $ionicSlideBoxDelegate, $q, GoodsService, HomePageService, CalculateStrLength, lifeService, $interval, $http, $scope, $stateParams, $state, UserService, $timeout, $rootScope, PopupService, ShopService) {
    // $scope.furnishType = ['厨具', '家纺', '家具', '厨房卫浴', '五金工具', '灯具', '装修定制', '家装软饰',' '];
    $scope.furnishTypeId = [3347, 3379, 3461, 3453, 3465, 2832, 3467, 3477];
    if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {
      $scope.isIosApp = true;
    } else {
      $scope.isIosApp = false;
    }
    $scope.iosAppTop = {
      "top": "64px"
    };
    $scope.normalTop = {
      "top": "44px"
    }
    $scope.flagNum = false;
    $scope.messageImgUrl="img/message_gray@2x.png";
    $scope.dealPrice = CalculateStrLength.dealPrice;

    $scope.iosHead = {
      "height": "64px",
      "padding-top": "20px"
    }
    $scope.otherHead = {
      "height": "44px",
      "padding-top": "0px"
    }
    $scope.bannerClick = function (linkType, link, relationId) {
      console.log(link);
      var tempArr = link.split('&');
      switch (linkType) {
        case -1:
          BannerThemeService.getBannerTheme(relationId)
            .success(function (response) {
              console.log(response);
              $state.go('bannerDaily', {
                bannerId: relationId,
                layout: response.data.layout
              });
            });
          break;
        case 0:
          $state.go('bannerTheme', {
            bannerId: relationId
          });
          break;
        case "1": //单品页
          var productId = tempArr[0].slice(tempArr[0].indexOf('=') + 1);
          $state.go('productDetail', {
            fromType: '',
            fromUrl: '',
            o2oType: 0,
            productId: productId,
            storeId: $scope.storeId
          });
          break;
        case "2": //领券中心/优惠券详情页
          if (!link) {
            $state.go('getCouponsList');
          } else {
            var couponsId = link.slice(link.indexOf('=') + 1);
            $state.go('couponsDetail', {
              cId: couponsId,
              userID: $scope.storeId,
              type: 2
            });
          }
          break;
        case "3": //游戏页
          var gameId = link.slice(link.indexOf('=') + 1);
          $state.go('game', {
            gameId: gameId
          });
          break;
        case "4": //活动页
          if (tempArr[0].slice(tempArr[0].indexOf('=') + 1) == '日常活动') {
            BannerThemeService.getBannerTheme(tempArr[1].slice(tempArr[1].indexOf('=') + 1))
              .success(function (response) {
                $state.go('bannerDaily', {
                  bannerId: tempArr[1].slice(tempArr[1].indexOf('=') + 1),
                  layout: response.data.layout
                });
              });
          } else if (tempArr[0].slice(tempArr[0].indexOf('=') + 1) == '主题活动') {
            $state.go('bannerTheme', {
              bannerId: tempArr[1].slice(tempArr[1].indexOf('=') + 1)
            });
          }
          break;
        case "5": //自定义类型页
          if (window.cordova) {
            /**
             * H5跳转原生webView页面
             * @param resultUrl {String} 链接url
             * @param title {String} 标题
             *
             */
            if(link.indexOf('m.ehaier.com/www/index.html')!=-1){
              var url = link.slice(link.indexOf('#/'));
              window.location.hash=url;
            }else{
              window.emc.presentH5View(link, "");
            }
          } else {
            window.open(link, '_blank', 'location=yes');
          }
          break;
        case "6": //众筹
          $state.go('crowdFunding');
          break;
        case "7": //新品
          if (!link) {
            $state.go('newSend');
          } else {
            $state.go('productDetail', {
              fromType: '',
              fromUrl: '',
              o2oType: 0,
              productId: link,
              storeId: $scope.storeId
            });
          }
          break;
        case "8": //社群
          if (!link) {
            $state.go('topic.qhot');
          } else {
            $state.go('noteDetails', {
              noteId: tempArr[0].slice(tempArr[0].indexOf('=') + 1),
              isShortStory: tempArr[1].slice(tempArr[1].indexOf('=') + 1)
            })
          }
          break;
      }
    }

    function getAddress() {
      var deferred = $q.defer();
      GoodsService.getAddress()
        .success(function (res) {
          console.log(res);
          var obj = eval(res.data);
          var regionIndex = obj[0].regionName.indexOf('/');
          $scope.region = obj[0].regionName.substr(0, regionIndex);
          deferred.resolve(obj[0]);
        })
      return deferred.promise;
    }



    $scope.init = function () {
      $ionicScrollDelegate.scrollTop();
      getFurnishAllData();
      lifeService.getBanner()
        .success(function (res) {
          console.log(res);
          $scope.bannerList = res.data;
          $ionicSlideBoxDelegate.update();
          $ionicSlideBoxDelegate.$getByHandle('furnish_slider').loop(true);
        })
        lifeService.gethomeMessage()
         .success(function(res){

         })
      HomePageService.isWdHost()
        .success(function (res) {
          console.log(res);
          $scope.isWdHost = res.data.isHost;
        })
    }
    //返回上一页
    $scope.goBack = ionic.Utils.debounce(function () {
      $ionicHistory.goBack();
    },300);
    function getFurnishAllData() {
      getAddress()
        .then(function (res) {
          console.log(res);
          $scope.provinceId = res.provinceId;
          $scope.cityId = res.cityId;
          $scope.areaId = res.areaId;
          $scope.streetId = res.streetId;
        })
      }
    /*swiper轮播*/
    // $scope.swpcfurnish1;
    $scope.$on('$ionicView.enter', function (e, v) {
      if ($scope.direction == 'back') {
        return;
      }
      $ionicScrollDelegate.scrollTop();
    });
    $scope.settingsList='';//是否显示佣金本地存储
    $scope.$on('$ionicView.beforeEnter', function (e, v) {
      //  GetSwitchChecked();//获取是否显示佣金 本地存储值
      //如果是返回回来的不采取操作，使用缓存
       //更新轮播
        $timeout(function(){
          $ionicSlideBoxDelegate.loop(true);
          $ionicSlideBoxDelegate.start();
          $ionicSlideBoxDelegate.update();
        },200);
      $scope.direction = 'forword';
      $scope.storeId = UserService.getUser().mid;
      $scope.init();
    });

  }
]);


APP.service('lifeService', ['$http', 'UrlService', function ($http, UrlService) {
  this.getBanner = function () {
    return $http.get(UrlService.getNewUrl('FURNISH_BANNER'));
  }
  this.getFurnishTop = function (parentCateId, provinceId, cityId, areaId, streetId) {
    var params = {
      parentCateId: parentCateId,
      provinceId: provinceId,
      cityId: cityId,
      districtId: areaId,
      streetId: streetId
    }
    return $http.get(UrlService.getNewUrl('FURNISH_TOP'), params);
  }
  this.getFurnishBottom = function (parentCateId, provinceId, cityId, areaId, streetId) {
    var params = {
      parentCateId: parentCateId,
      provinceId: provinceId,
      cityId: cityId,
      districtId: areaId,
      streetId: streetId
    }
    return $http.get(UrlService.getNewUrl('FURNISH_BOTTOM'), params);
  }
  this.getAdornhomeCates = function(){
    return $http.get(UrlService.getNewUrl('ADORNHOME_CATES'));
  }
  this.gethomeMessage = function(){
    return $http.get(UrlService.getNewUrl('LIFE_SERVICES'));
  }
}]);
