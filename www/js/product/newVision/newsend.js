APP.controller('newHomesendCtrl',['$stateParams','$scope','$ionicModal','$q','newHomeService','ProductDetailService','GoodsSearchService','ShopService','$http','CalculateStrLength','GoodsService','CLASSIFYMESSAGECRNTERService','flashService','$state','$ionicHistory','$interval','$timeout','newsendService','$rootScope','$localstorage','$ionicSlideBoxDelegate','UserService','$ionicScrollDelegate','BannerThemeService','HomePageService','CommonAddressService',function($stateParams,$scope,$ionicModal,$q,newHomeService,ProductDetailService,GoodsSearchService,ShopService,$http,CalculateStrLength,GoodsService,CLASSIFYMESSAGECRNTERService,flashService,$state,$ionicHistory,$interval,$timeout,newsendService,$rootScope,$localstorage,$ionicSlideBoxDelegate,UserService,$ionicScrollDelegate,BannerThemeService,HomePageService,CommonAddressService){
		/*声明变量*/
  $scope.typeNumber = $stateParams.type;
  $scope.typeNumber = $scope.typeNumber==2 ? 2:1;
    $scope.isWd=false;
		$scope.newprod=[];
		$scope.showtime='';
		$scope.presell=[];
		$scope.zcnow=[];
		$scope.zcpre=[];
		$scope.zcold=[];
    $scope.flagNum = false;
    $scope.messageImgUrl =$rootScope.imgBaseURL+ "img/message_gray@2x.png";
    var isGoing = false;
    var locationFlag = true;
    $scope.flagNum = false;
    $scope.flashHour = '';
    $scope.flashText='';
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
    $scope.locationImgUrl =$rootScope.imgBaseURL+ "img/newvision/location.png";
    $scope.messageImgUrl = $rootScope.imgBaseURL+"img/newvision/xiaoxi.png";
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
    /*方法*/
    $scope.chooseType = function (index, event) {
      if (index != -1) {
        //$rootScope.scrollNum=$('ion-view[nav-view="active"] .newHomeScroll .scroll').css('transform');
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
    $scope.init=function(){
      
      $scope.storeId = $localstorage.get('storeId',$rootScope.globalConstant.storeId);
      /*轮播*/
      console.log($scope.storeId);
      newsendService.slidedata().success(function(res){
        console.log(res)
          $scope.bannerList=[];
          $scope.others=[];
          $scope.bannerList = res.data.topBanner;
          $scope.others = res.data.others.slice(0,2);
          $ionicSlideBoxDelegate.update();
          $ionicSlideBoxDelegate.$getByHandle("newsend_slide").loop(true);
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
    $scope.defaultValue = null;
    $scope.dataAdd = null;
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
      })
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
      /*获取店铺id*/
    /*请求预约数据*/
    GoodsService.getAddress().success(function(response){
         var obj = eval(response.data);
         console.log(obj);
         newsendService.getnewProd(obj[0].provinceId,obj[0].cityId,obj[0].areaId,obj[0].streetId,1).success(function(response){
        console.log(response);
        if (response.data.isWd == true) {
            $scope.isWd = true;
          } else {
            $scope.isWd = false;
          }
        $scope.newprod=response.data.acReserveList[0];//取的第一页第一个
        if($scope.newprod){
          add(response.data.acReserveList[0].reserveStartTime,response.data.acReserveList[0].reserveEndTime);
        }
    })
    })
    /*请求预售数据*/
    newsendService.getpres().success(function(response){
        $scope.presell=response.data.slice(0,3);//取的第一页前三个
        console.log(response)
      })
      /*请求众筹数据*/

      newsendService.getcrowold($scope.typeNumber).success(function(response){
        $scope.zcold=response.data.zActivitySuccessList;
        $scope.zcnow=response.data.zActivityBeginningList;
        $scope.zcpre=response.data.zActivityToBeginList;
      })
    }
    //点击轮播图执行方法
		$scope.bannerClick = function (linkType, link, relationId) {
      var tempArr = link.split('&');
      switch (linkType) {
         case '-1':
          BannerThemeService.getBannerTheme(relationId)
            .success(function (response) {
              console.log(response);
              $state.go('bannerDaily', {
                bannerId: relationId,
                layout: response.data.layout
              });
            });
          break;
        case '0':
          $state.go('bannerTheme', {
            bannerId: relationId
          });
          break;
        case '1': //单品页
        var fromType=link.slice(link.lastIndexOf('=')+1);
        var reg=/\=(.*?)\&/g;
        var arr=link.match(reg);
        var arr1=[];
        for(var x=0;x<arr.length;x++){
            arr1.push(arr[x].substring(1,arr[x].length-1));
        }
          //var productId = link.slice(link.indexOf('=' + 1));
          $state.go('productDetail', {
            fromType: fromType,
            fromUrl: arr1[3],
            o2oType: arr1[2],
            productId: arr1[0],
            storeId:arr1[1]
          });
          break;
        case '2': //领券中心/优惠券详情页
          if (!link) {
            $state.go('getCouponsList');
          } else {
            var couponsId = link.slice(link.indexOf('=' + 1));
            $state.go('couponsDetail', {
              cId: couponsId,
              userID: $scope.storeId,
              type: 2
            });
          }
          break;
        case '3': //游戏页
          var gameId = link.slice(link.indexOf('=' + 1));
          $state.go('game', {
            gameId: gameId
          });
          break;
        case '4': //活动页
          if (tempArr[0].slice(tempArr[0].indexOf('=') + 1) == '日常活动') {
            BannerThemeService.getBannerTheme(tempArr[1].slice(tempArr[1].indexOf('=') + 1))
              .success(function (response) {
                console.log(response);
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
        case '5': //自定义类型页
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
        case '6': //众筹
          $state.go('crowdFunding');
          break;
        case '7': //新品
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
        case '8': //社群
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
		/*距离结束时间封装函数*/
    function add(startTime,endTime){
		var nowdate = new Date();
		/*一堆计算*/
		var s1 = startTime,s2 = endTime,s3=nowdate.getTime();
		var timer=$interval(function(){
				s3=s3+1000;
				var toendtime=parseInt((s2-s3)/1000);
				var day = parseInt(toendtime / (24*60*60));//计算整数天数
				var afterDay = toendtime - day*24*60*60;//取得算出天数后剩余的秒数
				var hour = parseInt(afterDay/(60*60));//计算整数小时数
				var afterHour = toendtime - day*24*60*60 - hour*60*60;//取得算出小时数后剩余的秒数
				var min = parseInt(afterHour/60);//计算整数分
				var afterMin = toendtime - day*24*60*60 - hour*60*60 - min*60;//取得算出分后剩余的秒数
				$scope.showtime=day+'天'+flashService.PrefixInteger(hour)+":"+flashService.PrefixInteger(min)+":"+flashService.PrefixInteger(parseInt(afterMin));
			  if (toendtime== -1) {
        $state.reload();
        $interval.cancel(timer);
      }

      },1000)
    }
      $scope.$on('$ionicView.beforeEnter', function() {
        $scope.nowLevelIndex = [-1, -1, -1, -1];
        $scope.init();
      //更新轮播
      $timeout(function(){
        $ionicSlideBoxDelegate.loop(true);
        $ionicSlideBoxDelegate.start();
        $ionicSlideBoxDelegate.update();
      },200);
  });
      $scope.$on('$ionicView.enter', function (e, v) {
        //$('.newHomeScroll .scroll').css('transform',$rootScope.scrollNum)
      })
		/*返回页面*/
		$scope.goBack = function(){
        $ionicScrollDelegate.scrollTop();
        $ionicHistory.goBack();
      };
	}]);
APP.service('newsendService', ['$http','UrlService',function($http,UrlService){
  this.getnewProd=function(provinceId,cityId,districtId,streetId,pageIndex){
  	var params={
  		'provinceId':provinceId,
      	'cityId':cityId,
      	'districtId':districtId,
      	'streetId':streetId,
  		'pageIndex':pageIndex
  	}
  	return $http.get(UrlService.getNewUrl('NEW_SEND'), params);
  }
  this.getpres=function(){
      //return $http.get(UrlService.getUrl('FLASH_TWO'));
      var params = {
      	'pageIndex':1,
      	'pageSize':3
      }
      return $http.get(UrlService.getNewUrl('NEW_RES'), params);
  }

  this.getcrowold = function (from) {

    var params = {
       from:from
    }
    //  return $http.get('http://mobiletest.ehaier.com:38080/activity/zhongchou/indexZActivitys?type='+params.type+'&page='+params.page+'')
    return $http.get(UrlService.getZCUrl('SUC_ZHONGCHOU'),params);
  }
  this.slidedata = function () {
    var params = {
      "type":1
    };
    return $http.get(UrlService.getNewUrl('NEW_SLIDE'), params);
  }
}])
