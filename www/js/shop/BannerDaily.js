/**
 * creator:feng.jiang@dhc.com.cn
 * create time:2016/8/9
 * describe：BannerDailyController 轮播图日常活动控制器
 **/
APP.controller('BannerDailyController', ['$scope', 'BannerDailyService', '$stateParams', '$rootScope', '$http',
  '$state', 'UserService', 'CommonAddressService', 'GoodsService', '$ionicHistory', 'PopupService', 'UrlService',
  '$localstorage', '$ionicLoading', 'BannerThemeService','CreditService','$ionicScrollDelegate', '$ionicModal','$timeout',
  function ($scope, BannerDailyService, $stateParams, $rootScope, $http, $state, UserService, CommonAddressService,
            GoodsService, $ionicHistory, PopupService, UrlService, $localstorage, $ionicLoading, BannerThemeService,CreditService,
            $ionicScrollDelegate,$ionicModal,$timeout) {

    /**变量声明**/
    $scope.shareStoreId = $stateParams.shareStoreId;
    var bannerId = $stateParams.bannerId;
    var platformType = $stateParams.platformType;
    var memberId = $scope.shareStoreId||UserService.getUser().mid;
    var provinceId = '', cityId = '', areaId = '', streetId = '';
    $scope.storeId = '';
    $scope.layout = $stateParams.layout;
    $scope.layout = 'layout-colum2';  //商品排列方式
    $scope.activityProductList = [];//活动商品列表
    $scope.districtName = '';//地址区名
    var sharePic = 'http://www.ehaier.com/mstatic/wd/v2/img/sg.png';
    var shareInfo = {};//分享内容

    //地址选择框高度
    var screenHeight=window.innerHeight;
    var topHeight=250+123;
    var contentHeight=screenHeight-topHeight+'px';
    $scope.contentHeight = {
      'height':contentHeight
    }
    /** 地址变量声明 **/
    $scope.addressTitle = '选择地区';
    $scope.dataAdd = null;
    $scope.flag = 'DAILY_LOCATION';
    $scope.defaultValue = null;
    $scope.level = 0;
    var addressMessage = {};//自动定位地址信息
    var areaValue;
    var areaValueCity;

    /*********************分享标签－whiteBird start*********************/
    $scope.showShare = false;
    /*********************分享标签－whiteBird end*********************/

    //IOS特殊样式
    $scope.dayliTitleStyle = {};
    if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {//只有ios app 特有的样式
      $scope.dayliTitleStyle = {
        top: '18px'
      }
    }

    if ($rootScope.isApp) {
      $scope.BannerTopopType = {
        // "right": "40px"
        "right": "50px"
      };
    }
    else {
      $scope.BannerTopopType = {
        "right": "10px"
      };
    }

    //获取日常活动商品数组
    function getBannerDailyProducts(memberId, provinceId, cityId, districtId, streetId, districtName, bannerId, platformType) {
      BannerDailyService.getBannerDaily(memberId, provinceId, cityId, districtId, streetId, districtName, bannerId ,platformType)
        .success(function (response) {
          $scope.activityProductList = [];
          $scope.activityProductList = response.productsList;
          $ionicLoading.hide();
        })
    }

    //获取分享内容
    function getShareInfo(bannerId,platformType) {
      BannerThemeService.getBannerTheme(bannerId,platformType)
        .success(function (response) {
          shareInfo = response.data;
        })
    }

    $scope.init = function () {
      /*********************分享标签－whiteBird start*********************/
      $scope.showQQ = false;
      $scope.showWeChat = false;

      /*********************分享标签－whiteBird end*********************/
      bannerId = $stateParams.bannerId;
      platformType = $stateParams.platformType;
      memberId = $scope.shareStoreId||UserService.getUser().mid;
      GoodsService.getAddress().success(function (response) {
        if (response.data != undefined && response.data && response.data.length != 0) {
          var addressInfo = eval(response.data);
          var regionIndex = addressInfo[0].regionName.indexOf('/');
          $scope.districtName = addressInfo[0].regionName.substr(0, regionIndex);
          getBannerDailyProducts(memberId, addressInfo[0].provinceId, addressInfo[0].cityId, addressInfo[0].areaId, addressInfo[0].streetId, addressInfo.regionName, bannerId, platformType);
        } else {
          var defaultAddressInfo = CommonAddressService.getAddressInfo();
          $scope.districtName = defaultAddressInfo.regionName;
          getBannerDailyProducts(memberId, defaultAddressInfo.provinceId, defaultAddressInfo.cityId, defaultAddressInfo.areaId, defaultAddressInfo.streetId, defaultAddressInfo.regionName, bannerId, platformType);
        }
      }).error(function (err) {
        var addressInfo = CommonAddressService.getAddressInfo();
        $scope.districtName = addressInfo.regionName;
        getBannerDailyProducts(memberId, addressInfo.provinceId, addressInfo.cityId, addressInfo.areaId, addressInfo.streetId, addressInfo.regionName, bannerId, platformType);
      });
      getShareInfo(bannerId,platformType);
    };

    //修改地址广播回调
    $rootScope.$on('DAILY_LOCATION', function (event, data) {
      $scope.districtName = data['text-3'];
      $scope.streetName = data['text-4'];
      var detailAddress = $scope.districtName + '/' + $scope.streetName;
      provinceId = data['value-1'];
      cityId = data['value-2'];
      areaId = data['value-3'];
      streetId = data['value-4'];
      GoodsService.addAddress(provinceId, cityId, areaId, detailAddress, streetId)
        .success(function (response, status, headers, config) {
          if (response.success) {
            getBannerDailyProducts(memberId, provinceId, cityId, areaId, streetId, $scope.districtName, bannerId);
          }
        });
    });

    $scope.goBack = function () {
      $ionicHistory.goBack();
    };

    $rootScope.$on('CACHE_SUCCESS', function (event, data) {
      $ionicLoading.show({template: '定位地址切换中···'});
      $scope.storeId = $stateParams.shareStoreId ? $stateParams.shareStoreId : $localstorage.get('storeId', $rootScope.globalConstant.storeId);
      $scope.shareStoreId = $stateParams.shareStoreId;
      memberId = $scope.shareStoreId||UserService.getUser().mid;;
      bannerId = $stateParams.bannerId;
      $scope.layout = $stateParams.layout;
      $scope.init();
    });

     $scope.$on('$ionicView.beforeLeave', function (e, v) {
        $scope.watch();
     })

    $scope.$on('$ionicView.beforeEnter', function (e, v) {
       $scope.dataAdd = null;
       $scope.defaultValue = null;
      $scope.goBackFlag=true;
       $scope.nowLevel=0;
       $scope.nowLevelIndex=[-1,-1,-1,-1];
       $scope.provinceTop=0;
       $scope.cityTop=0;
       $scope.areaTop=0;
       $scope.finish=false;
       $scope.watch=$scope.$watch('finish',function(newValue,oldValue){
        if(newValue){
          $ionicScrollDelegate.$getByHandle('mainScroll').scrollTo(0,$scope.provinceTop);
        }
       });
      $scope.storeId = $stateParams.shareStoreId ? $stateParams.shareStoreId : $localstorage.get('storeId', $rootScope.globalConstant.storeId);
      $scope.shareStoreId = $stateParams.shareStoreId;
      memberId = $scope.shareStoreId||UserService.getUser().mid;
      bannerId = $stateParams.bannerId;
      $scope.layout = $stateParams.layout;
      $scope.init();
      //地址
      $scope.addressInit($scope.dataAdd,$scope.defaultValue,'DAILY_LOCATION',0);
      $scope.$on('$destroy', function () {
        $scope.addressModal.remove();
      });
    });

    //地址窗口
    $scope.addressTop = function(){
      $scope.addressTipFlag=false;
      $scope.provinceTop=0;
      $scope.nowLevel=0;
      $scope.nowLevelIndex=[-1,-1,-1,-1];
      $scope.provinceDis=false;
      $scope.cityDis=false;
      $scope.areaDis=false;
      $scope.addressModal.show();
      $scope.dataAdd=null;
      $scope.defaultValue=null;
      $scope.selectProvince='';
      $scope.selectCity='';
      $scope.selectArea='';
      $scope.addressInit($scope.dataAdd,$scope.defaultValue,'COUPONSLIST',0);
    }
    //地址初始化
    $scope.addressInit = function (defaultValue,data,flag,level) {
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
        $scope.nowLevel=$scope.level;
        $scope.nowLevel=$scope.nowLevel*(-1);
           console.log($scope.nowLevelIndex);
           for(var i=0;i<$scope.nowLevelIndex.length;i++){
        if(i>$scope.nowLevel){
          $scope.nowLevelIndex[i]=-1;
        }
      }
      } else {
        $scope.finish=false;
        $scope.addressTip='正在获取地址信息...';
        $scope.addressTipFlag=true;
        $scope.dataAdd="";
        //第一次取全国的省直辖市信息
        GoodsService.getLocationList('',0).success(function (response) {
           $scope.dataAdd = response.data;
           $scope.addressTipFlag=false;
           $scope.finish=true;
           $scope.nowLevel=$scope.level;
           $scope.nowLevel=$scope.nowLevel*(-1);
           var defaultValueFy=JSON.stringify($scope.defaultValue);
           var dataAddFy=JSON.stringify($scope.dataAdd);
//         $scope.addressInit(defaultValueFy,dataAddFy,$scope.flag,$scope.level)
           console.log($scope.nowLevel);
	       for(var i=0;i<$scope.nowLevelIndex.length;i++){
	        if(i>$scope.nowLevel){
	          $scope.nowLevelIndex[i]=-1;
	        }
	       }
           console.log($scope.nowLevel);
         })
        .error(function (err) {
          PopupService.showToast('获取地址信息失败！');
        })
      }
    }
    //重新选择的下边框
    $scope.bottomBorder = {
      'border-bottom':"2px solid red"
    }
    $scope.provinceFlag=false;
    $scope.cityFlag=false;
    $scope.areaFlag=false;
    $scope.selectFlag=true;
    $scope.provinceDis=false;
    $scope.cityDis=false;
    $scope.areaDis=false;
    //返回重新选择省
    $scope.provinceSel = function(){
      $scope.addressInit(null,null,'COUPONSLIST',0);
      $scope.selectCity='';
      $scope.selectArea='';
      $scope.provinceFlag=true;
      $scope.selectFlag=false;
      $scope.provinceDis=true;
      $scope.cityDis=false;
      $scope.areaDis=false;
    }

    //地址
    var isGoing = false;
    $scope.goSelect = ionic.Utils.debounce(function (index,item) {
      for(var i=0;i<$scope.nowLevelIndex.length;i++){
      if(i>$scope.nowLevel){
        $scope.nowLevelIndex[i]=-1;
      }
      }
      $scope.dataAdd="";
      $scope.nowLevelIndex[$scope.nowLevel]=index;
      var item = arguments[1];
      var index = arguments[0];
      $scope.level = $scope.level - 1;//-1,下一个 为 －2 ，
      $scope.defaultValue['text' + $scope.level] = item.text;
      $scope.defaultValue['value' + $scope.level] = item.value;
      if ($scope.level > -2) {//xyz修改2级本地获取
        console.log($scope.level);
        if($scope.level == -1){//省
           $scope.selectProvince = item.text;
           $scope.provinceIndex=index;
           $scope.provinceFlag=false;
           $scope.selectFlag=true;
           $scope.provinceDis=true;
           $scope.provinceTop=$ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
           $scope.nowLevel=$scope.level;
           $scope.nowLevel=$scope.nowLevel*(-1);
           console.log($scope.nowLevel);
        }else{
//          $scope.dataAdd = $scope.dataAdd[index].children;
        }
        ah = $scope.level*-1;
        $scope.addressTip='正在获取地址信息...';
        $scope.addressTipFlag=true;
        GoodsService.getLocationList(item.value,ah).success(function (response) {
          if(ah==1){
            areaValueCity=item.value;
          }
          $scope.dataAdd = response.data;
          $scope.addressTipFlag=false;
          var defaultValueFy=JSON.stringify($scope.defaultValue);
          var dataAddFy=JSON.stringify($scope.dataAdd);
          $scope.addressInit(defaultValueFy,dataAddFy,$scope.flag,$scope.level);
        }).error(function (err) {
          PopupService.showToast('获取地址信息失败！');
        });
        $scope.levelArea=$scope.level;
        $scope.levelArea=$scope.levelArea+1;
        //重选市
        $scope.citySel = function(){
          $scope.addressTip='正在获取地址信息...';
          $scope.addressTipFlag=true;
          $scope.dataAdd="";
		      $scope.level= $scope.levelArea;
      	  GoodsService.getLocationList(areaValueCity,1).success(function (response) {
            $scope.dataAdd = response.data;
            $scope.addressTipFlag=false;
            var defaultValueFy=JSON.stringify($scope.defaultValue);
            var dataAddFy=JSON.stringify($scope.dataAdd);

            $scope.addressInit(defaultValueFy,dataAddFy,$scope.flag,-1);
              $scope.selectArea='';
              $scope.cityFlag=true;
              $scope.selectFlag=false;
              $scope.provinceDis=true;
              $scope.cityDis=true;
              $scope.areaDis=false;
              $ionicScrollDelegate.$getByHandle('mainScroll').scrollTo(0,$scope.cityTop);
          }).error(function (err) {
            PopupService.showToast('获取地址信息失败！');
          });
        }
      }else if ($scope.level > -4) {//xyz添加远端获取     市区
        if($scope.level == -3){ //区
          $scope.selectArea= item.text;
          $scope.cityFlag=false;
          $scope.areaFlag=false;
          $scope.selectFlag=true;
          $scope.provinceDis=true;
          $scope.cityDis=true;
          $scope.areaDis=true;
          $scope.areaTop=$ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
        }else{//市
          $scope.selectCity = $scope.defaultValue['text-2'];
        $scope.provinceFlag=false;
        $scope.cityFlag=false;
        $scope.selectFlag=true;
        $scope.provinceDis=true;
        $scope.cityDis=true;
        $scope.areaDis=false;
          $scope.cityTop=$ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
        }
        ah = $scope.level*-1;
        $scope.addressTip='正在获取地址信息...';
        $scope.addressTipFlag=true;
        GoodsService.getLocationList(item.value,ah).success(function (response) {
          $scope.dataAdd = response.data;
          $scope.addressTipFlag=false;
          if(ah==2){
          areaValue=item.value;
        }
          var defaultValueFy=JSON.stringify($scope.defaultValue);
          var dataAddFy=JSON.stringify($scope.dataAdd);
          $scope.addressInit(defaultValueFy,dataAddFy,$scope.flag,$scope.level);
        }).error(function (err) {
          PopupService.showToast('获取地址信息失败！');
        });
        $scope.levelArea=$scope.level;
        $scope.levelArea=$scope.levelArea+1;
        //重选区
         $scope.areaSel = function(){
            $scope.addressTip='正在获取地址信息...';
            $scope.addressTipFlag=true;
            $scope.dataAdd="";
            $scope.level=$scope.levelArea;
            GoodsService.getLocationList(areaValue,2).success(function (response) {
            $scope.dataAdd = response.data;
            $scope.addressTipFlag=false;
            var defaultValueFy=JSON.stringify($scope.defaultValue);
            var dataAddFy=JSON.stringify($scope.dataAdd);

            $scope.addressInit(defaultValueFy,dataAddFy,$scope.flag,$scope.level);
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollTo(0,$scope.areaTop);
            $scope.areaFlag=true;
            $scope.selectFlag=false;
            $scope.provinceDis=true;
            $scope.cityDis=true;
            $scope.areaDis=true;
          }).error(function (err) {
            PopupService.showToast('获取地址信息失败！');
          });
          }
    } else {
        if (isGoing) {
          return;
        }
        $timeout(function () {
          isGoing = false;
        }, 1500);
        $rootScope.$broadcast($scope.flag, $scope.defaultValue);
        isGoing = true;
//      $scope.$ionicGoBack($scope.level);
        $scope.closeAddressModal();
      }
    }, 300);

    //窗口modal
    $ionicModal.fromTemplateUrl('templates/common/CommonLocation.html', {
      scope: $scope,
      animation: 'slide-in-up',
    }).then(function(modal) {
      $scope.addressModal = modal;
    });
    $scope.closeAddressModal = function () {
      $scope.addressModal.hide();
    };
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
          // $scope.$ionicGoBack($scope.level - 1);
        })
        $scope.addressModal.hide();
    };

    //分享
    $scope.share = function () {

      /*********************分享标签－whiteBird start*********************/
      if(window.device && window.device.hasNewShare){
        if (!UserService.getUser().mid) {
          PopupService.showToast('请先登录,再分享');
          return;
        }
        //新分享样式
        $scope.showShare = !$scope.showShare;
        /*********************分享标签－whiteBird end*********************/
      }else{
        //旧分享样式
        if (!UserService.getUser().mid) {
          PopupService.showToast('请先登录,再分享');
          return;
        }
        if (window.umeng) {
          var url = UrlService.getShareLinkHeader() + 'bannerDaily/' + bannerId + '/' + $scope.layout + '/' + UserService.getUser().mid;
          window.umeng.share(shareInfo.title, shareInfo.content, shareInfo.imgUrl, url, 0);
        }
      }

    };

    /*********************分享标签－whiteBird start*********************/

      //复制
    $scope.copeText = function (text) {
      if(window.cordova)
      {
        cordova.plugins.clipboard.copy(text);
        PopupService.showToastShort('复制成功');
      }
      else
      {
        PopupService.showToast('请下载APP执行此操作');
      }
    };
    $scope.hideblackCover = function(){
      $scope.showShare = false;
    };
    $scope.shareToPlatform = function(index){

      var url = UrlService.getShareLinkHeader() + 'bannerDaily/' + bannerId + '/' + $scope.layout + '/' + UserService.getUser().mid;
      var title = shareInfo.title;
      var pic = shareInfo.imgUrl;
      var content = shareInfo.content;

      if (window.umeng) {
        if(index==0)
        {
          window.umeng.shareToSina(title, content, pic, url, 0, null, CreditService.shareSuccessCallback);
        }else if(index==1)
        {
          window.umeng.shareToWechatSession(title, content, pic, url, 0, null, CreditService.shareSuccessCallback);
        }else if(index==2)
        {
          window.umeng.shareToWechatTimeline(title, content, pic, url, 0, null, CreditService.shareSuccessCallback);
        }else if(index==3)
        {
          window.umeng.shareToQQ(title, content, pic, url, 0, null, CreditService.shareSuccessCallback);
          CreditService.qqShare();
        }else if(index==4)
        {
          window.umeng.shareToQzone(title, content, pic, url, 0, null, CreditService.shareSuccessCallback);
          CreditService.qqShare();
        }else if(index==5)
        {
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


APP.service('BannerDailyService', ['$http', 'UrlService', function ($http, UrlService) {
  this.getBannerDaily = function (memberId, provinceId, cityId, districtId, streetId, districtName, bannerId, platformType) {
    var params = {
      memberId: memberId,
      provinceId: provinceId,
      cityId: cityId,
      districtId: districtId,
      streetId: streetId,
      provinceName: undefined,
      cityName: undefined,
      districtName: districtName,
      bannerId: bannerId,
      platformType: platformType
    };
    return $http.get(UrlService.getUrl('GET_BANNER_DAILY'), params);
  };
}]);
