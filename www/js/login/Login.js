/**
 * creater:shuang2.wang@dhc.com.cn
 * create time:2016/3/22
 * describe：登录控制器
 **/
APP.controller('LoginController', ['$timeout','HomePageService','$location','newUserLoginService','$interval', '$rootScope', '$scope', '$localstorage', 'LoginService', '$state', 'UserService', '$ionicPopup', 'PaymentService', 'PopupService', '$ionicHistory', 'RegisterService', '$http', 'UrlService', 'ServiceConversationService', 'GroupSettingService', 'IMService','GetStatisticInfoService',
  function ($timeout,HomePageService,$location,newUserLoginService,$interval, $rootScope, $scope, $localstorage, LoginService, $state, UserService, $ionicPopup, PaymentService, PopupService, $ionicHistory, RegisterService, $http, UrlService, ServiceConversationService, GroupSettingService, IMService,GetStatisticInfoService) {
    /** 变量声明 **/
    if (window.location.href.indexOf('fromCommunity') != -1) { // 表示是从社群跳转到的H5登录页
      $rootScope.fromCommunity = true;
    }
    $scope.isBuyer = '1'; //判断用户角色信息；'0'为买家；'1'为卖家
    $scope.isFocusShow = true;
    $scope.identifyCodeImg = ''; //验证码图片链接
    $scope.showCaptcha = false; //是否显示验证码
    $scope.showCaptchaForPhone = false;//短信登录是否展示图形验证码
    $scope.eyeIndex = 0; //是否显示密码
    $scope.loginIndex = 0; //登录方式下标
    $scope.showVC = false; //是否是 短信验证码 登录
    $scope.canGetVcode = true; //是否可以点击获取验证码
    $scope.VCodeTips = '获取验证码'; //是否可以点击获取验证码
    $scope.eyeArr = [$rootScope.imgBaseURL+'img/eye_close@2x.png', $rootScope.imgBaseURL+'img/eye_open@2x.png']; //显示密码数组
    $scope.pwdArr = ['password', 'text']; //显示密码类型
    $scope.loginTypeArr = ['短信验证码登录', '账号密码登录'];
    $scope.loginTypeArrGrowingIo = ['账号密码登录', '短信验证码登录'];
    var flag = 0; //获取第三方id失败尝试次数
    var frontView = $ionicHistory.viewHistory().backView;
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

    $scope.showVCode = function () {
      $scope.showVC = !$scope.showVC;
      $scope.identifyCodeImg = '';
      $scope.userInfo.captcha = '';
      /*if(!$scope.showVC){
        $scope.showCaptchaForPhone = false;
      }*/
      //$scope.loginIndex = ($scope.loginIndex + 1) % 2;
      if($scope.loginIndex == 1){
        $scope.loginIndex = 0;
        $scope.setImgCaptchaForPhone();
        $scope.showCaptchaForPhone = false;
      }else{
        $scope.loginIndex = 1;
        $scope.setImgCaptchaForPhone();
        $scope.showCaptchaForPhone = true;
      }
    };
    $scope.getVCode = function () {
      if ($scope.canGetVcode) {//可以获取验证码
        if (!$scope.userInfo.mobile||$scope.userInfo.mobile.length == 0) {
          PopupService.showToast('请输入手机号');
        }else if(!($scope.globalConstant.mobileNumberRegExp.test($scope.userInfo.mobile))){
          PopupService.showToast('请输入正确的手机号格式');
        }else if ($scope.userInfo.captcha.length == 0 && $scope.showCaptchaForPhone == true) {
          PopupService.showToast('请输入图形验证码');
        }else{
          LoginService.fastLoginCaptcha($scope.userInfo.mobile,$scope.userInfo.captcha,$scope.showCaptchaForPhone)
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
    /** 方法 **/
      //跳转注册页面
    $scope.toRegister = function () {
      if (!frontView || frontView.stateName == 'guidePage') {
        $state.go('register', {
          hasHistory: 0
        }); //正常注册流程
      } else {
        $state.go('register', {
          hasHistory: 1
        }); //因未登录无法进行相关操作而进行中途注册
      }
    };
    //设置金币雨下落、佣金、提现通知的标志
    function setSwitchFun(memberId){
      var myId = memberId;
      if(localStorage.getItem('setSwitch')){
        var switchArr = JSON.parse(localStorage.getItem('setSwitch'));
        console.log(switchArr);
        var isExist = false;
        for(var i = switchArr.length-1;i>=0;i--){
          if(switchArr[i].id == myId){
            $rootScope.isCommission = switchArr[i].list[0].checked;
            $rootScope.cashSwitch = switchArr[i].list[1].checked;
            $rootScope.goldRainSwitch = switchArr[i].list[2].checked;
            console.log($rootScope.isCommission);
            isExist = true;
            return;
          }
        }
        if(!isExist){
          $rootScope.isCommission = true;
          $rootScope.cashSwitch = true;
          $rootScope.goldRainSwitch = true;
          var nowMemberSwitch = {
            id:myId,
            list:[
              {
                name:'佣金',
                checked:true
              },
              {
                name:'提现通知',
                checked:true
              },
              {
                name:'金币雨',
                checked:true
              }
            ]
          };
          switchArr.push(nowMemberSwitch);
          localStorage.setItem('setSwitch',JSON.stringify(switchArr));
        }
      }else{
        var arr =[
              {
                id:myId,
                list:[
                  {
                    name:'佣金',
                    checked:true
                  },
                  {
                    name:'提现通知',
                    checked:true
                  },
                  {
                    name:'金币雨',
                    checked:true
                  }
                ]
              }
            ];
            localStorage.setItem('setSwitch',JSON.stringify(arr));
            $rootScope.isCommission = true;
            $rootScope.cashSwitch = true;
            $rootScope.goldRainSwitch = true;
      }
    }
    /*监测键盘回车键按下登录*/
    $scope.directLogin = function (e) {
      var keyCode = window.event ? e.keyCode : e.which;
      if (keyCode == 13) {
        $scope.loginSG();
      }
    };
    //登录
    $scope.loginSG = function () {
      $localstorage.set('IsThirdLoginType', 'PT'); //设置登录渠道；
      if ($scope.loginIndex == 1) { //快速登录
        if ($scope.userInfo.mobile.length == 0) {
          PopupService.showToast('请输入手机号');
        }else if(!($scope.globalConstant.mobileNumberRegExp.test($scope.userInfo.mobile))){
          PopupService.showToast('请输入正确的手机号格式');
        } else if ($scope.userInfo.verificationCode.length == 0) {
          PopupService.showToast('请输入短信验证码');
        }else if($scope.userInfo.verificationCode.length>0&&$scope.userInfo.verificationCode.length<6||$scope.userInfo.verificationCode.length>6){
          PopupService.showToast('短信验证码长度必须是6位');
        } else {
          LoginService.fastLogin($scope.userInfo.mobile, $scope.userInfo.verificationCode)
                .success(function (response) {
                  if (response.data) {
                    var memberId = response.data.mid;
                    setSwitchFun(memberId);
                    $rootScope.loginMemberId = response.data.mid;
                    UserService.setUser(response.data);
                    IMService.initWebSocket();
                    $rootScope.userCount = $scope.userInfo.mobile;
                    $rootScope.password = "";
                    window.localStorage.setItem('isLogin', UserService.isUserLogin());
                    PopupService.showToast('登录成功');
                    if(response.data.sessionValue){
                      $localstorage.set('sg_login_token_secret','Bearer'+response.data.sessionValue);//把token存到本地
                    }else{
                      $localstorage.set('sg_login_token_secret','Bearer'+ GetStatisticInfoService.generateUUID());
                    }
                    if ($rootScope.fromCommunity) { // 表示是从社群跳转来的
                      window.history.back(-1); // 登录成功后 返回到社群页面
                    } else if (!frontView || frontView.stateName == 'guidePage' || frontView.stateName == 'register' || frontView.stateName == 'changePassword' || frontView.stateName == 'myPhoneBindSuccess') {
                      $state.go('newHome');
                    } else {
                      $ionicHistory.goBack(-1);
                    }
                    if (window.cordova) {
                      $rootScope.gio.setUserId(memberId.toString());
                      $rootScope.gio.people.set({
                        name: UserService.getUser().userName,
                        mobile: UserService.getUser().mobile,
                        email: UserService.getUser().email,
                        gender: UserService.getUser().gender,
                        birthday: UserService.getUser().birthday
                      });
                    }
                    setTimeout(function(){
                      if (window.cordova && window.UmengPush && window.UmengPush.getDeviceToken) { //存deviceToken
                        window.UmengPush.getDeviceToken({}, function (dt) {
                          var param = {
                            member_id: memberId,
                            device_type: $rootScope.isIOS ? 'ios' : 'android',
                            device_token: dt
                          };
                          LoginService.saveDeviceToken(param).success(function (res) {
                            if (res.success) {
                              // alert('save token success');
                            } else {
                              //  alert('save token failed');
                            }
                          }).error(function (error) {
                            //  alert('save token error---->'+error);
                          });
                        }, function (error) {
                          console.log(error);
                        });
                      }
                    },0)
                    LoginService.checkOpenStore(memberId)
                      .success(function (response, status, headers, config) {
                        if (window.UmengPush) {
                          window.UmengPush.getDeviceToken([], function (deviceToken) {
                            $http.get(UrlService.getUrl("DEVICE_INFO") + "?device_token=" + deviceToken + "&device_type=" + deviceInfo);
                            console.log("注册token:device_token=" + deviceToken + "&device_type=" + deviceInfo);
                          });
                        }
                        if (!response.data) {
                          $scope.isBuyer = '0';
                          LoginService.setRole($scope.isBuyer);
                          $localstorage.set('storeId', 20219251);
                        } else {
                          $scope.isBuyer = '1';
                          LoginService.setRole($scope.isBuyer);
                          $localstorage.set('storeId', memberId);
                        }
                      })
                  } else {
                    PopupService.showToast(response.message);
                  }
                })

        }
      } else { //账号密码登录
        if ($scope.userInfo.userName.length == 0) {
          PopupService.showToast('请输入用户名');
        } else if ($scope.userInfo.password.length == 0) {
          PopupService.showToast('密码为数字、字母、特殊符号中的两种组合，长度6位~20位(字母区分大小写)');
        } else if ($scope.userInfo.captcha.length == 0 && $scope.showCaptcha == true) {
          PopupService.showToast('请输入验证码');
        } else {
          LoginService.loginUserInfoCAPTCHA($scope.userInfo.userName, $scope.userInfo.password, $scope.userInfo.captcha)
            .success(function (response) {
              if (response.success) {
                var memberId = response.data.mid;
                setSwitchFun(memberId);
                $rootScope.loginMemberId = response.data.mid;
                UserService.setUser(response.data);
                IMService.initWebSocket();
                $rootScope.userCount = $scope.userInfo.userName;
                $rootScope.password = $scope.userInfo.password;
                window.localStorage.setItem('isLogin', UserService.isUserLogin());
                PopupService.showToast('登录成功');
                if(response.data.sessionValue){
                  $localstorage.set('sg_login_token_secret','Bearer'+response.data.sessionValue);//把token存到本地
                }else{
                  $localstorage.set('sg_login_token_secret','Bearer'+ GetStatisticInfoService.generateUUID());
                }
                if (window.cordova) {
                  $rootScope.gio.setUserId(memberId.toString());
                  $rootScope.gio.people.set({
                    name: UserService.getUser().userName,
                    mobile: UserService.getUser().mobile,
                    email: UserService.getUser().email,
                    gender: UserService.getUser().gender,
                    birthday: UserService.getUser().birthday
                  });
                }

                if (window.cordova && window.UmengPush && window.UmengPush.getDeviceToken) { //存deviceToken
                  window.UmengPush.getDeviceToken({}, function (dt) {
                    var param = {
                      member_id: memberId,
                      device_type: $rootScope.isIOS ? 'ios' : 'android',
                      device_token: dt
                  };
                    LoginService.saveDeviceToken(param).success(function (res) {
                      if (res.success) {
                      // alert('save token success');
                      } else {
                      //  alert('save token failed');
                    }

                    }).error(function (error) {
                    //  alert('save token error---->'+error);
                  });

                  }, function (error) {

                  console.log(error);
                });

                }
                //var paramsR ={
                //  companyId:memberId,
                //  companyName:UserService.getUser().userName,//公司名暂定 为 userName
                //  userId:memberId,
                //  userName:UserService.getUser().nickName,
                //  paswd:$scope.userInfo.password
                //};
                //GroupSettingService.register(paramsR).then(function(response1){
                //
                //  ServiceConversationService.kefulogin(memberId).then(function(res){
                //
                //  });
                //
                //});

                // 判断是否绑定过手机号
                RegisterService.wdApply()
                  .success(function (response) {
                    if (response.success) {
                      if (response.data) { //绑定过手机
                        if ($rootScope.fromCommunity) { // 表示是从社群跳转来的
                          window.history.back(-1); // 登录成功后 返回到社群页面
                        } else if (!frontView || frontView.stateName == 'guidePage' || frontView.stateName == 'register' || frontView.stateName == 'changePassword' || frontView.stateName == 'myPhoneBindSuccess') {
                          $rootScope.loginGoNum=0;
                          $state.go('newHome');
                        } else {
                          $ionicHistory.goBack(-1);
                          $rootScope.loginGoNum=1;
                        }
                      } else { //没绑定过手机
                        HomePageService.isWdHost()
                          .success(function (response) {
                             if(response.success){
                               $scope.o2oMessage = response.message;
                               if (response.data.isHost == 1) { //微店主
                                if ($rootScope.fromCommunity) { // 表示是从社群跳转来的
                                  window.history.back(-1); // 登录成功后 返回到社群页面
                                } else if(response.data.o2o== true || response.data.o2o == null){
                                   $state.go('newHome');
                                 }else{
                                   $state.go('RegisterForStoreLogin',{hasHistory:1}); //去绑定手机号  hasHistory
                                 }
                               }else{ //普通用户
                                // $scope.myPopup.close();
                                 $state.go('RegisterForStoreLogin',{hasHistory:1}); //去绑定手机号  hasHistory
                               }

                             }else{
                               PopupService.showToast('获取数据信息失败！');
                             }
                          });

                      }
                    } else { //接口异常
                      PopupService.showToast('服务端错误');
                    }
                  });

                  LoginService.checkOpenStore(memberId).success(function(response){
                    if (window.UmengPush) {
                          window.UmengPush.getDeviceToken([], function (deviceToken) {
                            $http.get(UrlService.getUrl("DEVICE_INFO") + "?device_token=" + deviceToken + "&device_type=" + deviceInfo);
                            console.log("注册token:device_token=" + deviceToken + "&device_type=" + deviceInfo);
                          });
                        }
                    if(!response.data){
                      $scope.isBuyer = '0';
                      LoginService.setRole($scope.isBuyer);
                      $localstorage.set('storeId', 20219251);
                    }else{
                      $scope.isBuyer = '1';
                      LoginService.setRole($scope.isBuyer);
                      $localstorage.set('storeId', memberId);
                    }
                  })
               /* LoginService.checkOpenStore(memberId)
                  .success(function (response, status, headers, config) {
                    if (window.UmengPush) {
                      window.UmengPush.getDeviceToken([], function (deviceToken) {
                        $http.get(UrlService.getUrl("DEVICE_INFO") + "?device_token=" + deviceToken + "&device_type=" + deviceInfo);
                        console.log("注册token:device_token=" + deviceToken + "&device_type=" + deviceInfo);
                      });
                    }
                    if (!response.data) {
                      $scope.isBuyer = '0';
                      LoginService.setRole($scope.isBuyer);
                      if (!frontView || frontView.stateName == 'guidePage' || frontView.stateName == 'register' || frontView.stateName == 'changePassword') {
                        $state.go('directPurchase');
                      } else {
                        $ionicHistory.goBack(-1);
                      }
                    } else {
                      $scope.isBuyer = '1';
                      LoginService.setRole($scope.isBuyer);

                      if (!frontView || frontView.stateName == 'guidePage' || frontView.stateName == 'register' || frontView.stateName == 'changePassword') {
                        $state.go('homePage');
                      } else {
                        $ionicHistory.goBack(-1);
                      }
                    }
                  }).error(function (error) {
                  PopupService.showToast('登录失败');
                });*/
              } else if (response.message) {
                  if(response.errorCode=='forget_password'){
                    PopupService.showToast(response.message);
                    $timeout(function(){
                      $state.go('requestPassword');
                    },2000);
                  }else if(response.data ==-1){
                    PopupService.showToast(response.message);
                    $scope.showCaptcha = true;
                    //$scope.showVC = false;
                    $scope.setImgCaptcha();
                  }else{
                    PopupService.showToast(response.message);
                  }
              } else {
                PopupService.showToast('登录失败');
              }
            });
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


    function umengLogin(type) {
      $localstorage.set('IsThirdLoginType', type); //设置登录渠道；
      flag++;
      var typeKV = {
        'qq': 4,
        'sina': 6,
        'wechat': 7
      };
      window.umeng.login(type,
        function (data) { //umeng 第三方授权成功
          //  data = JSON.parse(data);

          data = JSON.parse(data);
          //微信头像是data.headimgurl //其他是data.profile_image_url
          var _data = {
            uid: data.uid,
            source: typeKV[type],
            nickName: data.name,
            headerPic: data.profile_image_url ? data.profile_image_url : data.headimgurl,
            openid: data.openid,
            unionid: data.unionid
          };

          if (_data.uid) {
            var param = {
              userId: _data.uid,
              userName: _data.nickName,
              loginType: typeKV[type],
              icon: _data.headerPic,
              openid: _data.openid,
              unionid: _data.unionid
            };
            //第三方授权后，发请求给后台
            LoginService.loginThird(param).success(function (response) {
              if (window.UmengPush) {
                window.UmengPush.getDeviceToken([], function (deviceToken) {
                  $http.get(UrlService.getUrl("DEVICE_INFO") + "?device_token=" + deviceToken + "&device_type=" + deviceInfo);
                  console.log("注册token:device_token=" + deviceToken + "&device_type=" + deviceInfo);
                });
              }
              if (response.success) { //登录成功
                //注册消息token
                UserService.setUser(response.data);
                IMService.initWebSocket();
                var memberId = response.data.mid;
                $rootScope.loginMemberId = response.data.mid;
                setSwitchFun(memberId);
                LoginService.checkOpenStore(memberId).success(function(response){
                    if(!response.data){
                      $scope.isBuyer = '0';
                      LoginService.setRole($scope.isBuyer);
                      $localstorage.set('storeId', 20219251);
                    }else{
                      $scope.isBuyer = '1';
                      LoginService.setRole($scope.isBuyer);
                      $localstorage.set('storeId', memberId);
                    }
                  });
                UserService.setUser(response.data);
                if(response.data.sessionValue){
                  $localstorage.set('sg_login_token_secret','Bearer'+response.data.sessionValue);//把token存到本地
                }else{
                  $localstorage.set('sg_login_token_secret','Bearer'+ GetStatisticInfoService.generateUUID());
                }
                // 判断是否绑定过手机号
                RegisterService.wdApply()
                  .success(function (response) {
                    if (response.success) {
                      if (response.data) { //绑定过手机
                        UserService.setUser(response.data);
                        if (!frontView || frontView.stateName == 'guidePage' || frontView.stateName == 'register' || frontView.stateName == 'changePassword' || frontView.stateName == 'myPhoneBindSuccess') {
                          $rootScope.loginGoNum=0;
                          $state.go('newHome');
                        } else {
                          $rootScope.loginGoNum=1;
                          $ionicHistory.goBack(-1);
                        }
                      } else { //没绑定过手机
                        $state.go('RegisterForStoreLogin',{hasHistory:1}); //去绑定手机号  hasHistory
                      }
                    } else { //接口异常
                      PopupService.showToast('服务端错误');
                    }
                  });




              } else if (response.message) { //登录失败，暂时没有想到 第三方登录 失败的情况
                PopupService.showToast(response.message);
              } else {
                PopupService.showToast('登录失败！');
              }

            }).error(function (res) {
              $ionicPopup.alert({
                title: '提示',
                template: '网络连接失败！'
              });

            });
          } else {
            if (flag > 3) {
              PopupService.showToast('授权失败，请稍后再试');
            } else {
              umengLogin(type);
            }
          }
        },
        function (failError) {
          //
          $ionicPopup.alert({
            title: '提示',
            template: '第三方登录失败！'
          });
          console.log('umeng-qq-fail');
        });
    }
    $scope.goBack = function () {
      if(window.location.href.indexOf('?fromCommunity') > -1){ // 来自圈子的分享   yl
        window.history.back();
      }else{
        $ionicHistory.goBack();
      }
    };

    $scope.$on('$ionicView.beforeEnter', function (e, v) {
      $scope.showCaptcha = false;
      $scope.showCaptchaForPhone = false;
      $scope.setImgCaptchaForPhone();
      LoginService.checkLogin()
        .success(function (response, status, headers, config) {
          $scope.setImgCaptcha();
          $scope.setImgCaptchaForPhone();
        });
      frontView = $ionicHistory.viewHistory().backView;
      var u = navigator.userAgent;
      if(u.toLowerCase().match(/MicroMessenger/i) == "micromessenger"){
          // $rootScope.thirdFrontView=frontView.stateName;

          //$state.go('newUserLogin');
          //$scope.url=encodeURIComponent('http://mobiletest.ehaier.com:38080/www/#/login/newUserLogin')
          //document.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb9b3b8793f9c3d7a&redirect_uri="+$scope.url+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"

          $scope.urlbase=$location.absUrl();
          if($scope.urlbase.indexOf('code')>0){
              $scope.codeString=$scope.urlbase.substring($scope.urlbase.indexOf('code'),$scope.urlbase.indexOf('&'));
              $scope.getCode=$scope.codeString.substring(5);
              newUserLoginService.findStatus($scope.getCode)
                .success(function(res){
                  if(res.success){
                    if(res.data.unionid){
                      $scope.userData=res.data;
                      if($scope.userData.isBinded==1){
                        var userList=$localstorage.get('backfront');
                        if (userList) {
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
                        }
                      } else {
                        $scope.url=encodeURIComponent(UrlService.getThirdUrl('www/#/login/newUserLogin'))
                        // $scope.url=encodeURIComponent('http://mobiletest.ehaier.com:38081/www/#/login/newUserLogin')
                        document.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb03a523baf487993&redirect_uri="+$scope.url+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
                      }
                    }
                  }
                });
          } else {
              var string=JSON.stringify(frontView)
              $localstorage.set('backfront',string);
              $scope.url=encodeURIComponent(UrlService.getThirdUrl('www/index.html#/login'))
              // $scope.url=encodeURIComponent('http://mobiletest.ehaier.com:38081/www/index.html#/login')
              document.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb03a523baf487993&redirect_uri="+$scope.url+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
          }
        }
    });
  }
]);


/**
 * creater:shuang2.wang@dhc.com.cn
 * create time:2016-03-22
 * describe：登录Service
 **/
APP.service('LoginService', ['$http', 'UrlService', '$localstorage', function ($http, UrlService, $localstorage) {
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
  this.getLoginCaptcha = function () { //登录页获取图片验证码
    return UrlService.getUrl('GET_LOGIN_CAPTCHA');
  };
  //快速登录 获取短信验证码
  this.fastLoginCaptcha = function (mobile, captcha, showCaptcha) {
    if (showCaptcha) {
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
    } else {
      params = {
        mobile: mobile
      };
      return $http.get(UrlService.getUrl('FAST_LOGIN_CAPTCHA'), params);
    }
  };
  //快速登录 获取短信验证码
  this.fastLogin = function (mobile, captcha) {
    var params = {
      mobile: mobile,
      captcha: captcha
    };
    return $http.post(UrlService.getUrl('FAST_LOGIN')+'?mobile=' + params.mobile + '&captcha=' + params.captcha);
  };
}]);
