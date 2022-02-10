/**
 * creater:zhiqiang.zhao@dhc.com.cn
 * create time:2016/3/28
 * describe：DetailMessageCenterController 测试控制器
 **/

APP.controller('DetailMessageCenterController', ['$scope','$stateParams',
  function ($scope,$stateParams) {
  /** 变量声明 **/
  $scope.htmlContent = $stateParams.content;
  $scope.title = $stateParams.title;
  /** 方法 **/
  $scope.init = function(){
    $scope.htmlContent = $stateParams.content;
    $scope.title = $stateParams.title;
  };

  $scope.$on('$ionicView.beforeEnter',function(){
    $scope.init();
  })
}]);
