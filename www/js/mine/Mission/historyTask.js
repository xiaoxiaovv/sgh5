APP.controller('historyTaskController',['$scope', '$stateParams', 'ShareService',function($scope, $stateParams, ShareService) {

  $scope.history = '';
  $scope.isHistory = false;

  // 判断是否为空对象xyz
  function isEmptyObject(obj){
       for(var key in obj){
           return false
       };
       return true
  };

  $scope.loadData = function(){
    ShareService.myHistoryShare()
      .success(function(response) {
        $scope.history = response.data;
        console.log(response.data);
        if(isEmptyObject($scope.history)){
          $scope.isHistory = true;
        }
      }).error(function() {
        console.log("error");
      })
  }

  $scope.$on('$ionicView.beforeEnter', function(){
      $scope.isHistory = false;
  });

  $scope.$on('$ionicView.enter', function(){
      $scope.loadData();
  });

}]);
