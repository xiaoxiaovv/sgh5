APP.controller('exportDetailController', ['$stateParams', '$scope', '$rootScope', 'UrlService', 'CreditService', 'UserService', '$state', 'exportDetailService', '$timeout', '$localstorage', '$ionicSlideBoxDelegate', 'GetCouponsService', 'PopupService', 'BannerThemeService', 'GoodsService', function($stateParams, $scope, $rootScope, UrlService, CreditService, UserService, $state, exportDetailService, $timeout, $localstorage, $ionicSlideBoxDelegate, GetCouponsService, PopupService, BannerThemeService, GoodsService) {
  $scope.exportId = $stateParams.exportId;//专家id，从路由获取
  $scope.pageIndex =1;
  $scope.pageSize = 4;
  $scope.hasmore = true;
	$scope.init = function(){
		$scope.pageData = {};//页面数据
    $scope.ajanli = [];
    $scope.pageIndex =1;
  $scope.pageSize = 4;
		exportDetailService.getPageDate($scope.exportId,1,$scope.pageSize).success(function(res){
      console.log(res);
			$scope.pageData = res.data;
		})
    $scope.loadmore = function(){
      exportDetailService.getPageDate($scope.exportId,$scope.pageIndex,$scope.pageSize).success(function(res){
      console.log(res);
      if (res.data.details.length == 0) {
          $scope.hasmore = false;
          $scope.ajanli = $scope.ajanli.concat(res.data.details);
          $scope.$broadcast('scroll.infiniteScrollComplete');
        } else {
          $scope.hasmore = true;
          $scope.ajanli = $scope.ajanli.concat(res.data.details);

          //
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
    })
      $scope.pageIndex++;
    }
	}




   $scope.$on('$ionicView.beforeEnter', function(event, v) {
    if (v.direction == 'back'){
      
    }else{
      $scope.init();
    }  
  });
   $scope.$on('$stateChangeSuccess', function() {
    $scope.loadmore();
  });
}]);


APP.service('exportDetailService', ['$http', 'UrlService', function($http, UrlService) {
  	this.getPageDate = function (id,pageIndex,pageSize) {
  	var params = {
      channel:1,
  		id:id,
      pageIndex:pageIndex,
      pageSize:pageSize
  	}
  	return $http.get(UrlService.getNewUrl('EXPORT_DETAIL'), params);
  }
}]);