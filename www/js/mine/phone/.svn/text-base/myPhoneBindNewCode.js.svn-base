  APP.controller('MyPhoneBindNewCodeController', ['$scope', '$stateParams', '$rootScope', '$ionicHistory', '$state',
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

          //图标设置
          $scope.GoBackImgUrl = $rootScope.imgBaseURL+"img/addressBack@2x.png";
          $scope.ResultImgUrl = $rootScope.imgBaseURL+"img/PhoneManage@2x.png";

          //获取用户id
          $scope.storeId = window.localStorage.storeId;

          //获取用户基本信息
          $scope.USER_CACHE_KEY = JSON.parse(window.localStorage.USER_CACHE_KEY);

          //旧手机号
          $scope.oldMobileNo = $scope.USER_CACHE_KEY.mobile;
          //新手机号
          $scope.Phone = $stateParams.mobile;
          //身份证姓名
          $scope.realName = $stateParams.realName;
          //身份证号
          $scope.identityNo = $stateParams.identityNo;

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
              var params = {
                  mobileNum: $scope.Phone, //新手机号
                  captcha: $scope.code.captcha, //验证码
                  oldMobileNo: $scope.oldMobileNo, //旧手机号码
                  realName:$scope.realName, //身份证姓名
                  identityNo:$scope.identityNo, //身份证号
              };
              MyPhoneCodeService.changeMobile(params).success(function(res) {
                  console.log(res);
                  if (res.success) {
                      //跟换新手机号后 更新个人信息；
                      $state.go("myPhoneBindSuccess", { 'phone': $scope.Phone }, { reload: true });
                  } else {
                      PopupService.showToast(res.message);
                  }
              })
          };


          $scope.$on('$ionicView.beforeEnter', function() {
              $ionicScrollDelegate.scrollTop();
              $scope.CodePhoneState = '0';

              //获取用户id
              $scope.storeId = window.localStorage.storeId;

              //获取用户基本信息
              $scope.USER_CACHE_KEY = JSON.parse(window.localStorage.USER_CACHE_KEY);
              //旧手机号
              $scope.oldMobileNo = $scope.USER_CACHE_KEY.mobile;

              //新手机号
              $scope.Phone = $stateParams.mobile;

              if ($scope.PhoneTime != 59) {
                  $scope.CodePhoneState = '2';
              };
              //跳转就获取验证码
              if ($scope.switchState) {
                  //获取验证码方法
                  MyPhoneCodeService.captchaMobile($scope.Phone).success(function(res) {
                      if (res.success) {
                          $scope.CodePhoneState = 2;
                          ReduceTimer();
                      } else {
                          PopupService.showToast(res.message);
                      }
                  })
              }

          });
      }
  ]);
