APP.controller('EasyConnectIframeController', ['$scope', '$stateParams', '$sce',
  function ($scope, $stateParams, $sce) {

    /** 变量声明 **/
    $scope.htmlContent = $stateParams.content;
    $scope.trustSrc = function (src) {
      return $sce.trustAsResourceUrl(src);
    };
    /** 方法 **/
    //页面初始化
    $scope.init = function () {
      $scope.htmlContent = $stateParams.content;
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
