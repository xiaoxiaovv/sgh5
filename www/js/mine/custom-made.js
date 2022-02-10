/**
 * Created by daba on 2016/12/21.
 */
APP.controller('CustomMadeController', ['$scope','$stateParams','$sce','$http','$ionicPopup','$rootScope','$state',
  function ($scope, $stateParams,$sce,$http,$ionicPopup,$rootScope,$state) {
    $scope.customMadeUrl = $sce.trustAsResourceUrl($stateParams.customMadeUrl);
    console.log($scope.customMadeUrl);
    // if(window.screen.width<=320){
    //   $scope.height='50%';
    // }else{
    //   $scope.height='80%';
    // }
    $scope.close = function(){
      $state.go('shop');
    }

  }]);
