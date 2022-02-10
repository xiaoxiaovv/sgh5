/**
 * creater:shuang2.wang@dhc.com.cn
 * create time:2016/4/1
 * describe：申请退款Controller
 **/
APP.controller('ApplyRefundController', ['$scope', '$ionicActionSheet', 'ApplyRefundService', 'PopupService', '$timeout', '$stateParams','$ionicHistory','$timeout','$rootScope',
  function ($scope, $ionicActionSheet, ApplyRefundService, PopupService, $timeout, $stateParams,$ionicHistory,$timeout,$rootScope) {

    /** 变量声明 **/
    $scope.cOrderSnDetail = $stateParams.cOrderSn;//订单唯一性标识
    $scope.refundData = [];
    $scope.description = 8;//退款原因
    $scope.typeActual = 0;//退货退款类型
    //提交问题反馈所需信息
    $scope.applyRefund = {
      reason: ''
    };

    /** 方法 **/
    $scope.init = function () {
      $scope.applyRefundType = '请选择退款原因';
      ApplyRefundService.applyRefund($scope.cOrderSnDetail)
        .success(function (response) {
          if (response.success) {
            $scope.refundData = response.data;
            $scope.typeActual = response.data.orderType;
            if ($scope.typeActual == 1) {
              $scope.repairType = '退货退款';
            } else {
              $scope.repairType = '退货不退款';
            }
          }
        });
    };
    //打开类型选择
    $scope.openSelect = function () {
      var hideSheet = $ionicActionSheet.show({
        buttons: [
          {text: '七天无理由'},
          {text: '大小尺寸'},
          {text: '颜色款式'},
          {text: '质量问题'},
          {text: '配送问题'},
          {text: '库存问题'},
          {text: '地址问题'},
          {text: '其他'}
        ],
        titleText: '请选择退款原因',
        buttonClicked: function (index) {
          switch (index) {
            case 0:
              $scope.applyRefundType = '七天无理由';
              break;
            case 1:
              $scope.applyRefundType = '大小尺寸';
              break;
            case 2:
              $scope.applyRefundType = '颜色款式';
              break;
            case 3:
              $scope.applyRefundType = '质量问题';
              break;
            case 4:
              $scope.applyRefundType = '配送问题';
              break;
            case 5:
              $scope.applyRefundType = '库存问题';
              break;
            case 6:
              $scope.applyRefundType = '地址问题';
              break;
            case 7:
              $scope.applyRefundType = '其他';
              break;
            default:
              break;
          }
          hideSheet();
          $scope.description = index;
          return true;
        }
      });
      // For example's sake, hide the sheet after two seconds
      $timeout(function () {
        hideSheet();
      }, 10000);
    };

    //提交退款退货
    $scope.submitRefund = function () {
      if ($scope.description == 8) {
        PopupService.showToast('请选择退款原因');
      } else {
        ApplyRefundService.setApplyRefund($scope.cOrderSnDetail, $scope.typeActual, $scope.applyRefund.reason,$scope.applyRefundType)
          .success(function (response) {
            if (response.data.state=='S') {
              $rootScope.$broadcast('ORDER_RETURN_BACK');
              PopupService.showToast('提交成功！');
              $timeout(function(){
                $ionicHistory.goBack();
              },2000);
            } else if (response.data.message) {
              PopupService.showToast(response.data.message);
              $timeout(function(){
                $ionicHistory.goBack();
              },2000);
            } else {
              PopupService.showToast('提交失败！');
            }
          });
      }
    };

    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.init();
    })
  }]);


/**
 * creater:shuang2.wang@dhc.com.cn
 * create time:2016-04-01
 * describe：申请退款Service
 **/
APP.service('ApplyRefundService', ['$http', 'UrlService', function ($http, UrlService) {
  this.setApplyRefund = function (cOrderSn, typeActual, description, reason) {
    var params = {
      cOrderSn: cOrderSn,
      typeActual: typeActual,
      description: description,
      reason: reason
    };
    console.log(params);
    return $http.get(UrlService.getUrl('SUBMIT_APPLY_REFUND'), params);
  };
  this.applyRefund = function (cOrderSn) {
    var params = {
      cOrderSn: cOrderSn
    };
    return $http.get(UrlService.getUrl('APPLY_REFUND'), params);
  };
}]);
