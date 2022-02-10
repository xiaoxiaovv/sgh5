APP.controller('LookAssessController', ['$scope', 'LookAssessService', '$stateParams', '$ionicLoading', '$timeout', 'PlatformService', 'PopupService', '$ionicHistory',
  function($scope, LookAssessService, $stateParams, $ionicLoading, $timeout, PlatformService, PopupService, $ionicHistory) {
    if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) { //只有ios app 特有的样式
      $scope.paddingtopClass = {
        "margin-top": "16px"
      };
      $scope.paddingtopClasscontent = {
        "top": "60px"
      }
    } else {
      $scope.paddingtopClass = {
        "margin-top": "0px"
      };
      $scope.paddingtopClasscontent = {
        "top": "44px"
      }
    }
    /** 变量声明 **/
    $scope.show = false;
    $scope.orderId = $stateParams.orderId; //订单唯一性标识
    $scope.cOrderSn = $stateParams.cOrderSn; //网单号
    $scope.goBack = function() {
      $ionicHistory.goBack();
    }

    $scope.closeImg = function() {
      $scope.show = false;
    };

    $scope.showLarge = function(img) {
      $scope.show = true;
      $scope.largeImg = img;
    };

    /** 方法 **/
    $scope.init = function(cOrderSn) {
      LookAssessService.getLookAssess(cOrderSn)
        .success(function(response, status, headers, config) {
          if (response.success) {
            $scope.assessList = response.data.comment;
            $scope.stateList = response.data;
            $scope.timeIsOrNo = (($scope.timeNow-$scope.assessList.createTime)/ 1000 / 60 / 60 / 24)<90;
          }else{
            PopupService.showToast(response.memessage);
          }
        });
    };

    $scope.$on('$ionicView.beforeEnter', function() {
      $scope.cOrderSn = $stateParams.cOrderSn; //网单号
      $scope.init($scope.cOrderSn);
      $scope.timeNow = Date.parse(new Date());
    });

  }
]);

APP.service('LookAssessService', ['$http', 'UrlService', function($http, UrlService) {
  //获取评论商品信息
  this.getLookAssess = function(cOrderSn) {
    var params = {
      cOrderSn: cOrderSn
    };
    return $http.get(UrlService.getUrl('LOOK_ASSESS_INGO'), params);
  };
}]);
