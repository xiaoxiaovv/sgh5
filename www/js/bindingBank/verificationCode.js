

APP.controller('verificationCodeControl', ['$ionicHistory','PopupService','$interval','$timeout','$scope','$state', 'verificationCodeService','$stateParams',function ($ionicHistory,PopupService,$interval,$timeout,$scope, $state,verificationCodeService,$stateParams) {

  /*定义变量*/
  $scope.isComplete=false;   //确定按钮
  $scope.captchaFlag = true;//获取验证码按钮样式
  $scope.isOK=false;        //验证码错误
  $scope.isBindBackOK=false;  //帮卡成功
  $scope.paracont = '重新获取';
  $scope.isAccord=false;      //收不到验证码 弹框
  $scope.obj={
    numbers:''
  };
  $scope.name=$stateParams.ownerName;
  $scope.idNum=$stateParams.identityNo;
  $scope.bankCode=$stateParams.cardNo;
  $scope.mobile=$stateParams.mobile;
  $scope.phoneNum=$stateParams.mobile.replace(/^(\d{3})\d{4}(\d{4})$/,'$1****$2'); // 处理显示的手机号
  $scope.bankNo=$stateParams.bankNo;
  $scope.phoneNumber=$stateParams.phoneNumber; // 银行电话
  var timePromise = undefined;
  var  second;
  $scope.goBack = function() {
    $ionicHistory.goBack();
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

  $scope.commonFnCode=function () {
     second=60;
    timePromise = $interval(function () {
      if (second <= 0) {
        $interval.cancel(timePromise);
        timePromise = undefined;
        second = 60;
        $scope.paracont = "重新获取";
        $scope.captchaFlag = true;
      } else {
        $scope.paracont = (second -1 ) + "秒后可重发";
        $scope.captchaFlag = false;
        second --;
      }
    }, 1000, 100);
  };
  $scope.init=function () {
      verificationCodeService.VerificationCode($scope.mobile)
        .success(function (response) {
          if(response.success){  // 发送成功
            $scope.commonFnCode();
            // var second = 60;
            // timePromise = $interval(function () {
            //   if (second <= 0) {
            //     $interval.cancel(timePromise);
            //     timePromise = undefined;
            //     second = 60;
            //     $scope.paracont = "重新获取";
            //     $scope.captchaFlag = true;
            //   } else {
            //     $scope.paracont = second + "秒后可重发";
            //     $scope.captchaFlag = false;
            //     second--;
            //   }
            // }, 1000, 100);
          }else{
            PopupService.showToast('获取验证码失败！');
          }
        });
  };

  $scope.$on('$ionicView.beforeEnter', function () {
     $scope.captchaFlag=true;
    second=60;
    $scope.paracont = "重新获取";
    $interval.cancel(timePromise);
    $scope.commonFnCode();
    $scope.isAccord=false;
    $scope.isOK=false;
    $scope.isBindBackOK=false;
    $scope.obj.numbers='';

  });

  //点击 确定
  $scope.goAuthentication=function () {
    verificationCodeService.bankCheckOK($scope.name,$scope.bankCode,$scope.bankNo,$scope.mobile,$scope.obj.numbers)
      .success(function (response) {
         console.log(response)
         $scope.message=response.message;
         if(response.success){ //绑定成功
           $scope.isBindBackOK=true;
           $scope.isOK=false;
           $timeout(function () {
             $scope.isBindBackOK=false;
             $state.go('personnalCenter');
           },1000);
         }else{
           $scope.isBindBackOK=false;
           $scope.isOK=true;
         }
      })
  };

  //点击 手机验证 确定按钮
  $scope.phoneClose=function () {
    $scope.isAccord=false;
  };
  $scope.Close=function () {
    $scope.isOK=false;
  };
  $scope.isReceived=function () {
      $scope.isAccord=true;
  };

  //重新获取
  $scope.againGet=function () {

    if (!$scope.captchaFlag) { //不到60秒 不发请求
        return;
    }else{
      $scope.init();
    }

  };

  //输入验证码 校验

  $scope.myFun=function () {
    if(!(/^\d{6}$/.test($scope.obj.numbers))){
      $scope.isComplete=false;
       }
    else{
      $scope.isComplete=true;
    }
  };



}]);


APP.service('verificationCodeService', ['$http', 'UrlService', function ($http, UrlService) {
  this.VerificationCode = function (num) { // 获取验证码
    var params = {
      mobile:num
    };
    return $http.get(UrlService.getUrl('GET_CODEID'), params);
  };
  this.bankCheckOK = function (username,num,bankNo,phoneNum,captcha) { // 发给后台
    var params = {
      ownerName: username,
      cardNo: num,
      bankNo:bankNo,
      mobile: phoneNum,
      captcha:captcha
    };
    console.log(params)
     //return $http.post(UrlService.getUrl('POST_BANKDATA'), params);
    return $http.post(UrlService.getUrl('POST_BANKDATA')+'?ownerName='+params.ownerName+'&cardNo='+params.cardNo+'&bankNo='+params.bankNo+'&mobile='+params.mobile+'&captcha='+params.captcha);

  };

}]);
