/**
 * creater:zhiqiang.zhao@dhc.com.cn
 * create time:2016/3/17
 * describe：ChangePasswordController 修改密码控制器
 **/

APP.controller('ChangePasswordController', ['$scope', 'ChangePassWordService', 'PopupService', '$timeout', '$state', 'UserService',
  function ($scope, ChangePassWordService, PopupService, $timeout, $state, UserService) {

    /** 变量声明 **/
    $scope.user = '';
    $scope.password =
    {
      oldWord: '', newWord: '', makeSureWord: ''
    };
    $scope.accountMessage = '';
    $scope.accountToken = '';
    $scope.updateContent = '';
    $scope.updateResult = true;
    /** 方法 **/
      //页面初始化
    $scope.init = function () {
      $scope.user = UserService.getUser();
      $scope.accountMessage = $scope.user.userName;
      $scope.accountToken = $scope.user.token;
      $scope.password =
      {
        oldWord: '', newWord: '', makeSureWord: ''
      };
    };

    //viewWillAppear
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.init();
    });

    //修改成功后跳转登录页面
    $scope.goLoginPage = function () {
      $state.go('login');
    };

    //保存
    $scope.doChange = function () {
      var reg = $scope.globalConstant.passwordRegExp;
      if (!$scope.password.oldWord) {
        PopupService.showToast('原密码不能为空');
        return;
      }
      if (!$scope.password.newWord) {
        PopupService.showToast('新密码不能为空');
        return;
      }
      if(!(reg.test($scope.password.newWord))){
        PopupService.showToast('新密码不符合规则');return;
      }
      if (!$scope.password.makeSureWord) {
        PopupService.showToast('确认密码不能为空');
        return;
      }
      if ($scope.password.makeSureWord != $scope.password.newWord) {
        PopupService.showToast('两次输入的新密码不相同');
        return;
      }
      //调用修改密码接口
      ChangePassWordService.doInit($scope.accountToken, $scope.accountMessage, $scope.password.oldWord, $scope.password.newWord)
        .success(function (response, status, headers, config) {
          if (response.success) {
            $scope.showResult('修改成功');
            UserService.clearUser();
            $timeout(function(){
              $scope.goLoginPage();
            },1000);
          } else {
            $scope.showResult(response.message);
          }
        });
    };

    //返回
    $scope.goBack = function () {
      $state.go('accsafe');
    };

    //显示修改信息
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
 * create time:2016-3-24
 * describe：修改密码
 **/
APP.service('ChangePassWordService', ['$http', 'UrlService', function ($http, UrlService) {
  this.doInit = function (tokenKey, userName, oldPassword, password) {
    var token = tokenKey;
    var params = {
      'token': token,
      'userName': userName,
      'oldPassword': encodeURIComponent(oldPassword),
      'password': encodeURIComponent(password)
    };
    return $http({
      method: 'POST',
      url: UrlService.getUrl('UPDATEPASSWORD_INIT'),
      params: params
    });
  };
}]);
