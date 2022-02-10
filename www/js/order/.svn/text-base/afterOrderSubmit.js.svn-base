/**
 * Created by xy on 2016/3/22.
 */
APP.controller('AfterOrderSubmitController', ['$scope', '$stateParams', '$rootScope', '$ionicLoading',
  'PaymentService', '$ionicHistory', 'PopupService', 'InAppBrowserService','$state','EasyConnectService','$ionicPopup','AfterOrderSubmitService','UrlService',
  function ($scope, $stateParams, $rootScope, $ionicLoading, PaymentService, $ionicHistory, PopupService,
            InAppBrowserService,$state,EasyConnectService,$ionicPopup,AfterOrderSubmitService,UrlService) {
    /** 变量声明 **/
    $scope.htmlContent = $stateParams.content;
    $scope.title = $stateParams.title;
    $scope.payment = '';
    $scope.showPay = true;
    $scope.isToStore = false;
    var shareStoreId='';//订单详情页的shareStoreId
    //获取支付方式  online  cod货到付款    giftcard 优惠全额支付  
    $scope.paymentCode = $stateParams.paymentCode;  
    var orderSn, paymentCode, totalAmount;
    var payInfo = '';//支付信息
    /** 方法 **/
    $scope.init = function () {
      $scope.htmlContent = $stateParams.content;
      $scope.title = $stateParams.title;
      $scope.messageData = $stateParams.messageData;
      $scope.data = JSON.parse($scope.messageData);
      console.log($scope.data);

      orderSn = $scope.data.os;
      paymentCode = $scope.data.pyc;
      totalAmount = $scope.data.oa;
      
    };
//支付 重要方法
    $scope.payTest = function (orderSn, paymentCode, totalAmount) {
      $state.go('paymentxyz',{orderSn:orderSn,totalAmount:totalAmount});return;
      if (!window.cordova) {

        if (paymentCode == 'alipaymobile') {//支付宝

          window.location.href = "http://m.ehaier.com/v2/h5/pay/alipay/request.html?orderSn=" + orderSn;


        } else if (paymentCode == 'wxpay') {

          var userAgent = window.navigator.userAgent;

          if (!userAgent || userAgent.indexOf("MicroMessenger") == -1) {

            PopupService.showToast("请使用与定金相同的支付方式-微信支付，登录顺逛微店公众号付款。");
            return;
          }
          if (userAgent.substring(userAgent.indexOf("MicroMessenger") + 15, userAgent.indexOf("MicroMessenger") + 16) < 5) {

            PopupService.showToast("微信版本过低，请使用5.0及以上版本。");
            return;
          }
          window.location.href = "http://m.ehaier.com/v2/h5/pay/wxpay/pay.html?showwxpaytitle=1&orderSn=" + orderSn + "&orderAmount=" + totalAmount + ".00";


        } else if (paymentCode == 'kjtpay') {

          //查看是否绑定kjt
          EasyConnectService.getMessage().success(function (response, status, headers, config) {
            if(response.data.kjtAccount && response.data.kjtAccount.memberKjtpayAccount){//已经绑定了快捷通

              window.location.href ="http://m.ehaier.com/v2/h5/pay/kjtpay/request.html?orderSn="+orderSn +"&kjtAcount="+response.data.kjtAccount.memberKjtpayAccount;
            }else{
              $ionicPopup.alert({
                template: '您还未绑定快捷通',
                okText: '去绑定'
              }).then(function(y){
                $state.go('easyConnect');
              });

            }

          }).error(function(){

            //网络失败
            alert('网络失败');
          });

        }

        return;
      }

      if (paymentCode == 'alipaymobile') {

        if (window.alipay) {
          /**
           * out_trade_no: 订单号(不能重复)
           * subject: 商品名称
           * body:  描述
           * total_fee: 价格
           * successCallback: 成功回调
           * errorCallback: 失败回调
           * callbackUrl: 回调地址/支付宝调用 */
          var out_trade_no = orderSn;
          var subject = "1x51";
          var body = "x5企业版";
          var callbackUrl = "http://m.ehaier.com/v2/h5/pay/app/alipay/notify.html";
          if(window.device && window.device.hasNewAliPay){
            AfterOrderSubmitService.getAliPayInfo(out_trade_no,totalAmount,callbackUrl)
              .success(function(response){
                if(response.errorCode == -200){//在支付时库存不足，极少出现的情况
                  PopupService.showToast('库存不足，请稍后再试!');
                  return ;
                };
                payInfo = response.result;
                window.alipay.pay({
                  payInfo:payInfo
                }, function (resultStatus) {
                  $ionicLoading.show({
                    template: "支付宝支付成功" + '',//resultStatus,
                    noBackdrop: true,
                    duration: 3000
                  });
                  $scope.showPay = false;
                }, function (message) {
                  $ionicLoading.show({
                    template: "支付宝支付失败 " + '',//message,
                    noBackdrop: true,
                    duration: 3000
                  });
                })
              })
              .error(function(err){
                console.log('网络连接错误');
              });
          }else{
            window.alipay.pay({
                tradeNo: out_trade_no,
                subject: "海尔顺逛微店",
                body: "顺逛微店-订单号:"+out_trade_no,
                price: totalAmount,
                notifyUrl:callbackUrl
              },

              function (resultStatus) {
                $ionicLoading.show({
                  template: "支付宝支付成功" + '',//resultStatus,
                  noBackdrop: true,
                  duration: 3000
                });

                //支付成功 ,刷页面
                $scope.init();
              },function (message) {
                $ionicLoading.show({
                  template: "支付宝支付失败 " + '',//message,
                  noBackdrop: true,
                  duration: 3000
                });
              });
          }


        } else {
          alert('支付宝 插件不存在');
        }


      } else if (paymentCode == 'wxpay') {//微信支付
        if (!window.wechatPay) {
          alert('微信支付插件未加载 ');
          // return ;
        }
        //发请求 得到微信支付的签名等信息
        var param = {orderSn: orderSn};
        PaymentService.wPay(param).success(function (response) {
          if(response.errorCode == -200){//在支付时库存不足，极少出现的情况
            PopupService.showToast('库存不足，请稍后再试!');
            return ;
          };
          if (response.data) {//微信支付 先访问后台，得到preorder  的 json
            var json = JSON.stringify(response.data);
            debugger;

            window.wechatPay.pay(json, function (d) {//微信支付成功

              $ionicLoading.show({
                template: "微信支付成功",
                noBackdrop: true,
                duration: 3000
              });
              $scope.showPay = false;
            }, function (msg) {

              $ionicLoading.show({
                template: "微信支付失败: " + msg,
                noBackdrop: true,
                duration: 3000
              });

            });
          } else {
            alert('网络连接错误');
          }


        }).error(function (msg) {
          alert(msg);
        });


      }
      else if (paymentCode == 'kjtpay') {//快捷通支付   cod 货到付款
        EasyConnectService.getMessage().success(function (response, status, headers, config) {
          if(response.data.kjtAccount && response.data.kjtAccount.memberKjtpayAccount){//已经绑定了快捷通

            var param = {
              orderSn:orderSn,
              kjtAmount:response.data.kjtAccount.memberKjtpayAccount
            };
            PaymentService.kjtPay(param).success(function(res){
              if(res.errorCode == -200){//在支付时库存不足，极少出现的情况
                PopupService.showToast('库存不足，请稍后再试!');
                return ;
              };
              if(res.success){
                var ref = InAppBrowserService.open(res.data);
                ref.addEventListener('exit', function (event) {
                  $scope.init();
                });
              }else{
                $ionicPopup.alert({
                  template: res.message,
                  okText: '知道了'
                });

              }
            });


          }else{
            $ionicPopup.alert({
              template: '您还未绑定快捷通',
              okText: '去绑定'
            }).then(function(y){

              $state.go('easyConnect');
            });

          }

        }).error(function(){

          //网络失败
          alert('网络失败');
        });

      }

    };

    $scope.orderRace = function() {
      window.location.href = UrlService.getThirdUrl('race/');
    }

    $scope.goToStore = function(){
      $state.go('myStore',{storeId:shareStoreId,shareStoreId:shareStoreId})
    };
    //返回
    $scope.goBack = function () {
      $ionicHistory.goBack(-2);
    };

    // 社群争霸赛添加跳转
    $scope.orderRace = function() {

      window.location.href = UrlService.getThirdUrl('race/');
    
    }

    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.init();
      var frontViews = $ionicHistory.viewHistory().histories.root.stack;
      var length = frontViews.length;
      if(frontViews[length-3]&&frontViews[length-3].stateName=='productDetail'){
        shareStoreId = frontViews[length-3].stateParams.shareStoreId;
      }else if(frontViews[length-4]&&frontViews[length-4].stateName=='productDetail'){
        shareStoreId = frontViews[length-4].stateParams.shareStoreId;
      }
      if(shareStoreId){
        $scope.isToStore = true
      }
    })
  }]);
APP.service('AfterOrderSubmitService',['$http', 'UrlService',function($http,UrlService){
  this.getAliPayInfo = function(out_trade_no,totalAmount,callbackUrl){
    var params = {
      tradeNo: out_trade_no,
      subject: "海尔顺逛微店",
      body: "顺逛微店-订单号:" + out_trade_no,
      price: totalAmount ,
      notifyUrl: callbackUrl
    };
    return $http({
      method: 'POST',
      url: UrlService.getUrl('GET_ALIPAY_INFO'),
      params: params
    });
  }
}]);
