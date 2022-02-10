/**
 * creater:zhiqiang.zhao@dhc.com.cn
 * create time:2016/3/31
 * describe：BindResultController 测试控制器
 **/

APP.controller('BindResultController', ['$scope', 'EasyConnectBindResultService', '$rootScope',
  function ($scope, EasyConnectBindResultService, $rootScope) {
    /** 变量声明 **/
    $scope.iconImage = $rootScope.imgBaseURL+"img/ic_person.png";
    $scope.account = '';
    $scope.mobile = '';
    $scope.personId = '';
    /** 方法 **/
      //页面初始化
    $scope.init = function () {
      EasyConnectBindResultService.doInit()
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

    //返回
    $scope.goBack = function () {
      $scope.$ionicGoBack();
    };

  }]);
/**
 * creater:zhiqiang.zhao@dhc.com.cn
 * create time:2016-4-20
 * describe：获取绑定信息(用于反映绑定结果)
 **/
APP.service('EasyConnectBindResultService', ['$http', 'UrlService', function ($http, UrlService) {
  this.doInit = function () {
    return $http.get(UrlService.getUrl('EASYCONNECTRESULT_INIT'));
  };
}]);
