/**
 * creator:feng.jiang@dhc.com.cn
 * create time:2016/10/11
 * describe：TopicController 测试控制器
 **/

APP.controller('homeSameController', ['$localstorage','$scope','$rootScope','homeSameService', '$ionicHistory','$state',
    function ($localstorage,$scope,$rootScope,homeSameService,$ionicHistory,$state,TopicService) {
//        初始化数据
    $scope.locationImgUrl = "img/location@2x.png";
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
    $scope.$on('$ionicView.enter', function (e, v) {
        // ionic.on('scroll', $scope.onScroll, $scope.$$childHead.scrollCtrl.element)
 
     })
     $scope.chooseType = function (index, event) {
      if (index != -1) {
        console.log($('ion-nav-view ion-view'))
        $scope.ifIndex=index;
        $('ion-nav-view ion-view').attr('nav-view','cached')
        console.log(index)
        // console.log($("div.furnish_xScroll div:not(:last) a").css("color"));
        
        $("div.furnish_xScroll div a").css("color", "#000000");
        $("div.furnish_xScroll div:eq(" + index + ") a").css("color", "#2979FF");
        console.log($("div.furnish_xScroll div:eq(" + index + ") a").css("color"))
        // 
        $("div.furnish_xScroll div.runningBox").animate({
          width: event.target.offsetWidth + "px",
          left: event.target.offsetLeft,
          color: "#2979FF"
        }, {
          duration: 300,
          easing: 'easeOutCubic',
        });
      }
    }
    $scope.onScroll = function () {
        var scrollTop = $ionicScrollDelegate.getScrollPosition().top;
        var percent = Math.round(scrollTop / 204 * 100) / 100;
        $scope.$apply(function () {
          if (scrollTop < 10) {
            $scope.changeOpacity = {
              "background-image": "linear-gradient(180deg, rgba(0, 0, 0, 0.30), rgba(255,255,255,0.00))"
            }
            $scope.changeColor = {
              "color": "#ffffff"
            }
            $scope.searchBg = {
              "background": "#ffffff",
              "color": "#666666"
            }
            $scope.locationImgUrl = "img/location@2x.png";
            $scope.messageImgUrl = "img/messageLogo@2x.png";
          } else if (scrollTop < 100&&scrollTop>=10) {
            $scope.changeOpacity = {
              "background": "rgba(255,255,255," + percent + ")"
            }
            $scope.searchBg = {
              "background": "#ffffff",
              "color": "#666666"
            }
            $scope.changeColor = {
              "color": "#ffffff"
            }
            $scope.locationImgUrl = "img/location@2x.png";
            $scope.messageImgUrl = "img/messageLogo@2x.png";
          } else {
            $scope.locationImgUrl = "img/location_gray@2x.png";
            $scope.messageImgUrl = "img/message_gray@2x.png";
            $scope.changeColor = {
              "color": "#666666"
            }
            $scope.searchBg = {
              "background": "#e8e8e8",
              "color": "#ffffff"
            }
            $scope.changeOpacity = {
              "background": "rgba(255,255,255," + percent + ")"
            }
          }
  
        })
  
      }
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
    $scope.init=function(){
        
    };
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.home="homeSame-smartAppliance"
        $scope.init();
    });
     $scope.onTabSelected = function(){
         $rootScope.xiaoxis=false;
     }
}]);

APP.service('homeSameService', ['$http', 'UrlService', function ($http, UrlService) {
 //获取消息
    this.getxiaoxi = function () {
        return $http.get(UrlService.getUrl('UNRED_MESSAGE'));
    }
}]);
