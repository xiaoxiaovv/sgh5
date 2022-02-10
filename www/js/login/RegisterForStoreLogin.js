/**
 * Created by lenovo on 2017-8-18.
 */

APP.controller('RegisterForStoreLoginController', ['$localstorage','$rootScope','$scope', 'RegisterService', 'PopupService', '$interval', '$state', 'LoginService',
  'UserService', 'ShopService', '$ionicPopup', 'AccountMessageService', '$ionicLoading', '$timeout', '$ionicHistory', '$stateParams','InAppBrowserService','UrlService',
  function ($localstorage,$rootScope,$scope, RegisterService, PopupService, $interval, $state, LoginService, UserService, ShopService,
            $ionicPopup, AccountMessageService, $ionicLoading, $timeout, $ionicHistory, $stateParams,InAppBrowserService,UrlService) {

    /** 变量声明 **/
    $scope.captchaFlag = true;//获取验证码按钮样式
    $scope.isAgreeConsent = false;//同意用户协议
    $scope.isClearText = false;//密码明文显示
    $scope.isClearPassword = 'password';
    $scope.paracont = '获取验证码';
    $scope.iconImage = $rootScope.imgBaseURL+'img/ic_photo.png';
    var hasHistory = $stateParams.hasHistory;//1之前正在浏览相关页面，0直接注册

    //用户注册所需信息
    $scope.userInfo = {
      mobileNum: '',
      password: '',
      captcha: '',
      captchaImg: ''
    };

    /** 方法 **/
    //发送图片验证码
    $scope.setImgCatpcha = function () {
      $scope.identifyCodeImg = RegisterService.getImgCaptcha() + "?rnd=" + Math.random()+"&flag="+$localstorage.get('sg_login_token_secret').substring(6);
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
    //是否同意用户协议
    $scope.agreeConsent = function () {
      $scope.isAgreeConsent = !$scope.isAgreeConsent;
    };
    //打开协议详情
    $scope.toRegisterRules = function(ruleId,content){
      var u = navigator.userAgent;
      if (u.indexOf('iPhone') != -1) {
        var ref = InAppBrowserService.open(UrlService.getHead() + 'mstore/sg/helpDetail.html?id=' + ruleId,content);
      } else {
        $state.go('helpDetail', {'helpId': ruleId, 'content': content});
      }
    };

    var timePromise = undefined;
    //获取短信验证码
    $scope.getIdentifyCode = function () {
      if(!$scope.captchaFlag){ //不到60秒 不发请求
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
             // PopupService.showToast('手机号已注册，请用会员名登录，会员名为：' + $scope.userInfo.mobileNum);
              PopupService.showToast('亲，此手机号已注册过顺逛账户，请改用其他手机号。');
            } else if (response.message) {
              PopupService.showToast(response.message);
            } else {
              PopupService.showToast('获取验证码失败！');
            }
          });
      }
    };
    //绑定手机号
    $scope.registerUserInfo = function () {
      var reg = $scope.globalConstant.passwordRegExp;
      if (!($scope.globalConstant.mobileNumberRegExp.test($scope.userInfo.mobileNum))) {
        PopupService.showToast('请输入在正确的手机号！');
      } else if ($scope.userInfo.password.length==0) {
        PopupService.showToast('请输入密码！');
      } else if(!(reg.test($scope.userInfo.password))){
        PopupService.showToast('密码不符合规则！');
      } else if ($scope.userInfo.captcha.length == 0) {
        PopupService.showToast('请输入短信验证码！');
      } else if ($scope.isAgreeConsent) {
        PopupService.showToast('请选择同意《顺逛微店注册协议》及《快捷通服务协议》!');
      } else {
        RegisterService.bindMobile($scope.userInfo.mobileNum, $scope.userInfo.captcha, $scope.userInfo.password, $scope.userInfo.captchaImg)
          .success(function (response) {
            if (response.success) {
              if(response.data){//绑定成功

                var user = UserService.getUser();
                UserService.getUser().mobile = $scope.userInfo.mobileNum;//绑定成功后将 手机号 放入 user 本地存储中
                if ($rootScope.fromCommunity) { // 表示是从社群跳转来的
                  window.history.back(-2); // 登录成功后 返回到社群页面
                } else if ($rootScope.loginGoNum==0) {
                  $state.go('homePage');
                } else {
                  $ionicHistory.goBack(-2);
                }
                //判断是否是微店主
               /*   LoginService.checkOpenStore(memberId) //发请求查询 用户是否开过店
                  .success(function (response, status, headers, config) {
                    if (!response.data) {
                      $scope.isBuyer = 0;//不是微店主
                      LoginService.setRole($scope.isBuyer);
                      $state.go('homePage'); // 登陆成功引导页
                    } else {
                      $scope.isBuyer = 1; //微店主 判断是不是实名认证过
                      LoginService.setRole($scope.isBuyer);
                      $state.go('homePage');
                      // 是微店主 判断是否实名认证过
                      /!*   trueAuthenticationService.doInit()
                        .success(function (response) {
                          console.log(response)
                          if(response.success){
                            $scope.isNotAuthentication=response.data.isAuth; //认证状态
                            if($scope.isNotAuthentication){ // 实名认证过
                              $state.go('homePage');  // 可能是弹出框的信息不一样
                            }else{ //未认证
                              $state.go('homePage');  //可能是弹出框的信息不一样
                            }
                          }else{
                            console.log('请求实名认证接口出错')
                          }


                        });
                      *!/
                    }
                  }).error(function (res) {
                  PopupService.showToast('网络连接失败！');
                });*/

              }else{
                PopupService.showToast(response.message);return;
              }

            } else if (response.message == '该手机已被注册！') {
             // PopupService.showToast('手机号已注册，请用会员名登录，会员名为：' + $scope.userInfo.mobileNum);
              PopupService.showToast('亲，此手机号已注册过顺逛账户，请改用其他手机号。');
            } else if (response.message) {
              PopupService.showToast(response.message);
            } else {
              PopupService.showToast('注册失败！');
            }
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
              //params.userName = $scope.accountMessage;
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


    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.setImgCatpcha();
      hasHistory = $stateParams.hasHistory;
      console.log('RviewHistory:', $ionicHistory.viewHistory());
    })

  }]);

