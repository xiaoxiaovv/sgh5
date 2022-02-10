APP.controller('MyRaiseHaveController', ['$scope','UserService',
function ($scope,UserService) {

    /***变量声明***/
    $scope.storeId = UserService.getUser().mid;//用户storeId

    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.storeId = UserService.getUser().mid;

    })
}]); 