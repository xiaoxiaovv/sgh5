/**
 * Created by daba on 2016/12/21.
 */
APP.controller('CcbPayController', ['$scope','$stateParams','$sce','$http','$ionicPopup','$rootScope','$state',
  function ($scope, $stateParams,$sce,$http,$ionicPopup,$rootScope,$state) {
    $scope.ccbUrl = $sce.trustAsResourceUrl($stateParams.url);
    console.log($scope.ccbUrl);
    console.log($stateParams.orderSn);
    console.log(window.screen.width);
    if(window.screen.width<=320){
      $scope.height='50%';
    }else{
      $scope.height='80%';
    }
    var orderSn = $stateParams.orderSn;
    $scope.goBack = function(){
      //ajax 发送订单号给 后端 获取 支付成功或失败的 标识
      // console.log(orderSn);
      // $http.get('http://mobiletest.ehaier.com:38080/branch/v3/h5/sg/order/getOrderCcbpayResult.html',{orderSn:orderSn})
      //   .success(function(response){
      //     if(response.data.payresult){
      //       //返回到 支付方式选择页面  设置全局变量 标识支付成功
      //       $rootScope.paySuccess = true;
      //       $scope.$ionicGoBack(-2);
      //     }else{
      //       //支付失败
      //       $rootScope.paySuccess = false;
      //       $scope.$ionicGoBack(-2);
      //     }
      //   })

      $state.go('orderManage');
    }

  }]);
