/**
 * creater:zhiqiang.zhao@dhc.com.cn
 * create time:2016/3/17
 * describe：ChangeNameController 测试控制器
 **/

APP.controller('ChangeNameController', ['$scope', '$stateParams', '$rootScope', 'PopupService', '$timeout', '$state', 'ChangeNameService',
  function ($scope, $stateParams, $rootScope, PopupService, $timeout, $state, ChangeNameService) {

    /** 变量声明 **/
    $scope.name = {
      value: $stateParams.nickName
    };
    $scope.email = $stateParams.email;
    $scope.gender = $stateParams.gender;
    $scope.userName = $stateParams.userName;
    $scope.birthday = $stateParams.birthday;
    $scope.updateResult = true;
    $scope.updateContent = '';

    /** 方法 **/
      //初始化
    $scope.init = function () {
      $scope.name = {
        value: $stateParams.nickName
      };
      $scope.email = $stateParams.email;
      $scope.gender = $stateParams.gender;
      $scope.userName = $stateParams.userName;
      $scope.birthday = $stateParams.birthday;
    };

    //viewWillAppear
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.init();
    });

    //保存
    $scope.doChange = function () {
      if (!$scope.name.value) {
        PopupService.showToast('您输入的昵称不能为空');
        return;
      }
      ChangeNameService.changeMessage($scope.userName, $scope.birthday, $scope.gender, $scope.name.value)
        .success(function (response, status, headers, config) {
          if (response.success) {
            $rootScope.$broadcast('CHANGE_NAME', $scope.name.value);
            $state.go('accsetting');
          }
          else {
            if(response.message)
            {
              $scope.showResult(response.message);
            }
            else
            {
              $scope.showResult('未知异常');
            }
          }
        });

    };

    //返回
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
APP.service('ChangeNameService', ['$http', 'UrlService',
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
