APP.controller('exStoreDetailController', ['$ionicActionSheet','$scope', '$rootScope', 'UrlService', 'CreditService', 'exStoreDetailService', '$localstorage', '$ionicSlideBoxDelegate', '$ionicPopup', 'PopupService', 'BannerThemeService', 'GoodsService','CommonAddressService', '$stateParams',function($ionicActionSheet,$scope, $rootScope, UrlService, CreditService, exStoreDetailService, $localstorage, $ionicSlideBoxDelegate, $ionicPopup, PopupService, BannerThemeService, GoodsService,CommonAddressService,$stateParams) {
	$scope.pageData = {};
	$scope.name = '体验店';
	$scope.nearbyId = $stateParams.nearbyId;
	if($rootScope.globalConstant.positionStatus == true){
		$scope.cityId = CommonAddressService.getAddressInfo().cityId+'';
	}else{
		$scope.cityId = 173;//青岛
	}
		$scope.init = function(){
			$scope.pageData = {};
			$scope.name = '体验店';
				exStoreDetailService.getstore($scope.nearbyId,$rootScope.globalConstant.lat,$rootScope.globalConstant.lon).success(function(res){
					console.log(res);
					$scope.pageData = res.data;
					$scope.name = $scope.pageData.name;
					//$scope.pageData.latitude//维度 $scope.pageData.longitude//经度 $scope.pageData.name
					$ionicSlideBoxDelegate.update();
          			$ionicSlideBoxDelegate.$getByHandle("exStoreDetail_slide").loop(true);
			})		
	}
		$scope.callphone = function(){
			if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) { //只有ios app 特有的样式
		            window.open('tel:' + $scope.pageData.mobile, '_system');
		            return;
		          } 
			var confirmPopup = $ionicPopup.confirm({
				cssClass:'extorecall',
		        template: $scope.pageData.mobile,
		        cancelText: '取消',
		        okText: '呼叫'
		      });
		      confirmPopup.then(function (res) {
		        if (res) {
		          if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) { //只有ios app 特有的样式
		            window.open('tel:' + $scope.pageData.mobile, '_system');
		          } else {
		            window.open('tel:' + $scope.pageData.mobile);
		          }
		        } else {
		          console.log('You are not sure');
		        }
		      });
		}
		$scope.openmap = function(){
			// 显示操作表
			if(ionic.Platform.platform().indexOf('ios') != -1 && window.cordova){//ios app
				$ionicActionSheet.show({
		     	buttons: [
		       { text: '高德地图' },
		       { text: '百度地图' },
		       { text: 'Apple 地图' },
		     ],
		     cancelText: '取消',
		     buttonClicked: function(index) {
		       switch(index)
		       {
		       		case 0://高德三端统一
		       		window.emc.presentH5View(encodeURI('http://uri.amap.com/marker?position='+$scope.pageData.longitude+','+$scope.pageData.latitude+'&name='+$scope.pageData.name+'&coordinate=gaode&callnative=0'),'高德地图')
		       		break;
		       		case 1:
		       		window.emc.presentH5View(encodeURI('http://api.map.baidu.com/geocoder?address='+$scope.pageData.address+'&output=html&src=顺逛微店'),'百度地图')
		       		break;
		       		case 2:
		       		window.location.href=encodeURI('http://maps.apple.com/?q='+$scope.pageData.name+'&sll='+$scope.pageData.longitude+','+$scope.pageData.latitude+'&z=10&t=s');
		       		break;
		       }
		     }
		   });
		}else{
			$ionicActionSheet.show({// 安卓app web
		     buttons: [
		       { text: '高德地图' },
		       { text: '百度地图' },
		     ],
		     cancelText: '取消',
		     buttonClicked: function(index) {
		       switch(index)
		       {
		       		case 0://高德三端统一
		       		if(window.cordova){
		       			window.emc.presentH5View('http://uri.amap.com/marker?position='+$scope.pageData.longitude+','+$scope.pageData.latitude+'&name='+$scope.pageData.name+'&coordinate=gaode&callnative=0','高德地图')
		       		}else{
		       			window.open('http://uri.amap.com/marker?position='+$scope.pageData.longitude+','+$scope.pageData.latitude+'&name='+$scope.pageData.name+'&coordinate=gaode&callnative=0','_blank', 'location=yes')
		       		}
		       		break;
		       		case 1://百度
		       		if(window.cordova){
		       			window.emc.presentH5View('http://api.map.baidu.com/geocoder?address='+$scope.pageData.address+'&output=html&src=顺逛微店','百度地图')
		       		}else{
		       			window.open('http://api.map.baidu.com/geocoder?address='+$scope.pageData.address+'&output=html&src=顺逛微店','_blank')
		       		}
		       		break;
		       }
		     }
		   });
		}   
	}
	 $scope.$on('$ionicView.beforeEnter', function(event, v) {
    if (v.direction == 'back'){
      
    }else{
      $scope.init();
    }  
  });
}]);


APP.service('exStoreDetailService', ['$http', 'UrlService', function($http, UrlService) {
  	this.getstore = function(nearbyId,latitude,longitude){
  		var params = {
  			nearbyId:nearbyId,
  			latitude:latitude,
  			longitude:longitude
  		}
  		return $http.get(UrlService.getNewUrl('TEST_STORE_DETAIL'), params);
  	}



}]);