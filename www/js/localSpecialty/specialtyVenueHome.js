APP.controller('SpecialtyVenueHomeController', ['$ionicPlatform','$ionicHistory','UrlService', 'trueAuthenticationService', '$localstorage', 'GoodsSearchService', 'RegisterService', '$ionicModal', 'ShopService', '$q', 'GoodsService', 'CalculateStrLength', '$interval', '$http', '$scope', '$stateParams', '$ionicSlideBoxDelegate',
  '$state', 'UserService', '$timeout', '$rootScope', '$ionicScrollDelegate', 'CommonAddressService', 'BannerThemeService', 'PopupService', 'localSpecialtyHomePageService','specialtyVenueHomeControllerService', '$ionicPopup', 'CartService', 'LoginService', 'HomePageService', 'CreditService',
  function ($ionicPlatform,$ionicHistory,UrlService, trueAuthenticationService, $localstorage, GoodsSearchService, RegisterService, $ionicModal, ShopService, $q, GoodsService, CalculateStrLength, $interval, $http, $scope, $stateParams, $ionicSlideBoxDelegate, $state, UserService, $timeout, $rootScope, $ionicScrollDelegate, CommonAddressService, BannerThemeService, PopupService, localSpecialtyHomePageService,specialtyVenueHomeControllerService,$ionicPopup,CartService,LoginService,HomePageService,CreditService) {
    $scope.isDisplay = false;
    $scope.menuImg = $rootScope.imgBaseURL + 'img/ic_lookMore.png';
    $scope.pageTitle = ''; //页面标题
    $scope.collects = 0; //收藏数
    $scope.topImgSrc = ''; //场馆头图
    $scope.topBanners = []; //轮播图
    $scope.recommendations = [];//馆长推荐
    $scope.communities = [];//逛客怎么说
    $scope.competitiveProducts = []; //精品精选
    $scope.recommendProducts = []; //全部商品推荐
    $scope.hotProducts = []; //热卖
    $scope.cities = []; //市场馆
    $scope.showShare = false;
    $scope.shareImgUrl = '';
    $scope.isCollected = 0;
    $scope.dealPrice = CalculateStrLength.dealPrice;
    $scope.regionId = $stateParams.regionId;
    $scope.streetId = $stateParams.streetId;
    $scope.storeId = $localstorage.get('storeId', $rootScope.globalConstant.storeId);
    $scope.collectImgSrc = $rootScope.imgBaseURL + 'img/ic_shoucang_1.png';
    $scope.isBuyer = parseInt(LoginService.getRole());
    // console.log(123456,LoginService.getRole())
    $scope.flashProductList = [
    ];
    $scope.midActivtyList = [

    ]
    $scope.midCommList = [

    ]
    $scope.getCollected = function () {
      if ($scope.isCollected) {
        return '已收藏';
      } else {
        return '收藏';
      }
    }
    if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {//只有ios app 特有的样式
      $scope.paddingtopClass = {
        "margin-top": "16px"
      };
      $scope.paddingtopClasscontent = {
        "top": "64px"
      }
    }else{
      $scope.paddingtopClass = {
        "margin-top": "0px"
      };
      $scope.paddingtopClasscontent = {
        "top": "44px"
      }
    };

    $scope.$on('$ionicView.beforeEnter', function(event,data) {
       if($stateParams.shareId){
            $rootScope.shareId = $stateParams.shareId;
        }
      if(data.direction == 'back'){ 
        $scope.getCartNum();
        HomePageService.isWdHost().success(function (res) {
            $rootScope.isWdHost = res.data.isHost;
        })
        GetSwitchChecked();
        return;
      }
      specialtyVenueHomeControllerService.getAllProducts($scope.regionId, $scope.streetId).success(function(res) {
        // console.log(res);
        if (res.success) {
          $scope.topImgSrc = res.data.topImageUrl;
          $scope.shareImgUrl = res.data.simplePicUrl;
          $scope.cities = res.data.cities;
          $scope.topBanners = res.data.topBanners;
          $scope.isCollected = res.data.isCollected;
          if ($scope.isCollected) {
            $scope.collectImgSrc = $rootScope.imgBaseURL + 'img/ic_shoucang_0.png';
          }
          $scope.recommendations = res.data.recommendations;
          $scope.hotProducts = res.data.hotProducts;
          $scope.communities = res.data.communities;
          $scope.competitiveProducts = res.data.competitiveProducts;
          $scope.pageTitle = res.data.pageTitle;
          $scope.collects = res.data.collects; //收藏数
          $scope.recommendProducts = res.data.recommendProducts; //全部商品推荐
          $ionicSlideBoxDelegate.$getByHandle('sepcialty_top_banner').update();
          $ionicSlideBoxDelegate.$getByHandle('sepcialty_top_banner').loop(true);
          $ionicSlideBoxDelegate.$getByHandle('specialty_recommond_banner').update();
          $ionicSlideBoxDelegate.$getByHandle('specialty_recommond_banner').loop(true);

          if ($scope.hotProducts != null) {
            $scope.hotProdcutTitle = $scope.hotProducts[0].moudleTitle;
          }
          if ($scope.recommendations != null) {
            $scope.curatorOfRecommendedTitle = (($scope.recommendations[0])[0]).moduleTitle;
          }
          if ($scope.competitiveProducts != null) {
            $scope.boutiqueTitle = $scope.competitiveProducts[0].moudleTitle;
          }
          // console.log(11111);

        }
      })
      $scope.getCartNum();
      HomePageService.isWdHost().success(function (res) {
          $rootScope.isWdHost = res.data.isHost;
      })
      GetSwitchChecked();
    });
    $scope.settingsList = '';//是否显示佣金本地存储
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
    }
    //获取数量
    $scope.getCartNum = function () {
      CartService.getNumber()
        .success(function (res) {
          if(res.success){
            $scope.cartTotalNum = res.data;
          }else{
            $scope.cartTotalNum = 0;
          }
        })
    };
    $scope.$on('$ionicView.beforeLeave', function () {
      $scope.isDisplay = false;
      $scope.menuImg = $rootScope.imgBaseURL + 'img/ic_lookMore.png';
      // $ionicSlideBoxDelegate.$getByHandle('sepcialty_top_banner').loop(false);
          // $ionicSlideBoxDelegate.$getByHandle('specialty_recommond_banner').update();
          // $ionicSlideBoxDelegate.$getByHandle('specialty_recommond_banner').loop(false);

    })
    /*返回*/
    $scope.goBack = function() {
      $ionicHistory.goBack();
      // $state.go('localSpecialtyHomePage');
    };

    $scope.showPopup = function (message) {
      // console.log(message);
      var myPopup = $ionicPopup.show({
        template: message
      });
      $timeout(function () {
        myPopup.close();
      }, 1000);
    };
    $scope.collected = function () {
      // console.log(123123);
      // console.log($scope.isCollected);
      if ($scope.isCollected) {
        // console.log(123456)
        specialtyVenueHomeControllerService.cancelCollect($scope.regionId).success(function (res) {
          // console.log(res);
          if (res.success) {
            $scope.isCollected = 0;
            if ($scope.collects.indexOf('万') < 0) {
              // console.log(($scope.collects --) + '');
                $scope.collects = (parseInt($scope.collects) - 1) + '';
            }
            $scope.showPopup('取消成功');
            $scope.collectImgSrc = $rootScope.imgBaseURL + 'img/ic_shoucang_1.png';
          }
        })
      } else {
        // console.log(2222);
        specialtyVenueHomeControllerService.addCollect($scope.regionId).success(function (res) {
          // console.log(res);
          if (res.success) {
            $scope.isCollected = 1;
              if ($scope.collects.indexOf('万') < 0) {
                $scope.collects = (parseInt($scope.collects) + 1) + '';
              }
              // $scope.collects ++;
            $scope.collectImgSrc = $rootScope.imgBaseURL + 'img/ic_shoucang_0.png';
            $scope.showPopup('收藏成功');
          }
        })
      }
    }
    $scope.goToListOfSpecialtyGoods = function () {
      $state.go('ListOfSpecialtyGoods',{pageId:$scope.regionId,productCateId:0});
    }

    $scope.showMenu = function () {
      if ($scope.isDisplay) {
        $scope.isDisplay = false;
        $scope.menuImg = $rootScope.imgBaseURL + 'img/ic_lookMore.png'
      } else {
        $scope.isDisplay = true;
        $scope.menuImg = $rootScope.imgBaseURL + 'img/ic_lookMoreActive.png'
      }
    }
    $scope.hideMenu = function () {
      $scope.isDisplay = false;
      $scope.menuImg = $rootScope.imgBaseURL + 'img/ic_lookMore.png'
    }
    $scope.cancelShare = function () {
      $scope.showShare = false;
    }
    $scope.goSecondLevelStore = function (id) {
      // console.log(id);
      $state.go('secondLevelStore',{cityId: id});
    }
    $scope.goProductDetail = function () {
      $state.go('')
    }
    $scope.bannerClick = function (linkType, link,relationId) {
      var tempArr = link.split('&');
      switch (linkType) {
        case -1:
          BannerThemeService.getBannerTheme(relationId)
            .success(function (response) {
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
        case 1: //单品页
          var productId = tempArr[0].slice(tempArr[0].indexOf('=') + 1);
          $state.go('productDetail', {
            fromType: '',
            fromUrl: '',
            o2oType: 0,
            productId: productId,
            storeId: $scope.storeId
          });
          break;
        case 2: //领券中心/优惠券详情页
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
        case 3: //游戏页
          var gameId = link.slice(link.indexOf('=') + 1);
          $state.go('game', {
            gameId: gameId
          });
          break;
        case 4: //活动页
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
        case 5: //自定义类型页
          if (window.cordova) {
            /**
             * H5跳转原生webView页面
             * @param resultUrl {String} 链接url
             * @param title {String} 标题
             *
             */
            if (link.indexOf('m.ehaier.com/www/index.html') != -1) {
              var url = link.slice(link.indexOf('#/'));
              window.location.hash = url;
            } else {
              window.emc.presentH5View(link, "");
            }
          } else {
            window.open(link, '_blank', 'location=yes');
          }
          break;
        case 6: //众筹
          $state.go('crowdFunding');
          break;
        case 7: //新品
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
        case 8: //社群
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
    };
    // $scope.showHomePageTipImg = false;
    $scope.toShare = function () {
        $scope.isDisplay = false;
        if (!window.cordova) {

            $scope.showPopup('请下载APP执行此操作');
            return;
        }
        $scope.menuImg = $rootScope.imgBaseURL + 'img/ic_lookMore.png';
        if (!UserService.isUserLogin()) {
            $state.go('login');
            return;
        }
        

      $scope.showShare = true;

      if (window.device) {

        // if (!$scope.productModel) {
        //   $scope.showPopup('网络连接失败，请稍后分享');
        //   return;
        // }
        $scope.shareToPlatform();
        //新分享样式
        $scope.showShare = !$scope.showShare;
        /*********************分享标签－whiteBird end*********************/
      }
    }
    $scope.toHomePage = function () {
      $scope.isDisplay = false;
      $state.go('homePage');
    }
    $scope.contactCustomer = function () {
      $scope.isDisplay = false;
      if (UserService.isUserLogin()) { //如果没有登录 跳转到登录页面
          // $state.go('login');
        var chatparams = {
          goods_id:'-1',//消息页等其他页面商品id固定传-1  单品页传商品id正常传  订单传商品id正常传
          clientGoods_type:'1',//传1
          //0:客服端不展示商品信息;1：客服端以商品ID方式获取商品信息(goods_id:商品ID，clientGoods_type = 1时goods_id参数传值不能为空)
          appGoods_type:'0'//单品页传1  订单传3 并吧三下面的四个参数传递过来
        };
        if (window.xneng) {
          window.xneng.NTalkerStartChat('hg_1000_1508927913371','普通客服组',chatparams,function(success){
            // console.log('小能调起成功');
          },function(error){
            // console.log(error);
          });
        }
        else {
          window.open('http://m.ehaier.com/v2/h5/sg/common/customService.html'+'?flag='+$localstorage.get('sg_login_token_secret').substring(6), '_blank', 'location=no');
        }
      } else {
        $state.go('login');
      }
    }
    $scope.shareToPlatform = function (index) {
      if (!UserService.getUser().mid) {
        $state.go('login');
        return;
      }
      var storeId = $localstorage.get('storeId', $rootScope.globalConstant.storeId);
      var title = $scope.pageTitle,
          content = '找特产，来顺逛，质量可靠价格亲民，特产惠欢迎您的到来～',
          pic = $scope.shareImgUrl, //product 里只有这个img

          url = UrlService.getShareLinkHeader() + 'SpecialtyVenueHome/' + $scope.regionId + '/' + $scope.streetId + '/' + storeId;//分享链接里的id 拿 用户ID
      var param={};
      var callbackWarpper=function(platform){
        CreditService.shareSuccessCallback(platform,param);
      };

      if (window.umeng) {
        if (index == 0) {
          window.umeng.shareToSina(title, content, pic, url, 0, null, callbackWarpper);
        } else if (index == 1) {
          window.umeng.shareToWechatSession(title, content, pic, url, 0, null, callbackWarpper);
        } else if (index == 2) {
          window.umeng.shareToWechatTimeline(title, content, pic, url, 0, null, callbackWarpper);
        } else if (index == 3) {
          window.umeng.shareToQQ(title, content, pic, url, 0, null, callbackWarpper);
          CreditService.qqShare();
        } else if (index == 4) {
          window.umeng.shareToQzone(title, content, pic, url, 0, null, callbackWarpper);
          CreditService.qqShare();
        }
        if (index == 5) {
          $scope.copeText(url);
        }else {
          CreditService.successShare();
        }
      } else {
        alert('umeng undefined 只能在app分享');
      }

      $scope.showShare = false;
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
    // $scope.hideblackCover = function () {
    //   $scope.showShare = false;
    // };

}]);


APP.service('specialtyVenueHomeControllerService', ['$http', 'UrlService', function ($http, UrlService) {
  this.getAllProducts = function (regionId,streetId) {
    var params = {
      regionId: regionId,
      streetId: streetId
    };
    return $http.get(UrlService.getZCUrl('SPECIALY_VENUE_HOME'), params);
  }
  this.addCollect = function (collectId) {
    var params = {
      type: 2,
      collectId: collectId
    };
    return $http.get(UrlService.getZCUrl('ADD_COLLECT'), params);
  }
  this.cancelCollect = function (collectId) {
    var params = {
      type: 2,
      collectId: collectId
    };
    return $http.get(UrlService.getZCUrl('CANCEL_COLLECT'), params);
  }

}]);







