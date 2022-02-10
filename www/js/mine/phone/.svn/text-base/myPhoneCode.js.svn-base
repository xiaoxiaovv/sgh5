  APP.controller('MyPhoneCodeController', ['$scope', '$stateParams', '$rootScope', '$ionicHistory', '$state',
      '$ionicSideMenuDelegate', 'UserService', 'MyPhoneCodeService', '$ionicSlideBoxDelegate', '$ionicModal',
      'ChooseShopTemplateService', 'PopupService', 'GoodsService', 'CommonAddressService', '$timeout',
      '$ionicScrollDelegate', 'UrlService', 'BannerThemeService', 'SeckillService', 'countdownService', '$interval', '$ionicLoading', 'LoginService', 'CreditService', '$http', '$ionicScrollDelegate',
      function($scope, $stateParams, $rootScope, $ionicHistory, $state, $ionicSideMenuDelegate, UserService,
          MyPhoneCodeService, $ionicSlideBoxDelegate, $ionicModal, ChooseShopTemplateService, PopupService,
          GoodsService, CommonAddressService, $timeout, $ionicScrollDelegate, UrlService, BannerThemeService, SeckillService, countdownService, $interval, $ionicLoading, LoginService, CreditService, $http, $ionicScrollDelegate) {
          //判断是否是ios设备
          if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {
              $scope.isIosApp = true;
          } else {
              $scope.isIosApp = false;
          };

          $scope.opacity = false; //提示文字是否显示

          //图标设置
          $scope.GoBackImgUrl = $rootScope.imgBaseURL+"img/addressBack@2x.png";
          $scope.ResultImgUrl = $rootScope.imgBaseURL+"img/PhoneManage@2x.png";

          //获取用户id
          $scope.storeId = window.localStorage.storeId;

          //获取用户基本信息
          $scope.USER_CACHE_KEY = JSON.parse(window.localStorage.USER_CACHE_KEY);

          //用户手机号
          $scope.Phone = $scope.USER_CACHE_KEY.mobile;
          //$scope.Phone = '18301481761';

          //是否身份认证
          $scope.isAuth = "-1" //是否身份认证过;[0没认证  ， 1 认证过 ， -1接口异常[默认] ]

          //用户信息数据
          $scope.userData = '';

          //验证码
          $scope.code = {
              captcha: '',
              mobileNum: $scope.Phone,
          };

          //判断获取验证码是否可以点击
          $scope.switchState = true;

          //倒计时
          $scope.PhoneTime = '59';

          //三种状态【0获取验证码 ， 1重新获取， 2倒计时 】 默认获取验证码
          $scope.CodePhoneState = '0';

          //倒计时方法
          function ReduceTimer() {
              $timeout(function() {
                  if ($scope.PhoneTime > 0) {
                      $scope.PhoneTime = $scope.PhoneTime - 1;
                      console.log($scope.PhoneTime);
                      //判断获取验证码是否可以点击
                      $scope.switchState = false;
                      ReduceTimer();
                  } else {
                      console.log('倒计时结束');
                      $scope.CodePhoneState = '1';
                      //判断获取验证码是否可以点击
                      $scope.switchState = true;
                      //倒计时
                      $scope.PhoneTime = '59';
                  }
              }, 1000)
          }

          //获取验证码
          $scope.getCodePhone = function() {
              if ($scope.switchState) {
                  //获取验证码方法
                  MyPhoneCodeService.captchaMobile($scope.Phone).success(function(res) {
                      if (res.success) {
                          $scope.opacity = true; //提示文字是否显示
                          $scope.CodePhoneState = 2;

                          ReduceTimer();
                      } else {
                          PopupService.showToast(res.message);
                      }
                  })
              }
          };

          //下一步跳转
          $scope.goToIdCard = function() {
              //判断验证码是否通过;  通过可以跳转不通过弹出框提示验证码不对
              MyPhoneCodeService.checkMobile($scope.code).success(function(res) {
                  if (res.success) {
                      if ($scope.isAuth == 1) {
                          var data = {
                              realName: $scope.userData.identity.realName,
                              identityNo: $scope.userData.identity.identityNo,
                          };
                          $state.go("myPhoneBind", data, { reload: true });
                      } else if ($scope.isAuth == 0) {
                          $state.go("myIdCardAuthen", { 'isAuth': false }, { reload: true });
                      } else {
                          PopupService.showToast('获取用户是否认证异常!');
                          $scope.FnisAuth();
                      }

                  } else {
                      PopupService.showToast(res.message);
                  }
              })
          };

          //手机不可用
          $scope.MobileIsUnavailable = function() {
              if ($scope.isAuth == 1) {
                  //实名认证过
                  $state.go("myIdCardAuthen", { 'isAuth': true }, { reload: true });

              } else if ($scope.isAuth == 0) {
                  //没有实名认证
                  $state.go("myIdCardAuthen", { 'isAuth': false }, { reload: true });

              } else {
                  //实名认证接口异常
                  console.log('获取用户是否认证异常!');
                  $scope.FnisAuth();
              }
          };

          //判断用户是否实名认证
          $scope.FnisAuth = function() {
              MyPhoneCodeService.isRealNameAuth().success(function(res) {
                  if (res.success) {
                      if (res.data.isAuth) {
                          //实名认证过
                          $scope.isAuth = '1'; //认证

                      } else {
                          //没有实名认证
                          $scope.isAuth = '0'; //没认证
                      }
                  } else {
                      $scope.isAuth = '-1'; //接口异常
                  }
                  $scope.userData = res.data;
              });
          };



          $scope.$on('$ionicView.beforeEnter', function() {
              $ionicScrollDelegate.scrollTop();
              $scope.CodePhoneState = '0';
              $scope.opacity = false; //提示文字是否显示
              $scope.FnisAuth();

              //获取用户id
              $scope.storeId = window.localStorage.storeId;

              //获取用户基本信息
              $scope.USER_CACHE_KEY = JSON.parse(window.localStorage.USER_CACHE_KEY);

              //用户手机号
              $scope.Phone = $scope.USER_CACHE_KEY.mobile;

              if ($scope.PhoneTime != 59) {
                  $scope.CodePhoneState = '2';
                  $scope.opacity = true; //提示文字是否显示
              };
              //验证码
              $scope.code = {
                  captcha: '',
                  mobileNum: $scope.Phone,
              };

          });
      }
  ]);

  APP.service('MyPhoneCodeService', ['$http', 'UrlService', function($http, UrlService) {
      //用户是否身份认证
      this.isRealNameAuth = function() {
          return $http.get(UrlService.getUrl('ISREALNAMEAUTH'), {});
      };
      //获取手机验证码
      this.captchaMobile = function(phone) {
          var params = {
              mobileNum: phone,
          };
          return $http.get(UrlService.getUrl('CAPTCHAMOBILE'), params);
      };
      //验证当前输入的验证码是否正确
      this.checkMobile = function(params) {
          return $http.get(UrlService.getUrl('CHECKMOBILE'), params);
      };

      //更换手机号
      this.changeMobile = function(params) {
          return $http({
              method: 'POST',
              url: UrlService.getUrl('CHANGEMOBILE'),
              params: params
          })
      }


  }]);