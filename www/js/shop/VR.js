/**
 * Created by jiangfeng on 2017/6/10.
 */
APP.controller('VRController',['$rootScope','$scope','UrlService','$sce','$ionicHistory','$stateParams',
  function ($rootScope,$scope, UrlService, $sce, $ionicHistory, $stateParams) {
    $scope.iframeUrl = $sce.trustAsResourceUrl($rootScope.imgBaseURL + 'VRshop/index.html');
    var isH5 = $stateParams.isH5;
    $scope.goBack = function () {
      if (isH5) {
        $ionicHistory.goBack();
      } else {
        window.location.href = 'backToApp';
      }
    }
}]);
