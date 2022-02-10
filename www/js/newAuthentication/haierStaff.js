/**
 * Created by lenovo on 2018-1-11.
 */



APP.controller('haierStaffControl', ['trueAuthenticationService','$interval','PopupService','LoginService','$rootScope','UrlService','InAppBrowserService','UserService','$ionicHistory','$localstorage','ShopApplyService','$stateParams','$timeout','$scope','$state', 'haierStaffService','IMService','$http',
  function (trueAuthenticationService,$interval,PopupService,LoginService,$rootScope,UrlService,InAppBrowserService,UserService,$ionicHistory,$localstorage,ShopApplyService,$stateParams,$timeout,$scope, $state,haierStaffService,IMService,$http) {
    /*定义变量*/
    $scope.captchaFlag = true; //获取验证码
    $scope.paracont = '获取验证码';
    $scope.isStaff = false; //是否员工认证
    $scope.isBtnShow = false; //提交按钮
    $scope.isActiveTimer = false; // 展示入口
    $scope.staffId=''; //员工号
    $scope.obj ={
      staffId: '',
      verification: ''
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

   $scope.init = function(){
     trueAuthenticationService.doInit() //身份认证
       .success(function(res){
         if(res.success){
           console.log(res)
           if(res.data.empInfo!=null){
             $scope.isStaff = true;
             $scope.staffId = res.data.empInfo.empNo;
             haierStaffService.getActiveIsStart()
               .success(function(res){
                 if(res){
                   $scope.isActiveTimer = true;
                 }else{
                   $scope.isActiveTimer = false;
                 }
               });
           }else{
             $scope.isStaff = false;
             $scope.isActiveTimer = false;
           }

         }else{
           PopupService.showToast(res.message);
         }
       })
   }

   var watch = $scope.$watch('obj',function(){
     if((/^[a-zA-Z0-9]{8}$/.test($scope.obj.staffId)) && (/^[0-9]{6}$/.test($scope.obj.verification))){
       $scope.isBtnShow = true;
     }else{
       $scope.isBtnShow = false;
     }
    },true);


    $scope.toRules = function(ruleId,content){
      var u = navigator.userAgent;
      if (u.indexOf('iPhone') != -1) {
        var ref = InAppBrowserService.open(UrlService.getHead() + 'mstore/sg/helpDetail.html?id=' + ruleId,content);
      } else {
        $state.go('helpDetail', {'helpId': ruleId, 'content': content});
      }
    };

    $scope.goBack = function() {
      $ionicHistory.goBack();
    };
    //提交员工信息
    $scope.submitStaffMsg = function (){
      var staffId = $scope.obj.staffId.toLowerCase();
         haierStaffService.postStaffMsg(staffId,$scope.obj.verification)
           .success(function(res){
             if(res.success){
              if(res.data!=null){
                PopupService.showToast('海尔员工认证成功!');
                haierStaffService.getActiveIsStart()
                  .success(function(res){
                    if(res){
                      $scope.init();
                      $scope.isActiveTimer = true;
                    }else{
                      $scope.isActiveTimer = false;
                      $state.go('trueAuthenticationList');
                    }
                  });

              }else{
                PopupService.showToast(res.message);
              }
             }else{
               PopupService.showToast(res.message);
             }
           });
    };
    var timePromise = undefined;
    var second;
    //获取验证码
    $scope.getIdentifyCode = function () {
      if (!$scope.captchaFlag) { //不到60秒 不发请求
        return;
      }
      if (!(/^[a-zA-Z0-9]{8}$/.test($scope.obj.staffId))) {
        PopupService.showToast('请输入正确的员工编号！');
      } else {
        var staffIds = $scope.obj.staffId.toLowerCase();
        haierStaffService.doInit(staffIds)
          .success(function (response) {
            if (response.success) {
              /* $scope.paracont = "获取验证码";
               $scope.captchaFlag = true;*/
               second = 60;
              timePromise = $interval(function () {
                if (second <= 0) {
                  $interval.cancel(timePromise);
                  timePromise = undefined;
                  second = 60;
                  $scope.paracont = "重发验证码";
                  $scope.captchaFlag = true;
                } else {
                  $scope.paracont = second + "秒后可重发";
                  $scope.captchaFlag = false;
                  second--;
                }
              }, 1000, 100);
            } else {
              PopupService.showToast(response.message);
            }
          });
      }
    };
    // 去开门红
    $scope.goNewYearActive= function(){
      $state.go('bannerTheme',{
        bannerId:UrlService.getCPUrl('KMH_ID')
      });
    };

    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.obj ={
        staffId: '',
        verification: ''
      };
      $scope.staffId ='';
      $scope.captchaFlag = true;
      second = 60;
      $scope.paracont = "获取验证码";
      $interval.cancel(timePromise);
      $scope.init();

    });
  }]);
APP.service('haierStaffService', ['$http', 'UrlService', function ($http, UrlService) {
  this.doInit = function (empNo) { //获取
    var params = {
      empNo:empNo
    }
    return $http.get(UrlService.getUrl('GET_HAIER_STAFF_MSG'),params);
  };
  this.postStaffMsg = function (empNo,captcha) {
    var params = {
      empNo: empNo,
      captcha:captcha
    };
    return $http({
      method: 'POST',
      url: UrlService.getUrl('POST_HAIER_STAFF_MSG'),
      params: params
    });
  };
  this.getActiveIsStart=function(){
    return $http.get(UrlService.getGameUrl('IS_KAIMENHONG_AVAILABLE'));
  };

}]);
