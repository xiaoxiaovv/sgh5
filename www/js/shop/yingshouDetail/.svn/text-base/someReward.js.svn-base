APP.controller('someRewardController', ['$scope', '$stateParams', 'UrlService','$ionicPopup','monthRewardService',
  function ($scope, $stateParams, Urlservice,$ionicPopup,monthRewardService) {
  	$scope.title = $stateParams.title;
    $scope.type = $stateParams.code;
    $scope.earningType = $stateParams.earningType;
    $scope.rewardType = $stateParams.rewardType;
    $scope.someList = [];
    $scope.someDetail = {};
  	var myPopup;
  	var page = 0,
      pageSize = 10,
      reType;
      $scope.init = function(){
      	reType = 'reward'+$scope.rewardType;
        monthRewardService.getRevenueList($scope.earningType, $scope.type, $scope.rewardType, page, pageSize).success(function(response){
        	console.log(response);
        	if(response.data[reType] instanceof Array){
        		$scope.someList = response.data[reType];
        	}else{
        		$scope.someList = [];
        		$scope.someList.push(response.data[reType]);
        	};
    });
      }
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.init();
    });
  		$scope.lookReward = function(i){
  			$scope.someDetail = i;
  			myPopup = $ionicPopup.show({
    					  cssClass:'xvv-popupSome',
                          template: '<div class="xvv-some"><div>抵扣金额</div><p class="radiubox"><i></i><span></span><span></span></p><div class="xvv-overflow"><div class="xvv-det" ng-repeat="item in someDetail.sgDeductionDetails"><div><p>此单抵扣<span>{{item.deductibleAmount|currency:"&yen"}}</span></p><p>抵扣单号<span>{{item.reverseNetSn}}</span></p><p>抵扣类型<span>{{item.deductibleType}}<span></p></div></div></div><div ng-click="closesome()">确定</div></div>',
                          scope: $scope
                          
                        }) 
  		}
  		$scope.closesome = function(){
  			myPopup.close();
  		}
  		$scope.goBack=function(){
  		$scope.$ionicGoBack();
  	}
  }]);