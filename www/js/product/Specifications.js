/**
 * Created by xy on 2016/3/15.
 */
APP.controller('SpecificationsController', ['$scope','spacificationsService', '$stateParams', '$ionicPopup','$rootScope',
  function ($scope,spacificationsService, $stateParams,$ionicPopup,$rootScope) {
  $scope.$on('$ionicView.beforeEnter', function () {
    $scope.flag = false;
    $scope.tabNav = 'selection';
    $scope.productId = $stateParams.productId;
    //alert($scope.productId);
    spacificationsService.doInit($scope.productId)
      .success(function (response, status, headers, config) {
        console.log(response.data);
        if(response.data == null){
          $scope.flag = true;
        } else {
          $scope.flag = false;
          $scope.data = response.data.productAttrs;
        }
      });
  })
}]);

APP.service('spacificationsService', ['$http', 'UrlService', function ($http, UrlService) {
  this.doInit = function (productId) {
    var params = {
      'productId': productId
    };
    return $http.get(UrlService.getUrl('ORDERDETAIL_SPECIFICATIONS'), params);//'http://172.16.63.104:8086/v2/h5/sg/purchase/specifications.html', params);//ORDERDETAIL_SPECIFICATIONS
  };
}]);
