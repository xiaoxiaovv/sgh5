APP.controller('homeDesignsthController', ['$ionicActionSheet','$scope', '$rootScope', 'UrlService', 'CreditService', 'homeDesignsthService', '$localstorage', '$ionicSlideBoxDelegate', '$ionicPopup', 'PopupService', 'BannerThemeService', 'GoodsService','CommonAddressService','$ionicModal', function($ionicActionSheet,$scope, $rootScope, UrlService, CreditService, homeDesignsthService, $localstorage, $ionicSlideBoxDelegate, $ionicPopup, PopupService, BannerThemeService, GoodsService,CommonAddressService,$ionicModal) {
		$scope.filtertag = [];
		$scope.all = [];
		$scope.anliproIds = '';
		$scope.pageIndex = 1;
		$scope.pageSize = 3;
		$scope.dataList = [];
		$scope.hasmore = true;
		$scope.init = function(){
			$scope.pageIndex = 1;
		$scope.pageSize = 3;
		$scope.dataList = [];
		$scope.hasmore = true;
		$scope.anliproIds='';
			homeDesignsthService.getfiltertag().success(function(res){
				$scope.filtertag = res.data;
				console.log(res);
				for(var i = 0;i<$scope.filtertag.length;i++){
					$scope.all[i] = true;
				}
			});
			$scope.loadmore = function(){
			      homeDesignsthService.getdata($scope.anliproIds,$scope.pageIndex,$scope.pageSize).success(function(res){
			      console.log(res);
			      if (res.data.length == 0) {
			          $scope.hasmore = false;
			          $scope.dataList = $scope.dataList.concat(res.data);
			          $scope.$broadcast('scroll.infiniteScrollComplete');
			        } else {
			          $scope.hasmore = true;
			          $scope.dataList = $scope.dataList.concat(res.data);

			          //
			          $scope.$broadcast('scroll.infiniteScrollComplete');
			        }
			    })
			      $scope.pageIndex++;
			    }			
		}
		$scope.openFilterModal = function () {
    		$scope.filterModal.show();
    
  		};
  		//选择某个标签
  		$scope.choosetype = function(i,item,outerIndex){
  			for(var j = 0;j<item.labels.length;j++){
  				item.labels[j].chooseFlag = false;
  			}
  			i.chooseFlag = true;
  			$scope.all[outerIndex] = false;
  		}
  		//某个类别选全部
  		$scope.chooseAll = function(index,item){
  			$scope.all[index] = true;
  			for(var j = 0;j<item.labels.length;j++){
  				item.labels[j].chooseFlag = false;
  			}
  		}
  		$scope.resetFilter = function(){
  			for(var i = 0;i<$scope.filtertag.length;i++){
					$scope.all[i] = true;
					for(var j = 0;j<$scope.filtertag[i].labels.length;j++){
						$scope.filtertag[i].labels[j].chooseFlag = false;
					}
				}
  		}
  		//点击确定
  		$scope.filterEnsure = function(){
  			$scope.anliproIds ='';
  			$scope.pageIndex = 1;
  			$scope.dataList = [];
  			for(var i = 0;i<$scope.filtertag.length;i++){
					for(var j = 0;j<$scope.filtertag[i].labels.length;j++){
						if($scope.filtertag[i].labels[j].chooseFlag==true){
							$scope.anliproIds+=($scope.filtertag[i].labels[j].id+',')
						}
					}
				}
				if($scope.anliproIds){
					$scope.anliproIds = $scope.anliproIds.slice(0,$scope.anliproIds.length-1);
				}
				console.log($scope.anliproIds);
				homeDesignsthService.getdata($scope.anliproIds,$scope.pageIndex,$scope.pageSize).success(function(res){
				console.log(res);
				$scope.dataList = res.data;
			});
			$scope.filterModal.hide();
  		}
		//筛选modal
	  $ionicModal.fromTemplateUrl('templates/product/homedesModal.html', {
	    scope: $scope,
	    animation: 'slide-in-left',
	    backdropClickToClose: true
	  }).then(function (modal) {
	    $scope.filterModal = modal;
	  });
	  	
	 $scope.$on('$ionicView.beforeEnter', function(event, v) {
    if (v.direction == 'back'){
      
    }else{
      $scope.init();
    }  
  });
	 $scope.$on('$destroy', function () {
    $scope.filterModal.remove();
  });
	 $scope.$on('$stateChangeSuccess', function() {
    $scope.loadmore();
  });
}]);


APP.service('homeDesignsthService', ['$http', 'UrlService', function($http, UrlService) {
  	this.getfiltertag = function(){
  		return $http.get(UrlService.getNewUrl('FILTER_TAG'));
  	};
  	this.getdata = function(ids,pageIndex,pageSize){
  		var params = {
  			ids:ids,
  			pageIndex:pageIndex,
  			pageSize:pageSize,
  		}
  		return $http.get(UrlService.getNewUrl('FILTER_PRODUCTLIST'),params);
  	}


}]);