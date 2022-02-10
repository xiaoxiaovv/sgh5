/**
 * creator:feng.jiang@dhc.com.cn
 * create time:2016/12/19
 * describe：广告页控制器
 **/
APP.controller('AdvertisementController', ['$scope', '$rootScope', '$timeout', '$state', '$interval', '$stateParams', 'AdvertisementService', 'PopupService',
  function ($scope, $rootScope, $timeout, $state, $interval, $stateParams, AdvertisementService, PopupService) {

    var from = $stateParams.from;
    var interval;
    $scope.imgUrl = '';//广告图片地址
    $scope.second = 9;

    //获取服务端图片
    function getImage() {
      var adImg = window.localStorage.getItem('hasAD');
      if (adImg != 'noAD') {
        $scope.imgUrl = adImg;

          interval = $interval(function () {
            if ($scope.second <= 1) {
              $scope.skipAd();
            } else {
              $scope.second--;
            }
          }, 1000);

      } else {
        $state.go(from);
      }
    }

    $scope.skipAd = function () {
      //设置金币雨下落的标志
      // $rootScope.beginGoldFall = true;
      $interval.cancel(interval);
      $state.go(from);
    };
    $scope.$on('$ionicView.beforeEnter', function () {
      //设置金币雨下落的标志
      // $rootScope.beginGoldFall = false;
      from = $stateParams.from;
      $scope.second = 9;
      getImage();

    })
  }]);
APP.service('AdvertisementService', ['$http', 'UrlService', function ($http, UrlService) {
  this.getAdImage = function () {
    var params = {
      noLoading: true
    };
    return $http.get(UrlService.getUrl('GET_AD_IMAGE'), params);
  }
}]);
