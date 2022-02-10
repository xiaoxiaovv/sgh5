/**
 * creater:shuang2.wang@dhc.com.cn
 * create time:2016/3/22
 * describe：找回密码Controller
 **/
APP.controller('RequestPasswordController', ['$localstorage','$scope', 'RequestPasswordService', 'PopupService', '$interval', '$state','$timeout',
  function ($localstorage,$scope, RequestPasswordService, PopupService, $interval, $state,$timeout) {

    /** 变量声明 **/
    $scope.captchaFlag = true;//获取验证码按钮样式
    $scope.isClearText = false;//密码明文显示
    $scope.isClearPassword = 'password';
    $scope.paracont = "获取验证码";
    //用户找回密码所需信息
    $scope.userInfo = {
      mobileNum: '',
      password: '',
      captcha: '',
      captchaImg: ''
    };
    /** 方法 **/
      //密码明暗文切换显示
    $scope.clearText = function () {
      if ($scope.isClearText) {
        $scope.isClearPassword = 'password';
        $scope.isClearText = !$scope.isClearText;
      } else {
        $scope.isClearPassword = 'text';
        $scope.isClearText = !$scope.isClearText;
      }
    };
    //发送图片验证码
    $scope.setImgCatpcha = function () {
      $scope.identifyCodeImg = RequestPasswordService.getImgCaptcha() + "?rnd=" + Math.random()+"&flag="+$localstorage.get('sg_login_token_secret').substring(6);
    };
    //获取验证码
    $scope.getIdentifyCode = function () {
      if (!($scope.globalConstant.mobileNumberRegExp.test($scope.userInfo.mobileNum))) {
        PopupService.showToast('请输入正确的手机号码！');
      } else if ($scope.userInfo.captchaImg.length == 0) {
        PopupService.showToast('请输入验证码！');
      } else {
        RequestPasswordService.getCaptcha($scope.userInfo.mobileNum, $scope.userInfo.captchaImg)
          .success(function (response, status, headers, config) {
            console.log('response:', response);
            if (response.success) {
              /* $scope.paracont = "获取验证码";
               $scope.captchaFlag = true;*/
              var second = 60, timePromise = undefined;
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
            } else if (response.message) {
              PopupService.showToast(response.message);
            } else {
              PopupService.showToast('获取验证码失败！');
            }
          });
      }
    };
    //找回密码
    $scope.passwordSubmit = function () {
      if ($scope.userInfo.mobileNum.length == 0) {
        PopupService.showToast('请输入您的手机号！');
      } else if (!($scope.globalConstant.passwordRegExp.test($scope.userInfo.password))) {
        PopupService.showToast('密码为数字、字母、特殊符号中的两种组合，长度6位~20位(字母区分大小写)');
      } else if ($scope.userInfo.captcha.length == 0) {
        PopupService.showToast('获取验证码失败！');
      } else {
        RequestPasswordService.requestPassword($scope.userInfo.mobileNum, $scope.userInfo.captcha, $scope.userInfo.password,$scope.userInfo.captchaImg)
          .success(function (response, status, headers, config) {
            console.log('response:', response);
            if (response.success) {
              PopupService.showToast('修改成功');
              $timeout(function () {
                $state.go('login');
              },1000);
            } else if (response.message) {
              PopupService.showToast(response.message);
              $scope.setImgCatpcha();
            } else {
              PopupService.showToast('提交失败！');
              $scope.setImgCatpcha();
            }
          });
      }
    };
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.setImgCatpcha();
    })
  }]);


/**
 * creater:shuang2.wang@dhc.com.cn
 * create time:2016-03-22
 * describe：找回密码Service
 **/
APP.service('RequestPasswordService', ['$http', 'UrlService', function ($http, UrlService) {
  //找回密码
  this.requestPassword = function (mobileNum, captcha, password,imgCaptcha) {
    var params = {
      mobileNum: mobileNum,
      captcha: captcha,
      password: encodeURIComponent(password),
      imgCaptcha:imgCaptcha
    };
    return $http({
      method: 'POST',
      url: UrlService.getUrl('REQUEST_PASSWORD'),
      params: params
    });
  };
  //获取验证码
  this.getCaptcha = function (mobileNum, captcha) {
    var params = {
      mobileNum: mobileNum,
      captcha: captcha
    };
    return $http.get(UrlService.getUrl('GET_PASSWORD_CAPTCHA'), params);
  };
  //获取图片验证码
  this.getImgCaptcha = function () {
    return UrlService.getUrl('GET_IMG_CAPTCHA');
  };
}]);
