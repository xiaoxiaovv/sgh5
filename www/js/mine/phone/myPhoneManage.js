  APP.controller('MyPhoneManageController', ['$ionicPopup','HomePageService','$scope', '$stateParams', '$rootScope', '$ionicHistory', '$state',
      '$ionicSideMenuDelegate', 'UserService', 'MyPhoneManageService', '$ionicSlideBoxDelegate', '$ionicModal',
      'ChooseShopTemplateService', 'PopupService', 'GoodsService', 'CommonAddressService', '$timeout',
      '$ionicScrollDelegate', 'UrlService', 'BannerThemeService', 'SeckillService', 'countdownService', '$interval', '$ionicLoading', 'LoginService', 'CreditService', '$http', '$ionicScrollDelegate',
      function($ionicPopup,HomePageService,$scope, $stateParams, $rootScope, $ionicHistory, $state, $ionicSideMenuDelegate, UserService,
          MyPhoneManageService, $ionicSlideBoxDelegate, $ionicModal, ChooseShopTemplateService, PopupService,
          GoodsService, CommonAddressService, $timeout, $ionicScrollDelegate, UrlService, BannerThemeService, SeckillService, countdownService, $interval, $ionicLoading, LoginService, CreditService, $http, $ionicScrollDelegate) {

          $scope.$on('$ionicView.beforeEnter', function() {
               $scope.isUser=false;

              // 判断是否是普通用户
              $scope.isUsers=function () {  //myPhoneCode
                HomePageService.isWdHost()
                  .success(function (res) {
                    $scope.isWdHost = res.data.isHost;
                    if(res.data.o2o == null || res.data.o2o == true){ //o2o
                      $ionicPopup.show({
                        template: '尊贵的VIP商户，请前往商户中心修改手机号。',
                        buttons: [
                          {
                            text: '好的，我知道了！',
                            onTap:function () {
                              $scope.$ionicGoBack();
                            }
                          }
                        ]
                      });

                    }else{
                      if ($scope.isWdHost == 1) { // 微店主
                        $state.go('myPhoneCode');
                      } else if ($scope.isWdHost == 0) { //普通用户 没开过店 0
                        $scope.isUser=true;
                      }
                    }
                  });
              };
              //升级微店主
              $scope.goUpgrade=function () {
                $state.go('newAuthenticationHome');
                $scope.isUser=false;
              };
              // 关闭按钮
              $scope.closePopup=function () {
                 $scope.isUser=false;
              };
              $ionicScrollDelegate.scrollTop();
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

              //用户手机号
              $scope.Phone = $scope.USER_CACHE_KEY.mobile;
          });
      }
  ]);

  APP.service('MyPhoneManageService', ['$http', 'UrlService', function($http, UrlService) {

  }]);