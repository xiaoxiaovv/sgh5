/**
 * 刘成杰 2017-07-16.
 */
APP.controller('superMarketController', ['$ionicHistory','BannerThemeService','$ionicScrollDelegate', '$ionicSlideBoxDelegate', 'GoodsService', '$q', 'HomePageService', 'CalculateStrLength', 'superMarketService', '$interval', '$http', '$scope', '$stateParams',
  '$state', 'UserService', '$timeout', '$rootScope', 'PopupService', 'ShopService',
  function ($ionicHistory,BannerThemeService,$ionicScrollDelegate, $ionicSlideBoxDelegate, GoodsService, $q, HomePageService, CalculateStrLength, superMarketService, $interval, $http, $scope, $stateParams, $state, UserService, $timeout, $rootScope, PopupService, ShopService) {

    $scope.furnishType = ['食品', '母婴', '运动户外', '数码/电脑办公', '医药保健', '汽配', '腕表', ' '];
    $scope.furnishTypeId = [3275, 3159, 3323, 2739, 3353, 3369, 3225];
    if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {
      $scope.isIosApp = true;
    } else {
      $scope.isIosApp = false;
    }
    $scope.iosAppTop = {
      "top":"64px"
    };
    $scope.normalTop = {
      "top":"44px"
    }
    $scope.dealPrice = CalculateStrLength.dealPrice;
    $scope.flagNum = false;
    $scope.messageImgUrl = "http://cdn09.ehaier.com/shunguang/H5/www/img/message_gray@2x.png";
    $scope.EMSearchImgUrl = "http://cdn09.ehaier.com/shunguang/H5/www/img/EMSearch@3x.png";
    //跳转搜索页
    $scope.goToSearch = function () {
      $state.go('goodsSearch', {
        front: 1
      });
    };
    $scope.chooseType = function (index, event) {
      if (index != -1) {
        getFurnishAllData($scope.supermarketCates[index].id);
        console.log(event.target.offsetLeft);
        $("div.superMarket_xScroll div:not(:last)").css("color", "#000000");
        $("div.superMarket_xScroll div:eq(" + index + ")").css("color", "#2979FF");
        $("div.superMarket_xScroll div.runningBox").animate({
          width: event.target.offsetWidth + "px",
          left: event.target.offsetLeft,
          color: "#2979FF"
        }, {
          duration: 300,
          easing: 'easeOutCubic',
        });
      }
    }
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

    function getFurnishAllData(typeId) {
      getAddress()
        .then(function (res) {
          $scope.provinceId = res.provinceId;
          $scope.cityId = res.cityId;
          $scope.areaId = res.areaId;
          $scope.streetId = res.streetId;
          superMarketService.getFurnishTop(typeId, $scope.provinceId, $scope.cityId, $scope.areaId, $scope.streetId)
            .success(function (res) {
              console.log(res);
              $scope.furnishTop = [];
              $scope.furnishTop = res.data.topRecommendProducts;
            })
          superMarketService.getFurnishBottom(typeId, $scope.provinceId, $scope.cityId, $scope.areaId, $scope.streetId)
            .success(function (res) {
              console.log(res);
              // for (var i = 0, length = res.data.length; i < length; i++) {
              //   if (res.data[i].lowRecommendProducts.length >= 3 && res.data[i].lowRecommendProducts.length < 6) {
              //     res.data[i].limitLength = 3;
              //   } else if (res.data[i].lowRecommendProducts.length >= 6) {
              //     res.data[i].limitLength = 6;
              //   } else {
              //     res.data[i].limitLength = 0;
              //   }
              // }
              $scope.furnishBottom = [];
              $scope.furnishBottom = res.data;
            })

        })
    }
    $scope.goProductDetail = function (productId) {
      $state.go('productDetail', {
        fromType: '',
        fromUrl: '',
        o2oType: 0,
        productId: productId,
        storeId: $scope.storeId
      })
    }
    $scope.goBranchType = function (id) {
      $state.go('branchTypeDetail', {
        productCateId: "productCateId=" + id
      })
    }
    $scope.init = function () {
      $ionicScrollDelegate.scrollTop();
      superMarketService.getSupermarketCates()
        .success(function(res){
          $scope.supermarketCates = res.data;
          getFurnishAllData($scope.supermarketCates[0].id);
        })
      superMarketService.getBanner()
        .success(function (res) {
          console.log(res);
          $scope.bannerList = res.data;
          $ionicSlideBoxDelegate.update();
          $ionicSlideBoxDelegate.$getByHandle('superMarket_slider').loop(true);
          //顶部轮播
          // if(typeof $scope.swpcMarket1 != 'undefined'){
          //   $scope.swpcMarket1.update();
          // }else{
          //   $timeout(function(){
          //     $scope.swpcMarket1 = new Swiper('#swpc-Market-1', {   //轮播图绑定样式名
          //       pagination: '#swpp-Market-1',
          //       paginationClickable: true,
          //       autoplay: 4000,
          //       loop: false,
          //       observer:true,
          //       observeParents:true,
          //       autoplayDisableOnInteraction:false,
          //     });
          //   },100)
          //}
        })
      HomePageService.isWdHost()
        .success(function (res) {
          console.log(res);
          $scope.isWdHost = res.data.isHost;
        })
      HomePageService.getUnReadMsg()
          .success(function (res) {
            if (res.data > 0) {
              $scope.flagNum = true;
            } else {
              $scope.flagNum = false;
            }
          })
    }
    //返回上一页
    $scope.goBack = ionic.Utils.debounce(function () {
      $ionicHistory.goBack();
    },300);
    $scope.$on('$ionicView.beforeLeave', function (e, v) {

    })
     /*swiper轮播*/
    //  $scope.swpcMarket1;
    $scope.$on('$ionicView.enter', function (e, v) {
      if ($scope.direction == 'back') {
        return;
      }
      $ionicScrollDelegate.scrollTop();
      console.log($("div.superMarket_xScroll div").eq(0));
      var firstTypeWidth = $("div.superMarket_xScroll div").eq(0).width();
      var firstTypeLeft = $("div.superMarket_xScroll div:eq(0)")[0].offsetLeft;
      $("div.superMarket_xScroll div:not(:last)").css("color", "#000000");
      $("div.superMarket_xScroll div:eq(0)").css("color", "#2979FF");
      $("div.superMarket_xScroll div.runningBox").css({
        "width": firstTypeWidth,
        "left": firstTypeLeft
      });
    });
    $scope.settingsList='';//是否显示佣金本地存储
    //判断本地是否显示佣金;
   function GetSwitchChecked() {
        $scope.memberId = UserService.getUser().mid;
        var setSwitch = JSON.parse(localStorage.getItem('setSwitch'));
        var isExist = false;
        for (var i = setSwitch.length - 1; i >= 0; i--) {
            if (setSwitch[i].id == $scope.memberId) {
                $scope.settingsList = setSwitch[i].list;
                isExist = true;

            }
        }
        console.log($scope.settingsList);
    }
    $scope.$on('$ionicView.beforeEnter', function (e, v) {
       GetSwitchChecked();//获取是否显示佣金 本地存储值
      //如果是返回回来的不采取操作，使用缓存
      //更新轮播
      $timeout(function(){
        $ionicSlideBoxDelegate.loop(true);
        $ionicSlideBoxDelegate.start();
        $ionicSlideBoxDelegate.update();
      },200);
      if (v.direction == 'back') {
        $scope.direction = 'back';
        HomePageService.getUnReadMsg()
          .success(function (res) {
            if (res.data > 0) {
              $scope.flagNum = true;
            } else {
              $scope.flagNum = false;
            }
          })
        return;
      }
      $scope.direction = 'foword';
      $scope.storeId = UserService.getUser().mid;
      $scope.init();
    });

  }
]);


APP.service('superMarketService', ['$http', 'UrlService', function ($http, UrlService) {
  this.getBanner = function () {
    return $http.get(UrlService.getNewUrl('SUPERMARKET_BANNER'));
  }
  this.getFurnishTop = function (parentCateId, provinceId, cityId, areaId, streetId) {
    var params = {
      parentCateId: parentCateId,
      provinceId: provinceId,
      cityId: cityId,
      districtId: areaId,
      streetId: streetId
    }
    return $http.get(UrlService.getNewUrl('SUPERMARKET_TOP'), params);
  }
  this.getFurnishBottom = function (parentCateId, provinceId, cityId, areaId, streetId) {
    var params = {
      parentCateId: parentCateId,
      provinceId: provinceId,
      cityId: cityId,
      districtId: areaId,
      streetId: streetId
    }
    return $http.get(UrlService.getNewUrl('SUPERMARKET_BOTTOM'), params);
  }
  this.getSupermarketCates = function(){
    return $http.get(UrlService.getNewUrl('SUPERMARKET_CATES'));
  }
}]);
