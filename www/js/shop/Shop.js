/**
 * creator:feng.jiang@dhc.com.cn
 * create time:2016/3/14
 * describe：ShopController 小店控制器
 **/
APP.controller('ShopController', ['$ionicViewSwitcher','$scope', 'UserService', 'ShopService', '$ionicSlideBoxDelegate', '$ionicScrollDelegate',
  'MyStoreService', 'UrlService', '$ionicPopup', 'AccountMessageService', '$ionicLoading', '$timeout',
  'PopupService', 'MESSAGECENTERService', '$rootScope', '$state', 'BannerThemeService', '$localstorage', 'VersionService', 'InAppBrowserService', '$stateParams','$interval','$sce','CreditService','IMService','ManageMoneyService','LoginService','GetStatisticInfoService',

  function ($ionicViewSwitcher,$scope, UserService, ShopService, $ionicSlideBoxDelegate, $ionicScrollDelegate, MyStoreService, UrlService,
            $ionicPopup, AccountMessageService, $ionicLoading, $timeout, PopupService, MESSAGECENTERService, $rootScope,
            $state, BannerThemeService, $localstorage, VersionService, InAppBrowserService, $stateParams,$interval,$sce,CreditService,IMService,ManageMoneyService,LoginService,GetStatisticInfoService) {

    /** 变量声明 **/
    $scope.flagNum=false;
    $scope.tabNav = 'shop';
    $scope.storeInfo = {};//店铺信息
    $scope.avatarImage = '';//用户头像
    $scope.slideImage = [];  //轮播图
    $scope.shareInfo = {};   //分享内容
    $scope.user = UserService.getUser();
    $scope.storeId = '';//店铺ID
    $scope.btnList = [{
      url: 'shopRevenue',
      icon: $rootScope.imgBaseURL+'img/btn_shop_revenue.png',
      name: '营收'
    }, {
      url: 'getCouponsList',
      icon: $rootScope.imgBaseURL+'img/btn_shop_coupon.png',
      name: '优惠券'
    }, {
      url: 'manageMoney',
      icon: 'img/btn_shop_licai.png',
      name: '投资'
    }, {
      url: 'orderManage',
      icon: $rootScope.imgBaseURL+'img/btn_order_manager.png',
      name: '订单'
    }, {
      url: 'microSchool',
      // url: 'vip',
      icon: $rootScope.imgBaseURL+'img/btn_small_school.png',
      name: '微学堂'
    }, {
      url: 'teamSupervise',
      icon: $rootScope.imgBaseURL+'img/btn_two_management.png',
      name: '合伙人'
    }, {
      url: 'storeTeamOwner',
      icon: $rootScope.imgBaseURL+'img/btn_statistics.png',
      name: '统计'
    }, {
      // url: 'http://mobiletest.ehaier.com:38080/v3/mstore/sg/diy/login/request.html',
      // url: 'http://mdiy.haier.com/index/list',
      url:'vip',
      icon: $rootScope.imgBaseURL+'img/btn_storefront_renovation.png',
      name: '会员中心'
    }];//九宫格信息
    /*********************分享标签－whiteBird start*********************/
    $scope.showShare = false;
    /*********************分享标签－whiteBird end*********************/
    /** http请求参数 **/
    var memberId = '';
    var token = '';//第三方登录token

    //IOS特殊样式
    $scope.topBtnCss4IOS = {};
    if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {//只有ios app 特有的样式
      $scope.topBtnCss4IOS = {
        top: '12px'
      }
    }

    $scope.goMemberCenter = function(){
      CreditService.getGameId(function(gameId){
        $state.go('vip',{gameId:gameId});
      });
    };

    /** 方法 **/
    $scope.init = function () {
      ShopService.getStoreInfo()
          .success(function (response, status, headers, config) {
            console.log(response.data);
            $scope.storeInfo = response.data;
            $scope.storeId = $scope.storeInfo.ownerId;
            $localstorage.set('storeId',$scope.storeInfo.ownerId);//本地缓存storeId
          });
      // ShopService.getAppHomeData().
      //     success(function (response, status, headers, config) {
      //       $scope.slideImage = response.data.banner;
      //       $ionicSlideBoxDelegate.$getByHandle('shop_slider').update();
      //       $ionicSlideBoxDelegate.$getByHandle('shop_slider').loop(true);
      //     });
      ShopService.getLevelInfoBefore()
        .success(function(response){
          // $scope.levelId = response.data.levelId;
          // $scope.levelName = response.data.rank;
          $scope.slideImage = response.data.banner;
          $ionicSlideBoxDelegate.$getByHandle('shop_slider').update();
          $ionicSlideBoxDelegate.$getByHandle('shop_slider').loop(true);
        });
      ShopService.getLevelInfo(
        function(httpResult) {
          httpResult.success(
            function (response) {
              $scope.avatarImageFileId = response.data.avatarImageFileId;
              $scope.userCurrentLevelId = response.data.userCreditWithLevel.order;
              console.log(response);
              $scope.userName = response.data.userCreditWithLevel.name;
              console.log($scope.userName);
              $scope.storeCreditWithLevel = response.data.storeCreditWithLevel;
              if (response.data.storeCreditWithLevel) {
                $scope.levelArray = [];
                if (response.data.storeCreditWithLevel.order <= 3) {
                  $scope.imgCount = response.data.storeCreditWithLevel.order;
                  for (var i = 0; i < response.data.storeCreditWithLevel.order; i++) {
                    $scope.levelArray.push($rootScope.imgBaseURL+'img/Star-Grade@2x.png');
                  }
                } else {
                  for (var i = 0; i < response.data.storeCreditWithLevel.order - 3; i++) {
                    $scope.levelArray.push($rootScope.imgBaseURL+'img/Diamond-Grade@2x.png');
                  }
                }
              }
            }
          )
        },memberId
      );

       //未读消息数量和最新消息
      ShopService.getMessage()
        .success(function(response){
          console.log(response);
          $scope.msg = response.data.list[0].content;
          if(response.data.count>0){
            $scope.flagNum=true;
          }else{
            $scope.flagNum=false;
          }
        })
      //shop页发请求得到 未读消息
//    MESSAGECENTERService.unreadMessage();
//    console.log($rootScope.unreadMessage);

      VersionService.checkVersion();
    };

    //点击轮播图执行方法
    $scope.slideImageClick = function (index) {
      if ($scope.slideImage[index].type == '1') {
        if ($scope.slideImage[index].activityType == '主题活动') {
          $state.go('bannerTheme', {bannerId: $scope.slideImage[index].bannerId,platformType:$scope.slideImage[index].platformType});
        } else if ($scope.slideImage[index].activityType == '日常活动') {
          BannerThemeService.getBannerTheme($scope.slideImage[index].bannerId,$scope.slideImage[index].platformType)
            .success(function (response) {
              $state.go('bannerDaily', {bannerId: $scope.slideImage[index].bannerId, layout: response.data.layout,platformType:$scope.slideImage[index].platformType});
            });
        } else {
          console.log('进入活动页失败！');
        }
      }else if($scope.slideImage[index].type == '6'){//众筹的入口
        $state.go('crowdFunding');
      } else {
        console.log('type=0，不受控制的活动！');
      }
    };


    $scope.share = function () {

      /*********************分享标签－whiteBird start*********************/
      if (window.device && window.device.hasNewShare) {

        //新分享样式
        $scope.showShare = !$scope.showShare;
        /*********************分享标签－whiteBird end*********************/
      } else {

        //旧分享样式
        var title = $scope.storeInfo.storeName + '的顺逛小店'; //分享标题
        var content = '买家电，到顺逛。品质无忧，更享精致服务。货到付款，送装一体。多种品类，不同系列，爆款家电，明星机型，更多精彩尽在我的顺逛小店!';  //分享内容
        var pic = $scope.storeInfo.avatarImageFileId;//分享图片，写绝对路径
        var url = UrlService.getShareLinkHeader() + 'myStore/' + $scope.storeId + '/' + $scope.storeId + '/';//分享链接，绝对路径
        if (window.umeng) {
          window.umeng.share(title, content, pic, url, 0);
        } else {
          alert('只能在app分享,请下载app！');
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

      var title = $scope.storeInfo.storeName + '的顺逛小店'; //分享标题
      //var content = $scope.shareInfo.content;  //分享内容
      var content = '买家电，到顺逛。品质无忧，更享精致服务。货到付款，送装一体。多种品类，不同系列，爆款家电，明星机型，更多精彩尽在我的顺逛小店!';  //分享内容
      var pic = $scope.storeInfo.avatarImageFileId;//分享图片，写绝对路径
      var url = UrlService.getShareLinkHeader() + 'myStore/' + $scope.storeId + '/' + $scope.storeId + '/';//分享链接，绝对路径
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


      //修改头像
    $scope.changeIcon = function () {
      if (!!window.cordova) {
        var options = {
          title: '照片选取方式：',
          buttonLabels: ['拍照', '从相册选取'],
          addCancelButtonWithLabel: '取消',
          androidEnableCancelButton: true
        };
        var callback = function (buttonIndex) {
          if (buttonIndex == 1) {
            navigator.camera.getPicture(getSuccess, getFail, {
              quality: 100,
              destinationType: Camera.DestinationType.FILE_URI,
              allowEdit: true,
              targetWidth: 720,
              targetHeight: 720,
              saveToPhotoAlbum: true
            });
            function getSuccess(imageData) {
              $scope.avatarImage = imageData;
              $timeout(function () {
                  $scope.avatarImage = imageData;
                }, 200
              );
              //调用图片上传接口
              var win = function (r) {
                $ionicLoading.hide();
                PopupService.showToast('上传成功');
                var resp = JSON.parse(r.response);
                $scope.avatarImage = resp.data.avatarImageFileId;
                $scope.user.avatarImageFileId = $scope.avatarImage;
                UserService.setUser($scope.user);
              };
              var fail = function (error) {
                $ionicLoading.hide();
                PopupService.showToast('上传失败');
              };
              var options = new FileUploadOptions();
              options.fileKey = 'imageFile';
              options.fileName = $scope.avatarImage.substr($scope.avatarImage.lastIndexOf('/') + 1);
              options.mimeType = 'image/jpeg';
              var params = {};
              //params.userName = UserService.getUser().userName;
              options.params = params;
              var ft = new FileTransfer();
              ft.upload($scope.avatarImage, encodeURI(AccountMessageService.uploadImage()), win, fail, options);
              var par = {
                template: '<div style="background:#fff;border-radius:4px;"><img ng-src="{{imgBaseURL}}img/ic_refresh_01.gif" style="width: 65px;"/></div>'
              };
              $ionicLoading.show(par);
            }
            function getFail(message) {

            }
          } else if (buttonIndex == 2) {
            console.log('从相册中获取');
            navigator.camera.getPicture(getSuccessTwo, getFailTwo, {
              quality: 100,
              destinationType: Camera.DestinationType.FILE_URI,
              sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
              allowEdit: true,
              targetWidth: 720,
              targetHeight: 720
            });
            function getSuccessTwo(imageURI) {
              $scope.avatarImage = imageURI;
              $timeout(function () {
                  $scope.avatarImage = imageURI;
                }, 200
              );
              //调用图片上传接口
              var win = function (r) {
                PopupService.showToast('上传成功');
                $ionicLoading.hide();
                var resp = JSON.parse(r.response);
                $scope.avatarImage = resp.data.avatarImageFileId;
                $scope.user.avatarImageFileId = $scope.avatarImage;
                UserService.setUser($scope.user);
              };
              var fail = function (error) {
                PopupService.showToast('上传失败');
                $ionicLoading.hide();
              };
              var options = new FileUploadOptions();
              options.fileKey = 'imageFile';
              options.fileName = $scope.avatarImage.substr($scope.avatarImage.lastIndexOf('/') + 1);
              options.mimeType = 'image/jpeg';
              var params = {};
             // params.userName = UserService.getUser().userName;
              options.params = params;
              var ft = new FileTransfer();
              ft.upload($scope.avatarImage, encodeURI(AccountMessageService.uploadImage()), win, fail, options);
              var par = {
                template: '<div style="background:#fff;border-radius:4px;"><img ng-src="{{imgBaseURL}}img/ic_refresh_01.gif" style="width: 65px;"/></div>'
              };
              $ionicLoading.show(par);
            }

            function getFailTwo(message) {

            }
          }
        };
        window.plugins.actionsheet.show(options, callback);
        $timeout(function () {
          window.plugins.actionsheet.hide();
        }, 5000);
      } else {
        $ionicPopup.alert({
          template: '请下载客户端实现更换头像功能',
          okText: '知道了'
        });
      }
    };

    $scope.enter = function (url) {
      console.log(url);
      var index = url.indexOf('http');
      if (index != -1) {
        if (window.cordova) {
          if ($rootScope.isIOS) {//ios
            if (!window.device.hasNewBrowser) {//通过本地 ios 版本 决定是否 用新的 appbrowser 插件api 旧版本
              cordova.InAppBrowser.open(url, '_blank', 'location=yes');
            } else {
              var ref = null;
              ref = InAppBrowserService.open(url);
              ref.addEventListener('exit', function (event) {
                // $scope.init();
              });
            }
          } else {//android
            if (!window.device.hasNewBrowser) { //通过本地 android版本 决定是否 用新的 appbrowser 插件api
              cordova.InAppBrowser.open(url, '_blank', 'location=yes');
            } else {
              var ref = null;
              ref = InAppBrowserService.open(url);
              ref.addEventListener('exit', function (event) {
                // $scope.init();
              });

            }

          }

        }
        else {
          window.open(url, '_blank', 'location=yes');
        }
      } else {
        if(url.indexOf('vip')!=-1){
          $scope.goMemberCenter();
        }else{
          $state.go(url);
          $ionicViewSwitcher.nextDirection("forwoard");
        }

      }
    };
    $scope.goNewHand = function(){
      var u = navigator.userAgent;

      if (u.indexOf('iPhone') != -1) {
        var ref = InAppBrowserService.open(UrlService.getHead() + 'mstore/sg/helpDetail.html?id=613','新手必读');
        ref.addEventListener('exit', function (event) {
        });
      } else {
        $state.go('helpDetail', {'helpId': '613', 'content': '新手必读'});
      }
    };
    //设置金币雨下落、佣金、提现通知的标志
    $scope.setSwitchFun = function(memberId){
      var myId = memberId;
      if(localStorage.getItem('setSwitch')){
        var switchArr = JSON.parse(localStorage.getItem('setSwitch'));
        var isExist = false;
        for(var i = switchArr.length-1;i>=0;i--){
          if(switchArr[i].id == myId){
            $rootScope.isCommission = switchArr[i].list[0].checked;
            $rootScope.cashSwitch = switchArr[i].list[1].checked;
            $rootScope.goldRainSwitch = switchArr[i].list[2].checked;
            isExist = true;
            return;
          }
        }
        if(!isExist){
          $rootScope.isCommission = true;
          $rootScope.cashSwitch = true;
          $rootScope.goldRainSwitch = true;
          var nowMemberSwitch = {
            id:myId,
            list:[
              {
                name:'佣金',
                checked:true
              },
              {
                name:'提现通知',
                checked:true
              },
              {
                name:'金币雨',
                checked:true
              }
            ]
          }
          switchArr.push(nowMemberSwitch);
          localStorage.setItem('setSwitch',JSON.stringify(switchArr));
        }
      }else{
        var arr =[
              {
                id:myId,
                list:[
                  {
                    name:'佣金',
                    checked:true
                  },
                  {
                    name:'提现通知',
                    checked:true
                  },
                  {
                    name:'金币雨',
                    checked:true
                  }
                ]
              }
            ];
            localStorage.setItem('setSwitch',JSON.stringify(arr));
            $rootScope.isCommission = true;
            $rootScope.cashSwitch = true;
            $rootScope.goldRainSwitch = true;
      }
    }
    $scope.$on('$ionicView.beforeEnter', function (e,v) {
      $scope.isApp = window.cordova ? true : undefined;
      // $rootScope.$on('SHOP_NAME',function(event,value){
      //   console.log("修改以后的店铺名称是： "+value);
      // })
      //如果是返回回来的不采取操作，使用缓存
      // if(v.direction=='back'){
      //   return;
      // }
      token = $stateParams.token;
      if (token) {
        MyStoreService.login(token).success(function (res) {
          if (!res.success||res.data.mid==null) {
            $state.go('login');
            return;
          }
          UserService.setUser(res.data);
          $localstorage.set('sg_login_token_secret','Bearer'+res.data.sessionValue);//把token存到本地
          memberId = UserService.getUser().mid;
          LoginService.checkOpenStore(memberId).success(function(response){
              if(!response.data){
                $scope.isBuyer = '0';
                LoginService.setRole($scope.isBuyer);
                $localstorage.set('storeId', 20219251);
              }else{
                $scope.isBuyer = '1';
                LoginService.setRole($scope.isBuyer);
                $localstorage.set('storeId', memberId);
              }
            });
          $scope.avatarImage = UserService.getUser().avatarImageFileId;
          $ionicScrollDelegate.scrollTop();
          $scope.setSwitchFun(memberId);
          $scope.init();
        }).error(function () {
          $state.go('login');
        });
      } else {
        console.log(UserService.getUser());
        memberId = UserService.getUser().mid;
        $scope.avatarImage = UserService.getUser().avatarImageFileId;
        if (!UserService.getUser().mid) {
          $state.go('login');
          return;
        }
        $ionicScrollDelegate.scrollTop();
        $scope.setSwitchFun(memberId);
        $scope.init();
        console.log($rootScope.goldRainSwitch);
      }
    })
  }]);


/**
 * creator:feng.jiang@dhc.com.cn
 * create time:16/3/29
 * describe：小店首页服务
 **/
APP.service('ShopService', ['$http', 'UrlService','CreditService', function ($http, UrlService, CreditService) {
  this.getStoreInfo = function () {
    var params = {
      noLoading: true
    };
    return $http({
      method:'POST',
      url:UrlService.getUrl('GET_STORE_INFO'),
      params:params
    });
  };
  // this.getAppHomeData = function () {
  //   var params = {
  //     noLoading: true
  //   };
  //   return $http.get(UrlService.getUrl('APP_HOME_DATA'), params);
  // };
  this.getLevelInfo = function(callback,memberId){
    CreditService.getGameId(function(gameId) {
      callback($http.get(UrlService.getUrl("SHUNGUANG_VIP") + "?gameId=" + gameId+"&memberId="+memberId));
    });
  };
  this.getLevelInfoBefore = function(){
    return $http.get(UrlService.getUrl('MY_STORE'));
  };
  this.getMessage = function(){
      return $http.get(UrlService.getUrl('MESSAGECENTER_INIT'));
  }
  //消息中心
 //  this.getMseeageClassify = function(){
	// var params = {
 //      messageType: 0
 //    };
 //    return $http.get(UrlService.getUrl('MESSAGE_CLASSIFY'), params);
 //  }
}]);
