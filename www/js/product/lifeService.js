APP.controller('lifeServiceController', ['$scope','$ionicHistory','HomePageService','$rootScope','$state','UrlService','PopupService', function($scope,$ionicHistory,HomePageService,$rootScope,$state,UrlService,PopupService){
	$scope.goToLivingCost = function () {

	}
	$scope.goToEMC = function () {
		if ($scope.isApp) {
        HomePageService.isWdHost()
          .success(function (res) {
            $rootScope.isWdHost = res.data.isHost;
            if (res.data.isHost == -1) {
              $state.go('login');
            } else {
              var access_token = UserService.getUser().accessToken;
              console.log(access_token);
              /*
               *调转视图方法
               * @param1 isOffical {Integer} （1:正式环境；0:测试环境）
               * @param2 access_token {String} 用户中心返回的access_token
               * @param3 entryPoint {String} 进入EMC后直接进入某功能，例如“OldforNew”,可传空字符串""
               */
              if (access_token) {
                window.emc.presentEmcView(UrlService.getEnviroment(), access_token, "");
              } else {
                PopupService.showToast('您当前账号暂无法访问此服务,请使用关联手机号登录。');
              }
            }
          })
      }
      else {
        PopupService.showToast('请去顺逛App查看此服务');
      }
	}
	$scope.goBack = function () {
		console.log(312321);
		$ionicHistory.goBack();
	}
}])