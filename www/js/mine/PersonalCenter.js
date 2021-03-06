/**
 * creater:刘成杰
 * create time:2017/7/13
 * describe：个人中心
 **/
APP.controller('PersonalCenterController', ['trueAuthenticationService','$localstorage', '$rootScope', 'RegisterService', 'HomePageService', 'OrderManageService', '$http', 'UrlService', 'InAppBrowserService', 'CreditService', 'ShopService', '$scope', '$timeout', 'UserService', 'PersonalCenterService', '$state','WhiteShowsService','PopupService', 'ProductDetailService','GoodsService',
  function (trueAuthenticationService,$localstorage, $rootScope, RegisterService, HomePageService, OrderManageService, $http, UrlService, InAppBrowserService, CreditService, ShopService, $scope, $timeout, UserService, PersonalCenterService, $state,WhiteShowsService,PopupService,ProductDetailService,GoodsService) {
    /** 变量声明 **/
    $scope.storeId = UserService.getUser().mid;
    $scope.flagNum = false;
    $scope.user = UserService.getUser();
    if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {
      $scope.isIosApp = true;
    } else {
      $scope.isIosApp = false;
    }
    $scope.levelArr = ['士兵', '班长', '排长', '连长', '营长', '团长', '旅长', '师长', '军长', '司令', '盟主'];
    $scope.gotoSecondPage = function (orderFlag, orderType) {
      $state.go('orderManage', {
        orderFlag: orderFlag,
        orderType:orderType
      });
    }
    $scope.goOrderManage = function (orderFlag, orderStatus) {
      $state.go('orderManage', {
        orderFlag: orderFlag,
        orderStatus: orderStatus
      });
    }
    $scope.goMemberCenter = function () {
      CreditService.getGameId(function (gameId) {
        $state.go('vip', {
          gameId: gameId
        });
      });
    }
    $scope.goGoldGame = function () {
      CreditService.getGameId(function (gameId) {
        $state.go('goldgame', {
          gameId: gameId
        });
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
    $scope.goToMyStore = function () {
      if ($scope.isHost == 1) { //如果是微店主
        $state.go("myStore", {
          storeId: $scope.storeId
        });
      }
    }

    //社群争霸赛
    $scope.goToRace = function () {
      window.location.href = UrlService.getThirdUrl('race/');
    }
    //海尔大学免登
    $scope.goLearningHaier = function(){
      PersonalCenterService.learningHaier().success(function(res){
        if(res.data != -100){
          /******注意要转码********/
          var url = encodeURI(res.data);
          if (window.cordova) {
            /**
             * H5跳转原生webView页面
             * @param resultUrl {String} 链接url
             * @param title {String} 标题
             *
             */
            window.emc.presentH5View(url, "海尔大学");
          } else {
            window.location.href = url ;
          }
        }else{
          $state.go('login');
        }
      })
    };

    $scope.goToManageMoney = function (isWdHost) {
      // if (isWdHost == 1) { //开过店 1(记得改回来)
        $state.go('financialMoney',{whereId:'personnalCenter'});
      // } else if (isWdHost == 0) { //普通用户 没开过店 0（记得改回来）
      //   RegisterService.wdApply().success(function (response) {
      //     if (response.success) {
      //       if (response.data) { //绑定过手机
      //         $state.go('newAuthenticationHome'); //去完善信息页面
      //       } else { //没绑定过手机
      //         $state.go('registerForStore', {
      //           hasHistory: 1
      //         }); //去绑定手机号  hasHistory
      //       }
      //     } else { //接口异常
      //       PopupService.showToast('服务端错误');
      //     }
      //   }).error(function () {
      //     alert('网络错误');
      //   });
      // } else {
      //   $state.go('login');
      // }
    }
    $scope.toApplyForWhite = function () {
      console.log({
          userId:UserService.getUser().ucId,
          token:UserService.getUser().accessToken
      });
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
                })
            }
          }
      })
    }
    /* 客服--调插件*/
    $scope.customerServe = function () {

      if (window.cordova) {
        var isAndroid = ionic.Platform.isAndroid();
        var iabRef = null;
        if (isAndroid) {
          iabRef = cordova.InAppBrowser.open('http://m.ehaier.com/v2/h5/sg/common/customService.html', '_blank', 'location=no');
        } else {
          iabRef = cordova.InAppBrowser.open('http://m.ehaier.com/v2/h5/sg/common/customService.html', '_blank', 'location=no,toolbar=no');
        }
        iabRef.addEventListener('loadstop', function (event) {
          if (event.url.indexOf('downt.ntalker') > -1) {
            $timeout(function () {
              var d = "var r= document.getElementsByTagName('div');" +
                "var newDiv  = document.createElement('span');" +
                "newDiv.style.width = '35px';" +
                "newDiv.style.height = '35px';" +
                "newDiv.style.background = 'transparent';" +
                "newDiv.style.zIndex = '999';" +
                "r[0].appendChild(newDiv);" +
                "newDiv.style.position = 'absolute';" +
                "newDiv.style.top = '10px';" +
                "newDiv.style.left = '12px';" +
                "newDiv.style.borderRadius = '17.5px';" +
                "newDiv.onclick = function(){window.location.href = window.location.href+'&close=true';};";
              iabRef.executeScript({
                code: d
              }, function () {});
            }, 1000);

          }
        });

        iabRef.addEventListener('loadstart', function (event) {
          if (event.url.indexOf('close=true') > -1) {
            iabRef.close();
          }
        });

      } else {
        $scope.kfTocken = $localstorage.get('sg_login_token_secret').substring(6);
      //  window.open('http://mobiletest.ehaier.com:38080/v3/h5/sg/common/customService.html?flag='+$scope.kfTocken);
        window.open('http://m.ehaier.com/v3/h5/sg/common/customService.html?flag='+$scope.kfTocken);
      }

      return;
      var u = navigator.userAgent;
      if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
        window.open = cordova.InAppBrowser.open('http://m.ehaier.com/v2/h5/sg/common/customService.html', '_blank', 'location=no');
      } else if (u.indexOf('iPhone') > -1) {
        window.open = cordova.InAppBrowser.open('http://m.ehaier.com/v2/h5/sg/common/customService.html', '_blank', 'location=no');
      } else {
        window.open = cordova.InAppBrowser.open('http://m.ehaier.com/v2/h5/sg/common/customService.html', 'location=yes');
      }
    };
    $scope.goNewHand = function() {
      var link = UrlService.getHead() + 'mstore/sg/helpDetail.html?id=613';
      if (window.emc) {
        window.emc.presentH5View(link, '新手必读');
      } else {
        window.location.href = link;
      }
    };
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
              }, 200);
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
                template: '<div style="background:#fff;border-radius:4px;"><img src="img/ic_refresh_01.gif" style="width: 65px;"/></div>'
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
              }, 200);
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
                template: '<div style="background:#fff;border-radius:4px;"><img src="img/ic_refresh_01.gif" style="width: 65px;"/></div>'
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
    $scope.checkPhoneNumber = function () {
      RegisterService.wdApply().success(function (response) {
        if (response.success) {
          if (response.data) { //绑定过手机
            console.log('有手机号')
            $state.go('newAuthenticationHome'); //去完善信息页面
          } else { //没绑定过手机
            console.log('没有手机号')
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
    }
    $scope.init = function () {
      // 实名认证
      trueAuthenticationService.doInit()
        .success(function (response) {
          console.log(response)
          if (response.success) {
            if (response.data.isAuthByOne) { // 实名认证过
              //'实名认证过了'
              $scope.changeOpacity = {
                "opacity": "1"
              };
            } else { //未认证
              $scope.changeOpacity = {
                "opacity": "0.5"
              };
            }
          } else {
            console.log('请求实名认证接口出错')
          }
        });
        ProductDetailService.getCartNum().success(function(res){
        if(res.success){
          $rootScope.BottomCartNum = res.data;
        };
      });
      HomePageService.isWdHost()
        .success(function (res) {
          console.log(res);
          $rootScope.isWdHost = res.data.isHost;
         // $rootScope.iso2o= res.data.o2o;
          if(res.data.o2o == null || res.data.o2o == true){
            $scope.iso2o = true;
          }else{
            $scope.iso2o = false;
          }

        })
      //未读消息数量
      HomePageService.getUnReadMsg()
        .success(function (res) {
          if (res.data > 0) {
            $scope.flagNum = true;
          } else {
            $scope.flagNum = false;
          }
        })
      PersonalCenterService.personalInit()
        .success(function (res) {
          console.log(res);
          $scope.isHost = res.data.isHost; //是否是微店主 0：否，1：是，-1未登录
          $scope.storeName = res.data.storeName; //微店主店铺名称（未登录时返回名称为未登录)
          $scope.card = res.data.card; //银行卡和快捷通的绑定数量
          $scope.level = res.data.level; //等级 int
          $scope.nowLevelName = $scope.levelArr[$scope.level - 1]; //当前等级名字
          if ($scope.level != 11) {
            $scope.nextLevelName = $scope.levelArr[$scope.level]; //下一个等级名字
          }
          $scope.revenue = res.data.revenue; //营收金额
          $scope.coupon = res.data.coupon; //优惠券数量
          $scope.gold = res.data.gold; //金币
          $scope.card = res.data.card; //银行卡

        });
        PersonalCenterService.diamondInit()
        .success(function (res) {
          console.log(res);
          $scope.babyCoupon = res.data.c; //优惠券数量
          $scope.babyGold = res.data.g; //金币
          var numDiamond = res.data.d;
          if(parseInt(numDiamond) > 9999) {
            $scope.babyDiamond = '9999+'; //金币
          } else {
            $scope.babyDiamond = numDiamond; //金币
          }
        });
      OrderManageService.getOrderAmount()
        .success(function (response) {
          if (response.success) {
            $scope.orderAmountData = response.data;
          }
        });
      CreditService.getGameId(function (gameId) {
        var shunguangVipUrl = UrlService.getUrl('SHUNGUANG_VIP');
        var shunguangParam = {
          gameId: gameId,
          withLevelPath: true
        };
        $http.get(shunguangVipUrl, shunguangParam)
          .success(function (response) {
            if (response.success) {
              console.log(response);
              $scope.order = response.data.userCreditWithLevel.order;
              $scope.levelGrowArr = response.data.levels;
              //还有多少成长值升级
              var nextLevelExp = $scope.levelGrowArr[response.data.userCreditWithLevel.order];
              //盟主没有下一级
              if (nextLevelExp) {
                $scope.levelUpExp = $scope.levelGrowArr[response.data.userCreditWithLevel.order].creditNum - response.data.userCreditWithLevel.totalCreditNum;
                if ($scope.levelUpExp < 0) {
                  $scope.levelUpExp = 0;
                }
              }
              $scope.totalCreditNum = response.data.userCreditWithLevel.consumeCreditNum;
              $scope.creditNum = response.data.userCreditWithLevel.totalCreditNum;
            }
          });
      });
      PersonalCenterService.personalApply().success(function(response) {
        if (response.success) {
          if (response.data.isVacancy) {
            response.data.status = response.data.levelDownMonth == response.data.applyMonth ? -3 : 2;
          } else if (response.data.status == undefined) {
            response.data.status = -2;
          }
          //可以申请的 级别before
          $scope.applyName = response.data.name;
          $scope.applyStatus = response.data.status;
        }
      });
      //获取memberId @ zyr/start
      ShopService.getMessage()
        .success(function (response) {
          if (response.success) {
            PersonalCenterService.userMemberId = response.data.memberId;
          }
      })
    };
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.avatarImage = UserService.getUser().avatarImageFileId; //头像地址
      $scope.storeId = UserService.getUser().mid;
      $scope.user = UserService.getUser();
      $scope.tabNav = 'personnalCenter';
      $scope.init();
    })
  }
]);
/**
 * creator:刘成杰
 * create time:2017/7/13
 * describe：个人中心服务
 **/
APP.service('PersonalCenterService', ['$http', 'UrlService', function ($http, UrlService) {
  //个人中心
  this.personalInit = function () {
    return $http.get(UrlService.getNewUrl('PERSONAL_CENTER'));
  };

  this.diamondInit = function () {
    return $http.get(UrlService.getNewUrl('GET_NEW_DIAMOND'));
  };

  this.personalApply = function (param) {
    var url = UrlService.getUrl('GET_APPLY_MENGZHU');
    return $http.get(url, param);
  };
  //存储 memberId
  this.userMemberId = '';
  //海尔大学免登
  this.learningHaier = function(){
    return $http.get(UrlService.getNewUrl('GET_learningHaier'));
  }
}]);
