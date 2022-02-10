  APP.controller('MyIdCardAuthenController', ['$scope', '$stateParams', '$rootScope', '$ionicHistory', '$state',
      '$ionicSideMenuDelegate', 'UserService', 'MyIdCardAuthenService', '$ionicSlideBoxDelegate', '$ionicModal',
      'ChooseShopTemplateService', 'PopupService', 'GoodsService', 'CommonAddressService', '$timeout',
      '$ionicScrollDelegate', 'UrlService', 'BannerThemeService', 'SeckillService', 'countdownService', '$interval', '$ionicLoading', 'LoginService', 'CreditService', '$http', '$ionicScrollDelegate',
      function($scope, $stateParams, $rootScope, $ionicHistory, $state, $ionicSideMenuDelegate, UserService,
          MyIdCardAuthenService, $ionicSlideBoxDelegate, $ionicModal, ChooseShopTemplateService, PopupService,
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
          //判断用户是否身份认证过
          $scope.isAuth = '-1'; //['-1接口异常'，'0没有验证'，'1验证']
          $scope.isIdCardAuthen = false; //是否验证过【默认没有验证】
          $scope.data = ''; //获取用户是否验证数据

          //身份证号码
          $scope.IdCard = {
              mobile: $scope.USER_CACHE_KEY.mobile, //手机号
              identityNo: '', //身份证号
              realName: '', //真实姓名
              memberId: $scope.USER_CACHE_KEY.mid, //用户id
          };

          //下一步按钮状态
          $scope.isSubMint = false;

          //验证信息
          $scope.ToMessage = '';

          //输入身份证号验证
          var reg = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/; //18位身份证验证 最后一位可以是X;
          $scope.IdCardKeyup = function() {
              if (reg.test($scope.IdCard.identityNo)) {
                  //通过正则验证 下一步按钮改变状态
                  $scope.isSubMint = true;
              } else {
                  $scope.isSubMint = false;
              }
          };
          //后台验证手机号和身份证--没有认证身份证
          function isIdCardPhoneFn() {
              var data = {
                  realName: $scope.IdCard.realName,
                  identityNo: $scope.IdCard.identityNo,
              };
              MyIdCardAuthenService.nameAuth(data).success(function(res) {
                  console.log(res);
                  if (res.data) {
                      $scope.ToMessage = res.message;
                      $state.go("myPhoneBind", data, { reload: true });
                  } else {
                      $scope.ToMessage = res.message;
                  }
                  // $state.go("myPhoneBind", {}, { reload: true });
              })
          }


          //下一步跳转
          $scope.goToPhoneBind = function() {
              if ($scope.isIdCardAuthen) {
                  //验证身份
                  if ($scope.data.identity.realName) {
                      var params = {
                          realName: $scope.data.identity.realName,
                          identityNo: $scope.IdCard.identityNo,
                      };
                      MyIdCardAuthenService.realNameCheck(params).success(function(res) {
                          //此处特殊判断res.data;
                          if (res.data) {
                              $state.go("myPhoneBind", params, { reload: true });
                          } else {
                              PopupService.showToast(res.message);
                          }
                      });
                  } else {
                      PopupService.showToast('请输入姓名!');
                      return false;
                  }
              } else {
                  //新身份认证
                  if ($scope.IdCard.realName) {
                      isIdCardPhoneFn();
                  } else {
                      PopupService.showToast('请输入姓名!');
                      return false;
                  }
              }
          };

          //判断用户是否实名认证
          $scope.FnisAuth = function() {
              MyIdCardAuthenService.isRealNameAuth().success(function(res) {
                  if (res.success) {
                      $scope.data = res.data;
                      if (res.data.isAuth) {
                          //实名认证过
                          $scope.isAuth = '1'; //认证
                          $scope.isIdCardAuthen = true;
                      } else {
                          //没有实名认证
                          $scope.isAuth = '0'; //没认证
                          $scope.isIdCardAuthen = false;
                      }
                  } else {
                      $scope.isAuth = '-1'; //接口异常
                      $scope.isIdCardAuthen = '';
                      PopupService.showToast('获取用户是否认证异常!');
                  }
              });
          };

          //局部刷新
          $scope.$on('$ionicView.beforeEnter', function(e, v) {
              $ionicScrollDelegate.scrollTop();
              //获取用户id
              $scope.storeId = window.localStorage.storeId;

              //获取用户基本信息
              $scope.USER_CACHE_KEY = JSON.parse(window.localStorage.USER_CACHE_KEY);
              //判断用户是否身份认证过
              $scope.isAuth = '-1'; //['-1接口异常'，'0没有验证'，'1验证']
              $scope.isIdCardAuthen = false; //是否验证过【默认没有验证】
              $scope.data = ''; //获取用户是否验证数据
              $scope.ToMessage = ''; //验证信息

              //身份证号码
              $scope.IdCard = {
                  mobile: $scope.USER_CACHE_KEY.mobile, //手机号
                  identityNo: '', //身份证号
                  realName: '', //真实姓名
                  memberId: $scope.USER_CACHE_KEY.mid, //用户id
              };

              $scope.FnisAuth();

          })
      }
  ]);

  APP.service('MyIdCardAuthenService', ['$http', 'UrlService', function($http, UrlService) {
      //验证手机号和身份证
      this.realNameAuth = function(params) {
          return $http({
              method: 'POST',
              url: UrlService.getUrl('REALNAMEAUTH'),
              params: params
          });

      };

      //用户是否身份认证
      this.isRealNameAuth = function() {
          return $http.get(UrlService.getUrl('ISREALNAMEAUTH'), {});
      };

      //身份证是否有效
      this.realNameCheck = function(params) {
         // return $http.get(UrlService.getUrl('GET_NAMEORID'), params);
          return $http({
              method:'POST',
              url:UrlService.getUrl('GET_NAMEORID'),
              params:params
          });
      }

      //身份证认证
      this.nameAuth = function(params) {
          return $http.get(UrlService.getUrl('GET_NAMEAUTH'), params);
      }

  }]);