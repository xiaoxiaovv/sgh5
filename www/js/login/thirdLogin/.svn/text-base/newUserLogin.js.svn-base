/**
 * creater:shuang2.wang@dhc.com.cn
 * create time:2016/3/22
 * describe：登录控制器
 **/
APP.controller('newUserLoginController', ['$stateParams','$location','$timeout','HomePageService','newUserLoginService','$interval', '$rootScope', '$scope', '$localstorage', 'LoginService', '$state', 'UserService', '$ionicPopup', 'PaymentService', 'PopupService', '$ionicHistory', 'RegisterService', '$http', 'UrlService', 'ServiceConversationService', 'GroupSettingService', 'IMService','GetStatisticInfoService',
  function ($stateParams,$location,$timeout,HomePageService,newUserLoginService,$interval, $rootScope, $scope, $localstorage, LoginService, $state, UserService, $ionicPopup, PaymentService, PopupService, $ionicHistory, RegisterService, $http, UrlService, ServiceConversationService, GroupSettingService, IMService,GetStatisticInfoService) {
    /** 变量声明 **/
    $scope.isBuyer = '1'; //判断用户角色信息；'0'为买家；'1'为卖家
    $scope.isFocusShow = true;
    $scope.identifyCodeImg = ''; //验证码图片链接
    $scope.showCaptcha = false; //是否显示验证码
    $scope.showCaptchaForPhone = true;//短信登录是否展示图形验证码
    $scope.eyeIndex = 0; //是否显示密码
    $scope.loginIndex = 0; //登录方式下标
    $scope.canGetVcode = true; //是否可以点击获取验证码
    $scope.VCodeTips = '获取验证码'; //是否可以点击获取验证码
    $scope.eyeArr = [$rootScope.imgBaseURL+'img/eye_close@2x.png', $rootScope.imgBaseURL+'img/eye_open@2x.png']; //显示密码数组
    $scope.pwdArr = ['password', 'text']; //显示密码类型
    $scope.loginTypeArr = ['短信验证码登录', '账号密码登录'];
    $scope.loginTypeArrGrowingIo = ['账号密码登录', '短信验证码登录'];
    var flag = 0; //获取第三方id失败尝试次数
    $scope.show=false;
    // var frontView=$rootScope.thirdFrontView;
    //当前平台类型
    var deviceInfo = ionic.Platform.isAndroid() ? "android" : (ionic.Platform.isIOS() ? "ios" : "unknown");
    //IOS特殊样式
    $scope.leftArrow = {};
    $scope.rightButton = {};
    if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) { //只有ios app 特有的样式
      $scope.leftArrow = {
        'margin-top': '36px'
      };
      $scope.rightButton = {
        'top': '36px'
      };
    }
    //xyz定义是用户登录名
    var NameUser = '';
    // xyz添加记录用户名
    $scope.xyzloginName = UserService.getUser().loginName;
    //用户登录所需信息
    $scope.userInfo = {
      userName: $scope.xyzloginName,
      mobile: UserService.getUser().mobile,
      password: '',
      captcha: '',
      verificationCode: '' //短信验证码
    };
    $scope.VCodeStyle = {
      "color": "#2979FF"
    };
    $scope.getVCode = function () {
        console.log($scope.userInfo.captcha)
      if ($scope.canGetVcode) {//可以获取验证码
        if (!$scope.userInfo.mobile||$scope.userInfo.mobile.length == 0) {
          PopupService.showToast('请输入手机号');
        }else if(!($scope.globalConstant.mobileNumberRegExp.test($scope.userInfo.mobile))){
          PopupService.showToast('请输入正确的手机号格式');
        }else if ($scope.userInfo.captcha.length == 0) {
          PopupService.showToast('请输入图形验证码');
        }else{
          newUserLoginService.fastLoginCaptcha($scope.userInfo.mobile,$scope.userInfo.captcha)
            .success(function(res){
              if(!res.data){
                PopupService.showToast(res.message);
              }else if(res.data == -1 && $scope.userInfo.captcha.length == 0){
                $scope.setImgCaptchaForPhone();
                $scope.showCaptchaForPhone = true;
                PopupService.showToast('请输入图形验证码');
              }else{
                $scope.canGetVcode = !$scope.canGetVcode;
                var timeCount = 60;
                $scope.timer = $interval(function () {
                  if ((timeCount - 1) < 0) {
                    $scope.VCodeTips = '获取验证码';
                    $scope.VCodeStyle = {
                      "color": "#2979FF"
                    };
                    $interval.cancel($scope.timer);
                    $scope.canGetVcode = true;
                  } else {
                    $scope.VCodeStyle = {
                      "color": "#666666"
                    };
                    timeCount--;
                    $scope.VCodeTips = '重发 ' + timeCount + 's';
                  }
                }, 1000);
              }
            });
          //$scope.setImgCaptchaForPhone();
        }
      }
    };
    $scope.toggleEye = function () {
      $scope.eyeIndex = ($scope.eyeIndex + 1) % 2;
    };
    $scope.setImgCaptcha = function () {
      $scope.identifyCodeImg = LoginService.getLoginCaptcha() + "?rnd=" + Math.random()+"&flag="+$localstorage.get('sg_login_token_secret').substring(6);
    };
    $scope.setImgCaptchaForPhone = function () {
      $scope.identifyCodeImg = RegisterService.getImgCaptcha() + "?rnd=" + Math.random()+"&flag="+$localstorage.get('sg_login_token_secret').substring(6);
    };
    $scope.canClickLoginOrNot = function(){
      if($scope.userInfo.mobile.length!=0&&$scope.userInfo.verificationCode.length!=0){
        $scope.canClickLogin = true;
      }else{
        $scope.canClickLogin = false;
      }
    };

    $scope.concactID=function(){
      $scope.loginIndex=1;
    }
    $scope.mobileLogin=function(){
      $scope.loginIndex=0;
    }
    /** 方法 **/
      //跳转注册页面
    $scope.toRegister = function () {
      if (!frontView || $scope.frontView  == 'guidePage') {
        $state.go('register', {
          hasHistory: 0
        }); //正常注册流程
      } else {
        $state.go('register', {
          hasHistory: 1
        }); //因未登录无法进行相关操作而进行中途注册
      }
    };
    /*监测键盘回车键按下登录*/
    $scope.directLogin = function (e) {
      var keyCode = window.event ? e.keyCode : e.which;
      if (keyCode == 13) {
        $scope.loginSG();
      }
    };
    //登录
    $scope.loginSG = function () {
      // $localstorage.set('IsThirdLoginType', 'PT'); //设置登录渠道；
      var urls=$location.absUrl();
      if($scope.loginIndex==0){
        if(urls.indexOf('code')<0){
          PopupService.showToast('请重新打开页面，获取授权');
        }else if ($scope.userInfo.mobile.length == 0) {
          PopupService.showToast('请输入手机号');
        }else if(!($scope.globalConstant.mobileNumberRegExp.test($scope.userInfo.mobile))){
          PopupService.showToast('请输入正确的手机号格式');
        }else if ($scope.userInfo.captcha.length == 0) {
          PopupService.showToast('请输入图形验证码');
        }else if ($scope.userInfo.verificationCode.length == 0) {
          PopupService.showToast('请输入短信验证码');
        }else if($scope.userInfo.verificationCode.length>0&&$scope.userInfo.verificationCode.length<6||$scope.userInfo.verificationCode.length>6){
          PopupService.showToast('短信验证码长度必须是6位');
        }else if(!$scope.userData.unionid){
          PopupService.showToast('请重新打开页面，获取授权');
        } else {
          newUserLoginService.fastLogin('1','7',$scope.userData.unionid,'',$scope.userInfo.mobile,$scope.userInfo.verificationCode,$scope.userInfo.captcha)
            .success(function (res){
              console.log(res);
              if(res.success){
                // $localstorage.set('backIF','haslogin');
                $scope.userdataDetail=res.data;
                var memberId = res.data.mid;
                    // setSwitchFun(memberId);
                    $rootScope.loginMemberId = res.data.mid;
                    UserService.setUser(res.data);
                    IMService.initWebSocket();
                    $rootScope.userCount = $scope.userInfo.mobile;
                    $rootScope.password = "";
                    window.localStorage.setItem('isLogin', UserService.isUserLogin());
                    $rootScope.isWdHost = 1;
                    // PopupService.showToast('登录成功');
                    if(res.data.sessionValue){
                      $localstorage.set('sg_login_token_secret','Bearer'+res.data.sessionValue);//把token存到本地
                    }else{
                      $localstorage.set('sg_login_token_secret','Bearer'+ GetStatisticInfoService.generateUUID());
                    }
                    if(!$scope.frontView){
                      $state.go('relactOK',
                      {nickname:$scope.userdataDetail.nickname,
                        mobile:$scope.userInfo.mobile,
                        email:''});
                    }else{
                      if ($scope.frontView  == 'newUserLogin' || $scope.frontView  == 'guidePage' || $scope.frontView  == 'register' || $scope.frontView  == 'changePassword' || $scope.frontView  == 'myPhoneBindSuccess') {
                        $state.go('newHome');
                        $localstorage.set('backfront','');
                      } else {
                        $state.go($scope.frontView,$scope.params)
                        $localstorage.set('backfront','');
                      }
                    }
              }else{
                PopupService.showToast(res.message);
              }
            })
        }
      }else{
        
      
      // $scope.urlbase="http://mobiletest.ehaier.com:38080/www/?code=011Ui4o322qTGM0tfPn32b69o32Ui4oN&state=STATE#/login/newUserLogin"
      if(urls.indexOf('code')<0){
        PopupService.showToast('请重新打开页面，获取授权');
      }else if ($scope.userInfo.userName.length == 0) {
          PopupService.showToast('请输入用户名');
        } else if ($scope.userInfo.password.length == 0) {
          PopupService.showToast('密码为数字、字母、特殊符号中的两种组合，长度6位~20位(字母区分大小写)');
        }else if(!$scope.userData.unionid){
          PopupService.showToast('请重新打开页面，获取授权');
        } else {
          newUserLoginService.fastLogin('2','7',$scope.userData.unionid,$scope.userInfo.password,$scope.userInfo.userName,'','')
            .success(function (res){
              console.log(res);
              if(res.success){
                // $localstorage.set('backIF','haslogin');
                $scope.userdataDetail=res.data;
                var memberId = res.data.mid;
                    // setSwitchFun(memberId);
                    $rootScope.loginMemberId = res.data.mid;
                    UserService.setUser(res.data);
                    IMService.initWebSocket();
                    $rootScope.userCount = $scope.userInfo.mobile;
                    $rootScope.password = "";
                    window.localStorage.setItem('isLogin', UserService.isUserLogin());
                    $rootScope.isWdHost = 1;
                    // PopupService.showToast('登录成功');
                    if(res.data.sessionValue){
                      $localstorage.set('sg_login_token_secret','Bearer'+res.data.sessionValue);//把token存到本地
                    }else{
                      $localstorage.set('sg_login_token_secret','Bearer'+ GetStatisticInfoService.generateUUID());
                    }
                    if(!$scope.frontView){
                      $state.go('relactOK',
                        {nickname:$scope.userdataDetail.nickname,
                          mobile:$scope.userInfo.userName,
                          email:''});
                    }else{
                      if ($scope.frontView  == 'newUserLogin' || $scope.frontView  == 'guidePage' || $scope.frontView  == 'register' || $scope.frontView  == 'changePassword' || $scope.frontView  == 'myPhoneBindSuccess') {
                        $state.go('newHome');
                        $localstorage.set('backfront','');
                      } else {
                        $state.go($scope.frontView,$scope.params)
                        $localstorage.set('backfront','');
                      }
                    }
              }else{
                PopupService.showToast(res.message);
              }
            })
        }
      }
    };
    $scope.isHideFooter = function () {
      $scope.isFocusShow = false;
    };
    $scope.isShowFooter = function () {
      $scope.isFocusShow = true;
    };
    $scope.thirdLogin = function (type) {
      flag = 0;
      if (!window.umeng) {
        alert('umeng 插件 未加载');
        return;
      }
      umengLogin(type);
    };
    $scope.goBack = function () {
      $ionicHistory.goBack();
    };
      
  // function pushHistory() {  
  //   var url=$location.absUrl();
  //   var a;
  //   var userList=$localstorage.get('backfront');
  //   if(userList){
  //     var usList=JSON.parse(userList);
  //     if(url.indexOf('?')>0){
  //         a=url.substring(0,url.indexOf('?'))+'#'+usList.url
  //       }else if(url.indexOf('#')>0){
  //         a=url.substring(0,url.indexOf('#'))+'#'+usList.url
  //       }
  //   }else{
  //     a=url.substring(0,url.indexOf('#'))+'#'+'/homePage';
  //   }
  //     var state = {  
  //         title: "title",  
  //         url: a
  //     };  
  //     window.history.pushState(state, state.title, state.url);  
  // }
  
    $scope.$on('$ionicView.beforeEnter', function () {
      var state = {
            title: "",
            url: ""    };
        window.history.pushState(state, "", "#/login/newUserLogin");
      $scope.backYes=false;
      $timeout(function(){
        $scope.backYes=true;
      },1500)
      $scope.urlbase=$location.absUrl();
        // window.addEventListener("popstate", function(e) { 
        //   if($scope.backYes){
        //     window.history.go(-2);
        //   }
        // }, false); 

      HomePageService.isWdHost()
                          .success(function (response) {
                            $rootScope.isWdHost = response.data.isHost;
                          });
      window.onpopstate = function() {
        if($scope.backYes && $rootScope.isWdHost == -1){
            window.history.go(-3);
            //$ionicHistory.goBack(-2);
          }
      };
      var userList=$localstorage.get('backfront');
      
      // $scope.urlbase="http://mobiletest.ehaier.com:38080/www/?code=011Ui4o322qTGM0tfPn32b69o32Ui4oN&state=STATE#/login/newUserLogin"
      if($scope.urlbase.indexOf('code')>0){
        console.log($scope.urlbase.substring($scope.urlbase.indexOf('code'),$scope.urlbase.indexOf('&')))
        $scope.codeString=$scope.urlbase.substring($scope.urlbase.indexOf('code'),$scope.urlbase.indexOf('&'));
        $scope.getCode=$scope.codeString.substring(5);
        newUserLoginService.findStatus($scope.getCode)
          .success(function(res){
            if(res.success){
              if(res.data.unionid){
              $scope.userData=res.data;
              if($scope.userData.isBinded==1){
                if(userList){
                  var usList=JSON.parse(userList);
                  // alert('22')
                  $scope.frontView=usList.stateName;
                  $scope.params=usList.stateParams
                  // res.data.memberViewA;
                  var memberId = res.data.memberViewA.mid;
                    // setSwitchFun(memberId);
                    $rootScope.loginMemberId = res.data.memberViewA.mid;
                    UserService.setUser(res.data.memberViewA);
                    IMService.initWebSocket();
                    $rootScope.userCount = $scope.userInfo.mobile;
                    $rootScope.password = "";
                    window.localStorage.setItem('isLogin', UserService.isUserLogin());
                    // PopupService.showToast('登录成功');
                    $rootScope.isWdHost = 1;
                    if(res.data.memberViewA.sessionValue){
                      $localstorage.set('sg_login_token_secret','Bearer'+res.data.memberViewA.sessionValue);//把token存到本地
                    }else{
                      $localstorage.set('sg_login_token_secret','Bearer'+ GetStatisticInfoService.generateUUID());
                    }
                    if ($scope.frontView == 'guidePage' || $scope.frontView  == 'register' || $scope.frontView  == 'changePassword' || $scope.frontView  == 'myPhoneBindSuccess') {
                      $state.go('newHome');
                      $localstorage.set('backfront','');
                    } else {
                      $state.go($scope.frontView,$scope.params)
                      $localstorage.set('backfront','');
                    }

                }else{
                  // alert('1');
                  $state.go('relactOK',
                  {nickname:$scope.userData.nickname,
                    mobile:$scope.userData.mobile,
                    email:$scope.userData.email});
                }
              }else{
                $scope.loginIndex=0;
                if(userList){
                  var usList=JSON.parse(userList);
                  $scope.frontView=usList.stateName;
                  $scope.params=usList.stateParams
                }
              }
            }else{
              PopupService.showToast('请重新打开页面，获取授权');
            }
            }else{
              PopupService.showToast('请重新打开页面，获取授权');
              // $scope.show=true;
              // $timeout(function(){
              //   var url=$location.absUrl();
              //   console.log(url.substring(0,url.indexOf('?')))
                // $scope.codeString=$scope.urlbase.substring($scope.urlbase.indexOf('code'),$scope.urlbase.indexOf('&'));
                // $scope.getCode=$scope.codeString.substring(5);
                // window.location.href=url.substring(0,url.indexOf('?'))+"#/guidePage";
              // },500)
              // PopupService.showToast('请重新打开页面，获取授权');
            }
          })
          .error(function () {
            PopupService.showToast('请重新打开页面，获取授权');
          })
      }else{
        $scope.url=encodeURIComponent(UrlService.getThirdUrl('www/#/login/newUserLogin'))
        // $scope.url=encodeURIComponent('http://mobiletest.ehaier.com:38081/www/#/login/newUserLogin')
        document.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb03a523baf487993&redirect_uri="+$scope.url+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
      }
      $scope.showCaptcha = false;
      $scope.showCaptchaForPhone = false;
      $scope.setImgCaptchaForPhone();
      LoginService.checkLogin()
        .success(function (response, status, headers, config) {
          $scope.setImgCaptcha();
          $scope.setImgCaptchaForPhone();
        });
      // frontView = $scope.frontView;

    });
  }
]);


