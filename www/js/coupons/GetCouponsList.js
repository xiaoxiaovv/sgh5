/**
 * Created  on 2017/6/27.
 */
 APP.controller('GetCouponsListController', ['$rootScope','HomePageService','$scope', '$ionicHistory', 'PopupService', 'CreditService', 'UrlService', '$stateParams','$http','GetCouponsService', '$ionicScrollDelegate', '$state', '$interval','UserService',
   function($rootScope,HomePageService,$scope, $ionicHistory, PopupService,CreditService, UrlService, $stateParams,$http,GetCouponsService, $ionicScrollDelegate,$state,$interval,UserService) {
     var sharePic = 'http://www.ehaier.com/mstatic/wd/v2/img/sg.png';
     $scope.dataList = '';
     //优惠券使用类型id
     $scope.typeIdDefault = '';
     var couponsId = '';
     var telPhone = '';
     $scope.divStr = [];
     $scope.remindme = false;
     $scope.remindSuccess = false;
     $scope.canSubmit = false;
     var countDownNowTime = [];
     var countDownStartTime = [];
     var remindArray = [];
     var timer = [];
     var timerLength = '';
     $scope.hasmore = false;
     $scope.isHasCoupons = false;//是否有优惠券
     var startIndex = 1;
     var pageSize = 5;
     $scope.flagNum = false;
     $scope.messageImgUrl = "http://cdn09.ehaier.com/shunguang/H5/www/img/message_gray@2x.png";
     // 倒计时定义
     $scope.endT = [];
     $scope.endTt = [];
     $scope.endTh = [];
     $scope.endTm = [];
     $scope.endTs = [];
     // 排列div
     function cricles(){
       for(var i=0; i<window.screen.availWidth/12; i++){
           $scope.divStr[i]=i*12+4;
         }
       }


     $scope.goBack = function() {
       if ($rootScope.fromState == 'advertisement') {
         $state.go('homePage');
       } else {
         $scope.$ionicGoBack();
       }
     };
     $scope.share = function() {
       if (window.cordova) {
          if (!UserService.getUser().mid) {
          $state.go('login');
          return;
        }
         $scope.showShare = true;
       } else {
         PopupService.showAlert('只能在app分享', '抱歉，只能在app分享');
       }
     };

     if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {//只有ios app 特有的样式
       $scope.paddingtopClass = {
         "margin-top": "16px"
       };
       $scope.paddingtopClasscontent = {
         "top": "60px"
       };
       $scope.typeClass = {
         "top": "59px"
       }
     }else{
       $scope.paddingtopClass = {
         "margin-top": "0px"
       };
       $scope.paddingtopClasscontent = {
         "top": "44px"
       };
       $scope.typeClass = {
         "top": "43px"
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
     //关闭所有类别的字段
     $scope.typeAllShow = false;
     //类别默认高亮的字段
     $scope.typeDefault = 0;
     //类别假数据
     $scope.typeDataList = [];
     //类别高亮效果
     $scope.isTypeStyle = {
       "border-bottom":"3px solid #2979FF",
       "color": "#2979FF"
     }
     $scope.noTypeStyle = {
       "color": "rgba(102,102,102,0.87)"
     }
     $scope.isTypeStyleAll = {
       "border":"1px solid #2979FF",
       "color": "#2979FF"
     }
     $scope.noTypeStyleAll = {
       "color": "rgba(76,76,76,0.87)",
       "border": "1px solid #999"
     }
      //类别点击方法
      $scope.typeButton = function(typeIndex,typeId){
        $scope.isHasCoupons = false;
        $scope.typeDefault = typeIndex;
        $scope.typeAllShow = false;
        $scope.typeIdDefault = typeId;
        $scope.init(typeId);
        $ionicScrollDelegate.scrollTop();
      }
      //all类别点击方法
      $scope.allTypeButton = function(typeIndex,typeId){
        $scope.isHasCoupons = false;
        if(typeIndex>1){
          var isTtypeDataList = $scope.typeDataList[typeIndex];
          $scope.typeDataList.splice(typeIndex, 1);
          $scope.typeDataList.splice(1, 0, isTtypeDataList);
          $scope.typeDefault = 1;
        }else{
          $scope.typeDefault = typeIndex;
        }
        $scope.typeAllShow = false;
        $scope.typeIdDefault = typeId;
        $scope.init(typeId);
        $ionicScrollDelegate.scrollTop();
      }
      //关闭所有类别的方法
      $scope.cotAllType = function(trueOrFalse){
        $scope.typeAllShow = trueOrFalse;
      }

     /*********************分享标签－whiteBird start*********************/
     //复制
   $scope.copeText = function (text) {
     if(window.cordova)
     {
       cordova.plugins.clipboard.copy(text);
       PopupService.showToastShort('复制成功');
     }
     else
     {
       PopupService.showToast('请下载APP执行此操作');
     }
   };
   $scope.hideblackCover = function(){
     $scope.showShare = false;
   };
   $scope.shareToPlatform = function(index){

     var title = '顺逛领券频道,优惠券等您来抢',
         content = '给您推荐顺逛领券频道,超值优惠券每日限量抢,不可错过哦!',
         pic = sharePic,
         url = UrlService.getShareLinkHeader()+'getCouponsList/'+UserService.getUser().mid;

     if (window.umeng) {
       if(index==0)
       {
         window.umeng.shareToSina(title, content, pic, url, 0, null, CreditService.shareSuccessCallback);
       }else if(index==1)
       {
         window.umeng.shareToWechatSession(title, content, pic, url, 0, null, CreditService.shareSuccessCallback);
       }else if(index==2)
       {
         window.umeng.shareToWechatTimeline(title, content, pic, url, 0, null, CreditService.shareSuccessCallback);
       }else if(index==3)
       {
         window.umeng.shareToQQ(title, content, pic, url, 0, null, CreditService.shareSuccessCallback);
         CreditService.qqShare();
       }else if(index==4)
       {
         window.umeng.shareToQzone(title, content, pic, url, 0, null, CreditService.shareSuccessCallback);
         CreditService.qqShare();
       }
       if(index==5)
       {
         $scope.copeText(url);
       }else{
         CreditService.successShare();
       }
     } else {
       alert('umeng undefined 只能在app分享');
     }

     $scope.showShare = false;
   };
   /*********************分享标签－whiteBird end*********************/
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
              // $ionicScrollDelegate.scrollTop();
              startIndex = 1;
              $scope.init($scope.typeIdDefault);
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
     function countDown(nowtime,starttime,index){
      $scope.endT[index] = starttime - nowtime;
      timer[index] = $interval(function () {
        $scope.endTt[index] = Format(Math.floor($scope.endT[index] / 86400));

        $scope.endTh[index] = Format(Math.floor(($scope.endT[index] - $scope.endTt[index] * 86400) / 3600));

        $scope.endTm[index] = Format(Math.floor(($scope.endT[index] - $scope.endTt[index] * 86400 - $scope.endTh[index] * 3600) / 60));

        $scope.endTs[index] = Format($scope.endT[index] - $scope.endTt[index] * 86400 - $scope.endTh[index] * 3600 - $scope.endTm[index] * 60);
        $scope.endT[index]--;
        if ($scope.endT[index] == -1) {
          $state.reload();
          $interval.cancel(timer[index]);
        }
      }, 1000);
    }
    //领取新优惠券方法
    $scope.getNewCoupons = function(id){
      HomePageService.isWdHost()
        .success(function (res) {
          $rootScope.isWdHost = res.data.isHost;
          if($rootScope.isWdHost==-1){//如果没有登录 跳转到登录页面
            $state.go('login');
          }else{
            GetCouponsService.doGetNewCoupons(id)
              .success(function (response) {
                  if(response.success){
                    $rootScope.couponXyzType = true;
                    // $ionicScrollDelegate.scrollTop();
                    startIndex = 1;
                    $scope.init($scope.typeIdDefault);
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
        })
       }
     //数据初始化
     $scope.init = function(typeId){
       for(var i=0; i<remindArray.length; i++){
            $interval.cancel(timer[remindArray[i]]);
       }
       remindArray = [];
       $scope.dataList = '';
       GetCouponsService.doInit(1,5,typeId)
         .success(function (response, status, headers, config) {
           if(response.success){
             if(response.data !== null){
               $scope.dataList = response.data;
               for(var a=0; a<$scope.dataList.length; a++){
                 if($scope.dataList[a].displayType == 3 || $scope.dataList[a].displayType == 4){
                   remindArray.push(a);
                   countDownNowTime[a] = $scope.dataList[a].nowTime;
                   countDownStartTime[a] = $scope.dataList[a].activityStartTime;
                 }
               }

             for(var i=0; i<remindArray.length; i++){
               countDown(countDownNowTime[remindArray[i]],countDownStartTime[remindArray[i]],remindArray[i]);
             }
             if($scope.dataList.length < response.totalCount){
               $scope.$broadcast('scroll.infiniteScrollComplete');
               $scope.hasmore = true;
             }else{
               $scope.$broadcast('scroll.infiniteScrollComplete');
               $scope.hasmore = false;
               }
             }else{
               $scope.isHasCoupons = true;
             }
           }else{
             $scope.hasmore = false;
           }
         });
     }
     //数据初始化
     $scope.initType = function(){
       GetCouponsService.doInitType()
         .success(function (response, status, headers, config) {
           if(response.success){
             $scope.typeDataList = response.data;
             $scope.typeIdDefault = $scope.typeDataList[0].id;
             $scope.init($scope.typeIdDefault);
           }else{
             PopupService.showToast(response.message);
           }
         });
     }
     //数据上拉加载
     $scope.loadMore = function(){
       startIndex++;
       GetCouponsService.doInit(startIndex,pageSize)
         .success(function (response, status, headers, config) {
           if(response.success){
            //  for(var i=0; i<remindArray.length; i++){
            //       $interval.cancel(timer[remindArray[i]]);
            //  }
             timerLength = remindArray.length;
             remindArray = [];
             if(response.data){
               $scope.dataList = $scope.dataList.concat(response.data);
             }
             for(var a=0; a<$scope.dataList.length; a++){
               if($scope.dataList[a].displayType == 3 || $scope.dataList[a].displayType == 4){
                  remindArray.push(a);
                  countDownNowTime[a] = $scope.dataList[a].nowTime;
                  countDownStartTime[a] = $scope.dataList[a].activityStartTime;
               }
             }
             for(var i=timerLength; i<remindArray.length; i++){
               countDown(countDownNowTime[remindArray[i]],countDownStartTime[remindArray[i]],remindArray[i]);
             }

             if($scope.dataList.length < response.totalCount){
               $scope.$broadcast('scroll.infiniteScrollComplete');
               $scope.hasmore = true;
             }else{
                 $scope.$broadcast('scroll.infiniteScrollComplete');
               $scope.hasmore = false;
             }
           }else{
              $scope.hasmore = false;
           }
         });
     }

     $scope.$on('$ionicView.beforeEnter', function(e,v) {
      //  $ionicScrollDelegate.scrollTop();
       if(v.direction == 'back'){
         if($ionicHistory.viewHistory().forwardView.stateName == 'ClassifyMessageCenter'){
           HomePageService.getUnReadMsg()
             .success(function (res) {
               if (res.data > 0) {
                 $scope.flagNum = true;
               } else {
                 $scope.flagNum = false;
               }
             });
         }
         if($rootScope.couponXyzType){
           $scope.typeIdDefault = '';
           $scope.typeDefault = 0;
           $scope.typeAllShow = false;
           $scope.isHasCoupons = false;
           $scope.dataList = "";
          //  $ionicScrollDelegate.scrollTop();
           startIndex = 1;
           $scope.hasmore = false;
           cricles();
           $scope.initType();
           HomePageService.getUnReadMsg()
             .success(function (res) {
               if (res.data > 0) {
                 $scope.flagNum = true;
               } else {
                 $scope.flagNum = false;
               }
             });
         }
         $rootScope.couponXyzType = false;
         return;
       }else{
         $ionicScrollDelegate.scrollTop();
       }
       $scope.typeIdDefault = '';
       $scope.typeDefault = 0;
       $scope.typeAllShow = false;
       $scope.isHasCoupons = false;
       $scope.dataList = "";
      //  $ionicScrollDelegate.scrollTop();
       startIndex = 1;
       $scope.hasmore = false;
       cricles();
       $scope.initType();
       HomePageService.getUnReadMsg()
         .success(function (res) {
           if (res.data > 0) {
             $scope.flagNum = true;
           } else {
             $scope.flagNum = false;
           }
         });
     });
     $scope.$on('$ionicView.beforeLeave', function() {
       for(var i=0; i<remindArray.length; i++){
            $interval.cancel(timer[remindArray[i]]);
       }
     });

     $rootScope.$on('COUPONS_DETAIL_STATE', function (event,data) {
       $scope.init(data);
     });
   }
 ]);


 APP.service('GetCouponsService', ['$http', 'UrlService', function ($http, UrlService) {
   //初始化
   this.doInit = function (startIndex, pageSize,couponCateId) {
     var params = {
       startIndex: startIndex,
       pageSize: pageSize,
       couponCateId:couponCateId
     };
     return $http.get(UrlService.getNewUrl('NEW_GET_COUPONS_LIST'), params);
   };
   //初始化分类
   this.doInitType = function () {
     return $http.get(UrlService.getNewUrl('NEW_GET_COUPONS_TYPE'));
   };
   //优惠券提醒
   this.doRemindCoupons = function (phone, couponId) {
     var params = {
       phone: phone,
       couponId: couponId
     };
     return $http.get(UrlService.getUrl('REMIND_COUPONS_LIST'), params);
   };
   //优惠券领取
   this.doGetNewCoupons = function (couponId) {
     var params = {
       couponId: couponId
     };
     return $http.get(UrlService.getNewUrl('GET_NEW_COUPONS'), params);
   };
 }]);
