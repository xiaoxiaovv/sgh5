/**
 * creater:shuang2.wang@dhc.com.cn
 * create time:2016/3/22
 * describe：注册控制器
 **/
APP.controller('RegisterController', ['$rootScope','$localstorage','$scope', '$http', 'RegisterService', 'PopupService', '$interval', '$state', 'LoginService',
  'UserService', 'ShopService', '$ionicPopup', 'AccountMessageService', '$ionicLoading', '$timeout', '$ionicHistory', '$stateParams', 'IMService', 'UrlService','GetStatisticInfoService','InAppBrowserService',
  function ($rootScope,$localstorage,$scope, $http, RegisterService, PopupService, $interval, $state, LoginService, UserService, ShopService,
            $ionicPopup, AccountMessageService, $ionicLoading, $timeout, $ionicHistory, $stateParams, IMService, UrlService,GetStatisticInfoService,InAppBrowserService) {

    /** 变量声明 **/
    $scope.eyeIndex = 0; //是否显示密码
    $scope.xychecked = false;//是否同意用户协议
    $scope.loginIndex = 0; //登录方式下标
    $scope.showVC = false; //是否是 短信验证码 登录
    $scope.canGetVcode = true; //是否可以点击获取验证码
    $scope.VCodeTips = '获取验证码'; //是否可以点击获取验证码
    $scope.eyeArr = [$rootScope.imgBaseURL+'img/eye_close@2x.png', $rootScope.imgBaseURL+'img/eye_open@2x.png']; //显示密码数组
    $scope.pwdArr = ['password', 'text']; //显示密码类型
    $scope.loginTypeArr = ['短信验证码登录', '账号密码登录'];
    $scope.captchaFlag = true;//获取验证码按钮样式
    $scope.isClearText = false;//密码明文显示
    $scope.isClearPassword = 'password';
    $scope.paracont = '获取验证码';
    $scope.iconImage = $rootScope.imgBaseURL+'img/ic_photo.png';
    $scope.showCaptcha = false;//是否展示验证码选项
    $scope.isShowsBtn = false;//是否展示验证码选项
    var hasHistory = $stateParams.hasHistory;//1之前正在浏览相关页面，0直接注册
    var frontView = $ionicHistory.viewHistory().backView;
    $scope.loginInfo = {
      userName: '',
      password: '',
      captcha: '',
      verificationCode: '' //短信验证码
    };
    $scope.VCodeStyle = {
      "color": "#2979FF"
    }
    $scope.showVCode = function () {
      $scope.showVC = !$scope.showVC;
      $scope.loginIndex = ($scope.loginIndex + 1) % 2;
    }
    $scope.getVCode = function () {
      if ($scope.canGetVcode) {
        if (!$scope.loginInfo.userName||$scope.loginInfo.userName.length == 0) {
          PopupService.showToast('请输入手机号');
        }else if(!($scope.globalConstant.mobileNumberRegExp.test($scope.loginInfo.userName))){
          PopupService.showToast('请输入正确的手机号格式');
        }else{
          LoginService.fastLoginCaptcha($scope.loginInfo.userName)
            .success(function(res){
              if(!res.data){
                PopupService.showToast(res.message);
              }else{
                $scope.canGetVcode = !$scope.canGetVcode;
                var timeCount = 60;
                $scope.timer = $interval(function () {
                  if ((timeCount - 1) < 0) {
                    $scope.VCodeTips = '获取验证码';
                    $scope.VCodeStyle = {
                      "color": "#2979FF"
                    }
                    $interval.cancel($scope.timer);
                    $scope.canGetVcode = true;
                  } else {
                    $scope.VCodeStyle = {
                      "color": "#666666"
                    }
                    timeCount--;
                    $scope.VCodeTips = '重发 ' + timeCount + 's';
                  }
                }, 1000);
              }
            })
        }
      }
    }
    $scope.toggleEye = function () {
      $scope.eyeIndex = ($scope.eyeIndex + 1) % 2;
    }
    //IOS特殊样式
    $scope.leftArrow = {};
    $scope.rightButton = {};
    if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {//只有ios app 特有的样式
      $scope.leftArrow = {'margin-top': '36px'};
      $scope.rightButton = {'top': '36px'};
    }

    $scope.promotionCode = $stateParams.promotionCode;
    $scope.isShowLogin = false;
    $scope.switch = function () {
      if (!$scope.isShowLogin) {
        $scope.setLoginImgCaptcha();
      } else {
        $scope.setImgCatpcha();
      }
      if ($scope.promotionCode) {//不是分享开店的不走 注册页面的 登录，
        $scope.isShowLogin = !$scope.isShowLogin;
      } else {
        $state.go('login');
      }
    };

    //用户注册所需信息
    $scope.userInfo = {
      mobileNum: '',
      password: '',
      captcha: '',
      captchaImg: ''
    };
    //设置金币雨下落、佣金、提现通知的标志
    function setSwitchFun(memberId) {
      var myId = memberId;
      if (localStorage.getItem('setSwitch')) {
        var switchArr = JSON.parse(localStorage.getItem('setSwitch'));
        console.log(switchArr);
        var isExist = false;
        for (var i = switchArr.length - 1; i >= 0; i--) {
          if (switchArr[i].id == myId) {
            $rootScope.isCommission = switchArr[i].list[0].checked;
            $rootScope.cashSwitch = switchArr[i].list[1].checked;
            $rootScope.goldRainSwitch = switchArr[i].list[2].checked;
            console.log($rootScope.isCommission);
            isExist = true;
            return;
          }
        }
        if (!isExist) {
          $rootScope.isCommission = true;
          $rootScope.cashSwitch = true;
          $rootScope.goldRainSwitch = true;
          var nowMemberSwitch = {
            id: myId,
            list: [{
                name: '佣金',
                checked: true
              },
              {
                name: '提现通知',
                checked: true
              },
              {
                name: '金币雨',
                checked: true
              }
            ]
          }
          switchArr.push(nowMemberSwitch);
          localStorage.setItem('setSwitch', JSON.stringify(switchArr));
        }
      } else {
        var arr = [{
          id: myId,
          list: [{
              name: '佣金',
              checked: true
            },
            {
              name: '提现通知',
              checked: true
            },
            {
              name: '金币雨',
              checked: true
            }
          ]
        }];
        localStorage.setItem('setSwitch', JSON.stringify(arr));
        $rootScope.isCommission = true;
        $rootScope.cashSwitch = true;
        $rootScope.goldRainSwitch = true;
      }
    }


    //登录
    $scope.loginInRegister = function () {
      if ($scope.loginIndex == 1) { //快速登录
        if ($scope.loginInfo.userName.length == 0) {
          PopupService.showToast('请输入手机号');
        } else if (!($scope.globalConstant.mobileNumberRegExp.test($scope.loginInfo.userName))) {
          PopupService.showToast('请输入正确的手机号格式');
        } else if ($scope.loginInfo.verificationCode.length == 0) {
          PopupService.showToast('请输入短信验证码');
        } else if ($scope.loginInfo.verificationCode.length > 0 && $scope.loginInfo.verificationCode.length < 6 || $scope.loginInfo.verificationCode.length > 6) {
          PopupService.showToast('短信验证码长度必须是6位');
        } else {
          LoginService.fastLogin($scope.loginInfo.userName, $scope.loginInfo.verificationCode)
            .success(function (response) {
              if (response.data) {
                var memberId = response.data.mid;
                setSwitchFun(memberId);
                $rootScope.loginMemberId = response.data.mid;
                UserService.setUser(response.data);
                IMService.initWebSocket();
                $rootScope.userCount = $scope.loginInfo.mobile;
                $rootScope.password = "";
                window.localStorage.setItem('isLogin', UserService.isUserLogin());
                PopupService.showToast('登录成功');
                if(response.data.sessionValue){
                  $localstorage.set('sg_login_token_secret','Bearer'+response.data.sessionValue);//把token存到本地
                }else{
                  $localstorage.set('sg_login_token_secret','Bearer'+ GetStatisticInfoService.generateUUID());
                }
                if (!frontView || frontView.stateName == 'guidePage' || frontView.stateName == 'register' || frontView.stateName == 'changePassword' || frontView.stateName == 'myPhoneBindSuccess') {
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
      if ($scope.loginInfo.userName.length == 0) {
        PopupService.showToast('请输入用户名');
      } else if ($scope.loginInfo.password.length == 0) {
        PopupService.showToast('密码为数字、字母、特殊符号中的两种组合，长度6位~20位(字母区分大小写)');
      } else if ($scope.loginInfo.captcha.length == 0 && $scope.showCaptcha == true) {
        PopupService.showToast('请输入验证码');
      } else {
        LoginService.loginUserInfoCAPTCHA($scope.loginInfo.userName, $scope.loginInfo.password, $scope.loginInfo.captcha)
          .success(function (response) {
            if (response.success) {
              var memberId = response.data.mid;
                setSwitchFun(memberId);
                $rootScope.loginMemberId = response.data.mid;
                UserService.setUser(response.data);
                 IMService.initWebSocket();
                $rootScope.userCount = $scope.loginInfo.userName;
                $rootScope.password = $scope.loginInfo.password;
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

                // 判断是否绑定过手机号
                RegisterService.wdApply()
                  .success(function (response) {
                    if (response.success) {
                      if (response.data) { //绑定过手机
                        if (!frontView || frontView.stateName == 'guidePage' || frontView.stateName == 'register' || frontView.stateName == 'changePassword' || frontView.stateName == 'myPhoneBindSuccess') {
                          $rootScope.loginGoNum = 0;
                          $state.go('newHome');
                        } else {
                          $ionicHistory.goBack(-1);
                          $rootScope.loginGoNum = 1;
                        }
                      } else { //没绑定过手机
                        $state.go('RegisterForStoreLogin', {
                          hasHistory: 1
                        }); //去绑定手机号  hasHistory
                      }
                    } else { //接口异常
                      PopupService.showToast('服务端错误');
                    }
                  });

                LoginService.checkOpenStore(memberId).success(function (response) {
                  if (!response.data) {
                    $localstorage.set('storeId', 20219251);
                  } else {
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
                PopupService.showToast(response.message);
                if (response.data == -1) {
                  $scope.showCaptcha = true;
                }
                $scope.setImgCaptcha();
              } else {
                PopupService.showToast('登录失败');
              }
            });
        }
      }
    };

    /** 方法 **/
    //发送图片验证码
    $scope.setImgCatpcha = function () {
      $scope.identifyCodeImg = RegisterService.getImgCaptcha() + "?rnd=" + Math.random()+"&flag="+$localstorage.get('sg_login_token_secret').substring(6);
    };
    $scope.setLoginImgCaptcha = function () {
      $scope.loginIdentifyCodeImg = LoginService.getLoginCaptcha() + "?rnd=" + Math.random()+"&flag="+$localstorage.get('sg_login_token_secret').substring(6);
    };
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

    var timePromise = undefined;
    //获取短信验证码
    $scope.getIdentifyCode = function () {
      if (!$scope.captchaFlag) { //不到60秒 不发请求
        return;
      }

      if (!($scope.globalConstant.mobileNumberRegExp.test($scope.userInfo.mobileNum))) {
        PopupService.showToast('请输入正确的手机号码！');
      } else if ($scope.userInfo.captchaImg.length == 0) {
        PopupService.showToast('请输入验证码！');
      } else {
        RegisterService.getCaptcha($scope.userInfo.mobileNum, $scope.userInfo.captchaImg)
          .success(function (response) {
            if (response.success) {
              /* $scope.paracont = "获取验证码";
               $scope.captchaFlag = true;*/
              var second = 60;
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
            } else if (response.errorCode == '1102') {
            //  PopupService.showToast('手机号已注册，请用会员名登录，会员名为：' + $scope.userInfo.mobileNum);
                PopupService.showToast('该手机号已经注册过顺逛用户，请直接登录。');
            } else if (response.message) {
              PopupService.showToast(response.message);
            } else {
              PopupService.showToast('获取验证码失败！');
            }
          });
      }
    };

    //注册 下一步
    $scope.registerUserInfo = function () {

      var reg = $scope.globalConstant.passwordRegExp;
      if (!($scope.globalConstant.mobileNumberRegExp.test($scope.userInfo.mobileNum))) {
        PopupService.showToast('请输入正确的手机号！');
      } else if ($scope.userInfo.password.length==0) {
        PopupService.showToast('请输入密码！');
      } else if(!(reg.test($scope.userInfo.password))){
        PopupService.showToast('密码不符合规则！');
      }else if ($scope.userInfo.captcha.length == 0) {
        PopupService.showToast('请输入短信验证码！');
      } else if ($scope.xychecked == false) {
        PopupService.showToast('请选择同意《顺逛微店注册协议》及《快捷通服务协议》！');
      }else {
         RegisterService.newAddRegisterUserInfo($scope.userInfo.mobileNum, $scope.userInfo.captcha, $scope.userInfo.password, $scope.userInfo.captchaImg)
         .success(function (response) {
             if (response.success) {
             if(response.data.isCanRegister){ //注册成功
                 var register_obj={
                   "mobileNum":$scope.userInfo.mobileNum,
                   "password": $scope.userInfo.password,
                   "captcha": $scope.userInfo.captcha,
                   "imgCaptcha": $scope.userInfo.captchaImg
                 };
                $localstorage.setObject('register_obj',register_obj);
                 $timeout(function () {
                   $state.go('newAuthenticationHome',{promotionCode: $scope.promotionCode,types:100});
                 },0);
             }else{
             console.log('原因是'+response.data.message)
             }

             }else{
             PopupService.showToast(response.message);
             }
         // else if (response.message == '该手机已被注册！') {
         //   PopupService.showToast('手机号已注册，请用会员名登录，会员名为：' + $scope.userInfo.mobileNum);
         // } else if (response.message) {
         //   PopupService.showToast(response.message);
         //   $scope.setImgCatpcha();
         // } else {
         //   PopupService.showToast('注册失败！');
         // }
         });
      }
    };

    //修改头像
    $scope.setHeaderImg = function () {
      return;
      if (!!window.cordova) {
        var options = {
          title: '照片选取方式：',
          buttonLabels: ['拍照', '从相册选取'],
          addCancelButtonWithLabel: '取消',
          androidEnableCancelButton: true
        };
        var callback = function (buttonIndex) {
          if (buttonIndex == 1) {
            navigator.camera.getPicture(getSuccess, getFail, {
              quality: 50,
              destinationType: Camera.DestinationType.FILE_URI,
              allowEdit: true,
              targetWidth: 168,
              targetHeight: 168,
              saveToPhotoAlbum: true
            });
            function getSuccess(imageData) {
              $scope.iconImage = imageData;
              $timeout(function () {
                  $scope.iconImage = imageData;
                }, 200
              );
              //调用图片上传接口
              var win = function (r) {
                $ionicLoading.hide();
                PopupService.showToast('上传成功');
                var resp = JSON.parse(r.response);
                $scope.iconImage = resp.data.iconImageFileId;
              };
              var fail = function (error) {
                $ionicLoading.hide();
                PopupService.showToast('上传失败');
              };
              var options = new FileUploadOptions();
              options.fileKey = 'imageFile';
              options.fileName = $scope.iconImage.substr($scope.iconImage.lastIndexOf('/') + 1);
              options.mimeType = 'image/jpeg';
              var params = {};
              //params.userName = $scope.accountMessage;
              options.params = params;
              var ft = new FileTransfer();
              ft.upload($scope.iconImage, encodeURI(AccountMessageService.uploadImage()), win, fail, options);
              var par = {
                template: '<div><img ng-src="{{imgBaseURL}}img/ic_refresh_01.gif" style="width: 65px;"/></div>'
              };
              $ionicLoading.show(par);
            }

            function getFail(message) {

            }
          } else if (buttonIndex == 2) {
            console.log('从相册中获取');
            navigator.camera.getPicture(getSuccessTwo, getFailTwo, {
              quality: 50,
              destinationType: Camera.DestinationType.FILE_URI,
              sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
              allowEdit: true,
              targetWidth: 168,
              targetHeight: 168
            });
            function getSuccessTwo(imageURI) {
              $scope.iconImage = imageURI;
              $timeout(function () {
                  $scope.iconImage = imageURI;
                }, 200
              );
              //调用图片上传接口
              var win = function (r) {
                PopupService.showToast('上传成功');
                $ionicLoading.hide();
                var resp = JSON.parse(r.response);
                $scope.iconImage = resp.data.iconImageFileId;
              };
              var fail = function (error) {
                PopupService.showToast('上传失败');
                $ionicLoading.hide();
              };
              var options = new FileUploadOptions();
              options.fileKey = 'imageFile';
              options.fileName = $scope.iconImage.substr($scope.iconImage.lastIndexOf('/') + 1);
              options.mimeType = 'image/jpeg';
              var params = {};
              // params.userName = $scope.accountMessage;
              options.params = params;
              var ft = new FileTransfer();
              ft.upload($scope.iconImage, encodeURI(AccountMessageService.uploadImage()), win, fail, options);
              var par = {
                template: '<div><img ng-src="{{imgBaseURL}}img/ic_refresh_01.gif" style="width: 65px;"/></div>'
              };
              $ionicLoading.show(par);
            }

            function getFailTwo(message) {

            }
          }
        };
        window.plugins.actionsheet.show(options, callback);
        $timeout(function () {
          window.plugins.actionsheet.hide();
        }, 5000);
      } else {
        $ionicPopup.alert({
          template: '请下载客户端实现更换头像功能',
          okText: '知道了'
        });
      }
    };

    $scope.goBack = function(){
      $ionicHistory.goBack();
    };

    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.showCaptcha = false;
      LoginService.checkLogin()
        .success(function (response, status, headers, config) {
          $scope.setImgCatpcha();
        });
      hasHistory = $stateParams.hasHistory;
      $scope.promotionCode = $stateParams.promotionCode;
      var frontView = $ionicHistory.viewHistory().backView;
    })
    //打开协议详情
    $scope.toRegisterRules = function(ruleId,content){
    var u = navigator.userAgent;
    if (u.indexOf('iPhone') != -1) {
      var ref = InAppBrowserService.open(UrlService.getHead() + 'mstore/sg/helpDetail.html?id=' + ruleId,content);
    } else {
      $state.go('helpDetail', {'helpId': ruleId, 'content': content});
    }
  };
  //是否同意协议
  $scope.selectedChanged = function(checked){
        $scope.xychecked = checked;
  }
  }]);


/**
 * creater:shuang2.wang@dhc.com.cn
 * create time:2016-03-22
 * describe：注册Service
 **/
APP.service('RegisterService', ['$http', 'UrlService', function ($http, UrlService) {
  //注册
  this.addRegisterUserInfo = function (mobileNum, captcha, password, imgCaptcha) {
    var params = {
      mobileNum: mobileNum,
      captcha: captcha,
      password: password,
      imgCaptcha: imgCaptcha
    };
    var header = {
      'Authorization': 'open the gate'
    };
    return $http({
      method: 'POST',
      url: UrlService.getUrl('REGISTERS'),
      headers: header,
      params: params
    });
  };
  this.newAddRegisterUserInfo = function (mobileNum, captcha, password, imgCaptcha) {
    var params = {
      mobileNum: mobileNum,
      captcha: captcha,
      password: encodeURIComponent(password),
      imgCaptcha: imgCaptcha
    };
    var header = {
      'Authorization': 'open the gate'
    };
    return $http({
      method: 'POST',
      url: UrlService.getUrl('REGISTERS_NEW'),
      headers: header,
      params: params
    });
  };
  //获取短信验证码
  this.getCaptcha = function (mobileNum, imgCaptcha) {
    var params = {
      mobileNum: mobileNum,
      captcha: imgCaptcha
    };
    return $http.get(UrlService.getUrl('GET_CAPTCHA'), params);
  };
  //获取图片验证码
  this.getImgCaptcha = function () {
    return UrlService.getUrl('GET_IMG_CAPTCHA');
  };
  //第三方开店 绑定手机号
  this.bindMobile = function (mobileNum, captcha, password, imgCaptcha) {


    var params = {
      mobileNum: mobileNum,
      captcha: captcha,
      password: encodeURIComponent(assword),
      imgCaptcha: imgCaptcha,
      isNew:1
    };
    var header = {
      'Authorization': 'open the gate'
    };
    return $http({
      method: 'POST',
      url: UrlService.getUrl('BIND_MOBILE'),
      params: params
    });

  };

  this.wdApply = function () {
    return $http.get(UrlService.getUrl('WD_APPLY'));
  }

}]);
