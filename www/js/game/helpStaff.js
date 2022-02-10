APP.controller('helpStaffController', ['$scope', '$state', 'helpStaffService', '$localstorage', '$stateParams','$ionicPopup','PopupService', function($scope, $state, helpStaffService, $localstorage, $stateParams, $ionicPopup,PopupService) {
  if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) { //只有ios app 特有的样式
    $scope.paddingtopClass = {
      "margin-top": "16px"
    };
    $scope.paddingtopClasscontent = {
      "top": "60px"
    }
  } else {
    $scope.paddingtopClass = {
      "margin-top": "0px"
    };
    $scope.paddingtopClasscontent = {
      "top": "44px"
    }
  }
  /*变亮定义*/
  $scope.memberId = $stateParams.memberId;
	$scope.gameId = $stateParams.gameId;
  $scope.numberInit = '';
  var needPerChance;
  $scope.init = function() {
		helpStaffService.gameHellpInit($scope.gameId,$scope.memberId)
			.success(function (response, status, headers, config) {
				if (response.success == true) {
          needPerChance = response.data.helpNum;
					$scope.number = response.data.helpedNum;
					$scope.numberInit = response.data;
          if (($scope.number) == needPerChance) {
            $scope.numberColor = '34%';
            $scope.renshuColor = '27.8%';
          } else if (($scope.number) == needPerChance*2) {
            $scope.numberColor = '66.5%';
            $scope.renshuColor = '60.3%';
          } else if (($scope.number) >= needPerChance*3) {
            $scope.numberColor = '100%';
            $scope.renshuColor = '93.8%';
          } else {
            $scope.numberColor = ($scope.number) * (100 / (3 * needPerChance)) + '%';
            $scope.renshuColor = (($scope.number) * (100 / (3* needPerChance)) - 6.2) + '%';
          }
				} else {
					PopupService.showToast(response.message);
				}
			});
  }
  $scope.zhuli = function() {
		helpStaffService.gameHellp($scope.gameId,$scope.memberId,$scope.channel)
			.success(function (response, status, headers, config) {
				if (response.success == true) {
					$scope.showBg = true;
					$scope.codeNum = response.code;
          $scope.init();
          // if($scope.codeNum == 200){
          //   $scope.init();
          //   $scope.number += 1;
          //   if (($scope.number) == needPerChance) {
          //     $scope.numberColor = '34%';
          //     $scope.renshuColor = '27.8%';
          //   } else if (($scope.number) == needPerChance*2) {
          //     $scope.numberColor = '66.5%';
          //     $scope.renshuColor = '60.3%';
          //   } else if (($scope.number) >= needPerChance*3) {
          //     $scope.numberColor = '100%';
          //     $scope.renshuColor = '93.8%';
          //   } else {
          //     $scope.numberColor = ($scope.number) * (100 / (3 * needPerChance)) + '%';
          //     $scope.renshuColor = (($scope.number) * (100 / (3* needPerChance)) - 6.2) + '%';
          //   }
          // }
				} else {
          if(response.message){
            PopupService.showToast(response.message);            
          }
				}
			});
  }
  $scope.closeShow = function() {
    $scope.showBg = false;
  }
  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.showBg = false;
    $scope.codeNum = '';
		$scope.memberId = $stateParams.memberId;
		$scope.gameId = $stateParams.gameId;
		$scope.channel = $stateParams.channel;
    $scope.init();
  });
}]);
APP.service('helpStaffService', ['$http', 'UrlService', function($http, UrlService) {
  this.gameHellp = function(gameId, memberId, channel) {
    var params = {
      'gameId': gameId,
      'memberId': memberId,
      'channel': channel
    };
    return $http.get(UrlService.getGameUrl('GAME_HELLP'), params);
  };
  this.gameHellpInit = function(gameId, memberId) {
    var params = {
      'gameId': gameId,
      'memberId': memberId
    };
    return $http.get(UrlService.getGameUrl('GAME_HELLP_INIT'), params);
  };
}])
