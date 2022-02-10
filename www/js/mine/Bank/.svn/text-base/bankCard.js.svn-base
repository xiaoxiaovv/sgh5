APP.controller('BankCardController',['$localstorage','$scope','HomePageService','$ionicHistory','InAppBrowserService','UrlService','$state','bankCardService','$ionicScrollDelegate','EasyConnectService',function($localstorage,$scope,HomePageService,$ionicHistory,InAppBrowserService,UrlService,$state,bankCardService,$ionicScrollDelegate,EasyConnectService){
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
  $scope.goBack = function() {
    if($ionicHistory.viewHistory().backView == null){
      $state.go('personnalCenter');
    }else if($ionicHistory.viewHistory().backView.stateName == 'shopRevenue' || $ionicHistory.viewHistory().backView.stateName == 'paymentxyz'){
      $ionicHistory.goBack();
    }else{
      $state.go('personnalCenter');
    }
  };

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

  $scope.clickBind = function () {

    // 支持浏览器
    if(!window.device)
    {
      window.open(UrlService.getUrl('KBIND_INIT')+'?flag='+$localstorage.get('sg_login_token_secret').substring(6), '_self', 'location=yes');
      return;
    }

    EasyConnectService.bind()
      .success(function (response, status, headers, config) {

        if(window.device && window.device.hasNewBrowser){//新

          var isAndroid = ionic.Platform.isAndroid();
          if (isAndroid) {
            var ref = InAppBrowserService.open(UrlService.getUrl('KBIND_INIT')+'?flag='+$localstorage.get('sg_login_token_secret').substring(6));
            ref.addEventListener('exit', function (event) {
              $scope.init();
            });
          }else
          {
            var ref = InAppBrowserService.open(UrlService.getUrl('KBIND_INIT')+'?flag='+$localstorage.get('sg_login_token_secret').substring(6));
            ref.addEventListener('exit', function (event) {
              $scope.init();
            });
          }


        }else{//老
          var isAndroid = ionic.Platform.isAndroid();
          if (isAndroid) {
            var ref_bind_android = cordova.InAppBrowser.open(UrlService.getUrl('KBIND_INIT')+'?flag='+$localstorage.get('sg_login_token_secret').substring(6), '_blank');
            ref_bind_android.addEventListener('loadstop', function (event) {
              if (event.url.indexOf('https://m.kjtpay.com/bindmember/registerandbind') > -1) {
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
                  ref_bind_android.executeScript({
                    code: d
                  }, function () {});
                }, 2000);
              }
            });
            ref_bind_android.addEventListener('loadstart', function (event) {
              if (event.url.indexOf('close=true') > -1||event.url.indexOf("mstore") > -1) {
                ref_bind_android.close();
              }
            });
            ref_bind_android.addEventListener('exit', function (event) {
              $scope.init();
            });
          }else
          {
            var ref = InAppBrowserService.open(UrlService.getUrl('KBIND_INIT')+'?flag='+$localstorage.get('sg_login_token_secret').substring(6));
            ref.addEventListener('exit', function (event) {
              $scope.init();
            });
          }
        }
      });
  };

  $scope.init = function(){
    HomePageService.isWdHost()
      .success(function (res) {
        if(res.data.o2o == null || res.data.o2o == true){
          $scope.iso2o = true;
        }else{
          $scope.iso2o = false;
        }

      });
    bankCardService.doInit().success(function(response){
      if(response.success){
        if(response.data.isBindKJT == 0){
          $scope.isBindKjt = true;
        }else {
          $scope.isBindKjt = false;
        }
        if(response.data.isBindYHK == 0){
          $scope.isBindBank = true;
        }else {
          $scope.isBindBank = false;
        }
        $scope.hasBindKJT = response.data.isBindKJT;
        $scope.hasBindYHK = response.data.isBindYHK;
        $scope.backGroundOrImg = response.data.BankCardList;
        $scope.backGroundOrKjt = response.data.kjtAccount;
      }
    })
  }

  $scope.$on('$ionicView.beforeEnter',function(){
    $ionicScrollDelegate.scrollTop();
    $scope.backGroundOrKjt = '';
    $scope.backGroundOrImg = '';
    $scope.isBindKjt = false;
    $scope.isBindBank = false;
    $scope.init();
  });
}])

APP.service('bankCardService', ['$http', 'UrlService', function ($http, UrlService) {
  //银行卡初始化
  this.doInit = function () {
    return $http.get(UrlService.getUrl('HAS_BANK_LIST_NEW'));
  };
}]);
APP.service('EasyConnectService', ['$http', 'UrlService', function ($http, UrlService) {

  //获取绑定信息
  this.getMessage = function () {
    return $http.get(UrlService.getUrl('EASYCONNECT_INIT'));
  };

  //解除绑定
  this.unBlind = function () {
    /* return $http.get(UrlService.getUrl('KUNBIND_INIT'));*/
    return $http.get(UrlService.getUrl('KUNBIND_INIT'));
  };

  //设置绑定
  this.bind = function () {
    /* return $http.get(UrlService.getUrl('KBIND_INIT'));*/
    return $http.get(UrlService.getUrl('KBIND_INIT'));
  };

}]);
