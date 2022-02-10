/**
 * Created by zyr on 2017/11/17
 */
APP.controller('signInChartController',['$scope', '$rootScope', '$state', '$stateParams', '$ionicScrollDelegate','signInChartService','UserService','personalHomepageMeService',function($scope, $rootScope, $state, $stateParams, $ionicScrollDelegate, signInChartService, UserService,personalHomepageMeService){
	//变量
  if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {
    //只有ios app 特有的样式
    $scope.paddingtopClass = {
      "padding-top": "30px"
    };
  } else {
    $scope.paddingtopClass = {
      "padding-top": "14px"
    };
  }
	$scope.goBack = function(){
		$scope.$ionicGoBack();
	}
  $scope.init = function() {
    // $scope.signListData = [
    //   {"name":"第一","shenfen":"圈主","day":"4"},
    //   {"name":"第二","shenfen":"管理员","day":"3"},
    //   {"name":"第三","shenfen":"成员1","day":"2"},
    //   {"name":"第四","shenfen":"成员2","day":"2"}
    // ]
    $scope.topicId = $stateParams.topicId;
    //签到类型 (目前固定值2)
    $scope.signType = 2;
    //自己的圈子排名
    $scope.myCircleRankType = 1;
    //圈子(所有)排名
    $scope.allCircleRankType = 2;
    //自己的社区排名
    $scope.myCommunityRankType = 3;
    //社区(所有)排名
    $scope.allCommunityRankType = 4;
    //默认请求 自己的圈子排名情况
    $scope.getCircleChartFun($scope.myCircleRankType,$scope.signType,$scope.topicId);
    //默认请求圈子(所有)排名
    $scope.getCircleChartFun($scope.allCircleRankType,$scope.signType,$scope.topicId);
  }
  $scope.getCircleChartFun = function(rankType, signType, topicId) {
    var params = {
      rankType: rankType,
      signType: signType,
      topicId: topicId
    }
    signInChartService.CurrentCircleChart(params).success(function(res) {
      if (res.success) {
        if (params.rankType == 1||params.rankType == 3) {
          //用户签到天数
          $scope.userSignCount = res.data.rank[0].signCount;
          //用户签到排名
          $scope.userRank = res.data.rank[0].rank;
        } else if(params.rankType == 2||params.rankType == 4) {
          $scope.rankList = res.data.rank;
        }
      }
    })
  }
  $scope.$on('$ionicView.beforeEnter', function (e,v) {
      if (v.direction == 'back') {
        return;
      }
      $ionicScrollDelegate.scrollTop();
      //默认选中 本圈签到排行
      $scope.tabIndex = 0;
      $scope.signListTitle = '圈子';
      $scope.init();
  });
  $scope.chooseTab = function(index) {
    $scope.tabIndex = index;
    if (index == 0) {
      //请求圈子个人排名信息
      $scope.getCircleChartFun($scope.myCircleRankType,$scope.signType,$scope.topicId);
      //默认请求圈子(所有)排名
      $scope.getCircleChartFun($scope.allCircleRankType,$scope.signType,$scope.topicId);
      $scope.signListTitle = '圈子';
    } else {
      //请求社区个人排名信息
      $scope.getCircleChartFun($scope.myCommunityRankType,$scope.signType,$scope.topicId);
      //默认请求社区(所有)排名
      $scope.getCircleChartFun($scope.allCommunityRankType,$scope.signType,$scope.topicId);
      $scope.signListTitle = '社区';
    }
  }
}]);



APP.service('signInChartService', ['$http', 'UrlService', function ($http, UrlService) {
  //本圈签到排行榜
  this.CurrentCircleChart = function(params) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('CIRCLE_SIGN_CHART'),
      data: params
    })
  };
  //获取用户信息方法
  this.getUserData = function (type, userId) {
    var postData = {
      type: type,
      id: userId
    };
    return $http({
      method: 'post',
      url: UrlService.getUrl('USER_SIMPLE_INFO'),
      data: postData
    });
    //return $http.get("data/userInfo.json", {});
  };
  //我的圈子接口
  this.getMyTopics = function (pageNumber, pageSize, userId) {
    return $http({
      method: 'post',
      url: UrlService.getUrl('GETMYTOPICLIST'),
      data: {
        pageIndex: pageNumber,
        pageSize: pageSize,
        userId: userId
      }
    });
  };

}]);
