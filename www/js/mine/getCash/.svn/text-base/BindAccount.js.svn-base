/**
 * creater:zhiqiang.zhao@dhc.com.cn
 * create time:2016/3/31
 * describe：BindAccountController
 **/

APP.controller('BindAccountController', ['$scope', 'EasyConnectBindAccountService',
  function ($scope, EasyConnectBindAccountService) {
    /** 变量声明 **/
    $scope.account = '';
    $scope.mobile = '';
    $scope.personId = '';
    /** 方法 **/
      //页面初始化
    $scope.init = function () {
      EasyConnectBindAccountService.doInit()
        .success(function (response, status, headers, config) {
          if (response.success) {
            $scope.account = response.data.memberKjtpays.memberRealName;
            $scope.mobile = response.data.memberKjtpays.memberKjtpayAccount;
            $scope.personId = response.data.memberKjtpays.memberIdCard;
          }
        })
    };

    //viewWillAppear
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.init();
    });
  }]);

/**
 * creater:zhiqiang.zhao@dhc.com.cn
 * create time:2016-4-20
 * describe：获取绑定信息(用于反映绑定人信息)
 **/
APP.service('EasyConnectBindAccountService', ['$http', 'UrlService', function ($http, UrlService) {
  this.doInit = function () {
    return $http.get(UrlService.getUrl('EASYCONNECTACCOUNT_INIT'));
  };
}]);
