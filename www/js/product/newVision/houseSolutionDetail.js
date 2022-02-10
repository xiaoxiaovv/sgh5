APP.controller('houseSolutionDetailController', ['$stateParams', '$scope', '$rootScope', 'UrlService', 'UserService', '$state', 'houseSolutionDetailService', '$timeout', '$localstorage', '$ionicSlideBoxDelegate', 'GetCouponsService', 'PopupService', '$ionicHistory', function($stateParams, $scope, $rootScope, UrlService, UserService, $state, houseSolutionDetailService, $timeout, $localstorage, $ionicSlideBoxDelegate, GetCouponsService, PopupService,$ionicHistory) {
	$scope.allsoluteId = $stateParams.solutionId;//从路由获取方案类目
	$scope.pageIndex = 1;
	$scope.pageSize = 6;
	$scope.name = '';
	$scope.imgUrl = [];
	$scope.hasmore = true;
	$scope.frompage = 0;
	$scope.init = function(){
		$scope.frompage = 0;
		if($ionicHistory.backView()){
			console.log($ionicHistory.backView().stateName);
			if($ionicHistory.backView().stateName == 'productDetail'){
				$scope.frompage = 1;
			}
		}
		$scope.pageIndex = 1;
		$scope.pageSize = 6;
		$scope.listdata = [];
		houseSolutionDetailService.getPageListDate($scope.frompage,$scope.allsoluteId,$scope.pageIndex,$scope.pageSize).success(function(res){
			if(res.data.name){
				$scope.name = res.data.name;
			}
			if(res.data.imageUrl){
				$scope.imgUrl = res.data.imageUrl;
			}
		})
		$scope.loadmore = function(){
			houseSolutionDetailService.getPageListDate($scope.frompage,$scope.allsoluteId,$scope.pageIndex,$scope.pageSize).success(function(res){
			console.log(res);
			if (res.data.details.length == 0) {
					$scope.hasmore = false;
					$scope.listdata = $scope.listdata.concat(res.data.details);
					$scope.$broadcast('scroll.infiniteScrollComplete');
				} else {
					$scope.hasmore = true;
					$scope.listdata = $scope.listdata.concat(res.data.details);

					//
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}
		})
			$scope.pageIndex++;
		}	
	}
	$scope.goBack = function() {
    $ionicHistory.goBack();
  };
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


APP.service('houseSolutionDetailService', ['$http', 'UrlService', function($http, UrlService) {
  this.getPageListDate = function (page,id,pageIndex,pageSize) {
  	if(page==1){
  		var params = {
  		channel:1,
  		productId:id,
  		pageIndex:pageIndex,
  		pageSize:pageSize
  	}
  	return $http.get(UrlService.getNewUrl('HOUSE_FROM_PRODETAIL'), params);
  	}else{
  		var params = {
  		channel:1,
  		id:id,
  		pageIndex:pageIndex,
  		pageSize:pageSize
  	}
  	return $http.get(UrlService.getNewUrl('HOUSE_LISTDETAIL'), params);
  	}
  }
}]);