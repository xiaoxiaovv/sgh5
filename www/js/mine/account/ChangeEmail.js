/**
 * creater:zhiqiang.zhao@dhc.com.cn
 * create time:2016/3/17
 * describe：ChangeEmailController 测试控制器
 **/

APP.controller('ChangeEmailController', ['$scope', '$stateParams', '$rootScope', 'PopupService', '$timeout', '$state','ChangeEmailService',
  function ($scope, $stateParams, $rootScope, PopupService, $timeout, $state,ChangeEmailService) {

    /** 变量声明 **/
    $scope.email = {
      value: $stateParams.email
    };
    $scope.gender = $stateParams.gender;
    $scope.userName = $stateParams.userName;
    $scope.birthday = $stateParams.birthday;
    $scope.nickName = $stateParams.nickName;

    $scope.updateResult = true;
    $scope.updateContent = '';
    /** 方法 **/
      //页面初始化
    $scope.init = function () {
      $scope.email = {
        value: $stateParams.email
      };
      $scope.gender = $stateParams.gender | JSON.parse(window.localStorage.USER_CACHE_KEY).gender;
      $scope.userName = $stateParams.userName;
      $scope.birthday = $stateParams.birthday;
      $scope.nickName = $stateParams.nickName;
    };

    //viewWillAppear
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.init();
    });

    //保存
    $scope.doChange = function () {
      var pattern = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
      if (!$scope.email.value) {
        PopupService.showToast('您输入的邮箱不能为空');
        return;
      }
      if (!pattern.exec($scope.email.value)) {
        PopupService.showToast('电子邮箱输入不规范');
        return;
      }
      ChangeEmailService.changeEmail($scope.userName,$scope.birthday,$scope.gender,$scope.nickName, $scope.email.value)
        .success(function (response, status, headers, config) {
          if (response.success) {
            $rootScope.$broadcast('CHANGE_EMAIL', $scope.email.value);
            $state.go('accsafe');
          } else {
            if(response.message) {
              $scope.showResult(response.message);
            } else {
              $scope.showResult('未知异常');
            }
          }
        });
    };

    //返回
    $scope.goBack = function () {
      $state.go('accsafe');
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
APP.service('ChangeEmailService', ['$http', 'UrlService',
  function ($http, UrlService) {
    //修改信息
    this.changeEmail = function (userName,birthday,gender,nickName,email) {
      var params = {
        'userName': userName,
        'birthday': birthday,
        'gender': gender,
        'nickName': nickName,
        'email': email
      };
      return $http({
        method: 'POST',
        url: UrlService.getUrl('UPDATE_EMAIL'),
        params: params
      });
    };
  }]);
