/**
 * creater:zhiqiang.zhao@dhc.com.cn
 * create time:2016/3/16
 * describe：Mine 测试控制器
 **/
APP.controller('MineController', ['$scope', '$timeout', 'UserService','ShopService', 'PlatformService','MESSAGECENTERService','CreditService','$state',
  function ($scope, $timeout, UserService,ShopService, PlatformService,MESSAGECENTERService,CreditService,$state) {
    /** 变量声明 **/
    $scope.tabNav = 'mine';
    $scope.account = '';
    $scope.flagNum=false;
    $scope.goMemberCenter = function(){
      CreditService.getGameId(function(gameId){
        $state.go('vip',{gameId:gameId});
      });
    };

    // $scope.account1 = 'dsajfsagfjsakhfks99395395nfjds388395yfdsjf';
    // $scope.accreditation = '';
    // if($scope.account1.length > 20){
    //   $scope.account1 = $scope.account1.slice(0,20) + '...';
    //   console.log($scope.account1);
    //   console.log($scope.account1.length);
    // }
    /** 方法 **/
    $scope.goToScore = function () {
      var u = navigator.userAgent;
      if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
        if (PlatformService.getPlatform() == 'APP') {
          window.open = cordova.InAppBrowser.open('http://app.qq.com/#id=detail&appid=1104761357', '_system', 'location=yes');
        } else {
          window.open('http://app.qq.com/#id=detail&appid=1104761357');
        }
      } else if (u.indexOf('iPhone') > -1) {
        if (PlatformService.getPlatform() == 'APP') {
          window.open = cordova.InAppBrowser.open('https://itunes.apple.com/cn/app/shun-guang-wei-dian/id1035160364?mt=8', '_system', 'location=yes');
        } else {
          window.open('https://itunes.apple.com/cn/app/shun-guang-wei-dian/id1035160364?mt=8');
        }
      } else {
        if (PlatformService.getPlatform() == 'APP') {
          window.open = cordova.InAppBrowser.open('http://app.qq.com/#id=detail&appid=1104761357', '_system', 'location=yes');
        } else {
          window.open('http://app.qq.com/#id=detail&appid=1104761357');
        }
      }
    };
    $scope.init = function () {
      //未读消息数量和最新消息
      ShopService.getMessage()
        .success(function(response){
          if(response.data.count>0){
            $scope.flagNum=true;
          }else{
            $scope.flagNum=false;
          }
        })
      var array = [];
      for (var i = 0; i < UserService.getUser().userName.length; i++) {
        if (i >= 3 && i <= 6) {
          array[i] = '*';
        } else {
          array[i] = UserService.getUser().userName[i];
        }
      }
      $scope.account = '';
      for (var j = 0; j < array.length; j++) {
        $scope.account = $scope.account + array[j];
      }

      // xyz添加超出字符串长度加三个点
      if($scope.account.length > 20){
        $scope.account = $scope.account.slice(0,20) + '...';
      }

      $scope.accreditation = '海尔官方认证';
    };
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.init();
      MESSAGECENTERService.unreadMessage();
    })
  }]);
  /**
 * creator:feng.jiang@dhc.com.cn
 * create time:16/3/29
 * describe：小店首页服务
 **/
APP.service('ShopService', ['$http', 'UrlService','CreditService', function ($http, UrlService, CreditService) {
  //消息中心
  // this.getMseeageClassify = function(){
  // var params = {
  //     messageType: 0
  //   };
  //   return $http.get(UrlService.getUrl('MESSAGE_CLASSIFY'), params);
  // }
}]);