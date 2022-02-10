APP.controller('mentionCenterController',['$rootScope','$ionicPopup','$localstorage','$scope','HomePageService','$ionicHistory','bankCardService','mentionCenterService','$stateParams','$state','ShopRevenueService','EasyConnectService','UrlService','InAppBrowserService','PopupService',function($rootScope,$ionicPopup,$localstorage,$scope,HomePageService,$ionicHistory,bankCardService,mentionCenterService,$stateParams,$state,ShopRevenueService,EasyConnectService,UrlService,InAppBrowserService,PopupService){
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
  $scope.matchValue = 0;
  $scope.account = '';
  //获取提现账户状态方法
  function getAccountState(earningType){
    ShopRevenueService.getAccountState(earningType)
      .success(function(response){
        if(response.success){
          accountState = response.data;
        }
      })
  }
  $scope.goBack = function() {
      if($ionicHistory.viewHistory().backView == null){
        $state.go('personnalCenter');
      }else{
        $ionicHistory.goBack();
      }
  };

  $scope.backGroundOrPic={
          "03020000": {
            "img":'1CITIC'
          },
          "01030000": {
            "img":'2ABC'
          },
          "01020000": {
            "img":'3ICBC'
          },
          "01050000": {
            "img":'4CCB'
          },
          "03080000": {
            "img":'5CMB'
          },
          "03180000": {
            "img":'6SZPAB'
          },
          "01040000": {
            "img":'7BOC'
          },
          "03090000": {
            "img":'8CIB'
          },
          "03100000": {
            "img":'9SPDB'
          },
          "03050000": {
            "img":'10CMBC'
          },
          "03040000": {
            "img":'11HXB'
          },
          "03030000": {
            "img":'12CEB'
          },
          "01000000": {
            "img":'13PSBC'
          },
          "03010000": {
            "img":'14COMM'
          },
          "04031000": {
            "img":'15BCCB'
          },
          "03060000": {
            "img":'16GDB'
          },
          "03110000": {
            "img":'17EGBANK'
          },
          "04233310": {
            "img":'18HCCB'
          },
          "04083320": {
            "img":'19NBCB'
          },
          "88888888": {
            "img":'20KJT'
          }
    }

  $scope.clickBank = function(index){
    $scope.matchValue = index;
  }
// 提现到快捷通
  $scope.getCashNow = function(){
    mentionCenterService.getCash($scope.backGroundOrKjt.memberKjtpayAccount,'KJT')
      .success(function (response, status, headers, config) {
        if (response.success) {
          $state.go('withdrawSuccess',{content:response.data.result});
        } else {
          if(response.message == '未实名'){
            var confirmPopup = $ionicPopup.confirm({
              template: '亲，请完成实名认证才行继续操作。',
              cancelText: '再想想',
              okText: '实名认证'
            });
            confirmPopup.then(function(res) {
              if (res) {
                $state.go('trueAuthentication',{
                  type:8
                });
              } else {
                console.log('you are close');
              }
            });
          }else{
            PopupService.showToast(response.message);
          }
        }
      })
  }
  //快捷通提现按钮点击方法
  var douleClickTwo = true;//防止短时间内重复点击
  $scope.withdraw=function(){


    if ( douleClickTwo ) {

      douleClickTwo = false;

      if(accountState == 2){
        var message='提现需要绑定快捷通，请点击确定去绑定快捷通';
        PopupService.showConfirm('',message,function(res){
          if(res){
            console.log('绑定快捷通');
            //支持浏览器
            if(!window.device)
            {
              window.open(UrlService.getUrl('KBIND_INIT')+'?flag='+$localstorage.get('sg_login_token_secret').substring(6), '_self', 'location=yes');
              return;
            }

            ShopRevenueService.bind()
              .success(function (response, status, headers, config) {
                //$state.go('easyConnectIframe', {'content': 'http://m.ehaier.com/v2/kjt/sg/kjtAccountBind.html'});

                if(window.device && window.device.hasNewBrowser){//新

                  var ref = InAppBrowserService.open(UrlService.getUrl('KBIND_INIT')+'?flag='+$localstorage.get('sg_login_token_secret').substring(6));
                  ref.addEventListener('exit', function (event) {
                    $scope.init();
                  });

                }
                else{//老
                  var isAndroid = ionic.Platform.isAndroid();
                  if (isAndroid) {
                    var ref_bind_android_shop = cordova.InAppBrowser.open(UrlService.getUrl('KBIND_INIT')+'?flag='+$localstorage.get('sg_login_token_secret').substring(6), '_blank');
                    ref_bind_android_shop.addEventListener('loadstop', function (event) {
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
                          ref_bind_android_shop.executeScript({
                            code: d
                          }, function () {});
                        }, 2000);
                      }
                    });
                    ref_bind_android_shop.addEventListener('loadstart', function (event) {
                      if (event.url.indexOf('close=true') > -1||event.url.indexOf("mstore") > -1) {
                        ref_bind_android_shop.close();
                      }
                    });
                    ref_bind_android_shop.addEventListener('exit', function (event) {
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

          }else{
            console.log('取消');
          }
        })
      }else if(accountState == 3){
        $scope.getCashNow();
      }else if(accountState == 4) {
        var message='提现需要实名认证快捷通，请点击确定去认证快捷通';
        PopupService.showConfirm('',message,function(res){
          if(res){
            if(!window.device)
            {
              window.open(UrlService.getUrl('KBIND_REALNAME')+'?flag='+$localstorage.get('sg_login_token_secret').substring(6), '_self', 'location=yes');
              return;
            }
            console.log('实名认证快捷通');
            ShopRevenueService.realName()
              .success(function (response, status, headers, config) {
                //$state.go('easyConnectIframe', {'content': 'http://m.ehaier.com/v2/kjt/sg/kjtAccountBind.html'});
                var ref = InAppBrowserService.open(UrlService.getUrl('KBIND_REALNAME')+'?flag='+$localstorage.get('sg_login_token_secret').substring(6));
                ref.addEventListener('exit', function (event) {
                  $scope.init();
                });
              });

          }else{
            console.log('取消');
          }
        })

      }else if(accountState == 1) {
        var message='提现需要激活快捷通，请点击确定去激活快捷通';
        PopupService.showConfirm('',message,function(res){
          if(res){
            if(!window.device)
            {
              window.open(UrlService.getUrl('KBIND_ACTIVATION')+'?flag='+$localstorage.get('sg_login_token_secret').substring(6), '_self', 'location=yes');
              return;
            }
            console.log('激活快捷通');
            ShopRevenueService.activation()
              .success(function (response, status, headers, config) {
                //$state.go('easyConnectIframe', {'content': 'http://m.ehaier.com/v2/kjt/sg/kjtAccountBind.html'});
                var ref = InAppBrowserService.open(UrlService.getUrl('KBIND_ACTIVATION')+'?flag='+$localstorage.get('sg_login_token_secret').substring(6));
                ref.addEventListener('exit', function (event) {
                  $scope.init();
                });
              });

          }else{
            console.log('取消');
          }
        })
      }

      setTimeout(function(){
        douleClickTwo = true;
      },2000);
    }
  };
  //绑定快捷通
  $scope.clickBind = function () {

    //支持浏览器
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
// 提现到银行卡
  var douleClickOne = true;//防止短时间内重复点击
  $scope.mentionCenterBankNow = function(){
    
    if( douleClickOne ) {

      douleClickOne = false;

      mentionCenterService.getCash($scope.backGroundOrImg.cardNoShow,'YHK')
      .success(function (response, status, headers, config) {
        if (response.success) {
          $state.go('withdrawSuccess',{content:response.data.result});
        } else {
          if(response.message == '未实名'){
            var confirmPopup = $ionicPopup.confirm({
              template: '亲，请完成实名认证才行继续操作。',
              cancelText: '再想想',
              okText: '实名认证'
            });
            confirmPopup.then(function(res) {
              if (res) {
                $state.go('trueAuthentication',{
                  type:8
                });
              } else {
                console.log('you are close');
              }
            });
          }else{
            PopupService.showToast(response.message);
          }
        }
      })
      
      setTimeout(function(){
        douleClickOne = true;
      },2000);
    }
  }

  $scope.init = function(){
    getAccountState($scope.earningType);
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
        $scope.hasBindKJT = response.data.isBindKJT;
        $scope.hasBindYHK = response.data.isBindYHK;
        $scope.backGroundOrImg = response.data.BankCardList;
        $scope.backGroundOrKjt = response.data.kjtAccount;
        if($scope.hasBindYHK&&$scope.moneyHundred){
          $scope.matchValue = 1;
        }
      }
    })
  }

  $scope.$on('$ionicView.beforeEnter',function(){
    $scope.earningType = 'B';
    $scope.account = '';
    $scope.backGroundOrImg = '';
    $scope.backGroundOrKjt = '';
    $scope.canGetMount = '';
    $scope.canGetMount = $stateParams.canAmount;
    $rootScope.canGetMount = $stateParams.canAmount;
    if(parseInt($scope.canGetMount)>0){
      $scope.moneyNoone = true;
    }else{
      $scope.moneyNoone = false;
    }
    if(parseInt($scope.canGetMount)>=1000){
      $scope.moneyHundred = true;
    }else{
      $scope.moneyHundred = false;
    }
    $scope.hasBindKJT = false;
    $scope.hasBindYHK = false;
    $scope.init();
  })
}])

APP.service('mentionCenterService', ['$http', 'UrlService', function ($http, UrlService) {
  this.getCash = function (account,type) {
    var params = {
      kjtAccount:account,
      paymentType:type
    };
    return $http.get(UrlService.getUrl('NEW_GETCASH_INIT'),params);// darcywang modified
  };
}]);



// APP.service('WithdrawCashService', ['$http', 'UrlService', function ($http, UrlService) {
//   //获取绑定信息
//   this.getMessage = function () {
//     return $http.get(UrlService.getUrl('EASYCONNECT_INIT'));
//   };
// }]);
