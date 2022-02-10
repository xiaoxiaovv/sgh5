/**
 * Created by xy on 2016/3/22.
 */
APP.controller('PaymentController', ['$scope', '$stateParams', '$rootScope', '$state', '$ionicActionSheet', 'PaymentService',
  function ($scope, $stateParams, $rootScope, $state, $ionicActionSheet, PaymentService) {
    /** 变量声明 **/
    $scope.htmlContent = $stateParams.content;
    $scope.title = $stateParams.title;

    $scope.payWay  = 'alipaymobile';
    $scope.zfb_checked = true;
    $scope.huod_checked = false;
    $scope.kjt_checked = false;
    $scope.alipayText = null;
    $scope.codText = null;
    $scope.kjtpayText = null;
    $scope.wxpay_checked = false;
    $scope.wxpayText =null;

    $scope.paymentCode = $stateParams.paymentCode; //路由传来 支付方式

    $scope.payWayList =[];

    $scope.payWayMap = {
      'alipaymobile':'支付宝',
      'cod':'货到付款',
      'kjtpay':'快捷通',
      'wxpay':'微信支付'
    };

    /** 方法 **/
    $scope.init = function () {
      $scope.htmlContent = $stateParams.content;
      $scope.title = $stateParams.title;
      $scope.paymentCode = $stateParams.paymentCode;

      /** 请求接口 */
      PaymentService.getSendGoodsDates().success(function (response, status, headers, config) {

        $scope.payWayList = response.data.payWayList;


        /** 支付方式数据绑定 */
        for (var i = 0; i < response.data.payWayList.length; i++) {
          if (response.data.payWayList[i].paymentCode == 'alipaymobile') {
            $scope.alipayText = response.data.payWayList[i].paymentName;
          } else if (response.data.payWayList[i].paymentCode == 'cod') {
            $scope.codText = response.data.payWayList[i].paymentName;
          } else if (response.data.payWayList[i].paymentCode == 'kjtpay') {
            $scope.kjtpayText = response.data.payWayList[i].paymentName;
          }
        }
        console.log(response);
      });

      console.log('do init!!');
    };

    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.init();
    });
    /* 选择支付方式 */
    $scope.checkedpay = function (pcode) {

      $scope.paymentCode  = pcode;
    };

    /** 确定按钮点击事件*/
    $scope.pushPayWay = function (){
      if(!$scope.paymentCode){
        alert('请选择一个支付方式');
        return ;
      }
      PaymentService.submitSendGoodsDates($scope.paymentCode)
        .success(function (response, status, headers, config) {
          if (response.success == true) {
            $scope.$ionicGoBack();
          }else{
            alert(response.message);
          }
      });
    }

  }]);


APP.service('PaymentService', ['$http', 'UrlService', function ($http, UrlService) {
  this.getSendGoodsDates = function () {//memberId
    var params = {
      toUrl: '1'
    };
    return $http.get(UrlService.getUrl('PAY_WAY'),params);
  };
  this.submitSendGoodsDates = function (payWay) {//memberId
    var params = {
      payWay: payWay
    };
    //return $http.post(UrlService.getUrl('SUBMIT_PAY_WAY'), params);
    //return $http.get(UrlService.getUrl('SUBMIT_PAY_WAY'));
    return $http({
      method: 'POST',
      url: UrlService.getUrl('SUBMIT_PAY_WAY'),
      params: params
    });
  };
  //发起微信支付请求，从服务端得到prepayId ，以供微信客户端 支付使用
  this.wPay = function(params){
    return $http.get(UrlService.getUrl('WECHAT_PAY'),params);
  };

  this.kjtPay = function(params){

    return $http.get(UrlService.getUrl('PAY_KJT'),params);
  };

  this.orderPayCheck = function(params){
    return $http.get(UrlService.getUrl('ORDER_200PAYCHECK'),params);
  };
}]);
