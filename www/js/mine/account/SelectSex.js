/**
 * creater:zhiqiang.zhao@dhc.com.cn
 * create time:2016/3/14
 * describe：SelectSexController 测试控制器
 **/

APP.controller('SelectSexController', ['$scope', '$stateParams', '$rootScope', '$state', 'SelectSexService','$timeout',
  function ($scope, $stateParams, $rootScope, $state, SelectSexService,$timeout) {

    /** 变量声明 **/
    $scope.sex = {
      value: $stateParams.gender
    };
    $scope.nickName = $stateParams.nickName;
    $scope.email = $stateParams.email;
    $scope.userName = $stateParams.userName;
    $scope.birthday = $stateParams.birthday;
    $scope.updateResult = true;
    $scope.updateContent = '';

    /** 方法 **/
      //初始化
    $scope.init = function () {
      $scope.sex = {
        value: $stateParams.gender
      };
      $scope.nickName = $stateParams.nickName;
      $scope.email = $stateParams.email;
      $scope.userName = $stateParams.userName;
      $scope.birthday = $stateParams.birthday;
    };

    //viewWillAppear
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.init();
    });

    //选择性别
    $scope.doSelect = function (index) {
      $scope.sex.value = index;
      SelectSexService.changeMessage($scope.userName, $scope.birthday, $scope.sex.value, $scope.nickName)
        .success(function (response, status, headers, config) {
          if (response.success) {
            $rootScope.$broadcast('SELECT_SEX', index);
            $scope.$ionicGoBack();
          }
          else {
            if (response.message) {
              $scope.showResult(response.message);
            }
            else {
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
APP.service('SelectSexService', ['$http', 'UrlService',
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
