  APP.controller('MyStoreManageController', ['$scope', 'MyStoreManageService', '$stateParams', '$rootScope', '$ionicHistory', '$state',
      '$ionicSideMenuDelegate', 'UserService', '$ionicSlideBoxDelegate', '$ionicModal',
      'ChooseShopTemplateService', 'PopupService', 'GoodsService', 'CommonAddressService', '$timeout',
      '$ionicScrollDelegate', 'UrlService', 'BannerThemeService', 'SeckillService', 'countdownService', '$interval', '$ionicLoading', 'LoginService', 'CreditService', '$http', '$ionicScrollDelegate', 'MyStoreService',
      function($scope, MyStoreManageService, $stateParams, $rootScope, $ionicHistory, $state, $ionicSideMenuDelegate, UserService,
          $ionicSlideBoxDelegate, $ionicModal, ChooseShopTemplateService, PopupService, GoodsService, CommonAddressService, $timeout, $ionicScrollDelegate, UrlService, BannerThemeService, SeckillService, countdownService, $interval, $ionicLoading, LoginService, CreditService, $http, $ionicScrollDelegate, MyStoreService) {
          //判断是否是ios设备
          if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {
              $scope.isIosApp = true;
          } else {
              $scope.isIosApp = false;
          };
          $scope.levelArr = ['士兵', '班长', '排长', '连长', '营长', '团长', '旅长', '师长', '军长', '司令', '盟主'];
          $scope.levelStr = '';
          $scope.userName = ''; //用户信息

          //获取用户id
          $scope.storeId = window.localStorage.storeId;
          //获取用户基本信息
          $scope.USER_CACHE_KEY = JSON.parse(window.localStorage.USER_CACHE_KEY);

          //初始化刷新数据
          $scope.init = function() {
              $ionicScrollDelegate.scrollTop();
              //获取用户id
              $scope.storeId = window.localStorage.storeId;

              /*********************分享标签－whiteBird start*********************/
              $scope.showQQ = false;
              $scope.showWeChat = false;
              //获取基本信息
              MyStoreManageService.mstore().success(function(res) {
                  if (res.success) {
                      $scope.userName = res.data;
                      $scope.levelStr = $scope.levelArr[res.data.level]; //等级赋值
                      $scope.myStoreInfo = { 'storeName': $scope.userName.storeName, 'qrcode': $scope.userName.qrCode }; //我的店铺相关信息
                  }
              });

              MyStoreService.getMyStoreInfo('m', 'http://m.ehaier.com', 'http://www.ehaier.com/mstatic', 'http://m.ehaier.com/v2/mstore/sg/entrance.html', $scope.storeId)
                  .success(function(response) {
                      $scope.myStoreInfo = response.data;
                      $scope.shareInfo = response.data.share;
                      $scope.avatarImage = response.data.avatarImageFileId;
                  });

          };
          //页面初始化数据
          $scope.$on('$ionicView.beforeEnter', function() {
              $scope.init();
          });

          //分享
          $scope.showShare = false;
          $scope.myStoreInfo = ''; //我的店铺相关信息
          $scope.shareInfo = {}; //分享相关内容
          $scope.share = function() {
              /*********************分享标签－whiteBird start*********************/
              if (window.device && window.device.hasNewShare) {

                  //新分享样式
                  $scope.showShare = !$scope.showShare;
                  /*********************分享标签－whiteBird end*********************/
              } else {
                  //旧分享样式
                  var title = $scope.myStoreInfo.storeName; //分享标题
                  if ($scope.shareInfo.content.length == 0) {
                      $scope.shareInfo.content = title
                  }
                  //var content = $scope.shareInfo.content;  //分享内容
                  var content = '在顺逛上有一个挺不错的店铺，伙伴们快来看看，好东西不容错过~'; //分享内容
                  var pic = $scope.avatarImage; //分享图片，写绝对路径
                  var url = UrlService.getShareLinkHeader() + 'myStore/' + $scope.storeId + '/' + $scope.storeId + '/';
                  if (window.umeng) {
                      window.umeng.share(title, content, pic, url, 0);
                  } else {
                      alert('只能在app分享,请下载app！');
                  }
              }

          };

          /*********************分享标签－whiteBird start*********************/
          //复制
          $scope.copeText = function(text) {
              if (window.cordova) {
                  cordova.plugins.clipboard.copy(text);
                  PopupService.showToastShort('复制成功');
              } else {
                  PopupService.showToast('请下载APP执行此操作');
              }
          };
          $scope.hideblackCover = function() {
              $scope.showShare = false;
          };
          $scope.shareToPlatform = function(index) {

              //$scope.moreShow = false;
              var title = $scope.myStoreInfo.storeName; //分享标题
              if ($scope.shareInfo.content.length == 0) {
                  $scope.shareInfo.content = title
              }
              //var content = $scope.shareInfo.content;  //分享内容
              var content = '在顺逛上有一个挺不错的店铺，伙伴们快来看看，好东西不容错过~'; //分享内容
              var pic = $scope.avatarImage; //分享图片，写绝对路径
              var url = UrlService.getShareLinkHeader() + 'myStore/' + $scope.storeId + '/' + $scope.storeId + '/';

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
                  }
                  if (index == 5) {
                      $scope.copeText(url);
                  } else {
                      CreditService.successShare();
                  }
              } else {
                  alert('umeng undefined 只能在app分享');
              }

              $scope.showShare = false;
          };
          /*********************分享标签－whiteBird end*********************/
          //二维码展示modal


          $ionicModal.fromTemplateUrl('my-qrcode-modal.html', {
              scope: $scope,
              animation: 'slide-in-up',
              backdropClickToClose: true
          }).then(function(modal) {
              $scope.qrCodemodal = modal;
          });
          //筛选modal
          $ionicModal.fromTemplateUrl('templates/shop/FilterShop.html', {
              scope: $scope,
              animation: 'slide-in-left',
              backdropClickToClose: false
          }).then(function(modal) {
              $scope.filterModal = modal;
          });

          //店铺二维码
          $scope.openQrcode = function() {
              $scope.qrCodemodal.show();
          };
          $scope.backToStore = function() {
              $scope.filterModal.hide();
          };
          $scope.closeModal = function() {
              $scope.qrCodemodal.hide();
          };
          $scope.$on('$destroy', function() {
              $scope.qrCodemodal.remove();
              $scope.filterModal.remove();
          });
          //二维码展示modal
          $ionicModal.fromTemplateUrl('my-qrcode-modal.html', {
              scope: $scope,
              animation: 'slide-in-up',
              backdropClickToClose: true
          }).then(function(modal) {
              $scope.qrCodemodal = modal;
          });

          //保存二维码
          $scope.saveQrCode = function() {
              if (typeof cordova == 'undefined') {
                  return;
              }
              var imageName = 'myQRCode.jpg'; //二维码名称
              var targetURL = '';
              if (ionic.Platform.isAndroid()) {
                  targetURL = cordova.file.externalRootDirectory + imageName; //保存路径
              } else {
                  targetURL = cordova.file.documentsDirectory + imageName; //保存路径
              }

              //var url = encodeURI('http://img2.imgtn.bdimg.com/it/u=3062504597,3542499529&fm=21&gp=0.jpg');
              var url = encodeURI($scope.myStoreInfo.qrcode);
              var trustHosts = true; //信任证书
              var options = {
                  //headers: {
                  //  "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                  //}
              };
              var fileTransfer = new FileTransfer();
              fileTransfer.download(
                  url,
                  targetURL,
                  function(entry) {
                      if (ionic.Platform.isAndroid()) {
                          var path = entry.toURL();
                          PopupService.showAlert('', '图片已经保存至' + path);
                      } else {
                          PopupService.showToast('保存成功');
                      }
                      //alert("download complete: " + entry.toURL());
                  },
                  function(error) {
                      PopupService.showToast('保存失败！');
                  },
                  trustHosts,
                  options
              );
          };
      }
  ]);

  APP.service('MyStoreManageService', ['$http', 'UrlService', function($http, UrlService) {
      //初始化
      // this.doInit = function(couponId, startIndex, pageSize) {
      //     var params = {
      //         couponId: couponId,
      //         startIndex: startIndex,
      //         pageSize: pageSize
      //     };
      //     return $http.get(UrlService.getUrl('USE_COUPONS_LIST'), params);
      // };

      //店铺管理页面数据
      this.mstore = function() {
          return $http.get(UrlService.getUrl('MYSTORE'), {});
      }
  }]);