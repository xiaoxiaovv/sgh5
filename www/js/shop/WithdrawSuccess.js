/********************************

 creator:dhc-jiangfeng
 create time:2016/4/18
 describe：WithdrawSuccessController  提现成功控制器

 ********************************/
APP.controller('WithdrawSuccessController', ['$scope','$stateParams','$ionicHistory', function ($scope,$stateParams,$ionicHistory) {

  $scope.content = $stateParams.content;
  console.log($scope.content);
  $scope.goBack = function(){
    $ionicHistory.goBack(-2);
  }

}]);
