/**
 * creater:shuang2.wang@dhc.com.cn
 * create time:2016/3/17
 * describe：订单追踪控制器
 **/
APP.controller('RefundDetailController', ['$localstorage','$http', 'RefundDetailService', '$scope', '$stateParams','PopupService','$timeout',
  function ($localstorage,$http, RefundDetailService, $scope, $stateParams,PopupService,$timeout) {

    /*xyz添加 客服--调插件*/
    $scope.customerServe = function () {
      if (window.cordova) {
        var isAndroid = ionic.Platform.isAndroid();
        var iabRef = null;
        if (isAndroid) {
          iabRef = cordova.InAppBrowser.open('http://m.ehaier.com/v2/h5/sg/common/customService.html', '_blank', 'location=no');
        } else {
          iabRef = cordova.InAppBrowser.open('http://m.ehaier.com/v2/h5/sg/common/customService.html', '_blank', 'location=no,toolbar=no');
        }
        iabRef.addEventListener('loadstop', function (event) {
          if (event.url.indexOf('downt.ntalker') > -1) {
            $timeout(function () {
              var d = "var r= document.getElementsByTagName('div');" +
                "var newDiv  = document.createElement('span');" +
                "newDiv.style.width = '35px';" +
                "newDiv.style.height = '35px';" +
                "newDiv.style.background = 'transparent';" +
                "newDiv.style.zIndex = '999';" +
                "r[0].appendChild(newDiv);" +
                "newDiv.style.position = 'absolute';" +
                "newDiv.style.top = '10px';" +
                "newDiv.style.left = '12px';" +
                "newDiv.style.borderRadius = '17.5px';" +
                "newDiv.onclick = function(){window.location.href = window.location.href+'&close=true';};";
              iabRef.executeScript({
                code: d
              }, function () {
              });
            }, 1000);

          }
        });

        iabRef.addEventListener('loadstart', function (event) {
          if (event.url.indexOf('close=true') > -1) {
            iabRef.close();
          }
        });

      }
      else {
        $scope.kfTocken = $localstorage.get('sg_login_token_secret').substring(6);
    //  window.open('http://mobiletest.ehaier.com:38080/v3/h5/sg/common/customService.html?flag='+$scope.kfTocken);
        window.open('http://m.ehaier.com/v3/h5/sg/common/customService.html?flag='+$scope.kfTocken);
      }

      return;
      var u = navigator.userAgent;
      if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
        window.open = cordova.InAppBrowser.open('http://m.ehaier.com/v2/h5/sg/common/customService.html', '_blank', 'location=no');
      } else if (u.indexOf('iPhone') > -1) {
        window.open = cordova.InAppBrowser.open('http://m.ehaier.com/v2/h5/sg/common/customService.html', '_blank', 'location=no');
      } else {
        window.open = cordova.InAppBrowser.open('http://m.ehaier.com/v2/h5/sg/common/customService.html', 'location=yes');
      }
    };

    /** 变量声明 **/
    $scope.orderProductId = $stateParams.orderProductId;
    $scope.memberId = $stateParams.memberId;
    $scope.orderTrackingData = [];
    $scope.orderTD = '';
    /** 方法 **/
    $scope.loadData = function (orderProductId, memberId) {
      RefundDetailService.getRefundDetail(orderProductId, memberId)
        .success(function (response) {
          if (response.success) {
            $scope.orderTrackingData = response.data.orderWorkFlowList;
            $scope.orderTD = response.data;
          }else if (response.message) {
            PopupService.showToast(response.message);
          } else {
            PopupService.showToast('获取物流信息失败！');
          }
        });
    };


    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.loadData($scope.orderProductId, $scope.memberId);
      // $http.get('http://172.18.12.145:8086/v3/h5/sg/order/getOrderRepairsInfo.html',{
      //   orderProductId: $scope.orderProductId,
      //   memberId: $scope.memberId
      // }).success(function(response){
      //   $scope.orderTrackingData = response.data.orderWorkFlowList;
      //   $scope.orderTD = response.data;
      // })
    })
  }]);


/**
 * creater:shuang2.wang@dhc.com.cn
 * create time:2016-03-21
 * describe：退款详情Service
 **/
APP.service('RefundDetailService', ['$http', 'UrlService', function ($http, UrlService) {
  this.getRefundDetail = function (orderProductId, memberId) {
    var params = {
      orderProductId: orderProductId,
      memberId: memberId
    };
    return $http.get(UrlService.getUrl('REFUND_DETAIL'), params);
  };
}]);
