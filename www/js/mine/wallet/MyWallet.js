/**
 * Created by jiangfeng on 2017/7/13.
 */
APP.controller('MyWalletController',['$scope','$state','MyWalletService','InAppBrowserService','UrlService','UserService','WhiteShowsService',function($scope,$state,MyWalletService,InAppBrowserService,UrlService,UserService,WhiteShowsService){

  /*变量定义*/
  $scope.walletInfo = [];//钱包信息
  /*方法定义*/
  function init(){
    MyWalletService.getWallet()
      .success(function (response) {
        if(response.success){
          $scope.walletInfo = response.data;
        }
      }).error(function (err) {
        alert('网速较慢，请稍候再试');
      })
     // 获取白条的状态
    WhiteShowsService.queryIousStatus({
      userId:UserService.getUser().ucId,
      token:UserService.getUser().accessToken
    }).success(function (response) {
      console.log(response);
      if(response.success){
        $scope.whiteShowsState = response.data.applyStatus;
        if ($scope.whiteShowsState == 1) {
          WhiteShowsService.queryAvaliAmt({
            token:UserService.getUser().accessToken
          }).success(function (response) {
            if (response.success) {
              $scope.crdComAmt = response.data.crdComAmt;
              $scope.crdComAvailAmt = response.data.crdComAvailAmt;
            };
          }).error(function (err) {
            alert('网速较慢，请稍候再试');
          })
        }
      }
    }).error(function (err) {
      alert('网速较慢，请稍候再试');
    })
  }


  $scope.toRules = function(ruleId,content){
    var u = navigator.userAgent;
    if (u.indexOf('iPhone') != -1) {
      var ref = InAppBrowserService.open(UrlService.getHead() + 'mstore/sg/helpDetail.html?id=' + ruleId,content);
    } else {
      $state.go('helpDetail', {'helpId': ruleId, 'content': content});
    }
  };
  $scope.$on('$ionicView.beforeEnter', function (event, data) {
    init();
  })
  $scope.toApplyForWhite = function (index) {
    if (index != 2) {
      // var redirectUrl = 'http://www.baidu.com';
      // WhiteShowsService.openApplyWhiteShows("https://testpm.haiercash.com/sgbt/#!/applyQuota/checkIdCard.html?token="+UserService.getUser().accessToken,'http://m.ehaier.com/#/applyForWhite');
      WhiteShowsService.applyForOpen({
        backUrl:window.location.href,
        userId:UserService.getUser().ucId,
        token:UserService.getUser().accessToken
      }).success(function (res) {
        console.log(res);
        if(res.success) {
          WhiteShowsService.openApplyWhiteShows(res.data.redirectUrl,window.location.href);
        }
      })
    } else {
      $state.go('applyForWhite');
    }
  }
}]);
APP.service('MyWalletService',['$http','UrlService',function($http,UrlService){
  this.getWallet = function () {
    return $http.get(UrlService.getUrl('GET_WALLET'));
  }
}]);
