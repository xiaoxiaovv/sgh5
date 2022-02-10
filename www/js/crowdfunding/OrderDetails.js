/**
 * creater:shuang2.wang@dhc.com.cn
 * create time:2016/3/16
 * describe：订单详情控制器
 **/
APP.controller('OrderDetailsController', ['$localstorage','$ionicPopup','$scope', '$state', 'OrderDetailService', '$stateParams', 'PopupService', 'UserService', '$rootScope', '$timeout', 'ConfirmReceiveService', '$ionicViewSwitcher',
  function ($localstorage,$ionicPopup,$scope, $state, OrderDetailService, $stateParams, PopupService, UserService, $rootScope, $timeout, ConfirmReceiveService, $ionicViewSwitcher) {

    /** 变量声明 **/
    $scope.orderSnDetail = $stateParams.orderSn;//订单唯一性标识
    $scope.cOrderSnDetail = $stateParams.cOrderSn;//订单唯一性标识
    $scope.orderDetailList = [];
    var tempMassage = UserService.getUser();
    $scope.loginMemberId = tempMassage.mid;
    $scope.uname = tempMassage.userName;
    $scope.userlevel = 0;
    $scope.shareStoreId = '';    //进入店铺预览页带入的用户Id
    var xyzcOrderId = $stateParams.cOrderId;
    /** 方法 **/
      //加载数据
    $scope.loadData = function (orderSn, cOrderSn ,xyzcOrderId) {
      OrderDetailService.getOrderDetail(orderSn, cOrderSn, xyzcOrderId)
        .success(function (response) {
        	console.log(response);
          if (response.success) {
            $scope.orderDetailList = response.data;
            console.log(response.data);
            // var a=underfined;
            console.log(!$scope.orderDetailList.pcProductFlag);
            $scope.canSubmitRepair = $scope.orderDetailList.canSubmitRepaier;
            $scope.orderId = response.data.orderProductId;
            $scope.orderPrice = response.data.price;
            $scope.shareStoreId = response.data.storeDetail.ownerId;
            console.log('response:', $scope.orderDetailList);
          }
        });
    };
    //跳到订单追踪页面
    $scope.goOrderTrack = function (obj) {
      $state.go('orderTracking', {orderSn: obj});
    };
    //跳到退货退款页面
    $scope.goApplyRefund = function (obj) {

        if (!$scope.orderDetailList.canSubmitRepaier) {
        PopupService.showToast('退款受理中，请稍后刷新查看状态！');
        return;
      }

      OrderDetailService.checkRefund(obj)
        .success(function (response) {
          console.log('response:', response);
          if (response.success) {
            $state.go('applyRefund', {cOrderSn: obj});
          } else {
            PopupService.showToast(response.message);
          }
        });


    };

    //复制
    $scope.copeText = function (text) {
      if (window.cordova) {
        cordova.plugins.clipboard.copy(text);
        PopupService.showToastShort('复制成功');
      }
      else {
        PopupService.showToast('请下载APP执行此操作');
      }
    };

    //隐藏pc的tips
    $scope.hidePcTips=function(){
      $scope.isShowPcTips=false;
    }

    //判断pc端页面，出现tips
    $scope.pcProduct=function(pc){
      if(pc){
        $scope.isShowPcTips=true;
      }else{
      	if($scope.orderDetailList.zActivityOrder == 1){
      		$state.go('crowd_funding_details',{zActivityId:$scope.orderDetailList.zActivityId})
      	}
      	else{

        $state.go('productDetail',{productId:$scope.orderDetailList.productDetail.productId,o2oType:$scope.orderDetailList.productDetail.o2oType,storeId:$scope.orderDetailList.storeDetail.ownerId})
      	}
      }
    }

    //判断pc评价
    $scope.asse=function(id,cOrderSn,pc){
      if(pc){
        $scope.isShowPcTips=true;
      }else{
        $state.go('assess',{orderId:id,cOrderSn:cOrderSn})
      }
    }

    // 客服--调插件
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
       // window.open('http://mobiletest.ehaier.com:38080/v3/h5/sg/common/customService.html?orderid='+$scope.orderId+'&price='+$scope.orderPrice+'&flag='+$scope.kfTocken);
          window.open('http://m.ehaier.com/v3/h5/sg/common/customService.html?orderid='+$scope.orderId+'&price='+$scope.orderPrice+'&flag='+$scope.kfTocken);
      }
    };

    // 电子发票链接--调插件
    $scope.invoice = function () {
      if (window.cordova) {
        //cordova.InAppBrowser.open($scope.orderDetailList.invoicesUrl, '_blank', 'location=no');
        $state.go('invoiceHtml', {invoiceSrc: $scope.orderDetailList.invoicesUrl});
      }
      else {
        $state.go('invoiceHtml', {invoiceSrc: $scope.orderDetailList.invoicesUrl});
        // window.open($scope.orderDetailList.invoicesUrl, '_blank', 'location=no');
      }
    };

    //退货成功后回调
    $rootScope.$on('ORDER_RETURN_BACK', function (event, data) {

    });

    //确认收货方法
    $scope.confirmReceive = function (cOrderSn) {
      PopupService.showConfirm('', '"确认收货"将代表您已收到所购商品！', sureClick, '确认');
      function sureClick(result) {
        if (result) {
          ConfirmReceiveService.confirmReceive(cOrderSn)
            .success(function (response) {
              if (response.success) {
                $ionicViewSwitcher.nextDirection('forward');
                $state.go('orderManage');
              } else {
                PopupService.showToast(response.message);
              }
            })
        } else {
          //do noting
        }
      }
    };

    $scope.$on('$ionicView.beforeEnter', function (e, v) {

    	$scope.raiseStatusOne = {
    		"background":"red",
    		"color":"#ffffff"
    	}
    	$scope.raiseStatusTwo = {
    		"background":"red",
    		"color":"#ffffff"
    	}
    	$scope.raiseStatusThree = {
    		"background":"red",
    		"color":"#ffffff"
    	}
    	$scope.raiseStatusFour = {
    		"background":"red",
    		"color":"#ffffff"
    	}
      $scope.isIos = (window.cordova&&ionic.Platform.isIOS())?true:false;
      $scope.isShowPcTips = false;
      xyzcOrderId = $stateParams.cOrderId;
      $scope.storeId = UserService.getUser().mid;//
      $scope.canSubmitRepair = true;
      $scope.loadData($scope.orderSnDetail, $scope.cOrderSnDetail,xyzcOrderId);
    });

     $scope.goToDelete = function () {
      var confirmPopup = $ionicPopup.confirm({
        template: $scope.orderDetailList.phoneNumber,
        cancelText: '取消',
        okText: '确定'
      });
      confirmPopup.then(function(res) {
       if(res) {

        if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {//只有ios app 特有的样式
        window.open('tel:' + $scope.orderDetailList.phoneNumber,'_system');
        }else{
          window.open('tel:' + $scope.orderDetailList.phoneNumber);
        }

        //  window.open('tel:' + $scope.orderDetailList.phoneNumber);
       } else {
         console.log('You are not sure');
       }
     });
    };

  }]);
