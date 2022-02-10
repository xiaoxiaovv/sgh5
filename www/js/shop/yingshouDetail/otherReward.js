APP.controller('otherRewardController', ['$scope', '$stateParams', 'UrlService', 'PlatformService','monthRewardService',
  function ($scope, $stateParams, Urlservice, PlatformService,monthRewardService) {
  	$scope.title = $stateParams.title;
  	$scope.type = $stateParams.code;
  	$scope.earningType = $stateParams.earningType;
  	$scope.total = 0;
  	$scope.otherList = [];
  	var rewardType = 'OTHER',
      page = 0,
      pageSize = 10;
      $scope.init = function(){
        monthRewardService.getRevenueList($scope.earningType, $scope.type, rewardType, page, pageSize).success(function(response){
          console.log(response);
          $scope.total = response.data.rewardO.expectOtherAmount;
          $scope.otherList = response.data.rewardOther;
    });
      }
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.init();
    });
  	$scope.goBack=function(){
  		$scope.$ionicGoBack();
  	}
  }]);

