APP.controller('monthRewardController', ['$scope', '$stateParams', 'HelpDetailService', 'UrlService', 'PlatformService','monthRewardService',
  function ($scope, $stateParams, HelpDetailService, Urlservice, PlatformService,monthRewardService) {
    $scope.title = $stateParams.title;
    $scope.type = $stateParams.code;
    $scope.earningType = $stateParams.earningType;
    $scope.monthList = [];
    var rewardType = 'Y',
      page = 0,
      pageSize = 10;
      $scope.init = function(){
        monthRewardService.getRevenueList($scope.earningType, $scope.type, rewardType, page, pageSize).success(function(response){
          console.log(response);
          $scope.monthList = response.data.rewardY;
    });
      }
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.init();
    });
    $scope.goBack=function(){
      $scope.$ionicGoBack();
    }
  }]);



APP.service('monthRewardService', ['$http', 'UrlService', function ($http, UrlService) {
  this.getRevenueList = function (earningType, type, rewardType, page, pageSize) {
    var params = {
      earningType: earningType,
      type: type,
      rewardType: rewardType,
      page: page,
      pageSize: pageSize
    };
    return $http.get(UrlService.getUrl('REVENUE_LIST'), params);
  };
}]);