APP.controller('bankCardDetailController', ['$localstorage', '$scope', '$ionicHistory', '$ionicPopup', '$ionicScrollDelegate', '$stateParams', 'bankCardDetialService', '$state', 'UrlService', 'EasyConnectService', 'InAppBrowserService', 'PopupService','$interval', function($localstorage, $scope, $ionicHistory, $ionicPopup, $ionicScrollDelegate, $stateParams, bankCardDetialService, $state, UrlService, EasyConnectService, InAppBrowserService, PopupService,$interval) {
  if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) { //只有ios app 特有的样式
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
  $scope.goBack = function() {
    $state.go('bankCard');
  };

  var cardNoShow = '';
  $scope.nameKjt = '';
  $scope.isKJT = false;

  $scope.backGroundOrPic={
          "03020000": {
            "img":'1CITIC',
            "background":'#F3515E',
            "name":'中信银行'
          },
          "01030000": {
            "img":'2ABC',
            "background":'#47D08F',
            "name":'农业银行'
          },
          "01020000": {
            "img":'3ICBC',
            "background":'#F3515E',
            "name":'工商银行'
          },
          "01050000": {
            "img":'4CCB',
            "background":'#39A8FF',
            "name":'建设银行'
          },
          "03080000": {
            "img":'5CMB',
            "background":'#F3515E',
            "name":'招商银行'
          },
          "03180000": {
            "img":'6SZPAB',
            "background":'#FF8F24',
            "name":'平安银行'
          },
          "01040000": {
            "img":'7BOC',
            "background":'#F3515E',
            "name":'中国银行'
          },
          "03090000": {
            "img":'8CIB',
            "background":'#39A8FF',
            "name":'兴业银行'
          },
          "03100000": {
            "img":'9SPDB',
            "background":'#39A8FF',
            "name":'浦发银行'
          },
          "03050000": {
            "img":'10CMBC',
            "background":'#47D08F',
            "name":'民生银行'
          },
          "03040000": {
            "img":'11HXB',
            "background":'#F3515E',
            "name":'华夏银行'
          },
          "03030000": {
            "img":'12CEB',
            "background":'#BF70D7',
            "name":'光大银行'
          },
          "01000000": {
            "img":'13PSBC',
            "background":'#47D08F',
            "name":'邮储银行'
          },
          "03010000": {
            "img":'14COMM',
            "background":'#39A8FF',
            "name":'交通银行'
          },
          "04031000": {
            "img":'15BCCB',
            "background":'#F3515E',
            "name":'北京银行'
          },
          "03060000": {
            "img":'16GDB',
            "background":'#F3515E',
            "name":'广发银行'
          },
          "03110000": {
            "img":'17EGBANK',
            "background":'#FF8F24',
            "name":'恒丰银行'
          },
          "04233310": {
            "img":'18HCCB',
            "background":'#39A8FF',
            "name":'杭州银行'
          },
          "04083320": {
            "img":'19NBCB',
            "background":'#FF8F24',
            "name":'宁波银行'
          },
          "88888888": {
            "img":'20KJT',
            "background":'#39A8FF',
            "name":'快捷通'
          }
    }

  $scope.VCodeTips = '获取验证码'; //是否可以点击获取验证码
  $scope.canGetVcode = true; //是否可以点击获取验证码
  //解绑银行卡所需信息
  $scope.userInfo = {
    verificationCode: '' //短信验证码
  };

  $scope.getVCode = function() {
    if($scope.canGetVcode){
      bankCardDetialService.fastLoginCaptchaNew(cardNoShow)
        .success(function(res) {
          if (!res.success) {
            PopupService.showToast(res.message);
          } else {
            PopupService.showToast("您正在操作解绑银行卡，短信验证码已经发送到您绑定银行卡时的预留银行手机号" + $scope.bankCardDetailList.phoneNo + "中，请查收并进行验证。");
            $scope.canGetVcode = !$scope.canGetVcode;
            var timeCount = 60;
            $scope.timer = $interval(function() {
              if ((timeCount - 1) < 0) {
                $scope.VCodeTips = '获取验证码';
                $interval.cancel($scope.timer);
                $scope.canGetVcode = true;
              } else {
                timeCount--;
                $scope.VCodeTips = timeCount + 's' + '后可重发 ';
              }
            }, 1000);
          }
        });
    }
  };

  //解除银行绑定
  $scope.unBindBank = function() {
    if ($scope.userInfo.verificationCode.length <= 0) {
      PopupService.showToast('请输入短信验证码');
    } else {
      var confirmPopup = $ionicPopup.confirm({
        template: '确认解除绑定该银行卡?',
        cancelText: '否',
        cssClass: 'confirmDelete',
        okText: '是'
      });
      confirmPopup.then(function(res) {
        if (res) {
          bankCardDetialService.deleteBank(cardNoShow, $scope.userInfo.verificationCode).success(function(response) {
            if (response.success) {
              PopupService.showToast('您的银行卡已经解绑成功！');
              setTimeout(function(){
                $state.go('bankCard');
              },2000);
            }else{
              PopupService.showToast(response.message);
            }
          })
        } else {
        }
      });
    }
  }
  $scope.clickUnBind = function() {

    //支持浏览器
    if(!window.device)
    {
      window.open(UrlService.getUrl('KUNBIND_INIT')+'?flag='+$localstorage.get('sg_login_token_secret').substring(6), '_self', 'location=yes');
      return;
    }

    EasyConnectService.unBlind()
      .success(function (response, status, headers, config) {
        //$state.go('easyConnectIframe', {'content': 'http://m.ehaier.com/v2/kjt/sg/kjtAccountUnbind.html'});

        var isAndroid = ionic.Platform.isAndroid();
        if(window.device && window.device.hasNewBrowser){//新版本

          if (isAndroid) {
            var ref = InAppBrowserService.open(UrlService.getUrl('KUNBIND_INIT')+'?flag='+$localstorage.get('sg_login_token_secret').substring(6));
            ref.addEventListener('exit', function (event) {
              $state.go('bankCard');
            });

          } else {


            var ref = InAppBrowserService.open(UrlService.getUrl('KUNBIND_INIT')+'?flag='+$localstorage.get('sg_login_token_secret').substring(6));
            ref.addEventListener('exit', function (event) {
              $state.go('bankCard');
            });
          }
        }
        else{//老版本

          var isAndroid = ionic.Platform.isAndroid();
          if (isAndroid) {
            var ref_unBind_android = cordova.InAppBrowser.open(UrlService.getUrl('KUNBIND_INIT')+'?flag='+$localstorage.get('sg_login_token_secret').substring(6), '_blank');
            ref_unBind_android.addEventListener('loadstop', function (event) {
              if (event.url.indexOf('https://m.kjtpay.com/bindmember/cancelBind') > -1) {
                $timeout(function () {
                  var d = "var r= document.getElementsByTagName('div');" +
                    "var newDiv  = document.createElement('span');" +
                    "newDiv.style.width = '44px';" +
                    "newDiv.style.height = '44px';" +
                    "newDiv.style.background = 'transparent';" +
                    "newDiv.style.zIndex = '999';" +
                    "r[0].appendChild(newDiv);" +
                    "newDiv.style.top = '0px';" +
                    "newDiv.style.left = '0px';" +
                    "newDiv.style.position = 'absolute';" +
                    "newDiv.onclick = function(){window.location.href = window.location.href+'&close=true';};";
                  ref_unBind_android.executeScript({
                    code: d
                  }, function () {});
                }, 2000);
              }
            });
            ref_unBind_android.addEventListener('loadstart', function (event) {
              if (event.url.indexOf('close=true') > -1||event.url.indexOf("mstore") > -1) {
                ref_unBind_android.close();
              }
            });
            ref_unBind_android.addEventListener('exit', function (event) {
              $state.go('bankCard');
            });
          } else {
            var ref = InAppBrowserService.open(UrlService.getUrl('KUNBIND_INIT')+'?flag='+$localstorage.get('sg_login_token_secret').substring(6));
            ref.addEventListener('exit', function (event) {
              $state.go('bankCard');
            });
          }

        }

      });
  };
  // 详情初始化
  $scope.init = function(){
    bankCardDetialService.doInit(cardNoShow).success(function(response){
      if(response.success){
        $scope.bankCardDetailList = response.data;
      }
    })
  }

  $scope.$on('$ionicView.beforeEnter',function(){
    $ionicScrollDelegate.scrollTop();
    cardNoShow = '';
    $scope.nameKjt = '';
    $scope.bankCardDetailList;
    cardNoShow = $stateParams.cardNoShow;
    $scope.nameKjt = $stateParams.nameKjt;
    if($scope.nameKjt != ''){
      $scope.isKJT = true;
      $scope.bankCardDetailList = cardNoShow;
    }else{
        $scope.isKJT = false;
        $scope.init();
    }
  });

}])


APP.service('bankCardDetialService', ['$http', 'UrlService', function ($http, UrlService) {
  //银行卡详情
  this.doInit = function (cardNoShow) {
    var params = {
      cardNo:cardNoShow
    };
    return $http.get(UrlService.getUrl('BANK_LIST_DETAIL_NEW'), params);
  };
  //解绑银行卡
  this.deleteBank = function(cardNoShow, captcha) {
    var params = {
      cardNo: cardNoShow,
      captcha: captcha
    };
    return $http.get(UrlService.getUrl('BANK_DELETE_NEW'), params);
  };
  //解绑银行卡获取验证码
  this.fastLoginCaptchaNew = function(cardNoShow) {
    var params = {
      cardNo: cardNoShow
    };
    return $http.get(UrlService.getUrl('BANK_DELETE_CAPTCHA'), params);
  };
}]);
