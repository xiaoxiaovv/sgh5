/**
 * creator:feng.jiang@dhc.com.cn
 * create time:2017/1/22
 * describe：确认收货控制器
 **/
APP.controller('ConfirmReceiveController', ['$scope', 'PopupService', '$stateParams', 'ConfirmReceiveService', '$ionicViewSwitcher', '$state',
  function ($scope, PopupService, $stateParams, ConfirmReceiveService, $ionicViewSwitcher, $state) {

    $scope.orderId = '';//订单Id
    $scope.confirmCount = '';//待确认收货网单数量
    $scope.confirmReceivelist = [];//网单列表数组

    function init() {
      ConfirmReceiveService.getConfirmList($scope.orderId)
        .success(function (response) {
          if (response.success) {
            $scope.confirmCount = response.data.numberCount;
            $scope.confirmReceivelist = response.data.orderProductList;
            console.log('确认收货网单列表：', response);
          }
        });
    }

    $scope.confirmReceive = function (cOrderSn) {
      PopupService.showConfirm('', '"确认收货"将代表您已收到所购商品！', sureClick,'确认');
      function sureClick(result) {
        if (result) {
          ConfirmReceiveService.confirmReceive(cOrderSn)
            .success(function (response) {
              if (response.success) {
               init();
              }else {
                PopupService.showToast(response.message);
              }
            })
        } else {
          //do noting
        }
      }
    };

    $scope.goOrderManage = function () {
      $ionicViewSwitcher.nextDirection('forward');
      $state.go('orderManage');
    };

    $scope.$on('$ionicView.beforeEnter', function (e, v) {
      $scope.orderId = $stateParams.orderId;
      init();
    });

  }]);
APP.service('ConfirmReceiveService', ['$http', 'UrlService', function ($http, UrlService) {
  this.getConfirmList = function (orderId) {
    var params = {
      orderId: orderId
    };
    return $http.get(UrlService.getUrl('GET_CONFIRM_RECEIVE_LIST'), params);
  };
  this.confirmReceive = function (cOrderSn) {
    var params = {
      cOrderSn: cOrderSn
    };
    return $http.get(UrlService.getUrl('CONFIRM_RECEIVE'), params);
  }
}]);
