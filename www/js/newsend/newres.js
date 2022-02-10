APP.controller('newresCtrl', ['$stateParams','$scope', 'flashService', '$state', '$ionicHistory', '$interval', 'newresService', '$ionicScrollDelegate', '$rootScope', '$localstorage','GoodsService','UserService','$ionicLoading','HomePageService',function($stateParams,$scope, flashService, $state, $ionicHistory, $interval, newresService, $ionicScrollDelegate, $rootScope, $localstorage, GoodsService,UserService,$ionicLoading,HomePageService) {
	/*声明变量*/
  $scope.typeNumber = $stateParams.type;
  $scope.typeNumber = $scope.typeNumber==2 ? 2:1;
	$scope.showtime = 0;
	$scope.pageIndex = 1;
	$scope.newprodlist = [];
	$scope.hasmore = true;
	$scope.isWd = false;
	$scope.storeId = 0;
	$scope.flag = false;
	$scope.flagNum = false;
	$scope.messageImgUrl = "http://cdn09.ehaier.com/shunguang/H5/www/img/message_gray@2x.png";
	var timer = [];
	var remindArray = [];
	var countDownNowTime = [];
	var countDownendTime = [];
	var timerLength = '';
	var nowT = new Date().getTime();
	// 倒计时定义
	$scope.endT = [];
	$scope.endTt = [];
	$scope.endTh = [];
	$scope.endTm = [];
	$scope.endTs = [];
	$scope.Timetotal = [];
	/*地址信息存放*/
	  $scope.provinceId=0;
	  $scope.cityId=0;
	  $scope.districtId=0;
	  $scope.streetId=0;
	  $scope.isCommission=$rootScope.isCommission;
	/*方法*/
	$scope.init = function() {
		$scope.storeId = $localstorage.get('storeId',$rootScope.globalConstant.storeId);
		/*地址信息*/
      GoodsService.getAddress().success(function(response) {
          var obj = eval(response.data);
          $scope.provinceId = obj[0].provinceId;
          $scope.cityId = obj[0].cityId;
          $scope.districtId = obj[0].areaId;
          $scope.streetId = obj[0].streetId;
          newresService.getnewProd($scope.pageIndex,$scope.provinceId,$scope.cityId,$scope.districtId,$scope.streetId,$scope.typeNumber).success(function(response,status) {
				$scope.flag = true;
					timerLength = remindArray.length;
					remindArray = [];
					if (response.data.isWd == true) {
			            $scope.isWd = true;
			          } else {
			            $scope.isWd = false;
			          }
					$scope.newprodlist =response.data.acReserveList;
					console.log($scope.newprodlist)
					for (var a = 0; a < $scope.newprodlist.length; a++) {
						remindArray.push(a);
						countDownNowTime[a] = parseInt(nowT / 1000);
						countDownendTime[a] = parseInt(($scope.newprodlist[a].reserveEndTime) / 1000);
					}
					for (var i = timerLength; i < remindArray.length; i++) {
						countDown(countDownNowTime[remindArray[i]], countDownendTime[remindArray[i]], remindArray[i]);
					}
			});
        })
	      HomePageService.getUnReadMsg()
	        .success(function (res) {
	          if (res.data > 0) {
	            $scope.flagNum = true;
	          } else {
	            $scope.flagNum = false;
	          }
	        })
		/*获取店铺id*/
		/*数据渲染*/
		}
		$scope.loadMore = function() {
		$scope.pageIndex++;
			newresService.getnewProd($scope.pageIndex,$scope.provinceId,$scope.cityId,$scope.districtId,$scope.streetId,$scope.typeNumber).success(function(response,status) {
				console.log(response);
				$scope.flag = true;
				if (response.data.acReserveList.length == 0) {
					$scope.hasmore = false;
					$scope.newprodlist = $scope.newprodlist.concat(response.data.acReserveList);
					$scope.$broadcast('scroll.infiniteScrollComplete');
				} else {
					$scope.hasmore = true;
					timerLength = remindArray.length;
					remindArray = [];
					if (response.data.isWd == true) {
			            $scope.isWd = true;
			            $scope.storeId = UserService.getUser().mid;
			          } else {
			            var sgWeidianMid = 20219251;
			            $scope.storeId = $localstorage.get('storeId', sgWeidianMid);
			            $scope.isWd = false;
			          }
					$scope.newprodlist = $scope.newprodlist.concat(response.data.acReserveList);
					console.log(response);

					for (var a = 0; a < $scope.newprodlist.length; a++) {
						remindArray.push(a);
						countDownNowTime[a] = parseInt(nowT / 1000);
						countDownendTime[a] = parseInt(($scope.newprodlist[a].reserveEndTime) / 1000);
					}
					for (var i = timerLength; i < remindArray.length; i++) {

						countDown(countDownNowTime[remindArray[i]], countDownendTime[remindArray[i]], remindArray[i]);
					}
					//
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}
				/*countdown();*/
			});
		};
	// 格式化
	function Format(a) {
		if (a < 10) {
			a = '0' + a;
		} else {
			a = a;
		}
		return a;
	};
	//  倒计时方法
	function countDown(nowtime, endtime, index) {

		$scope.endT[index] = endtime - nowtime;
		timer[index] = $interval(function() {
			$scope.endTt[index] = Math.floor($scope.endT[index] / 86400);

			$scope.endTh[index] = Format(Math.floor(($scope.endT[index] - $scope.endTt[index] * 86400) / 3600));

			$scope.endTm[index] = Format(Math.floor(($scope.endT[index] - $scope.endTt[index] * 86400 - $scope.endTh[index] * 3600) / 60));

			$scope.endTs[index] = Format($scope.endT[index] - $scope.endTt[index] * 86400 - $scope.endTh[index] * 3600 - $scope.endTm[index] * 60);
			$scope.endT[index]--;
			$scope.Timetotal[index] = $scope.endTt[index] +'天'+$scope.endTh[index]+':'+$scope.endTm[index]+':'+$scope.endTs[index];
			if ($scope.endT[index] == -1) {
				$state.reload();
				$interval.cancel(timer[index]);
			}
		}, 1000);
	}
	/*请求数据*/
	//newresService.getnewProd().success(function(response){
	//console.log(response.data.acReserveList);
	/*$scope.newprodlist=response.data.acReserveList;*/
	//})

	$scope.$on('$ionicView.beforeEnter', function() {
		$scope.init();
	});
	/*返回页面*/
	$scope.goBack = function() {
		/*清除计时器*/
		for (var i = 0; i < remindArray.length; i++) {
			$interval.cancel(timer[remindArray[i]]);
		}
		remindArray = [];
		$ionicHistory.goBack();
	};
}]);
APP.service('newresService', ['$http', 'UrlService', 'flashService', '$interval', function($http, UrlService, flashService, $interval) {
	this.getnewProd = function(pageIndex,provinceId,cityId,districtId,streetId,from) {
		var params = {
			'provinceId': provinceId,
			'cityId': cityId,
			'districtId': districtId,
			'streetId': streetId,
			'pageIndex': pageIndex,
      'from':from
		}
		return $http.get(UrlService.getNewUrl('NEW_SEND'), params);
	}
}])
