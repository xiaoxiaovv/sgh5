/**
 * creater:shuang2.wang@dhc.com.cn
 * create time:2016/3/18
 * describe：顺逛帮助详细控制器
 **/
APP.controller('HelpDetailController', ['$scope', '$stateParams', 'HelpDetailService', '$ionicModal', '$timeout', '$sce', 'UrlService', 'PlatformService',
  function ($scope, $stateParams, HelpDetailService, $ionicModal, $timeout, $sce, Urlservice, PlatformService) {

    /** 变量声明 **/
    $scope.helpId = $stateParams.helpId;
    $scope.title = $stateParams.content;
    $scope.isIos = false;
    /** 方法 **/
    //加载数据

    /** 变量声明 **/
    $scope.htmlContent = $stateParams.content;
    $scope.trustSrc = function (src) {
      return $sce.trustAsResourceUrl(src);
    };
    /** 方法 **/
      //页面初始化
    $scope.init = function () {

      var u = navigator.userAgent;

      if(u.indexOf('iPhone') != -1)
      {
        $scope.isIos = true;
      }else{
        $scope.isIos = false;
      }

      $scope.htmlContent = Urlservice.getHead() + 'mstore/sg/helpDetail.html?id=' + $stateParams.helpId; //$stateParams.content;
      console.log($scope.htmlContent);
      $scope.trustSrc = function (src) {
        return $sce.trustAsResourceUrl(src);
      };
    };

    //viewWillAppear
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.init();
    });

    //返回
    $scope.goUpPage = function () {
      $scope.$ionicGoBack();
    };
  }]);


/**
 * creater:shuang2.wang@dhc.com.cn
 * create time:2016-05-20
 * describe：顺逛帮助详细Service
 **/
APP.service('HelpDetailService', ['$http', 'UrlService', function ($http, UrlService) {
  this.getHelpDetail = function (helpId) {
    var params = {
      id: helpId
    };
    return $http.get(UrlService.getUrl('HELP_DETAIL'), params)
  };
}]);
