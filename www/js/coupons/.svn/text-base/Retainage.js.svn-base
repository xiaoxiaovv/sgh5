/**
 * Created by xyz on 2017/3/9.
 */
APP.controller('RetainageController', ['RetainageService', '$scope', '$rootScope', '$stateParams', '$state', 'PopupService',
  function (RetainageService ,$scope, $rootScope, $stateParams, $state,PopupService) {
    // 尾款订单编号xyz
    $scope.relationOrderSn = $stateParams.relationOrderSn;
    $scope.isChecked = true;

    $scope.couponList = '';

    $scope.selectCoupon = function (cObj, index, isCanUse) {
      if(!isCanUse){
        angular.forEach($scope.couponList, function (i, j) {
            i.isChecked = false;
        });
      }else{
        angular.forEach($scope.couponList, function (i, j) {
          if (j != index) {
            i.isChecked = false;
          }
        });
      }
    };

    $scope.init = function(){
      RetainageService.getOrderList($scope.relationOrderSn).success(function (response) {
        if(response.success==false){
          PopupService.showToast(response.message);
        }else{
          $scope.couponList = response.data.couponList;
        } 
      });
    };


  $scope.confirm = function () {
    var flag = false;
    var cId = 0;
    angular.forEach($scope.couponList, function (i, j) {
      if (i.isChecked) {
        flag = true;
        cId = i.memberCouponId;
      }
    });
    if (flag) {
      $scope.getCoupons($scope.relationOrderSn, cId);
    } else {
      cId = '';
      $scope.getCoupons($scope.relationOrderSn, cId);
    }

  };

    //点击选择 使用优惠券 的接口, 分商品 和通用吗
    $scope.getCoupons = function (relationOrderSn, cId) {
      RetainageService.selectCoupons(relationOrderSn, cId)
        .success(function (response, status, header, config) {
          if (response.success == true) {
            var price = response.data.price;
            $state.go('paymentxyz', {
              orderSn: relationOrderSn,
              totalAmount: price
            });
          }else{
            PopupService.showToast(response.message);
          }
        }).error(function () {
          alert('使用优惠券失败');
        });
    };
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.noCanUseStyle = {
        "opacity":"0.4"
      }
      $scope.init();
    })

  }
]);

  APP.service('RetainageService', ['$http', 'UrlService', function ($http, UrlService) {
    //获取尾款优惠卷列表数据
    this.getOrderList = function (relationOrderSn) {
      var params = {
        relationOrderSn: relationOrderSn
      };
      return $http.get(UrlService.getUrl('SELECT_GOODS_COUPONS0'), params);
    };

    this.selectCoupons = function (relationOrderSn,cId){
      var params = {
        relationOrderSn: relationOrderSn,
        memberCouponId: cId
      };
      return $http({
        method: 'POST',
        url: UrlService.getUrl('SELECT_GOODS_COUPONS1'),
        params: params
      });
    };
  }]);
