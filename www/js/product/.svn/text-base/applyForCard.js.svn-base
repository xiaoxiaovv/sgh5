/**
 * Created by xyz on 2016/12/22.
 */
APP.controller('applyForCardController', ['AfterOrderSubmitService', '$scope', '$stateParams', '$rootScope', '$state', '$ionicActionSheet', 'PaymentService', '$ionicLoading', '$ionicHistory', 'PopupService', 'InAppBrowserService', 'EasyConnectService', '$ionicPopup', '$http', 'UrlService','WhiteShowsService','UserService',
    function (AfterOrderSubmitService, $scope, $stateParams, $rootScope, $state, $ionicActionSheet, PaymentService, $ionicLoading, $ionicHistory, PopupService, InAppBrowserService, EasyConnectService, $ionicPopup, $http, UrlService,WhiteShowsService,UserService) {
   
    $scope.goBack = function () {
        console.log(1345);
        $scope.$ionicGoBack();
    }
    $scope.toApplyForCard = function (index) {
        // console.log(index);
        var url = null;
        if (index == 1) {
        	url = 'https://xyk.cebbank.com/cebmms/apply/ps/card-index.htm?req_card_id=11753&pro_code=FHTG107707SJ01HESG';
        } else if (index == 2){
        	url = 'https://xyk.cebbank.com/cebmms/apply/ps/card-index.htm?req_card_id=11754&pro_code=FHTG107707SJ01HESG';
        } else if (index == 3) {
            url = 'https://xyk.cebbank.com/cebalipay/apply/fz/card-app-status.htm';
        }
        // window.emc.presentH5View(url,'联名卡申请');
        if (window.cordova) {
            if (index == 3) {
                window.emc.presentH5View(url,'查询联名卡进度');
            } else {
                window.emc.presentH5View(url,'联名卡申请');
            }
        } else {
        	window.location.href = url;
        }
    }
    console.log(321312321);
}]);
