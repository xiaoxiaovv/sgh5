/**
 * Created by xyz on 2016/12/22.
 */
APP.controller('BankCardChoseController', ['bankCardPaymentListService', '$scope', '$stateParams', '$state', '$ionicHistory', 'PopupService', '$ionicPopup', '$http', 'UrlService','UserService',
    function (bankCardPaymentListService, $scope, $stateParams, $state, $ionicLoading, $ionicHistory, PopupService, $ionicPopup, $http, UrlService,UserService) {
    /** 请求接口 */
    // console.log($stateParams);
    $scope.orderSn = $stateParams.orderSn;
    $scope.totalAmount = $stateParams.totalAmount;
    $scope.cardsArr = [
        // {
        //     imgUrl:'img/CCB.png',
        //     name:'建行储蓄卡',
        //     active:'活动信息'
        // },
        // {
        //     imgUrl:'img/CCB.png',
        //     name:'建行信用卡',
        //     active:'活动信息'
        // },
        // {
        //     imgUrl:'img/12CEB.png',
        //     name:'光大储蓄卡',
        //     active:'活动信息'
        // },
        // {
        //     imgUrl:'img/12CEB.png',
        //     name:'光大信用卡',
        //     active:'活动信息'
        // }
    ]
    $scope.goCart = function () {
        $state.go('orderManage');
    };
    $scope.toPay = function (index) {
        console.log(123456, index);
        var params = {
            orderSn: $scope.orderSn,
            totalAmount:$scope.totalAmount,
            whereName:index
        }
        console.log(params);
        // console.log('=====',index);
        switch (index) {

            case 'ccb_credit':
                // var params = {orderSn: $scope.orderSn}
                $state.go('debitCardPayment', params);
                break;
            case 'ccb_fenqi':
                // var params = {orderSn: $scope.orderSn}
                $state.go('ccbfenqi', params);
                break;
            case 'ceb_credit':
                $state.go('debitCardPayment', params);
                break;
            case 'ceb_fenqi':
                // var params = {orderSn: $scope.orderSn}
                $state.go('ccbfenqi', params);
                break;
        }
    }
    $scope.goBack = function () {
        
        $scope.$ionicGoBack();
    }
    $scope.$on('$ionicView.beforeEnter', function () {
        bankCardPaymentListService.getCcbCost('sg').success(function (json){
            console.log(json);
            if (json.success) {
                $scope.cardsArr = json.data;
            }
        });
    });
}]);


APP.service('bankCardPaymentListService', ['$http', 'UrlService', function ($http, UrlService) {
    this.getCcbCost = function(channel){
        // var params = {
        //     category:1,
        //     channel:channel,
        //     callback:'JSON_CALLBACK'
        // };
        var myUrl = UrlService.getPayCenter('PAY_TYPE_LIST')+'?callback=JSON_CALLBACK'+'&channel='+channel+'&category=1';
        return $http.jsonp(myUrl);
    };
    // this.payRequest = function(params){
    //   var myUrl = UrlService.getCcbUrl('CCB_FENQI_W') +'?callback=JSON_CALLBACK'+'&orderSn='+params.orderSn+'&num='+params.num+'&channel='+params.channel+'&payType='+params.payType+'&callbackUrl='+'v3/h5/pay/callback.html';
    //   return $http.jsonp(myUrl);
    // }

}]);


