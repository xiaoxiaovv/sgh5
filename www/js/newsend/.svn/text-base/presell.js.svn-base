APP.controller('presellCtrl', ['$scope', 'flashService', '$state', '$ionicHistory', '$interval', 'presellService', '$ionicScrollDelegate', '$rootScope', '$localstorage', 'UserService','HomePageService',function($scope, flashService, $state, $ionicHistory, $interval, presellService, $ionicScrollDelegate, $rootScope, $localstorage,UserService,HomePageService) {
	/*声明变量*/
	$scope.pageIndex = 1;
	$scope.hasmore = true;
	$scope.preselllist = [];
	$scope.storeId = 0;
	$scope.flag = false;
	$scope.flagNum = false;
	$scope.messageImgUrl = "http://cdn09.ehaier.com/shunguang/H5/www/img/message_gray@2x.png";
	/*返回页面*/
	$scope.goBack = function() {
		$ionicHistory.goBack();
	};
	$scope.init = function() {
		$scope.storeId = $localstorage.get('storeId',$rootScope.globalConstant.storeId);
		/*获取店铺id*/
		/*数据渲染*/
		$scope.loadMore = function() {
			presellService.getpres($scope.pageIndex).success(function(response) {
				if (response.data.length == 0) {
					$scope.hasmore = false;
					$scope.preselllist = $scope.preselllist.concat(response.data);
					$scope.$broadcast('scroll.infiniteScrollComplete');
				} else {
					$scope.hasmore = true;

					//

					/*if(response.data.isWd==true){
			        $scope.isWd=true;
			      }else{
			        $scope.isWd=false;
			      }*/
					$scope.preselllist = $scope.preselllist.concat(response.data);

					//
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}
			});
			$scope.pageIndex++;
		};
		HomePageService.getUnReadMsg()
        .success(function (res) {
          if (res.data > 0) {
            $scope.flagNum = true;
          } else {
            $scope.flagNum = false;
          }
        })
	}
	$scope.$on('$ionicView.beforeEnter', function() {
		$scope.init();
	});
	$scope.$on('$stateChangeSuccess', function() {
		$scope.loadMore();
	});
}]);
APP.service('presellService', ['$http', 'UrlService', 'flashService', '$interval', function($http, UrlService, flashService, $interval) {
	this.getpres = function(pageIndex) {
		//return $http.get(UrlService.getUrl('FLASH_TWO'));
		var params = {
			'pageIndex': pageIndex,
			'pageSize': 4
		}
		return $http.get(UrlService.getNewUrl('NEW_RES'), params);
	}
}])