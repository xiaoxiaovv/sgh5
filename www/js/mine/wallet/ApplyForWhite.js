APP.controller('ApplyForWhiteController',['$scope','InAppBrowserService','UrlService','$rootScope','InAppBrowserService','ManageMoneyService', 'WhiteShowsService','UserService', function ($scope,InAppBrowserService,UrlService,$rootScope,InAppBrowserService,ManageMoneyService,WhiteShowsService,UserService){
	$scope.toHelp = function(ruleId,content){
	    var u = navigator.userAgent;
	    if (u.indexOf('iPhone') != -1) {
	      var ref = InAppBrowserService.open(UrlService.getHead() + 'mstore/sg/helpDetail.html?id=' + ruleId,content);
	    } else {
	      $state.go('helpDetail', {'helpId': ruleId, 'content': content});
	    }
	}
	$scope.goBack = function () {
		$scope.$ionicGoBack();
	}
	$scope.applyToWihte = function () {
		console.log(window.location.href);
		WhiteShowsService.applyForOpen({
			backUrl:window.location.href,
			userId:UserService.getUser().ucId,
			token:UserService.getUser().accessToken
		}).success(function (res) {
			console.log(res);
			if(res.success) {
				WhiteShowsService.openApplyWhiteShows(res.data.redirectUrl,'http://m.ehaier.com/#/applyForWhite');
			}
		})
	}
}]);

APP.service('WhiteShowsService', ['InAppBrowserService', 'UrlService','$http',function (InAppBrowserService, UrlService,$http){
	this.applyForOpen = function (params) {
		return $http({
	      method: 'POST',
	      url: UrlService.getNewUrl('WHITE_SHOWS_APPLY'),
	      params: params
	    });
	}
	this.queryAvaliAmt = function (params) {
		return $http({
	      method: 'POST',
	      url: UrlService.getNewUrl('WHITE_SHOWS_QUERY_AVALIAMT'),
	      params: params
	    });
	}
	this.payApply = function (params) {
		return $http({
	      method: 'POST',
	      url: UrlService.getNewUrl('WHITE_SHOWS_PAY'),
	      params: params
	    });
	}
	this.queryIousStatus = function (params) {
		return $http({
	      method: 'POST',
	      url: UrlService.getNewUrl('WHITE_SHOWS_QUERY_STATUS'),
	      params: params
	    });
	}
	this.cost = function (params) {
		return $http({
	      method: 'POST',
	      url: UrlService.getNewUrl('WHITE_SHOWS_COST'),
	      params: params
	    });
	}
	this.openApplyWhiteShows = function (url,callBackUrl) {

	    if(window.cordova){
	    	window.emc.presentH5View(url,'顺逛白条');
	        // var whiteShowsRef = null;
	        // console.log(url, callBackUrl);
	        // whiteShowsRef = InAppBrowserService.open(url);
	        // whiteShowsRef.addEventListener('loadstart', function (event) {
	        //   if (event.url.indexOf(callBackUrl) != -1) {
	        //     whiteShowsRef.close();
	        //   }
	        // });
      	}else{
       		window.location.href = url;
      	}
	}
}]);