/**
 * creater:shuang2.wang@dhc.com.cn
 * create time:2016/3/18
 * describe：新手必看和顺逛帮助控制器
 **/
APP.controller('HelpController', ['$scope', '$state', 'HelpService','InAppBrowserService','UrlService',
  function ($scope, $state, HelpService,InAppBrowserService,UrlService) {
    /** 变量声明 **/
    $scope.helpData = [];

    /** 方法 **/
      //加载数据
    $scope.loadData = function () {
      HelpService.getHelpList()
        .success(function (response) {
          console.log('response:', response);
          $scope.helpData = response.data.second;
        });
    };

    //跳到帮助详细页面
    $scope.goHelpDetail = function (id, name) {
      var u = navigator.userAgent;

      if (u.indexOf('iPhone') != -1) {
        var ref = InAppBrowserService.open(UrlService.getHead() + 'mstore/sg/helpDetail.html?id=' + id,name);
        ref.addEventListener('exit', function (event) {
        });
      } else {
        $state.go('helpDetail', {'helpId': id, 'content': name});
      }

    };


    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.loadData();
    });

  }]);


/**
 * creater:shuang2.wang@dhc.com.cn
 * create time:2016-05-20
 * describe：顺逛帮助Service
 **/
APP.service('HelpService', ['$http', 'UrlService', function ($http, UrlService) {
  this.getHelpList = function () {
    return $http.get(UrlService.getUrl('SHUNGUANG_HELP'));
  };
}]);
