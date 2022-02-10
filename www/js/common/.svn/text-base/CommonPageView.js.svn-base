/**
 * creater:chuanpeng.zhu@dhc.com.cn
 * create time:2016/3/16
 * describe：todo
 **/
APP.controller('CommonPageViewController', ['$scope','$stateParams','$sce', function ($scope,$stateParams,$sce) {

  /** 变量声明 **/
  $scope.htmlContent = $stateParams.content;
  $scope.title = $stateParams.title;
  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  };
  /** 方法 **/
  $scope.init = function(){
    $scope.htmlContent = $stateParams.content;
    $scope.title = $stateParams.title;
    console.log('do init!!');
  };

  $scope.$on('$ionicView.beforeEnter',function(){
    $scope.init();
    $scope.htmlContent = $stateParams.content;
  })
}]);

APP.controller('invoiceHtmlController', ['$scope','$stateParams','$sce', function ($scope,$stateParams,$sce) {

  /** 变量声明 **/
  $scope.deviceHeight = window.innerHeight;
  $scope.invoiceSrc = $sce.trustAsResourceUrl($stateParams.invoiceSrc);
  /** 方法 **/
  $scope.init = function(){
  //  debugger;
    $scope.invoiceSrc = $sce.trustAsResourceUrl($stateParams.invoiceSrc);
  };

  $scope.$on('$ionicView.beforeEnter',function(){
    $scope.init();
  })
}]);
