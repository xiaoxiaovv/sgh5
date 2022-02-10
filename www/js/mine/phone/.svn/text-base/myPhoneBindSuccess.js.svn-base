  APP.controller('MyPhoneBindSuccessController', ['$scope', '$stateParams', '$rootScope', '$ionicHistory', '$state',
      '$ionicSideMenuDelegate', 'UserService', 'MyPhoneBindSuccessService', '$ionicSlideBoxDelegate', '$ionicModal',
      'ChooseShopTemplateService', 'PopupService', 'GoodsService', 'CommonAddressService', '$timeout',
      '$ionicScrollDelegate', 'UrlService', 'BannerThemeService', 'SeckillService', 'countdownService', '$interval', '$ionicLoading', 'LoginService', 'CreditService', '$http', '$ionicScrollDelegate', '$localstorage',
      function($scope, $stateParams, $rootScope, $ionicHistory, $state, $ionicSideMenuDelegate, UserService,
          MyPhoneBindSuccessService, $ionicSlideBoxDelegate, $ionicModal, ChooseShopTemplateService, PopupService,
          GoodsService, CommonAddressService, $timeout, $ionicScrollDelegate, UrlService, BannerThemeService, SeckillService, countdownService, $interval, $ionicLoading, LoginService, CreditService, $http, $ionicScrollDelegate, $localstorage) {
          //判断是否是ios设备
          if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {
              $scope.isIosApp = true;
          } else {
              $scope.isIosApp = false;
          };

          $scope.phone = ''; //新手机号

          //图标设置
          $scope.GoBackImgUrl = $rootScope.imgBaseURL+"img/addressBack@2x.png";
          $scope.ResultImgUrl = $rootScope.imgBaseURL+"img/myPhoneManage@2x.png";

          //获取用户id
          $scope.storeId = window.localStorage.storeId;

          //获取用户基本信息
          $scope.USER_CACHE_KEY = JSON.parse(window.localStorage.USER_CACHE_KEY);


          //注销登录
          $scope.unload = function() {
              UserService.clearUser();
              LoginService.setRole(undefined);
              window.localStorage.setItem('isLogin', UserService.isUserLogin());
              $localstorage.set('storeId', '');
              $state.go('login');
          };

          $scope.$on('$ionicView.beforeEnter', function() {
              $ionicScrollDelegate.scrollTop();
              $scope.phone = $stateParams.phone; //新手机号
          });
      }
  ]);

  APP.service('MyPhoneBindSuccessService', ['$http', 'UrlService', function($http, UrlService) {

  }]);