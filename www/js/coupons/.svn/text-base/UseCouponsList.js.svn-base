/**
 * Created by 11140921040349 on 2016/4/11.
 */
APP.controller('UseCouponsListController', ['$scope', '$rootScope', '$stateParams', 'CommonLocationService', '$state', 'UseCouponsListService', 'PopupService', '$ionicHistory', 'UserService',
    function ($scope, $rootScope, $stateParams, CommonLocationService, $state, UseCouponsListService, PopupService, $ionicHistory, UserService) {

        $scope.htmlContent = $stateParams.content;
        $scope.tabNav = 'selection';
        $scope.title = $stateParams.title;
        $scope.type = $stateParams.type; //  type 2是 通用券 1是商品券
        $scope.productId = $stateParams.productId;
        $scope.number = $stateParams.number;
        $scope.couponId = $stateParams.couponId;
        $scope.sku = $stateParams.sku;
        $scope.isChecked = true;
        $scope.couponButton = undefined;//商品优惠券单选框
        $scope.isNull;//控制没有优惠券图片的显示  true 显示图片

        //区分优惠券类别颜色class数组
        $scope.green = [false];
        $scope.blue = [false];
        $scope.pink = [false];
        $scope.$on('$ionicView.beforeEnter', function () {
          $scope.noCanUseStyle = {
            "opacity":"0.4"
          }
          $scope.couponList = '';
            $scope.init();
        });

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
        $scope.init = function () {
            $scope.isNull = false;
            $scope.htmlContent = $stateParams.content;
            $scope.title = $stateParams.title;
            $scope.type = $stateParams.type;
            $scope.productId = $stateParams.productId;
            $scope.number = $stateParams.number;
            if ($scope.type == 1) {
                UseCouponsListService.selectGoodsCoupons($scope.productId, $scope.number)
                    .success(function (response, status, header, config) {
                        $scope.couponList = response.data;
                        if ($scope.couponList.length == 0) {
                            $scope.isNull = true;
                        }
                        for (var i = 0; i < $scope.couponList.length; i++) {
                            $scope.couponList[i].isChecked = ($scope.couponId == $scope.couponList[i].memberCouponId);
                            if ($scope.couponList[i].useCondition == 4 && !$scope.couponList[i].storeId) {
                                $scope.green[i] = true;
                            } else if ($scope.couponList[i].useCondition != 4 && !$scope.couponList[i].storeId) {
                                $scope.blue[i] = true;
                            } else if ($scope.couponList[i].storeId && $scope.couponList[i].storeId != 0) {
                                $scope.pink[i] = true;
                            }
                        }
                    });
            } else if ($scope.type == 2) {
                UseCouponsListService.selectPlatformCoupons()
                    .success(function (response, status, header, config) {
                        $scope.couponList = response.data;
                        if ($scope.couponList.length == 0) {
                            $scope.isNull = true;
                        }
                        for (var i = 0; i < $scope.couponList.length; i++) {
                            $scope.couponList[i].isChecked = ($scope.couponId == $scope.couponList[i].memberCouponId);
                            if ($scope.couponList[i].useCondition == 4 && !$scope.couponList[i].storeId) {
                                $scope.green[i] = true;
                            } else if ($scope.couponList[i].useCondition != 4 && !$scope.couponList[i].storeId) {
                                $scope.blue[i] = true;
                            }
                        }
                    });
            }

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
                $scope.getCoupons(cId, $scope.type);
            } else {
                cId = null;
                $scope.getCoupons(cId, $scope.type);
            }

        };

        //点击选择 使用优惠券 的接口, 分商品 和通用吗
        $scope.getCoupons = function (id, type) {
            if(type == 1){ //店铺优惠圈
              UseCouponsListService.selectCoupons($scope.sku,id)
                .success(function (response, status, header, config) {
                  console.log(response);
                  if (response.success == true) {
                    $ionicHistory.goBack();
                  }
                }).error(function () {
                alert('使用优惠券失败');

              });
            }
            if(type == 2){ //平台
              UseCouponsListService.selectPTCoupons(id)
                .success(function (response, status, header, config) {
                  console.log(response);
                  if (response.success == true) {
                    $ionicHistory.goBack();
                  }
                }).error(function () {
                alert('使用优惠券失败');

              });
            }

        };

        $scope.toDetail = function (id,couponId) {
            var userID = UserService.getUser().mid;//获取用户id
            var type = 0;
            $state.go('couponsDetailTwo', {cId: id, userID: userID, type: type, isUser: true,couponId: couponId});
        }

    }]);

APP.service('UseCouponsListService', ['$http', 'UrlService', function ($http, UrlService) {
    /**
     * 查询商品券接口
     * @param productId
     * @param productNum
     * @returns {HttpPromise}
     */
    this.selectGoodsCoupons = function (productId, productNum) { //店铺优惠卷
        var params = {
            'product': productId
          //  'productNum': productNum
        };
        return $http({
          method:'POST',
          url:UrlService.getUrl('SELECT_GOODS_COUPONS'),
          params: params
        })
      //  return $http.get(UrlService.getUrl('SELECT_GOODS_COUPONS'), params);
    };
    /**
     * 查询通用券接口
     * @returns {HttpPromise}
     */
    this.selectPlatformCoupons = function () {
        return $http({
          method:'POST',
          url:UrlService.getUrl('SELECT_PLATFORM_COUPONS')
        })
     //   return $http.get(UrlService.getUrl('SELECT_PLATFORM_COUPONS'));
    };
    /**
     * 选择优惠券接口
     * @param productId
     * @param id
     * @returns {HttpPromise}
     */
    this.selectCoupons = function (productId, id) {
        var params = {
            'p': productId,
            'c': id
        };
        return $http({
            method: 'POST',
            url: UrlService.getUrl('SELECT_COUPONS'),
            params: params
        });
    };
    this.selectPTCoupons = function (id) { //平台
      var params = {
        'c': id
      };
      return $http({
        method: 'POST',
        url: UrlService.getUrl('SELECT_COUPONS_PT'),
        params: params
      });
    };
}]);
