/**
 * 刘成杰 2017-07-16.
 */
APP.controller('NewsuperMarketController', ['ProductDetailService','newHomeService','GoodsSearchService','$localstorage','$ionicModal','$ionicHistory','BannerThemeService','CLASSIFYMESSAGECRNTERService','$ionicScrollDelegate', '$ionicSlideBoxDelegate', 'GoodsService', '$q', 'HomePageService', 'CalculateStrLength', 'superMarketService', '$interval', '$http', '$scope', '$stateParams',
  '$state', 'UserService', '$timeout', '$rootScope', 'PopupService', 'ShopService',
  function (ProductDetailService,newHomeService,GoodsSearchService,$localstorage,$ionicModal,$ionicHistory,BannerThemeService,CLASSIFYMESSAGECRNTERService,$ionicScrollDelegate, $ionicSlideBoxDelegate, GoodsService, $q, HomePageService, CalculateStrLength, superMarketService, $interval, $http, $scope, $stateParams, $state, UserService, $timeout, $rootScope, PopupService, ShopService) {

    $scope.furnishType = ['食品', '母婴', '运动户外', '数码/电脑办公', '医药保健', '汽配', '腕表', ' '];
    $scope.furnishTypeId = [3275, 3159, 3323, 2739, 3353, 3369, 3225];
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
    $scope.dealPrice = CalculateStrLength.dealPrice;
    $scope.flagNum = false;
    $scope.messageImgUrl=$rootScope.imgBaseURL+"img/message_gray@2x.png";
    //地址选择框高度
    var screenHeight = window.innerHeight;
    var topHeight = 250 + 123;
    var contentHeight = screenHeight - topHeight + 'px';
    $scope.contentHeight = {
      'height': contentHeight
    }
     /** 地址变量声明 **/
     $scope.provinceId = '16';
     $scope.cityId = '173';
     $scope.region = '崂山区';
     $scope.regionId = 2450;
     $scope.streetId = 12036596; //中韩街道
     $scope.addressTitle = '选择地区';
     $scope.defaultValue = null;
     $scope.dataAdd = null;
     $scope.flag = 'SELECTION_LOCATION';
     $scope.level = 0;
     var addressMessage = {}; //自动定位地址信息
     var areaValue;
     $scope.dealPrice = CalculateStrLength.dealPrice;
     if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {
       $scope.isIosApp = true;
     } else {
       $scope.isIosApp = false;
     }
     $scope.locationImgUrl = $rootScope.imgBaseURL+"img/newvision/location.png";
     $scope.messageImgUrl = $rootScope.imgBaseURL+"img/newvision/xiaoxi.png";
    $scope.chooseType = function (index, event) {
      if (index != -1) {
        getFurnishAllData($scope.supermarketCates[index].id);
        console.log(event.target.offsetLeft);
        $("div.superMarket_xScroll div:not(:last)").css({"color":"#000000","border-left":'0px solid #eee',"border-right":'0px solid #eee',"border-bottom": "1px solid #EEEEEE"});
        $("div.superMarket_xScroll div:eq(" + index + ")").css({"color": "#FF6026","border-left":'1px solid #eee',"border-right":'1px solid #eee',"border-bottom":'0px solid #eee'});
        
        // $("div.superMarket_xScroll div:not(:last)").css("color", "#000000");
        // $("div.superMarket_xScroll div:eq(" + index + ")").css("color", "#2979FF");
        // $("div.superMarket_xScroll div.runningBox").animate({
        //   width: event.target.offsetWidth + "px",
        //   left: event.target.offsetLeft,
        //   color: "#2979FF"
        // }, {
        //   duration: 300,
        //   easing: 'easeOutCubic',
        // });
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
    // 格式化
    function Format(a) {
      if (a < 10) {
        a = '0' + a;
      } else {
        a = a;
      }
      return a;
    };
    function getAddress() {
      var deferred = $q.defer();
      GoodsService.getAddress()
        .success(function (res) {
          if (res.data == null) {
            var addressMessage = CommonAddressService.getAddressInfo();
            if (addressMessage) {
              $scope.region = addressMessage.regionName;
              deferred.resolve(addressMessage);
            } else {
              $scope.region = '崂山区';
              var obj = {
                provinceId: '16',
                cityId: '173',
                regionId: '2450',
                streetId: '12036596'
              }
              deferred.resolve(obj);
            }
          } else {
            var obj = eval(res.data);
            var regionIndex = obj[0].regionName.indexOf('/');
            $scope.region = obj[0].regionName.substr(0, regionIndex);
            deferred.resolve(obj[0]);
          }
        })
      return deferred.promise;
    }
    function readCache() {
      var homepage_hot_word = $localstorage.get('homepage_hot_word');
      var homepage_topMsg = $localstorage.getObject('homepage_topMsg');
      var homepage_middleMsg = $localstorage.getObject('homepage_middleMsg');
      var homepage_flash = $localstorage.getObject('homepage_flash');
      var homepage_find = $localstorage.getObject('homepage_find');
    //   if($localstorage.get('activity_icon')!='null'){
    //     $scope.nowImgIcon = $localstorage.getObject('activity_icon');
    //   }
      if($localstorage.get('activity_bg')!='null'){
        $scope.homePageActivityBg = $localstorage.getObject('activity_bg');
      }
      if (homepage_hot_word && homepage_hot_word != 'undefined') {
        $scope.hot_word = homepage_hot_word;
      }
      if (homepage_topMsg && !isEmptyObject(homepage_topMsg)) {
        //$scope.bannerList = homepage_topMsg.data.topBannerList;
        $scope.good = homepage_topMsg.data.good;
        $scope.askEvery = homepage_topMsg.data.askEvery;
        $scope.mustBuy = homepage_topMsg.data.mustBuy;
        $scope.wiki = homepage_topMsg.data.wiki;
        $scope.midCommList = homepage_topMsg.data.midCommList;
        //$scope.midActivtyList = homepage_topMsg.data.midActivtyList;
        //$scope.midBannerList = homepage_topMsg.data.midBannerList;
        $scope.crowdFunding = homepage_topMsg.data.crowdFunding;
        $ionicSlideBoxDelegate.update();
        $ionicSlideBoxDelegate.$getByHandle('homePage_slider').loop(true);
      }
      if (homepage_middleMsg && !isEmptyObject(homepage_middleMsg)) {
        $scope.floors = homepage_middleMsg.data.floors;
        $scope.fCommunity = homepage_middleMsg.data.fCommunity;
      }
      if (homepage_find && !isEmptyObject(homepage_find)) {
        $scope.data = homepage_find;
      }
    }
    function isEmptyObject(obj) {
      for (var name in obj) {
        return false; //返回false，不为空对象
      }
      return true; //返回true，为空对象
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
    //选择地址的modal
    $ionicModal.fromTemplateUrl('templates/common/CommonLocation.html', {
      scope: $scope,
      animation: 'slide-in-up',
    }).then(function (modal) {
      $scope.addressModal = modal;
    });
    $scope.closeAddressModal = function () {
      locationFlag = true;
      $scope.addressModal.hide();
    };
     //地址窗口
     $scope.addressTop = function () {
      $scope.addressTipFlag=false;
      $scope.provinceTop = 0;
      $scope.nowLevel = 0;
      $scope.nowLevelIndex = [-1, -1, -1, -1];
      $scope.provinceDis = false;
      $scope.cityDis = false;
      $scope.areaDis = false;
      $scope.addressModal.show();
      $scope.dataAdd = null;
      $scope.defaultValue = null;
      $scope.selectProvince = '';
      $scope.selectCity = '';
      $scope.selectArea = '';
      $scope.addressInit($scope.dataAdd, $scope.defaultValue, 'SELECTION_LOCATION', 0);
    }
     //地址初始化
    $scope.addressInit = function (defaultValue, data, flag, level) {
      $scope.addressTipFlag=false;
      $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
      $scope.addressTitle = '选择地区';
      if (defaultValue) {
        $scope.defaultValue = JSON.parse(defaultValue);
      } else {
        $scope.defaultValue = {};
      }
      $scope.level = level;
      if (data) {
        $scope.dataAdd = JSON.parse(data);
        $scope.nowLevel = $scope.level;
        $scope.nowLevel = $scope.nowLevel * (-1);
        for (var i = 0; i < $scope.nowLevelIndex.length; i++) {
          if (i > $scope.nowLevel) {
            $scope.nowLevelIndex[i] = -1;
          }
        }
      } else {
        $scope.finish = false;
        $scope.dataAdd="";
        //第一次取全国的省直辖市信息
        $http.get("data/region.json")
          .success(function (response) {
            $scope.dataAdd = response.data;
            $scope.finish = true;
            $scope.nowLevel = $scope.level;
            $scope.nowLevel = $scope.nowLevel * (-1);
            for (var i = 0; i < $scope.nowLevelIndex.length; i++) {
              if (i > $scope.nowLevel) {
                $scope.nowLevelIndex[i] = -1;
              }
            }
          })
          .error(function (err) {
            PopupService.showToast('获取地址信息失败！');
          })
      }
    }
     //重新选择的下边框
     $scope.bottomBorder = {
      'border-bottom': "2px solid red"
    }
    $scope.provinceFlag = false;
    $scope.cityFlag = false;
    $scope.areaFlag = false;
    $scope.selectFlag = true;
    $scope.provinceDis = false;
    $scope.cityDis = false;
    $scope.areaDis = false;

    //返回重新选择省
    $scope.provinceSel = function () {
      locationFlag = true;
      $scope.addressInit(null, null, 'SELECTION_LOCATION', 0);
      $scope.selectCity = '';
      $scope.selectArea = '';
      $scope.provinceFlag = true;
      $scope.selectFlag = false;
      $scope.provinceDis = true;
      $scope.cityDis = false;
      $scope.areaDis = false;
    }
    //选择地址的方法
    $scope.goSelect = ionic.Utils.debounce(function (index, item) {
      if (!locationFlag) {
        return;
      }
      locationFlag = false;
      for (var i = 0; i < $scope.nowLevelIndex.length; i++) {
        if (i > $scope.nowLevel) {
          $scope.nowLevelIndex[i] = -1;
        }
      }
      $scope.dataAdd="";
      $scope.nowLevelIndex[$scope.nowLevel] = index;
      var item = arguments[1];
      var index = arguments[0];
      $scope.level = $scope.level - 1; //-1,下一个 为 －2 ，
      $scope.defaultValue['text' + $scope.level] = item.text;
      $scope.defaultValue['value' + $scope.level] = item.value;
      if ($scope.level > -2) { //xyz修改2级本地获取
        $http.get("data/region.json")
          .success(function (response) {
            // console.log(123123,response);
            locationFlag = true;
            if ($scope.level == -1) { //省
              $scope.selectProvince = item.text;
              $scope.provinceIndex = index;
              $scope.dataAdd = response.data[index].children;
              $scope.provinceFlag = false;
              $scope.selectFlag = true;
              $scope.provinceDis = true;
              $scope.provinceTop = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
              $scope.nowLevel = $scope.level;
              $scope.nowLevel = $scope.nowLevel * (-1);
              //重选市
              $scope.citySel = function () {
                $scope.dataAdd="";
                $scope.addressInit(defaultValueFy, dataAddFy, $scope.flag, -1);
                $scope.dataAdd = response.data[index].children;
                locationFlag = true;
                $scope.selectArea = '';
                $scope.cityFlag = true;
                $scope.selectFlag = false;
                $scope.provinceDis = true;
                $scope.cityDis = true;
                $scope.areaDis = false;
                $ionicScrollDelegate.$getByHandle('mainScroll').scrollTo(0, $scope.cityTop);
              }
            } else {
              $scope.dataAdd = $scope.dataAdd[index].children;
            }
            var defaultValueFy = JSON.stringify($scope.defaultValue);
            var dataAddFy = JSON.stringify($scope.dataAdd);

            $scope.addressInit(defaultValueFy, dataAddFy, $scope.flag, $scope.level);
          })
          .error(function (err) {
            PopupService.showToast('获取地址信息失败！');
            locationFlag = true;
          });
      } else if ($scope.level > -4) { //xyz添加远端获取     市区
        $scope.selectCity = $scope.defaultValue['text-2'];
        $scope.provinceFlag = false;
        $scope.cityFlag = false;
        $scope.selectFlag = true;
        $scope.provinceDis = true;
        $scope.cityDis = true;
        $scope.areaDis = false;
        if ($scope.level == -3) { //区
          $scope.selectArea = item.text;
          $scope.cityFlag = false;
          $scope.areaFlag = false;
          $scope.selectFlag = true;
          $scope.provinceDis = true;
          $scope.cityDis = true;
          $scope.areaDis = true;
          $scope.areaTop = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
        } else { //市
          $scope.cityTop = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
        }
        ah = $scope.level * -1;
        $scope.addressTip='正在获取地址信息...';
        $scope.addressTipFlag=true;
        GoodsService.getLocationList(item.value, ah).success(function (response) {
          locationFlag = true;
          $scope.dataAdd = response.data;
          $scope.addressTipFlag=false;
          if (ah == 2) {
            areaValue = item.value;
          }
          var defaultValueFy = JSON.stringify($scope.defaultValue);
          var dataAddFy = JSON.stringify($scope.dataAdd);
          $scope.addressInit(defaultValueFy, dataAddFy, $scope.flag, $scope.level);
        }).error(function (err) {
          PopupService.showToast('获取地址信息失败！');
          locationFlag = true;
        });
        $scope.levelArea = $scope.level;
        $scope.levelArea = $scope.levelArea + 1;
        //重选区
        $scope.areaSel = function () {
          $scope.level = $scope.levelArea;
          $scope.addressTip='正在获取地址信息...';
          $scope.addressTipFlag=true;
          $scope.dataAdd="";
          GoodsService.getLocationList(areaValue, 2).success(function (response) {
            $scope.dataAdd = response.data;
            $scope.addressTipFlag=false;
            var defaultValueFy = JSON.stringify($scope.defaultValue);
            var dataAddFy = JSON.stringify($scope.dataAdd);
            locationFlag = true;
            $scope.addressInit(defaultValueFy, dataAddFy, $scope.flag, $scope.level);
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollTo(0, $scope.areaTop);
            $scope.areaFlag = true;
            $scope.selectFlag = false;
            $scope.provinceDis = true;
            $scope.cityDis = true;
            $scope.areaDis = true;
          }).error(function (err) {
            PopupService.showToast('获取地址信息失败！');
            locationFlag = true;
          });
        }
      } else {
        locationFlag = true;
        if (isGoing) {
          return;
        }
        $timeout(function () {
          isGoing = false;
        }, 1500);
        $rootScope.$broadcast($scope.flag, $scope.defaultValue);
        isGoing = true;
        $scope.closeAddressModal();
      }
    }, 300);
    //修改地址广播回调
    $rootScope.$on('SELECTION_LOCATION', function (event, data) {
      $scope.region = data['text-3'];
      $scope.streetName = data['text-4'];
      var detailAddress = $scope.region + '/' + $scope.streetName;
      $scope.provinceId = data['value-1'];
      $scope.cityId = data['value-2'];
      $scope.regionId = data['value-3'];
      $scope.streetId = data['value-4'];
      $scope.panAddressSel = true;
      $scope.page = 1;
      GoodsService.addAddress($scope.provinceId, $scope.cityId, $scope.regionId, detailAddress, $scope.streetId)
        .success(function (response, status, headers, config) {
          if (response.success) {
            // getProductList($scope.memberId, $scope.provinceId, $scope.cityId, $scope.regionId, $scope.streetId, $scope.page, 5, 1, 'saleDesc', 'all', false);
            // $scope.selectTab($scope.selectedIndex);
          }
          $scope.init();
        });
    });
    $scope.getPosition = function () {
      // alert(1);
      if ($rootScope.globalConstant.autoPosition == '定位中···') {
        return;
      }
      addressMessage = CommonAddressService.getAddressInfo();
      var detailAddress = addressMessage.regionName + '/' + addressMessage.streetName;
      GoodsService.addAddress(addressMessage.provinceId, addressMessage.cityId, addressMessage.areaId, detailAddress, addressMessage.streetId)
        .success(function () {
          var autoAddress = {
            'text-1': addressMessage.provinceName,
            'text-2': addressMessage.cityName,
            'text-3': addressMessage.regionName,
            'text-4': addressMessage.streetName,
            'value-1': addressMessage.provinceId,
            'value-2': addressMessage.cityId,
            'value-3': addressMessage.areaId,
            'value-4': addressMessage.streetId
          };
          $rootScope.$broadcast($scope.flag, autoAddress);
          //        $scope.addressSuccess=true;
        }).error(function () {
        //      	$scope.addressSuccess=false;
      })
      $scope.addressModal.hide();
    };
    //banner select
    $scope.chooseTypes = function (index, event) {
      if (index != -1) {
      //$rootScope.scrollNum=$('ion-view[nav-view="active"] .newHomeScroll .scroll').css('transform');
      console.log($rootScope.scrollNum)
      if(index==0){
            $state.go('newHome')
        }else if(index==1){
            $state.go('newHomeMake')
        }else if(index==2){
          $state.go('newHomeOrder')
        }else if(index==3){
          $state.go('newHomeSend')
        }else if(index==4){
          $state.go('newsuperMarket')
        }else if(index==5){
          $state.go('newHomeLife')
        }else if(index==6){
            $state.go('newTestingStore');
        }
      }
    }
    $scope.init = function () {
      $scope.navImg=[
        $rootScope.imgBaseURL+'img/supermarket/super1.png',
        $rootScope.imgBaseURL+'img/supermarket/super2.png',
        $rootScope.imgBaseURL+'img/supermarket/super3.png',
        $rootScope.imgBaseURL+'img/supermarket/super4.png',
        $rootScope.imgBaseURL+'img/supermarket/super5.png',
        $rootScope.imgBaseURL+'img/supermarket/super6.png',
        $rootScope.imgBaseURL+'img/supermarket/super7.png',
        $rootScope.imgBaseURL+'img/supermarket/super8.png',
        $rootScope.imgBaseURL+'img/supermarket/super9.png',
        $rootScope.imgBaseURL+'img/supermarket/super10.png',
        $rootScope.imgBaseURL+'img/supermarket/super11.png',
        $rootScope.imgBaseURL+'img/supermarket/super12.png',
        $rootScope.imgBaseURL+'img/supermarket/super13.png',
        $rootScope.imgBaseURL+'img/supermarket/super14.png',
        $rootScope.imgBaseURL+'img/supermarket/super15.png',


      ]
      console.log($rootScope.scrollNum)
      
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
        })
      HomePageService.isWdHost()
        .success(function (res) {
          console.log(res);
          $scope.isWdHost = res.data.isHost;
        })
      // HomePageService.getUnReadMsg()
      //     .success(function (res) {
      //       if (res.data > 0) {
      //         $scope.flagNum = true;
      //       } else {
      //         $scope.flagNum = false;
      //         CLASSIFYMESSAGECRNTERService.getMessageList()
      //         .success(function(response){
      //           console.log(response);
      //           if(response.data){
      //             $scope.flagNum = true;
      //           } else {
      //             $scope.flagNum = false;
      //           }
      //         })
      //       }
      //     })
      $scope.defaultValue = null;
      $scope.dataAdd = null;
      $interval.cancel($scope.timer);
      $interval.cancel($scope.timer1);
      // $ionicScrollDelegate.scrollTop();
      $scope.storeId = $localstorage.get('storeId', $rootScope.globalConstant.storeId);
      $scope.tabNav = 'newHome';
   
      //默认搜索词
      GoodsSearchService.defaultSearch()
        .success(function (response) {
          $scope.hot_word = response.data.hot_word;
          $localstorage.set('homepage_hot_word', $scope.hot_word);
        });
      //地址初始化
      $scope.addressInit($scope.dataAdd, $scope.defaultValue, 'SELECTION_LOCATION', 0);
      //最新消息
      ShopService.getMessage()
        .success(function (response) {
          $scope.msg = response.data.list[0].content;
        });
      newHomeService.getUnReadMsg()
        .success(function (res) {
          if (res.data > 0) {
            $scope.flagNum = true;
          } else {
            $scope.flagNum = false;
            CLASSIFYMESSAGECRNTERService.getMessageList()
            .success(function(response){
              if(response.data){
                $scope.flagNum = true;
              } else {
                $scope.flagNum = false;
                if(window.xneng){
                  window.xneng.NtalkerMessageList(function(success){
                    if(success==0){
                        console.log('无聊天');
                      }else{
                        for(var i =0;i<success.length;i++){
                          if(success[i].unreadMsgNum!=0){
                            $scope.flagNum = true;
                            break;
                          }
                        }
                      }
                  },function(error){
                    alert(error);
                    })
                }
              }
            })
          }
        });
        ProductDetailService.getCartNum().success(function(res){
        if(res.success){
          $rootScope.BottomCartNum = res.data;
        };
      });
      newHomeService.isWdHost()
        .success(function (res) {
          $rootScope.isWdHost = res.data.isHost;
          if (res.data.isHost == 1) {
            $localstorage.set('storeId', res.data.storeMemberId); //本地缓存 店铺ID
          } else {
            $localstorage.set('storeId', 20219251); //本地缓存 店铺ID
          }
        })

      getAddress()
      .then(function (res) {
        $scope.provinceId = res.provinceId;
        $scope.cityId = res.cityId;
        $scope.areaId = res.areaId;
        $scope.streetId = res.streetId;
        newHomeService.getMiddleMsg(res.provinceId, res.cityId, res.areaId, res.streetId)
          .success(function (res) {
            $localstorage.setObject('homepage_middleMsg', res);
            $scope.floors = res.data.floors;
            $scope.fCommunity = res.data.fCommunity;
            //楼层数据更新
            //更新轮播
            $timeout(function(){
              $ionicSlideBoxDelegate.update();
              $ionicSlideBoxDelegate.loop(true);
            },200);
          })
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
      $("div.superMarket_xScroll div:not(:last)").css({"color":"#000000","border-left":'0px solid #eee',"border-right":'0px solid #eee',"border-bottom": "1px solid #EEEEEE"});
      $("div.superMarket_xScroll div:eq(0)").css({"color": "#FF6026","border-left":'1px solid #eee',"border-right":'1px solid #eee',"border-bottom":'0px solid #eee'});
       //$('.newHomeScroll .scroll').css('transform',$rootScope.scrollNum);
      // $("div.superMarket_xScroll div:not(:last)").css("color", "#000000");
      // $("div.superMarket_xScroll div:eq(0)").css("color", "#2979FF");
      // $("div.superMarket_xScroll div.runningBox").css({
      //   "width": firstTypeWidth,
      //   "left": firstTypeLeft
      // });
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
              CLASSIFYMESSAGECRNTERService.getMessageList()
              .success(function(response){
                console.log(response);
                if(response.data){
                  $scope.flagNum = true;
                } else {
                  $scope.flagNum = false;
                }
              })
            }
          })

        return;
      }
      $scope.direction = 'foword';
      $scope.storeId = UserService.getUser().mid;
      $scope.nowLevelIndex = [-1, -1, -1, -1];
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
