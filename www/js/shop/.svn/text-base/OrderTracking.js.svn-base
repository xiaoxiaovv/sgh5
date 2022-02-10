/**
 * creater:shuang2.wang@dhc.com.cn
 * create time:2016/3/17
 * describe：订单追踪控制器
 **/
APP.controller('OrderTrackingController', ['$localstorage','$scope', 'OrderTrackingService', '$stateParams','PopupService','$timeout','UrlService','$state',
  function ($localstorage,$scope, OrderTrackingService, $stateParams,PopupService,$timeout,UrlService,$state) {

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
    $scope.orderSn = $stateParams.orderSn;//订单唯一性标识
    $scope.orderTrackingData = [];
    // xyz添加订单追踪
    $scope.Tracks = [];
    /** 方法 **/
    $scope.loadData = function (orderSn) {
      OrderTrackingService.getOrderTracking(orderSn)
        .success(function (response) {
          if (response.success) {
            // xyz添加订单追踪
            $scope.Tracks = response.data.orderWorkFlowsViewA[0].orderWorkFlowList;
            $scope.orderTrackingData = response.data.orderWorkFlowsViewA;
          }else if (response.message) {
            PopupService.showToast(response.message);
          } else {
            PopupService.showToast('获取物流信息失败！');
          }
        });
    };
    //复制
    $scope.copeText = function (text) {
      if (window.cordova) {
        cordova.plugins.clipboard.copy(text);
        PopupService.showToastShort('复制成功');
      } else {
        PopupService.showToast('请下载APP执行此操作');
      }
    };
      $scope.showTrajectory = function(isOJO, orderCode){
      // OrderTrackingService.getCDKToken().
        // success(function (response) {
        //   if(response.data.status== 0){
        //     var url = UrlService.getCPUrl('CDK_URL') + '?order_code=' + order_code  + '&token=' + response.data.token;
        //        if (window.emc) {
        //       window.emc.presentH5View(url, "");
        //     } else {
        //       $state.go('carTracking', {trackUrl: url});
        //     }
        //   }else{
        //     PopupService.showToast(response.message);
        //   }
        // }).error(function (err) {
        //   console.log(err)
        // })
        //  yl
      var url = 'http://wx.rrskx.com/rrswx/view/order/orderDetail.jsp?orderId=';
      if (UrlService.getEnviroment() == 0) {
          url = 'http://wx.rrskx.com/rrswx-test/view/order/orderDetail.jsp?orderId=';
      }
      if(isOJO){ 
          url = url + 'JSG'+orderCode;
      }else{
          url = url + orderCode;
      }
      if (window.emc) {
        window.emc.presentH5View(url, "车辆轨迹");
      } else {
        window.location.href = url
        // $state.go('carTracking', {trackUrl: url});
      }
    };
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.loadData($scope.orderSn);
    });

  }]);


/**
 * creater:shuang2.wang@dhc.com.cn
 * create time:2016-03-21
 * describe：退款详情Service
 **/
APP.service('OrderTrackingService', ['$http', 'UrlService', function ($http, UrlService) {
  this.getOrderTracking = function (orderSn) {
    var params = {
      orderSn: orderSn
    };
    return $http.get(UrlService.getUrl('ORDER_TRACKING'), params);
  };
  this.getCDKToken = function(){
    return $http.get(UrlService.getUrl('GET_CDK_TOKEN'));
  }
}]);
