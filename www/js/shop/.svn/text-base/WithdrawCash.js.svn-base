/**
 * creator:feng.jiang@dhc.com.cn
 * create time:16/3/17
 * describe：WithdrawCashController  提现控制器
 **/
APP.controller('WithdrawCashController', ['$scope','$stateParams','WithdrawCashService','PopupService','$timeout','$ionicHistory','$state','InAppBrowserService','UrlService',
  function ($scope,$stateParams,WithdrawCashService,PopupService,$timeout,$ionicHistory,$state,InAppBrowserService,UrlService) {

    $scope.canAmount = '';//可提现金额
    $scope.account = '';
    $scope.canGetCash = false;
    $scope.loadFinish = false;

    $scope.init = function () {
      $scope.canGetCash = false;
      if ($stateParams.canAmount) {
        $scope.canAmount = $stateParams.canAmount;
      } else {
        $scope.canAmount = 0;
      }
      if($scope.canAmount>0)
      {
        $scope.canGetCash = true;
      }
      $scope.loadFinish = false;
      WithdrawCashService.getMessage()
        .success(function (response, status, headers, config) {
          if (response.success) {
            if (response.data.kjtAccount) {
              $scope.loadFinish = true;
              $scope.account = response.data.kjtAccount.memberKjtpayAccount;
            }
          } else {
            PopupService.showToast(response.message);
            $scope.loadFinish = false;
          }
        })
    };

    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.init();
    });

    $scope.getCashNow = function(){
      WithdrawCashService.getCash($scope.account)
        .success(function (response, status, headers, config) {
          if (response.success) {
            $state.go('withdrawSuccess',{content:response.data.result});
          } else {
            PopupService.showToast(response.message);
          }
        })
    };

    $scope.toRules = function(ruleId,content){
      var u = navigator.userAgent;
      if (u.indexOf('iPhone') != -1) {
        var ref = InAppBrowserService.open(UrlService.getHead() + 'mstore/sg/helpDetail.html?id=' + ruleId,content);
      } else {
        $state.go('helpDetail', {'helpId': ruleId, 'content': content});
      }
    }
}]);
/**
 * creater:zhiqiang.zhao@dhc.com.cn
 * create time:2016-4-29
 * describe：EasyConnectService服务
 **/
APP.service('WithdrawCashService', ['$http', 'UrlService', function ($http, UrlService) {

  //获取绑定信息
  this.getMessage = function () {
    return $http.get(UrlService.getUrl('EASYCONNECT_INIT'));
  };

  this.getCash = function (account) {
    var params = {
      kjtAccount:account
    };
    return $http.get(UrlService.getUrl('NEW_GETCASH_INIT'),params);// darcywang modified
  };

}]);
