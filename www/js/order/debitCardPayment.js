/**
 * Created by xyz on 2016/12/22.
 */
APP.controller('debitCardPaymentController', ['AfterOrderSubmitService', '$scope', '$stateParams', '$rootScope', '$state', '$ionicActionSheet', 'PaymentService', '$ionicLoading', '$ionicHistory', 'PopupService', 'InAppBrowserService', 'EasyConnectService', '$ionicPopup', '$http', 'UrlService','WhiteShowsService','UserService',
    function (AfterOrderSubmitService, $scope, $stateParams, $rootScope, $state, $ionicActionSheet, PaymentService, $ionicLoading, $ionicHistory, PopupService, InAppBrowserService, EasyConnectService, $ionicPopup, $http, UrlService,WhiteShowsService,UserService) {
    var totalAmount = $stateParams.totalAmount;
    var orderSn = $stateParams.orderSn;
    $scope.whereName = $stateParams.whereName; 
    $scope.goBack = function () {
        $ionicHistory.goBack();
    }
}]);
