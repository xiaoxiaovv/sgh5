  APP.controller('MyPhoneBindController', ['$scope', '$stateParams', '$rootScope', '$ionicHistory', '$state',
      '$ionicSideMenuDelegate', 'UserService', 'MyPhoneBindService', '$ionicSlideBoxDelegate', '$ionicModal',
      'ChooseShopTemplateService', 'PopupService', 'GoodsService', 'CommonAddressService', '$timeout',
      '$ionicScrollDelegate', 'UrlService', 'BannerThemeService', 'SeckillService', 'countdownService', '$interval', '$ionicLoading', 'LoginService', 'CreditService', '$http', '$ionicScrollDelegate',
      function($scope, $stateParams, $rootScope, $ionicHistory, $state, $ionicSideMenuDelegate, UserService,
          MyPhoneBindService, $ionicSlideBoxDelegate, $ionicModal, ChooseShopTemplateService, PopupService,
          GoodsService, CommonAddressService, $timeout, $ionicScrollDelegate, UrlService, BannerThemeService, SeckillService, countdownService, $interval, $ionicLoading, LoginService, CreditService, $http, $ionicScrollDelegate) {
          //判断是否是ios设备
          if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {
              $scope.isIosApp = true;
          } else {
              $scope.isIosApp = false;
          };

          $scope.mobile = ''; //新手机号
          $scope.realName = ''; //姓名
          $scope.identityNo = ''; //身份证

          //图标设置
          $scope.GoBackImgUrl = $rootScope.imgBaseURL+"img/addressBack@2x.png";
          $scope.ResultImgUrl = $rootScope.imgBaseURL+"img/PhoneManage@2x.png";

          //获取用户id
          $scope.storeId = window.localStorage.storeId;

          //获取用户基本信息
          $scope.USER_CACHE_KEY = JSON.parse(window.localStorage.USER_CACHE_KEY);

          //手机号码
          $scope.phone = {
              phone: ''
          };

          //下一步
          $scope.goToPhoneBindSuccess = function() {
              if (!$scope.realName) {
                  PopupService.showToast('非法参数姓名！');
                  return;
              }
              if (!$scope.identityNo) {
                  PopupService.showToast('非法参数证件号');
                  return;
              }
              //验证手机号
              var reg = $scope.globalConstant.mobileNumberRegExp;
              if (!reg.test($scope.phone.phone)) {
                  PopupService.showToast('非法参数手机号');
                  return;
              }
              var params = {
                  realName: $scope.realName,
                  identityNo: $scope.identityNo,
                  mobile: $scope.phone.phone
              };

              /*********************跳过验证直接跳转************************/
              //$state.go("myPhoneBindNewCode", { "mobile": $scope.phone.phone }, { reload: true });
              //验证新手机号 是否有效
              MyPhoneBindService.PhoneAuth(params).success(function(res) {
                  console.log(res);
                  if (res.data) {
                      $state.go("myPhoneBindNewCode", { "mobile": $scope.phone.phone,"realName":$scope.realName,"identityNo":$scope.identityNo }, { reload: true });
                  } else {
                      PopupService.showToast(res.message);
                  }
              });

          };

          $scope.$on('$ionicView.beforeEnter', function() {
          	  $scope.phone.phone = '';
              $ionicScrollDelegate.scrollTop();
              //判断跳转到此页面是否带数据
              if ($stateParams.realName && $stateParams.identityNo) {
                  $scope.realName = $stateParams.realName; //姓名
                  $scope.identityNo = $stateParams.identityNo; //身份证
              }

          });
      }
  ]);

  APP.service('MyPhoneBindService', ['$http', 'UrlService', function($http, UrlService) {
      //新手机号验证
      this.PhoneAuth = function(params) {
          return $http.get(UrlService.getUrl('GET_PHONEAUTH'), params);
      }
  }]);
