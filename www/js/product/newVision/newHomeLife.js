/**
 * 刘成杰 2017-07-16.
 */
APP.controller('newHomeLifeController', ['$ionicPlatform','$ionicHistory','CLASSIFYMESSAGECRNTERService','UrlService','NewPersonService', 'trueAuthenticationService', '$localstorage', 'GoodsSearchService', 'RegisterService', '$ionicModal', 'ShopService', '$q', 'GoodsService', 'CalculateStrLength', '$interval', '$http', '$scope', '$stateParams', '$ionicSlideBoxDelegate',
  '$state', 'UserService', '$timeout', '$rootScope', '$ionicScrollDelegate', 'CommonAddressService', 'BannerThemeService', 'PopupService', 'newHomeLifeService', 'ProductDetailService','HomePageService','WhiteShowsService',
  function ($ionicPlatform,$ionicHistory,CLASSIFYMESSAGECRNTERService,UrlService,NewPersonService ,trueAuthenticationService, $localstorage, GoodsSearchService, RegisterService, $ionicModal, ShopService, $q, GoodsService, CalculateStrLength, $interval, $http, $scope, $stateParams, $ionicSlideBoxDelegate, $state, UserService, $timeout, $rootScope, $ionicScrollDelegate, CommonAddressService, BannerThemeService, PopupService, newHomeLifeService, ProductDetailService,HomePageService,WhiteShowsService) {


    var isGoing = false;
    var locationFlag = true;
    $scope.flagNum = false;
    $scope.flashHour = '';
    $scope.flashText='';
    $scope.isActive=false;
    $scope.newImg='';
    $scope.type='';
    $scope.urlHD='';
    $scope.isNoMessage=false;
    $scope.noMessageImg='';
    $scope.mtype='';
    $scope.urlNM='';
    $scope.oldImgIcon ={//非 活动图标
      "jydq": "img/jydq@2x.png",
      "jjjz": "img/Fitting@2x.png",
      "bhcs": "img/market@2x.png",
      "xpzc": "img/new@2x.png",
      "wddp": "img/openStore@2x.png",
      "jrlc": "img/jrlc@2x.png",
      "shfw": "img/icon_specialty.png",
      "gd": "img/gd@2x.png"
    };

    //头部轮播图默认高度
    $scope.definedHeight1 = {
      height:window.innerWidth/(750/408)+'px' || auto
    }

    //首页顶部8个图标下面的文字 颜色(非活动颜色)
    // $scope.activityColorOld = {
    //   "jydqFontColor": "#666666",
    //   "jrlcFontColor": "#666666",
    //   "wddpFontColor": "#666666",
    //   "bhcsFontColor": "#666666",
    //   "shfwFontColor": "#666666",
    //   "jjjzFontColor": "#666666",
    //   "xpzcFontColor": "#666666",
    //   "gdFontColor": "#666666"
    // };
    //当前应该展示的文字颜色对象
    // $scope.activityColor = {};
    $scope.nowImgIcon = $scope.oldImgIcon;//真正展示的图标
    //首页顶部8个导航按钮区域的背景(非活动背景)
    $scope.homePageActivityBg2 = {
      // "background":"url("+"'"+testpic+"'"+") left top/100% no-repeat"
      "background":"ffffff"
    };
    // $scope.isAccord = false;  // 普通用户升级微店主
    // $scope.isAuthentication = false;  // 历史微店主 是否实名认证
    var hasHistory = $stateParams.hasHistory;
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
    $scope.countTime = {}; //倒计时时间
    function renderCountDown(time) {
      $scope.countTime = {};
      var hours = parseInt((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = parseInt((time % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((time % (1000 * 60)) / 1000);
      $scope.countTime = {
        hours: hours,
        minutes: minutes,
        seconds: seconds
      }
    };
    jQuery.rnd = function (m, n) {
      m = parseInt(m);
      n = parseInt(n);
      return Math.floor(Math.random() * (n - m + 1)) + m;
    }
    // 礼花绽放效果
    function confetti() {
      $.each($(".sg_notice_content"), function () {
        var confetticount = ($(this).width() / 50) * 10;
        for (var i = 0; i <= confetticount; i++) {
          $(this).append('<span class="particle c' + $.rnd(1, 2) + '" style="top:' + $.rnd(10, 50) + '%; left:' + $.rnd(0, 100) + '%;width:' + $.rnd(6, 8) + 'px; height:' + $.rnd(3, 4) + 'px;animation-delay: ' + ($.rnd(0, 30) / 10) + 's;"></span>');
        }
      });
    }

    confetti();

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
      GoodsService.doInitFaxian(1, $scope.provinceId, $scope.cityId, $scope.regionId, $scope.streetId, $scope.storeId, true)
        .success(function (res) {
          $scope.data = res;
          $localstorage.setObject('homepage_find', res);
          if(res.isCanSyncGetPrice){
            GoodsService.asyncPrice(res.traceId).success(function(res){
              if(res.success){
                $scope.data = res;
                $localstorage.setObject('homepage_find', res);
              }
            });
          }
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
    $scope.chooseType = function (index, event) {
        if (index != -1) {
           // $rootScope.scrollNum=$('ion-view[nav-view="active"] .newHomeScroll .scroll').css('transform');
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
      $scope.storeId = $localstorage.get('storeId', $rootScope.globalConstant.storeId);
      if($scope.storeId!=20219251&&$scope.storeId!=''){
          $scope.isLogin = true;
      }else{
          $scope.isLogin = false;
      }
       newHomeLifeService.getSmartHome()
        .success(function(res){
        console.log(res);
        $scope.programNav=res.data.program.programs;
        $scope.recommend=res.data.recommend.recommends;
        })
        newHomeLifeService.getbanner()
        .success(function(res){
        console.log(res);
        $scope.banner=res.data
        })
        
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
      newHomeLifeService.getUnReadMsg()
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
      newHomeLifeService.isWdHost()
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
          console.log($scope.streetId,$scope.areaId,$scope.provinceId,$scope.cityId);
          newHomeLifeService.getLifeDetail($scope.streetId,$scope.areaId,$scope.provinceId,$scope.cityId)
            .success(function(response){
                console.log(response);
                for(var i=0;i<response.data.length;i++){
                    if(response.data[i].id==0){
                        $scope.relaxList=response.data[i].products;
                    }else if(response.data[i].id==1){
                        $scope.onlyList=response.data[i].products;
                    }
                }
                
            })
          newHomeLifeService.getMiddleMsg(res.provinceId, res.cityId, res.areaId, res.streetId)
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
          getFlashSales();
          GoodsService.doInitFaxian(1, $scope.provinceId, $scope.cityId, $scope.areaId, $scope.streetId, $scope.storeId, true)
            .success(function (res) {
              $scope.data = res;
              $localstorage.setObject('homepage_find', res);
              if(res.isCanSyncGetPrice){
                GoodsService.asyncPrice(res.traceId).success(function(res){
                  if(res.success){
                    $scope.data = res;
                    $localstorage.setObject('homepage_find', res);
                  }
                });
              }
            });
        })

    }
    function getFlashSales() {
      $interval.cancel($scope.timer);
      $interval.cancel($scope.timer1);
      newHomeLifeService.getFlashSales($scope.provinceId, $scope.cityId, $scope.areaId, $scope.streetId)
        .success(function (res) {
          //$localstorage.setObject('homepage_flash', res);
          if (res.data.flashProductList) {
            $scope.flashProductList = res.data.flashProductList;
            $scope.isWd = res.data.isWd;
            $scope.flashTime = res.data.flashTime; //活动开始时间
            $scope.systemTime = res.data.systemTime;//服务器时间
            $scope.preheatingTime = res.data.preheatingTime;//预热时间
            var nowMinute = new Date($scope.flashTime).getMinutes().toString();
            if(nowMinute == '0'){
              $scope.flashHour=new Date($scope.flashTime).getHours()+'点场'
            }else{
              $scope.flashHour=new Date($scope.flashTime).getHours()+'点半场'
            }
            if ($scope.flashProductList.length==0 || ($scope.systemTime - new Date($scope.flashProductList[0].endTime).getTime() > -1000) || ($scope.systemTime<$scope.preheatingTime)) {
              $scope.showFlashSale = false;
            } else {
              $scope.showFlashSale = true;
              if($scope.systemTime - new Date($scope.flashTime).getTime() > -1000){
                $scope.timer = $interval(function () {
                if (new Date($scope.flashProductList[0].endTime).getTime() - $scope.systemTime <1000) {
                  $interval.cancel($scope.timer);
                    getFlashSales();
                }
                renderCountDown(new Date($scope.flashProductList[0].endTime).getTime() - $scope.systemTime);
                $scope.systemTime+=1000;
              }, 1000);
                $timeout(function () {
                  $scope.flashText='结束';
                }, 1000)
              }else{
                $scope.timer1 = $interval(function () {
                if (new Date($scope.flashTime).getTime() - $scope.systemTime <1000) {
                  $interval.cancel($scope.timer1);
                  getFlashSales();
                }
                renderCountDown(new Date($scope.flashTime).getTime() - $scope.systemTime);
                $scope.systemTime+=1000;
              }, 1000);
                $timeout(function () {
                  $scope.flashText='开始';
                }, 1000)
              }
            }
          }else{
            $scope.showFlashSale = false;
          }
        })
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

    $scope.bannerClick = function (linkType, link, relationId) {
      var tempArr = link.split('&');
      console.log(linkType)
      var linkTypeNum=parseInt(linkType)
      switch (linkTypeNum) {
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
        console.log(22)
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
    }
  
    $scope.goProductDetail = function (pId) {
      $state.go('productDetail', {
        fromType: '',
        fromUrl: '',
        o2oType: 0,
        productId: pId,
        storeId: $scope.storeId
      })
    };
    $scope.gotoMyStore = function (isWdHost) {
      if (isWdHost == 1) { //开过店 1(记得改回来)
        $state.go('myStore', {
          storeId: $rootScope.loginMemberId ? $rootScope.loginMemberId : $scope.storeId
        });
      } else if (isWdHost == 0) { //普通用户 没开过店 0（记得改回来）
        RegisterService.wdApply().success(function (response) {
          if (response.success) {
            if (response.data) { //绑定过手机
              $state.go('newAuthenticationHome'); //去完善信息页面
            } else { //没绑定过手机
              $state.go('registerForStore', {
                hasHistory: 1
              }); //去绑定手机号  hasHistory
            }
          } else { //接口异常
            PopupService.showToast('服务端错误');
          }
        }).error(function () {
          alert('网络错误');
        });
      } else {
        $state.go('login');
      }
    }
    $scope.goNoteDetail = function (note) {
      $state.go('noteDetails', {
        noteId: 123,
        isShortStory: 231
      })
    }
    $scope.goPersonalHome = function (id) {
      $state.go('personalHomepageHe', {
        othersId: id
      })
    }
    $scope.goToManageMoney = function () {
      if ($rootScope.isWdHost == 1) {
        $state.go('financialMoney', {whereId: 'newHomeLife'});
      } else if ($rootScope.isWdHost == 0) { //普通用户 没开过店 0（记得改回来）
        RegisterService.wdApply().success(function (response) {
          if (response.success) {
            if (response.data) { //绑定过手机
              $state.go('newAuthenticationHome'); //去完善信息页面
            } else { //没绑定过手机
              $state.go('registerForStore', {
                hasHistory: 1
              }); //去绑定手机号  hasHistory
            }
          } else { //接口异常
            PopupService.showToast('服务端错误');
          }
        }).error(function () {
          alert('网络错误');
        });
      } else {
        $state.go('login');
      }
    }
    $scope.goBranchType = function () {
      $state.go('branchTypeDetail', {
        productCateId: "productCateId=3315"
      })
    }
    $scope.goToApplyForCard = function () {

      newHomeLifeService.isWdHost().success(function (res) {
        $rootScope.isWdHost = res.data.isHost;
        if (res.data.isHost == -1) {
          $state.go('login');
        } else {
          $state.go('applyForCard');
        }
      });
    }
    //云缴费
    $scope.goToLiving = function(){
      if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {
    $scope.isWhatApp = 'ios';
  } else if (ionic.Platform.platform().indexOf('android') != -1 && window.cordova)  {
    $scope.isWhatApp = 'android';
  } else {
    $scope.isWhatApp = 'H5';
  }
       GoodsService.getAddress()
    .success(function(res){
      if (res.data == null) {
        $scope.value = '173';

      } else {
        var data = eval(res.data)[0];
        $scope.value = data.cityId;
      }

      HomePageService.isWdHost()
        .success(function (res) {
          $rootScope.isWdHost = res.data.isHost;
          if (res.data.isHost == -1) {
            $state.go('login');
          } else {
            var url = UrlService.getLiveingUrl();
            console.log(url)
            var LIVING = url+"?flag="+$localstorage.get('sg_login_token_secret')+"&systemType="+$scope.isWhatApp+"&cityId="+$scope.value;
            //如果是 网页端
            if (!window.cordova) {
              window.location.href = LIVING;
            } else {
              /**
               * H5跳转原生webView页面
               * @param resultUrl {String} 链接url
               * @param title {String} 标题
               *
               */
              window.emc.presentH5View(LIVING, "生活缴费");
            }
          }
        });
    })
    };
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

    $scope.toApplyForWhite = function () {
        // console.log(12321321);
        if (!UserService.getUser().accessToken) {
          PopupService.showToast('您的当前帐号暂时无法访问此服务,请使用关联手机号登录');
          return;
        }
        WhiteShowsService.queryIousStatus({
            userId:UserService.getUser().ucId,
            token:UserService.getUser().accessToken
        }).success(function (res) {
            // $scope.iousStatus = 1;
            if (res.success) {
                // console.log(res);
                // $scope.iousStatus = res.data.applyStatus;
                if (res.data.applyStatus == 2 || res.data.applyStatus == 3) {
                  $state.go('applyForWhite');
                } else {
                    // 申请中直接打开消费金融
                    WhiteShowsService.applyForOpen({
                        backUrl:window.location.href,
                        userId:UserService.getUser().ucId,
                        token:UserService.getUser().accessToken
                    }).success(function (res) {
                        if(res.success) {
                            WhiteShowsService.openApplyWhiteShows(res.data.redirectUrl,window.location.href);
                        }
                        if (res.errorCode == 100) {
                          $state.go('login');
                        };
                    })
                }
            }
            if (res.errorCode == 100) {
              $state.go('login');
            };
        })
      }
        //生活服务
        $scope.goToEmc = function () {
            if ($scope.isApp) {
              HomePageService.isWdHost()
                .success(function (res) {
                  $rootScope.isWdHost = res.data.isHost;
                  if (res.data.isHost == -1) {
                    $state.go('login');
                  } else {
                    // var access_token = UserService.getUser().accessToken;
                    // console.log(access_token);
                    HomePageService.token_get()
                      .success(function (res) {
                        var access_token = res.data;
                        if (access_token) {
                          /**
                           *调转视图方法
                           * @param1 isOffical {Integer} （1:正式环境；0:测试环境）
                           * @param2 access_token {String} 用户中心返回的access_token
                           * @param3 entryPoint {String} 进入EMC后直接进入某功能，例如“OldforNew”,可传空字符串""
                           */
                          window.emc.presentEmcView(UrlService.getEnviroment(), access_token, "");
                        } else {
                          PopupService.showToast('您当前账号暂无法访问此服务,请使用关联手机号登录。');
                        }
                      })
                  }
                })
            }
            else {
              PopupService.showToast('请去顺逛App查看此服务');
            }
            // $state.go('lifeService');
          }
    $scope.$on('$ionicView.beforeLeave', function (e, v) {
      $scope.watch();
      $interval.cancel($scope.timer);
      $interval.cancel($scope.timer1);
    })
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
    $ionicPlatform.on('pause', function () {//当app退到后台时,取消首页的限时抢购的定时器
      if($ionicHistory.currentStateName() == 'homePage'){
        $interval.cancel($scope.timer);
        $interval.cancel($scope.timer1);
      }
    });
    $ionicPlatform.on('resume', function () {//当app重新从后台返回到前台时,重新获取首页限时抢购的数据 并开启一个新的计时器
      if($ionicHistory.currentStateName() == 'homePage'){
        getFlashSales();
      }
    });
    var nomess;
    $scope.$on('$ionicView.beforeEnter', function (e, v) {
       //更新轮播
      $timeout(function(){
        $ionicSlideBoxDelegate.loop(true);
        $ionicSlideBoxDelegate.start();
        $ionicSlideBoxDelegate.update();
      },200);
       
      if (v.direction == 'back') {
        $timeout(function () {
          GetSwitchChecked(); //获取是否显示佣金 本地存储值

          setTimeout(function () {
            readCache();
          }, 0);
          if (window.cordova) {
            $scope.isApp = true;
          } else {
            $scope.isApp = false;
          }
          $scope.showHomePageTipImg = $localstorage.get('homePageTipImg');
          $scope.nowLevelIndex = [-1, -1, -1, -1];
          $scope.watch = $scope.$watch('finish', function (newValue, oldValue) {
            if (newValue) {
              $ionicScrollDelegate.$getByHandle('mainScroll').scrollTo(0, $scope.provinceTop);
            }
          });
          $scope.showFlashSale = false; //是否显示限时抢购

          // $scope.init();
        }, 1000)
      } else {
        GetSwitchChecked(); //获取是否显示佣金 本地存储值

        setTimeout(function () {
          readCache();
        }, 0);
        if (window.cordova) {
          $scope.isApp = true;
        } else {
          $scope.isApp = false;
        }
        $scope.showHomePageTipImg = $localstorage.get('homePageTipImg');
        $scope.nowLevelIndex = [-1, -1, -1, -1];
        $scope.watch = $scope.$watch('finish', function (newValue, oldValue) {
          if (newValue) {
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollTo(0, $scope.provinceTop);
          }
        });
        $scope.showFlashSale = false; //是否显示限时抢购

        $scope.init();
      }
    });
    $scope.$on('$ionicView.enter', function (e, v) {
       // $('.newHomeScroll .scroll').css('transform',$rootScope.scrollNum)
      })

  }
]);


APP.service('newHomeLifeService', ['$http', 'UrlService', function ($http, UrlService) {
  this.getSmartHome = function (){
    return $http.get(UrlService.getNewUrl('SMART_HOME'));
  }
  this.getbanner = function () {
    return $http.get(UrlService.getNewUrl('NEW_HOME_BANNER'),{itemsId:6});
  }
  this.getTopic=function(){
    return $http.get(UrlService.getNewUrl('NEW_HOME_TOPIC'));
  }
  this.getLifeDetail = function(streetId,regionId,provinceId,cityId){
    var params = {
      streetId:streetId,
      regionId:regionId,
      provinceId:provinceId,
      cityId:cityId
    }
    return $http.get(UrlService.getNewUrl('LIFE_SERVICES'),params);
  }
  this.getTopMsg = function () {
    return $http.get(UrlService.getNewUrl('HOMEPAGE_TOP'));
  }
  this.getMiddleMsg = function (provinceId, cityId, districtId, street) {
    var params = {
      provinceId: provinceId,
      cityId: cityId,
      districtId: districtId,
      street: street
    };
    return $http.get(UrlService.getNewUrl('HOMEPAGE_MIDDLE'), params);
  }
  this.isWdHost = function () {
    return $http.get(UrlService.getNewUrl('HOMEPAGE_ISWDHOST'));
  }
  this.getFlashSales = function (provinceId, cityId, districtId, street) {
    var params = {
      provinceId: provinceId,
      cityId: cityId,
      districtId: districtId,
      streetId: street
    };
    return $http.get(UrlService.getNewUrl('HOMEPAGE_FALSHSALES'), params);
  }
  this.getUnReadMsg = function () {
    return $http.get(UrlService.getUrl('UNRED_MESSAGE'));
  };
  //活动图标
  this.getActivityIcon = function () {
    return $http.get(UrlService.getNewUrl('ACTIVITY_ICON_TABS_NEW'),{iconType:1});
  };
  //顶部活动背景图片
  this.getActivityBg = function () {
    return $http.get(UrlService.getNewUrl('ACTIVITY_BG'));
  };
  //Token的获取
  this.token_get = function () {
    return $http.post(UrlService.getUrl('TOKEN_GET'));
  };
}]);
APP.service('GoodsService', ['$http', 'UrlService', function ($http, UrlService) {
  //除发现页初始化
  this.doInit = function (pholder, provinceId, cityId, districtId, streetId, storeId, productCateStr, sortColumn, areaId) {
    var params = {
      'pholder': pholder,
      'provinceId': provinceId,
      'cityId': cityId,
      'districtId': districtId,
      'streetId': streetId,
      'storeId': storeId,
      'productCateStr': productCateStr,
      'sortColumn': sortColumn,
      'areaId': areaId
    };
    return $http.get(UrlService.getUrl('SELECT_INIT'), params);
  };

  //发现页面初始化
  this.doInitFaxian = function (d, provinceId, cityId, districtId, streetId, storeId, noLoading) {
    var params = {
      'd': d,
      'provinceId': provinceId,
      'cityId': cityId,
      'districtId': districtId,
      'streetId': streetId,
      'storeId': storeId,
      'noLoading': noLoading
    };
    return $http.get(UrlService.getUrl('FAXIAN_INIT'), params);
    // return $http.get('http://mobiletest.ehaier.com:38081/v3/mstore/sg/loadFindProductsNew.html', params);
  };

  //商品分类(滚动条)切换
  this.changeSuccess = function (type) {
    var params = {
      'type': type
    };
    return $http.get(UrlService.getUrl('CHANGESUCCESS_INIT'), params);
  };

  //加号状态修改
  this.changeChooseStateJia = function (productId, onShelf) {
    var params = {
      'productId': productId,
      'onShelf': onShelf
    };
    return $http.get(UrlService.getUrl('CHANGECHOOSESTATEJIA_INIT'), params);
  };

  //对号状态修改
  this.changeChooseStateDui = function (productId) {
    var params = {
      'productId': productId
    };
    return $http.get(UrlService.getUrl('CHANGECHOOSESTATEDUI_INIT'), params);
  };

  //上拉加载商品
  this.loadMoreProducts = function (pholder, provinceId, cityId, districtId, streetId, pageIndex, pageSize, productCateStr, memberId, filterData, fromType, noLoading) {
    var params = {
      'pholder': pholder,
      'provinceId': provinceId,
      'cityId': cityId,
      'districtId': districtId,
      'streetId': streetId,
      'pageIndex': pageIndex,
      'pageSize': pageSize,
      'productCateStr': productCateStr,
      'memberId': memberId,
      'filterData': filterData,
      'fromType': fromType,
      'noLoading': noLoading
    };
    return $http.get(UrlService.getUrl('LOADMOREPRODUCTS_INIT'), params);
  };

  //获取轮播图信息
  this.getSlideImage = function () {
    var params = {
      'page': 'app_home',
      'isBack': 0
    };
    return $http.get(UrlService.getUrl('GET_SELECTION_IMAGE'), params);
  };

  //添加地址信息
  this.addAddress = function (provinceId, cityId, areaId, regionName, streetId) {
    var params = {
      'provinceId': provinceId,
      'cityId': cityId,
      'areaId': areaId,
      'regionName': regionName,
      'streetId': streetId,
      'noLoading': true
    };
    return $http.get(UrlService.getUrl('ADDADDRESSSELECTION_INIT'), params);
    // return $http.get('http://mobiletest.ehaier.com:38081/v3/mstore/sg/addPositionToCookie.json', params);
  };
  //获取地址信息
  this.getAddress = function () {
    return $http.get(UrlService.getUrl('GET_POSITION_FROM_COOLIE'));
    // return $http.get('http://mobiletest.ehaier.com:38081/v3/mstore/sg/getPositionFromCookie.json');
  };
  //获取省市区Id
  this.getAddressId = function (provinceName, cityName, regionName, streetName, gbCode) {
    var params = {
      'provinceName': provinceName,
      'cityName': cityName,
      'regionName': regionName,
      'streetName': streetName,
      'gbCode': gbCode,
      'noLoading': true
    };
    return $http.get(UrlService.getUrl('GET_ADDRESS_ID'), params);
  };
  //获取筛选列表
  this.getFilterData = function (productId) {
    var params = {
      'productCateId':productId?productId:''
    }
    return $http.get(UrlService.getUrl('GET_FILTER_DATA'), params);
  };
  this.getSelectionProducts = function (memberId, provinceId, cityId, districtId, streetId, pageIndex, pageSize, fromType, filterData, productCateStr, noLoading) {
    var params = {
      memberId: memberId,
      provinceId: provinceId,
      cityId: cityId,
      districtId: districtId,
      streetId: streetId,
      pageIndex: pageIndex,
      pageSize: pageSize,
      fromType: fromType,
      filterData: filterData,
      productCateStr: productCateStr,
      flag: '',
      productCateId: '',
      noLoading: noLoading
    };
    return $http.get(UrlService.getUrl('GET_SELECTION_PRODUCTS'), params);
  }
  //地址
  this.getLocationList = function (parentId, regionType) {
    var params = {
      parentId: parentId,
      regionType: regionType
    };
    return $http.get(UrlService.getUrl('GET_REGION_BY_ID_TYPE'), params);
    // return $http.get('http://mobiletest.ehaier.com:38081/v3/mstore/sg/getRegionByPIdAndReType.html', params);
  };
  //异步获取价格 tianbao
  this.asyncPrice = function (newdata) {
    newdata.noLoading = true;
    var param = {
      traceId: newdata,
    }
    return $http({
      method: 'POST',
      url: UrlService.getUrl('ASYNC_ACCESS_PRICE'),
      params: param,
    });
  };
}]);
// 新手大礼包 无信息弹窗
APP.service('NewPersonService', ['$http', 'UrlService', function ($http, UrlService) {
  this.getImage = function () {
    var params = {
      noLoading: true
    };
    return $http.get(UrlService.getUrl('GET_NEW_PERSON'), params);
  }
}]);
