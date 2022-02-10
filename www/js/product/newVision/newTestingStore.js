
APP.controller('newTestingStoreController', ['$ionicPlatform','$ionicPopup','$ionicHistory','CLASSIFYMESSAGECRNTERService','UrlService','NewPersonService', 'trueAuthenticationService', '$localstorage', 'GoodsSearchService', 'RegisterService', '$ionicModal', 'ShopService', '$q', 'GoodsService', 'CalculateStrLength', '$interval', '$http', '$scope', '$stateParams', '$ionicSlideBoxDelegate',
  '$state', 'UserService', '$timeout', '$rootScope', '$ionicScrollDelegate', 'CommonAddressService', 'BannerThemeService', 'PopupService', 'newHomeMakeService', 'ProductDetailService','WhiteShowsService',"newTestingStoreService",
  function ($ionicPlatform,$ionicPopup,$ionicHistory,CLASSIFYMESSAGECRNTERService,UrlService,NewPersonService ,trueAuthenticationService, $localstorage, GoodsSearchService, RegisterService, $ionicModal, ShopService, $q, GoodsService, CalculateStrLength, $interval, $http, $scope, $stateParams, $ionicSlideBoxDelegate, $state, UserService, $timeout, $rootScope, $ionicScrollDelegate, CommonAddressService, BannerThemeService, PopupService, newHomeMakeService, ProductDetailService,WhiteShowsService,newTestingStoreService) {


    var isGoing = false;
    var locationFlag = true;
    $scope.flagNum = false;
    $scope.banner = [];
    $scope.types = [];
    $scope.nearByList = [];
    //地址选择框高度
    var screenHeight = window.innerHeight;
    var topHeight = 250 + 123;
    var contentHeight = screenHeight - topHeight + 'px';
    $scope.contentHeight = {
      'height': contentHeight
    }
    $scope.canShow = false;
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
    if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {
      $scope.isIosApp = true;
    } else {
      $scope.isIosApp = false;
    }
    $scope.locationImgUrl = $rootScope.imgBaseURL + "img/newvision/location.png";
    $scope.messageImgUrl = $rootScope.imgBaseURL + "img/newvision/xiaoxi.png";
    
   

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
      if($scope.defaultValue['text-1']&&$scope.defaultValue['text-2']&&$scope.defaultValue['text-3']&&$scope.defaultValue['text-4']){
      $scope.getarr = $scope.defaultValue['text-1']+$scope.defaultValue['text-2']+$scope.defaultValue['text-3']+$scope.defaultValue['text-4'];
      $scope.pid = $scope.defaultValue['value-1'];
      $scope.cid = $scope.defaultValue['value-2'];
      $scope.aid = $scope.defaultValue['value-3'];
      $scope.cityname = $scope.defaultValue['text-2'];
      }else{

      }
      if($scope.isOrder){
        $scope.predesgin()
      }
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
      if($scope.isOrder){
        confirmPopup.close();
      }
      
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
      
    $scope.init = function () {
      
       
      $scope.defaultValue = null;
      $scope.dataAdd = null;
      $scope.canShow = false;
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
      newHomeMakeService.getUnReadMsg()
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
      newHomeMakeService.isWdHost()
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
            var mapObj = new AMap.Map('');
          mapObj.plugin('AMap.Geolocation', function () {
            var geolocation = new AMap.Geolocation();
            geolocation.getCurrentPosition();
            AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
            AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
          });
  
          //高德地图回调函数--解析定位结果
          function onComplete(data) {
            $scope.lons = data.position.getLng();
            $scope.lat = data.position.getLat();
            AMap.plugin('AMap.Geocoder',function(){//回调函数
              geocoder = new AMap.Geocoder({
                city: "010"//城市，默认：“全国”
              });
              var lnglatXY=[$scope.lons, $scope.lat];
              geocoder.getAddress(lnglatXY, function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                     var position = result.regeocode.addressComponent;
                     GoodsService.getAddressId(position.province, position.city, position.district, position.township,position.adcode).
                    success(function(resp){
                      $scope.cityIds = resp.data.cityId;
                      newTestingStoreService.getRecently($scope.cityIds,1,$scope.lat,$scope.lons,1)
                      .success(function(res){
                        if(res.success){
                          if(res.data){
                            $scope.isAdress=true;
                            $scope.recently=res.data;
                          }
                        }
                      })
                      newTestingStoreService.getNearbyList($scope.cityIds,1,$scope.lat,$scope.lons,$scope.pageIndex,6,1).success(function(res){
                        $scope.canShow = true;
                          if(res.data){
                            if (res.data.length == 0){
                              $scope.hasmore = false;
                              $scope.nearByList = $scope.nearByList.concat(res.data);
                             
                            }else{
                              $scope.hasmore = true;
                              $scope.nearByList = $scope.nearByList.concat(res.data);
                            
                            }
                            
                          }
                      });
                    })
                }else{
                  
                }
              });
            });
            
          }
      
  
          function onError(data) {
            $scope.lons = 120.45709;
            $scope.lat = 36.108883;
            $scope.cityIds = 173;//青岛
            newTestingStoreService.getRecently($scope.cityIds,1,$scope.lat,$scope.lons,1)
            .success(function(res){
              if(res.success){
                if(res.data){
                  $scope.isAdress=true;
                  $scope.recently=res.data;
                }
              }
            })
            newTestingStoreService.getNearbyList($scope.cityIds,1,$scope.lat,$scope.lons,$scope.pageIndex,6,1).success(function(res){
                $scope.canShow = true;
                if(res.data){
                  if (res.data.length == 0){
                    $scope.hasmore = false;
                    $scope.nearByList = $scope.nearByList.concat(res.data);
         
                  }else{
                    $scope.hasmore = true;
                   $scope.nearByList = $scope.nearByList.concat(res.data);
                  }
                  //$scope.$broadcast('scroll.infiniteScrollComplete');
                }
            });
          }
        })

        newTestingStoreService.getbanner().success(function(res){
            $scope.banner=res.data;
            $ionicSlideBoxDelegate.update();
            $ionicSlideBoxDelegate.$getByHandle("test_slide_box").loop(true);
        });
        newTestingStoreService.getNearbyType().success(function(res){
          console.log(res);
            $scope.types = res.data;
        });
        $scope.lons = 120.45709;
            $scope.lat = 36.108883;
            $scope.cityIds = 173;//青岛
  // var mapObj = new AMap.Map('');
  //         mapObj.plugin('AMap.Geolocation', function () {
  //           var geolocation = new AMap.Geolocation();
  //           geolocation.getCurrentPosition();
  //           AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
  //           AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
  //         });
  
  //         //高德地图回调函数--解析定位结果
  //         function onComplete(data) {
  //           $scope.lons = data.position.getLng();
  //           $scope.lat = data.position.getLat();
  //           AMap.plugin('AMap.Geocoder',function(){//回调函数
  //             geocoder = new AMap.Geocoder({
  //               city: "010"//城市，默认：“全国”
  //             });
  //             var lnglatXY=[$scope.lons, $scope.lat];
  //             geocoder.getAddress(lnglatXY, function(status, result) {
  //               if (status === 'complete' && result.info === 'OK') {
  //                    var position = result.regeocode.addressComponent;
  //                    GoodsService.getAddressId(position.province, position.city, position.district, position.township,position.adcode).
  //                   success(function(resp){
  //                     $scope.cityIds = resp.data.cityId;
  //                     newTestingStoreService.getRecently($scope.cityIds,1,$scope.lat,$scope.lons,1)
  //                     .success(function(res){
  //                       if(res.success){
  //                         if(res.data){
  //                           $scope.isAdress=true;
  //                           $scope.recently=res.data;
  //                         }
  //                       }
  //                     })
  //                     newTestingStoreService.getNearbyList($scope.cityIds,1,$scope.lat,$scope.lons,$scope.pageIndex,6,1).success(function(res){
  //                       $scope.canShow = true;
  //                         if(res.data){
  //                           if (res.data.length == 0){
  //                             $scope.hasmore = false;
  //                             $scope.nearByList = $scope.nearByList.concat(res.data);
                             
  //                           }else{
  //                             $scope.hasmore = true;
  //                             $scope.nearByList = $scope.nearByList.concat(res.data);
                            
  //                           }
                            
  //                         }
  //                     });
  //                   })
  //               }else{
                  
  //               }
  //             });
  //           });
            
  //         }
      
  
  //         function onError(data) {
  //           $scope.lons = 120.45709;
  //           $scope.lat = 36.108883;
  //           $scope.cityIds = 173;//青岛
  //           newTestingStoreService.getRecently($scope.cityIds,1,$scope.lat,$scope.lons,1)
  //           .success(function(res){
  //             if(res.success){
  //               if(res.data){
  //                 $scope.isAdress=true;
  //                 $scope.recently=res.data;
  //               }
  //             }
  //           })
  //           newTestingStoreService.getNearbyList($scope.cityIds,1,$scope.lat,$scope.lons,$scope.pageIndex,6,1).success(function(res){
  //               $scope.canShow = true;
  //               if(res.data){
  //                 if (res.data.length == 0){
  //                   $scope.hasmore = false;
  //                   $scope.nearByList = $scope.nearByList.concat(res.data);
         
  //                 }else{
  //                   $scope.hasmore = true;
  //                  $scope.nearByList = $scope.nearByList.concat(res.data);
  //                 }
  //                 //$scope.$broadcast('scroll.infiniteScrollComplete');
  //               }
  //           });
  //         }
    }

 $scope.loadmore = function(){
            $scope.pageIndex++;
            newTestingStoreService.getNearbyList($scope.cityIds,1,$scope.lat,$scope.lons,$scope.pageIndex,6,1).success(function(res){
                console.log(res);
                if(res.data){
                  if (res.data.length == 0){
                    $scope.hasmore = false;
                    $scope.nearByList = $scope.nearByList.concat(res.data);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                  }else{
                    $scope.hasmore = true;
                    $scope.nearByList = $scope.nearByList.concat(res.data);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                  }
                  
                }
            });    
        }
    function getAddress() {
      addressMessage = CommonAddressService.getAddressInfo();
      $scope.getarr = addressMessage.provinceName+addressMessage.cityName+addressMessage.regionName+addressMessage.streetName;
      $scope.pid = addressMessage.provinceId;
      $scope.cid = addressMessage.cityId;
      $scope.aid = addressMessage.areaId;
      $scope.cityname = addressMessage.cityName;
      var deferred = $q.defer();
      GoodsService.getAddress()
        .success(function (res) {
          if (res.data == null) {
            var addressMessage = CommonAddressService.getAddressInfo();
            if (addressMessage) {
              // console.log(addressMessage)
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
            // console.log(res.data)
            var obj = eval(res.data);
            console.log(obj)
            var regionIndex = obj[0].regionName.indexOf('/');
            $scope.region = obj[0].regionName.substr(0, regionIndex);
            
            deferred.resolve(obj[0]);
          }
        })
      return deferred.promise;
    }
   
    $scope.bannerClick = function (linkType, link, relationId) {
      var tempArr = link.split('&');
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





    $scope.$on('$ionicView.beforeLeave', function (e, v) {
      $scope.watch();
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
    
    var nomess;
    $scope.$on('$ionicView.beforeEnter', function (e, v) {
      $scope.hasmore=true;
      $scope.pageIndex = 1;
      $scope.nearByList = [];
      $scope.bottomIF=false;
       //更新轮播
      $timeout(function(){
        $ionicSlideBoxDelegate.loop(true);
        $ionicSlideBoxDelegate.start();
        $ionicSlideBoxDelegate.update();
      },200);
       
      if (v.direction == 'back') {
        

          $scope.init();
    
      } else {
        GetSwitchChecked(); //获取是否显示佣金 本地存储值
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

        $scope.init();
      }
    });
    $scope.$on('$ionicView.enter', function (e, v) {
        //$('.newHomeScroll .scroll').css('transform',$rootScope.scrollNum)
      })
  }
]);


APP.service('newTestingStoreService', ['$http', 'UrlService', function ($http, UrlService) {
   this.getbanner = function () {
    return $http.get(UrlService.getNewUrl('NEW_HOME_BANNER'),{itemsId:7});
  };
  this.getNearbyType = function () {
    return $http.get(UrlService.getNewUrl('NEARBY_TYPES'));
  }
  this.getRecently=function(cityId,itemsId,latitude,longitude,type){
  var param={
    cityId:cityId,
    itemsId:itemsId,
    latitude:latitude,
    longitude:longitude,
    type:type
  }
  return $http.get(UrlService.getNewUrl('RECENTLY_WORK'),param);
}
this.getNearbyList = function(cityId,itemsId,latitude,longitude,pageIndex,pageSize,type){
  var param={
    cityId:cityId,
    itemsId:itemsId,
    latitude:latitude,
    longitude:longitude,
    pageIndex:pageIndex,
    pageSize:pageSize,
    type:type
  }
  return $http.get(UrlService.getNewUrl('NEARBY_LIST'),param);
}
}]);
