APP.controller('orderWriteController', ['$localstorage','InAppBrowserService','UserService','$scope', '$stateParams', '$rootScope', '$state', 'orderWriteService', '$ionicPopup', '$timeout', 'PopupService', 'LoginService', '$http', 'UrlService', '$ionicHistory',
  function ($localstorage,InAppBrowserService,UserService,$scope, $stateParams, $rootScope, $state, orderWriteService, $ionicPopup, $timeout, PopupService, LoginService, $http, UrlService, $ionicHistory) {

    $scope.invoiceHead = undefined; //电子发票发票头
    $scope.zzsInvoice = undefined; //增值税发票
    $scope.htmlContent = $stateParams.content;
    $scope.checkStatus=true;//
    $scope.list = {};
    //		$scope.orderConfirmMessage=null;
    $scope.zStallsId = $stateParams.zStallsId;
    $scope.number = $stateParams.number;

    $scope.$on('$ionicView.afterLeave', function (e, v) {
      $rootScope.isInvoice = false;

    });
    $scope.$on('$ionicView.beforeEnter', function (e, v) {
      //			$scope.init($rootScope.isInvoice);
      $scope.init($scope.zStallsId, $scope.number);

    });



    $scope.init = function (zStallsId, number) {
      orderWriteService.getZStallsSinglePage(zStallsId, number)
        .success(function (response) {
          console.log(response);
          $scope.list = response.data;
        })
    }
    $scope.toRules = function(ruleId,content){
      var u = navigator.userAgent;
      if (u.indexOf('iPhone') != -1) {
        var ref = InAppBrowserService.open(UrlService.getHead() + 'mstore/sg/helpDetail.html?id=' + ruleId,content);
      } else {
        $state.go('helpDetail', {'helpId': ruleId, 'content': content});
      }
    };
		$scope.checkInfo=function(checkStatus){
			$scope.checkStatus = !$scope.checkStatus;
		}
    $scope.toInvoice = function (invoiceType) {
      $state.go('invoiceSetup', {
        invoiceHead: $scope.list.billCompany,
        invoiceType: invoiceType,
        enterPage: 0
      });
    };
    /* 确认订单跳转 */
    $scope.toSubmit = function () {
      if(window.cordova){//App
      		$scope.storeId = $localstorage.get('storeId', $rootScope.globalConstant.storeId);
      	}
        else{//H5
          $scope.storeId = $rootScope.shareId?$rootScope.shareId:$localstorage.get('storeId', $rootScope.globalConstant.storeId);
        }
      if (!$scope.list.memberAddress) {
        var alertInvoice = $ionicPopup.alert({
          template: '收货地址必须填写！',
          okText: '知道了'
        });
        return;
      }
      if(!$scope.checkStatus){
      		var alert = $ionicPopup.alert({
          template: '支持者协议必须选中！',
          okText: '知道了'
        });
        return;
      }
      if (!(/^[^&<>]+$/.test($scope.regAddress))) {
        var alertAddress = $ionicPopup.alert({
          template: '详细地址不能包含特殊字符！',
          okText: '知道了'
        });
      } else {
        orderWriteService.commitOrder($scope.zStallsId, $scope.number, $scope.list.invoiceType,$scope.storeId)
          .success(function (response, status, headers, config) {
            console.log(response);
            if (response.success == true) {
              $state.go('paymentxyz', {
                orderSn: response.data,
                totalAmount: response.totalCount
              });

            } else {
              // $scope.showPopup(response.message);
              var myPop = $ionicPopup.confirm({
                template: response.message,
                okText: '返回上一页',
                cancelText: '留在此页'
              });
              myPop.then(function (res) {
                if (res) {
                  $ionicHistory.goBack(-1);
                } else {

                }
              });
            }
          }).error(function () {

          });
      }
    };


  }
]);

APP.service('orderWriteService', ['$http', 'UrlService', function ($http, UrlService) {



  this.getZStallsSinglePage = function (zStallsId, number) {

    return $http({
      //		    http://mobiletest.ehaier.com:38080,
      method: 'POST',
      //		    url:UrlService.getUrl('ZC_ORDER_COMMIT'),
      url: UrlService.getZCUrl('ZC_ORDER_COMMIT'),
      params: {
        zStallsId: zStallsId,
        number: number
      }
    })

  };
  this.commitOrder = function (zStallsId, number, invoiceType,sharePeopleId) {

    return $http({
      //		    http://mobiletest.ehaier.com:38080,
      method: 'POST',
      //		    url:UrlService.getUrl('ZC_ORDER_COMMIT'),
      url: UrlService.getZCUrl('ZC_COMMIT_ORDER'),
      params: {
        zStallsId: zStallsId,
        number: number,
        invoiceType: invoiceType,
        sharePeopleId:sharePeopleId
      }
    })

  };




}]);
