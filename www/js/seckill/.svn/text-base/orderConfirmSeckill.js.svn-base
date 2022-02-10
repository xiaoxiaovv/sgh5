/**
 * Created by xy on 2016/3/22.
 */
APP.controller('OrderConfirmSeckillController', ['$scope', 'SeckillService', '$stateParams', '$rootScope', '$state',
  'OrderConfirmSeckillService', '$ionicPopup', '$timeout', 'PopupService', 'CacheService', 'SeckillDetailService', '$interval',
  function ($scope, SeckillService, $stateParams, $rootScope, $state,
            OrderConfirmSeckillService, $ionicPopup, $timeout, PopupService, CacheService, SeckillDetailService, $interval) {
    /** 变量声明  seckillId/:numbers/:productIds **/
    $scope.htmlContent = $stateParams.content;
    $scope.title = $stateParams.title;
    $scope.tabNav = 'selection';
    $scope.searchGoodsName = {
      name: ''
    };
    $scope.seckillId;
    $scope.numbers;
    $scope.productIds;
    $scope.invoiceHead = undefined;//电子发票发票头
    $scope.zzsInvoice = undefined;//增值税发票
    $scope.isEnd = false;//秒杀活动是否结束
    $scope.unSale;//商品是否下架 true为已下架

    /** 秒杀订单生成的页面 不需发请求从上个页面的cacheservice 得到 **/
    $scope.init = function () {
      $scope.isEnd = false;//秒杀活动是否结束
      SeckillService.getServerTime().then(function (response) {
        var serverTime = response.data.data;//得到服务器时间
        var beginTime = $stateParams.beginTime;
        var endTime = $stateParams.endTime;
        var interval = $interval(function () {
          serverTime = serverTime + 1;
          if (serverTime < beginTime) {//秒杀活动未开始

          } else if (serverTime >= beginTime && serverTime <= endTime || serverTime == beginTime) {//秒杀活动中

          } else if (serverTime > endTime) {//秒杀活动已结束
            $scope.isEnd = true;
            $interval.cancel(interval);
          }
        }, 1000);
      });
      $scope.orderData = {};
      $scope.htmlContent = $stateParams.content;
      $scope.title = $stateParams.title;
      $scope.seckillId = $stateParams.seckillId;
      $scope.numbers = $stateParams.numbers;
      $scope.productIds = $stateParams.productIds;
      $scope.orderConfirmMessage = CacheService.get('seckillOrderInfo');
      if (!$scope.orderConfirmMessage) {
        throw new Error('订单生成失败,fatal---error');
        return;
      }
      $scope.regAddress = $scope.orderConfirmMessage.ordersCommitWrapM.order.address;
      $scope.regInvoice = $scope.orderConfirmMessage.ordersCommitWrapM.billCompany;
      $scope.invoiceHead = $scope.orderConfirmMessage.ordersCommitWrapM.billCompany;
      $scope.zzsInvoice = $scope.orderConfirmMessage.ordersCommitWrapM.memberInvoices.invoiceTitle;
    };

    $scope.$on('$ionicView.beforeEnter', function (e, v) {
      if (v.direction == 'back') {//从地址选择 ，或优惠券 返回 需要查下订单信息的变化，所以发请求
        var param = {
          //productIds:$scope.productIds,//上次进页面时 传递的订单相关参数
          //numbers:$scope.numbers,
          //seckillId:$scope.seckillId,
          //COOKIE_DOMAIN:'mk',//todo  传线上地址
          //DOMAIN_URL:'http://172.24.1.22',
          //POM_STATIC_DOMAIN_NAME:'http://172.24.1.22/mstatic',
          isFromInvoices: 1
        };
        SeckillDetailService.seckillBuy(param).success(function (response) {
          if (response.success == true && response.data != null) {
            $scope.orderConfirmMessage = response.data;
            $scope.regAddress = $scope.orderConfirmMessage.ordersCommitWrapM.order.address;
            $scope.regInvoice = $scope.orderConfirmMessage.ordersCommitWrapM.billCompany;
            $scope.invoiceHead = $scope.orderConfirmMessage.ordersCommitWrapM.billCompany;
            $scope.zzsInvoice = $scope.orderConfirmMessage.ordersCommitWrapM.memberInvoices.invoiceTitle;
          }
          else {
            $scope.showPopup('订单查询失败 ');
          }
        }).error(function (err) {
          alert('网络错误');
        });
      } else {
        $scope.init();
      }
    });

    /* 发票信息跳转 */
    $scope.toInvoice = function (invoiceType) {
      $state.go('invoiceSetup', {invoiceHead: $scope.invoiceHead, invoiceType: invoiceType, enterPage: 1});
    };

    /* 确认订单跳转 */
    $scope.toSubmit = function () {
      if (!$scope.regAddress) {
        var alertInvoice = $ionicPopup.alert({
          template: '收货地址必须填写！',
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
        OrderConfirmSeckillService.toSubmit($scope.seckillId)//秒杀确认订单需传 seckillId
          .success(function (response, status, headers, config) {
            console.log(response);
            if (response.success == true) {
              var messageData = JSON.stringify(response.data.order);
              console.log(messageData);
              $state.go('afterOrderSubmit', {messageData: messageData});
            } else if(response.success == false){
              //$scope.unSale = true;//商品是否下架 true为已下架
              $scope.showPopup(response.message);
            }
          }).error(function () {
            alert('网络失败');
          });
      }
    };
    /* 支付方式跳转 */
    $scope.toPayment = function () {
      $state.go('payment');
    };
    $scope.tosendGoodsTime = function () {
      $state.go('sendGoodsTime');
    };
    //提示消息弹出框
    $scope.showPopup = function (message) {
      var myPopup = $ionicPopup.show({
        template: message
      });
      $timeout(function () {
        myPopup.close();
      }, 1000);
    };
  }]);

APP.service('OrderConfirmSeckillService', ['$http', 'UrlService', function ($http, UrlService) {

  this.toSubmit = function (seckillId) {
    var params = {
      remark: '',
      'seckillId': seckillId
    };
    return $http({
      method: 'POST',
      url: UrlService.getUrl('SECKILL_CONFIRM_ORDER_INFO'),
      params: params
    });
  };
}]);
