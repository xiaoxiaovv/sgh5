APP.controller('accsafeCtrl', ['$scope', 'accsafeService', '$rootScope', '$state', '$ionicActionSheet', '$timeout', 'UserService', '$ionicLoading', 'PlatformService', 'ionicDatePicker', '$ionicPopup', 'LoginService','$localstorage',
  function ($scope, accsafeService, $rootScope, $state, $ionicActionSheet, $timeout, UserService, $ionicLoading, PlatformService, ionicDatePicker, $ionicPopup, LoginService,$localstorage) {

    /** 变量声明 **/
    $scope.isPhone = !!window.cordova;
    $scope.userInfo = {
      picTempFile: ''
    };
    $scope.user = {};
    $scope.accountMessage = '';
    $scope.accountEmail = '';
    $scope.accountNumber = '';
    $scope.accountToken = '';
    $scope.accountSessionId = '';
    $scope.accountHeaderKey = '2e8352919709910328ec6b6b682a74f3';
    $scope.updateResult = true;
    $scope.updateContent = '';




    /** 方法 **/
      //页面初始化
    $scope.init = function () {
      $scope.user = UserService.getUser();
      $scope.accountMessage = $scope.user.userName;
      $scope.accountEmail = $scope.user.email;
      $scope.accountToken = $scope.user.token;
      $scope.accountSessionId = $scope.user.sessionValue;
      if(UserService.getUser().mobile)
      {
        $scope.accountNumber = $scope.user.mobile;
      }else {
        $scope.accountNumber = '手机号未绑定';
      }

      $scope.accountHeaderKey = '2e8352919709910328ec6b6b682a74f3';
      $scope.showMobile = true;

      var patternMobile = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/;
      if (!patternMobile.exec($scope.accountNumber)) {
        $scope.showMobile = false;
      }

    };

    //viewWillAppear
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.init();
    });
    //退出后跳转引导页
    $scope.goGuidePage = function () {
      $localstorage.set('ROLE_INFO', 'undefined');
      $state.go('guidePage');
    };
    //修改邮箱回调
    $rootScope.$on('CHANGE_EMAIL', function (event, data) {
      $scope.accountEmail = data;
      $scope.user.email = data;
      UserService.setUser($scope.user);
      $scope.showResult('修改成功');
    });

    //回退
    $scope.goBack = function () {
      $state.go('accsetting');
    };

    //显示修改结果提示
    $scope.showResult = function (result) {
      $scope.updateContent = result;
      $scope.updateResult = false;
      $timeout(function () {
        $scope.updateResult = true;
      }, 1000);
    };

  }]);

/**
 * creater:zhiqiang.zhao@dhc.com.cn
 * create time:2016-4-29
 * describe：AccountMessageService网络服务
 **/
APP.service('accsafeService', ['$http', 'UrlService',
  function ($http, UrlService) {


    //修改信息
    this.changeMessage = function (userName, birthday, gender, nickName) {
      var params = {
        'userName': userName,
        'birthday': birthday,
        'gender': gender,
        'nickName': nickName
      };
      return $http({
        method: 'POST',
        url: UrlService.getUrl('UPDATEMEMBER_INIT'),
        params: params
      });
    };
  }]);
