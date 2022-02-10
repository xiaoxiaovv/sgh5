APP.controller('spendBaiInstallmentController', ['$scope', '$state', '$ionicHistory','spendBaiInstallmentService','$stateParams','UrlService','AfterOrderSubmitService','PopupService','PaymentService','$ionicLoading', function($scope, $state, $ionicHistory,spendBaiInstallmentService,$stateParams,UrlService,AfterOrderSubmitService,PopupService,PaymentService,$ionicLoading){
	$scope.isShowDet = false;
	$scope.payList = [];
	$scope.totalFee = null;
	$scope.number = 3;
	$scope.goBack = function () {
		// console.log(123);
		 $scope.$ionicGoBack();
	}
	$scope.showDetail = function () {
		$scope.isShowDet = !$scope.isShowDet;
	}
	$scope.changeFenqiNum = function (number) {
		$scope.number = number;
	}
	$scope.toPay = function () {
		// console.log(3214312);
		if (!$scope.number) {
			PopupService.showAlert('提示','请选择期数后付款',function(){});
			return;
		} else {
			var callbackUrl = UrlService.getHeadV2()+"h5/pay/app/alipay/notify.html";
			PaymentService.orderPayCheck({orderSn:$stateParams.orderSn}).success(function (response) {
                if(response.errorCode == -200){//在支付时库存不足，极少出现的情况
                    PopupService.showAlert('提示',response.message,function(){});
                    return;
                }
                  
				if (window.cordova) {
					spendBaiInstallmentService.sendToPayApp($stateParams.orderSn,$scope.number).success(function (res) {
						console.log(res);
						if (res.success) {
							console.log(res);
							var payInfo = res.data.orderInfo;
							console.log(payInfo);
							// payInfo.
							// console.log(payInfo);
							// payInfo.hb_fq_param = res.data.hb_fq_param;
							// console.log(payInfo);
							window.alipay.pay({
	                            payInfo: payInfo
	                        }, function (resultStatus) {
	                            //$ionicLoading.show({
	                            //  template: "支付宝支付成功" + '', //resultStatus,
	                            //  noBackdrop: true,
	                            //  duration: 3000
	                            //});
	                            // $scope.showPay = false;
	                            // console.log(resultStatus);
	                            $state.go('payResultSuccess');
	                        }, function (message) {
	                            // $ionicLoading.show({
	                            //  template: "支付宝支付失败 " + message, //message,
	                            //  noBackdrop: true,
	                            //  duration: 3000
	                            // });
	                            
	                            $state.go('payResultFailure');
	                        })

						}
					})
				} else {
					window.location.href = UrlService.getZCUrl('HB_PAY_H5')+'?orderSn='+$stateParams.orderSn + '&number='+$scope.number;
				}
			});
		}
	}
	$scope.$on('$ionicView.beforeEnter', function () {
       spendBaiInstallmentService.getHBCost($stateParams.orderSn).success(function (res) {
       	if (res.success) {
       		$scope.payList = res.data.payList;
       		$scope.totalFee = res.data.totalFee;
       		console.log(3123213,res);
       	}
       });
       $scope.number = 3;
    });
}])

APP.service('spendBaiInstallmentService', ['$http','UrlService', function($http,UrlService){
	this.getHBCost = function(orderSn){
        
        var myUrl = UrlService.getPayCenter('HB_COST')+'?callback=JSON_CALLBACK&orderSn='+orderSn;
        return $http.jsonp(myUrl);
    };
    this.sendToPayApp = function (orderSn, number) {
    	var myUrl = UrlService.getZCUrl('HB_PAY_APP')+'?orderSn='+orderSn + '&number='+number;
        return $http.get(myUrl);
    };
    
}])