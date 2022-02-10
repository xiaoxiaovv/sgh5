/**
 * creater:chuanpeng.zhu@dhc.com.cn
 * create time:2016/3/14
 * describe：TestController 测试控制器
 **/

APP.controller('HomeController', ['$scope', 'HomeService','H5LocationService', function ($scope, HomeService,H5LocationService) {

  $scope.mine = 'test mine angularJS';
  $scope.fangfa = function (param1) {
    H5LocationService.getLocation(function(posiation){
      console.log('position',posiation);
    })
  };
  HomeService.doInit()
    .success(function (response, status, headers, config) {
      console.log('response:',response);
    })

}]);


APP.service('HomeService', ['$http', 'UrlService', function ($http, UrlService) {
  this.doInit = function (username, password) {
    var params = {
      userName: username,
      password: password
    };
    return $http.get(UrlService.getUrl('HOME_INIT'), params);
  };

}]);

