  APP.controller('CustomizehdController', ['$scope', '$stateParams', '$ionicHistory', '$rootScope', '$state',
    function ($scope, $stateParams, $ionicHistory,$rootScope,$state) {
      $scope.imgUrl = $stateParams.url;
      $scope.rightShare = {top: '26px'};
      $scope.leftShare = {top: '26px'};
      if(window.cordova&&ionic.Platform.isIOS){
        $scope.rightShare = {
          "top":"16px",
          "position": "absolute",
          "left":"8px",
          "z-index": "10",
          "width": "32px"
        }
      }else{
        $scope.rightShare = {
          "top":"16px",
          "position": "absolute",
          "left":"8px",
          "z-index": "10",
          "width": "32px"
        }
      }
      $scope.goBack = function(){
        if ($rootScope.fromState == 'advertisement') {
          $state.go('homePage');
        } else {
          if($scope.goBackFlag){
            $scope.goBackFlag=false;
            $ionicHistory.goBack();
          }
        }
      };
      $scope.$on('$ionicView.beforeEnter', function (e, v) {
        $scope.goBackFlag=true;
          $scope.imgUrl = $stateParams.url;
      });

    }]);
