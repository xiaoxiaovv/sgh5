 APP.controller('CouponsDetailController', ['$rootScope','$scope', '$ionicHistory', 'PopupService', 'CreditService', 'UrlService', '$stateParams','$http','CouponsDetailNewService','$ionicScrollDelegate','GetCouponsService','$interval',
   function($rootScope,$scope, $ionicHistory, PopupService, CreditService, UrlService, $stateParams,$http,CouponsDetailNewService,$ionicScrollDelegate,GetCouponsService,$interval) {
    var couponsId = $stateParams.cId;
    var telPhone = '';
    var typeId = '';
    $scope.data = "";
    var timer;
    $scope.remindme = false;
    $scope.remindSuccess = false;
    $scope.canSubmit = false;
    // 倒计时定义
    $scope.endT = "";
    $scope.endTt = "";
    $scope.endTh = "";
    $scope.endTm = "";
    $scope.endTs = "";
     // 排列div
     $scope.divStr = [];
     function cricles(){
       for(var i=0; i<window.screen.availWidth/12; i++){
           $scope.divStr[i]=i*12+4;
         }
       }
       //样式蓝色or红色
       $scope.backGroundBlue = {
         "background":"url("+$rootScope.imgBaseURL+"img/couponblue.png) no-repeat",
         "background-size": "100% 118px"
       }
       $scope.backGroundRed = {
         "background":"url("+$rootScope.imgBaseURL+"img/coupon.png) no-repeat",
         "background-size": "100% 118px"
       }
       // 提醒开关
       $scope.openRemindMe = function(couponsID){
         couponsId = couponsID;
         $scope.remindme = true;
       }
       $scope.closeRemindMe = function(){
         $scope.remindme = false;
       }
       // 手机号校验
      function telRuleCheck2(string) {
           var pattern = /^1[34578]\d{9}$/;
           if (pattern.test(string)) {
             return true;
           }
           return false;
         };
       $scope.telVerification = function(tel){
         if(tel.length == 11){
           if(telRuleCheck2(tel)){
             telPhone = tel;
             $scope.canSubmit = true;
           }else{
             $scope.canSubmit = false;
           }
         }else{
           $scope.canSubmit = false;
         }
       }
       //手机号提交都后台的方法
       $scope.submitBackstage = function(){
         GetCouponsService.doRemindCoupons(telPhone,couponsId)
           .success(function (response) {
               $scope.message = response.message;
               $scope.remindme = false;
               $scope.remindSuccess = true;
               setTimeout(function(){
                 $scope.$apply(function(){
                   $scope.remindSuccess = false;
                 });
               },1500);
               if(response.success){
                 $ionicScrollDelegate.scrollTop();
                 $scope.getCouponsData();
                 $rootScope.$broadcast('COUPONS_DETAIL_STATE',typeId);
               }
             });
          }
       //计算进度条
       $scope.progress = function(a){
         return a*0.9;
       }
       // 格式化
       function Format(a) {
         if (a < 10) {
           a = '0' + a;
         } else {
           a = a;
         }
         return a;
       };
       //  倒计时方法
       function countDown(nowtime,starttime){
        $scope.endT = starttime - nowtime;
        timer = $interval(function () {
          $scope.endTt = Format(Math.floor($scope.endT / 86400));

          $scope.endTh = Format(Math.floor(($scope.endT - $scope.endTt * 86400) / 3600));

          $scope.endTm = Format(Math.floor(($scope.endT - $scope.endTt * 86400 - $scope.endTh * 3600) / 60));

          $scope.endTs = Format($scope.endT - $scope.endTt * 86400 - $scope.endTh * 3600 - $scope.endTm * 60);
          $scope.endT--;
          if ($scope.endT == -1) {
            $state.reload();
            $interval.cancel(timer);
          }
        }, 1000);
      }
       //领取新优惠券方法
       $scope.getNewCoupons = function(id){
         GetCouponsService.doGetNewCoupons(id)
           .success(function (response) {
               if(response.success){
                 $ionicScrollDelegate.scrollTop();
                 $rootScope.$broadcast('COUPONS_DETAIL_STATE',typeId);
                 startIndex = 1;
                 $scope.getCouponsData();
               }else{
                 $scope.remindSuccess = true;
                 $scope.message = response.message;
                 setTimeout(function(){
                   $scope.$apply(function(){
                     $scope.remindSuccess = false;
                   });
                 },1500);
               }
             });
          }

     $scope.goBack = function() {
       if ($rootScope.fromState == 'advertisement') {
         $state.go('homePage');
       } else {
         $scope.$ionicGoBack();
       }
     };

     if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {//只有ios app 特有的样式
       $scope.paddingtopClass = {
         "margin-top": "16px"
       };
       $scope.paddingtopClasscontent = {
         "top": "60px"
       }
     }else{
       $scope.paddingtopClass = {
         "margin-top": "0px"
       };
       $scope.paddingtopClasscontent = {
         "top": "44px"
       }
     }

     //获取优惠券
     $scope.getCouponsData= function(){
       $interval.cancel(timer);
       CouponsDetailNewService.getCouponsDataNew(couponsId)
         .success(function (response) {
             $scope.data = response.data;
             countDown(response.data.nowTime,response.data.activityStartTime);
           });
        }

     $scope.$on('$ionicView.beforeEnter', function() {
       $scope.data = '';
       typeId = $stateParams.type;
       cricles();
       $scope.getCouponsData();
     });
     $scope.$on('$ionicView.beforeLeave', function() {
       $interval.cancel(timer);
     });
   }
 ]);



 APP.service('CouponsDetailNewService', ['$http', 'UrlService', function ($http, UrlService) {
   this.getCouponsDataNew = function (couponId) {
     var params = {
       couponId: couponId
     };
     return $http.get(UrlService.getUrl('COUPONS_DETAIL_LIST'), params);
   };
 }]);
