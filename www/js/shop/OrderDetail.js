/**
 * creater:shuang2.wang@dhc.com.cn
 * create time:2016/3/16
 * describe：订单详情控制器
 **/
APP.controller('OrderDetailController', ['$localstorage','$ionicPopup','$scope', '$state', 'OrderDetailService', '$stateParams', 'PopupService', 'UserService', '$rootScope', '$timeout', 'ConfirmReceiveService', '$ionicViewSwitcher','HomePageService',
  function ($localstorage,$ionicPopup,$scope, $state, OrderDetailService, $stateParams, PopupService, UserService, $rootScope, $timeout, ConfirmReceiveService, $ionicViewSwitcher,HomePageService) {

    /** 变量声明 **/
    $scope.orderSnDetail = $stateParams.orderSn;//订单唯一性标识
    $scope.cOrderSnDetail = $stateParams.cOrderSn;//订单唯一性标识
    $scope.userOrder = '';
    $scope.orderDetailList = [];
    var tempMassage = UserService.getUser();
    $scope.loginMemberId = tempMassage.mid;
    $scope.uname = tempMassage.userName;
    $scope.userlevel = 0;
    $scope.shareStoreId = '';    //进入店铺预览页带入的用户Id
    var xyzcOrderId = $stateParams.cOrderId;
    $scope.flagNum = false;
    $scope.messageImgUrl = "http://cdn09.ehaier.com/shunguang/H5/www/img/message_gray@2x.png";
    /** 方法 **/
    $scope.init = function () {
      HomePageService.getUnReadMsg()
        .success(function (res) {
          if (res.data > 0) {
            $scope.flagNum = true;
          } else {
            $scope.flagNum = false;
          }
        })
    }
    $scope.goPayment = function (so,sa) {
      $state.go('paymentxyz', {
        orderSn: so,
        totalAmount: sa
      });
    }
    //加载数据
    $scope.loadData = function (cOrderSn, xyzcOrderId) {
      OrderDetailService.getOrderDetail(cOrderSn, xyzcOrderId)
        .success(function (response) {
          if (response.success) {
            //判断是否是用户订单
            $scope.userOrder = response.data.loginMemberId == response.data.memberId;
            $scope.orderId = response.data.orderProductId;
            $scope.orderPrice = response.data.price;
            $scope.orderDetailList = response.data;
            $scope.canSubmitRepair = $scope.orderDetailList.canSubmitRepaier;
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
          if (response.success) {
            if (response.data) {
              if (response.data.isPackage) {
                PopupService.showConfirm('', response.data.packageMessage, function (res) {
                  if (res) {
                    $state.go('applyRefund', { cOrderSn: obj });
                  } else {

                  }
                });
              } else {
                $state.go('applyRefund', { cOrderSn: obj });
              }
            } else {
              $state.go('applyRefund', { cOrderSn: obj });
            }

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
    };

    //判断pc端页面，出现tips
    $scope.pcProduct=function(pc){
      if(pc){
        $scope.isShowPcTips=true;
      }else{
      	if($scope.orderDetailList.zActivityOrder == 1){
      		$state.go('crowd_funding_details',{zActivityId:$scope.orderDetailList.zActivityId})
      	}
      	else{

          $state.go('productDetail', { productId: $scope.orderDetailList.productId, o2oType: $scope.orderDetailList.o2oType, storeId: $scope.orderDetailList.ckCode})
      	}
      }
    };

    //判断pc评价
    $scope.asse = function (id, cOrderSn, pc) {
      $state.go('publicationEvaluation', {cOrderSn: cOrderSn});
    };

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
       // window.open('http://mobiletest.ehaier.com:38080/v3/h5/sg/common/customService.html?orderid='+$scope.orderId);
      //  window.open('http://mobiletest.ehaier.com:38080/v3/h5/sg/common/customService.html?orderid='+$scope.orderId+'&price='+$scope.orderPrice+'&flag='+$scope.kfTocken);
        window.open('http://m.ehaier.com/v3/h5/sg/common/customService.html?orderid='+$scope.orderId+'&price='+$scope.orderPrice+'&flag='+$scope.kfTocken);
      }
    };

    // 电子发票链接--调插件
    $scope.invoice = function () {
      if (window.cordova) {
        $state.go('invoiceHtml', { invoiceSrc: $scope.orderDetailList.invoicesUrl });
      }
      else {
        $state.go('invoiceHtml', { invoiceSrc: $scope.orderDetailList.invoicesUrl });
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
      $scope.ml20 = {
        'margin-left' : 50,
      };
      $scope.ml0 = {
        'margin-left' : 0,
      };
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
      $scope.loadData($scope.cOrderSnDetail, xyzcOrderId);
      $scope.init();
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
       } else {
         console.log('You are not sure');
       }
     });
    };

  }]);


/**
 * creater:shuang2.wang@dhc.com.cn
 * create time:2016-03-21
 * describe：订单详细Service
 **/
APP.service('OrderDetailService', ['$http', 'UrlService', function ($http, UrlService) {
  this.getOrderDetail = function (cOrderSn, xyzcOrderId) {
    var params = {
      cOrderSn: cOrderSn,
      cOrderId: xyzcOrderId
    };
    return $http.get(UrlService.getUrl('ORDER_DETAIL'), params);
  };
  this.checkRefund = function (cOrderSn) {
    var params = {
      cOrderSn: cOrderSn
    };
    return $http.get(UrlService.getUrl('CHECK_REFUND'), params);
  };
  this.customService = function () {
    return UrlService.getUrl('CUSTOMER_SERVE');
  };
}]);
