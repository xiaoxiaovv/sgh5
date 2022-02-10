APP.controller('walletIntCtrl', ['$scope','$state', '$ionicHistory', '$interval', 'walletIntService', '$ionicScrollDelegate', '$rootScope', '$localstorage','$stateParams', 'UserService','MyWalletService',function($scope, $state, $ionicHistory, $interval, walletIntService, $ionicScrollDelegate, $rootScope, $localstorage, $stateParams,UserService,MyWalletService) {
	/*变亮定义*/
	$scope.index = null;
	$scope.integetlist=[];
	$scope.pagenum1=1;
	$scope.hasmore = false;
	$scope.seashellPoint='';
	$scope.seashellPointAmt='';
	$scope.userId = UserService.getUser().mid;
	/*返回页面*/
	$scope.goBack = function() {
		$ionicHistory.goBack();
	};
	$scope.init = function() {
			$ionicScrollDelegate.scrollTop();
			/*获取总数*/
			MyWalletService.getWallet().success(function(res){
				$scope.seashellPoint=res.data.seashellPoint;
				$scope.seashellPointAmt=res.data.seashellPointAmt;
			}).error(function(){

			});
			/*数据渲染(全部)*/
			$scope.pagenum1=1;
			$scope.hasmore = true;
			walletIntService.getWalletDetail($scope.userId,$scope.pagenum1,null).success(function(res){
				$scope.integetlist = res.data.paymentList;
			});
		}
		/*点击切换样式和数据*/
	$scope.changelist = function(item) {
		$scope.integetlist=[];
		$ionicScrollDelegate.scrollTop();
		$scope.hasmore = true;
		$scope.index = item;
		$scope.pagenum1=1;
		walletIntService.getWalletDetail($scope.userId,$scope.pagenum1,item).success(function(res){
				$scope.integetlist = res.data.paymentList;
				console.log(res)
		});
	}
	$scope.loadMore=function(){
			$scope.pagenum1++;
			walletIntService.getWalletDetail($scope.userId,$scope.pagenum1,$scope.index).success(function(response){
					$scope.integetlist = $scope.integetlist.concat(response.data.paymentList);
					$scope.$broadcast('scroll.infiniteScrollComplete');
					$scope.hasmore = !($scope.integetlist.length==response.data.totalCount);	
			})
		}
	$scope.$on('$ionicView.beforeEnter', function() {
		$scope.index = null;
		$scope.init();
	});
}]);
APP.service('walletIntService', ['$http', 'UrlService', '$interval', function($http, UrlService, $interval) {
	this.getWalletDetail = function (memberId,num,item) {
		var params1={
			'memberId':memberId,
			'benefitType':'seashell',
			'transType':item,
			'pageNo':num,
			'pageSize':10
		};
		var params2={
			'memberId':memberId,
			'benefitType':'seashell',
			'pageNo':num,
			'pageSize':10
		};
		if(item==null){
			return $http.get(UrlService.getUrl('GET_WALLETDETAIL'),params2);
		}else{
			return $http.get(UrlService.getUrl('GET_WALLETDETAIL'),params1);
		}
  	}
}])