/**
 * creater:shuang2.wang@dhc.com.cn
 * create time:2016-03-22
 * describe：登录Service
 **/
APP.service('newUserLoginService', ['$http', 'UrlService', '$localstorage', function ($http, UrlService, $localstorage) {
  this.loginUserInfoCAPTCHA = function (userName, password, captcha) {
    var params = {
      userName: userName,
      password: encodeURIComponent(password),
      captcha: captcha,
      isNew: 1,
      noLoading: true
    };
    return $http.get(UrlService.getUrl('CAPTCHALOGIN'), params);
  };
  this.loginUserInfo = function (userName, password) {
    var params = {
      userName: userName,
      password: password,
      noLoading: true
    };
    return $http.get(UrlService.getUrl('LOGIN'), params);
  };
  this.loginThird = function (param) {
    return $http.get(UrlService.getUrl('THIRD_PARTY_LOGINS'), param);
  };
  this.setRole = function (role) {
    return $localstorage.set('ROLE_INFO', role)
  };
  this.getRole = function () {
    return $localstorage.get('ROLE_INFO', undefined)
  };
  this.checkLogin = function () {
    var params = {
      noLoading: true
    };
    return $http.get(UrlService.getUrl('LOGIN_CHECK'), params);
  };
  this.checkOpenStore = function (memberId) {
    if(memberId){
      var params = {
        memberId: memberId
      };
    }else{
      params = {
        memberId: ''
      };
    }
    return $http.get(UrlService.getUrl('IS_HAS_STORE'), params);
  };

  this.saveDeviceToken = function (param) {
    return $http.get(UrlService.getUrl('SAVE_DEVICE_TOKEN'), param);
  };
  this.findStatus=function(code){
    var params = {
      code: code
    };
    return $http.get(UrlService.getUrl('FIND_STATUS'), params);
  }
  this.getLoginCaptcha = function () { //登录页获取图片验证码
    return UrlService.getUrl('GET_LOGIN_CAPTCHA');
  };
  //快速登录 获取短信验证码
  this.fastLoginCaptcha = function (mobile, captcha) {
      var params = {
        mobile: mobile,
        imgCaptcha: captcha
      };
      return $http({
        method: 'GET',
        url:UrlService.getUrl('FAST_LOGIN_CAPTCHA'),
        params: params,
        headers: {Authorization: 'open the gate'}
      })
  };
  //快速登录 获取短信验证码
  this.fastLogin = function (type,loginType,unionid,password,mobile, captcha,imgCaptcha) {
    var params = {
      type:type,
      loginType:7,
      unionid:unionid,
      password:password,
      mobile: mobile,
      captcha: captcha,
      imgCaptcha:imgCaptcha
    };
    return $http({
      method: 'POST',
      url: UrlService.getUrl('NEW_USER_CONTACT'),
      params: params
    });
  };
}]);
